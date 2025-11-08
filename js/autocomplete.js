import { $el } from "../../../scripts/ui.js";
import { app } from "../../../scripts/app.js";
import { settings } from "./state.js";

/**
 * The following code is a derivative of the work from two open-source projects:
 * - textarea-caret-position: https://github.com/component/textarea-caret-position
 * - textcomplete: https://github.com/yuku/textcomplete
 *
 * Both projects are licensed under the MIT License.
 * The original copyright notices are preserved below.
 */

/*
    https://github.com/component/textarea-caret-position
    The MIT License (MIT)

    Copyright (c) 2015 Jonathan Ong me@jongleberry.com

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
const getCaretCoordinates = (function () {
    // We'll copy the properties below into the mirror div.
    // Note that some browsers, such as Firefox, do not concatenate properties
    // into their shorthand (e.g. padding-top, padding-bottom etc. -> padding),
    // so we have to list every single property explicitly.
    var properties = [
        "direction", // RTL support
        "boxSizing",
        "width", // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
        "height",
        "overflowX",
        "overflowY", // copy the scrollbar for IE

        "borderTopWidth",
        "borderRightWidth",
        "borderBottomWidth",
        "borderLeftWidth",
        "borderStyle",

        "paddingTop",
        "paddingRight",
        "paddingBottom",
        "paddingLeft",

        // https://developer.mozilla.org/en-US/docs/Web/CSS/font
        "fontStyle",
        "fontVariant",
        "fontWeight",
        "fontStretch",
        "fontSize",
        "fontSizeAdjust",
        "lineHeight",
        "fontFamily",

        "textAlign",
        "textTransform",
        "textIndent",
        "textDecoration", // might not make a difference, but better be safe

        "letterSpacing",
        "wordSpacing",

        "tabSize",
        "MozTabSize",
    ];

    var isBrowser = typeof window !== "undefined";
    var isFirefox = isBrowser && window.mozInnerScreenX != null;

    return function getCaretCoordinates(element, position, options) {
        if (!isBrowser) {
            throw new Error("textarea-caret-position#getCaretCoordinates should only be called in a browser");
        }

        var debug = (options && options.debug) || false;
        if (debug) {
            var el = document.querySelector("#input-textarea-caret-position-mirror-div");
            if (el) el.parentNode.removeChild(el);
        }

        // The mirror div will replicate the textarea's style
        var div = document.createElement("div");
        div.id = "input-textarea-caret-position-mirror-div";
        document.body.appendChild(div);

        var style = div.style;
        var computed = window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle; // currentStyle for IE < 9
        var isInput = element.nodeName === "INPUT";

        // Default textarea styles
        style.whiteSpace = "pre-wrap";
        if (!isInput) style.wordWrap = "break-word"; // only for textarea-s

        // Position off-screen
        style.position = "absolute"; // required to return coordinates properly
        if (!debug) style.visibility = "hidden"; // not 'display: none' because we want rendering

        // Transfer the element's properties to the div
        properties.forEach(function (prop) {
            if (isInput && prop === "lineHeight") {
                // Special case for <input>s because text is rendered centered and line height may be != height
                if (computed.boxSizing === "border-box") {
                    var height = parseInt(computed.height);
                    var outerHeight =
                        parseInt(computed.paddingTop) +
                        parseInt(computed.paddingBottom) +
                        parseInt(computed.borderTopWidth) +
                        parseInt(computed.borderBottomWidth);
                    var targetHeight = outerHeight + parseInt(computed.lineHeight);
                    if (height > targetHeight) {
                        style.lineHeight = height - outerHeight + "px";
                    } else if (height === targetHeight) {
                        style.lineHeight = computed.lineHeight;
                    } else {
                        style.lineHeight = 0;
                    }
                } else {
                    style.lineHeight = computed.height;
                }
            } else {
                style[prop] = computed[prop];
            }
        });

        if (isFirefox) {
            // Firefox lies about the overflow property for textareas: https://bugzilla.mozilla.org/show_bug.cgi?id=984275
            if (element.scrollHeight > parseInt(computed.height)) style.overflowY = "scroll";
        } else {
            style.overflow = "hidden"; // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'
        }

        div.textContent = element.value.substring(0, position);
        // The second special handling for input type="text" vs textarea:
        // spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
        if (isInput) div.textContent = div.textContent.replace(/\s/g, "\u00a0");

        var span = document.createElement("span");
        // Wrapping must be replicated *exactly*, including when a long word gets
        // onto the next line, with whitespace at the end of the line before (#7).
        // The  *only* reliable way to do that is to copy the *entire* rest of the
        // textarea's content into the <span> created at the caret position.
        // For inputs, just '.' would be enough, but no need to bother.
        span.textContent = element.value.substring(position) || "."; // || because a completely empty faux span doesn't render at all
        div.appendChild(span);

        var coordinates = {
            top: span.offsetTop + parseInt(computed["borderTopWidth"]),
            left: span.offsetLeft + parseInt(computed["borderLeftWidth"]),
            height: parseInt(computed["lineHeight"]),
        };

        if (debug) {
            span.style.backgroundColor = "#aaa";
        } else {
            document.body.removeChild(div);
        }

        return coordinates;
    };
})();

/*
    Key functions from:
    https://github.com/yuku/textcomplete
    © Yuku Takahashi - This software is licensed under the MIT license.

    The MIT License (MIT)

    Copyright (c) 2015 Jonathan Ong me@jongleberry.com

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
const CHAR_CODE_ZERO = "0".charCodeAt(0);
const CHAR_CODE_NINE = "9".charCodeAt(0);

class TextAreaCaretHelper {
	constructor(el, getScale) {
		this.el = el;
		this.getScale = getScale;
	}

	#calculateElementOffset() {
		const rect = this.el.getBoundingClientRect();
		const owner = this.el.ownerDocument;
		if (owner == null) {
			throw new Error("Given element does not belong to document");
		}
		const { defaultView, documentElement } = owner;
		if (defaultView == null) {
			throw new Error("Given element does not belong to window");
		}
		const offset = {
			top: rect.top + defaultView.pageYOffset,
			left: rect.left + defaultView.pageXOffset,
		};
		if (documentElement) {
			offset.top -= documentElement.clientTop;
			offset.left -= documentElement.clientLeft;
		}
		return offset;
	}

	#isDigit(charCode) {
		return CHAR_CODE_ZERO <= charCode && charCode <= CHAR_CODE_NINE;
	}

	#getLineHeightPx() {
		const computedStyle = getComputedStyle(this.el);
		const lineHeight = computedStyle.lineHeight;
		if (this.#isDigit(lineHeight.charCodeAt(0))) {
			const floatLineHeight = parseFloat(lineHeight);
			return this.#isDigit(lineHeight.charCodeAt(lineHeight.length - 1))
				? floatLineHeight * parseFloat(computedStyle.fontSize)
				: floatLineHeight;
		}
		return this.#calculateLineHeightPx(this.el.nodeName, computedStyle);
	}

	#calculateLineHeightPx(nodeName, computedStyle) {
		const body = document.body;
		if (!body) return 0;

		const tempNode = document.createElement(nodeName);
		tempNode.innerHTML = "&nbsp;";
		Object.assign(tempNode.style, {
			fontSize: computedStyle.fontSize,
			fontFamily: computedStyle.fontFamily,
			padding: "0",
			position: "absolute",
		});
		body.appendChild(tempNode);

		if (tempNode instanceof HTMLTextAreaElement) {
			tempNode.rows = 1;
		}

		const height = tempNode.offsetHeight;
		body.removeChild(tempNode);

		return height;
	}

	getCursorOffset() {
		const scale = this.getScale();
		const elOffset = this.#calculateElementOffset();
		const elScroll = this.#getElScroll();
		const cursorPosition = this.#getCursorPosition();
		const lineHeight = this.#getLineHeightPx();
		const top = elOffset.top - (elScroll.top * scale) + (cursorPosition.top + lineHeight) * scale;
		const left = elOffset.left - elScroll.left + cursorPosition.left;
		const clientTop = this.el.getBoundingClientRect().top;
		if (this.el.dir !== "rtl") {
			return { top, left, lineHeight, clientTop };
		} else {
			const right = document.documentElement ? document.documentElement.clientWidth - left : 0;
			return { top, right, lineHeight, clientTop };
		}
	}

	#getElScroll() {
		return { top: this.el.scrollTop, left: this.el.scrollLeft };
	}

	#getCursorPosition() {
		return getCaretCoordinates(this.el, this.el.selectionEnd);
	}
}

/**
 * Main class for the autocomplete feature.
 */
export class TextAreaAutoComplete {
    static words = {};
    static categories = [];

    /**
     * @param {HTMLTextAreaElement} el The textarea element to attach the autocomplete to.
     */
    constructor(el) {
        this.el = el;
        this.helper = new TextAreaCaretHelper(el, () => app.canvas.ds.scale);
        this.dropdown = $el("div.cps-autocomplete");
        this.selectedIndex = null;
        this.interacting = false;
        this.setup();
    }

    /**
     * Sets up the event listeners for the textarea.
     */
    setup() {
        this.el.addEventListener("keydown", this.keyDown.bind(this));
        this.el.addEventListener("keyup", this.keyUp.bind(this));
        this.el.addEventListener("click", this.hide.bind(this));
        this.el.addEventListener("blur", () => {
            if (this.interacting) {
                this.interacting = false;
                return;
            }
            setTimeout(() => this.hide(), 150);
        });
    }

    /**
     * Handles keydown events for navigation and selection.
     * @param {KeyboardEvent} e The keyboard event.
     */
    keyDown(e) {
        if (settings.debugOutput) console.log("CPE: keyDown", e.key);
        if (this.dropdown.parentElement) {
            if (e.key === "ArrowUp") {
                e.preventDefault();
                this.moveSelection(-1);
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                this.moveSelection(1);
            } else if (e.key === "Enter" || e.key === "Tab") {
                e.preventDefault();
                this.insertItem();
            }
        }
    }

    /**
     * Handles keyup events to trigger the autocomplete.
     * @param {KeyboardEvent} e The keyboard event.
     */
    keyUp(e) {
        if (e.key === "Escape") {
            this.hide();
            return;
        }
        // Only update if the key pressed is not a navigation key
        if (!["ArrowUp", "ArrowDown", "Enter", "Tab"].includes(e.key)) {
            this.update();
        }
    }

    /**
     * Moves the selection in the dropdown.
     * @param {number} direction The direction to move (-1 for up, 1 for down).
     */
    moveSelection(direction) {
        if (settings.debugOutput) console.log("CPE: moveSelection", direction);
        if (!this.currentWords || !this.currentWords.length) return;
        let newIndex = (this.selectedIndex === null ? 0 : this.selectedIndex) + direction;
        if (newIndex < 0) newIndex = this.currentWords.length - 1;
        if (newIndex >= this.currentWords.length) newIndex = 0;
        this.setSelected(newIndex);
    }

    /**
     * Sets the selected item in the dropdown.
     * @param {number} index The index of the item to select.
     */
    setSelected(index) {
        if (settings.debugOutput) console.log("CPE: setSelected", index);
        if (this.selectedIndex !== null) {
            const prev = this.dropdown.children[this.selectedIndex];
            if (prev) {
                prev.classList.remove("cps-autocomplete-item--selected");
                // Remove expanded text from previously selected item
                const prevExpandedText = prev.querySelector(".cps-autocomplete-expanded-text");
                if (prevExpandedText) {
                    prevExpandedText.remove();
                }
            }
        }
        this.selectedIndex = index;
        const selected = this.dropdown.children[this.selectedIndex];
        if (settings.debugOutput) console.log("CPE: selected element", selected);
        if (selected) {
            selected.classList.add("cps-autocomplete-item--selected");
            selected.scrollIntoView({ block: "nearest" });

            // Add expanded text to the newly selected item if it's not a category and not a CSV item
            const selectedWord = this.currentWords[this.selectedIndex];
            if (selectedWord) {
                let subtext = "";
                if (selectedWord.subtext) {
                    subtext = selectedWord.subtext;
                } else if (!selectedWord.isCategory && !selectedWord.isCsvItem) {
                    subtext = "> " + selectedWord.value;
                }

                if (subtext) {
                    const expandedTextEl = $el("div.cps-autocomplete-expanded-text", { textContent: subtext });
                    expandedTextEl.style.fontStyle = "italic";
                    expandedTextEl.style.color = "#888"; // A little darker
                    // Find the contentWrapper within the selected item
                    const contentWrapper = selected.querySelector(".cps-autocomplete-content-wrapper");
                    if (contentWrapper) {
                        contentWrapper.appendChild(expandedTextEl);
                    }
                }
            }
        }
    }

    /**
     * Inserts the selected item into the textarea.
     */
    insertItem() {
        if (this.selectedIndex === null || !this.currentWords || !this.currentWords[this.selectedIndex]) return;
        this.dropdown.children[this.selectedIndex].click();
    }

    /**
     * Filters the words based on the search term.
     * @param {string} term The search term.
     * @returns {object[]} The filtered words.
     */
    getFilteredWords(term) {
        if (settings.debugOutput) console.log("CPE: getFilteredWords:", term);
        term = term.toLowerCase();
        const suggestions = [];
        const [category, query] = term.split(":");

        if (query === undefined) {
            // Suggest categories
            for (const cat in TextAreaAutoComplete.words) {
                if (cat.includes(term) && !settings.disabledCategories.includes(cat)) {
                    suggestions.push({ key: cat, value: cat + ":", isCategory: true });
                }
            }
        } else {
            // Suggest words from category
            if (TextAreaAutoComplete.words[category] && !settings.disabledCategories.includes(category)) {
                const categoryData = TextAreaAutoComplete.words[category];
                const isCsv = Array.isArray(categoryData);
                const actualSuggestions = [];

                if (isCsv) {
                    // Handle CSV data (array of strings)
                    for (const item of categoryData) {
                        if (item.toLowerCase().includes(query)) {
                            actualSuggestions.push({ key: item, value: item, isCsvItem: true });
                        }
                    }
                } else {
                    // Handle JSON data (object of key-value pairs)
                    for (const word in categoryData) {
                        if (word.toLowerCase().includes(query)) {
                            actualSuggestions.push({ key: word, value: categoryData[word] });
                        }
                    }
                }

                // Add "Random" option only if there are more than one actual suggestions
                if (actualSuggestions.length > 1) {
                    suggestions.push({
                        key: "Random",
                        value: "Random",
                        isRandom: true,
                        subtext: isCsv ? "" : "Roll the dice 🎲"
                    });
                }
                suggestions.push(...actualSuggestions);
            }
        }
        if (settings.debugOutput) console.log("CPE: Suggestions:", suggestions);
        return suggestions;
    }

    /**
     * This is the main update function that is called on every keyup event.
     * It determines the current query, filters the words, and displays the dropdown.
     */
    update() {
        if (settings.debugOutput) console.log("CPE: update");

        const query = this.getQuery();
        if (query === null) {
            this.hide();
            return;
        }

        this.currentWords = this.getFilteredWords(query);
        if (settings.debugOutput) console.log("CPE: currentWords", this.currentWords);

        if (!this.currentWords.length) {
            this.hide();
            return;
        }

        this.renderDropdown(query);
        this.positionDropdown();
    }

    /**
     * Extracts the query from the textarea.
     * @returns {string|null} The query or null if no trigger is found.
     */
    getQuery() {
        const text = this.el.value;
        const cursorPosition = this.el.selectionStart;
        const textBeforeCursor = text.slice(0, cursorPosition);

        const lastTriggerIndex = textBeforeCursor.lastIndexOf(settings.triggerCharacter);

        if (lastTriggerIndex !== -1) {
            const textAfterTrigger = textBeforeCursor.slice(lastTriggerIndex + 1);
            const nextTriggerIndex = textAfterTrigger.indexOf(settings.triggerCharacter);

            if (nextTriggerIndex === -1) {
                return textAfterTrigger;
            }
        }
        return null;
    }

    /**
     * Renders the autocomplete dropdown.
     * @param {string} query The current query.
     */
    renderDropdown(query) {
        this.dropdown.innerHTML = "";
        this.currentWords.forEach((word, i) => {
            const item = $el("div.cps-autocomplete-item", {
                onmousedown: () => {
                    this.interacting = true;
                },
                onclick: () => {
                    this.el.focus();
                    const text = this.el.value;
                    const cursorPosition = this.el.selectionStart;
                    const textBeforeCursor = text.slice(0, cursorPosition);
                    const lastTriggerIndex = textBeforeCursor.lastIndexOf(settings.triggerCharacter);

                    if (lastTriggerIndex !== -1) {
                        const startIndex = lastTriggerIndex;
                        let valueToInsert;
                        let newCursorPos;

                        if (word.isRandom) {
                            // Get all words except the 'Random' one
                            const availableWords = this.currentWords.filter(w => !w.isRandom && !w.isCategory);
                            if (availableWords.length > 0) {
                                const randomIndex = Math.floor(Math.random() * availableWords.length);
                                valueToInsert = availableWords[randomIndex].value;
                            } else {
                                this.hide();
                                return;
                            }
                        } else if (word.isCategory) {
                            const categoryName = word.key; // e.g., "action"
                            const fullCategoryString = settings.triggerCharacter + categoryName + ":"; // e.g., "@action:"
                            const textBeforeMatch = text.substring(0, startIndex);
                            const textAfterCursor = text.substring(cursorPosition);
                            this.el.value = textBeforeMatch + fullCategoryString + textAfterCursor;
                            newCursorPos = startIndex + fullCategoryString.length;
                            this.el.selectionStart = this.el.selectionEnd = newCursorPos;
                            this.selectedIndex = 0; // Reset selected index when a category is chosen
                            setTimeout(() => this.update(), 0); // Defer update to allow DOM to settle
                            return; // Return early to avoid hiding
                        } else {
                            valueToInsert = word.value; // e.g., "arms up"
                        }

                        const textBeforeMatch = text.slice(0, startIndex);
                        const textAfterCursor = text.slice(cursorPosition);
                        const newText = textBeforeMatch + valueToInsert + ", " + textAfterCursor;
                        this.el.value = newText;
                        newCursorPos = startIndex + valueToInsert.length + 2; // +2 for ", "
                        this.el.selectionStart = this.el.selectionEnd = newCursorPos;
                    }
                    this.hide();
                }
            });

            // Create a container for the key text parts
            const keyTextContainer = $el("div.cps-autocomplete-key-text");

            // Create a wrapper for key text and expanded text
            const contentWrapper = $el("div.cps-autocomplete-content-wrapper");

            // Highlighting logic
            const wordKey = word.key;
            const lowerCaseWordKey = wordKey.toLowerCase();

            let highlightQuery = query; // Default to the full query from the input
            if (word.isCategory) {
                // If it's a category suggestion, the highlight query is the full query
                highlightQuery = query;
            } else {
                // If it's a word suggestion, the highlight query is the part after the colon
                const parts = query.split(":");
                if (parts.length > 1) {
                    highlightQuery = parts[1];
                } else {
                    highlightQuery = query; // Should not happen if it's a word suggestion
                }
            }
            const lowerCaseHighlightQuery = highlightQuery.toLowerCase();

            const matchIndex = lowerCaseWordKey.indexOf(lowerCaseHighlightQuery);
            if (matchIndex !== -1) {
                const beforeMatch = wordKey.substring(0, matchIndex);
                const matchText = wordKey.substring(matchIndex, matchIndex + highlightQuery.length);
                const afterMatch = wordKey.substring(matchIndex + highlightQuery.length);

                if (beforeMatch) {
                    keyTextContainer.appendChild($el("span", { textContent: beforeMatch }));
                }
                keyTextContainer.appendChild($el("span.cps-autocomplete-highlight", { textContent: matchText }));
                if (afterMatch) {
                    keyTextContainer.appendChild($el("span", { textContent: afterMatch }));
                }
            } else {
                keyTextContainer.textContent = wordKey;
            }
            contentWrapper.appendChild(keyTextContainer); // Append the key text container to the content wrapper
            item.appendChild(contentWrapper); // Append the content wrapper to the item
            this.dropdown.appendChild(item);
        });

        if (!this.dropdown.parentElement) {
            document.body.append(this.dropdown);
            this.selectedIndex = 0;
            this.setSelected(0);
        } else {
            // If the dropdown is already visible, try to maintain the selection
            // or re-select the first item if the current selection is out of bounds
            if (this.selectedIndex === null || this.selectedIndex >= this.currentWords.length) {
                this.selectedIndex = 0;
            }
            this.setSelected(this.selectedIndex);
        }
    }

    /**
     * Positions the autocomplete dropdown.
     */
    positionDropdown() {
        const position = this.helper.getCursorOffset();
        this.dropdown.style.left = `${position.left}px`;
        this.dropdown.style.top = `${position.top}px`;
        this.dropdown.style.maxHeight = (window.innerHeight - position.top) + "px";
    }

    /**
     * Hides the autocomplete dropdown.
     */
    hide() {
        if (this.dropdown.parentElement) {
            this.dropdown.remove();
        }
        this.selectedIndex = null;
    }

    /**
     * Updates the words used for autocomplete.
     * @param {object} data The data from the API.
     */
    static updateWords(data) {
        if (settings.debugOutput) console.log("CPE: Updating words:", data);
        TextAreaAutoComplete.words = data.words;
        TextAreaAutoComplete.categories = data.categories;
    }
}