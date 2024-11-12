export class Insight {
    constructor(id = null, user = {}, trigger_word = '', time_quantity = 1, time_frame = 'weeks', mood_count = 0, created_at = '') {
        this.id = id;
        this.user = user;
        this.trigger_word = trigger_word;
        this.time_quantity = time_quantity;
        this.time_frame = time_frame;
        this.mood_count = mood_count;
        this.created_at = created_at;
    }
}
