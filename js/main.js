import { app } from "../../../scripts/app.js";
import { ComfyWidgets } from "../../../scripts/widgets.js";
import { TextAreaAutoComplete } from "./autocomplete.js";
import { getWords, settings } from "./state.js";
import "./settings.js";

app.registerExtension({
    name: "comfyui.prompt.snippets.autocompleter",
    async setup(app) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'extensions/comfyui-prompt-snippets/autocomplete.css';
        document.head.appendChild(link);

        const words = await getWords();
        if (words) {
            if (settings.debugOutput) {
                console.log("CPS: Words loaded:", words);
            }
            TextAreaAutoComplete.updateWords(words);
        }
    },
    init(app) {
        // Monkey-patch the STRING widget to add autocomplete.
        // This is a fragile approach and may break with future ComfyUI updates.
        // A more robust solution would be to use a custom widget or a different integration point.
        const STRING = ComfyWidgets.STRING;
        ComfyWidgets.STRING = function (node, inputName, inputData) {
            const r = STRING.apply(this, arguments);
            if (inputData[1]?.multiline) {
                new TextAreaAutoComplete(r.widget.inputEl);
            }
            return r;
        };
    }
});