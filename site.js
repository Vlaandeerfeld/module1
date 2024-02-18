let fs = new FileReader();
let league;

fetch('csvtoupload/Retro Goon League.csv')
    .then(data => data.text())
    .then(result => JSON.parse(result))
    .then(furthermore => console.log(furthermore))



