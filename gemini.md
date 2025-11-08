# Gemini Project Summary: ComfyUI Prompt Snippets

This project is a custom node for ComfyUI that provides a prompt autocompletion feature. The goal is to help users write prompts more efficiently by suggesting and expanding keywords from custom data files.

## Core Functionality

The main feature is the autocompletion of prompts, triggered by a configurable character (defaulting to `@`) in any multiline text area within the ComfyUI interface. The suggestions are sourced from JSON and CSV files located in the `data` directory. The category of the suggestion is inferred from the filename.

### Autocomplete Trigger

-   **Trigger:** A configurable character, defaulting to `@`.
-   **Action:** When a user types the trigger character, a list of suggestion categories (e.g., `action`) appears.
-   **Expansion:** As the user continues to type (e.g., `@action:up`), the suggestions are filtered. Selecting a suggestion (e.g., `arms up`) expands it to a full prompt (e.g., `global illumination,arms up`).

### Autocomplete Functionality

-   **Selection:** The currently selected autocomplete option is highlighted with a thicker left-side border.
-   **Navigation:** Users can cycle through the autocomplete options using the up and down arrow keys.
-   **Matching Input Highlight:** The portion of the suggestion that matches the user's input is displayed in bold with a blue underline.
-   **Substring Matching:** Autocomplete suggestions now include substring matching, meaning a query like "tion" will match "action", and "up" will match "upside-down" or "wake up".
-   **Category Selection Behavior:** When a category is selected (e.g., `@action`), the inserted text now correctly includes the leading `@` symbol and the category name followed by a colon (e.g., `@action:`). The autocomplete immediately updates to show the items within that category, with the selection reset to the first item, by deferring the update call to allow the DOM to settle. The `update()` function has been refined to explicitly handle this scenario.
-   **Item Selection Behavior:** When an actual item is selected (e.g., `@action:arms up`), a trailing comma and a space (`, `) are added after the inserted item.
-   **Expanded Text Display:** When an item is selected from a category, a box showing the full expanded text (e.g., "1girl, mirror") will appear directly below the selected item in the autocomplete dropdown. This is now dynamically added/removed in `setSelected`. The key text is wrapped in a `div.cpe-autocomplete-key-text`, and both the key text and expanded text are contained within a new `div.cpe-autocomplete-content-wrapper`. The expanded text is now prepended with a `>` character, displayed in italic, and a slightly darker color, with styles applied directly via JavaScript in `setSelected`.
-   **Random Item Selection:** After a category is specified (e.g., `@action:`), the first entry in the autocomplete list is "Random". This option is only displayed if there are more than one valid suggestions within the category. Selecting this option will insert a random item from that category. For JSON-based categories, a subtext "Roll the dice 🎲" is displayed under the "Random" option.
-   **Disabled Categories:** Users can disable categories they don't use from the settings page. Disabled categories will not appear in the autocomplete suggestions.

## Bug Fixes & Improvements

-   **Special Character Handling:** Fixed a bug where special characters (e.g., spaces, parentheses) in the autocomplete input would prevent the selected item from being inserted. The `update` function in `autocomplete.js` now uses a more robust method to identify the query, and the `onclick` handler correctly inserts the selection.
-   **Performance:**
    -   **Backend:** Implemented caching for the autocomplete data, so the files are no longer read from disk on every request.
    -   **Frontend:** Refactored the frontend to fetch the autocomplete data only once per page load, instead of multiple times.
-   **Maintainability:**
    -   **Code Structure:** The monolithic `autocomplete.js` file has been broken down into smaller, more manageable functions.
    -   **Documentation:** Added JSDoc comments to the JavaScript files and docstrings to the Python file to improve code clarity.
    -   **Redundant Code:** Removed a useless `DummyNode` from the Python code.

## Technical Implementation

-   **Backend (`__init__.py`):**
    -   An API endpoint `/csvexp/get_words` is defined to serve the autocomplete data.
    -   The data is now cached in memory to improve performance.
    -   This endpoint reads all `.json` and `.csv` files from the default `js/data` directory and the user-specific `ComfyUI/user/{user_id}/comfyui-prompt-snippets/` directory. It uses a robust fallback mechanism to locate the user directory.
    -   For `.json` files, the content (dictionaries of prompts) is served as key-value pairs.
    -   For `.csv` files, each line is read as a separate prompt, and the category is served as a list of strings.
    -   The filename (without the extension) is used as the category name for both file types.
-   **Frontend (`js/main.js`):** The autocompletion is implemented using JavaScript.
    -   It now uses the `getWords` function from `js/state.js` to fetch the autocomplete data.
    -   It now imports `js/settings.js` to initialize the settings panel.
    -   A comment has been added to warn about the fragility of monkey-patching `ComfyWidgets.STRING`.
-   **Frontend (`js/autocomplete.js`):**
    -   Contains the core logic for the autocomplete dropdown, including filtering, selection, and insertion.
    -   The `update` function has been refactored into smaller, more manageable functions (`getQuery`, `renderDropdown`, `positionDropdown`).
    -   The `getFilteredWords` function has been updated to differentiate between JSON (object of key-value pairs) and CSV (array of strings) data. For CSV items, a `isCsvItem: true` flag is added to the suggestion object. It also adds a "Random" option to the top of the list when a category is selected, and filters out disabled categories.
    -   The `setSelected` function now uses the `isCsvItem` flag to prevent displaying expanded text for items originating from CSV files, and displays a subtext for the "Random" option.
    -   The `update` function's `onclick` handler now checks for the `isRandom` flag and inserts a random item if it's true.
    -   The `updateWords` static method now accepts the entire data object from the API, which includes both `words` and `categories`.
-   **Frontend (`js/autocomplete.css`):**
    -   Added and adjusted styles for `.cpe-autocomplete-expanded-text`, `.cpe-autocomplete-item`, `.cpe-autocomplete-key-text`, and `.cpe-autocomplete-content-wrapper` to correctly format the expanded text display below the item key, ensuring proper vertical stacking using flexbox. CSS for the expanded text's italic font, darker color, and prepended `>` are now handled by JavaScript.
-   **Frontend (`js/settings.js`):**
    -   It now uses the `getWords` function from `js/state.js` to fetch the autocomplete data.
    -   It allows toggling the `debugOutput` flag and configuring the `triggerCharacter` for the autocompletion feature.
    -   It dynamically creates checkboxes for each category to allow users to disable them.
    -   It initializes the settings from ComfyUI's settings system on setup.
-   **Frontend (`js/state.js`):**
    -   New file created to handle data fetching and state management.
    -   It exports a `getWords` function that fetches the autocomplete data from the API, caching the result.
    -   It also exports a `settings` object that is shared across the frontend modules.
-   **Data (`data/`):**     -   The autocomplete data is stored in JSON and CSV files in the `data` directory.
    -   Each file represents a category, and the filename is the category name.
    -   JSON files should contain an object where keys are short prompts and values are expanded prompts.
    -   CSV files should contain a list of prompts, one per line.

## Project Structure

-   `__init__.py`: Initializes the custom node, registers the `js` directory as a web directory, and provides the API endpoint for autocomplete data.
-   `data/`: Contains the JSON files with the autocomplete data.
-   `js/`: Contains the JavaScript files for the frontend, including `main.js`, `autocomplete.js`, `autocomplete.css`, `settings.js`, and `state.js`.
-   `README.md`: The main documentation for the project.
-   `gemini.md`: This file.

## New Feature: ComfyUI Settings Page

-   A new settings page has been added for the custom node, accessible via the ComfyUI settings dialog.
-   The following settings are now configurable:
    -   **Debug Output:** Allows users to enable or disable console logging for debugging. Defaults to `false`.
    -   **Trigger Character:** Allows users to set the. character that triggers the autocomplete. Defaults to `@`.
    -   **Enabled Categories:** Allows users to enable or disable individual categories. These are sorted alphabetically and named `Category Toggle: [category name]`.

## User Customization

- **Custom Data Files:** Users can add their own `.json` and `.csv` files to a user-specific directory. These files follow the same format as the default data files.
- **User Directory:** The user-specific directory is located at `ComfyUI/user/{user_id}/comfyui-prompt-snippets/`. The node will automatically detect the active user.
- **File Precedence:** Data files in the user directory will override default data files with the same name. This allows users to customize existing categories.
- **Example Files:** When the `comfyui-prompt-snippets` directory is first created, two example files, `gadget.csv.example` and `custom_chara.json.example`, are automatically generated to guide the user.

## Gemini Instructions

After making changes to the project, please update this `gemini.md` file to reflect the current state of the project. This includes any changes to the file structure, core functionality, or technical implementation.

## Embedded Python

The embedded Python executable to use is located at `F:\ComfyUI_windows_portable\python_embeded\python.exe`
