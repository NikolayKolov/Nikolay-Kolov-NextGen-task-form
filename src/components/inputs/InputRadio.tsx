import React from 'react';
import { IInputSelect } from './InputSelect';
import InputField, { IInputData } from './InputField';

/**
 * input radio
 */
const InputRadio: React.FC<IInputSelect> = (props) => {
    const { id, label, options, required, disabled, valid, errorMessage, onChange } = props;

    // set the CSS display style if the component is valid or not
    let cssClassName = 'radio-input';
    if (valid === false) {
        cssClassName += ' radio-input__error';
    }

    // return the value in the appropriate format
    const handleOnChange = (e: React.MouseEvent<HTMLInputElement>): void => {
        const elementTarget = e.target as HTMLInputElement;
        if (onChange) {
            const radioInputData: IInputData = {
                id: elementTarget.name,
                value: elementTarget.value,
            };
            onChange(radioInputData);
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
                {/* input radio placed inside label to make a click on it select the option  */}
                {options.map((opt) => (
                    <label key={opt.value}>
                        <input type="radio" name={id} value={opt.value} onClick={handleOnChange} disabled={disabled} />
                        {opt.label}
                    </label>
                ))}
            </div>
        </InputField>
    );
};

export default InputRadio;
