/*
This program is licensed under the GNU General Public License Version 3 (GPLv3).

The GPLv3 is a free software license that ensures end users have the freedom to run,
study, share, and modify the software. Key provisions include:

- Copyleft: Modified versions of the software must also be licensed under the GPLv3.
- Source Code: You must provide access to the source code when distributing the software.
- Credit: You must credit the original author of the software, by mentioning either contact e-mail or their social media.
- No Warranty: The software is provided "as-is," without warranty of any kind.

For more details, see https://www.gnu.org/licenses/gpl-3.0.en.html.
*/
using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

// Do not edit anything other than UniqueClassName //
// which should match your file name               //
#if EXTERNAL_EDITOR                                //
public class WebSocketExample : CPHInlineBase
#else                                              //
public class CPHInline                             //
#endif                                             //
//-------------------------------------------------//
{
    public bool Execute()
    {
        string methodName = $"{System.Reflection.MethodBase.GetCurrentMethod().Name}: ";

        // Import arguments %number%, %boolean%, %word% from Streamer.bot UI 
        if (!CPH.TryGetArg("number", out int number))
            number = 69;

        if (!CPH.TryGetArg("boolean", out bool boolean))
            boolean = true;

        if (!CPH.TryGetArg("word", out string word))
            word = "word";

        // Build json data with Newtonsoft.Json.Linq
        JObject data = new JObject(
            new JProperty("number", number),
            new JProperty("boolean", boolean),
            new JProperty("word", word)
        );

        // Send json string via WebSocket
        CPH.WebsocketBroadcastJson(data.ToString(Formatting.None));
        return true;
    }
}