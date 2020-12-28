export default function signinValidate(values) {

    let errors = {};

    if (!values.nombre) {
        errors.nombre = "El nombre es obligatorio";
    }
    if (!values.email) {
        errors.email = "El email es obligatorio";
    }
    if (!values.password) {
        errors.password = "El password es obligatorio";
    } else if (values.password.length < 6) {
        errors.password = "El password debe de ser al menos de 6 caracteres";
    }

    return errors;
}