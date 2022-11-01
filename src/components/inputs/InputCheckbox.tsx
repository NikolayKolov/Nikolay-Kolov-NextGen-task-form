import React from 'react';
import InputField, { IInputField, IInputData } from './InputField';

interface IInputCheckBox extends IInputField {
    onChange: (inputData: IInputData) => void;
}

/**
 * input check box
 */
const InputCheckbox: React.FC<IInputCheckBox> = (props) => {
    const { id, label, required, valid, disabled, errorMessage, onChange } = props;

    // set the CSS display style if the component is valid or not
    let cssClassName = 'checkbox-input';
    if (valid === false) {
        cssClassName += ' checkbox__error';
    }
    if (disabled) {
        cssClassName += ' checkbox__disabled';
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // return the value in the appropriate format
        if (onChange) {
            const checkboxInputData: IInputData = {
                id: e.target.id,
                value: e.target.checked,
            };
            onChange(checkboxInputData);
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
            <div className={cssClassName}>
                <input type="checkbox" id={id} onChange={handleOnChange} disabled={disabled} />
                {label && (
                    <label className="checkbox__label" htmlFor={id}>
                        {label}
                        {required && <span className="input__label--required">*</span>}
                    </label>
                )}
            </div>
        </InputField>
    );
};

export default InputCheckbox;
