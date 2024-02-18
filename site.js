let fs = new FileReader();

fetch('csvtoupload/Retro Goon League.csv')
    .then(data => data.json())
    .then(result => console.log(result))