let fs = new FileReader();
let myJSON = {};

fetch('csvtoupload/Retro Goon League.csv')
    .then(data => data.text())
    .then(result => {
        let headers = result.slice(0, result.indexOf("\n")).split(",");
        let rows = result.slice(result.indexOf("\n") + 1).split(",");
        console.log(rows);
    });



