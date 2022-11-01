import React from 'react';
import InputField, { IInputField, IInputData } from './InputField';

// interface exported for component InputTextArea to inherit
export interface IInputText extends IInputField {
    placeholder: string;
    onBlur: (inputData: IInputData) => void;
    onChange?: (inputData: IInputData) => void;
    maxLength?: number;
    type?: 'text' | 'password';
}

/**
 * input text / password
 * Use type prop to switch between the two, default is text
 */
const InputText: React.FC<IInputText> = (props) => {
    const {
        id,
        label,
        placeholder,
        type = 'text',
        required,
        disabled,
        valid,
        errorMessage,
        maxLength,
        onChange,
        onBlur,
    } = props;

    // set the CSS display style if the component is valid or not
    let cssClassName = 'text-input';
    if (valid === false) {
        cssClassName += ' text-input__error';
    }

    // return the value in the appropriate format, unused in the app
    // if used, it would perform validity checks on user typing,
    // which will get tedious
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (onChange) {
            const textInputData: IInputData = {
                id,
                value: e.target.value,
            };
            onChange(textInputData);
        }
    };

    // return the value in the appropriate format, this is the methods used in the form
    const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
        if (onBlur) {
            const textInputData: IInputData = {
                id,
                value: e.target.value,
            };
            onBlur(textInputData);
        }
    };

    return (
        <InputField
            id={id}
            label={label}
            disabled={disabled}
            required={required}
            errorMessage={errorMessage}
            valid={valid}
        >
            <input
                className={cssClassName}
                type={type}
                id={id}
                placeholder={placeholder}
                onChange={handleOnChange}
                onBlur={handleOnBlur}
                maxLength={maxLength}
                disabled={disabled}
                /**
                 * disables autofill for Chrome, but not autocomplete due to a Chrome issue
                 * autofill had to be handled in a more roundabout way (useRef + useEffect + setTimeout)
                 * autocomplete works ok on Chrome
                 * disables both autofill and autocomplete for Mozilla and Edge
                 */
                autoComplete={type === 'text' ? 'nope' : 'new-password'}
                required={required ? true : false}
            />
        </InputField>
    );
};

export default InputText;
