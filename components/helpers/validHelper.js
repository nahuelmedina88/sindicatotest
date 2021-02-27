export function zfill(number, width) {
    var numberOutput = Math.abs(number); /* Valor absoluto del número */
    var length = number.toString().length; /* Largo del número */
    var zero = "0"; /* String de cero */

    if (width <= length) {
        if (number < 0) {
            return ("-" + numberOutput.toString());
        } else {
            return numberOutput.toString();
        }
    } else {
        if (number < 0) {
            return ("-" + (zero.repeat(width - length)) + numberOutput.toString());
        } else {
            return ((zero.repeat(width - length)) + numberOutput.toString());
        }
    }
}

export function validarFechaMenorActual(mydate) {
    let date = new Date();
    let anio = date.getFullYear();
    let mes = date.getMonth() + 1;
    let dia = date.getDate();

    anio = zfill(anio.toString(), 4);
    mes = zfill(mes.toString(), 2);
    dia = zfill(dia.toString(), 2);
    let currentDay = parseInt(anio + mes + dia);

    mydate = mydate.toString();
    let aniomydate = mydate.substr(0, 4);
    let mesmydate = mydate.substr(5, 2);
    let diamydate = mydate.substr(8, 2);

    let aaaammdd2 = parseInt(aniomydate + mesmydate + diamydate);
    let result = aaaammdd2 <= currentDay ? true : false;
    return result;
}

export function isAdult(mydate) {
    let date = new Date();
    let anio = date.getFullYear();
    let mes = date.getMonth() + 1;
    let dia = date.getDate();
    let anio2 = anio - 18;

    anio2 = zfill(anio2.toString(), 4);
    mes = zfill(mes.toString(), 2);
    dia = zfill(dia.toString(), 2);
    let adultDate = parseInt(anio2 + mes + dia);

    mydate = mydate.toString();
    let aniomydate = mydate.substr(0, 4);
    let mesmydate = mydate.substr(5, 2);
    let diamydate = mydate.substr(8, 2);

    let birthdate = parseInt(aniomydate + mesmydate + diamydate);
    let result = birthdate <= adultDate ? true : false;
    return result;
}