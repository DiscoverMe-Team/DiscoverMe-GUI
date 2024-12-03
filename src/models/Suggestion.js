export class Suggestion {
    /**
     * Suggestion Model Constructor
     * @param {number} id - Unique ID of the suggestion
     * @param {string} moodTrigger - The mood that triggered this suggestion
     * @param {string} suggestionText - The text content of the suggestion
     */
    constructor(id, moodTrigger, suggestionText) {
        this.id = id;
        this.moodTrigger = moodTrigger;
        this.suggestionText = suggestionText;
    }
}
