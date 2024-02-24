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

function teamTablesOverview(){
    let outputHTML = '';
	outputHTML += `<tbody>`;
	outputHTML += `<tr>`;
	outputHTML += `<th>variant[variant.length - 1][21]</th><th>variant[variant.length - 1][22]</th><th><button type = 'button' id = 'teamPage' onclick = \"setTeam('" + variantToDisplay + "');document.location='variant1.html';\"></button></th>`;
    outputHTML += `</tr>`;
	outputHTML += `<tr>`;
	outputHTML += `<th>Wins</th><th>Losses</th><th>OTL</th>`;
	outputHTML += `</tr>`;
    outputHTML += `</tbody>`;
    document.getElementById('teamTablesOverview').innerHTML = outputHTML;
}