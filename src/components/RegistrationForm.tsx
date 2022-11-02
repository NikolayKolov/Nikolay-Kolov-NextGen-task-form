import React, { useRef, useState } from 'react';
import InputCheckbox from './inputs/InputCheckbox';
import InputDate from './inputs/InputDate';
import InputFile from './inputs/InputFile';
import InputLabel from './inputs/InputLabel';
import InputRadio from './inputs/InputRadio';
import InputSelect from './inputs/InputSelect';
import InputText from './inputs/InputText';
import InputTextArea from './inputs/InputTextArea';
import { IInputData } from './inputs/InputField';
import matchBackEndErrors from '../utils/formMatchBackendErrors';
import validateFieldFrontEnd from '../utils/validateFieldFrontEnd';
import { validateRegistrationForm } from '../api/API';

const fieldsConfig = require('../utils/formFields.json');

/**
 * The main form that contains all the inputs with the submit button
 * Also displays a status on error from both front and back end, succesful validation and timeout warning
 * When the user clicks submit, the form checks all fields and validates them in the front end.
 * If there is an error, the form won't submit to server and appropriate warnings will appear below each invalid field.
 * If the data is valid in front end, on submit the submit button with turn into a cancel button that will
 * cancel the pending registration and a 'You cancelled your pending registration!' message will appear.
 * The mock server will respond in 2 seconds. Inputs are disabled during form submission to server.
 * The server will perform all front end validation, as data can be submitted without a browser.
 * The server will also perform its own back end validation and return results.
 * On success, the code 200 OK and the username for the registered user.
 * On error, the code 500 with an object containing errors for fields.
 * The mock server will time out once on the first form submission, but succeed on all other.
 * The form fields are configured with an external JSON file - formFields.json.
 * The JSON contains an object with each property being the field id and containing an object with the following properties:
 *  - id                    - the field id, is also the field object property
 *  - description           - a short description
 *  - type                  - field type, can be "text", "file", "password", "date" or "boolean"
 *  - required              - if the field is required and whether it needs to pass front end validation
 *  - backEndValidation     - if the field needs to pass a back end validation, used by back end
 *
 * In this mock user registration form where the user has to fill in:
 * first and last name (input[type="text"]),
 * email (input[type="text"] with email verification),
 * username (input[type="text"]),
 * user profile description (textarea),
 * upload a user profile image (input[type="file"]),
 * enter and repeat a password (input[type="password"]),
 * race (select),
 * birth date (input[type="date"]),
 * gender (input[type="radio"]),
 * agree to data collection (input[type="checkbox"])
 */

interface IFormField {
    isValid: undefined | boolean;
    errorMessage: undefined | string;
    value: string | File | boolean;
}

// The form data that is kept in the state
interface IFormData {
    [key: string]: IFormField;
}

interface IFormStatus {
    status: string;
    statusDescription: string;
}

const RegistrationForm: React.FC<{}> = () => {
    // initialize field names for ease of access for setting field ids, typing validation, etc
    const fName = fieldsConfig.fName.id;
    const lName = fieldsConfig.lName.id;
    const email = fieldsConfig.email.id;
    const uName = fieldsConfig.uName.id;
    const uDesc = fieldsConfig.uDesc.id;
    const uPict = fieldsConfig.uPict.id;
    const pWord = fieldsConfig.pWord.id;
    const pWRetype = fieldsConfig.pWRetype.id;
    const race = fieldsConfig.race.id;
    const gender = fieldsConfig.gender.id;
    const bDate = fieldsConfig.bDate.id;
    const dataCollBasic = fieldsConfig.dataCollBasic.id;
    const dataCollExt = fieldsConfig.dataCollExt.id;

    /**
     * initialize formData object from array of form fields
     * the object has the structure. Used for performing data checks and displaying
     * the appropriate error messages
     * {
     *  fieldName1: {
     *    isValid: undefined | boolean,
     *    errorMessage: undefined | string,
     *    value: '' | boolean | {}
     *  },
     *  fieldName2: {...
     * }
     */
    const [formData, setFormData] = useState<IFormData>(() => {
        const arrayFields = Object.keys(fieldsConfig);
        let initState = arrayFields.reduce((obj, fieldID) => {
            const field = fieldsConfig[fieldID];
            let fieldObj: any = {
                isValid: undefined,
                errorMessage: undefined,
            };

            // Initialize values for form validation
            // boolean value for check boxes, string for all else except file
            if (field.type === 'boolean') {
                fieldObj.value = false;
            }
            // an object value for file input
            else if (field.type === 'file') {
                fieldObj.value = undefined;
            }
            // string value for all other inputs
            else {
                fieldObj.value = '';
            }

            return Object.assign(obj, { [fieldID]: fieldObj });
        }, {});

        return initState;
    });

    /**
     * variables for handling the request send and response triggered on form submit
     * The status options are 'idle',
     * 'loading' - when the form has triggered submit and is waiting for a response,
     * 'timeout' - when the server took too long to respond,
     * 'error' - when the server returns a failed validation with a list of errors to display to user,
     * 'success' - when the form validates user registration and returns the user name
     */
    const [formStatus, setFormStatus] = useState<IFormStatus>({
        status: 'idle',
        statusDescription: '',
    });
    // AbortController for the form submit request
    const abortControllerRef = useRef<AbortController | null>(null);

    // on input, handle front end data validation
    const handleInput = (e: IInputData): void => {
        const forId = e.id;
        const forIdValue = e.value;

        // if the field is not required, don't perform data validation
        if (!fieldsConfig[forId].required) {
            setFormData((prev) => ({
                ...prev,
                [forId]: {
                    isValid: true,
                    errorMessage: undefined,
                    value: forIdValue,
                },
            }));

            return;
        }

        const resultValidateField = validateFieldFrontEnd(forId, forIdValue, {
            [pWord]: formData[pWord].value,
        });

        setFormData((prev) => ({
            ...prev,
            [forId]: {
                isValid: resultValidateField.isValid,
                errorMessage: resultValidateField.errorMessage,
                value: forIdValue,
            },
        }));

        // if we change password and password retype is not empty, check to see if it now matches the new password
        if (forId === pWord && formData[pWRetype].isValid !== undefined) {
            let resultValidateRetypePassword = validateFieldFrontEnd(pWRetype, formData[pWRetype].value, {
                [pWord]: forIdValue,
            });
            setFormData((prev) => ({
                ...prev,
                [pWRetype]: {
                    isValid: resultValidateRetypePassword.isValid,
                    errorMessage: resultValidateRetypePassword.errorMessage,
                    value: formData[pWRetype].value,
                },
            }));
        }

        if (formStatus.status !== 'idle') {
            setFormStatus({ status: 'idle', statusDescription: '' });
        }
    };

    // validate all form data before submitting
    const handleSubmit = async () => {
        let formProps = Object.keys(formData);
        let isValid = true;

        formProps.forEach((field) => {
            // Ignore not required fields
            if (!fieldsConfig[field].required) {
                return;
            }

            if (formData[field].isValid === false) {
                if (isValid) isValid = false;
            } else if (formData[field].isValid === undefined) {
                let resultValidateField = validateFieldFrontEnd(field, formData[field].value, {
                    [pWord]: formData[pWord].value,
                });
                if (isValid && !resultValidateField.isValid) isValid = false;

                setFormData((prev) => ({
                    ...prev,
                    [field]: {
                        isValid: resultValidateField.isValid,
                        errorMessage: resultValidateField.errorMessage,
                        value: prev[field].value,
                    },
                }));
            }
        });

        // only submit if form data is valid
        if (!isValid) return;

        // set the FormData for the response
        let bodyFormData: FormData = new FormData();
        formProps.forEach((field) => {
            let fieldValue: File | string;
            if (typeof formData[field].value === 'boolean') fieldValue = formData[field].value.toString();
            else fieldValue = formData[field].value as File | string;
            bodyFormData.append(field, fieldValue);
        });

        // if there is a current pending request, abort it
        if (abortControllerRef.current !== null) {
            abortControllerRef.current.abort();
            setFormStatus({
                status: 'canceled',
                statusDescription: 'You cancelled your pending registration!',
            });
            return;
        }
        setFormStatus({
            status: 'loading',
            statusDescription: 'Connecting to server, please wait...',
        });
        let resp;
        abortControllerRef.current = new AbortController();
        try {
            resp = await validateRegistrationForm(bodyFormData, {
                signal: abortControllerRef.current.signal,
            });
            if (resp.data.validation === 'success') {
                setFormStatus({
                    status: 'success',
                    statusDescription: `Registration successful for user ${resp.data.username}!`,
                });
            }
        } catch (e) {
            // otherwise TypeScript will type e as unknown and throw errors
            const error = e as any;
            const errorCode: string = error?.code ? error.code : error?.message ? error.message : 'unknownError';
            if (errorCode === 'canceled') {
                setFormStatus({
                    status: 'canceled',
                    statusDescription: 'You cancelled your pending registration!',
                });
            } else if (errorCode === 'ECONNABORTED' || errorCode.toLowerCase().includes('timeout')) {
                setFormStatus({
                    status: 'timedout',
                    statusDescription: 'Request timed out, please try again.',
                });
            } else {
                setFormStatus({
                    status: 'error',
                    statusDescription: 'Please fix the following errors to complete registration.',
                });
                const errorResp = error?.response?.data ?? {
                    errorField: {
                        errorMessage: '',
                    },
                };
                const errorData = matchBackEndErrors(errorResp, formData);
                setFormData(errorData);
            }
        } finally {
            abortControllerRef.current = null;
        }
    };

    let submitButtonClassName = 'form--submit-button';
    let submitMessageClassName = 'form--message';
    if (formStatus.status === 'loading') {
        submitButtonClassName += ' form--submit-button__cancel-pending';
        submitMessageClassName += ' form--message__warning';
    }
    if (formStatus.status === 'canceled' || formStatus.status === 'timedout') {
        submitMessageClassName += ' form--message__warning';
    }
    if (formStatus.status === 'error') {
        submitMessageClassName += ' form--message__error';
    }

    if (formStatus.status === 'success') {
        submitMessageClassName += ' form--message__success';
    }

    return (
        <section className="form--container">
            <h1 className="form--title">Registration form</h1>
            <h2 className="form--subtitle">Please fill in the required information in order to register</h2>
            <form autoComplete="off">
                <div className="form-row">
                    <div className="form-row--label">
                        <InputLabel id={fName} label="Your Name" required={fieldsConfig[fName].required} />
                    </div>
                    <div className="form-row--inputs">
                        <div className="form-row--inputs form-row__no-margin">
                            <InputText
                                id={fName}
                                placeholder="Enter first name"
                                required={fieldsConfig[fName].required}
                                onBlur={handleInput}
                                valid={formData[fName].isValid}
                                disabled={formStatus.status === 'loading'}
                                errorMessage={formData[fName].errorMessage}
                                maxLength={30}
                            />
                            <InputText
                                id={lName}
                                placeholder="Enter last name"
                                required={fieldsConfig[lName].required}
                                onBlur={handleInput}
                                valid={formData[lName].isValid}
                                disabled={formStatus.status === 'loading'}
                                errorMessage={formData[lName].errorMessage}
                                maxLength={30}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-row--label">
                        <InputLabel id={email} label="Email" required={fieldsConfig[email].required} />
                    </div>
                    <div className="form-row--inputs">
                        <InputText
                            id={email}
                            placeholder="eg: hello@register.me"
                            required={fieldsConfig[email].required}
                            onBlur={handleInput}
                            valid={formData[email].isValid}
                            disabled={formStatus.status === 'loading'}
                            errorMessage={formData[email].errorMessage}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-row--label">
                        <InputLabel id={uName} label="User Name" required={fieldsConfig[uName].required} />
                    </div>
                    <div className="form-row--inputs">
                        <InputText
                            id={uName}
                            placeholder="No empty spaces, no underscores"
                            required={fieldsConfig[uName].required}
                            onBlur={handleInput}
                            valid={formData[uName].isValid}
                            disabled={formStatus.status === 'loading'}
                            errorMessage={formData[uName].errorMessage}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-row--label">
                        <InputLabel id={uDesc} label="User Details" required={fieldsConfig[uDesc].required} />
                    </div>
                    <div className="form-row--inputs">
                        <InputTextArea
                            id={uDesc}
                            placeholder="Enter user profile description here"
                            required={fieldsConfig[uDesc].required}
                            onBlur={handleInput}
                            valid={formData[uDesc].isValid}
                            disabled={formStatus.status === 'loading'}
                            errorMessage={formData[uDesc].errorMessage}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-row--label">
                        <InputLabel id={uPict} label="User Profile Picture" required={fieldsConfig[uPict].required} />
                    </div>
                    <div className="form-row--inputs">
                        <InputFile
                            id={uPict}
                            required={fieldsConfig[uPict].required}
                            valid={formData[uPict].isValid}
                            disabled={formStatus.status === 'loading'}
                            errorMessage={formData[uPict].errorMessage}
                            onFileSelect={handleInput}
                            fileFormats=".jpg, .jpeg, .png"
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-row--label">
                        <InputLabel id={pWord} label="Password" required={fieldsConfig[pWord].required} />
                    </div>
                    <div className="form-row--inputs">
                        <InputText
                            id={pWord}
                            type="password"
                            placeholder="Length: 7-30 characters, minumum 1 capital letter and number"
                            required={fieldsConfig[pWord].required}
                            onBlur={handleInput}
                            valid={formData[pWord].isValid}
                            errorMessage={formData[pWord].errorMessage}
                            disabled={formStatus.status === 'loading'}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-row--label">
                        <InputLabel id={pWRetype} label="Retype Password" required={fieldsConfig[pWRetype].required} />
                    </div>
                    <div className="form-row--inputs">
                        <InputText
                            id={pWRetype}
                            type="password"
                            placeholder="Retype the password to confirm it"
                            required={fieldsConfig[pWRetype].required}
                            onBlur={handleInput}
                            valid={formData[pWRetype].isValid}
                            errorMessage={formData[pWRetype].errorMessage}
                            disabled={formStatus.status === 'loading'}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-row--label">
                        <InputLabel id={race} label="Race" required={fieldsConfig[race].required} />
                    </div>
                    <div className="form-row--inputs">
                        <InputSelect
                            id={race}
                            placeholder="Choose a race"
                            required={fieldsConfig[race].required}
                            onChange={handleInput}
                            valid={formData[race].isValid}
                            disabled={formStatus.status === 'loading'}
                            errorMessage={formData[race].errorMessage}
                            options={[
                                { value: 'white', label: 'White' },
                                { value: 'asian', label: 'Asian' },
                                { value: 'black', label: 'Black' },
                                { value: 'notsay', label: 'Prefer not to say' },
                            ]}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-row--label">
                        <InputLabel id={bDate} label="Birth Date" required={fieldsConfig[bDate].required} />
                    </div>
                    <div className="form-row--inputs">
                        <InputDate
                            id={bDate}
                            required={fieldsConfig[bDate].required}
                            onChange={handleInput}
                            valid={formData[bDate].isValid}
                            errorMessage={formData[bDate].errorMessage}
                            disabled={formStatus.status === 'loading'}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-row--label">
                        <InputLabel id={gender} label="Gender" required={fieldsConfig[gender].required} />
                    </div>
                    <div className="form-row--inputs">
                        <InputRadio
                            id={gender}
                            required={fieldsConfig[gender].required}
                            onChange={handleInput}
                            valid={formData[gender].isValid}
                            errorMessage={formData[gender].errorMessage}
                            disabled={formStatus.status === 'loading'}
                            options={[
                                { value: 'male', label: 'Male' },
                                { value: 'female', label: 'Female' },
                                { value: 'notSay', label: 'Prefer not to say' },
                            ]}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-row--label">
                        <InputLabel
                            id="agree"
                            label="Data collection"
                            required={fieldsConfig[dataCollBasic].required}
                        />
                    </div>
                    <div className="form-row--inputs">
                        <div className="form-row--inputs form-row__no-margin">
                            <InputCheckbox
                                id={dataCollBasic}
                                label="Agree to basic data collection"
                                required={fieldsConfig[dataCollBasic].required}
                                valid={formData[dataCollBasic].isValid}
                                errorMessage={formData[dataCollBasic].errorMessage}
                                onChange={handleInput}
                                disabled={formStatus.status === 'loading'}
                            />
                            <InputCheckbox
                                id={dataCollExt}
                                label="Agree to expanded data collection"
                                required={fieldsConfig[dataCollExt].required}
                                valid={formData[dataCollExt].isValid}
                                errorMessage={formData[dataCollExt].errorMessage}
                                onChange={handleInput}
                                disabled={formStatus.status === 'loading'}
                            />
                        </div>
                    </div>
                </div>
                <div className="form--submit-section">
                    <div className={submitButtonClassName} onClick={handleSubmit}>
                        {formStatus.status === 'loading' ? 'Cancel' : 'Submit'}
                    </div>
                    <div className={submitMessageClassName}>{formStatus.statusDescription}</div>
                </div>
            </form>
        </section>
    );
};

export default RegistrationForm;
