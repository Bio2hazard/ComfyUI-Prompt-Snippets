import { api } from "../../../scripts/api.js";

/**
 * @typedef {object} WordData
 * @property {Record<string, string[] | Record<string, string>>} words
 * @property {string[]} categories
 */

class CPS_SETTINGS {
    constructor() {
        this.debugOutput = false;
        this.triggerCharacter = "@";
        this.disabledCategories = [];
    }
}

export const settings = new CPS_SETTINGS();

/** @type {WordData | null} */
let wordData = null;

/**
 * Fetches the autocomplete data from the API if it hasn't been fetched yet.
 * @returns {Promise<WordData|null>}
 */
export async function getWords() {
    if (!wordData) {
        try {
            const response = await api.fetchApi("/cps/get_words");
            if (response.status === 200) {
                wordData = await response.json();
            }
        } catch (e) {
            console.error("Failed to load words", e);
        }
    }
    return wordData;
}
