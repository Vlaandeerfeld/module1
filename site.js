let fs = new FileReader();
let myJSON = {};
arrayJSON = new Array('1', '2');


fetch('csvtoupload/Retro Goon League.csv')
    .then(data => data.text())
    .then(result => {
        let headers = result.slice(0, result.indexOf("\n")).split(",");
        let rows = result.slice(result.indexOf("\n") + 1).split("\n");
        return rows.forEach(value => {
            return headers.forEach(value2 => {
                return arrayJSON.push(value2, value);
            });
        });
    })
    .then(furthermore => console.log(furthermore.stringify()));



