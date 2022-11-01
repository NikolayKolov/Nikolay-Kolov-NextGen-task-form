/**
 * receives the back end error response and the full form data,
 * matches the form field to the error and returns it so that
 * errors can be properly displayed to the user
 */

function matchBackEndErrors(backEndResponse, frontEndObject) {
    let errors = Object.keys(backEndResponse);
    errors.forEach((errorField) => {
        if (frontEndObject[errorField].value !== undefined) {
            frontEndObject = {
                ...frontEndObject,
                [errorField]: {
                    ...frontEndObject[errorField],
                    isValid: false,
                    errorMessage: backEndResponse[errorField].errorMessage,
                },
            };
        }
    });

    return frontEndObject;
}

export default matchBackEndErrors;
