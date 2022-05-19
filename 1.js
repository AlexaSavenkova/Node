const {green, yellow, red} = require("colors/safe");

const isPrime = (number) => {
    if (number < 2) return false;
    for (let i = 2; i <= number / 2; i++) {
        if (number % i === 0) return false;
    }
    return true;
};

const getColor = (count) => {
    switch (count) {
        case 1: return green;
        case 2: return  yellow;
        case 3: return red;
    }
}

const printPrimeNimbers = (from, to) => {
    let colorer = red;
    if (isNaN(from) || isNaN(to)) {
        console.log(colorer('Аргументы должны быть числами !!! '))
        return;
    }

    from = parseInt(from);
    to = parseInt(to);

    if (from > to) {
        console.log(colorer('Первый аргумент должен быть меньше или равен второму !!! '))
        return;
    }
    let count = 1;
    let noPrimeNumbers = true;
    for (let number = from; number <= to; number++) {
        if (isPrime(number)) {
            noPrimeNumbers = false;
            colorer = getColor(count);
            console.log(colorer(number));
            count === 3 ? count = 1 : count++;
        }
    }
    if (noPrimeNumbers) {
        console.log(colorer(`В диапозоне от ${from} до ${to} нет простых чисел`));
    }
}

printPrimeNimbers(process.argv[2], process.argv[3]);
