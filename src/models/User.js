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

    // Static method for validating email
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) || 'Invalid email address';
    }

    // Static method for validating username
    static validateUsername(username) {
        return username.trim().length >= 3 || 'Username must be at least 3 characters long';
    }

    // Static method for validating first name
    static validateFirstName(firstName) {
        return firstName.trim() !== '' || 'First name cannot be empty';
    }

    // Static method for validating last name
    static validateLastName(lastName) {
        return lastName.trim() !== '' || 'Last name cannot be empty';
    }

    // Static method for validating password
    static validatePassword(password) {
        return password.length >= 8 || 'Password must be at least 8 characters long';
    }

    // Method to validate all fields of a user object
    static validateAll(fields) {
        const errors = {};

        if ('email' in fields) {
            const emailError = this.validateEmail(fields.email);
            if (emailError !== true) errors.email = emailError;
        }

        if ('username' in fields) {
            const usernameError = this.validateUsername(fields.username);
            if (usernameError !== true) errors.username = usernameError;
        }

        if ('first_name' in fields) {
            const firstNameError = this.validateFirstName(fields.first_name);
            if (firstNameError !== true) errors.first_name = firstNameError;
        }

        if ('last_name' in fields) {
            const lastNameError = this.validateLastName(fields.last_name);
            if (lastNameError !== true) errors.last_name = lastNameError;
        }

        if ('password' in fields) {
            const passwordError = this.validatePassword(fields.password);
            if (passwordError !== true) errors.password = passwordError;
        }

        return errors;
    }
}
