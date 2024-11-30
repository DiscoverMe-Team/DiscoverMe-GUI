export class User {
    constructor(
        id = null,
        username = '',
        email = '',
        first_name = '',
        last_name = '',
        occupation = '',
        city = '',
        state = '',
        pronouns = '',
        is_staff = false,
        is_superuser = false
    ) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.first_name = first_name;
        this.last_name = last_name;
        this.occupation = occupation;
        this.city = city;
        this.state = state;
        this.pronouns = pronouns;
        this.is_staff = is_staff;
        this.is_superuser = is_superuser;
    }
}
