const ACTION_ID = 'baac2a1a-5b1f-4814-9078-fa1bd212d474'; // Action 'WebSocket Data Transfer Example'
let sbConnected = false;                                  // Track connection status to Streamer.bot WebSocket Server
let timesButtonClicked = 0;                               // Increments every time button is pressed

function decodeBase64(base64EncodedStr) {
  return atob(base64EncodedStr);
}

// Function to get boolean value from URL parameter
function getBooleanParam(paramName) {
  const params = new URLSearchParams(window.location.search);
  const paramValue = params.get(paramName);
  return paramValue === 'true'; // Convert the string to boolean
}

// Can use URL parameters to set different options
const params = new URLSearchParams(window.location.search);                                 // Get URL parameters from browser
const host = params.get('host') || '127.0.0.1';                                             // URL parameter for Streamer.bot Websocket server host, default 127.0.0.1
const port = parseInt(params.get('port')) || 8080;                                          // URL parameter for Streamer.bot Websocket server port, default 8080
const password = params.has('password') ? decodeBase64(params.get('password')) : undefined; // Base64 encoded password for Streamer.bot Websocket Server
const scheme = params.has('secure') && getBooleanParam('secure') ? 'wss' : 'ws';            // Secure set to true will use the wss scheme
const endpoint = params.get('endpoint') || '/';                                             // Websocket server endpoint
const instance = params.get('instance') || '0';                                             // Use instance to make each wheel unique

// Run action when button is pressed
document.getElementById('run-action-button').addEventListener('click', async function() {
  timesButtonClicked++;
  console.log('timesButtonClicked', timesButtonClicked);
  if (!sbConnected) {
    console.log('Streamer.bot is not connected!');
    return;
  }
  
  const response = await sbClient.doAction(
    ACTION_ID,
    { 'timesButtonClicked': timesButtonClicked },
    { customEventResponse: true }
  );
  console.log('Received data via doAction:',response);
  updateWindowWithReceivedData(response.customEventResponseArgs);
});

// When triggered from Streamer.bot
function updateWindowWithReceivedData(data) {
  console.log(`number: ${data.number}, boolean: ${data.boolean}, word: ${data.word}`);
  document.getElementById('number-value').innerHTML = data.number;
  document.getElementById('boolean-value').innerHTML = data.boolean;
  document.getElementById('word-value').innerHTML = data.word;
}

async function waitForWebsocketBroadcastJson() {
  sbClient.on('General.Custom', async (sbData) => {
    console.log('Received data via CPH.WebsocketBroadcastJson:', sbData);
    updateWindowWithReceivedData(sbData.data);
  });
}

// Update button whether connected to Streamer.bot WebSocket Server
function setConnectionStatus(connected) {
  let button = document.getElementById('run-action-button');
  if (connected) {
    button.classList.remove('not-connected');
    button.classList.add('connected');
    button.textContent = 'Run Action';
  } else {
    button.classList.remove('connected');
    button.classList.add('not-connected');
    button.innerText = 'Connecting to Streamer.bot...';
  }
}

// Streamer.bot Client Connect
const sbClient = new StreamerbotClient({
  host: host,
  port: port,
  scheme: scheme,
  endpoint: endpoint,
  password,
  onConnect: async (sbInfo) => {
    console.log(`Connected to Streamer.bot '${sbInfo.name}' on ${host}:${port}`);
    sbConnected = true;
    setConnectionStatus(sbConnected);
    await waitForWebsocketBroadcastJson();
  },
  onDisconnect: () => {
    sbConnected = false;
    setConnectionStatus(sbConnected);
  },
});
