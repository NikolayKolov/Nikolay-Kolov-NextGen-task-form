import formValidatorFrontEnd from './formValidatorFrontEnd';

const configs = require('./formFields.json');

/**
 * uses form validator methods from formValidatorFrontEnd to validate the given field and its value
 */

function validateFieldFrontEnd(fieldID, fieldValue, extraData) {
    const validatorMethods = {
        [configs.fName.id]: (name) => formValidatorFrontEnd.validateName(name, 'First Name'),
        [configs.lName.id]: (name) => formValidatorFrontEnd.validateName(name, 'Last Name'),
        [configs.email.id]: (email) => formValidatorFrontEnd.validateEmail(email),
        [configs.pWord.id]: (pword) => formValidatorFrontEnd.validatePassword(pword),
        [configs.pWRetype.id]: (pwrd2) =>
            formValidatorFrontEnd.validatePasswordRetype(pwrd2, extraData[configs.pWord.id]),
        [configs.uName.id]: (uname) => formValidatorFrontEnd.validateUserName(uname),
        [configs.uDesc.id]: (udescr) => formValidatorFrontEnd.validateUserDescription(udescr),
        [configs.uPict.id]: (file) => formValidatorFrontEnd.validateUserProfileImage(file),
        [configs.bDate.id]: (birthdate) => formValidatorFrontEnd.validateBirthDate(birthdate),
        [configs.race.id]: (race) => formValidatorFrontEnd.validateRace(race),
        [configs.gender.id]: (gend) => formValidatorFrontEnd.validateGender(gend),
        [configs.dataCollBasic.id]: (collB) => formValidatorFrontEnd.validateBasicDataCollection(collB),
    };

    const validator = validatorMethods[fieldID];
    let errorMessage = undefined;
    let isValid = undefined;

    // validate only required fields
    if (validator !== undefined && configs[fieldID].required) {
        let validateResult = validator(fieldValue);
        errorMessage = validateResult.errorMessage;
        isValid = validateResult.isValid;
    } else {
        isValid = true;
    }

    return {
        isValid,
        errorMessage,
        value: fieldValue,
    };
}

export default validateFieldFrontEnd;
