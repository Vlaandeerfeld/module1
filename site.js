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

	let templateLeagues = ['Retro Goon League1980.csv', 'Netherton Hockey League2033.csv'];

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
	outputHTML += `<tbody><tr><th onclick = 'sortTable("teamTablesOverview", 0)'>Team</th><th onclick = 'sortTableNum("teamTablesOverview", 1)'>GP</th><th onclick = 'sortTableNum("teamTablesOverview", 2)'>Wins</th><th onclick = 'sortTableNum("teamTablesOverview", 3)'>Losses</th><th onclick = 'sortTableNum("teamTablesOverview", 4)'>Ties</th><th onclick = 'sortTableNum("teamTablesOverview", 5)'>OTL</th><th onclick = 'sortTableNum("teamTablesOverview", 6)'>Points</th><th onclick = 'sortTableNum("teamTablesOverview", 7)'>PCT</th><th onclick = 'sortTableNum("teamTablesOverview", 8)'>G</th></tr>`;
	data.forEach(value => {
		if (team != 'ALL'){
			if (value.Season == season && value.Abbr == team){
				outputHTML += `<tr><td onclick = 'window.location.href = "FHMstatsteam.html"; ${localStorage["currentLeague"]} = ${league}; 'localStorage["currentTeam"] = ${value.Abbr}'>${value.Abbr}</td><td>${value.GP_RS}</td><td>${value.Wins}</td><td>${value.Losses}</td><td>${value.Ties}</td><td>${value.OTL}</td><td>${value.Points}</td><td>${value.PCT}</td><td>${value.G_RS}</td></tr>`;
			}
		}
		else{
			if (value.Season == season){
				outputHTML += `<tr><td onclick = 'window.location.href = "FHMstatsteam.html";' 'localStorage.setItem("currentLeague", league);' 'localStorage["currentTeam"] = ${value.Abbr}'>${value.Abbr}</td><td>${value.GP_RS}</td><td>${value.Wins}</td><td>${value.Losses}</td><td>${value.Ties}</td><td>${value.OTL}</td><td>${value.Points}</td><td>${value.PCT}</td><td>${value.G_RS}</td></tr>`;
			}
		}
	});
    outputHTML += `</tbody>`;

    document.getElementById('teamTablesOverview').innerHTML = outputHTML;
}

function teamStatsFHM(){
	console.log(localStorage['currentLeague']);
	console.log(localStorage['currentTeam']);
	let data = localStorage[localStorage['currentLeague']];
	let team = localStorage['currentTeam'];

	data.forEach(value => {
		if (value.Abbr == team){
			document.getElementById('navButtonHomeFHMstatsteam').style.backgroundColor = value['Primary Color'];
		}
	})
}

function playerTablesFHM(league, season, team){
	let data = JSON.parse(localStorage[league]);
    console.log(data);
	let outputHTML = '';
	outputHTML += `<tbody><tr><th onclick = 'sortTable("teamTablesOverview", 0)'>Team</th><th onclick = 'sortTable("teamTablesOverview", 1)'>First Name</th><th onclick = 'sortTable("teamTablesOverview", 2)'>Last Name</th><th onclick = 'sortTableNum("teamTablesOverview", 3)'>GP</th><th onclick = 'sortTableNum("teamTablesOverview", 4)'>G</th><th onclick = 'sortTableNum("teamTablesOverview", 5)'>A</th><th onclick = 'sortTableNum("teamTablesOverview", 6)'>Points</th><th onclick = 'sortTableNum("teamTablesOverview", 7)'>+/-</th><th onclick = 'sortTableNum("teamTablesOverview", 8)'>PIM</th><th onclick = 'sortTableNum("teamTablesOverview", 9)'>SOG</th><th onclick = 'sortTableNum("teamTablesOverview", 10)'>CF%</th></tr>`;
	data.forEach(value => {
		if (team != 'ALL'){
			if (value.Season == season && value.Abbr == team){
				for (let x = 0; x < 21; x++){
					if (value["First Name" + x.toString()] != undefined){
						outputHTML += `<tr><td>${value.Abbr}</td><td>${value["First Name" + x.toString()]}</td><td>${value["Last Name" + x.toString()]}</td><td>${value["GP" + "_RS" + x.toString()]}</td><td>${value["G" + "_RS" + x.toString()]}</td><td>${value["A" + "_RS" + x.toString()]}</td><td>` + (Number(value["G" + "_RS" + x.toString()]) + Number(value["A" + "_RS" + x.toString()])) + `</td><td>${value[`+/-` + "_RS" + x.toString()]}</td><td>${value["PIM" + "_RS" + x.toString()]}</td><td>${value["SOG" + "_RS" + x.toString()]}</td><td>${value[`CF%` + "_RS" + x.toString()]}</td>`;
					}
				}	
			}
		}
		else{
			if (value.Season == season){
				for (let x = 0; x < 21; x++){
					if (value["First Name" + x.toString()] != undefined){
						outputHTML += `<tr><td>${value.Abbr}</td><td>${value["First Name" + x.toString()]}</td><td>${value["Last Name" + x.toString()]}</td><td>${value["GP" + "_RS" + x.toString()]}</td><td>${value["G" + "_RS" + x.toString()]}</td><td>${value["A" + "_RS" + x.toString()]}</td><td>` + (Number(value["G" + "_RS" + x.toString()]) + Number(value["A" + "_RS" + x.toString()])) + `</td><td>${value[`+/-` + "_RS" + x.toString()]}</td><td>${value["PIM" + "_RS" + x.toString()]}</td><td>${value["SOG" + "_RS" + x.toString()]}</td><td>${value[`CF%` + "_RS" + x.toString()]}</td>`;
					}
				}
			}
		}
	});
    outputHTML += `</tbody>`;

    document.getElementById('teamTablesOverview').innerHTML = outputHTML;
}

function sortTableNum(tableToSort, column){

	let table, rows, switching, i, x, y, shouldSwitch;
	table = document.getElementById(tableToSort);
	table = table.firstChild;
	switching = true;
	while (switching) {
	  switching = false;
	  rows = table.rows;
	  for (i = 1; i < (rows.length - 1); i++) {
		shouldSwitch = false;
		x = rows[i].getElementsByTagName('td')[column];
		y = rows[i + 1].getElementsByTagName('td')[column];
		if (x.innerHTML - y.innerHTML < 0) {
		  shouldSwitch = true;
		  break;
		}
	  }
	  if (shouldSwitch) {
		rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
		switching = true;
		}
	}
}

function sortTable(tableToSort, column){

	let table, rows, switching, i, x, y, shouldSwitch;
	table = document.getElementById(tableToSort);
	table = table.firstChild;
	switching = true;
	while (switching) {
	  switching = false;
	  rows = table.rows;
	  for (i = 1; i < (rows.length - 1); i++) {
		shouldSwitch = false;
		x = rows[i].getElementsByTagName('td')[column];
		y = rows[i + 1].getElementsByTagName('td')[column];
		if (x.innerHTML > y.innerHTML) {
		  shouldSwitch = true;
		  break;
		}
	  }
	  if (shouldSwitch) {
		rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
		switching = true;
		}
	}
}