export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const numberWithPoint = (x) => {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
}

export const formatToCUIT = (x) => {
    let cuil = x.toString();
    let firstpart = cuil.substr(0, 2);
    let secondpart = cuil.substr(2, 8);
    let thirdpart = cuil.substr(10, 1);
    return firstpart + "-" + secondpart + "-" + thirdpart;
}