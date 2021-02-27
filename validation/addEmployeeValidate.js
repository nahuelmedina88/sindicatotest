import { validarFechaMenorActual, isAdult } from "../components/helpers/validHelper";

export default function addEmployeeValidate(values) {

    let errors = {};
    if (values.email) {
        let emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (!emailRegex.test(values.email)) {
            errors.email = "El email es invalido";
        }
    }
    if (values.dni) {
        let dni = values.dni.toString();
        console.log("dni: " + dni);
        console.log("longitud: " + dni.length);
        if (dni.length < 7 || dni.length > 9) {
            errors.dni = "El DNI debe tener entre 7 a 9 digitos.";
        }
    }
    if (values.birthdate) {
        if (validarFechaMenorActual(values.birthdate)) {
            if (!isAdult(values.birthdate)) {
                errors.birthdate = "El trabajador debe de ser mayor de 18 años.";
            }
        } else {
            errors.birthdate = "La fecha debe de ser anterior a la de hoy";
        }
    }
    if (values.admissiondate) {
        if (!validarFechaMenorActual(values.admissiondate)) {
            errors.admissiondate = "La fecha no puede ser posterior a hoy.";
        }
    }
    if (values.birthdateFamily) {
        if (!validarFechaMenorActual(values.birthdateFamily)) {
            errors.birthdateFamily = "La fecha debe de ser anterior a la de hoy.";
        }
    }
    if (values.company) {
        errors.company = "La compañia existe"
    }
    return errors;
}