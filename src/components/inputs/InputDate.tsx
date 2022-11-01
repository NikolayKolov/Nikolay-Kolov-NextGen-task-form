import React from 'react';
import InputField, { IInputField, IInputData } from './InputField';

interface IInputDate extends IInputField {
    onBlur?: (inputData: IInputData) => void;
    onChange: (inputData: IInputData) => void;
}

/**
 * input date
 */
const InputDate: React.FC<IInputDate> = (props) => {
    const { id, label, required, valid, errorMessage, disabled, onChange, onBlur } = props;

    // set the CSS display style if the component is valid or not
    let cssClassName = 'text-input';
    if (valid === false) {
        cssClassName += ' text-input__error';
    }

    // return the value in the appropriate format, this is the methods used in the form
    // because the user can deselect a date by clicking the calendar button
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (onChange) {
            const dateInputData: IInputData = {
                id: e.target.id,
                value: e.target.value,
            };
            onChange(dateInputData);
        }
    };

    // return the value in the appropriate format, unused in the app
    const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
        onBlur && onBlur(e.target);
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
                type="date"
                id={id}
                onChange={handleOnChange}
                onBlur={handleOnBlur}
                disabled={disabled}
            />
        </InputField>
    );
};

export default InputDate;
