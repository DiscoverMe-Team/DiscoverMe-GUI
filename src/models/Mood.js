export class Mood {
    constructor(id = null, mood_type = '', mood_description = '') {
        this.id = id;
        this.mood_type = mood_type;
        this.emoji = this.get_emoji();
        this.mood_description = mood_description;
    }

    get_emoji() {
        const emojiMap = {
            happy: '😊',
            sad: '😢',
            angry: '😡',
            anxious: '😰',
            excited: '🤩',
            neutral: '😐',
        };
        return emojiMap[this.mood_type.toLowerCase()] || '❓';
    }
}
