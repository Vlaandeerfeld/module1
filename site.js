let fs = new FileReader();

fetch('csvtoupload/Retro Goon League.csv')
    .then(data => data.text())
    .then(result => console.log(result))