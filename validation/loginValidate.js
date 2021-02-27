export default function loginValidate(values) {

    let errors = {};

    if (!values.email) {
        errors.email = "El email es obligatorio";
    }
    if (values.email) {
        let emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (!emailRegex.test(values.email)) {
            errors.email = "El email es invalido";
        }
    }
    if (!values.password) {
        errors.password = "El password es obligatorio";
    } else if (values.password.length < 6) {
        errors.password = "El password debe de ser al menos de 6 caracteres";
    }

    return errors;
}