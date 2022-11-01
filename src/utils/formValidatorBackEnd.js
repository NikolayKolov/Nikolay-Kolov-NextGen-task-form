/**
 * Contains methods for form fields validation in back end
 * Provides a quick and convenient way to search for a validator method for a given field name
 */

const formValidatorBackEnd = {
    validateEmailDomains: (email) => {
        let emailDomain = email.match(/@(.*?)\./g)[0];
        emailDomain = emailDomain.slice(1, emailDomain.length - 1);
        // check if it is from public domains and if so, stop registration
        if (['gmail', 'yahoo', 'hotmail'].includes(emailDomain)) {
            return {
                isValid: false,
                errorMessage: "Please don't use public domains like gmail, yahoo, hotmail",
            };
        } else {
            return {
                isValid: true,
            };
        }
    },
    validateUserName: (username) => {
        // check if username is already taken
        if (['john123', 'mike123', 'steve123'].includes(username)) {
            return {
                isValid: false,
                errorMessage: 'Username already taken',
            };
        } else {
            return {
                isValid: true,
            };
        }
    },
    validateBirthDate: (birthDate) => {
        // check if user is over 18 years old
        const today = new Date(Date.now());
        const userBirthDate = new Date(birthDate);
        // since getMonth returns a number between 0 to 11, add 1
        const date18YearsAgo = new Date(
            `${new Date(today).getFullYear() - 18}-${new Date(today).getMonth() + 1}-${new Date(today).getDate()}`
        );

        if (date18YearsAgo > userBirthDate) {
            return {
                isValid: true,
            };
        } else {
            return {
                isValid: false,
                errorMessage: 'User must be over 18 years of age',
            };
        }
    },
};

export default formValidatorBackEnd;
