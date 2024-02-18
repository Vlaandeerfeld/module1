let fs = new FileReader();

fetch('csvtoupload/Retro Goon League.csv')
    .then(data => data.parse())
    .then(result => console.log(result))