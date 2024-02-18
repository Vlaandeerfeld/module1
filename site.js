let fs = new FileReader();
let myJSON = {};
arrayJSON = new Array('1', '2');


fetch('csvtoupload/Retro Goon League.csv')
    .then(data => data.text())
    .then(result => {csvToJSON(result)})
    .then(furthermore => console.log(furthermore));

function csvToJSON(csv){
    arrayJSON = new Array('1', '2');
    csv.slice(result.indexOf("\n") + 1).split("\n").forEach(value => {
        csv.slice(0, result.indexOf("\n")).split(",").forEach(value2 => {
            arrayJSON.push(value2, value);
        });
    });
    return arrayJSON.stringify();
}
