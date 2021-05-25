import { validarFechaMenorActual, isAdult } from "../components/helpers/validHelper";

export default function validation(values) {

    let errors = {};

    if (!values.nombre) {
        errors.nombre = 'Ingrese el nombre';
    }
    if (!values.apellido) {
        errors.apellido = 'Ingrese el apellido';
    }
    if (!values.calle) {
        errors.calle = 'Ingrese la calle';
    }
    // if (!values.numero_calle) {
    //     errors.numero_calle = 'Ingrese el número de la calle';
    // }
    // if (!values.ciudad) {
    //     errors.ciudad = 'Ingrese la ciudad';
    // }
    // if (!values.codigo_postal) {
    //     errors.codigo_postal = 'Ingrese el código postal';
    // }
    if (!values.dni) {
        errors.dni = 'El DNI es obligatorio';
    } else if (values.dni) {
        let dni = values.dni.toString();
        if (dni.length < 7 || dni.length > 9) {
            errors.dni = "El DNI debe tener entre 7 a 9 digitos.";
        }
    }
    if (!values.fecha_nacimiento) {
        errors.fecha_nacimiento = 'Ingrese la fecha de nacimiento';
    } else if (values.fecha_nacimiento) {
        if (validarFechaMenorActual(values.fecha_nacimiento)) {
            if (!isAdult(values.fecha_nacimiento)) {
                errors.fecha_nacimiento = "El trabajador debe de ser mayor de 18 años.";
            }
        } else {
            errors.fecha_nacimiento = "La fecha debe de ser anterior a la de hoy";
        }
    }
    if (!values.nacionalidad) {
        errors.nacionalidad = 'Ingrese la nacionalidad';
    }
    if (!values.estado_civil) {
        errors.estado_civil = 'Seleccione un estado civil';
    }
    // if (!values.email) {
    //     errors.email = 'El email es obligatorio';
    // } else if (values.email) {
    //     let emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    //     if (!emailRegex.test(values.email)) {
    //         errors.email = "El email es invalido";
    //     }
    // }
    // if (!values.telefono) {
    //     errors.telefono = 'El teléfono es obligatorio';
    // }
    if (!values.nroLegajo) {
        errors.nroLegajo = 'El Nro de Legajo es obligatorio';
    }
    if (!values.fecha_ingreso) {
        errors.fecha_ingreso = 'Ingrese la fecha de ingreso';
    } else if (values.fecha_ingreso) {
        if (!validarFechaMenorActual(values.fecha_ingreso)) {
            errors.fecha_ingreso = "La fecha no puede ser posterior a hoy.";
        }
    }
    if (Object.keys(values.seccion).length === 0) {
        errors.seccion = 'Seleccione una sección';
    }
    if (Object.keys(values.categoria).length === 0) {
        errors.categoria = 'Seleccione una Categoría';
    }

    if (Object.keys(values.empresa).length === 0) {
        errors.empresa = 'Seleccione una empresa';
    }
    return errors;
}