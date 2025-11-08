# ComfyUI Prompt Snippets

This extension for ComfyUI adds a autocompletion feature that helps you write prompts faster and more efficiently. It provides suggestions from premade and custom data files as you type, allowing you to quickly insert and expand predefined keywords.

![Example animation showing ComfyUI Prompt Snippets usage](/examples/example.avif)

## Installation

### Recommended
Install via [ComfyUI-Manager](https://github.com/ltdrdata/ComfyUI-Manager).

### Manual

1. Open your terminal and navigate to your ComfyUI/custom_nodes folder
2. Run `git clone https://github.com/Bio2hazard/ComfyUI-Prompt-Snippets.git`

## Purpose

-   **Efficiency:** Save time and streamline your workflow by autocompleting, expanding, or inserting prompt snippets with ease.
-   **Reference & Reminder:** Act as a quick reference for available tags. For instance, if you need a specific camera angle but can't recall its name, this tool can provide suggestions.
-   **Inspiration & Exploration:** Encourage experimentation by allowing you to apply random fashions, outfits, settings, color schemes, or filters to your prompts, fostering creativity and discovery.

## What sets it apart?

-   **No Custom Nodes Required:** It operates without the need for any custom nodes, meaning you don't have to modify your existing ComfyUI workflows to integrate this tool.
-   **Configurable Trigger Character:** Activated by a configurable starting character (defaulting to '@'), it remains unobtrusive during regular typing but is readily accessible when you need it.
-   **Categorized Snippets:** Instead of overwhelming you with a flood of irrelevant tag suggestions, snippets are intelligently grouped and categorized (e.g., `art_style`, `artist`, `atmosphere`), providing more focused and relevant options.
-   **Individual and Collection Support:** Supports not only the completion of individual tags but also entire collections of tags, allowing for more complex and nuanced prompt construction.
-   **Easy Customization:** Offers straightforward methods to add your own categories, tags, and tag groups, enabling personalized and expandable prompt management.

## Features

-   **Autocomplete Trigger:** Type a configurable character (defaulting to `@`) in any multiline textbox to trigger autocomplete suggestions.
-   **Substring Matching:** Suggestions include substring matches, so "tion" matches "action", and "up" matches "upside-down".
-   **Category Selection:** Selecting a category (e.g., `@action`) inserts the category name and a colon (e.g., `@action:`), then updates suggestions to show items within that category.
-   **Item Selection:** Selecting an item (e.g., `@action:arms up`) inserts the item followed by a trailing comma and a space (`, `).
-   **Expanded Text Display:** When an item is selected, a box below it shows the full expanded text (e.g., "1girl, mirror").
-   **Random Item Selection:** After a category is specified (e.g., `@action:`), a "Random" option appears (if more than one suggestion exists). Selecting this option inserts a random item from the filtered suggestions within that category, respecting any partial input you've provided (e.g., typing "@character:genshin" and selecting "Random" will insert a random Genshin character).
-   **Disabled Categories:** Users can disable unused categories via the settings page, preventing them from appearing in suggestions.
-   **Easy to Use:** Simply type the trigger character followed by a keyword to see suggestions. Use arrow keys to navigate and `Enter` or `Tab` to insert. Or use your mouse and click your way to completion.


## How to Use

1.  Install the custom node.
2.  Start ComfyUI.
3.  In any multiline text area (e.g., the prompt input for a sampler), type the configured trigger character (default: `@`) to see a list of available categories (e.g., `action`).
4.  Continue typing to narrow down the suggestions (e.g., `@action:up`).
5.  Use the up and down arrow keys to select a suggestion.
6.  Press `Enter` or `Tab` to insert the selected prompt or category, or click with the mouse.
7.  Access the settings panel in ComfyUI to configure the trigger character, enable/disable debug output, or toggle specific categories on/off.


## Customization

-   **Custom Data Files:** Add your own `.json` and `.csv` files to a user-specific directory. These files follow the same format as the default data files.
-   **User Directory:** The user-specific directory is located at `ComfyUI/user/{user_id}/comfyui-prompt-snippets/`. The user_id is usually `default` but in multi-user installations the tool will automatically detect the correct user. If you are unsure, check `ComfyUI/user/default/comfyui-prompt-snippets/`.
-   **File Precedence:** Data files in your user directory will override default data files with the same name, allowing you to customize existing categories.
-   **Example Files:** When the `comfyui-prompt-snippets` directory is first created, example files (`gadget.csv.example` and `custom_chara.json.example`) are automatically generated to guide you in creating your own custom snippets. To use them, simply remove the `.example` extension from their filenames. 

## Content Summary and Attribution

| Category        | Count | Source                                                                                                        | License  |
| :-------------- | :---- | :------------------------------------------------------------------------------------------------------------ | :------- |
| art_style       | 240   | [ltdrdata/ComfyUI-Inspire-Pack](https://github.com/ltdrdata/ComfyUI-Inspire-Pack/tree/main), [DesertPixelAi/ComfyUI-Desert-Pixel-Nodes](https://github.com/DesertPixelAi/ComfyUI-Desert-Pixel-Nodes) | GPL-3.0, MIT |
| artist          | 14999 | [lonelyowl13/artist_randomizer](https://github.com/lonelyowl13/artist_randomizer)                           | WTFPL    |
| atmosphere      | 60    | [DesertPixelAi/ComfyUI-Desert-Pixel-Nodes](https://github.com/DesertPixelAi/ComfyUI-Desert-Pixel-Nodes)       | MIT      |
| attire          | 558   | Danbooru tags wiki                                                                   | -        |
| camera_angle    | 63    | [ltdrdata/ComfyUI-Inspire-Pack](https://github.com/ltdrdata/ComfyUI-Inspire-Pack/tree/main), [DesertPixelAi/ComfyUI-Desert-Pixel-Nodes](https://github.com/DesertPixelAi/ComfyUI-Desert-Pixel-Nodes) | GPL-3.0, MIT |
| character       | 5326  | [mirabarukaso/character_select_stand_alone_app](https://github.com/mirabarukaso/character_select_stand_alone_app) | MIT      |
| color_theme     | 50    | [DesertPixelAi/ComfyUI-Desert-Pixel-Nodes](https://github.com/DesertPixelAi/ComfyUI-Desert-Pixel-Nodes)       | MIT      |
| depth_style     | 42    | [DesertPixelAi/ComfyUI-Desert-Pixel-Nodes](https://github.com/DesertPixelAi/ComfyUI-Desert-Pixel-Nodes)       | MIT      |
| face            | 394   | Mostly self compiled with 60 sourced from [DesertPixelAi/ComfyUI-Desert-Pixel-Nodes](https://github.com/DesertPixelAi/ComfyUI-Desert-Pixel-Nodes) | MIT      |
| fashion         | 82    | Danbooru tags wiki                                                                   | -        |
| filter          | 51    | [DesertPixelAi/ComfyUI-Desert-Pixel-Nodes](https://github.com/DesertPixelAi/ComfyUI-Desert-Pixel-Nodes)       | MIT      |
| gesture         | 120   | Danbooru tags wiki                                                                   | -        |
| lighting        | 65    | [DesertPixelAi/ComfyUI-Desert-Pixel-Nodes](https://github.com/DesertPixelAi/ComfyUI-Desert-Pixel-Nodes)       | MIT      |
| location        | 60    | [DesertPixelAi/ComfyUI-Desert-Pixel-Nodes](https://github.com/DesertPixelAi/ComfyUI-Desert-Pixel-Nodes)       | MIT      |
| nsfw_act        | 239   | Adult Only! Danbooru tags wiki                                                       | -        |
| nsfw_attire     | 203   | Adult Only! Danbooru tags wiki                                                       | -        |
| nsfw_chest      | 212   | Adult Only! Danbooru tags wiki                                                       | -        |
| nsfw_female     | 52    | Adult Only! Danbooru tags wiki                                                       | -        |
| nsfw_fetish     | 233   | Adult Only! Danbooru tags wiki                                                       | -        |
| nsfw_male       | 72    | Adult Only! Danbooru tags wiki                                                       | -        |
| nsfw_nudity     | 227   | Adult Only! Danbooru tags wiki                                                       | -        |
| nsfw_rear       | 43    | Adult Only! Danbooru tags wiki                                                       | -        |
| nsfw_scenario   | 658   | Adult Only! [lanner0403/WAI-NSFW-illustrious-character-select](https://github.com/lanner0403/WAI-NSFW-illustrious-character-select) | -        |
| posture         | 220   | Danbooru tags wiki                                                                   | -        |
| quality         | 9     | Custom                                                                                                | -        |
| setting         | 97    | [ltdrdata/ComfyUI-Inspire-Pack](https://github.com/ltdrdata/ComfyUI-Inspire-Pack/tree/main)                 | GPL-3.0  |
| time_of_day     | 30    | [DesertPixelAi/ComfyUI-Desert-Pixel-Nodes](https://github.com/DesertPixelAi/ComfyUI-Desert-Pixel-Nodes)       | MIT      |
| trope           | 216   | Created by Gemini per my request                                                                              | -        |

Autocomplete functionality uses some code from [pythongosssss/ComfyUI-Custom-Scripts](https://github.com/pythongosssss/ComfyUI-Custom-Scripts) under MIT, and it was also a big inspiration for this project. Thank you!
