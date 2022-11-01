/**
 * Contains methods for form fields validation in front end
 * Provides a quick and convenient way to search for a validator method for a given field name
 * Will also be reused in back end
 */

const formValidatorFrontEnd = {
    validateName: (name, descriptor = 'Name') => {
        let errorMessage = `${descriptor} must be between 2 and 30 characters and contain only letters, dashes and '`;
        if (typeof name === 'string') {
            let validName = /^[a-zA-Z-']{2,30}$/.test(name);

            return validName
                ? {
                      isValid: validName,
                  }
                : {
                      isValid: validName,
                      errorMessage: errorMessage,
                  };
        } else {
            return {
                isValid: false,
                errorMessage: errorMessage,
            };
        }
    },
    validateEmail: (email) => {
        let errorMessage = `Email must be in format hello@register.me`;
        if (typeof email === 'string') {
            // regex for checking email format
            // ^ means at start of string, w+ means 1 or more word characters,
            // () means group, which will be used by the regex from outside the brackets,
            // [.\]? means a dot or dash, repeated 0 or 1 times,
            // the w+ after it means that it must be followed by 1 or more word characters -
            // email-test.test@bla.bl is valid, while email-test.@bla.bl or email-test.test-@bla.bl is not
            // (expression)* means that the expression in the group may be repeated 0 or more times
            // @ is just the at symbol for email
            // \.\w{2,4} means a dot followed by 2 to 4 word characters
            // (expression)+$ means that the expression must be repeated 1 or more times at the end of the string -
            // email@abv.bg is valid, so is email@abv.bg.com
            let validEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/.test(email.toLowerCase());

            return validEmail
                ? {
                      isValid: validEmail,
                  }
                : {
                      isValid: validEmail,
                      errorMessage: errorMessage,
                  };
        } else {
            return {
                isValid: false,
                errorMessage: errorMessage,
            };
        }
    },
    validatePassword: (password) => {
        const errorMessageMissingNumber = `Password must contain at least 1 number`;
        const errorMessageMissingCapital = `Password must contain at least 1 capital letter`;
        const errorMessageMissingLower = `Password must contain at least 1 lower case letter`;
        const errorMessageTooShort = `Password is too short, at least 7 characters`;
        const errorMessageTooLong = `Password is too long, over 30 characters`;

        if (typeof password === 'string') {
            let errorMessage = '';
            if (password.length < 7) {
                errorMessage += errorMessageTooShort + '\n';
            }
            if (password.length > 30) {
                errorMessage += errorMessageTooLong + '\n';
            }
            let missingNumber = /\d/.test(password);
            if (!missingNumber) {
                errorMessage += errorMessageMissingNumber + '\n';
            }
            let missingCapital = /[A-Z]/.test(password);
            if (!missingCapital) {
                errorMessage += errorMessageMissingCapital + '\n';
            }
            let missingLower = /[a-z]/.test(password);
            if (!missingLower) {
                errorMessage += errorMessageMissingLower + '\n';
            }

            if (errorMessage === '') {
                return {
                    isValid: true,
                };
            } else
                return {
                    isValid: false,
                    errorMessage: errorMessage,
                };
        } else {
            return {
                isValid: false,
                errorMessage: 'Unknown password error',
            };
        }
    },
    validatePasswordRetype: (passwordRetype, password) => {
        if (typeof passwordRetype === 'string') {
            if (passwordRetype === '') {
                return {
                    isValid: false,
                    errorMessage: 'Please enter a value',
                };
            } else if (passwordRetype === password) {
                return {
                    isValid: true,
                };
            } else {
                return {
                    isValid: false,
                    errorMessage: "Passwords don't match",
                };
            }
        } else {
            return {
                isValid: false,
                errorMessage: 'Unknown password error',
            };
        }
    },
    validateUserName: (username) => {
        if (typeof username === 'string') {
            let testUsername = /^[a-z0-9]{5,20}$/i.test(username);
            if (testUsername) {
                return {
                    isValid: true,
                };
            } else {
                return {
                    isValid: false,
                    errorMessage: 'Username must be between 5 and 20 characters and contain letters and numbers only',
                };
            }
        } else {
            return {
                isValid: false,
                errorMessage: 'Unknown username error',
            };
        }
    },
    validateUserDescription: (userDescription) => {
        if (typeof userDescription === 'string') {
            let testUserDescription = userDescription.length >= 100;
            if (testUserDescription) {
                return {
                    isValid: true,
                };
            } else {
                return {
                    isValid: false,
                    errorMessage: 'User description must be at least 100 characters',
                };
            }
        } else {
            return {
                isValid: false,
                errorMessage: 'Unknown user description error',
            };
        }
    },
    validateUserProfileImage: (file) => {
        if (file instanceof File && file.name !== undefined) {
            const fileExtensions = ['.jpg', '.jpeg', '.png'];
            let isValid = fileExtensions.some((ext) => {
                if (file.name.endsWith(ext)) {
                    return true;
                } else {
                    return false;
                }
            });

            if (isValid) {
                return {
                    isValid: true,
                };
            } else {
                return {
                    isValid: false,
                    errorMessage: 'Wrong file extension, please use only .jpg, .jpeg or .png',
                };
            }
        } else if (typeof file === 'undefined') {
            return {
                isValid: false,
                errorMessage: 'Please select a file',
            };
        } else {
            return {
                isValid: false,
                errorMessage: 'Unknown user image error',
            };
        }
    },
    validateBirthDate: (birthdate) => {
        if (typeof birthdate === 'string') {
            // date is returned in the format 'YYYY-MM-DD' with a string length of 10
            if (birthdate.length !== 10) {
                return {
                    isValid: false,
                    errorMessage: 'Invalid date format',
                };
            }
            let dateParse = Date.parse(birthdate);
            if (isNaN(dateParse)) {
                return {
                    isValid: false,
                    errorMessage: 'Invalid date format',
                };
            } else {
                return {
                    isValid: true,
                };
            }
        } else {
            return {
                isValid: false,
                errorMessage: 'Unknown birthdate error',
            };
        }
    },
    validateRace: (race) => {
        if (typeof race === 'string') {
            if (race === '') {
                return {
                    isValid: false,
                    errorMessage: 'Please select a race',
                };
            } else {
                let validRace = /^[a-z]+$/i.test(race);
                if (validRace) {
                    return {
                        isValid: true,
                    };
                } else {
                    return {
                        isValid: false,
                        errorMessage: 'Entered race is malformatted',
                    };
                }
            }
        } else {
            return {
                isValid: false,
                errorMessage: 'Unknown race error',
            };
        }
    },
    validateGender: (gender) => {
        if (typeof gender === 'string') {
            if (gender === '') {
                return {
                    isValid: false,
                    errorMessage: 'Please select a gender',
                };
            } else {
                let validGender = /^[a-z]+$/i.test(gender);
                if (validGender) {
                    return {
                        isValid: true,
                    };
                } else {
                    return {
                        isValid: false,
                        errorMessage: 'Entered gender is malformatted',
                    };
                }
            }
        } else {
            return {
                isValid: false,
                errorMessage: 'Unknown gender error',
            };
        }
    },
    validateBasicDataCollection: (collection) => {
        // FormData takes only types string and Blob, so convert to string to check on back end
        if (
            typeof collection === 'boolean' ||
            (typeof collection === 'string' && ['true', 'false'].includes(collection))
        ) {
            if (typeof collection === 'string') collection = collection === 'true';
            if (collection) {
                return {
                    isValid: true,
                };
            } else {
                return {
                    isValid: false,
                    errorMessage: 'Please select basic data collection',
                };
            }
        } else {
            return {
                isValid: false,
                errorMessage: 'Unknown basic data collection error',
            };
        }
    },
};

export default formValidatorFrontEnd;
