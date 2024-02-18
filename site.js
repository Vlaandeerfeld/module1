let fs = new FileReader();
let myJSON = {};
arrayJSON = new Array('1', '2');


fetch('csvtoupload/Retro Goon League.csv')
    .then(data => data.text())
    .then(result => {csvToJSON(result)})
    .then(furthermore => console.log(furthermore));

async function csvToJSON(csv){
    arrayJSON = new Array('1', '2');
    row = csv.slice(csv.indexOf("\n") + 1).split("\n");
    row.slice(",").forEach(value => {
        csv.slice(0, csv.indexOf("\n")).split(",").forEach(value2 => {
            arrayJSON.push(value2, value);
        });
    });
    console.log(arrayJSON);
    return JSON.stringify(arrayJSON);
}
