let hej = "hej"

function duplicateString(string) {
    return string + string;
}

console.log(duplicateString(hej))

function duplicateStringTwice(string) {
    return duplicateString(string) + duplicateString(string);
}

console.log(duplicateStringTwice("tjo"))

function printString(string) {
    console.log(string)
}

function baklängesString(string, callback) {
    var tillbakaString = []
    for (var i = string.length - 1; i >= 0; i--)
        tillbakaString.push(string[i])

    callback(tillbakaString)
}

function dubbelt(a,callback) {
    callback(a * 2)
}

function frippelt(b) {
    var b = b * 4;
    console.log(b)
}

var baklänges = baklängesString("JoMenTjenare", printString)

var dubbeltgångerfyra = dubbelt(5, frippelt)

