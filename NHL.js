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
localStorage['year'] = 2024;
localStorage['month'] = 5;

let templateLeagues = ['Netherton Hockey League2033.csv', 'National Hockey League2023.csv'];
let currentPage = 1;
let recordsPerPage = 27;

async function preload() {

	let leagueArray = [];
	const teamArray = await getAPI('https://api-web.nhle.com/v1/standings/2024-04-18')
	const sortedTeamArray = teamArray.standings.map(value => {
		return {
			Abbr: value.teamAbbrev.default,
			fullTeamName: value.teamName.default
		}
	});
	await sortedTeamArray.forEach(value => {
		leagueArray.push(value.Abbr);
	})
	localStorage['NHL'] = leagueArray;

	localStorage['NHL'].split(',').forEach(value => {
		getAPI(`https://api-web.nhle.com/v1/club-stats/${value}/20232024/2`)
	})

	getAPI(`https://api-web.nhle.com/v1/schedule/2024-05-01`);
	getAPI(`https://api-web.nhle.com/v1/schedule/2024-05-05`);
	getAPI(`https://api-web.nhle.com/v1/schedule/2024-05-12`);
	getAPI(`https://api-web.nhle.com/v1/schedule/2024-05-19`);
	getAPI(`https://api-web.nhle.com/v1/schedule/2024-05-26`);
	getAPI(`https://api-web.nhle.com/v1/schedule/2024-05-26`);

	getAPI(`https://api-web.nhle.com/v1/schedule/2024-06-01`);
	getAPI(`https://api-web.nhle.com/v1/schedule/2024-06-02`);
	getAPI(`https://api-web.nhle.com/v1/schedule/2024-06-09`);
	getAPI(`https://api-web.nhle.com/v1/schedule/2024-06-16`);
	getAPI(`https://api-web.nhle.com/v1/schedule/2024-06-23`);
	getAPI(`https://api-web.nhle.com/v1/schedule/2024-06-30`);

	getAPI(`https://api-web.nhle.com/v1/schedule/2024-07-01`);
	getAPI(`https://api-web.nhle.com/v1/schedule/2024-07-07`);
	getAPI(`https://api-web.nhle.com/v1/schedule/2024-07-14`);
	getAPI(`https://api-web.nhle.com/v1/schedule/2024-07-21`);
	getAPI(`https://api-web.nhle.com/v1/schedule/2024-07-28`);

};

async function upload() {

	const input = document.getElementById('CSVfile').files;
	for (let x = 0; x < input.length; x++) {
		const reader = new FileReader();
		reader.readAsText(input[x]);

		reader.onload = function () {
			let input2 = reader.result;
			let fileName = input[x].name.slice(0, input[x].name.indexOf('.') - 4);
			let fileDate = input[x].name.slice(input[x].name.indexOf('.') - 4, input[x].name.indexOf('.'));
			checkAndUpload(input2, fileName, fileDate);
		}
	}
	location.reload();
}

async function uploadTemplate() {

	templateLeagues.forEach(async files => {
		let data = await fetch(`csvtoupload/${files}`);
		let upload = await data.text()
		let fileName = files.slice(0, files.indexOf('.') - 4);
		let fileDate = files.slice(files.indexOf('.') - 4, files.indexOf('.'));
		checkAndUpload(upload, fileName, fileDate);
	})
}
async function checkAndUpload(fileInput, league, date) {

	if (localStorage['leagues'] == undefined) {
		localStorage.setItem('leagues', 'ALL');
	}

	let request = window.indexedDB.open(league);

	request.onupgradeneeded = function (e) {
		db = e.target.result;
		if (db.objectStoreNames.contains('League')) {
			db.close();
		}
		else {
			let leagueCheck = localStorage['leagues'].split(',');
			leagueCheck.push(league);
			localStorage.setItem('leagues', leagueCheck);
			let data = {};
			let headers = fileInput.slice(0, fileInput.indexOf("\n")).split(",");
			let row = fileInput.slice(fileInput.indexOf("\n") + 1).split("\n");
			row = row.slice(0, -1);

			row.forEach(q => {
				let count = 0;
				let element = q.split(',');

				let objectStore = db.createObjectStore(element[22]);
				headers.forEach(key => {
					objectStore.add(element[count], key);
					data[key] = element[count];
					count++;
				});
				objectStore.add(league, 'League');
				objectStore.add(date, 'Season');
			});
		}
	}
	FileReader.abort
}

function sorterMain(table, numColumn) {

	let sorter1 = `<tr>`;
	list1 = ['Team', 'GP', 'Wins', 'Losses', 'Ties', 'OTL', 'Points', 'PCT', 'last 10'];

	sorter1 += `<th onclick = 'if(localStorage["${table}${0}"] === "DESC"){sortTable("${table}",${0}); localStorage["${table}${0}"] = "ASC";} else{sortTableASC("${table}",${0}); localStorage["${table}${0}"] = "DESC"}'>${list1[0]}</th>`;

	for (let x = 1; x <= numColumn; x++) {
		sorter1 += `<th onclick = 'if(localStorage["${table}${x}"] === "DESC"){sortTableNum("${table}",${x}); localStorage["${table}${x}"] = "ASC";} else{sortTableNumASC("${table}",${x}); localStorage["${table}${x}"] = "DESC"}'>${list1[x]}</th>`;
	}
	sorter1 += `</tr>`;

	return sorter1;
}

function sorterPlayers(table, position) {
	let numColumn = 0;
	let columns = [];
	if (position === "SKATERS") {
		list = ['GP', 'Goals', 'Assists', 'Points', 'PlusMinus', 'PIM', 'PPG', 'SHG', 'GWG', 'OTG', 'Shots', 'ShotPer', 'FOPer'];
	}
	else {
		list = ['GP', 'Wins', 'Losses', 'OTL', 'GAA', 'SVPer', 'SO', 'Points'];
	}

	list.forEach(x => {
		if (localStorage[x] === 'true') {
			numColumn += 1;
			columns.push(x);
		};
	});

	let sorter1 = `<tr>`;
	sorter1 += `<th onclick = 'if(localStorage["${table}${0}"] === "DESC"){sortTable("${table}",${0}); localStorage["${table}${0}"] = "ASC";} else{sortTableASC("${table}",${0}); localStorage["${table}${0}"] = "DESC"}'>Team</th>
				<th onclick = 'if(localStorage["${table}${1}"] === "DESC"){sortTable("${table}",${1}); localStorage["${table}${1}"] = "ASC";} else{sortTableASC("${table}",${1}); localStorage["${table}${1}"] = "DESC"}'>Name</th>
				`;

	for (let x = 0; x < numColumn; x++) {
		sorter1 += `<th onclick = 'if(localStorage["${table}${x}"] === "DESC"){sortTableNum("${table}",${x}); localStorage["${table}${x}"] = "ASC";} else{sortTableNumASC("${table}",${x}); localStorage["${table}${x}"] = "DESC"}'>${columns[x]}</th>`;
	}
	sorter1 += `</tr>`;

	return [columns, sorter1];
}

function sorterTeams(table, typer) {
	let numColumn = 0;
	let columns = [];
	if (typer !== "POST-SEASON") {
		list1 = ['GP_RS', 'Wins', 'Losses', 'Ties', 'OTL', 'Points', 'PCT', 'l10', 'GF', 'GA', 'Goal_Diff'];

		list1.forEach(x => {
			if (localStorage[x] === 'true') {
				numColumn += 1;
				columns.push(x);
			};
		});
	}
	else {
		list1 = ['GP_PO', 'Wins_PO', 'Losses_PO', 'Points_PO', 'PCT_PO', 'GF_PO', 'GA_PO', 'Goal_Diff_PO'];

		list1.forEach(x => {
			if (localStorage[x] === 'true') {
				numColumn += 1;
				columns.push(x);
			};
		});
	}
	let sorter1 = `<tr>`;
	sorter1 += `<th onclick = 'if(localStorage["${table}${0}"] === "DESC"){sortTable("${table}",${0}); localStorage["${table}${0}"] = "ASC";} else{sortTableASC("${table}",${0}); localStorage["${table}${0}"] = "DESC"}'>Team</th>`;

	for (let x = 0; x < numColumn; x++) {
		sorter1 += `<th onclick = 'if(localStorage["${table}${x}"] === "DESC"){sortTableNum("${table}",${x}); localStorage["${table}${x}"] = "ASC";} else{sortTableNumASC("${table}",${x}); localStorage["${table}${x}"] = "DESC"}'>${columns[x]}</th>`;
	}
	sorter1 += `</tr>`;

	return [columns, sorter1];
}

async function getAPI(url) {

	if (localStorage[url] != undefined) {
		return JSON.parse(localStorage[url]);
	}
	else {
		const url2 = 'https://corsproxy.io/?' + encodeURIComponent(url);
		const response = await fetch(url2);
		const result = await response.json();
		localStorage[url] = JSON.stringify(result);
		return result;
	}
}

function positionFilters() {
	let outputHTML;
	outputHTML += `<option value = 'Skaters' selected>SKATERS</option>
					<option value = 'Goalies'>GOALIES</option>
				`;

	document.getElementById('NHLpositionsstats').innerHTML = outputHTML;
}

async function teamFilters() {
	let outputHTML = '';

	let leagueArray = [];
	const teamArray = await getAPI('https://api-web.nhle.com/v1/standings/2024-04-18')
	const sortedTeamArray = teamArray.standings.map(value => {
		return {
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
	sortedTeamArray.sort(function (a, b) { return a.Abbr.localeCompare(b.Abbr) }).forEach(value => {
		outputHTML += `<option value = '${value.fullTeamName}'>${value.Abbr}</option>`;
	})

	console.log(outputHTML);

	document.getElementById('NHLteamsstats').innerHTML = outputHTML;
}

function seasonFilters() {
	let outputHTML = '';
	outputHTML += `
				<option value = 'Regular Season'>REGULAR SEASON</option>
				<option value = 'Post Season'>POST-SEASON</option>
				`;

	document.getElementById('NHLseasonstats').innerHTML = outputHTML;
}

function compareFilters() {
	let outputHTML = '';
	console.log(localStorage.leagues);
	localStorage.leagues.split(',').forEach(value3 => {
		console.log(value3);
		if (value3 !== 'ALL') {
			outputHTML += `
				<option value = ` + value3 + `>` + value3 + `</option>
			`;
		}
	});
	document.getElementById('NHLcomparestats').innerHTML = outputHTML;
}

async function teamScheduleOverview(team) {

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
	let dayend = new Date(year, month - 1, lastdatePrev).getDay();
	let dayendNext = new Date(year, month + 1, lastdate).getDay();
	let monthlastdate = new Date(year, month, 0).getDate();

	console.log(lastdate);
	console.log(dayend);
	let counter = 0;
	let reverseCounter = 0 - dayend;
	let dayOfWeekCounter = dayone;
	let dayOfWeekCounterReverse = 6 - dayone;

	for (let x = 0; x <= (lastdate + dayend) / 7; x++) {
		if (x === 0) {
			outputHTML += `<tr>`;
			for (let y = (0 - dayone); y <= 0; y++) {
				console.log(y);
				if (y === 0) {
					counter++;
					const game = await getSchedule(1);
					game.forEach(info => {
						console.log(info);
						if (info !== 'No Games') {
							if (counter <= 7 - dayone) {
								outputHTML += `<td><div class = content>${counter}<p class = dayNumber>`
								info.games.forEach(info2 => {
									outputHTML += `<div class = 'Matchup'><img class = "scheduleLogoAway" src = "${info2.awayTeam.darkLogo}">vs<img class = "scheduleLogoHome" src = "${info2.homeTeam.darkLogo}"></div></p>`;
								})
								counter++;
								outputHTML += `</div></td>`;
							}
						}
						else {
							if (counter <= 7 - dayone) {
								outputHTML += `<td><div class = content><p class = dayNumber>${counter}</p></div></td>`;
								counter++;
							}
						}
					});
					dayOfWeekCounter++;
				}
				else {
					outputHTML += `<td><div class = content><p class = dayNumber>${monthlastdate + reverseCounter}</p></div></td>`;
					dayOfWeekCounterReverse++;
					reverseCounter++;

				}

			}
			outputHTML += `</tr>`;
		}
		else {
			let check = 0
			let schedule = [];
			dateofday = counter;
			counter++;
			for (let y = 0; y < 5; y++) {
				outputHTML += `<tr>`;
				if (counter < lastdate) {
					console.log(counter);
					if (counter === (Number(check)) || Number(check) === 0) {
						schedule = await getSchedule(dateofday);
						console.log("here")
						check = (counter + 7);
					}
					const game = schedule;
					console.log(game);
					game.forEach(info => {
						console.log(info);
						if (info !== 'No Games') {
							if (dateofday <= lastdate) {
								outputHTML += `<td><div class = content><p class = dayNumber>${dateofday}</p>`
								info.games.forEach(info2 => {
									outputHTML += `<div class = 'Matchup'><img class = "scheduleLogoAway" src = "${info2.awayTeam.darkLogo}">vs<img class = "scheduleLogoHome" src = "${info2.homeTeam.darkLogo}"></div></p>`;
								})
								dateofday++;
								outputHTML += `</div></td>`;
							}
						}
						else {
							if (dateofday <= lastdate) {
								outputHTML += `<td><div class = content><p class = dayNumber>${dateofday}</p></div></td>`;
								dateofday++;
							}
						}
					});
				}
				else {
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

	async function getSchedule(day) {
		let returnthat = [];
		console.log(month + " " + day)
		if (day < 10 && month < 10) {
			return await getAPI(`https://api-web.nhle.com/v1/schedule/${year}-0${month + 1}-0${day}`)
				.then(info => {
					for (data in info.gameWeek) {
						if (info.gameWeek[data].numberOfGames !== 0) {
							console.log(info.gameWeek[data]);
							returnthat.push(info.gameWeek[data]);
						}
						else {
							returnthat.push('No Games');
						}
					}
					console.log(returnthat);
					return returnthat;
				})
		}
		else if (day < 10) {
			return await getAPI(`https://api-web.nhle.com/v1/schedule/${year}-${month + 1}-0${day}`)
				.then(info => {
					for (data in info.gameWeek) {
						if (info.gameWeek[data].numberOfGames !== 0) {
							console.log(info.gameWeek[data]);
							returnthat.push(info.gameWeek[data]);
						}
						else {
							returnthat.push('No Games');
						}
					}
					console.log(returnthat);
					return returnthat;
				})
		}
		else if (month < 10) {
			return await getAPI(`https://api-web.nhle.com/v1/schedule/${year}-0${month + 1}-${day}`)
				.then(info => {
					for (data in info.gameWeek) {
						if (info.gameWeek[data].numberOfGames !== 0) {
							console.log(info.gameWeek[data]);
							returnthat.push(info.gameWeek[data]);
						}
						else {
							returnthat.push('No Games');
						}
					}
					console.log(returnthat);
					return returnthat;
				})
		}
		else {
			return await getAPI(`https://api-web.nhle.com/v1/schedule/${year}-${month + 1}-${day}`)
				.then(info => {
					for (data in info.gameWeek) {
						if (info.gameWeek[data].numberOfGames !== 0) {
							console.log(info.gameWeek[data]);
							returnthat.push(info.gameWeek[data]);
						}
						else {
							returnthat.push('No Games');
						}
					}
					console.log(returnthat);
					return returnthat;
				})
		}
	}
}

async function teamTablesOverview(team) {
	let teamArray = [];
	console.log(localStorage['NHL']);
	teamArray = await getTeam()
		.then(value1 => {
			console.log(value1);
			let outputHTML = ``;
			outputHTML += '<tbody>';
			outputHTML += sorterMain('teamTablesOverview', 8);
			value1.forEach(value => {
				if (team != 'ALL') {
					if (value.Abbr == team) {
						outputHTML += `<tr><td onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage["currentTeam"] = document.getElementById("NHLteamsstats").options[document.getElementById("NHLteamsstats").options.selectedIndex].text; window.location.href = "NHLstatsteam.html"'>${value.Abbr}</td><td>${value.GP_RS}</td><td>${value.Wins}</td><td>${value.Losses}</td><td>${value.Ties}</td><td>${value.OTL}</td><td>${value.Points}</td><td>${value.PCT}</td><td>${value.l10}</td></tr>`;
					}
				}
				else {
					outputHTML += `<tr><td id = ${value.Abbr} onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage.setItem("currentTeam", document.getElementById("${value.Abbr}").innerHTML); window.location.href = "NHLstatsteam.html";'>${value.Abbr}</td><td>${value.GP_RS}</td><td>${value.Wins}</td><td>${value.Losses}</td><td>${value.Ties}</td><td>${value.OTL}</td><td>${value.Points}</td><td>${value.PCT}</td><td>${value.l10}</td></tr>`;
				}
			});
			outputHTML += `</tbody>`;

			document.getElementById('teamTablesOverview').innerHTML = outputHTML;
		})

	async function getTeam() {
		return await getAPI('https://api-web.nhle.com/v1/standings/2023-04-16')
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

async function standingsNHL() {
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
		if (value.clinchIndicator != undefined) {
			outputHTMLWest += `
							<tr>
								<td id = ${value.teamAbbrev.default} onclick = 'localStorage.setItem("currentTeam", document.getElementById("${value.teamAbbrev.default}").id); window.location.href = "NHLstatsteam.html"'>${value.teamName.default}</td><td>${value.divisionName}</td><td>${value.gamesPlayed}</td><td>${value.points}</td><td>${value.regulationPlusOtWins}</td><td>${value.clinchIndicator}</td>
							</tr>
							`;
		}
		else {
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
		if (value.clinchIndicator != undefined) {
			outputHTMLEast += `
							<tr>		
								<td id = ${value.teamAbbrev.default} onclick = 'localStorage.setItem("currentTeam", document.getElementById("${value.teamAbbrev.default}").id); window.location.href = "NHLstatsteam.html"'>${value.teamName.default}</td><td>${value.divisionName}</td><td>${value.gamesPlayed}</td><td>${value.points}</td><td>${value.regulationPlusOtWins}</td><td>${value.clinchIndicator}</td>
							</tr>
							`
		}
		else {
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


	async function getStandings() {
		return await getAPI(`https://api-web.nhle.com/v1/standings/2024-04-18`);
	}
}

async function playerStatsNHL() {

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

	async function getPlayerStats() {
		return await getAPI(`https://api-web.nhle.com/v1/club-stats/${team}/20232024/2`)
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

	async function getPlayerInfo() {
		return await getAPI(`https://api-web.nhle.com/v1/roster/${team}/20232024`)
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


async function teamStatsNHL() {
	console.log(localStorage['currentLeague']);
	console.log(localStorage['currentTeam']);
	let team = localStorage['currentTeam'];
	let teamRoster = await getTeamRoster();
	let teamStats = await getTeamStats();
	let teamInfo = await getTeamInfo();

	console.log(teamRoster);
	console.log(teamInfo);
	console.log(teamStats);

	async function getTeamInfo() {
		return await getAPI(`https://api-web.nhle.com/v1/standings/2024-04-18`)
			.then(value => {
				return value.standings.find((info) => {
					return info.teamAbbrev.default === team
				})
			})
	}
	async function getTeamStats() {
		return await getAPI(`https://api-web.nhle.com/v1/club-stats/${team}/20232024/2`)
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

	async function getTeamRoster() {
		return await getAPI(`https://api-web.nhle.com/v1/roster/${team}/20232024`)
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

	combinedArray.sort(function (a, b) { return b.points - a.points || b.GP - a.GP }).forEach(value => {

		console.log(value);

		if (value.position === 'L' && value.points !== undefined) {
			if (LWCount === 1) {
				F1Points += value.points;
			}
			if (LWCount === 2) {
				F2Points += value.points;
			}
			if (LWCount === 3) {
				F3Points += value.points;
			}
			if (LWCount === 4) {
				F4Points += value.points;
			}
			if (LWCount > 4) {
				overFlowNameOffense.push(value.name)
				overFlowPoints.push(value.points)
			}
			LWCount += 1;
			LW.push(value.name);
		}
		else if (value.position === 'C' && value.points !== undefined) {
			if (CCount === 1) {
				F1Points += value.points;
			}
			if (CCount === 2) {
				F2Points += value.points;
			}
			if (CCount === 3) {
				F3Points += value.points;
			}
			if (CCount === 4) {
				F4Points += value.points;
			}
			if (CCount > 4) {
				overFlowNameOffense.push(value.name)
				overFlowPoints.push(value.points)
			}
			CCount += 1;
			C.push(value.name);
		}
		else if (value.position === 'R' && value.points !== undefined) {
			if (RWCount === 1) {
				F1Points += value.points;
			}
			if (RWCount === 2) {
				F2Points += value.points;
			}
			if (RWCount === 3) {
				F3Points += value.points;
			}
			if (RWCount === 4) {
				F4Points += value.points;
			}
			if (RWCount > 4) {
				overFlowNameOffense.push(value.name)
				overFlowPoints.push(value.points)
			}
			RWCount += 1;
			RW.push(value.name);
		}
		else if (value.position === 'D' && value.hand == 'R' && value.points !== undefined) {
			if (LDCount === 1) {
				D1Points += value.points;
			}
			if (LDCount === 2) {
				D2Points += value.points;
			}
			if (LDCount === 3) {
				D3Points += value.points;
			}
			if (LDCount > 4) {
				overFlowNameDefense.push(value.name)
				overFlowPoints.push(value.points)
			}
			LDCount += 1;
			LD.push(value.name);
		}
		else if (value.position === 'D' && value.hand === 'L' && value.points !== undefined) {
			if (RDCount === 1) {
				D1Points += value.points;
			}
			if (RDCount === 2) {
				D2Points += value.points;
			}
			if (RDCount === 3) {
				D3Points += value.points;
			}
			if (LDCount > 4) {
				overFlowNameDefense.push(value.name)
				overFlowPoints.push(value.points)
			}
			RDCount += 1;
			RD.push(value.name);
		}
		else if (value.position === 'G') {
			G.push(value.name);
		}

		if (value.points !== undefined) {
			outputHTMLRosterStats += `
				<tr><td id = '${value.playerId}' onclick = 'localStorage.setItem("currentPlayer", document.getElementById("${value.playerId}").id); window.location.href = "NHLstatsplayer.html"'>${value.name}</td><td>${value.DOB}</td><td>${2023 - value.DOB.slice(0, 4)}</td><td>${Math.floor(value.height / 12)}'${value.height % 12}"</td><td>${value.weight}</td></tr>
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
		if (LWCount <= 4) {
			LW.push(value);
			LWCount += 1;
		}
		else if (CCount <= 4) {
			C.push(value);
			CCount += 1;
		}
		else if (RWCount <= 4) {
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

async function playersStatsNHL(team, gameType, position, compare) {

	let j;
	let k;
	let newestData = [];

	console.log(localStorage['NHL'].split(','));
	console.log(currentPage);
	console.log(localStorage['Goals']);
	let promise2;
	let typer;
	let positioner = position;

	console.log(gameType);
	if (gameType === "POST-SEASON") {
		typer = 3;
	}
	else {
		typer = 2;
	}

	console.log(typer);
	const valuesReturned = sorterPlayers('playersTablesOverview', positioner);
	let columns = valuesReturned[0];
	let outputHTML = valuesReturned[1];
	console.log(position);
	let counter;

	if (team !== 'ALL') {
		let db;
		let obj = {};
		const asdasd = window.indexedDB.open('Netherton Hockey League', 1);

		asdasd.onsuccess = (e) => {
			// Create the DB connection
			db = asdasd.result;
			const transaction = db.transaction(["Canadiens"]);
			transaction.oncomplete = (event) => {
			}
			const objectStore = transaction.objectStore("Canadiens");
			console.log(objectStore);
			request = objectStore.openCursor();

			request.onerror = function (event) {
				console.err("error fetching data");
			};
			request.onsuccess = function (event) {
				let cursor = event.target.result;
				if (cursor) {
					let key = cursor.primaryKey;
					let value = cursor.value;
					obj[key] = value;
					cursor.continue();
				}
				else {
					// no more results
					let newData = {
						Abbr: obj.Abbr,
						Team: obj.Name + " " + obj.Nickname,
						Players: [obj["First Name0"] + " " + obj["Last Name0"], obj["First Name1"] + " " + obj["Last Name1"], obj["First Name2"] + " " + obj["Last Name2"], obj["First Name3"] + " " + obj["Last Name3"], obj["First Name4"] + " " + obj["Last Name4"], obj["First Name5"] + " " + obj["Last Name5"], obj["First Name6"] + " " + obj["Last Name6"], obj["First Name7"] + " " + obj["Last Name7"], obj["First Name8"] + " " + obj["Last Name8"], obj["First Name9"] + " " + obj["Last Name9"], obj["First Name10"] + " " + obj["Last Name10"], obj["First Name11"] + " " + obj["Last Name11"], obj["First Name12"] + " " + obj["Last Name12"], obj["First Name13"] + " " + obj["Last Name13"], obj["First Name14"] + " " + obj["Last Name14"], obj["First Name15"] + " " + obj["Last Name15"], obj["First Name16"] + " " + obj["Last Name16"], obj["First Name17"] + " " + obj["Last Name17"], obj["First Name18"] + " " + obj["Last Name18"], obj["First Name19"] + " " + obj["Last Name19"], obj["First Name20"] + " " + obj["Last Name20"], obj["First Name21"] + " " + obj["Last Name21"], obj["First Name22"] + " " + obj["Last Name22"], obj["First Name23"] + " " + obj["Last Name23"]],
						GP: [obj["GP_RS0"], obj["GP_RS1"], obj["GP_RS2"], obj["GP_RS3"], obj["GP_RS4"], obj["GP_RS5"], obj["GP_RS6"], obj["GP_RS7"], obj["GP_RS8"], obj["GP_RS9"], obj["GP_RS10"], obj["GP_RS11"], obj["GP_RS12"], obj["GP_RS13"], obj["GP_RS14"], obj["GP_RS15"], obj["GP_RS16"], obj["GP_RS17"], obj["GP_RS18"], obj["GP_RS19"], obj["GP_RS20"], obj["GP_RS21"], obj["GP_RS22"], obj["GP_RS23"]],
						Goals: [obj["G_RS0"], obj["G_RS1"], obj["G_RS2"], obj["G_RS3"], obj["G_RS4"], obj["G_RS5"], obj["G_RS6"], obj["G_RS7"], obj["G_RS8"], obj["G_RS9"], obj["G_RS10"], obj["G_RS11"], obj["G_RS12"], obj["G_RS13"], obj["G_RS14"], obj["G_RS15"], obj["G_RS16"], obj["G_RS17"], obj["G_RS18"], obj["G_RS19"], obj["G_RS20"], obj["G_RS21"], obj["G_RS22"], obj["G_RS23"]],
						Assists: [obj["A_RS0"], obj["A_RS1"], obj["A_RS2"], obj["A_RS3"], obj["A_RS4"], obj["A_RS5"], obj["A_RS6"], obj["A_RS7"], obj["A_RS8"], obj["A_RS9"], obj["A_RS10"], obj["A_RS11"], obj["A_RS12"], obj["A_RS13"], obj["A_RS14"], obj["A_RS15"], obj["A_RS16"], obj["A_RS17"], obj["A_RS18"], obj["A_RS19"], obj["A_RS20"], obj["A_RS21"], obj["A_RS22"], obj["A_RS23"]],
						PlusMinus: [obj["+/-_RS0"], obj["+/-_RS1"], obj["+/-_RS2"], obj["+/-_RS3"], obj["+/-_RS4"], obj["+/-_RS5"], obj["+/-_RS6"], obj["+/-_RS7"], obj["+/-_RS8"], obj["+/-_RS9"], obj["+/-_RS10"], obj["+/-_RS11"], obj["+/-_RS12"], obj["+/-_RS13"], obj["+/-_RS14"], obj["+/-_RS15"], obj["+/-_RS16"], obj["+/-_RS17"], obj["+/-_RS18"], obj["+/-_RS19"], obj["+/-_RS20"], obj["+/-_RS21"], obj["+/-_RS22"], obj["+/-_RS23"]],
						PIM: [obj["PIM_RS0"], obj["PIM_RS1"], obj["PIM_RS2"], obj["PIM_RS3"], obj["PIM_RS4"], obj["PIM_RS5"], obj["PIM_RS6"], obj["PIM_RS7"], obj["PIM_RS8"], obj["PIM_RS9"], obj["PIM_RS10"], obj["PIM_RS11"], obj["PIM_RS12"], obj["PIM_RS13"], obj["PIM_RS14"], obj["PIM_RS15"], obj["PIM_RS16"], obj["PIM_RS17"], obj["PIM_RS18"], obj["PIM_RS19"], obj["PIM_RS20"], obj["PIM_RS21"], obj["PIM_RS22"], obj["PIM_RS23"]],
						PPG: [obj["PP G_RS0"], obj["PP G_RS1"], obj["PP G_RS2"], obj["PP G_RS3"], obj["PP G_RS4"], obj["PP G_RS5"], obj["PP G_RS6"], obj["PP G_RS7"], obj["PP G_RS8"], obj["PP G_RS9"], obj["PP G_RS10"], obj["PP G_RS11"], obj["PP G_RS12"], obj["PP G_RS13"], obj["PP G_RS14"], obj["PP G_RS15"], obj["PP G_RS16"], obj["PP G_RS17"], obj["PP G_RS18"], obj["PP G_RS19"], obj["PP G_RS20"], obj["PP G_RS21"], obj["PP G_RS22"], obj["PP G_RS23"]],
						SHG: [obj["SH G_RS0"], obj["SH G_RS1"], obj["SH G_RS2"], obj["SH G_RS3"], obj["SH G_RS4"], obj["SH G_RS5"], obj["SH G_RS6"], obj["SH G_RS7"], obj["SH G_RS8"], obj["SH G_RS9"], obj["SH G_RS10"], obj["SH G_RS11"], obj["SH G_RS12"], obj["SH G_RS13"], obj["SH G_RS14"], obj["SH G_RS15"], obj["SH G_RS16"], obj["SH G_RS17"], obj["SH G_RS18"], obj["SH G_RS19"], obj["SH G_RS20"], obj["SH G_RS21"], obj["SH G_RS22"], obj["SH G_RS23"]],
						GWG: [obj["GWG_RS0"], obj["GWG_RS1"], obj["GWG_RS2"], obj["GWG_RS3"], obj["GWG_RS4"], obj["GWG_RS5"], obj["GWG_RS6"], obj["GWG_RS7"], obj["GWG_RS8"], obj["GWG_RS9"], obj["GWG_RS10"], obj["GWG_RS11"], obj["GWG_RS12"], obj["GWG_RS13"], obj["GWG_RS14"], obj["GWG_RS15"], obj["GWG_RS16"], obj["GWG_RS17"], obj["GWG_RS18"], obj["GWG_RS19"], obj["GWG_RS20"], obj["GWG_RS21"], obj["GWG_RS22"], obj["GWG_RS23"]],
						Shots: [obj["SOG_RS0"], obj["SOG_RS1"], obj["SOG_RS2"], obj["SOG_RS3"], obj["SOG_RS4"], obj["SOG_RS5"], obj["SOG_RS6"], obj["SOG_RS7"], obj["SOG_RS8"], obj["SOG_RS9"], obj["SOG_RS10"], obj["SOG_RS11"], obj["SOG_RS12"], obj["SOG_RS13"], obj["SOG_RS14"], obj["SOG_RS15"], obj["SOG_RS16"], obj["SOG_RS17"], obj["SOG_RS18"], obj["SOG_RS19"], obj["SOG_RS20"], obj["SOG_RS21"], obj["SOG_RS22"], obj["SOG_RS23"]],
						FOPer: [Number(obj["FOW_RS0"]) / Number(obj["FO_RS0"]), Number(obj["FOW_RS1"]) / Number(obj["FO_RS1"]), Number(obj["FOW_RS2"]) / Number(obj["FO_RS2"]), Number(obj["FOW_RS3"]) / Number(obj["FO_RS3"]), Number(obj["FOW_RS4"]) / Number(obj["FO_RS4"]), Number(obj["FOW_RS5"]) / Number(obj["FO_RS5"]), Number(obj["FOW_RS6"]) / Number(obj["FO_RS6"]), Number(obj["FOW_RS7"]) / Number(obj["FO_RS7"]), Number(obj["FOW_RS8"]) / Number(obj["FO_RS8"]), Number(obj["FOW_RS9"]) / Number(obj["FO_RS9"]), Number(obj["FOW_RS10"]) / Number(obj["FO_RS10"]), Number(obj["FOW_RS11"]) / Number(obj["FO_RS11"]), Number(obj["FOW_RS12"]) / Number(obj["FO_RS12"]), Number(obj["FOW_RS13"]) / Number(obj["FO_RS13"]), Number(obj["FOW_RS14"]) / Number(obj["FO_RS14"]), Number(obj["FOW_RS15"]) / Number(obj["FO_RS15"]), Number(obj["FOW_RS16"]) / Number(obj["FO_RS16"]), Number(obj["FOW_RS17"]) / Number(obj["FO_RS17"]), Number(obj["FOW_RS18"]) / Number(obj["FO_RS18"]), Number(obj["FOW_RS19"]) / Number(obj["FO_RS19"]), Number(obj["FOW_RS20"]) / Number(obj["FO_RS20"]), Number(obj["FOW_RS21"]) / Number(obj["FO_RS21"]), Number(obj["FOW_RS22"]) / Number(obj["FO_RS22"]), Number(obj["FOW_RS23"]) / Number(obj["FO_RS23"])]
					}
					console.log(newData);

				}
			};
		};
		let newData = {
			Abbr: obj.Abbr,
			Team: obj.Name + " " + obj.Nickname,
			Players: [obj["First Name0"] + " " + obj["Last Name0"], obj["First Name1"] + " " + obj["Last Name1"], obj["First Name2"] + " " + obj["Last Name2"], obj["First Name3"] + " " + obj["Last Name3"], obj["First Name4"] + " " + obj["Last Name4"], obj["First Name5"] + " " + obj["Last Name5"], obj["First Name6"] + " " + obj["Last Name6"], obj["First Name7"] + " " + obj["Last Name7"], obj["First Name8"] + " " + obj["Last Name8"], obj["First Name9"] + " " + obj["Last Name9"], obj["First Name10"] + " " + obj["Last Name10"], obj["First Name11"] + " " + obj["Last Name11"], obj["First Name12"] + " " + obj["Last Name12"], obj["First Name13"] + " " + obj["Last Name13"], obj["First Name14"] + " " + obj["Last Name14"], obj["First Name15"] + " " + obj["Last Name15"], obj["First Name16"] + " " + obj["Last Name16"], obj["First Name17"] + " " + obj["Last Name17"], obj["First Name18"] + " " + obj["Last Name18"], obj["First Name19"] + " " + obj["Last Name19"], obj["First Name20"] + " " + obj["Last Name20"], obj["First Name21"] + " " + obj["Last Name21"], obj["First Name22"] + " " + obj["Last Name22"], obj["First Name23"] + " " + obj["Last Name23"]],
			GP: [obj["GP_RS0"], obj["GP_RS1"], obj["GP_RS2"], obj["GP_RS3"], obj["GP_RS4"], obj["GP_RS5"], obj["GP_RS6"], obj["GP_RS7"], obj["GP_RS8"], obj["GP_RS9"], obj["GP_RS10"], obj["GP_RS11"], obj["GP_RS12"], obj["GP_RS13"], obj["GP_RS14"], obj["GP_RS15"], obj["GP_RS16"], obj["GP_RS17"], obj["GP_RS18"], obj["GP_RS19"], obj["GP_RS20"], obj["GP_RS21"], obj["GP_RS22"], obj["GP_RS23"]],
			Goals: [obj["G_RS0"], obj["G_RS1"], obj["G_RS2"], obj["G_RS3"], obj["G_RS4"], obj["G_RS5"], obj["G_RS6"], obj["G_RS7"], obj["G_RS8"], obj["G_RS9"], obj["G_RS10"], obj["G_RS11"], obj["G_RS12"], obj["G_RS13"], obj["G_RS14"], obj["G_RS15"], obj["G_RS16"], obj["G_RS17"], obj["G_RS18"], obj["G_RS19"], obj["G_RS20"], obj["G_RS21"], obj["G_RS22"], obj["G_RS23"]],
			Assists: [obj["A_RS0"], obj["A_RS1"], obj["A_RS2"], obj["A_RS3"], obj["A_RS4"], obj["A_RS5"], obj["A_RS6"], obj["A_RS7"], obj["A_RS8"], obj["A_RS9"], obj["A_RS10"], obj["A_RS11"], obj["A_RS12"], obj["A_RS13"], obj["A_RS14"], obj["A_RS15"], obj["A_RS16"], obj["A_RS17"], obj["A_RS18"], obj["A_RS19"], obj["A_RS20"], obj["A_RS21"], obj["A_RS22"], obj["A_RS23"]],
			PlusMinus: [obj["+/-_RS0"], obj["+/-_RS1"], obj["+/-_RS2"], obj["+/-_RS3"], obj["+/-_RS4"], obj["+/-_RS5"], obj["+/-_RS6"], obj["+/-_RS7"], obj["+/-_RS8"], obj["+/-_RS9"], obj["+/-_RS10"], obj["+/-_RS11"], obj["+/-_RS12"], obj["+/-_RS13"], obj["+/-_RS14"], obj["+/-_RS15"], obj["+/-_RS16"], obj["+/-_RS17"], obj["+/-_RS18"], obj["+/-_RS19"], obj["+/-_RS20"], obj["+/-_RS21"], obj["+/-_RS22"], obj["+/-_RS23"]],
			PIM: [obj["PIM_RS0"], obj["PIM_RS1"], obj["PIM_RS2"], obj["PIM_RS3"], obj["PIM_RS4"], obj["PIM_RS5"], obj["PIM_RS6"], obj["PIM_RS7"], obj["PIM_RS8"], obj["PIM_RS9"], obj["PIM_RS10"], obj["PIM_RS11"], obj["PIM_RS12"], obj["PIM_RS13"], obj["PIM_RS14"], obj["PIM_RS15"], obj["PIM_RS16"], obj["PIM_RS17"], obj["PIM_RS18"], obj["PIM_RS19"], obj["PIM_RS20"], obj["PIM_RS21"], obj["PIM_RS22"], obj["PIM_RS23"]],
			PPG: [obj["PP G_RS0"], obj["PP G_RS1"], obj["PP G_RS2"], obj["PP G_RS3"], obj["PP G_RS4"], obj["PP G_RS5"], obj["PP G_RS6"], obj["PP G_RS7"], obj["PP G_RS8"], obj["PP G_RS9"], obj["PP G_RS10"], obj["PP G_RS11"], obj["PP G_RS12"], obj["PP G_RS13"], obj["PP G_RS14"], obj["PP G_RS15"], obj["PP G_RS16"], obj["PP G_RS17"], obj["PP G_RS18"], obj["PP G_RS19"], obj["PP G_RS20"], obj["PP G_RS21"], obj["PP G_RS22"], obj["PP G_RS23"]],
			SHG: [obj["SH G_RS0"], obj["SH G_RS1"], obj["SH G_RS2"], obj["SH G_RS3"], obj["SH G_RS4"], obj["SH G_RS5"], obj["SH G_RS6"], obj["SH G_RS7"], obj["SH G_RS8"], obj["SH G_RS9"], obj["SH G_RS10"], obj["SH G_RS11"], obj["SH G_RS12"], obj["SH G_RS13"], obj["SH G_RS14"], obj["SH G_RS15"], obj["SH G_RS16"], obj["SH G_RS17"], obj["SH G_RS18"], obj["SH G_RS19"], obj["SH G_RS20"], obj["SH G_RS21"], obj["SH G_RS22"], obj["SH G_RS23"]],
			GWG: [obj["GWG_RS0"], obj["GWG_RS1"], obj["GWG_RS2"], obj["GWG_RS3"], obj["GWG_RS4"], obj["GWG_RS5"], obj["GWG_RS6"], obj["GWG_RS7"], obj["GWG_RS8"], obj["GWG_RS9"], obj["GWG_RS10"], obj["GWG_RS11"], obj["GWG_RS12"], obj["GWG_RS13"], obj["GWG_RS14"], obj["GWG_RS15"], obj["GWG_RS16"], obj["GWG_RS17"], obj["GWG_RS18"], obj["GWG_RS19"], obj["GWG_RS20"], obj["GWG_RS21"], obj["GWG_RS22"], obj["GWG_RS23"]],
			Shots: [obj["SOG_RS0"], obj["SOG_RS1"], obj["SOG_RS2"], obj["SOG_RS3"], obj["SOG_RS4"], obj["SOG_RS5"], obj["SOG_RS6"], obj["SOG_RS7"], obj["SOG_RS8"], obj["SOG_RS9"], obj["SOG_RS10"], obj["SOG_RS11"], obj["SOG_RS12"], obj["SOG_RS13"], obj["SOG_RS14"], obj["SOG_RS15"], obj["SOG_RS16"], obj["SOG_RS17"], obj["SOG_RS18"], obj["SOG_RS19"], obj["SOG_RS20"], obj["SOG_RS21"], obj["SOG_RS22"], obj["SOG_RS23"]],
			FOPer: [Number(obj["FOW_RS0"]) / Number(obj["FO_RS0"]), Number(obj["FOW_RS1"]) / Number(obj["FO_RS1"]), Number(obj["FOW_RS2"]) / Number(obj["FO_RS2"]), Number(obj["FOW_RS3"]) / Number(obj["FO_RS3"]), Number(obj["FOW_RS4"]) / Number(obj["FO_RS4"]), Number(obj["FOW_RS5"]) / Number(obj["FO_RS5"]), Number(obj["FOW_RS6"]) / Number(obj["FO_RS6"]), Number(obj["FOW_RS7"]) / Number(obj["FO_RS7"]), Number(obj["FOW_RS8"]) / Number(obj["FO_RS8"]), Number(obj["FOW_RS9"]) / Number(obj["FO_RS9"]), Number(obj["FOW_RS10"]) / Number(obj["FO_RS10"]), Number(obj["FOW_RS11"]) / Number(obj["FO_RS11"]), Number(obj["FOW_RS12"]) / Number(obj["FO_RS12"]), Number(obj["FOW_RS13"]) / Number(obj["FO_RS13"]), Number(obj["FOW_RS14"]) / Number(obj["FO_RS14"]), Number(obj["FOW_RS15"]) / Number(obj["FO_RS15"]), Number(obj["FOW_RS16"]) / Number(obj["FO_RS16"]), Number(obj["FOW_RS17"]) / Number(obj["FO_RS17"]), Number(obj["FOW_RS18"]) / Number(obj["FO_RS18"]), Number(obj["FOW_RS19"]) / Number(obj["FO_RS19"]), Number(obj["FOW_RS20"]) / Number(obj["FO_RS20"]), Number(obj["FOW_RS21"]) / Number(obj["FO_RS21"]), Number(obj["FOW_RS22"]) / Number(obj["FO_RS22"]), Number(obj["FOW_RS23"]) / Number(obj["FO_RS23"])]
		}


		console.log(db);

		counter = 1;
		await getPlayerStatsArray(team, typer, position)
			.then(value => {
				for (let x = (currentPage - 1) * recordsPerPage; x < value.length; x++) {
					if (value[x].Name != undefined) {

						console.log(newData);
						j = newData["Players"].find(playerValue => (playerValue) === value[x].Name);
						j = newData["Players"].indexOf(j);
						if (j != -1) {
							newestData = {
								Abbr: newData["Abbr"],
								GP: newData["GP"][j],
								Goals: newData["Goals"][j],
								Assists: newData["Assists"][j],
								Points: Number(newData["Goals"][j]) + Number(newData["Assists"][j]),
								PlusMinus: newData["PlusMinus"][j],
								PIM: newData["PIM"][j],
								PPG: newData["PPG"][j],
								SHG: newData["SHG"][j],
								GWG: newData["GWG"][j],
								Shots: newData["Shots"][j],
								ShotPer: Math.round((Number(newData["Goals"][j]) / Number(newData["Shots"][j])) * 1000) / 10,
								FOPer: Math.round(Number(newData["FOPer"][j] * 1000)) / 10
							};
						}


						counter++;
						if (counter + (currentPage * recordsPerPage) <= (currentPage * recordsPerPage) + recordsPerPage) {
							outputHTML += `<tr><td id = ${value.Abbr} onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage.setItem("currentTeam", document.getElementById("${value.Abbr}").getElementByClass("NHL").innerHTML); window.location.href = "NHLstatsteam.html";'>${team} (${newestData["Abbr"]})</td><td id = "${value[x].playerId}" onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage["currentTeam"] = document.getElementById("NHLteamsstats").options[document.getElementById("NHLteamsstats").options.selectedIndex].text; localStorage.setItem("currentPlayer", document.getElementById("${value[x].playerId}").id); window.location.href = "NHLstatsplayer.html"'>${value[x].Name}</td>`
							columns.forEach(info => {
								if (info === "ShotPer" || info === "FOPer") {
									outputHTML += `<td><p><span class = "NHL">${Math.round(Number(value[x][info]) * 1000) / 10}</span>`;
								}
								else {
									outputHTML += `<td><p><span class = "NHL">${value[x][info]}</span>`;
								}
								if (j != -1 && newestData[info] != undefined && isNaN(newestData[info]) === false) {
									if ((newestData[info] > value[x][info]) && info !== "PIM" || (info === "PIM" && newestData[info] < value[x][info])) {
										outputHTML += `<span class = relationalGreen> (${newestData[info]})</span></p>`;
									}
									else if ((newestData[info] < value[x][info]) || (info === "PIM" && newestData[info] > value[x][info])) {
										outputHTML += `<span class = relationalRed> (${newestData[info]})</span></p>`;
									}
									else {
										outputHTML += `<span> (${newestData[info]})</span></p>`;
									}
								}
								outputHTML += `</td>`
							})
							outputHTML += `</tr>`
						}
						else {
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

	else {
		let newData = JSON.parse(localStorage[compare])
		const promise1 = localStorage['NHL'].split(',').map(async info => {
			promise2 = await getPlayerStatsArray(info, typer, position);
			return Promise.resolve(promise2);
		});
		counter = 1;
		let teamStatsRoster = await Promise.all(promise1);
		teamStatsRoster = teamStatsRoster.flat()
		teamStatsRoster.sort(function (a, b) {
			return b.Points - a.Points;
		});

		for (let x = (currentPage - 1) * recordsPerPage; x < teamStatsRoster.length; x++) {
			if (teamStatsRoster[x].Name != undefined) {
				counter++;
				if (counter + (currentPage * recordsPerPage) <= (currentPage * recordsPerPage) + recordsPerPage) {
					for (let n = 0; n < newData.length; n++) {
						let newerData = {
							Abbr: newData[n].Abbr,
							Team: newData[n].Name + " " + newData[n].Nickname,
							Players: [newData[n]["First Name0"] + " " + newData[n]["Last Name0"], newData[n]["First Name1"] + " " + newData[n]["Last Name1"], newData[n]["First Name2"] + " " + newData[n]["Last Name2"], newData[n]["First Name3"] + " " + newData[n]["Last Name3"], newData[n]["First Name4"] + " " + newData[n]["Last Name4"], newData[n]["First Name5"] + " " + newData[n]["Last Name5"], newData[n]["First Name6"] + " " + newData[n]["Last Name6"], newData[n]["First Name7"] + " " + newData[n]["Last Name7"], newData[n]["First Name8"] + " " + newData[n]["Last Name8"], newData[n]["First Name9"] + " " + newData[n]["Last Name9"], newData[n]["First Name10"] + " " + newData[n]["Last Name10"], newData[n]["First Name11"] + " " + newData[n]["Last Name11"], newData[n]["First Name12"] + " " + newData[n]["Last Name12"], newData[n]["First Name13"] + " " + newData[n]["Last Name13"], newData[n]["First Name14"] + " " + newData[n]["Last Name14"], newData[n]["First Name15"] + " " + newData[n]["Last Name15"], newData[n]["First Name16"] + " " + newData[n]["Last Name16"], newData[n]["First Name17"] + " " + newData[n]["Last Name17"], newData[n]["First Name18"] + " " + newData[n]["Last Name18"], newData[n]["First Name19"] + " " + newData[n]["Last Name19"], newData[n]["First Name20"] + " " + newData[n]["Last Name20"], newData[n]["First Name21"] + " " + newData[n]["Last Name21"], newData[n]["First Name22"] + " " + newData[n]["Last Name22"], newData[n]["First Name23"] + " " + newData[n]["Last Name23"]],
							GP: [newData[n]["GP_RS0"], newData[n]["GP_RS1"], newData[n]["GP_RS2"], newData[n]["GP_RS3"], newData[n]["GP_RS4"], newData[n]["GP_RS5"], newData[n]["GP_RS6"], newData[n]["GP_RS7"], newData[n]["GP_RS8"], newData[n]["GP_RS9"], newData[n]["GP_RS10"], newData[n]["GP_RS11"], newData[n]["GP_RS12"], newData[n]["GP_RS13"], newData[n]["GP_RS14"], newData[n]["GP_RS15"], newData[n]["GP_RS16"], newData[n]["GP_RS17"], newData[n]["GP_RS18"], newData[n]["GP_RS19"], newData[n]["GP_RS20"], newData[n]["GP_RS21"], newData[n]["GP_RS22"], newData[n]["GP_RS23"]],
							Goals: [newData[n]["G_RS0"], newData[n]["G_RS1"], newData[n]["G_RS2"], newData[n]["G_RS3"], newData[n]["G_RS4"], newData[n]["G_RS5"], newData[n]["G_RS6"], newData[n]["G_RS7"], newData[n]["G_RS8"], newData[n]["G_RS9"], newData[n]["G_RS10"], newData[n]["G_RS11"], newData[n]["G_RS12"], newData[n]["G_RS13"], newData[n]["G_RS14"], newData[n]["G_RS15"], newData[n]["G_RS16"], newData[n]["G_RS17"], newData[n]["G_RS18"], newData[n]["G_RS19"], newData[n]["G_RS20"], newData[n]["G_RS21"], newData[n]["G_RS22"], newData[n]["G_RS23"]],
							Assists: [newData[n]["A_RS0"], newData[n]["A_RS1"], newData[n]["A_RS2"], newData[n]["A_RS3"], newData[n]["A_RS4"], newData[n]["A_RS5"], newData[n]["A_RS6"], newData[n]["A_RS7"], newData[n]["A_RS8"], newData[n]["A_RS9"], newData[n]["A_RS10"], newData[n]["A_RS11"], newData[n]["A_RS12"], newData[n]["A_RS13"], newData[n]["A_RS14"], newData[n]["A_RS15"], newData[n]["A_RS16"], newData[n]["A_RS17"], newData[n]["A_RS18"], newData[n]["A_RS19"], newData[n]["A_RS20"], newData[n]["A_RS21"], newData[n]["A_RS22"], newData[n]["A_RS23"]],
							PlusMinus: [newData[n]["+/-_RS0"], newData[n]["+/-_RS1"], newData[n]["+/-_RS2"], newData[n]["+/-_RS3"], newData[n]["+/-_RS4"], newData[n]["+/-_RS5"], newData[n]["+/-_RS6"], newData[n]["+/-_RS7"], newData[n]["+/-_RS8"], newData[n]["+/-_RS9"], newData[n]["+/-_RS10"], newData[n]["+/-_RS11"], newData[n]["+/-_RS12"], newData[n]["+/-_RS13"], newData[n]["+/-_RS14"], newData[n]["+/-_RS15"], newData[n]["+/-_RS16"], newData[n]["+/-_RS17"], newData[n]["+/-_RS18"], newData[n]["+/-_RS19"], newData[n]["+/-_RS20"], newData[n]["+/-_RS21"], newData[n]["+/-_RS22"], newData[n]["+/-_RS23"]],
							PIM: [newData[n]["PIM_RS0"], newData[n]["PIM_RS1"], newData[n]["PIM_RS2"], newData[n]["PIM_RS3"], newData[n]["PIM_RS4"], newData[n]["PIM_RS5"], newData[n]["PIM_RS6"], newData[n]["PIM_RS7"], newData[n]["PIM_RS8"], newData[n]["PIM_RS9"], newData[n]["PIM_RS10"], newData[n]["PIM_RS11"], newData[n]["PIM_RS12"], newData[n]["PIM_RS13"], newData[n]["PIM_RS14"], newData[n]["PIM_RS15"], newData[n]["PIM_RS16"], newData[n]["PIM_RS17"], newData[n]["PIM_RS18"], newData[n]["PIM_RS19"], newData[n]["PIM_RS20"], newData[n]["PIM_RS21"], newData[n]["PIM_RS22"], newData[n]["PIM_RS23"]],
							PPG: [newData[n]["PP G_RS0"], newData[n]["PP G_RS1"], newData[n]["PP G_RS2"], newData[n]["PP G_RS3"], newData[n]["PP G_RS4"], newData[n]["PP G_RS5"], newData[n]["PP G_RS6"], newData[n]["PP G_RS7"], newData[n]["PP G_RS8"], newData[n]["PP G_RS9"], newData[n]["PP G_RS10"], newData[n]["PP G_RS11"], newData[n]["PP G_RS12"], newData[n]["PP G_RS13"], newData[n]["PP G_RS14"], newData[n]["PP G_RS15"], newData[n]["PP G_RS16"], newData[n]["PP G_RS17"], newData[n]["PP G_RS18"], newData[n]["PP G_RS19"], newData[n]["PP G_RS20"], newData[n]["PP G_RS21"], newData[n]["PP G_RS22"], newData[n]["PP G_RS23"]],
							SHG: [newData[n]["SH G_RS0"], newData[n]["SH G_RS1"], newData[n]["SH G_RS2"], newData[n]["SH G_RS3"], newData[n]["SH G_RS4"], newData[n]["SH G_RS5"], newData[n]["SH G_RS6"], newData[n]["SH G_RS7"], newData[n]["SH G_RS8"], newData[n]["SH G_RS9"], newData[n]["SH G_RS10"], newData[n]["SH G_RS11"], newData[n]["SH G_RS12"], newData[n]["SH G_RS13"], newData[n]["SH G_RS14"], newData[n]["SH G_RS15"], newData[n]["SH G_RS16"], newData[n]["SH G_RS17"], newData[n]["SH G_RS18"], newData[n]["SH G_RS19"], newData[n]["SH G_RS20"], newData[n]["SH G_RS21"], newData[n]["SH G_RS22"], newData[n]["SH G_RS23"]],
							GWG: [newData[n]["GWG_RS0"], newData[n]["GWG_RS1"], newData[n]["GWG_RS2"], newData[n]["GWG_RS3"], newData[n]["GWG_RS4"], newData[n]["GWG_RS5"], newData[n]["GWG_RS6"], newData[n]["GWG_RS7"], newData[n]["GWG_RS8"], newData[n]["GWG_RS9"], newData[n]["GWG_RS10"], newData[n]["GWG_RS11"], newData[n]["GWG_RS12"], newData[n]["GWG_RS13"], newData[n]["GWG_RS14"], newData[n]["GWG_RS15"], newData[n]["GWG_RS16"], newData[n]["GWG_RS17"], newData[n]["GWG_RS18"], newData[n]["GWG_RS19"], newData[n]["GWG_RS20"], newData[n]["GWG_RS21"], newData[n]["GWG_RS22"], newData[n]["GWG_RS23"]],
							Shots: [newData[n]["SOG_RS0"], newData[n]["SOG_RS1"], newData[n]["SOG_RS2"], newData[n]["SOG_RS3"], newData[n]["SOG_RS4"], newData[n]["SOG_RS5"], newData[n]["SOG_RS6"], newData[n]["SOG_RS7"], newData[n]["SOG_RS8"], newData[n]["SOG_RS9"], newData[n]["SOG_RS10"], newData[n]["SOG_RS11"], newData[n]["SOG_RS12"], newData[n]["SOG_RS13"], newData[n]["SOG_RS14"], newData[n]["SOG_RS15"], newData[n]["SOG_RS16"], newData[n]["SOG_RS17"], newData[n]["SOG_RS18"], newData[n]["SOG_RS19"], newData[n]["SOG_RS20"], newData[n]["SOG_RS21"], newData[n]["SOG_RS22"], newData[n]["SOG_RS23"]],
							FOPer: [Number(newData[n]["FOW_RS0"]) / Number(newData[n]["FO_RS0"]), Number(newData[n]["FOW_RS1"]) / Number(newData[n]["FO_RS1"]), Number(newData[n]["FOW_RS2"]) / Number(newData[n]["FO_RS2"]), Number(newData[n]["FOW_RS3"]) / Number(newData[n]["FO_RS3"]), Number(newData[n]["FOW_RS4"]) / Number(newData[n]["FO_RS4"]), Number(newData[n]["FOW_RS5"]) / Number(newData[n]["FO_RS5"]), Number(newData[n]["FOW_RS6"]) / Number(newData[n]["FO_RS6"]), Number(newData[n]["FOW_RS7"]) / Number(newData[n]["FO_RS7"]), Number(newData[n]["FOW_RS8"]) / Number(newData[n]["FO_RS8"]), Number(newData[n]["FOW_RS9"]) / Number(newData[n]["FO_RS9"]), Number(newData[n]["FOW_RS10"]) / Number(newData[n]["FO_RS10"]), Number(newData[n]["FOW_RS11"]) / Number(newData[n]["FO_RS11"]), Number(newData[n]["FOW_RS12"]) / Number(newData[n]["FO_RS12"]), Number(newData[n]["FOW_RS13"]) / Number(newData[n]["FO_RS13"]), Number(newData[n]["FOW_RS14"]) / Number(newData[n]["FO_RS14"]), Number(newData[n]["FOW_RS15"]) / Number(newData[n]["FO_RS15"]), Number(newData[n]["FOW_RS16"]) / Number(newData[n]["FO_RS16"]), Number(newData[n]["FOW_RS17"]) / Number(newData[n]["FO_RS17"]), Number(newData[n]["FOW_RS18"]) / Number(newData[n]["FO_RS18"]), Number(newData[n]["FOW_RS19"]) / Number(newData[n]["FO_RS19"]), Number(newData[n]["FOW_RS20"]) / Number(newData[n]["FO_RS20"]), Number(newData[n]["FOW_RS21"]) / Number(newData[n]["FO_RS21"]), Number(newData[n]["FOW_RS22"]) / Number(newData[n]["FO_RS22"]), Number(newData[n]["FOW_RS23"]) / Number(newData[n]["FO_RS23"])]
						};

						j = newerData["Players"].find(playerValue => (playerValue) === teamStatsRoster[x].Name);
						j = newerData["Players"].indexOf(j);
						if (j != -1) {
							newestData = {
								Abbr: newerData["Abbr"],
								GP: newerData["GP"][j],
								Goals: newerData["Goals"][j],
								Assists: newerData["Assists"][j],
								Points: Number(newerData["Goals"][j]) + Number(newerData["Assists"][j]),
								PlusMinus: newerData["PlusMinus"][j],
								PIM: newerData["PIM"][j],
								PPG: newerData["PPG"][j],
								SHG: newerData["SHG"][j],
								GWG: newerData["GWG"][j],
								Shots: newerData["Shots"][j],
								ShotPer: Math.round((Number(newerData["Goals"][j]) / Number(newerData["Shots"][j])) * 1000) / 10,
								FOPer: Math.round(Number(newerData["FOPer"][j] * 1000)) / 10
							};
							break;
						}
					}
					outputHTML += `<tr><td id = '${teamStatsRoster[x].team}' onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage.setItem("currentTeam", document.getElementById("${teamStatsRoster[x].team}").innerHTML); window.location.href = "NHLstatsteam.html"'>${teamStatsRoster[x].team} (${newestData["Abbr"]})</td><td id = "${teamStatsRoster[x].playerId}" onclick = 'localStorage.setItem("currentTeam", document.getElementById("${teamStatsRoster[x].team}").innerHTML); localStorage.setItem("currentPlayer", ${teamStatsRoster[x].playerId}); window.location.href = "NHLstatsplayer.html"'>${teamStatsRoster[x].Name}</td>`
					columns.forEach(info => {
						if (info === "ShotPer" || info === "FOPer") {
							outputHTML += `<td><p><span class = "NHL">${Math.round(Number(teamStatsRoster[x][info]) * 1000) / 10}</span>`;
						}
						else {
							outputHTML += `<td><p><span class = "NHL">${teamStatsRoster[x][info]}</span>`;
						}
						if (j != -1 && newestData[info] != undefined && isNaN(newestData[info]) === false) {
							if ((newestData[info] > teamStatsRoster[x][info]) && info !== "PIM" || (info === "PIM" && newestData[info] < teamStatsRoster[x][info])) {
								outputHTML += `<span class = relationalGreen> (${newestData[info]})</span></p>`;
							}
							else if ((newestData[info] < teamStatsRoster[x][info]) || (info === "PIM" && newestData[info] > teamStatsRoster[x][info])) {
								outputHTML += `<span class = relationalRed> (${newestData[info]})</span></p>`;
							}
							else {
								outputHTML += `<span> (${newestData[info]})</span></p>`;
							}
						}
						outputHTML += `</td>`
					})
					outputHTML += `</tr>`
				}
				else {
					counter = 1;
					break;
				}
			}
		}

		outputHTML += `</tbody>`;
		document.getElementById('playersTablesOverview').innerHTML = outputHTML;
		displayPages();
	}

	function displayPages() {
		let outputHTMLPages = `
					<div onclick='prevPage()' id="btn_prev">Prev</div>
					<div onclick ='nextPage()' id="btn_next">Next</div>
					page: <span id="page">${currentPage}</span>
				`
		document.getElementById("divPage").innerHTML = outputHTMLPages;
	}

	async function getPlayerStatsArray(team, typer, position) {
		let playerStats = await getPlayerStats(team, typer, position);
		let playerInfo = await getPlayerInfo();

		return playerStats.map(info => {
			return {
				...info,
				...playerInfo.find((element) => {
					return element.playerId === info.playerId
				}),
			}
		});

		async function getPlayerStats(team, typer, position) {
			return await getAPI(`https://api-web.nhle.com/v1/club-stats/${team}/20232024/${typer}`)
				.then(value => {
					console.log(positioner);
					if (positioner === "SKATERS") {
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
					else {
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

		async function getPlayerInfo() {
			return await getAPI(`https://api-web.nhle.com/v1/roster/${team}/20232024`)
				.then(value => {
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

async function teamStatsTables(team, gameType, compare) {
	let teamArray = [];
	console.log(compare);
	console.log(team);

	const valuesReturned = sorterTeams('teamTablesOverview', gameType);
	let columns = valuesReturned[0];
	let outputHTML = valuesReturned[1];

	let typer;

	console.log(gameType);
	if (gameType === "POST-SEASON") {
		typer = 3;
	}
	else {
		typer = 2;
	}

	if (typer === 2) {
		teamArray = await getTeam()
			.then(value1 => {
				console.log(value1);
				value1.forEach(value => {
					console.log(value);
					console.log(JSON.parse(localStorage[compare]));
					if (team !== 'ALL') {
						if (team === 'WSH') {
							newData = JSON.parse(localStorage[compare]).find(value2 => 'WAS' === value2.Abbr)
						}
						else if (team === 'ARI') {
							newData = JSON.parse(localStorage[compare]).find(value2 => 'ARZ' === value2.Abbr)
						}
						else {
							newData = JSON.parse(localStorage[compare]).find(value2 => team === (value2.Name + " " + value2.Nickname))
						}
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

						if (value.teamName === team) {
							outputHTML += `<tr><td onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage["currentTeam"] = document.getElementById("NHLteamsstats").options[document.getElementById("NHLteamsstats").options.selectedIndex].text; window.location.href = "NHLstatsteam.html"'>${value.teamName}</td>`;
							columns.forEach(info => {
								if (value[info] > newerData[info]) {
									outputHTML += `<td><p><span class = NHL>${value[info]}</span><span class = "relationalRed"> (${newerData[info]})</span></p></td>`;
								}
								else {
									outputHTML += `<td><p><span class = NHL>${value[info]}</span><span class = "relationalGreen"> (${newerData[info]})</span></p></td>`;
								}
							})
							outputHTML += `</tr>`
						}
					}
					else {
						console.log(value.Abbr);
						console.log(newData2 = JSON.parse(localStorage[compare]));
						if (value.Abbr === 'WSH') {
							newData2 = JSON.parse(localStorage[compare]).find(value2 => 'WAS' === value2.Abbr)
						}
						else if (value.Abbr === 'ARI') {
							newData2 = JSON.parse(localStorage[compare]).find(value2 => 'ARZ' === value2.Abbr)
						}
						else {
							newData2 = JSON.parse(localStorage[compare]).find(value2 => value.Abbr === value2.Abbr)
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
							if (value[info] > newerData2[info]) {
								outputHTML += `<td><p><span class = "NHL">${value[info]}</span><span class = "relationalRed">(${newerData2[info]})</span></p></td>`;
							}
							else {
								outputHTML += `<td><p><span class = "NHL">${value[info]}</span><span class = "relationalGreen">(${newerData2[info]})</span></p></td>`;
							}
						})
						outputHTML += `</tr>`
					}
				});
				outputHTML += `</tbody>`;

				document.getElementById('teamTablesOverview').innerHTML = outputHTML;
			})
	}
	else if (typer === 3) {
		teamArray = await getTeamPlayoff()
			.then(value1 => {
				console.log(value1);
				value1.forEach(value => {
					if (team !== 'ALL') {
						if (value.teamName === team) {
							outputHTML += `<tr><td onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage["currentTeam"] = document.getElementById("NHLteamsstats").options[document.getElementById("NHLteamsstats").options.selectedIndex].text; window.location.href = "NHLstatsteam.html"'>${value.teamName}</td>`;
							columns.forEach(info => {
								outputHTML += `<td>${value[info]}</td>`;
							})
							outputHTML += `</tr>`
						}
					}
					else {
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

	async function getTeam() {
		return await getAPI(`https://api-web.nhle.com/v1/standings/2024-04-18`)
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
	async function getTeamPlayoff() {
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

async function searchPlayers(lastName, gameType, position, compare) {
	let j;
	let k;
	let newestData = [];
	let promise2;
	console.log(lastName);

	const valuesReturned = sorterPlayers('playersTablesOverview', position);
	let columns = valuesReturned[0];
	let outputHTML = valuesReturned[1];

	if (gameType === "POST-SEASON") {
		typer = 3;
	}
	else {
		typer = 2;
	}
	let newData = JSON.parse(localStorage[compare])

	const promise1 = localStorage['NHL'].split(',').map(async info => {
		promise2 = await getPlayerStatsArray(info, typer, position);
		return Promise.resolve(promise2);
	});

	console.log(await Promise.all(promise1));
	const teamStatsRoster = await Promise.all(promise1);

	if (lastName === 'ALL') {
		currentPage = 1;
		playersStatsNHL('ALL', gameType, position, compare);
	}
	else {
		console.log(teamStatsRoster);
		for (let x = 0; x < teamStatsRoster.length; x++) {
			for (let y = 0; y < teamStatsRoster[x].length; y++) {
				for (let n = 0; n < newData.length; n++) {
					let newerData = {
						Abbr: newData[n].Abbr,
						Team: newData[n].Name + " " + newData[n].Nickname,
						Players: [newData[n]["Last Name0"], newData[n]["Last Name1"], newData[n]["Last Name2"], newData[n]["Last Name3"], newData[n]["Last Name4"], newData[n]["Last Name5"], newData[n]["Last Name6"], newData[n]["Last Name7"], newData[n]["Last Name8"], newData[n]["Last Name9"], newData[n]["Last Name10"], newData[n]["Last Name11"], newData[n]["Last Name12"], newData[n]["Last Name13"], newData[n]["Last Name14"], newData[n]["Last Name15"], newData[n]["Last Name16"], newData[n]["Last Name17"], newData[n]["Last Name18"], newData[n]["Last Name19"], newData[n]["Last Name20"], newData[n]["Last Name21"], newData[n]["Last Name22"], newData[n]["Last Name23"]],
						GP: [newData[n]["GP_RS0"], newData[n]["GP_RS1"], newData[n]["GP_RS2"], newData[n]["GP_RS3"], newData[n]["GP_RS4"], newData[n]["GP_RS5"], newData[n]["GP_RS6"], newData[n]["GP_RS7"], newData[n]["GP_RS8"], newData[n]["GP_RS9"], newData[n]["GP_RS10"], newData[n]["GP_RS11"], newData[n]["GP_RS12"], newData[n]["GP_RS13"], newData[n]["GP_RS14"], newData[n]["GP_RS15"], newData[n]["GP_RS16"], newData[n]["GP_RS17"], newData[n]["GP_RS18"], newData[n]["GP_RS19"], newData[n]["GP_RS20"], newData[n]["GP_RS21"], newData[n]["GP_RS22"], newData[n]["GP_RS23"]],
						Goals: [newData[n]["G_RS0"], newData[n]["G_RS1"], newData[n]["G_RS2"], newData[n]["G_RS3"], newData[n]["G_RS4"], newData[n]["G_RS5"], newData[n]["G_RS6"], newData[n]["G_RS7"], newData[n]["G_RS8"], newData[n]["G_RS9"], newData[n]["G_RS10"], newData[n]["G_RS11"], newData[n]["G_RS12"], newData[n]["G_RS13"], newData[n]["G_RS14"], newData[n]["G_RS15"], newData[n]["G_RS16"], newData[n]["G_RS17"], newData[n]["G_RS18"], newData[n]["G_RS19"], newData[n]["G_RS20"], newData[n]["G_RS21"], newData[n]["G_RS22"], newData[n]["G_RS23"]],
						Assists: [newData[n]["A_RS0"], newData[n]["A_RS1"], newData[n]["A_RS2"], newData[n]["A_RS3"], newData[n]["A_RS4"], newData[n]["A_RS5"], newData[n]["A_RS6"], newData[n]["A_RS7"], newData[n]["A_RS8"], newData[n]["A_RS9"], newData[n]["A_RS10"], newData[n]["A_RS11"], newData[n]["A_RS12"], newData[n]["A_RS13"], newData[n]["A_RS14"], newData[n]["A_RS15"], newData[n]["A_RS16"], newData[n]["A_RS17"], newData[n]["A_RS18"], newData[n]["A_RS19"], newData[n]["A_RS20"], newData[n]["A_RS21"], newData[n]["A_RS22"], newData[n]["A_RS23"]],
						PlusMinus: [newData[n]["+/-_RS0"], newData[n]["+/-_RS1"], newData[n]["+/-_RS2"], newData[n]["+/-_RS3"], newData[n]["+/-_RS4"], newData[n]["+/-_RS5"], newData[n]["+/-_RS6"], newData[n]["+/-_RS7"], newData[n]["+/-_RS8"], newData[n]["+/-_RS9"], newData[n]["+/-_RS10"], newData[n]["+/-_RS11"], newData[n]["+/-_RS12"], newData[n]["+/-_RS13"], newData[n]["+/-_RS14"], newData[n]["+/-_RS15"], newData[n]["+/-_RS16"], newData[n]["+/-_RS17"], newData[n]["+/-_RS18"], newData[n]["+/-_RS19"], newData[n]["+/-_RS20"], newData[n]["+/-_RS21"], newData[n]["+/-_RS22"], newData[n]["+/-_RS23"]],
						PIM: [newData[n]["PIM_RS0"], newData[n]["PIM_RS1"], newData[n]["PIM_RS2"], newData[n]["PIM_RS3"], newData[n]["PIM_RS4"], newData[n]["PIM_RS5"], newData[n]["PIM_RS6"], newData[n]["PIM_RS7"], newData[n]["PIM_RS8"], newData[n]["PIM_RS9"], newData[n]["PIM_RS10"], newData[n]["PIM_RS11"], newData[n]["PIM_RS12"], newData[n]["PIM_RS13"], newData[n]["PIM_RS14"], newData[n]["PIM_RS15"], newData[n]["PIM_RS16"], newData[n]["PIM_RS17"], newData[n]["PIM_RS18"], newData[n]["PIM_RS19"], newData[n]["PIM_RS20"], newData[n]["PIM_RS21"], newData[n]["PIM_RS22"], newData[n]["PIM_RS23"]],
						PPG: [newData[n]["PP G_RS0"], newData[n]["PP G_RS1"], newData[n]["PP G_RS2"], newData[n]["PP G_RS3"], newData[n]["PP G_RS4"], newData[n]["PP G_RS5"], newData[n]["PP G_RS6"], newData[n]["PP G_RS7"], newData[n]["PP G_RS8"], newData[n]["PP G_RS9"], newData[n]["PP G_RS10"], newData[n]["PP G_RS11"], newData[n]["PP G_RS12"], newData[n]["PP G_RS13"], newData[n]["PP G_RS14"], newData[n]["PP G_RS15"], newData[n]["PP G_RS16"], newData[n]["PP G_RS17"], newData[n]["PP G_RS18"], newData[n]["PP G_RS19"], newData[n]["PP G_RS20"], newData[n]["PP G_RS21"], newData[n]["PP G_RS22"], newData[n]["PP G_RS23"]],
						SHG: [newData[n]["SH G_RS0"], newData[n]["SH G_RS1"], newData[n]["SH G_RS2"], newData[n]["SH G_RS3"], newData[n]["SH G_RS4"], newData[n]["SH G_RS5"], newData[n]["SH G_RS6"], newData[n]["SH G_RS7"], newData[n]["SH G_RS8"], newData[n]["SH G_RS9"], newData[n]["SH G_RS10"], newData[n]["SH G_RS11"], newData[n]["SH G_RS12"], newData[n]["SH G_RS13"], newData[n]["SH G_RS14"], newData[n]["SH G_RS15"], newData[n]["SH G_RS16"], newData[n]["SH G_RS17"], newData[n]["SH G_RS18"], newData[n]["SH G_RS19"], newData[n]["SH G_RS20"], newData[n]["SH G_RS21"], newData[n]["SH G_RS22"], newData[n]["SH G_RS23"]],
						GWG: [newData[n]["GWG_RS0"], newData[n]["GWG_RS1"], newData[n]["GWG_RS2"], newData[n]["GWG_RS3"], newData[n]["GWG_RS4"], newData[n]["GWG_RS5"], newData[n]["GWG_RS6"], newData[n]["GWG_RS7"], newData[n]["GWG_RS8"], newData[n]["GWG_RS9"], newData[n]["GWG_RS10"], newData[n]["GWG_RS11"], newData[n]["GWG_RS12"], newData[n]["GWG_RS13"], newData[n]["GWG_RS14"], newData[n]["GWG_RS15"], newData[n]["GWG_RS16"], newData[n]["GWG_RS17"], newData[n]["GWG_RS18"], newData[n]["GWG_RS19"], newData[n]["GWG_RS20"], newData[n]["GWG_RS21"], newData[n]["GWG_RS22"], newData[n]["GWG_RS23"]],
						Shots: [newData[n]["SOG_RS0"], newData[n]["SOG_RS1"], newData[n]["SOG_RS2"], newData[n]["SOG_RS3"], newData[n]["SOG_RS4"], newData[n]["SOG_RS5"], newData[n]["SOG_RS6"], newData[n]["SOG_RS7"], newData[n]["SOG_RS8"], newData[n]["SOG_RS9"], newData[n]["SOG_RS10"], newData[n]["SOG_RS11"], newData[n]["SOG_RS12"], newData[n]["SOG_RS13"], newData[n]["SOG_RS14"], newData[n]["SOG_RS15"], newData[n]["SOG_RS16"], newData[n]["SOG_RS17"], newData[n]["SOG_RS18"], newData[n]["SOG_RS19"], newData[n]["SOG_RS20"], newData[n]["SOG_RS21"], newData[n]["SOG_RS22"], newData[n]["SOG_RS23"]],
						FOPer: [Number(newData[n]["FOW_RS0"]) / Number(newData[n]["FO_RS0"]), Number(newData[n]["FOW_RS1"]) / Number(newData[n]["FO_RS1"]), Number(newData[n]["FOW_RS2"]) / Number(newData[n]["FO_RS2"]), Number(newData[n]["FOW_RS3"]) / Number(newData[n]["FO_RS3"]), Number(newData[n]["FOW_RS4"]) / Number(newData[n]["FO_RS4"]), Number(newData[n]["FOW_RS5"]) / Number(newData[n]["FO_RS5"]), Number(newData[n]["FOW_RS6"]) / Number(newData[n]["FO_RS6"]), Number(newData[n]["FOW_RS7"]) / Number(newData[n]["FO_RS7"]), Number(newData[n]["FOW_RS8"]) / Number(newData[n]["FO_RS8"]), Number(newData[n]["FOW_RS9"]) / Number(newData[n]["FO_RS9"]), Number(newData[n]["FOW_RS10"]) / Number(newData[n]["FO_RS10"]), Number(newData[n]["FOW_RS11"]) / Number(newData[n]["FO_RS11"]), Number(newData[n]["FOW_RS12"]) / Number(newData[n]["FO_RS12"]), Number(newData[n]["FOW_RS13"]) / Number(newData[n]["FO_RS13"]), Number(newData[n]["FOW_RS14"]) / Number(newData[n]["FO_RS14"]), Number(newData[n]["FOW_RS15"]) / Number(newData[n]["FO_RS15"]), Number(newData[n]["FOW_RS16"]) / Number(newData[n]["FO_RS16"]), Number(newData[n]["FOW_RS17"]) / Number(newData[n]["FO_RS17"]), Number(newData[n]["FOW_RS18"]) / Number(newData[n]["FO_RS18"]), Number(newData[n]["FOW_RS19"]) / Number(newData[n]["FO_RS19"]), Number(newData[n]["FOW_RS20"]) / Number(newData[n]["FO_RS20"]), Number(newData[n]["FOW_RS21"]) / Number(newData[n]["FO_RS21"]), Number(newData[n]["FOW_RS22"]) / Number(newData[n]["FO_RS22"]), Number(newData[n]["FOW_RS23"]) / Number(newData[n]["FO_RS23"])]
					};

					console.log(lastName);
					j = newerData["Players"].find(playerValue => (playerValue) === lastName);
					j = newerData["Players"].indexOf(j);
					console.log(j);
					if (j != -1 && newerData["Players"].find(playerValue => (playerValue) === lastName) != undefined) {
						newestData = {
							Abbr: newerData["Abbr"],
							Team: newerData["Team"],
							GP: newerData["GP"][j],
							Goals: newerData["Goals"][j],
							Assists: newerData["Assists"][j],
							Points: Number(newerData["Goals"][j]) + Number(newerData["Assists"][j]),
							PlusMinus: newerData["PlusMinus"][j],
							PIM: newerData["PIM"][j],
							PPG: newerData["PPG"][j],
							SHG: newerData["SHG"][j],
							GWG: newerData["GWG"][j],
							Shots: newerData["Shots"][j],
							ShotPer: Math.round((Number(newerData["Goals"][j]) / Number(newerData["Shots"][j])) * 1000) / 10,
							FOPer: Math.round(Number(newerData["FOPer"][j] * 1000)) / 10
						};
					}
				}
				console.log(newestData.Name);
				console.log(lastName);
				if (newestData.Name === lastName) {
					outputHTML += `<tr><td id = ${teamStatsRoster[x].team} onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage.setItem("currentTeam", document.getElementById("${teamStatsRoster[x].team}").getElementByClass("NHL").innerHTML); window.location.href = "NHLstatsteam.html";'>${teamStatsRoster[x].team} (${newestData["Abbr"]})</td><td id = "${teamStatsRoster[x].playerId}" onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage["currentTeam"] = document.getElementById("NHLteamsstats").options[document.getElementById("NHLteamsstats").options.selectedIndex].text; localStorage.setItem("currentPlayer", document.getElementById("${teamStatsRoster[x].playerId}").id); window.location.href = "NHLstatsplayer.html"'>${teamStatsRoster[x].Name}</td>`
					columns.forEach(info => {
						if (info === "ShotPer" || info === "FOPer") {
							outputHTML += `<td><p><span class = "NHL">${Math.round(Number(teamStatsRoster[x][info]) * 1000) / 10}</span>`;
						}
						else {
							outputHTML += `<td><p><span class = "NHL">${teamStatsRoster[x][info]}</span>`;
						}
						if (j != -1 && newestData[info] != undefined && isNaN(newestData[info]) === false) {
							if ((newestData[info] > teamStatsRoster[x][info]) && info !== "PIM" || (info === "PIM" && newestData[info] < teamStatsRoster[x][info])) {
								outputHTML += `<span class = relationalGreen> (${newestData[info]})</span></p>`;
							}
							else if ((newestData[info] < teamStatsRoster[x][info]) || (info === "PIM" && newestData[info] > value[x][info])) {
								outputHTML += `<span class = relationalRed> (${newestData[info]})</span></p>`;
							}
							else {
								outputHTML += `<span> (${newestData[info]})</span></p>`;
							}
						}
						outputHTML += `</td>`
					})
					outputHTML += `</tr>`
				}
			};
			outputHTML += `</tbody>`;
			document.getElementById('playersTablesOverview').innerHTML = outputHTML;
		}
	}
	async function getPlayerStatsArray(team, typer, position) {
		let playerStats = await getPlayerStats(team, typer, position);
		let playerInfo = await getPlayerInfo(team);

		return playerStats.map(info => {
			return {
				...info,
				...playerInfo.find((element) => {
					return element.playerId === info.playerId
				}),
			}
		});
	}

	async function getPlayerStats(team, typer, position) {
		console.log(position);
		return await getAPI(`https://api-web.nhle.com/v1/club-stats/${team}/20232024/${typer}`)
			.then(value => {
				if (position === "SKATERS") {
					return value.skaters.map(info => {
						return {
							team: team,
							Name: info.lastName.default,
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
				else {
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

	async function getPlayerInfo(team) {
		return await getAPI(`https://api-web.nhle.com/v1/roster/${team}/20232024`)
			.then(value => {
				console.log(value);
				const forwardsArray = value.forwards.map(info => {
					return {
						playerId: info.id,
						headshot: info.headshot,
						Name: info.lastName.default,
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

async function searchTeam(team, gameType) {
	let teamArray = [];

	const valuesReturned = sorterTeams('teamTablesOverview', gameType);
	let columns = valuesReturned[0];
	let outputHTML = valuesReturned[1];

	let typer;

	console.log(gameType);
	if (gameType === "POST-SEASON") {
		typer = 3;
	}
	else {
		typer = 2;
	}

	if (typer === 2) {
		teamArray = await getTeam()
			.then(value1 => {
				console.log(value1);
				value1.forEach(value => {
					if (team !== 'ALL') {
						if (value.teamName === team) {
							outputHTML += `<tr><td onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage["currentTeam"] = document.getElementById("NHLteamsstats").options[document.getElementById("NHLteamsstats").options.selectedIndex].text; window.location.href = "NHLstatsteam.html"'>${value.teamName}</td>`;
							columns.forEach(info => {
								outputHTML += `<td>${value[info]}</td>`;
							})
							outputHTML += `</tr>`
						}
					}
					else {
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
	else if (typer === 3) {
		teamArray = await getTeamPlayoff()
			.then(value1 => {
				console.log(value1);
				value1.forEach(value => {
					if (team !== 'ALL') {
						if (value.teamName === team) {
							outputHTML += `<tr><td onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage["currentTeam"] = document.getElementById("NHLteamsstats").options[document.getElementById("NHLteamsstats").options.selectedIndex].text; window.location.href = "NHLstatsteam.html"'>${value.teamName}</td>`;
							columns.forEach(info => {
								outputHTML += `<td>${value[info]}</td>`;
							})
							outputHTML += `</tr>`
						}
					}
					else {
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
	async function getTeam() {
		return await getAPI(`https://api-web.nhle.com/v1/standings/2024-04-18`)
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
	async function getTeamPlayoff() {
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

function advancedFilterStatsPlayers(position) {

	if (position === 'SKATERS') {
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
			<button type="button" id="PlayersStatsSearchButton" class="searchButton" onclick='if(document.getElementById("PlayersStatsSearch").value === ""){searchPlayers("ALL", document.getElementById("NHLseasonstats").options[document.getElementById("NHLseasonstats").options.selectedIndex].text, document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text, document.getElementById("NHLcomparestats").options[document.getElementById("NHLcomparestats").options.selectedIndex].text)}else{searchPlayers(document.getElementById("PlayersStatsSearch").value, document.getElementById("NHLseasonstats").options[document.getElementById("NHLseasonstats").options.selectedIndex].text, document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text, document.getElementById("NHLcomparestats").options[document.getElementById("NHLcomparestats").options.selectedIndex].text)}'><label for="PlayersStatsSearchButton" class="searchButtonLabel">Search</label>
		`
	}
	else {
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
			<button type="button" id="PlayersStatsSearchButton" class="searchButton" onclick='if(document.getElementById("PlayersStatsSearch").value === ""){searchPlayers("ALL", document.getElementById("NHLseasonstats").options[document.getElementById("NHLseasonstats").options.selectedIndex].text, document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text, document.getElementById("NHLcomparestats").options[document.getElementById("NHLcomparestats").options.selectedIndex].text)}else{searchPlayers(document.getElementById("PlayersStatsSearch").value, document.getElementById("NHLseasonstats").options[document.getElementById("NHLseasonstats").options.selectedIndex].text, document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text, document.getElementById("NHLcomparestats").options[document.getElementById("NHLcomparestats").options.selectedIndex].text)}'><label for="PlayersStatsSearchButton" class="searchButtonLabel">Search</label>
		`
	}
	document.getElementById('NHLStatsPlayersDropDown').innerHTML = outputHTML;
}

function advancedFilterStatsTeams(gameType) {
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
	if (gameType === "POST-SEASON") {
		typer = 3;
	}
	else {
		typer = 2;
	}

	if (typer === 2) {
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
	else {
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


function sortTableNum(tableToSort, column) {

	let table, rows, switching, i, x, y, shouldSwitch;
	table = document.getElementById(tableToSort);
	table = table.firstChild;
	switching = true;
	while (switching) {
		switching = false;
		rows = table.rows;
		for (i = 1; i < (rows.length - 1); i++) {
			shouldSwitch = false;
			x = rows[i].getElementsByClassName('NHL')[column];
			y = rows[i + 1].getElementsByClassName('NHL')[column];
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

function sortTableNumASC(tableToSort, column) {

	let table, rows, switching, i, x, y, shouldSwitch;
	table = document.getElementById(tableToSort);
	table = table.firstChild;
	switching = true;
	while (switching) {
		switching = false;
		rows = table.rows;
		for (i = 1; i < (rows.length - 1); i++) {
			shouldSwitch = false;
			x = rows[i].getElementsByClassName('NHL')[column];
			y = rows[i + 1].getElementsByClassName('NHL')[column];
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

function sortTable(tableToSort, column) {

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

function sortTableASC(tableToSort, column) {

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

function prevPage() {
	if (currentPage > 1) {
		currentPage--;
		document.getElementById("page").innerHTML = currentPage;
		playersStatsNHL("ALL", document.getElementById("NHLseasonstats").options[document.getElementById("NHLseasonstats").options.selectedIndex].text, document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text);
	}
}

function nextPage() {
	currentPage++;
	document.getElementById("page").innerHTML = currentPage;
	playersStatsNHL("ALL", document.getElementById("NHLseasonstats").options[document.getElementById("NHLseasonstats").options.selectedIndex].text, document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text);
}

function getCurrentPage() {
	document.getElementById("page").innerHTML = currentPage;
}