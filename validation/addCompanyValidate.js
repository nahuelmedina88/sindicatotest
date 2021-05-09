export default function validation(values) {
    let errors = {};

    if (!values.nombre) {
        errors.nombre = 'Ingrese el nombre de la empresa';
    }
    if (!values.ciudad) {
        errors.ciudad = "Ingrese la ciudad";
    }
    if (!values.calle) {
        errors.calle = "Ingrese la calle";
    }
    if (!values.numero_calle) {
        errors.numero_calle = "Ingrese el número";
    }
    if (!values.cuit) {
        errors.cuit = 'Ingrese el CUIT';
    } else if (values.cuit > 99999999999 || values.cuit < 9999999999) {
        errors.cuit = 'El CUIT debe de ser de 11 digitos';
    }
    if (!values.razonSocial) {
        errors.razonSocial = "Ingrese la Razón Social";
    }
    return errors;
}