import { app } from "../../../scripts/app.js";
import { settings } from "./state.js";
import { getWords } from "./state.js";

app.registerExtension({
    name: "comfyui.prompt.snippets.settings",
    async setup(app) {
        const data = await getWords();
        let categories = [];
        if (data && data.categories && data.categories.length) {
            categories = data.categories.sort((a, b) => b.localeCompare(a));
        }

        const setting_debug = app.ui.settings.addSetting({
            id: "cpe.debugOutput",
            name: "CPS: Enable debug logging to console",
            defaultValue: false,
            type: "boolean",
            onChange: (value) => {
                settings.debugOutput = value;
            },
        });

        const setting_trigger = app.ui.settings.addSetting({
            id: "cpe.triggerCharacter",
            name: "CPS: Trigger character for autocomplete",
            defaultValue: "@",
            type: "text",
            onChange: (value) => {
                settings.triggerCharacter = value;
            },
        });

        const disabledCategoriesSetting = app.ui.settings.addSetting({
            id: "cpe.disabledCategories",
            name: "CPS: Disabled Categories",
            defaultValue: [],
            type: "hidden",
        });

        // Storing the initial values (these are already handled by onChange and defaultValue, but keeping for clarity)
        settings.debugOutput = setting_debug.value;
        settings.triggerCharacter = setting_trigger.value;
        settings.disabledCategories = disabledCategoriesSetting.value;

        for (const category of categories) {
            app.ui.settings.addSetting({
                id: `cpe.category.${category}`,
                name: `Category Toggle: ${category}`,
                defaultValue: !settings.disabledCategories.includes(category),
                type: "boolean",
                onChange: (value) => {
                    const disabled = settings.disabledCategories;
                    const index = disabled.indexOf(category);
                    if (value) {
                        if (index > -1) {
                            disabled.splice(index, 1);
                        }
                    } else {
                        if (index === -1) {
                            disabled.push(category);
                        }
                    }
                    disabledCategoriesSetting.value = disabled;
                    settings.disabledCategories = disabled;
                },
            });
        }
    }
});