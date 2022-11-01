import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import validateFieldFrontEnd from '../utils/validateFieldFrontEnd';
import validateFieldBackEnd from '../utils/validateFieldBackEnd';

const fieldsConfig = require('../utils/formFields.json');

const apiConfig = require('./apiConfig.json');

const axiosClient = axios.create({
    baseURL: 'http://mock.req/api/',
    timeout: 1000,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

/**
 * Main configuration for the Axios mock adapter
 * Here it will create the mock client and handle POST requests
 * The first attempt to post something will result in a timeout
 * The subsequent POST will trigger a normal form validation and response
 */
const mock = new AxiosMockAdapter(axiosClient, { delayResponse: 2000 });
mock.onPost(apiConfig.endPoints.registrationValidationURL)
    .timeoutOnce()
    .onPost(apiConfig.endPoints.registrationValidationURL)
    .reply((config) => {
        const pWord = fieldsConfig.pWord.id;
        const uName = fieldsConfig.uName.id;
        let isValid = true;
        let errorMessages = {};
        // repeat back end validation, as a POST request can be triggered without a form
        const arrayFieldIDs = Object.values(fieldsConfig).map((field) => field.id);
        arrayFieldIDs.forEach((field) => {
            let value = config.data.get(field);
            let resultValidateField;
            // skip not required fields for front end validation
            if (!fieldsConfig[field].required) {
                resultValidateField = {
                    isValid: true,
                };
            } else {
                resultValidateField = validateFieldFrontEnd(field, value, {
                    [pWord]: config.data.get(pWord),
                });
            }

            if (isValid && !resultValidateField.isValid) isValid = false;

            if (!resultValidateField.isValid) {
                errorMessages = {
                    ...errorMessages,
                    [field]: {
                        errorMessage: resultValidateField.errorMessage,
                    },
                };
            }
        });

        // handle the back end validation here
        const arrayBackEndFields = Object.values(fieldsConfig).reduce((acc, field) => {
            field.backEndValidation && acc.push(field.id);
            return acc;
        }, []);
        arrayBackEndFields.forEach((field) => {
            const fieldID = field;
            let value = config.data.get(fieldID);
            let resultValidateField;
            // skip not required fields for back end validation
            if (!fieldsConfig[fieldID].required) {
                resultValidateField = {
                    isValid: true,
                };
            } else {
                resultValidateField = validateFieldBackEnd(fieldID, value);
            }

            if (isValid && !resultValidateField.isValid) isValid = false;

            if (!resultValidateField.isValid) {
                // combine front and back end errors for the same field
                let previousErrorMessage = '';
                if (fieldID in errorMessages) {
                    previousErrorMessage = errorMessages[fieldID].errorMessage + ' ';
                }
                errorMessages = {
                    ...errorMessages,
                    [fieldID]: {
                        errorMessage:
                            previousErrorMessage !== ''
                                ? previousErrorMessage + resultValidateField.errorMessage
                                : resultValidateField.errorMessage,
                    },
                };
            }
        });

        // return status success and a valid username upon validation,
        // else return a list of all the errors found
        if (isValid) {
            return [200, { validation: 'success', username: config.data.get(uName) }];
        } else {
            return [500, errorMessages];
        }
    });

export const get = (query, options = undefined) => {
    return axiosClient.get(query, options);
};

export const post = (query, payload, options = undefined) => {
    return axiosClient.post(query, payload, options);
};
