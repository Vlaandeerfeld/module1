localStorage["GP"] = true; 
localStorage["Goals"] = true; 
localStorage["Assists"] = true; 
localStorage["Points"] = true; 
localStorage['PlusMinus'] = true;
localStorage['PIM'] = true;
localStorage['PPG'] = true; 
localStorage['SHG'] = true;
localStorage['GWG'] = true;
localStorage['OTG'] = true; 
localStorage['Shots'] = true;
localStorage['ShotPer'] = true;
localStorage['FOPer'] = true;
localStorage['GP_RS'] = true;
localStorage['Wins'] = true;
localStorage['Losses'] = true;
localStorage['Ties'] = false;
localStorage['OTL'] = true;
localStorage['Points'] = true;
localStorage['PCT'] = true;
localStorage['l10'] = true;
localStorage['GF'] = true;
localStorage['GA'] = true;
localStorage['Goal_Diff'] = true;
localStorage['GAA'] = true;
localStorage['SVPer'] = true;
localStorage['SO'] = true;


let currentPage = 1;
let recordsPerPage = 27;


let date = new Date();
localStorage['year'] = date.getFullYear();
localStorage['month'] = date.getMonth();

function sorterMain(table, numColumn){

	let sorter1 = `<tr>`;
	list1 = ['Team', 'GP', 'Wins', 'Losses', 'Ties', 'OTL', 'Points', 'PCT', 'last 10'];
		
	sorter1 += `<th onclick = 'if(localStorage["${table}${0}"] === "DESC"){sortTable("${table}",${0}); localStorage["${table}${0}"] = "ASC";} else{sortTableASC("${table}",${0}); localStorage["${table}${0}"] = "DESC"}'>${list1[0]}</th>`;

	for (let x = 1; x <= numColumn; x++){
		sorter1 += `<th onclick = 'if(localStorage["${table}${x}"] === "DESC"){sortTableNum("${table}",${x}); localStorage["${table}${x}"] = "ASC";} else{sortTableNumASC("${table}",${x}); localStorage["${table}${x}"] = "DESC"}'>${list1[x]}</th>`;
	}
	sorter1 += `</tr>`;

	return sorter1;
}

function sorterPlayers(table, position){
	let numColumn = 1;
	let columns = [];
	if(position === "SKATERS"){
		list = ['GP', 'Goals', 'Assists', 'Points', 'PlusMinus', 'PIM', 'PPG', 'SHG', 'GWG', 'OTG', 'Shots', 'ShotPer', 'FOPer'];
	}
	else{
		list = ['GP', 'Wins', 'Losses', 'OTL', 'GAA', 'SVPer', 'SO', 'Points'];
	}

	list.forEach(x => {
		console.log(localStorage[x]);
		if(localStorage[x] === 'true'){
			numColumn += 1;
			columns.push(x);
		};
	});
	
	let sorter1 = `<tr>`;
	sorter1 += `<th onclick = 'if(localStorage["${table}${0}"] === "DESC"){sortTable("${table}",${0}); localStorage["${table}${0}"] = "ASC";} else{sortTableASC("${table}",${0}); localStorage["${table}${0}"] = "DESC"}'>Team</th>
				<th onclick = 'if(localStorage["${table}${1}"] === "DESC"){sortTable("${table}",${1}); localStorage["${table}${1}"] = "ASC";} else{sortTableASC("${table}",${1}); localStorage["${table}${1}"] = "DESC"}'>Name</th>
				`;

	for (let x = 2; x <= numColumn; x++){
		sorter1 += `<th onclick = 'if(localStorage["${table}${x}"] === "DESC"){sortTableNum("${table}",${x}); localStorage["${table}${x}"] = "ASC";} else{sortTableNumASC("${table}",${x}); localStorage["${table}${x}"] = "DESC"}'>${columns[x - 2]}</th>`;
	}
	sorter1 += `</tr>`;

	console.log(columns);
	return [columns, sorter1];
}

function sorterTeams(table){
	let numColumn = 0;
	let columns = [];
	list1 = ['GP_RS', 'Wins', 'Losses', 'Ties', 'OTL', 'Points', 'PCT', 'l10', 'GF', 'GA', 'Goal_Diff'];
		
	list1.forEach(x => {
		console.log(localStorage[x]);
		if(localStorage[x] === 'true'){
			numColumn += 1;
			columns.push(x);
		};
	});

	let sorter1 = `<tr>`;
	sorter1 += `<th onclick = 'if(localStorage["${table}${0}"] === "DESC"){sortTable("${table}",${0}); localStorage["${table}${0}"] = "ASC";} else{sortTableASC("${table}",${0}); localStorage["${table}${0}"] = "DESC"}'>Team</th>`;

	for (let x = 1; x <= numColumn; x++){
		sorter1 += `<th onclick = 'if(localStorage["${table}${x}"] === "DESC"){sortTableNum("${table}",${x}); localStorage["${table}${x}"] = "ASC";} else{sortTableNumASC("${table}",${x}); localStorage["${table}${x}"] = "DESC"}'>${columns[x - 1]}</th>`;
	}
	sorter1 += `</tr>`;

	return [columns, sorter1];
}

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

	templateLeagues.forEach(async files => {
		let data = await fetch(`csvtoupload/${files}`);
		let upload = await data.text()
		fileName = files.slice(0, files.indexOf('.') - 4);
		fileDate = files.slice(files.indexOf('.') - 4, files.indexOf('.'));
		console.log(upload)
		checkAndUpload(upload, fileName, fileDate);
	})
}
async function checkAndUpload(fileInput, league, date){

    let arrayBreak = [];
    let continueThrough;
	console.log(fileInput);
	console.log(date);
    JSONparsed = JSON.parse(parseIntoJSON(fileInput, league, date));

	if (localStorage['leagues'] == undefined){
		localStorage.setItem('leagues', 'ALL');
	}

	let leagueCheck = localStorage['leagues'].split(',');

	leagueCheck.forEach(value => {
		if (value === league) {
			console.log(localStorage[league]);
			console.log(JSON.stringify(JSONparsed));
			console.log(localStorage[league] == JSON.stringify(JSONparsed));
			if (localStorage[league] === JSON.stringify(JSONparsed)){
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

	console.log(finalArray)
    return(JSON.stringify(finalArray));
}

function leagueFilters(page){
	let outputHTML = '';
	let leaguesToFilter = localStorage['leagues'].split(',');	
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
	league = league.toString();
	console.log(data);
    console.log(league);
	let outputHTML =``;
	outputHTML += '<tbody>';
	outputHTML += sorterMain('teamTablesOverview', 8);	
	data.forEach(value => {
		if (team != 'ALL'){
			if (value.Season == season && value.Abbr == team){
				outputHTML += `<tr><td onclick = 'localStorage["currentLeague"] = document.getElementById("FHMleaguesstats").options[document.getElementById("FHMleaguesstats").options.selectedIndex].text; localStorage["currentTeam"] = document.getElementById("FHMteamsstats").options[document.getElementById("FHMteamsstats").options.selectedIndex].text; window.location.href = "FHMstatsteam.html"'>${value.Abbr}</td><td>${value.GP_RS}</td><td>${value.Wins}</td><td>${value.Losses}</td><td>${value.Ties}</td><td>${value.OTL}</td><td>${value.Points}</td><td>${value.PCT}</td><td>${value.G_RS}</td></tr>`;
			}
		}
		else{
			if (value.Season == season){
				outputHTML += `<tr><td id = ${value.Abbr} onclick = 'localStorage["currentLeague"] = document.getElementById("FHMleaguesstats").options[document.getElementById("FHMleaguesstats").options.selectedIndex].text; localStorage.setItem("currentTeam", document.getElementById("${value.Abbr}").innerHTML); window.location.href = "FHMstatsteam.html";'>${value.Abbr}</td><td>${value.GP_RS}</td><td>${value.Wins}</td><td>${value.Losses}</td><td>${value.Ties}</td><td>${value.OTL}</td><td>${value.Points}</td><td>${value.PCT}</td><td>${value.G_RS}</td></tr>`;
			}
		}
	});
    outputHTML += `</tbody>`;

    document.getElementById('teamTablesOverview').innerHTML = outputHTML;
}

function playerStatsFHM(){

	let data = JSON.parse(localStorage[localStorage['currentLeague']]);
	let team = localStorage['currentTeam'];
	let player = localStorage['currentPlayer'];

	let outputHTMLPlayerDefense = '';
	let outputHTMLPlayerOffense = '';
	let outputHTMLPlayerMental = '';
	let outputHTMLPlayerPhysical = '';
	let outputHTMLPlayerAbility = '';
	let outputHTMLPlayerPotential = '';
	let outputHTMLPlayerAge = '';
	let outputHTMLPlayerRoles = '';
	let outputHTMLPlayerName = '';

	outputHTMLPlayerOffense += `<tbody>`;
	outputHTMLPlayerDefense += `<tbody>`;
	outputHTMLPlayerMental += `<tbody>`;
	outputHTMLPlayerPhysical += `<tbody>`;
	outputHTMLPlayerAbility += `<tbody>`;
	outputHTMLPlayerPotential += `<tbody>`;
	outputHTMLPlayerAge += `<tbody>`;
	outputHTMLPlayerRoles += `<tbody>`;

	data.forEach(value => {
		if (value.Abbr == team){

			console.log(value['Primary Color']);
			console.log(value['Secondary Color']);

				document.getElementById('FHMPlayerName').style.backgroundColor = value['Secondary Color'];
				document.getElementById('FHMPlayerName').style.color = value['Primary Color'];
				document.getElementById('FHMPlayerName').style.fontSize = '100px';
			

			for (let x = 0; x < 25; x++){
				console.log(value['Last Name' + x.toString()]);
				if (value['Last Name' + x.toString()] == player){

					outputHTMLPlayerName += `${value['First Name' + x.toString()]} ${value['Last Name' + x.toString()]}`;

					outputHTMLPlayerOffense += `
							<tr><td>Screening</td><td>${value['Screening' + x.toString()]}</td></tr>
							<tr><td>Getting Open</td><td>${value['Getting Open' + x.toString()]}</td></tr>
							<tr><td>Passing</td><td>${value['Passing' + x.toString()]}</td></tr>
							<tr><td>Puck Handling</td><td>${value['Puck Handling' + x.toString()]}</td></tr>
							<tr><td>Shooting Accuracy</td><td>${value['Shooting Accuracy' + x.toString()]}</td></tr>
							<tr><td>Shooting Range</td><td>${value['Shooting Range' + x.toString()]}</td></tr>
							<tr><td>Offensive Read</td><td>${value['Offensive Read' + x.toString()]}</td></tr>
					`;

					outputHTMLPlayerDefense += `
							<tr><td>Checking</td><td>${value['Checking' + x.toString()]}</td></tr>
							<tr><td>Faceoffs</td><td>${value['Faceoffs' + x.toString()]}</td></tr>
							<tr><td>Hitting</td><td>${value['Hitting' + x.toString()]}</td></tr>
							<tr><td>Positioning</td><td>${value['Positioning' + x.toString()]}</td></tr>
							<tr><td>Shot Blocking</td><td>${value['Shot Blocking' + x.toString()]}</td></tr>
							<tr><td>Stick Checking</td><td>${value['Stickchecking' + x.toString()]}</td></tr>
							<tr><td>Defensive Read</td><td>${value['Defensive Read' + x.toString()]}</td></tr>
					`;

					outputHTMLPlayerMental += `
							<tr><td>Aggression</td><td>${value['Aggression' + x.toString()]}</td></tr>
							<tr><td>Bravery</td><td>${value['Bravery' + x.toString()]}</td></tr>
							<tr><td>Determination</td><td>${value['Determination' + x.toString()]}</td></tr>
							<tr><td>Teamplayer</td><td>${value['Teamplayer' + x.toString()]}</td></tr>
							<tr><td>Leadership</td><td>${value['Leadership' + x.toString()]}</td></tr>
							<tr><td>Temperament</td><td>${value['Temperament' + x.toString()]}</td></tr>
							<tr><td>Professionalism</td><td>${value['Professionalism' + x.toString()]}</td></tr>
					`;
				
					outputHTMLPlayerPhysical += `
							<tr><td>Acceleration</td><td>${value['Acceleration' + x.toString()]}</td></tr>
							<tr><td>Agility</td><td>${value['Agility' + x.toString()]}</td></tr>
							<tr><td>Balance</td><td>${value['Balance' + x.toString()]}</td></tr>
							<tr><td>Speed</td><td>${value['Speed' + x.toString()]}</td></tr>
							<tr><td>Stamina</td><td>${value['Stamina' + x.toString()]}</td></tr>
							<tr><td>Strength</td><td>${value['Strength' + x.toString()]}</td></tr>
							<tr><td>Fighting</td><td>${value['Fighting' + x.toString()]}</td></tr>
					`;
					outputHTMLPlayerAbility += `
							<tr><td>Ability</td><td>${value['Ability' + x.toString()]}</td></tr>
					`;
					outputHTMLPlayerPotential += `
							<tr><td>Potential</td><td>${value['Potential' + x.toString()]}</td></tr>
					`;
					outputHTMLPlayerAge += `
							<tr><td>Age</td><td>${value.Season - value['Date Of Birth' + x.toString()].slice(0,4)}</td></tr>
					`;
					outputHTMLPlayerRoles += `
							<tr><td>C</td><td>${value['C' + x.toString()]}</td></tr>
							<tr><td>LW</td><td>${value['LW' + x.toString()]}</td></tr>
							<tr><td>RW</td><td>${value['RW' + x.toString()]}</td></tr>
							<tr><td>LD</td><td>${value['LD' + x.toString()]}</td></tr>
							<tr><td>RD</td><td>${value['RD' + x.toString()]}</td></tr>
					`;
				}
			}
		}
	})
	outputHTMLPlayerOffense += `</tbody>`;
	outputHTMLPlayerDefense += `</tbody>`;
	outputHTMLPlayerMental += `</tbody>`;
	outputHTMLPlayerPhysical += `</tbody>`;
	outputHTMLPlayerAbility += `</tbody>`;
	outputHTMLPlayerPotential += `</tbody>`;
	outputHTMLPlayerAge += `</tbody>`;
	outputHTMLPlayerRoles += `</tbody>`;

	document.getElementById('FHMstatsPlayerAttributesOffense').innerHTML = outputHTMLPlayerOffense;
	document.getElementById('FHMstatsPlayerAttributesDefense').innerHTML = outputHTMLPlayerDefense;
	document.getElementById('FHMstatsPlayerAttributesMental').innerHTML = outputHTMLPlayerMental;
	document.getElementById('FHMstatsPlayerAttributesPhysical').innerHTML = outputHTMLPlayerPhysical;
	document.getElementById('FHMstatsPlayerAbility').innerHTML = outputHTMLPlayerAbility;
	document.getElementById('FHMstatsPlayerPotential').innerHTML = outputHTMLPlayerPotential;
	document.getElementById('FHMstatsPlayerAge').innerHTML = outputHTMLPlayerAge;
	document.getElementById('FHMstatsPlayerRoles').innerHTML = outputHTMLPlayerRoles;
	document.getElementById('FHMPlayerName').innerHTML = outputHTMLPlayerName;

}

function teamStatsFHM(){
	console.log(localStorage['currentLeague']);
	console.log(localStorage['currentTeam']);
	let data = JSON.parse(localStorage[localStorage['currentLeague']]);
	let team = localStorage['currentTeam'];
	let outputHTMLRoster = '';
	let outputHTMLRosterStats = '';
	let outputHTMLLinesStats = '';

	outputHTMLRoster += `<tbody>`;
	outputHTMLRosterStats += `<tbody>`;
	outputHTMLLinesStats += `<tbody>`;
	data.forEach(value => {
		if (value.Abbr == team){

			console.log(value['Primary Color']);
			console.log(value['Secondary Color']);
			document.getElementById('FHMTeamLogo').style.backgroundColor = value['Secondary Color'];
			document.getElementById('FHMTeamLogo').style.color = value['Primary Color'];
			document.getElementById('FHMTeamLogo').style.fontSize = '100px';
			document.getElementById('FHMTeamLogo').innerHTML = value['Name'] + ' ' + value['Nickname'];

			let url = `https://assets.nhle.com/logos/nhl/svg/${value.Abbr}_dark.svg`;
			outputHTMLRoster += `
					<tr><th>LW</th><th>C</th><th>RW</th></tr>
					<tr><td>${value['LW1_line']}</td><td>${value['C1_line']}</td><td>${value['RW1_line']}</td></tr>
					<tr><td>${value['LW2_line']}</td><td>${value['C2_line']}</td><td>${value['RW2_line']}</td></tr>
					<tr><td>${value['LW3_line']}</td><td>${value['C3_line']}</td><td>${value['RW3_line']}</td></tr>
					<tr><td>${value['LW4_line']}</td><td>${value['C4_line']}</td><td>${value['RW4_line']}</td></tr>
					<tr><th>LD</th><th>RD</th><td rowspan="6"><img src = ${url}></td></tr>
					<tr><td>${value['LD1_line']}</td><td>${value['RD1_line']}</td></tr>
					<tr><td>${value['LD2_line']}</td><td>${value['RD2_line']}</td></tr>
					<tr><td>${value['LD3_line']}</td><td>${value['RD3_line']}</td></tr>
					<tr><th>Main</th><th>Backup</th></tr>
					<tr><td>${value['G1']}</td><td>${value['G2']}</td></tr>
			`;

			outputHTMLRosterStats += `<tr><th onclick = 'sortTable("FHMstatsteamRosterStats", 0)'>Name</th><th onclick = 'sortTable("FHMstatsteamRosterStats", 1)'>DOB</th><th onclick = 'sortTableNum("FHMstatsteamRosterStats", 2)'>Age</th><th onclick = 'sortTable("FHMstatsteamRosterStats", 3)'>Height</th><th onclick = 'sortTableNum("FHMstatsteamRosterStats", 4)'>Weight</th><th onclick = 'sortTableNum("FHMstatsteamRosterStats", 5)'>Ability</th><th onclick = 'sortTableNum("FHMstatsteamRosterStats", 6)'>Potential</th></tr>`;

			let F1Points = 0;
			let F2Points = 0;
			let F3Points = 0;
			let F4Points = 0;
			let D1Points = 0;
			let D2Points = 0;
			let D3Points = 0;

			for(let count = 0; count <= 25; count++){


				if(value['PlayerId' + count.toString()] != undefined){
					outputHTMLRosterStats += `
					<tr><td id = '${value['Last Name' + count.toString()]}' onclick = 'localStorage.setItem("currentPlayer", document.getElementById("${value['Last Name' + count.toString()]}").id); window.location.href = "FHMstatsplayer.html"'>${value['First Name' + count.toString()]} ${value['Last Name' + count.toString()]}</td><td>${value['Date Of Birth' + count.toString()]}</td><td>${value.Season - value['Date Of Birth' + count.toString()].slice(0,4)}</td><td>${Math.floor(value['Height' + count.toString()] / 12)}'${value['Height' + count.toString()] % 12}"</td><td>${value['Weight' + count.toString()]}</td><td>${value['Ability' + count.toString()]}</td><td>${value['Potential' + count.toString()]}</td></tr>
					`;
				}
				if(value['Last Name' + count.toString()] == value['LW1_line'] || value['Last Name' + count.toString()] == value['C1_line'] || value['Last Name' + count.toString()] == value['RW1_line']){
					F1Points += Number(value['G_RS' + count.toString()]) + Number(value['A_RS' + count.toString()]);
				}
				if(value['Last Name' + count.toString()] == value['LW2_line'] || value['Last Name' + count.toString()] == value['C2_line'] || value['Last Name' + count.toString()] == value['RW2_line']){
					F2Points += Number(value['G_RS' + count.toString()]) + Number(value['A_RS' + count.toString()]);
				}
				if(value['Last Name' + count.toString()] == value['LW3_line'] || value['Last Name' + count.toString()] == value['C3_line'] || value['Last Name' + count.toString()] == value['RW3_line']){
					F3Points += Number(value['G_RS' + count.toString()]) + Number(value['A_RS' + count.toString()]);
				}
				if(value['Last Name' + count.toString()] == value['LW4_line'] || value['Last Name' + count.toString()] == value['C4_line'] || value['Last Name' + count.toString()] == value['RW4_line']){
					F4Points += Number(value['G_RS' + count.toString()]) + Number(value['A_RS' + count.toString()]);
				}
				if(value['Last Name' + count.toString()] == value['LD1_line'] || value['Last Name' + count.toString()] == value['RD1_line']){
					D1Points += Number(value['G_RS' + count.toString()]) + Number(value['A_RS' + count.toString()]);
				}
				if(value['Last Name' + count.toString()] == value['LD2_line'] || value['Last Name' + count.toString()] == value['RD2_line']){
					D2Points += Number(value['G_RS' + count.toString()]) + Number(value['A_RS' + count.toString()]);
				}
				if(value['Last Name' + count.toString()] == value['LD3_line'] || value['Last Name' + count.toString()] == value['RD3_line']){
					D3Points += Number(value['G_RS' + count.toString()]) + Number(value['A_RS' + count.toString()]);
				}
			}
			totalPoints = F1Points + F2Points + F3Points + F4Points + D1Points + D2Points + D3Points;

			outputHTMLLinesStats += `
					<tr><th>Offense</th><th>Points</th><th>Team%</th></tr>
					<tr><td>1</td><td>${F1Points}</td><td>` + Math.floor(F1Points / totalPoints * 100) + `%</td></tr>
					<tr><td>2</td><td>${F2Points}</td><td>` + Math.floor(F2Points / totalPoints * 100) + `%</td></tr>
					<tr><td>3</td><td>${F3Points}</td><td>` + Math.floor(F3Points / totalPoints * 100) + `%</td></tr>
					<tr><td>4</td><td>${F4Points}</td><td>` + Math.floor(F4Points / totalPoints * 100) + `%</td></tr>
					<tr><th>Defense</th><th>Points</th><th>Team%</th></tr>
					<tr><td>1</td><td>${D1Points}</td><td>` + Math.floor(D1Points / totalPoints * 100) + `%</td></tr>
					<tr><td>2</td><td>${D2Points}</td><td>` + Math.floor(D2Points / totalPoints * 100) + `%</td></tr>
					<tr><td>3</td><td>${D3Points}</td><td>` + Math.floor(D3Points / totalPoints * 100) + `%</td></tr>
					`
		}
		outputHTMLRoster += `</tbody>`;
		outputHTMLRosterStats += `</tbody>`;
		outputHTMLLinesStats += `<tbody>`;
		document.getElementById('FHMstatsteamRoster').innerHTML = outputHTMLRoster;
		document.getElementById('FHMstatsteamRosterStats').innerHTML = outputHTMLRosterStats;
		document.getElementById('FHMstatsteamLinesStats').innerHTML = outputHTMLLinesStats;
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
						outputHTML += `<tr><td id = ${value.Abbr} onclick = 'localStorage["currentLeague"] = document.getElementById("FHMleaguesstats").options[document.getElementById("FHMleaguesstats").options.selectedIndex].text; localStorage["currentTeam"] = document.getElementById("FHMteamsstats").options[document.getElementById("FHMteamsstats").options.selectedIndex].text; window.location.href = "FHMstatsteam.html"'>${value.Abbr}</td><td>${value["First Name" + x.toString()]}</td><td id = ${value['Last Name' + x.toString()]} onclick = 'localStorage["currentLeague"] = document.getElementById("FHMleaguesstats").options[document.getElementById("FHMleaguesstats").options.selectedIndex].text; localStorage.setItem("currentTeam", document.getElementById("${value.Abbr}").innerHTML); localStorage.setItem("currentPlayer", document.getElementById("${value['Last Name' + x.toString()]}").id); window.location.href = "FHMstatsplayer.html"'>${value["Last Name" + x.toString()]}</td><td>${value["GP" + "_RS" + x.toString()]}</td><td>${value["G" + "_RS" + x.toString()]}</td><td>${value["A" + "_RS" + x.toString()]}</td><td>` + (Number(value["G" + "_RS" + x.toString()]) + Number(value["A" + "_RS" + x.toString()])) + `</td><td>${value[`+/-` + "_RS" + x.toString()]}</td><td>${value["PIM" + "_RS" + x.toString()]}</td><td>${value["SOG" + "_RS" + x.toString()]}</td><td>${value[`CF%` + "_RS" + x.toString()]}</td>`;
					}
				}	
			}
		}
		else{
			if (value.Season == season){
				for (let x = 0; x < 21; x++){
					if (value["First Name" + x.toString()] != undefined){
						outputHTML += `<tr><td id = ${value.Abbr} onclick = 'localStorage["currentLeague"] = document.getElementById("FHMleaguesstats").options[document.getElementById("FHMleaguesstats").options.selectedIndex].text; localStorage.setItem("currentTeam", document.getElementById("${value.Abbr}").innerHTML); window.location.href = "FHMstatsteam.html";'>${value.Abbr}</td><td>${value["First Name" + x.toString()]}</td><td id = ${value['Last Name' + x.toString()]} onclick = 'localStorage["currentLeague"] = document.getElementById("FHMleaguesstats").options[document.getElementById("FHMleaguesstats").options.selectedIndex].text; localStorage.setItem("currentTeam", document.getElementById("${value.Abbr}").innerHTML); localStorage.setItem("currentPlayer", document.getElementById("${value['Last Name' + x.toString()]}").id); window.location.href = "FHMstatsplayer.html"'>${value["Last Name" + x.toString()]}</td><td>${value["GP" + "_RS" + x.toString()]}</td><td>${value["G" + "_RS" + x.toString()]}</td><td>${value["A" + "_RS" + x.toString()]}</td><td>` + (Number(value["G" + "_RS" + x.toString()]) + Number(value["A" + "_RS" + x.toString()])) + `</td><td>${value[`+/-` + "_RS" + x.toString()]}</td><td>${value["PIM" + "_RS" + x.toString()]}</td><td>${value["SOG" + "_RS" + x.toString()]}</td><td>${value[`CF%` + "_RS" + x.toString()]}</td>`;
					}
				}
			}
		}
	});
    outputHTML += `</tbody>`;

    document.getElementById('teamTablesOverview').innerHTML = outputHTML;
}

function advancedFilterStatsPlayers(){
	outputHTML = `
			<input type="checkbox" id="GP" onclick='if (GP.checked == true){localStorage["GP"] = true}else{localStorage["GP"] = false}' checked><label for="GP" class="chkbox">GP</label></input>
			<input type="checkbox" id="Goals" onclick='if(Goals.checked === true){localStorage["Goals"] = true}else{localStorage["Goals"] = false}' checked><label for="Goals" class="chkbox">Goals</label></input>
			<input type="checkbox" id="Assists" onclick='if (Assists.checked == true){localStorage["Assists"] = true}else{localStorage["Assists"] = false}' checked><label for="Assists" class="chkbox">Assists</label></input>
			<input type="checkbox" id="Points" onclick='if (Points.checked == true){localStorage["Points"] = true}else{localStorage["Points"] = false}' checked><label for="Points" class="chkbox">Points</label></input>
			<input type="checkbox" id="PlusMinus" onclick='if (PlusMinus.checked == true){localStorage["PlusMinus"] = true}else{localStorage["PlusMinus"] = false}' checked><label for="PlusMinus" class="chkbox">PlusMinus</label></input>
			<input type="checkbox" id="PIM" onclick='if (PIM.checked == true){localStorage["PIM"] = true}else{localStorage["PIM"] = false}' checked><label for="PIM" class="chkbox">PIM</label></input>
			<input type="checkbox" id="PPG" onclick='if (PPG.checked == true){localStorage["PPG"] = true}else{localStorage["PPG"] = false}' checked><label for="PPG" class="chkbox">PPG</label></input>
			<input type="checkbox" id="SHG" onclick='if (SHG.checked == true){localStorage["SHG"] = true}else{localStorage["SHG"] = false}' checked><label for="SHG" class="chkbox">SHG</label></input>
			<input type="checkbox" id="GWG" onclick='if (GWG.checked == true){localStorage["GWG"] = true}else{localStorage["GWG"] = false}' checked><label for="GWG" class="chkbox">GWG</label></input>
			<input type="checkbox" id="OTG" onclick='if (OTG.checked == true){localStorage["OTG"] = true}else{localStorage["OTG"] = false}' checked><label for="OTG" class="chkbox">OTG</label></input>
			<input type="checkbox" id="Shots" onclick='if (Shots.checked == true){$localStorage["Shots"] = true}else{localStorage["Shots"] = false}' checked><label for="Shots" class="chkbox">Shots</label></input>
			<input type="checkbox" id="ShotPer" onclick='if (ShotPer.checked == true){localStorage["ShotPer"] = true}else{localStorage["ShotPer"] = false}' checked><label for="ShotPer" class="chkbox">Shot %</label></input>
			<input type="checkbox" id="FOPer" onclick='if (FOPer.checked == true){localStorage["FOPer"] = true}else{localStorage["FOPer"] = false}' checked><label for="FOPer" class="chkbox">FO %</label></input>
			<input type="text" id="PlayersStatsSearch" class="searchBar"><label for="PlayersStatsSearch" class="searchLabel"></label></input>
			<button type="button id="PlayersStatsSearchButton" class="searchButton" onclick='searchPlayers(document.getElementById("PlayersStatsSearch").value, document.getElementById("NHLseasonstats").options[document.getElementById("NHLseasonstats").options.selectedIndex].text, document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text)'><label for="PlayersStatsSearchButton" class="searchButtonLabel">Search</label></input>
			`
	document.getElementById('NHLStatsPlayersDropDown').innerHTML = outputHTML;
}
function advancedFilterStatsTeams(){
	outputHTML = `
			<input type="checkbox" id="GP_RS" onclick='if (GP_RS.checked == true){localStorage["GP_RS"] = true}else{localStorage["GP_RS"] = false}' checked><label for="GP_RS" class="chkbox">GP RS</label></input>
			<input type="checkbox" id="Wins" onclick='if(Wins.checked === true){localStorage["Wins"] = true}else{localStorage["Wins"] = false}' checked><label for="Wins" class="chkbox">Wins</label></input>
			<input type="checkbox" id="Losses" onclick='if (Losses.checked == true){localStorage["Losses"] = true}else{localStorage["Losses"] = false}' checked><label for="Losses" class="chkbox">Losses</label></input>
			<input type="checkbox" id="Ties" onclick='if (Ties.checked == true){localStorage["Ties"] = true}else{localStorage["Ties"] = false}'><label for="Ties" class="chkbox">Ties</label></input>
			<input type="checkbox" id="OTL" onclick='if (OTL.checked == true){localStorage["OTL"] = true}else{localStorage["OTL"] = false}' checked><label for="OTL" class="chkbox">OTL</label></input>
			<input type="checkbox" id="Points" onclick='if (Points.checked == true){localStorage["Points"] = true}else{localStorage["Points"] = false}' checked><label for="Points" class="chkbox">Points</label></input>
			<input type="checkbox" id="PCT" onclick='if (PCT.checked == true){localStorage["PCT"] = true}else{localStorage["PCT"] = false}' checked><label for="PCT" class="chkbox">PCT</label></input>
			<input type="checkbox" id="l10" onclick='if (l10.checked == true){localStorage["l10"] = true}else{localStorage["l10"] = false}' checked><label for="l10" class="chkbox">l10</label></input>
			<input type="checkbox" id="GF" onclick='if (GF.checked == true){localStorage["GF"] = true}else{localStorage["GF"] = false}' checked><label for="GF" class="chkbox">GF</label></input>
			<input type="checkbox" id="GA" onclick='if (GA.checked == true){localStorage["GA"] = true}else{localStorage["GA"] = false}' checked><label for="GA" class="chkbox">GA</label></input>
			<input type="checkbox" id="Goal_Diff" onclick='if (Goal_Diff.checked == true){$localStorage["Goal_Diff"] = true}else{localStorage["Goal_Diff"] = false}' checked><label for="Goal_Diff" class="chkbox">Goal Diff</label></input>
			<input type="text" id="TeamsStatsSearch" class="searchBar"><label for="TeamsStatsSearch" class="searchLabel"></label></input>
			<button type="button id="TeamsStatsSearchButton" class="searchButton" onclick='searchTeam(document.getElementById("TeamsStatsSearch").value)'><label for="TeamsStatsSearchButton" class="searchButtonLabel">Search</label></input>
			`
	document.getElementById('NHLStatsTeamsDropDown').innerHTML = outputHTML;
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
function sortTableNumASC(tableToSort, column){

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
		if (x.innerHTML - y.innerHTML > 0) {
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
function sortTableASC(tableToSort, column){

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
		if (x.innerHTML < y.innerHTML) {
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
function prevPage(){
    if (currentPage > 1) {
        currentPage--;
		document.getElementById("page").innerHTML = currentPage;
        playersStatsNHL("ALL", document.getElementById("NHLseasonstats").options[document.getElementById("NHLseasonstats").options.selectedIndex].text, document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text);
    }
}
function nextPage(){
    currentPage++;
	document.getElementById("page").innerHTML = currentPage;
    playersStatsNHL("ALL", document.getElementById("NHLseasonstats").options[document.getElementById("NHLseasonstats").options.selectedIndex].text, document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text);
}
function getCurrentPage(){
	document.getElementById("page").innerHTML = currentPage;
}