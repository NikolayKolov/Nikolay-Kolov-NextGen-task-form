import React, { useState } from 'react';
import InputField, { IInputField, IInputData } from './InputField';

interface IInputFile extends IInputField {
    fileFormats?: string;
    onFileSelect: (inputData: IInputData) => void;
}

/**
 * File input
 */
const InputFile: React.FC<IInputFile> = (props) => {
    const { id, label = 'Select file', required, disabled, valid, fileFormats, errorMessage, onFileSelect } = props;
    // because we hide the HTML file input, we use this to display the name of the selected file
    const [fileName, setFileName] = useState('');

    // set the CSS display style if the component is valid or not
    let cssClassName = 'input-file--label';
    if (valid === false) {
        cssClassName += ' input-file--label__error';
    }
    if (disabled) {
        cssClassName += ' input-file--label__disabled';
    }

    // return the value in the appropriate format, this is the methods used in the form
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        let returnValue: File | '';

        if (e.target.files && e.target.files.length === 1) {
            setFileName(e.target.files[0].name);
            returnValue = e.target.files[0];
        } else {
            setFileName('');
            returnValue = '';
        }

        if (onFileSelect) {
            const fileInputData: IInputData = {
                id,
                value: returnValue,
            };
            onFileSelect(fileInputData);
        }
    };

    // Don't pass label to the InputField component, it is needed to custom handle the label in this component
    return (
        <InputField
            id={id}
            label={undefined}
            disabled={disabled}
            required={required}
            errorMessage={errorMessage}
            valid={valid}
        >
            {/* 
                    since the HTML input file is hidden we use the label for displaying
                    the component and the for property to open the file dialog on click 
                */}
            <label className={cssClassName} htmlFor={id}>
                {label}
                {required && <span className="input__label--required">*</span>}
            </label>
            <input type="file" id={id} accept={fileFormats} onChange={handleOnChange} disabled={disabled} />
            <span className="input-file--filename">{fileName === '' ? 'No file selected' : fileName}</span>{' '}
            {/* Selected file name */}
        </InputField>
    );
};

export default InputFile;
