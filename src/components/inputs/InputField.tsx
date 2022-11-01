import React from 'react';

// The base interface for all input components in the app
export interface IInputField {
    id: string;
    required: boolean;
    valid?: boolean;
    disabled: boolean;
    errorMessage?: string;
    label?: string;
    children?: any;
}

// Interface for the input field data that it returns
export interface IInputData {
    id: string;
    value: any;
}

/**
 * input base component
 * Contains general styling for invalid case and error message options
 */

const InputField: React.FC<IInputField> = (props) => {
    const { id, label, disabled, required, errorMessage, children } = props;
    let cssClassLabel = 'input__label';
    if (!disabled) {
        cssClassLabel += ' input__label--disabled';
    }

    return (
        <div className="input__main-container">
            {/* The main container that has the input and the error message that will be displayed below it */}
            <div className="input__container">
                {/* contains the input and label */}
                {
                    label && (
                        <label className={cssClassLabel} htmlFor={id}>
                            {label}
                            {required && <span className="input__label--required">*</span>}
                        </label>
                    )
                    /* this label is optional, currently unused, use component InputLabel instead due to form design */
                }
                {children}
            </div>
            {
                errorMessage && (
                    <div className="input__error-message">{errorMessage}</div>
                ) /* error message will only be visible if it actually is set */
            }
        </div>
    );
};

export default InputField;
