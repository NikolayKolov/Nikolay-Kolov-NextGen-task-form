import React from 'react';

interface IInputLabel {
    id: string;
    label: string;
    required: boolean;
}

/**
 * Input label with htmlFor, used in the form on the left side of the rows
 */
const InputLabel: React.FC<IInputLabel> = (props) => {
    const { id, label, required } = props;

    return (
        <div className="input__main-container">
            <label className="input__label" htmlFor={id}>
                {label}
                {required && <span className="input__label--required">*</span>}
            </label>
        </div>
    );
};

export default InputLabel;
