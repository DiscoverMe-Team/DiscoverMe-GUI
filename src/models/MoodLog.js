import { Mood } from './Mood';

export class MoodLog {
    constructor(id = null, user = {}, mood = new Mood(), date_logged = '', notes = '') {
        this.id = id;
        this.user = user;
        this.mood = mood;
        this.date_logged = date_logged;
        this.notes = notes;
    }
}