let fs = new FileReader();
let myJSON = {};
arrayJSON = new Array('1', '2');


fetch('csvtoupload/Retro Goon League.csv')
    .then(data => data.text())
    .then(result => {
        return result.slice(result.indexOf("\n") + 1).split("\n").forEach(value => {
            return result.slice(0, result.indexOf("\n")).split(",").forEach(value2 => {
                return arrayJSON.push(value2, value);
            });
        });
    })
    .then(furthermore => console.log(arrayJSON.stringify()));



