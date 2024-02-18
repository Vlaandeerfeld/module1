let fs = new FileReader();
let league;

fetch('csvtoupload/Retro Goon League.csv')
    .then(data => data.text())
    .then(result => league = result.json())
    .then(console.log(league))



