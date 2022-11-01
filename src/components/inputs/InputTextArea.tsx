import React from 'react';
import { IInputText } from './InputText';
import InputField, { IInputData } from './InputField';

export interface IInputTextArea extends Omit<IInputText, 'type' | 'label'> {
    rows?: number;
}

/**
 * input text area
 */
const InputTextArea: React.FC<IInputTextArea> = (props) => {
    const {
        id,
        placeholder,
        valid,
        disabled,
        required,
        errorMessage,
        maxLength = 2000,
        rows = 4,
        onChange,
        onBlur,
    } = props;

    // set the CSS display style if the component is valid or not
    let cssClassName = 'textarea-input';
    if (valid === false) {
        cssClassName += ' textarea-input__error';
    }

    // return the value in the appropriate format, unused in the app
    // if used, it would perform validity checks on user typing,
    // which will get tedious
    const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        if (onChange) {
            const objReturn: IInputData = {
                id: e.target.id,
                value: e.target.value,
            };
            onChange(objReturn);
        }
    };

    // return the value in the appropriate format, this is the methods used in the form
    const handleOnBlur = (e: React.FocusEvent<HTMLTextAreaElement>): void => {
        if (onBlur) {
            const objReturn: IInputData = {
                id: e.target.id,
                value: e.target.value,
            };
            onBlur(objReturn);
        }
    };

    return (
        <InputField id={id} disabled={disabled} required={required} errorMessage={errorMessage} valid={valid}>
            <textarea
                id={id}
                className={cssClassName}
                placeholder={placeholder}
                rows={rows}
                maxLength={maxLength}
                disabled={disabled}
                onChange={handleOnChange}
                onBlur={handleOnBlur}
            />
        </InputField>
    );
};

export default InputTextArea;
