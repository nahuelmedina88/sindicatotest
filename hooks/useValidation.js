import React, { useEffect, useState } from 'react';

const useValidation = (initialState, validate, fn) => {

    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [submitForm, setSubmitForm] = useState(false);

    useEffect(() => {
        if (submitForm) {
            console.log(submitForm);
            const noErrors = Object.keys(errors).length === 0;
            console.log(noErrors);
            if (noErrors) {
                fn();
            }
            setSubmitForm(true);
        }
    }, [errors]);

    const handleChange = e => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
    }

    const emptyInputs = () => {
        setValues(initialState);
    }

    const handleSubmit = e => {
        e.preventDefault();
        const validationErrors = validate(values);
        setErrors(validationErrors);
        setSubmitForm(true);
    }

    const handleBlur = () => {
        const validationErrors = validate(values);
        setErrors(validationErrors);
    }


    return {
        values,
        errors,
        submitForm,
        handleSubmit,
        handleChange,
        handleBlur,
        emptyInputs
    }
}

export default useValidation;