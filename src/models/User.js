export class User {
    constructor(id = null, username = '', email = '', first_name = '', last_name = '', is_staff = false, is_superuser = false) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.first_name = first_name;
        this.last_name = last_name;
    }
}
