localStorage['counter'];

async function upload(){

	const input = await document.getElementById('CSVfile');
	const input1 = await input.files;
	for (let x = 0; x < input1.length; x++){
		const reader = await new FileReader();	
		await reader.readAsText(input1[x]);
	
		reader.onload = function(){
			let input2 = reader.result;
			checkAndUpload(input2);
		}
	}
    location.reload();
}

function checkAndUpload(fileInput){

    let arrayBreak = [];
    let continueThrough;

    JSONparsed = JSON.parse(parseIntoJSON(fileInput));

	if (localStorage['counter'] == undefined){		
		localStorage.setItem('counter', 1);
	}
    for (let x = 1;  x <= parseInt(localStorage['counter']); x++){
        if (JSON.stringify(localStorage['league' + x.toString()]) == JSON.stringify(JSONparsed.toString()) && x >= 1){
			arrayBreak.push(true);
		}
		else{
			arrayBreak.push(false);
        }
	}
    for (let x = 0; x < arrayBreak.length; x++){
		if (arrayBreak[x] == true){
			continueThrough = false;
			break;
		}
		else{
			continueThrough = true;
		}
	}
    if (continueThrough == true){	
		localStorage.setItem('league' + localStorage['counter'], JSONparsed);
		localStorage.setItem('counter', parseInt(localStorage['counter']) + 1);
        console.log(localStorage['league1']);
	}

	FileReader.abort
}

function parseIntoJSON(fileInput){

    let finalArray = [];
    let row = fileInput.slice(fileInput.indexOf("\n") + 1).split("\n");
    row = row.slice(0, -1);
    let headers1 = fileInput.slice(0, fileInput.indexOf("\n")).split(",");
    let place = -1;
    let key;

    row.forEach(value2 => {
        let obj = {};
        let count = 0;
        place++;
        let elementValue = value2.split(',');
        headers1.forEach(value => {
            key = value;
            obj[key] = elementValue[count];
            count++;
        });
        finalArray.push(obj);
    });

    return(JSON.stringify(finalArray));
}

function teamTablesOverview(league, season, team){
	let data = JSON.parse(localStorage['league1']);
    let outputHTML = '';
	outputHTML += `<tbody>`;
	data.forEach(value => {
		outputHTML += `<tr>`;
		outputHTML += `<th>Team</th><th>GP</th><th>Wins</th><th>Losses</th><th>OTL</th><th>Points</th><th>PCT</th><th>G</th>`;
    	outputHTML += `</tr>`;
		outputHTML += `<tr>`;
		outputHTML += `<td>` + value.Abbr + `</td><td>` + value.GP + `</td><td>` + value.Wins + `</td><td>` + value.Losses + `</td><td>` + value.OTL + `</td><td>` + value.Points + `</td><td>` + value.PCT + `</td><td>` + value.G + `</td>`;
		outputHTML += `</tr>`;
	});
    outputHTML += `</tbody>`;

    document.getElementById('teamTablesOverview').innerHTML = outputHTML;
}