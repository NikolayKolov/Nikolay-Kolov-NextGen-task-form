import React from 'react';
import InputField, { IInputField, IInputData } from './InputField';

interface ISelectOptions {
    label: string;
    value: string;
}

// interface exported for component InputRadio to reuse
export interface IInputSelect extends IInputField {
    // The default value that will be displayed
    placeholder?: string;
    onChange: (inputData: IInputData) => void;
    options: ISelectOptions[];
}

/**
 * input select
 */
const InputSelect: React.FC<IInputSelect> = (props) => {
    const { id, label, placeholder, options, required, disabled, valid, errorMessage, onChange } = props;

    // set the CSS display style if the component is valid or not
    let cssClassName = 'select-input';
    if (valid === false) {
        cssClassName += ' select-input__error';
    }

    // return the value in the appropriate format, this is the methods used in the form
    const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        if (onChange) {
            const selectInputData: IInputData = {
                id,
                value: e.target.value,
            };
            onChange(selectInputData);
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
                <select
                    id={id}
                    onChange={handleOnChange}
                    disabled={disabled}
                    defaultValue={placeholder && 'placeholder'}
                >
                    {placeholder && (
                        <option value="placeholder" disabled>
                            {placeholder}
                        </option>
                    )}
                    {/* use placeholder prop as selected disabled option */}
                    {options.map((opt) => (
                        <option value={opt.value} key={opt.value}>
                            {opt.label}
                        </option> /* list of actual selectable options */
                    ))}
                </select>
            </div>
        </InputField>
    );
};

export default InputSelect;
