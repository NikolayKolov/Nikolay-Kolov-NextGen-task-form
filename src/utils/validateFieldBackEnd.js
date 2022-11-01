import formValidatorBackEnd from './formValidatorBackEnd';

const configs = require('./formFields.json');

/**
 * uses form validator methods from formValidatorBackEnd to validate the given field and its value
 */

function validateFieldBackEnd(fieldName, fieldValue) {
    const validatorMethods = {
        [configs.email.id]: (email) => formValidatorBackEnd.validateEmailDomains(email),
        [configs.uName.id]: (uname) => formValidatorBackEnd.validateUserName(uname),
        [configs.bDate.id]: (birthdate) => formValidatorBackEnd.validateBirthDate(birthdate),
    };

    let validator = validatorMethods[fieldName];
    let fieldErrorMessage = undefined;
    let fieldIsValid = undefined;

    if (validator !== undefined) {
        let validateResult = validator(fieldValue);
        fieldErrorMessage = validateResult.errorMessage;
        fieldIsValid = validateResult.isValid;
    } else {
        fieldIsValid = true;
    }

    return {
        isValid: fieldIsValid,
        errorMessage: fieldErrorMessage,
        value: fieldValue,
    };
}

export default validateFieldBackEnd;
