async function upload(){

	const input = await document.getElementById('CSVfile');
	const input1 = await input.files;
	for (let x = 0; x < input1.length; x++){
		const reader = await new FileReader();	
		await reader.readAsText(input1[x]);
	
		reader.onload = function(){
			let input2 = reader.result;
			fileName = input1[x].name.slice(0, input1[x].name.indexOf('.') - 4);
			fileDate = input1[x].name.slice(input1[x].name.indexOf('.') - 4, input1[x].name.indexOf('.'));
			checkAndUpload(input2, fileName, fileDate);
		}
	}
    location.reload();
}

async function uploadTemplate(){

	let templateLeagues = ['Retro Goon League1980.csv'];

	templateLeagues.forEach(files => {
		let data = fetch('csvtoupload/' + files);
		let upload = data.text()
		fileName = files.slice(0, files.indexOf('.') - 4);
		fileDate = files.slice(files.indexOf('.') - 4, files.indexOf('.'));
		checkAndUpload(upload, fileName, fileDate);
	})

	location.reload();
}
function checkAndUpload(fileInput, league, date){

    let arrayBreak = [];
    let continueThrough;
	console.log(fileInput);
	console.log(date);
    JSONparsed = JSON.parse(parseIntoJSON(fileInput, league, date));

	if (localStorage['leagues'] == undefined){
		localStorage.setItem('leagues', 'ALL');
	}

	leagueCheck = localStorage['leagues'].split(',');

	leagueCheck.forEach(value => {
		if (value == league) {
			if (JSON.stringify(localStorage[league]) == JSON.stringify(JSONparsed.toString())){
				arrayBreak.push(true);
			}
			else{
				arrayBreak.push(false);
			}
		}
		else{
			arrayBreak.push(false);
		}
	});
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
		localStorage.setItem(league, JSON.stringify(JSONparsed));
		leagueCheck.push(league);
		localStorage.setItem('leagues', leagueCheck);
        console.log(localStorage[league]);
	}

	FileReader.abort
}

function parseIntoJSON(fileInput, league, date){

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
		obj['League'] = league;
		obj['Season'] = date;
        finalArray.push(obj);
    });

    return(JSON.stringify(finalArray));
}

function leagueFilters(page){
	let outputHTML = '';
	leaguesToFilter = localStorage['leagues'].split(',');	
	leaguesToFilter.slice(1).forEach(value => {
		outputHTML += `<option value = ` + value + `>` + value + `</option>`;
	})

	document.getElementById('FHMleaguesstats').innerHTML = outputHTML;
}

function teamFilters(league){
	let outputHTML = '';

	outputHTML += `<option value = ` + 'ALL' + `>` + 'ALL' + `</option>`;

	JSON.parse(localStorage[league]).forEach(value => {
		outputHTML += `<option value = ` + value.Abbr + `>` + value.Abbr + `</option>`;
	})
	
	document.getElementById('FHMteamsstats').innerHTML = outputHTML;
}

function seasonFilters(league){
	let outputHTML = '';
	team = JSON.parse(localStorage[league]);
	
	outputHTML += `<option value = ` + team[0].Season + `>` + team[0].Season + `</option>`;

	document.getElementById('FHMseasonstats').innerHTML = outputHTML;
}

function teamTablesOverview(league, season, team){
	let data = JSON.parse(localStorage[league]);
    console.log(data);
	let outputHTML = '';
	outputHTML += `<tbody>`;
	outputHTML += `<tr>`;
	outputHTML += `<th>League</th><th>Team</th><th>GP</th><th>Wins</th><th>Losses</th><th>Ties</th><th>OTL</th><th>Points</th><th>PCT</th><th>G</th>`;
	outputHTML += `</tr>`;
	data.forEach(value => {
		if (team != 'ALL'){
			if (value.Season == season && value.Abbr == team){
				outputHTML += `<tr>`;
				outputHTML += `<td>` + value.League + `</td><td>` + value.Abbr + `</td><td>` + value.GP_line + `</td><td>` + value.Wins + `</td><td>` + value.Losses + `</td><td>` + value.Ties + `</td><td>` + value.OTL + `</td><td>` + value.Points + `</td><td>` + value.PCT + `</td><td>` + value.G + `</td>`;
				outputHTML += `</tr>`;
			}
		}
		else{
			if (value.Season == season){
				outputHTML += `<tr>`;
				outputHTML += `<td>` + value.League + `</td><td>` + value.Abbr + `</td><td>` + value.GP_line + `</td><td>` + value.Wins + `</td><td>` + value.Losses + `</td><td>` + value.Ties + `</td><td>` + value.OTL + `</td><td>` + value.Points + `</td><td>` + value.PCT + `</td><td>` + value.G + `</td>`;
				outputHTML += `</tr>`;
			}
		}
	});
    outputHTML += `</tbody>`;

    document.getElementById('teamTablesOverview').innerHTML = outputHTML;
}

function FHMseasonstats(){
	let data = JSON.parse(localStorage['Retro Goon League']);
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