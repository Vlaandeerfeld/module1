let fs = new FileReader();
let myJSON = {};
arrayJSON = new Array();


fetch('csvtoupload/Retro Goon League.csv')
    .then(data => data.text())
    .then(result => {
        let headers = result.slice(0, result.indexOf("\n")).split(",");
        let rows = result.slice(result.indexOf("\n") + 1).split("\n");
        rows.forEach(value => {
            headers.forEach(value2 => {
                arrayJSON.push(value2, value);
            });
        });
    })
    .then(furthermore => console.log(furthermore.stringify()));



