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
localStorage['GP_PO'] = true;
localStorage['Wins_PO'] = true;
localStorage['Losses_PO'] = true;
localStorage['Points_PO'] = true;
localStorage['PCT_PO'] = true;
localStorage['GF_PO'] = true;
localStorage['GA_PO'] = true;
localStorage['Goal_Diff_PO'] = true;

let currentPage = 1;
let recordsPerPage = 27;

let date = new Date();
localStorage['year'] = date.getFullYear();
localStorage['month'] = date.getMonth();

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

function sorterTeams(table, typer){
	let numColumn = 0;
	let columns = [];
	if(typer !== "POST-SEASON"){
		list1 = ['GP_RS', 'Wins', 'Losses', 'Ties', 'OTL', 'Points', 'PCT', 'l10', 'GF', 'GA', 'Goal_Diff'];
		
		list1.forEach(x => {
			console.log(localStorage[x]);
			if(localStorage[x] === 'true'){
				numColumn += 1;
				columns.push(x);
			};
		});
	}
	else{
		list1 = ['GP_PO', 'Wins_PO', 'Losses_PO', 'Points_PO', 'PCT_PO', 'GF_PO', 'GA_PO', 'Goal_Diff_PO'];
		
		list1.forEach(x => {
			console.log(localStorage[x]);
			if(localStorage[x] === 'true'){
				numColumn += 1;
				columns.push(x);
			};
		});
	}
	let sorter1 = `<tr>`;
	sorter1 += `<th onclick = 'if(localStorage["${table}${0}"] === "DESC"){sortTable("${table}",${0}); localStorage["${table}${0}"] = "ASC";} else{sortTableASC("${table}",${0}); localStorage["${table}${0}"] = "DESC"}'>Team</th>`;

	for (let x = 1; x <= numColumn; x++){
		sorter1 += `<th onclick = 'if(localStorage["${table}${x}"] === "DESC"){sortTableNum("${table}",${x}); localStorage["${table}${x}"] = "ASC";} else{sortTableNumASC("${table}",${x}); localStorage["${table}${x}"] = "DESC"}'>${columns[x - 1]}</th>`;
	}
	sorter1 += `</tr>`;

	return [columns, sorter1];
}

async function getAPI(url){

	const url2 = 'https://corsproxy.io/?' + encodeURIComponent(url);
	const response = await fetch(url);
	const result = await response.json()
	return result;
}

function leagueFilters(){
	let outputHTML = '';
    outputHTML += `<option value = 'Skaters' selected>SKATERS</option>
					<option value = 'Goalies'>GOALIES</option>
				`;

	document.getElementById('NHLleaguesstats').innerHTML = outputHTML;
}

async function teamFilters(){
	let outputHTML = '';

    let leagueArray = [];
    const teamArray = await getAPI('https://api-web.nhle.com/v1/standings/now')
    const sortedTeamArray = teamArray.standings.map(value => {
       	return{
        	    Abbr: value.teamAbbrev.default,
				fullTeamName: value.teamName.default
       	}
   	});
    await sortedTeamArray.forEach(value => {
        leagueArray.push(value.Abbr);
    })

	console.log(leagueArray);
    localStorage['NHL'] = leagueArray.filter(team => (team !== 'ARI'));

	outputHTML += `<option value = 'ALL' selected>ALL</option>`;

	console.log(sortedTeamArray);
	sortedTeamArray.sort(function(a, b){return a.Abbr.localeCompare(b.Abbr)}).forEach(value => {
		outputHTML += `<option value = '${value.fullTeamName}'>${value.Abbr}</option>`;
	})

	console.log(outputHTML);
	
	document.getElementById('NHLteamsstats').innerHTML = outputHTML;
}

function seasonFilters(){
	let outputHTML = '';
    outputHTML += `
				<option value = 'Regular Season'>REGULAR SEASON</option>
				<option value = 'Post Season'>POST-SEASON</option>
				`;

	document.getElementById('NHLseasonstats').innerHTML = outputHTML;
}

async function teamScheduleOverview(team){

	let year = Number(localStorage['year']);
	let month = Number(localStorage['month']);

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];
	const days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	let outputHTML = `<table id = 'teamCalender'><tbody>
						<tr><th onclick = 'if(Number(localStorage["month"]) === 0){localStorage["month"] = 11; localStorage["year"] = Number(localStorage["year"]) - 1; teamScheduleOverview(localStorage["currentTeam"])}else{localStorage["month"] = Number(localStorage["month"]) - 1; teamScheduleOverview(localStorage["currentTeam"])}'><</th><th colspan="5">${months[Number(localStorage["month"])]} ${localStorage["year"]}</th><th onclick = 'if(Number(localStorage["month"]) === 11){localStorage["month"] = 0; localStorage["year"] = Number(localStorage["year"]) + 1; teamScheduleOverview(localStorage["currentTeam"])}else{localStorage["month"] = Number(localStorage["month"]) + 1; teamScheduleOverview(localStorage["currentTeam"])}'>></th></tr>
						<tr><th>Sunday</th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th><th>Saturday</th></tr>
					`;
	let dayone = new Date(year, month, 1).getDay();
    let lastdate = new Date(year, month + 1, 0).getDate();
	let lastdatePrev = new Date(year, month, 0).getDate();
    let dayend = new Date(year, month -1, lastdatePrev).getDay();
	let dayendNext = new Date(year, month + 1, lastdate).getDay();
    let monthlastdate = new Date(year, month, 0).getDate();

	console.log(lastdate);
	console.log(dayend);
	let counter = 0;
	let reverseCounter = 0 - dayend;
	let dayOfWeekCounter = dayone;
	let dayOfWeekCounterReverse = 6 - dayone;

	for(let x = 0; x <= (lastdate + dayend) / 7; x++){
		if(x === 0){
			outputHTML += `<tr>`;
			for(let y = (0 - dayone); y <= 0; y++){
				console.log(y);
					if(y === 0){
						counter++;
						const game = await getSchedule(1);
						game.forEach(info => {
							console.log(info);
							if(info !== 'No Games'){
								if(counter <= 7 - dayone){
									outputHTML += `<td><div class = content>${counter}<p class = dayNumber>`
									info.games.forEach(info2 => {
										outputHTML += `<div class = 'Matchup'><img class = "scheduleLogoAway" src = "${info2.awayTeam.darkLogo}">vs<img class = "scheduleLogoHome" src = "${info2.homeTeam.darkLogo}"></div></p>`;
									})
									counter++;
									outputHTML += `</div></td>`;
								}
							}			
							else{
								if(counter <= 7 - dayone){
									outputHTML += `<td><div class = content><p class = dayNumber>${counter}</p></div></td>`;
									counter++;
								}
							}
						});						
						dayOfWeekCounter++;
					}
					else{
						outputHTML += `<td><div class = content><p class = dayNumber>${monthlastdate + reverseCounter}</p></div></td>`;
						dayOfWeekCounterReverse++;
						reverseCounter++;

					}

				}
				outputHTML += `</tr>`;
			}
		else{
			let check = 0
			let schedule = [];
			dateofday = counter;
			counter++;
			for(let y = 0; y < 5; y++){
				outputHTML += `<tr>`;
				if(counter < lastdate){
					console.log(counter);
					if (counter === (Number(check)) || Number(check) === 0){
						schedule = await getSchedule(dateofday);
						console.log("here")
						check = (counter + 7);
					}
					const game = schedule;
					console.log(game);
						game.forEach(info => {
							console.log(info);
							if(info !== 'No Games'){
								if(dateofday <= lastdate){
									outputHTML += `<td><div class = content><p class = dayNumber>${dateofday}</p>`
									info.games.forEach(info2 => {
										outputHTML += `<div class = 'Matchup'><img class = "scheduleLogoAway" src = "${info2.awayTeam.darkLogo}">vs<img class = "scheduleLogoHome" src = "${info2.homeTeam.darkLogo}"></div></p>`;
									})
									dateofday++;
									outputHTML += `</div></td>`;
								}
							}			
							else{
								if(dateofday <= lastdate){
									outputHTML += `<td><div class = content><p class = dayNumber>${dateofday}</p></div></td>`;
									dateofday++;
								}
							}
						});
				}
				else{
					continue;
				}
				outputHTML += `</tr>`;
				counter = counter + 7;
			}
		}
	}
	outputHTML += `</table></tbody>`;

	console.log(outputHTML);

	document.getElementById('teamScheduleOverview').innerHTML = outputHTML;

	async function getSchedule(day){
		let returnthat = [];
		console.log(month + " " + day)
		if(day < 10 && month < 10){
			return await getAPI(`https://api-web.nhle.com/v1/schedule/${year}-0${month + 1}-0${day}`)
			.then(info => {
				for(data in info.gameWeek){
					if(info.gameWeek[data].numberOfGames !== 0){
						console.log(info.gameWeek[data]);
						returnthat.push(info.gameWeek[data]);
					}
					else{
						returnthat.push('No Games');
					}
				}
				console.log(returnthat);
				return returnthat;
			})
		}
		else if(day < 10){
			return await getAPI(`https://api-web.nhle.com/v1/schedule/${year}-${month + 1}-0${day}`)
			.then(info => {
				for(data in info.gameWeek){
					if(info.gameWeek[data].numberOfGames !== 0){
						console.log(info.gameWeek[data]);
						returnthat.push(info.gameWeek[data]);
					}
					else{
						returnthat.push('No Games');
					}
				}
				console.log(returnthat);
				return returnthat;
			})
		}
		else if(month < 10){
			return await getAPI(`https://api-web.nhle.com/v1/schedule/${year}-0${month + 1}-${day}`)
			.then(info => {
				for(data in info.gameWeek){
					if(info.gameWeek[data].numberOfGames !== 0){
						console.log(info.gameWeek[data]);
						returnthat.push(info.gameWeek[data]);
					}
					else{
						returnthat.push('No Games');
					}
				}
				console.log(returnthat);
				return returnthat;
			})
		}
		else{
			return await getAPI(`https://api-web.nhle.com/v1/schedule/${year}-${month + 1}-${day}`)
			.then(info => {
				for(data in info.gameWeek){
					if(info.gameWeek[data].numberOfGames !== 0){
						console.log(info.gameWeek[data]);
						returnthat.push(info.gameWeek[data]);
					}
					else{
						returnthat.push('No Games');
					}
				}
				console.log(returnthat);
				return returnthat;
			})
		}
	}
}

async function teamTablesOverview(team){
    let teamArray = [];
	console.log(localStorage['NHL']);
    teamArray = await getTeam()
		.then(value1 => {
			console.log(value1);
			let outputHTML =``;
			outputHTML += '<tbody>';
			outputHTML += sorterMain('teamTablesOverview', 8);
			value1.forEach(value => {
				if (team != 'ALL'){
					if (value.Abbr == team){
						outputHTML += `<tr><td onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage["currentTeam"] = document.getElementById("NHLteamsstats").options[document.getElementById("NHLteamsstats").options.selectedIndex].text; window.location.href = "NHLstatsteam.html"'>${value.Abbr}</td><td>${value.GP_RS}</td><td>${value.Wins}</td><td>${value.Losses}</td><td>${value.Ties}</td><td>${value.OTL}</td><td>${value.Points}</td><td>${value.PCT}</td><td>${value.l10}</td></tr>`;
					}
				}
				else{
					outputHTML += `<tr><td id = ${value.Abbr} onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage.setItem("currentTeam", document.getElementById("${value.Abbr}").innerHTML); window.location.href = "NHLstatsteam.html";'>${value.Abbr}</td><td>${value.GP_RS}</td><td>${value.Wins}</td><td>${value.Losses}</td><td>${value.Ties}</td><td>${value.OTL}</td><td>${value.Points}</td><td>${value.PCT}</td><td>${value.l10}</td></tr>`;
				}
			});
    	outputHTML += `</tbody>`;

    	document.getElementById('teamTablesOverview').innerHTML = outputHTML;
		})

	async function getTeam(){
		return await getAPI('https://api-web.nhle.com/v1/standings/now')
			.then(value => {
				console.log(value);
				const newArray = value.standings.map(info => {
					return {
						Abbr: info.teamAbbrev.default,
						GP_RS: info.gamesPlayed,
						Wins: info.wins,
						Losses: info.losses,
						Ties: info.ties,
						OTL: info.otLosses,
						Points: info.points,
						PCT: info.pointPctg,
						l10: info.l10Wins,
					}
				})
				console.log(newArray);
				return newArray;
			})
	}
}

async function standingsNHL(){
	let team = localStorage['currentTeam'];

	const standings = await getStandings()
	
	const standingsSortedWest = standings.standings.filter(info => info.conferenceAbbrev.includes('W'));

	const standingsSortedEast = standings.standings.filter(info => info.conferenceAbbrev.includes('E'));

	let outputHTMLWest = `
						<table id = 'West'>
							<tbody>
								<tr>
									<th>Team</th><th>Division</th><th>GP</th><th>Points</th><th>Wins</th><th>Position</th>
								</tr>
						`;

	console.log(standingsSortedWest);
	standingsSortedWest.forEach(value => {
		console.log(value);
		if(value.clinchIndicator != undefined){
			outputHTMLWest += `
							<tr>
								<td id = ${value.teamAbbrev.default} onclick = 'localStorage.setItem("currentTeam", document.getElementById("${value.teamAbbrev.default}").id); window.location.href = "NHLstatsteam.html"'>${value.teamName.default}</td><td>${value.divisionName}</td><td>${value.gamesPlayed}</td><td>${value.points}</td><td>${value.regulationPlusOtWins}</td><td>${value.clinchIndicator}</td>
							</tr>
							`;
		}
		else{
			outputHTMLWest += `
							<tr>		
								<td id = ${value.teamAbbrev.default} onclick = 'localStorage.setItem("currentTeam", document.getElementById("${value.teamAbbrev.default}").id); window.location.href = "NHLstatsteam.html"'>${value.teamName.default}</td><td>${value.divisionName}</td><td>${value.gamesPlayed}</td><td>${value.points}</td><td>${value.regulationPlusOtWins}</td><td>${value.conferenceSequence}</td>
							</tr>
							`;
		}
	})
	outputHTMLWest += `
						</tbody>
						</table>
					`;
	document.getElementById('teamStandingsOverview').innerHTML += outputHTMLWest;

	let outputHTMLEast = `
						<table id = 'East'>
							<tbody>
								<tr>
									<th>Team</th><th>Division</th><th>GP</th><th>Points</th><th>Wins</th><th>Position</th>
								</tr>
						`;

	console.log(standingsSortedEast);
	standingsSortedEast.forEach(value => {
		console.log(value);
		if(value.clinchIndicator != undefined){
			outputHTMLEast += `
							<tr>		
								<td id = ${value.teamAbbrev.default} onclick = 'localStorage.setItem("currentTeam", document.getElementById("${value.teamAbbrev.default}").id); window.location.href = "NHLstatsteam.html"'>${value.teamName.default}</td><td>${value.divisionName}</td><td>${value.gamesPlayed}</td><td>${value.points}</td><td>${value.regulationPlusOtWins}</td><td>${value.clinchIndicator}</td>
							</tr>
							`
		}
		else{
			outputHTMLEast += `
							<tr>		
								<td id = ${value.teamAbbrev.default} onclick = 'localStorage.setItem("currentTeam", document.getElementById("${value.teamAbbrev.default}").id); window.location.href = "NHLstatsteam.html"'>${value.teamName.default}</td><td>${value.divisionName}</td><td>${value.gamesPlayed}</td><td>${value.points}</td><td>${value.regulationPlusOtWins}</td><td>${value.conferenceSequence}</td>
							</tr>
			`
		}
	})
	outputHTMLEast += `
						</tbody>
					</table>
					`;

document.getElementById('teamStandingsOverview').innerHTML += outputHTMLEast;


	async function getStandings(){
		return await getAPI(`https://api-web.nhle.com/v1/standings/now`);
	}
}

async function playerStatsNHL(){

	let team = localStorage['currentTeam'];
	let player = localStorage['currentPlayer'];
	console.log(player);

	let playerStats = await getPlayerStats();
	let playerInfo = await getPlayerInfo();


	console.log(playerInfo);
	console.log(playerStats);

	const arrayPlayerStats = {
		...playerStats,
		...playerInfo.find((element) => {
			return element.playerId === playerStats.playerId
		}),
	}

	console.log(arrayPlayerStats);

	async function getPlayerStats(){
		return await getAPI(`https://api-web.nhle.com/v1/club-stats/${team}/now`)
			.then(value => {
				console.log(value);
				const info = value.skaters.find(element => {
					return element.playerId == player
				})
				console.log(info);
				return {
					playerId: info.playerId,
					GP: info.gamesPlayed,
					Goals: info.goals,
					Assists: info.assists,
					Points: info.points,
					PlusMinus: info.plusMinus,
					PIM: info.penaltyMinutes,
					PPG: info.powerPlayGoals,
					SHG: info.shorthandedGoals,
					GWG: info.gameWinningGoals,
					OTG: info.overtimeGoals,
					Shots: info.shots,
					ShotPer: info.shootingPctg,
					FOPer: info.faceoffWinPctg,
				}
		})
	}

	async function getPlayerInfo(){
		return await getAPI(`https://api-web.nhle.com/v1/roster/${team}/current`)
			.then(value => {
				console.log(value);
				const forwardsArray = value.forwards.map(info => {
					return {
						playerId: info.id,
						headshot: info.headshot,
						Name: `${info.firstName.default} ${info.lastName.default}`,
						sweaterNumber: info.sweaterNumber,
						position: info.positionCode,
						shoots: info.shootsCatches,
						height: info.heightInInches,
						weight: info.weightInPounds,
						DOB: info.birthDate,
						nationality: info.birthCountry,
					}
				})
				const defensemenArray = value.defensemen.map(info => {
					return {
						playerId: info.id,
						headshot: info.headshot,
						Name: `${info.firstName.default} ${info.lastName.default}`,
						sweaterNumber: info.sweaterNumber,
						position: info.positionCode,
						shoots: info.shootsCatches,
						height: info.heightInInches,
						weight: info.weightInPounds,
						DOB: info.birthDate,
						nationality: info.birthCountry,
					}
				})
			return newArray = [
				...forwardsArray,
				...defensemenArray,
			];
		})
	}

	let outputHTMLPlayer = '';
	let outputHTMLPlayerName = '';
	let outputHTMLPlayerPortrait = '';
	outputHTMLPlayer += `<tbody>`;

	outputHTMLPlayerName += `${arrayPlayerStats.Name}`;

	document.getElementById('NHLPlayerName').style.fontSize = '100px';

	outputHTMLPlayer += `
			<tr><th>GP</th><td>${arrayPlayerStats.GP}</td></tr>
			<tr><th>Goals</th><td>${arrayPlayerStats.Goals}</td></tr>
			<tr><th>Assists</th><td>${arrayPlayerStats.Assists}</td></tr>
			<tr><th>Points</th><td>${arrayPlayerStats.Points}</td></tr>
			<tr><th>PlusMinus</th><td>${arrayPlayerStats.PlusMinus}</td></tr>
			<tr><th>PIM</td><td>${arrayPlayerStats.PIM}</td></tr>
			<tr><th>PPG</td><td>${arrayPlayerStats.PPG}</td></tr>
			<tr><th>SHG</td><td>${arrayPlayerStats.SHG}</td></tr>
			<tr><th>GWG</td><td>${arrayPlayerStats.GWG}</td></tr>
			<tr><th>OT Goals</th><td>${arrayPlayerStats.OTG}</td></tr>
			<tr><th>Shots</th><td>${arrayPlayerStats.Shots}</td></tr>
			<tr><th>Shots%</th><td>${arrayPlayerStats.ShotPer}</td></tr>
			<tr><th>FO%</th><td>${arrayPlayerStats.FOPer}</td></tr>
		`;

	let url = arrayPlayerStats.headshot;
	
	outputHTMLPlayerPortrait += `<img src = ${url}></img>`;
	
	document.getElementById('NHLstatsPlayer').innerHTML = outputHTMLPlayer;
	document.getElementById('NHLPlayerName').innerHTML = outputHTMLPlayerName;
	document.getElementById('NHLPlayerPortrait').innerHTML = outputHTMLPlayerPortrait;
}


async function teamStatsNHL(){
	console.log(localStorage['currentLeague']);
	console.log(localStorage['currentTeam']);
	let team = localStorage['currentTeam'];
	let teamRoster = await getTeamRoster();
	let teamStats = await getTeamStats();
	let teamInfo = await getTeamInfo();

	console.log(teamRoster);
	console.log(teamInfo);
	console.log(teamStats);

	async function getTeamInfo(){
		return await getAPI(`https://api-web.nhle.com/v1/standings/now`)
			.then(value => {
				return value.standings.find((info) => {
						return info.teamAbbrev.default === team	
				})			
		})
	}
	async function getTeamStats(){
		return await getAPI(`https://api-web.nhle.com/v1/club-stats/${team}/now`)
			.then(value => {
				console.log(value);
				const skatersArray = value.skaters.map(info => {
					return {
						playerId: info.playerId,
						points: info.points,
						GP: info.gamesPlayed,
					}
					
				})
				const goaliesArray = value.goalies.map(info => {
					return {
						playerId: info.playerId,
						points: info.points,
						GP: info.gamesPlayed,
					}
				})
			return newArray = [
				...skatersArray,
				...goaliesArray,
			];
		})
	}

	async function getTeamRoster(){
		return await getAPI(`https://api-web.nhle.com/v1/roster/${team}/current`)
			.then(value => {
				console.log(value);
				const forwardsArray = value.forwards.map(info => {
					return {
						playerId: info.id,
						headshot: info.headshot,
						name: `${info.firstName.default} ${info.lastName.default}`,
						sweaterNumber: info.sweaterNumber,
						position: info.positionCode,
						hand: info.shootsCatches,
						height: info.heightInInches,
						weight: info.weightInPounds,
						DOB: info.birthDate,
						nationality: info.birthCountry,
					}
					
				})
				const defensemenArray = value.defensemen.map(info => {
					return {
						playerId: info.id,
						headshot: info.headshot,
						name: `${info.firstName.default} ${info.lastName.default}`,
						sweaterNumber: info.sweaterNumber,
						position: info.positionCode,
						hand: info.shootsCatches,
						height: info.heightInInches,
						weight: info.weightInPounds,
						DOB: info.birthDate,
						nationality: info.birthCountry,
					}
				})
				const goaliesArray = value.goalies.map(info => {
					return {
						playerId: info.id,
						headshot: info.headshot,
						name: `${info.firstName.default} ${info.lastName.default}`,
						sweaterNumber: info.sweaterNumber,
						position: info.positionCode,
						hand: info.shootsCatches,
						height: info.heightInInches,
						weight: info.weightInPounds,
						DOB: info.birthDate,
						nationality: info.birthCountry,
					}
				})
			return newArray = [
				...forwardsArray,
				...defensemenArray,
				...goaliesArray,
			];
		})
	}

	console.log(teamStats);
	const combinedArray = teamRoster.map(info => ({
		...info,
		...teamStats.find((element) => {
			return element.playerId === info.playerId
		}),
	}))


	console.log(combinedArray);

	let outputHTMLRoster = '';
	let outputHTMLRosterStats = '';
	let LW = [];
	let RW = [];
	let C = [];
	let LD = [];
	let RD = [];
	let G = [];
	let F1Points = 0;
	let F2Points = 0;
	let F3Points = 0;
	let F4Points = 0;
	let D1Points = 0;
	let D2Points = 0;
	let D3Points = 0;
	let LWCount = 1;
	let RWCount = 1;
	let CCount = 1;
	let LDCount = 1;
	let RDCount = 1;
	let outputHTMLLinesStats = '';
	let overFlowPoints = [];
	let overFlowNameOffense = [];
	let overFlowNameDefense = [];
	let totalPoints;

	outputHTMLRoster += `
			<tbody>
			<tr><th>LW</th><th>C</th><th>RW</th></tr>
	`;
	outputHTMLRosterStats += `<tbody>`;
	outputHTMLLinesStats += `<tbody>`;
	outputHTMLRosterStats += `<tr><th onclick = 'sortTable("NHLstatsteamRosterStats", 0)'>Name</th><th onclick = 'sortTable("NHLstatsteamRosterStats", 1)'>DOB</th><th onclick = 'sortTableNum("NHLstatsteamRosterStats", 2)'>Age</th><th onclick = 'sortTable("NHLstatsteamRosterStats", 3)'>Height</th><th onclick = 'sortTableNum("NHLstatsteamRosterStats", 4)'>Weight</th></tr>`;

	document.getElementById('NHLTeamLogo').style.fontSize = '100px';
	document.getElementById('NHLTeamLogo').innerHTML = teamInfo.teamName.default;

	let url = teamInfo.teamLogo;

	combinedArray.sort(function(a, b){return b.points - a.points || b.GP - a.GP}).forEach(value => {

		console.log(value);

		if(value.position === 'L' && value.points !== undefined){
			if(LWCount === 1){
				F1Points += value.points;
			}
			if(LWCount === 2){
				F2Points += value.points;
			}
			if(LWCount === 3){
				F3Points += value.points;
			}
			if(LWCount === 4){
				F4Points += value.points;
			}
			if(LWCount > 4){
				overFlowNameOffense.push(value.name)
				overFlowPoints.push(value.points)
			}
			LWCount += 1;
			LW.push(value.name);
		}
		else if(value.position === 'C' && value.points !== undefined){
			if(CCount === 1){
				F1Points += value.points;
			}
			if(CCount === 2){
				F2Points += value.points;
			}
			if(CCount === 3){
				F3Points += value.points;
			}
			if(CCount === 4){
				F4Points += value.points;
			}
			if(CCount > 4){
				overFlowNameOffense.push(value.name)
				overFlowPoints.push(value.points)
			}
			CCount += 1;
			C.push(value.name);
		}
		else if(value.position === 'R' && value.points !== undefined){
			if(RWCount === 1){
				F1Points += value.points;
			}
			if(RWCount === 2){
				F2Points += value.points;
			}
			if(RWCount === 3){
				F3Points += value.points;
			}
			if(RWCount === 4){
				F4Points += value.points;
			}
			if(RWCount > 4){
				overFlowNameOffense.push(value.name)
				overFlowPoints.push(value.points)
			}
			RWCount += 1;
			RW.push(value.name);
		}
		else if(value.position === 'D' && value.hand == 'R' && value.points !== undefined){
			if(LDCount === 1){
				D1Points += value.points;
			}
			if(LDCount === 2){
				D2Points += value.points;
			}
			if(LDCount === 3){
				D3Points += value.points;
			}
			if(LDCount > 4){
				overFlowNameDefense.push(value.name)
				overFlowPoints.push(value.points)
			}
			LDCount += 1;
			LD.push(value.name);
		}
		else if(value.position === 'D' && value.hand === 'L' && value.points !== undefined){
			if(RDCount === 1){
				D1Points += value.points;
			}
			if(RDCount === 2){
				D2Points += value.points;
			}
			if(RDCount === 3){
				D3Points += value.points;
			}
			if(LDCount > 4){
				overFlowNameDefense.push(value.name)
				overFlowPoints.push(value.points)
			}
			RDCount += 1;
			RD.push(value.name);
		}
		else if(value.position === 'G'){
			G.push(value.name);
		}

		if(value.points !== undefined){
			outputHTMLRosterStats += `
				<tr><td id = '${value.playerId}' onclick = 'localStorage.setItem("currentPlayer", document.getElementById("${value.playerId}").id); window.location.href = "NHLstatsplayer.html"'>${value.name}</td><td>${value.DOB}</td><td>${2023 - value.DOB.slice(0,4)}</td><td>${Math.floor(value.height / 12)}'${value.height % 12}"</td><td>${value.weight}</td></tr>
			`;
		}
	})

		F1Points = F1Points || 0
		F2Points = F2Points || 0
		F3Points = F3Points || 0
		F4Points = F4Points || 0
		D1Points = D1Points || 0
		D2Points = D2Points || 0
		D3Points = D3Points || 0

		overFlowPoints.forEach(value => {
			console.log(value);
			totalPoints += value;
		})

		totalPoints = F1Points + F2Points + F3Points + F4Points + D1Points + D2Points + D3Points;

		overFlowNameOffense.forEach(value => {
			console.log(value);
			if(LWCount <= 4){
				LW.push(value);
				LWCount += 1;
			}
			else if(CCount <= 4){
				C.push(value);
				CCount += 1;
			}
			else if (RWCount <= 4){
				RW.push(value);
				RWCount += 1;
			}
		})

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

		outputHTMLRoster += `
				<tr><td>${LW[0]}</td><td>${C[0]}</td><td>${RW[0]}</td></tr>
				<tr><td>${LW[1]}</td><td>${C[1]}</td><td>${RW[1]}</td></tr>
				<tr><td>${LW[2]}</td><td>${C[2]}</td><td>${RW[2]}</td></tr>
				<tr><td>${LW[3]}</td><td>${C[3]}</td><td>${RW[3]}</td></tr>
				<tr><th>LD</th><th>RD</th><td rowspan="6"><img src = ${url}></td></tr>
				<tr><td>${LD[0]}</td><td>${RD[0]}</td></tr>
				<tr><td>${LD[1]}</td><td>${RD[1]}</td></tr>
				<tr><td>${LD[2]}</td><td>${RD[2]}</td></tr>
				<tr><th>Main</th><th>Backup</th></tr>
				<tr><td>${G[0]}</td><td>${G[1]}</td></tr>
				</tbody>
		`;
		outputHTMLRosterStats += `</tbody>`;
		outputHTMLLinesStats += `<tbody>`;
		document.getElementById('NHLstatsteamRoster').innerHTML = outputHTMLRoster;
		document.getElementById('NHLstatsteamRosterStats').innerHTML = outputHTMLRosterStats;
		document.getElementById('NHLstatsteamLinesStats').innerHTML = outputHTMLLinesStats;
}

async function playersStatsNHL(team, gameType, position){

	console.log(localStorage['NHL'].split(','));
	console.log(currentPage);
	console.log(localStorage['Goals']);
	let promise2;
	let typer;
	let positioner = position;

	console.log(gameType);
	if (gameType === "POST-SEASON"){
		typer = 3;
	}
	else{
		typer = 2;
	}

	console.log(typer);
	const valuesReturned = sorterPlayers('playersTablesOverview', positioner);
	let columns = valuesReturned[0];
	let outputHTML = valuesReturned[1];
	console.log(position);
	let counter;

	if(team !== 'ALL'){
		counter = 1;
		await getPlayerStatsArray(team, typer, position)
			.then(value => {
				for(let x = (currentPage - 1) * recordsPerPage; x < value.length; x++){
					if(value[x].Name != undefined){
					counter++;
					if(counter + (currentPage * recordsPerPage) <= (currentPage * recordsPerPage) + recordsPerPage){
					outputHTML += `<tr><td id = ${value.Abbr} onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage.setItem("currentTeam", document.getElementById("${value.Abbr}").innerHTML); window.location.href = "NHLstatsteam.html";'>${team}</td><td id = "${value[x].playerId}" onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage["currentTeam"] = document.getElementById("NHLteamsstats").options[document.getElementById("NHLteamsstats").options.selectedIndex].text; localStorage.setItem("currentPlayer", document.getElementById("${value[x].playerId}").id); window.location.href = "NHLstatsplayer.html"'>${value[x].Name}</td>`
					columns.forEach(info => {
						outputHTML += `<td>${value[x][info]}</td>`;
					})
					outputHTML += `</tr>`
				}
				else{
					counter = 1;
					break;
				}
				};
			};
			});
			outputHTML += `</tbody>`;
			document.getElementById('playersTablesOverview').innerHTML = outputHTML;
			document.getElementById("divPage").innerHTML = '';
	}

	else{
		const promise1 = localStorage['NHL'].split(',').map(async info => {
			promise2 = await getPlayerStatsArray(info, typer);
			return Promise.resolve(promise2);
		});
		counter = 1;
		console.log(await Promise.all(promise1));
		let teamStatsRoster = await Promise.all(promise1);
		teamStatsRoster = teamStatsRoster.flat()
		teamStatsRoster.sort(function(a, b) {
			return b.Points - a.Points;
		});
		console.log(teamStatsRoster);

		for(let x = (currentPage - 1) * recordsPerPage; x < teamStatsRoster.length; x++){
			if(teamStatsRoster[x].Name != undefined){
			counter++;
			if(counter + (currentPage * recordsPerPage) <= (currentPage * recordsPerPage) + recordsPerPage){
				outputHTML += `<tr><td id = '${teamStatsRoster[x].team}' onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage.setItem("currentTeam", document.getElementById("${teamStatsRoster[x].team}").innerHTML); window.location.href = "NHLstatsteam.html"'>${teamStatsRoster[x].team}</td><td id = "${teamStatsRoster[x].playerId}" onclick = 'localStorage.setItem("currentTeam", document.getElementById("${teamStatsRoster[x].team}").innerHTML); localStorage.setItem("currentPlayer", ${teamStatsRoster[x].playerId}); window.location.href = "NHLstatsplayer.html"'>${teamStatsRoster[x].Name}</td>`
				columns.forEach(info => {
					outputHTML += `<td>${teamStatsRoster[x][info]}</td>`;
				})
					outputHTML += `</tr>`
			}					
			else{
				counter = 1;
				break;
			}
		}
		}

		console.log(outputHTML);
		outputHTML += `</tbody>`;
		document.getElementById('playersTablesOverview').innerHTML = outputHTML;
		displayPages();
	}

	function displayPages(){
		let outputHTMLPages = `
					<div onclick='prevPage()' id="btn_prev">Prev</div>
					<div onclick ='nextPage()' id="btn_next">Next</div>
					page: <span id="page">${currentPage}</span>
				`
		document.getElementById("divPage").innerHTML = outputHTMLPages;
	}

	async function getPlayerStatsArray(team, typer, position){
		let playerStats = await getPlayerStats(team, typer, position);
		let playerInfo = await getPlayerInfo();
	
		return playerStats.map(info => {
			return{
				...info,
				...playerInfo.find((element) => {
						return element.playerId === info.playerId
				}),
			}
		});

		async function getPlayerStats(team, typer, position){
			console.log(position);
			return await getAPI(`https://api-web.nhle.com/v1/club-stats/${team}/20232024/${typer}`)
				.then(value => {
					console.log(positioner);
					if(positioner === "SKATERS"){
					return value.skaters.map(info => {
						return {
							team: team,
							playerId: info.playerId,
							GP: info.gamesPlayed,
							Goals: info.goals,
							Assists: info.assists,
							Points: info.points,
							PlusMinus: info.plusMinus,
							PIM: info.penaltyMinutes,
							PPG: info.powerPlayGoals,
							SHG: info.shorthandedGoals,
							GWG: info.gameWinningGoals,
							OTG: info.overtimeGoals,
							Shots: info.shots,
							ShotPer: info.shootingPctg,
							FOPer: info.faceoffWinPctg,
						}
					})
					}
					else{
						return value.goalies.map(info => {
							return {
								team: team,
								playerId: info.playerId,
								GP: info.gamesPlayed,
								Wins: info.wins,
								Losses: info.losses,
								OTL: info.overtimeLosses,
								GAA: info.goalsAgainstAverage,
								SVPer: info.savePercentage,
								SO: info.shutouts,
								Points: info.points,
							}
						})
					}
				})
		}

		async function getPlayerInfo(){
			return await getAPI(`https://api-web.nhle.com/v1/roster/${team}/current`)
				.then(value => {
					console.log(value);
					const forwardsArray = value.forwards.map(info => {
						return {
							playerId: info.id,
							headshot: info.headshot,
							Name: `${info.firstName.default} ${info.lastName.default}`,
							sweaterNumber: info.sweaterNumber,
							position: info.positionCode,
							shoots: info.shootsCatches,
							height: info.heightInInches,
							weight: info.weightInPounds,
							DOB: info.birthDate,
							nationality: info.birthCountry,
						}
					})
					const defensemenArray = value.defensemen.map(info => {
						return {
							playerId: info.id,
							headshot: info.headshot,
							Name: `${info.firstName.default} ${info.lastName.default}`,
							sweaterNumber: info.sweaterNumber,
							position: info.positionCode,
							shoots: info.shootsCatches,
							height: info.heightInInches,
							weight: info.weightInPounds,
							DOB: info.birthDate,
							nationality: info.birthCountry,
						}
					})
					const goaliesArray = value.goalies.map(info => {
						return {
							playerId: info.id,
							headshot: info.headshot,
							Name: `${info.firstName.default} ${info.lastName.default}`,
							sweaterNumber: info.sweaterNumber,
							position: info.positionCode,
							shoots: info.shootsCatches,
							height: info.heightInInches,
							weight: info.weightInPounds,
							DOB: info.birthDate,
							nationality: info.birthCountry,
						}
					})
				return newArray = [
					...forwardsArray,
					...defensemenArray,
					...goaliesArray,
				];
			})
		}
	}
}

async function teamStatsTables(team, gameType){
    let teamArray = [];
	console.log(localStorage['Netherton Hockey League']);
	if(team !== 'ALL'){
		newData = JSON.parse(localStorage['Netherton Hockey League']).find(value => (value.Name + " " + value.Nickname) === team)

		console.log(newData);

		newerData = {
			Abbr: newData.Abbr,
			Team: newData.Name + " " + newData.Nickname,
			GP_RS: newData.GP_RS,
			Wins: newData.Wins,
			Losses: newData.Losses,
			OTL: newData.OTL,
			Points: newData.Points,
			PCT: newData.PCT,
			GF: newData.G_RS,
			GA: newData.GA_RS,
			Goal_Diff: Number(newData.G_RS) - Number(newData.GA_RS)
		};

		console.log(newerData);
	}
	const valuesReturned = sorterTeams('teamTablesOverview', gameType);
	let columns = valuesReturned[0];
	let outputHTML = valuesReturned[1];

	let typer;

	console.log(gameType);
	if (gameType === "POST-SEASON"){
		typer = 3;
	}
	else{
		typer = 2;
	}

	if(typer === 2){
    	teamArray = await getTeam()
			.then(value1 => {
				console.log(value1);
				value1.forEach(value => {
					if (team !== 'ALL'){
						if (value.teamName === team){
							outputHTML += `<tr><td onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage["currentTeam"] = document.getElementById("NHLteamsstats").options[document.getElementById("NHLteamsstats").options.selectedIndex].text; window.location.href = "NHLstatsteam.html"'>${value.teamName}</td>`;
							columns.forEach(info => {
								if(value[info] > newerData[info]){
									outputHTML += `<td><div class = "fs">${value[info]}</div><div class = "relationalRed">(${newerData[info]})</div></td>`;
								}
								else{
									outputHTML += `<td>${value[info]} <p class = "relationalGreen">(${newerData[info]})</p></td>`;
								}
							})
							outputHTML += `</tr>`
						}
					}
					else{
						console.log(value.Abbr);
						console.log(newData2 = JSON.parse(localStorage['Netherton Hockey League']));
						if(value.Abbr === 'WSH'){
							newData2 = JSON.parse(localStorage['Netherton Hockey League']).find(value2 => 'WAS' === value2.Abbr)
						}
						else if (value.Abbr === 'ARI'){
							newData2 = JSON.parse(localStorage['Netherton Hockey League']).find(value2 => 'ARZ' === value2.Abbr)
						}
						else{
							newData2 = JSON.parse(localStorage['Netherton Hockey League']).find(value2 => value.Abbr === value2.Abbr)
						}
						console.log(newData2);
					
						newerData2 = {
								Abbr: newData2.Abbr,
								Team: newData2.Name + " " + newData2.Nickname,
								GP_RS: newData2.GP_RS,
								Wins: newData2.Wins,
								Losses: newData2.Losses,
								OTL: newData2.OTL,
								Points: newData2.Points,
								PCT: newData2.PCT,
								GF: newData2.G_RS,
								GA: newData2.GA_RS,
								Goal_Diff: Number(newData2.G_RS) - Number(newData2.GA_RS)
							};
					
						console.log(newerData2);
						outputHTML += `<tr><td id = ${value.Abbr} onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage.setItem("currentTeam", document.getElementById("${value.Abbr}").id); window.location.href = "NHLstatsteam.html";'>${value.teamName}</td>`;
						columns.forEach(info => {
							if(value[info] > newerData2[info]){
								outputHTML += `<td>${value[info]} <div class = "relationalRed">(${newerData2[info]})</div></td>`;
							}
							else{
								outputHTML += `<td>${value[info]} <div class = "relationalGreen">(${newerData2[info]})</div></td>`;
							}
						})
						outputHTML += `</tr>`
					}
				});
    		outputHTML += `</tbody>`;

    		document.getElementById('teamTablesOverview').innerHTML = outputHTML;
			})
	}
	else if(typer === 3){
		teamArray = await getTeamPlayoff()
			.then(value1 => {
				console.log(value1);
				value1.forEach(value => {
					if (team !== 'ALL'){
						if (value.teamName === team){
							outputHTML += `<tr><td onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage["currentTeam"] = document.getElementById("NHLteamsstats").options[document.getElementById("NHLteamsstats").options.selectedIndex].text; window.location.href = "NHLstatsteam.html"'>${value.teamName}</td>`;
							columns.forEach(info => {
								outputHTML += `<td>${value[info]}</td>`;
							})
							outputHTML += `</tr>`
						}
					}
					else{
						outputHTML += `<tr><td id = ${value.teamName} onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage.setItem("currentTeam", document.getElementById("${value.teamName}").innerHTML); window.location.href = "NHLstatsteam.html";'>${value.teamName}</td>`;
						columns.forEach(info => {
							outputHTML += `<td>${value[info]}</td>`;
						})
						outputHTML += `</tr>`
					}
				});
			outputHTML += `</tbody>`;

			document.getElementById('teamTablesOverview').innerHTML = outputHTML;
			})
	}

	async function getTeam(){
		return await getAPI(`https://api-web.nhle.com/v1/standings/2024-03-26`)
			.then(value => {
				console.log(value);
				const newArray = value.standings.map(info => {
					return {
						Abbr: info.teamAbbrev.default,
						teamName: info.teamName.default,
						GP_RS: info.gamesPlayed,
						Wins: info.wins,
						Losses: info.losses,
						Ties: info.ties,
						OTL: info.otLosses,
						Points: info.points,
						PCT: info.pointPctg,
						l10: info.l10Wins,
						GF: info.goalFor,
						GA: info.goalAgainst,
						Goal_Diff: info.goalDifferential,
					}
				})
				console.log(newArray);
				return newArray;
			})
	}
	async function getTeamPlayoff(){
		return await getAPI(`https://api.nhle.com/stats/rest/en/team/summary?cayenneExp=seasonId=20232024+and+gameTypeId=3`)
			.then(value => {
				const newArray = value.data.map(info => {
					return {
						teamName: info.teamFullName,
						GP_PO: info.gamesPlayed,
						Wins_PO: info.wins,
						Losses_PO: info.losses,
						Points_PO: info.points,
						PCT_PO: info.pointPct,
						GF_PO: info.goalsFor,
						GA_PO: info.goalsAgainst,
						Goal_Diff_PO: info.goalsFor = info.goalsAgainst,
					}
				})
				return newArray;
			})
	}
}

async function searchPlayers(lastName, gameType, position){
	let promise2;
	console.log(lastName);

	const valuesReturned = sorterPlayers('playersTablesOverview', position);
	let columns = valuesReturned[0];
	let outputHTML = valuesReturned[1];

	if (gameType === "POST-SEASON"){
		typer = 3;
	}
	else{
		typer = 2;
	}
	
	const promise1 = localStorage['NHL'].split(',').map(async info => {
		promise2 = await getPlayerStatsArray(info, typer, position);
		return Promise.resolve(promise2);
	});

	console.log(await Promise.all(promise1));
	const teamStatsRoster = await Promise.all(promise1);

	if(lastName === 'ALL'){
		currentPage = 1;
		playersStatsNHL('ALL', gameType, position);
	}
	else{
		teamStatsRoster.map(value2 => {
				value2.map(value1 => {
					console.log(value1);
					if(value1.Name == undefined){
						console.log('Error');
					}
					else{
					let nameArray = value1.Name.split(' ');
					console.log(nameArray[1]);
					console.log(lastName);
					if(lastName === nameArray[1]){
						outputHTML += `<tr><td onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage["currentTeam"] = "${value1.team}"; window.location.href = "NHLstatsteam.html"'>${value1.team}</td><td onclick = 'localStorage["currentPlayer"] = "${value1.playerId}"; localStorage["currentTeam"] = "${value1.team}"; window.location.href = "NHLstatsplayer.html"'>${value1.Name}</td>`
						columns.forEach(info => {
							outputHTML += `<td>${value1[info]}</td>`;
						})
						outputHTML += `</tr>`;				
					};
				};
				});		
			});
			
		console.log(outputHTML);
		outputHTML += `</tbody>`;
		document.getElementById('playersTablesOverview').innerHTML = outputHTML;
	};

	async function getPlayerStatsArray(team, typer, position){
		let playerStats = await getPlayerStats(team, typer, position);
		let playerInfo = await getPlayerInfo();
	
		return playerStats.map(info => {
			return{
				...info,
				...playerInfo.find((element) => {
					return element.playerId === info.playerId
				}),
			}
		});

		async function getPlayerStats(team, typer, position){
			console.log(position);
			return await getAPI(`https://api-web.nhle.com/v1/club-stats/${team}/20232024/${typer}`)
				.then(value => {
					if(position === "SKATERS"){
					return value.skaters.map(info => {
						return {
							team: team,
							playerId: info.playerId,
							GP: info.gamesPlayed,
							Goals: info.goals,
							Assists: info.assists,
							Points: info.points,
							PlusMinus: info.plusMinus,
							PIM: info.penaltyMinutes,
							PPG: info.powerPlayGoals,
							SHG: info.shorthandedGoals,
							GWG: info.gameWinningGoals,
							OTG: info.overtimeGoals,
							Shots: info.shots,
							ShotPer: info.shootingPctg,
							FOPer: info.faceoffWinPctg,
						}
					})
					}
					else{
						return value.goalies.map(info => {
							return {
								team: team,
								playerId: info.playerId,
								GP: info.gamesPlayed,
								Wins: info.wins,
								Losses: info.losses,
								OTL: info.overtimeLosses,
								GAA: info.goalsAgainstAverage,
								SVPer: info.savePercentage,
								SO: info.shutouts,
								Points: info.points,
							}
						})
					}
				})
		}

		async function getPlayerInfo(){
			return await getAPI(`https://api-web.nhle.com/v1/roster/${team}/current`)
				.then(value => {
					console.log(value);
					const forwardsArray = value.forwards.map(info => {
						return {
							playerId: info.id,
							headshot: info.headshot,
							Name: `${info.firstName.default} ${info.lastName.default}`,
							sweaterNumber: info.sweaterNumber,
							position: info.positionCode,
							shoots: info.shootsCatches,
							height: info.heightInInches,
							weight: info.weightInPounds,
							DOB: info.birthDate,
							nationality: info.birthCountry,
						}
					})
					const defensemenArray = value.defensemen.map(info => {
						return {
							playerId: info.id,
							headshot: info.headshot,
							Name: `${info.firstName.default} ${info.lastName.default}`,
							sweaterNumber: info.sweaterNumber,
							position: info.positionCode,
							shoots: info.shootsCatches,
							height: info.heightInInches,
							weight: info.weightInPounds,
							DOB: info.birthDate,
							nationality: info.birthCountry,
						}
					})
					const goaliesArray = value.goalies.map(info => {
						return {
							playerId: info.id,
							headshot: info.headshot,
							Name: `${info.firstName.default} ${info.lastName.default}`,
							sweaterNumber: info.sweaterNumber,
							position: info.positionCode,
							shoots: info.shootsCatches,
							height: info.heightInInches,
							weight: info.weightInPounds,
							DOB: info.birthDate,
							nationality: info.birthCountry,
						}
					})
				return newArray = [
					...forwardsArray,
					...defensemenArray,
					...goaliesArray,
				];
			})
		}
	}
}

async function searchTeam(team, gameType){
    let teamArray = [];

	const valuesReturned = sorterTeams('teamTablesOverview', gameType);
	let columns = valuesReturned[0];
	let outputHTML = valuesReturned[1];

	let typer;

	console.log(gameType);
	if (gameType === "POST-SEASON"){
		typer = 3;
	}
	else{
		typer = 2;
	}

	if(typer === 2){
    	teamArray = await getTeam()
			.then(value1 => {
				console.log(value1);
				value1.forEach(value => {
					if (team !== 'ALL'){
						if (value.teamName === team){
							outputHTML += `<tr><td onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage["currentTeam"] = document.getElementById("NHLteamsstats").options[document.getElementById("NHLteamsstats").options.selectedIndex].text; window.location.href = "NHLstatsteam.html"'>${value.teamName}</td>`;
							columns.forEach(info => {
								outputHTML += `<td>${value[info]}</td>`;
							})
							outputHTML += `</tr>`
						}
					}
					else{
						outputHTML += `<tr><td id = ${value.Abbr} onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage.setItem("currentTeam", document.getElementById("${value.Abbr}").innerHTML); window.location.href = "NHLstatsteam.html";'>${value.teamName}</td>`;
						columns.forEach(info => {
							outputHTML += `<td>${value[info]}</td>`;
						})
						outputHTML += `</tr>`
					}
				});
    		outputHTML += `</tbody>`;

    		document.getElementById('teamTablesOverview').innerHTML = outputHTML;
			})
	}
	else if(typer === 3){
		teamArray = await getTeamPlayoff()
			.then(value1 => {
				console.log(value1);
				value1.forEach(value => {
					if (team !== 'ALL'){
						if (value.teamName === team){
							outputHTML += `<tr><td onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage["currentTeam"] = document.getElementById("NHLteamsstats").options[document.getElementById("NHLteamsstats").options.selectedIndex].text; window.location.href = "NHLstatsteam.html"'>${value.teamName}</td>`;
							columns.forEach(info => {
								outputHTML += `<td>${value[info]}</td>`;
							})
							outputHTML += `</tr>`
						}
					}
					else{
						outputHTML += `<tr><td id = ${value.teamName} onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage.setItem("currentTeam", document.getElementById("${value.teamName}").innerHTML); window.location.href = "NHLstatsteam.html";'>${value.teamName}</td>`;
						columns.forEach(info => {
							outputHTML += `<td>${value[info]}</td>`;
						})
						outputHTML += `</tr>`
					}
				});
			outputHTML += `</tbody>`;

			document.getElementById('teamTablesOverview').innerHTML = outputHTML;
			})
	}
	async function getTeam(){
		return await getAPI(`https://api-web.nhle.com/v1/standings/now`)
			.then(value => {
				console.log(value);
				const newArray = value.standings.map(info => {
					return {
						Abbr: info.teamAbbrev.default,
						teamName: info.teamName.default,
						GP_RS: info.gamesPlayed,
						Wins: info.wins,
						Losses: info.losses,
						Ties: info.ties,
						OTL: info.otLosses,
						Points: info.points,
						PCT: info.pointPctg,
						l10: info.l10Wins,
						GF: info.goalFor,
						GA: info.goalAgainst,
						Goal_Diff: info.goalDifferential,
					}
				})
				console.log(newArray);
				return newArray;
			})
	}
	async function getTeamPlayoff(){
		return await getAPI(`https://api.nhle.com/stats/rest/en/team/summary?cayenneExp=seasonId=20232024+and+gameTypeId=3`)
			.then(value => {
				const newArray = value.data.map(info => {
					return {
						teamName: info.teamFullName,
						GP_PO: info.gamesPlayed,
						Wins_PO: info.wins,
						Losses_PO: info.losses,
						Points_PO: info.points,
						PCT_PO: info.pointPct,
						GF_PO: info.goalsFor,
						GA_PO: info.goalsAgainst,
						Goal_Diff_PO: info.goalsFor = info.goalsAgainst,
					}
				})
				return newArray;
			})
	}
}

function advancedFilterStatsPlayers(position){

	if(position === 'SKATERS'){
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
			<button type="button" id="PlayersStatsSearchButton" class="searchButton" onclick='if(document.getElementById("PlayersStatsSearch").value === ""){searchPlayers("ALL", document.getElementById("NHLseasonstats").options[document.getElementById("NHLseasonstats").options.selectedIndex].text, document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text)}else{searchPlayers(document.getElementById("PlayersStatsSearch").value, document.getElementById("NHLseasonstats").options[document.getElementById("NHLseasonstats").options.selectedIndex].text, document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text)}'><label for="PlayersStatsSearchButton" class="searchButtonLabel">Search</label>>
		`
	}
	else{
		outputHTML = `
			<input type="checkbox" id="GP" onclick='if (GP.checked == true){localStorage["GP"] = true}else{localStorage["GP"] = false}' checked><label for="GP" class="chkbox">GP</label></input>
			<input type="checkbox" id="Wins" onclick='if (Wins.checked == true){localStorage["Wins"] = true}else{localStorage["Wins"] = false}' checked><label for="Wins" class="chkbox">Wins</label></input>
			<input type="checkbox" id="Losses" onclick='if (Losses.checked == true){localStorage["Losses"] = true}else{localStorage["Losses"] = false}' checked><label for="Losses" class="chkbox">Losses</label></input>
			<input type="checkbox" id="OTL" onclick='if (OTL.checked == true){localStorage["OTL"] = true}else{localStorage["OTL"] = false}' checked><label for="OTL" class="chkbox">OTL</label></input>
			<input type="checkbox" id="GAA" onclick='if (GAA.checked == true){localStorage["GAA"] = true}else{localStorage["GAA"] = false}' checked><label for="GAA" class="chkbox">GAA</label></input>
			<input type="checkbox" id="SVPer" onclick='if (SVPer.checked == true){localStorage["SVPer"] = true}else{localStorage["SVPer"] = false}' checked><label for="SVPer" class="chkbox">SVPer</label></input>
			<input type="checkbox" id="SO" onclick='if (SO.checked == true){$localStorage["SO"] = true}else{localStorage["SO"] = false}' checked><label for="SO" class="chkbox">SO</label></input>
			<input type="checkbox" id="Points" onclick='if (Points.checked == true){localStorage["Points"] = true}else{localStorage["Points"] = false}' checked><label for="Points" class="chkbox">Points</label></input>
			<input type="text" id="PlayersStatsSearch" class="searchBar"><label for="PlayersStatsSearch" class="searchLabel"></label></input>
			<button type="button" id="PlayersStatsSearchButton" class="searchButton" onclick='if(document.getElementById("PlayersStatsSearch").value === ""){searchPlayers("ALL", document.getElementById("NHLseasonstats").options[document.getElementById("NHLseasonstats").options.selectedIndex].text, document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text)}else{searchPlayers(document.getElementById("PlayersStatsSearch").value, document.getElementById("NHLseasonstats").options[document.getElementById("NHLseasonstats").options.selectedIndex].text, document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text)}'><label for="PlayersStatsSearchButton" class="searchButtonLabel">Search</label>
		`
	}
	document.getElementById('NHLStatsPlayersDropDown').innerHTML = outputHTML;
}

function advancedFilterStatsTeams(gameType){
	console.log(gameType);
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
	localStorage['GP_PO'] = true;
	localStorage['Wins_PO'] = true;
	localStorage['Losses_PO'] = true;
	localStorage['Points_PO'] = true;
	localStorage['PCT_PO'] = true;
	localStorage['GF_PO'] = true;
	localStorage['GA_PO'] = true;
	localStorage['Goal_Diff_PO'] = true;
	if (gameType === "POST-SEASON"){
		typer = 3;
	}
	else{
		typer = 2;
	}

	if(typer === 2){
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
				<button type="button id="TeamsStatsSearchButton" class="searchButton" onclick='if(document.getElementById("TeamsStatsSearch").value === ""){searchTeam("ALL", document.getElementById("NHLseasonstats").options[document.getElementById("NHLseasonstats").options.selectedIndex].text)}else{searchTeam(document.getElementById("TeamsStatsSearch").value, document.getElementById("NHLseasonstats").options[document.getElementById("NHLseasonstats").options.selectedIndex].text)}'><label for="TeamsStatsSearchButton" class="searchButtonLabel">Search</label></input>
				`
	}
	else{
		outputHTML = `
			<input type="checkbox" id="GP_PO" onclick='if (GP_PO.checked == true){localStorage["GP_PO"] = true}else{localStorage["GP_PO"] = false}' checked><label for="GP_PO" class="chkbox">GP_PO</label></input>
			<input type="checkbox" id="Wins_PO" onclick='if(Wins_PO.checked === true){localStorage["Wins_PO"] = true}else{localStorage["Wins_PO"] = false}' checked><label for="Wins_PO" class="chkbox">Wins_PO</label></input>
			<input type="checkbox" id="Losses_PO" onclick='if (Losses_PO.checked == true){localStorage["Losses_PO"] = true}else{localStorage["Losses_PO"] = false}' checked><label for="Losses_PO" class="chkbox">Losses_PO</label></input>
			<input type="checkbox" id="Points_PO" onclick='if (Points_PO.checked == true){localStorage["Points_PO"] = true}else{localStorage["Points_PO"] = false}' checked><label for="Points_PO" class="chkbox">Points_PO</label></input>
			<input type="checkbox" id="PCT_PO" onclick='if (PCT_PO.checked == true){localStorage["PCT_PO"] = true}else{localStorage["PCT_PO"] = false}' checked><label for="PCT_PO" class="chkbox">PCT_PO</label></input>
			<input type="checkbox" id="GF_PO" onclick='if (GF_PO.checked == true){localStorage["GF_PO"] = true}else{localStorage["GF_PO"] = false}' checked><label for="GF_PO" class="chkbox">GF_PO</label></input>
			<input type="checkbox" id="GA_PO" onclick='if (GA_PO.checked == true){localStorage["GA_PO"] = true}else{localStorage["GA_PO"] = false}' checked><label for="GA_PO" class="chkbox">GA_PO</label></input>
			<input type="checkbox" id="Goal_Diff_PO" onclick='if (Goal_Diff_PO.checked == true){$localStorage["Goal_Diff_PO"] = true}else{localStorage["Goal_Diff_PO"] = false}' checked><label for="Goal_Diff_PO" class="chkbox">Goal Diff</label></input>
			<input type="text" id="TeamsStatsSearch" class="searchBar"><label for="TeamsStatsSearch" class="searchLabel"></label></input>
			<button type="button id="TeamsStatsSearchButton" class="searchButton" onclick='if(document.getElementById("TeamsStatsSearch").value === ""){searchTeam("ALL", document.getElementById("NHLseasonstats").options[document.getElementById("NHLseasonstats").options.selectedIndex].text)}else{searchTeam(document.getElementById("TeamsStatsSearch").value, document.getElementById("NHLseasonstats").options[document.getElementById("NHLseasonstats").options.selectedIndex].text)}'><label for="TeamsStatsSearchButton" class="searchButtonLabel">Search</label></input>
			`
	}
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