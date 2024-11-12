export class JournalEntry {
    constructor(id = null, user = {}, title = '', content = '', created_at = '') {
        this.id = id;
        this.user = user;
        this.title = title;
        this.content = content;
        this.created_at = created_at;
    }
}
