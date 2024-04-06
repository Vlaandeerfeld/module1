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

function sorterPlayers(table, numColumn){

	let sorter1 = `<tr>`;
	list1 = ['Team', 'Player', 'GP', 'Goals', 'Assists', 'Points', 'PlusMinus', 'PIM', 'Shot %', 'FO %'];
		
	for (let x = 0; x <= 1; x++){
		sorter1 += `<th onclick = 'if(localStorage["${table}${x}"] === "DESC"){sortTable("${table}",${x}); localStorage["${table}${x}"] = "ASC";} else{sortTableASC("${table}",${x}); localStorage["${table}${x}"] = "DESC"}'>${list1[x]}</th>`;
	}
	for (let x = 2; x <= numColumn; x++){
		sorter1 += `<th onclick = 'if(localStorage["${table}${x}"] === "DESC"){sortTableNum("${table}",${x}); localStorage["${table}${x}"] = "ASC";} else{sortTableNumASC("${table}",${x}); localStorage["${table}${x}"] = "DESC"}'>${list1[x]}</th>`;
	}
	sorter1 += `</tr>`;

	return sorter1;
}

function sorterTeams(table, numColumn){

	let sorter1 = `<tr>`;
	list1 = ['Team', 'GP', 'Wins', 'Losses', 'Ties', 'OTL', 'Points', 'PCT', 'last 10', 'GF', 'GA', 'Goal Diff'];
		
	sorter1 += `<th onclick = 'if(localStorage["${table}${0}"] === "DESC"){sortTable("${table}",${0}); localStorage["${table}${0}"] = "ASC";} else{sortTableASC("${table}",${0}); localStorage["${table}${0}"] = "DESC"}'>${list1[0]}</th>`;

	for (let x = 1; x <= numColumn; x++){
		sorter1 += `<th onclick = 'if(localStorage["${table}${x}"] === "DESC"){sortTableNum("${table}",${x}); localStorage["${table}${x}"] = "ASC";} else{sortTableNumASC("${table}",${x}); localStorage["${table}${x}"] = "DESC"}'>${list1[x]}</th>`;
	}
	sorter1 += `</tr>`;

	return sorter1;
}

async function getAPI(url){

	const response = await fetch(url);
	const result = await response.json()
	return result;
}

async function leagueFilters(){
	let outputHTML = '';
    outputHTML += `<option value = 'NHL'>NHL</option>`;

	document.getElementById('NHLleaguesstats').innerHTML = outputHTML;
}

async function teamFilters(){
	let outputHTML = '';

    let leagueArray = [];
    const teamArray = await getAPI('https://api-web.nhle.com/v1/standings/now')
    const sortedTeamArray = teamArray.standings.map(value => {
       	return{
        	    Abbr: value.teamAbbrev.default
       	}
   	});
    await sortedTeamArray.forEach(value => {
        leagueArray.push(value.Abbr);
    })

	console.log(leagueArray);
    localStorage['NHL'] = leagueArray;

	outputHTML += `<option value = 'ALL' selected>ALL</option>`;

	console.log(sortedTeamArray);
	sortedTeamArray.forEach(value => {
		outputHTML += `<option value = '${value.Abbr}'>${value.Abbr}</option>`;
	})

	console.log(outputHTML);
	
	document.getElementById('NHLteamsstats').innerHTML = outputHTML;
}

function seasonFilters(){
	let outputHTML = '';
    outputHTML += `<option value = '2023'>2023</option>`;

	document.getElementById('NHLseasonstats').innerHTML = outputHTML;
}

async function teamTablesOverview(team){
    let teamArray = [];
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

	outputHTMLPlayerName += `${player}`;

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
					}
					
				})
				const goaliesArray = value.goalies.map(info => {
					return {
						playerId: info.playerId,
						points: info.points,
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

	const combinedArray = teamStats.map(info => ({
		...info,
		...teamRoster.find((element) => {
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

	combinedArray.sort(function(a, b){return b-a}).reverse().forEach(value => {

		if(value.position == 'L'){
			if(LWCount == 1){
				F1Points += value.points;
			}
			if(LWCount == 2){
				F2Points += value.points;
			}
			if(LWCount == 3){
				F3Points += value.points;
			}
			if(LWCount == 4){
				F4Points += value.points;
			}
			LWCount += 1;
			LW.push(value.name);
		}
		else if(value.position =='C'){
			if(CCount == 1){
				F1Points += value.points;
			}
			if(CCount == 2){
				F2Points += value.points;
			}
			if(CCount == 3){
				F3Points += value.points;
			}
			if(CCount == 4){
				F4Points += value.points;
			}
			CCount += 1;
			C.push(value.name);
		}
		else if(value.position =='R'){
			if(RWCount == 1){
				F1Points += value.points;
			}
			if(RWCount == 2){
				F2Points += value.points;
			}
			if(RWCount == 3){
				F3Points += value.points;
			}
			if(RWCount == 4){
				F4Points += value.points;
			}
			RWCount += 1;
			RW.push(value.name);
		}
		else if(value.position =='D' && value.hand == 'R'){
			if(LDCount == 1){
				D1Points += value.points;
			}
			if(LDCount == 2){
				D2Points += value.points;
			}
			if(LDCount == 3){
				D3Points += value.points;
			}
			LDCount += 1;
			LD.push(value.name);
		}
		else if(value.position =='D' && value.hand == 'L'){
			if(RDCount == 1){
				D1Points += value.points;
			}
			if(RDCount == 2){
				D2Points += value.points;
			}
			if(RDCount == 3){
				D3Points += value.points;
			}
			RDCount += 1;
			RD.push(value.name);
		}
		else if(value.position == 'G'){
			G.push(value.name);
		}

			outputHTMLRosterStats += `
				<tr><td id = '${value.playerId}' onclick = 'localStorage.setItem("currentPlayer", document.getElementById("${value.playerId}").id); window.location.href = "NHLstatsplayer.html"'>${value.name}</td><td>${value.DOB}</td><td>${2023 - value.DOB.slice(0,4)}</td><td>${Math.floor(value.height / 12)}'${value.height % 12}"</td><td>${value.weight}</td></tr>
			`;
		})

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

async function playersStatsNHL(team){

	console.log(localStorage['NHL'].split(','));
	console.log(team);

	let promise2;

	let outputHTML = '';
	outputHTML += sorterPlayers('playersTablesOverview',9);
	console.log(team !== 'ALL');
	if(team !== 'ALL'){
		await getPlayerStatsArray(team)
			.then(value => {
				value.forEach(value1 => {
					outputHTML += `<tr><td onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage["currentTeam"] = document.getElementById("NHLteamsstats").options[document.getElementById("NHLteamsstats").options.selectedIndex].text; window.location.href = "NHLstatsteam.html"'>${team}</td><td>${value1.Name}</td><td>${value1.GP}</td><td>${value1.Goals}</td><td>${value1.Assists}</td><td>${value1.Points}</td><td>${value1.PlusMinus}</td><td>${value1.PIM}</td><td>${value1.ShotPer}</td><td>${value1.FOPer}</td></tr>`;
				});
			});
			outputHTML += `</tbody>`;
			document.getElementById('playersTablesOverview').innerHTML = outputHTML;
	}

	else{
		const promise1 = localStorage['NHL'].split(',').map(async info => {
			promise2 = await getPlayerStatsArray(info);
			return Promise.resolve(promise2);
		});

		console.log(await Promise.all(promise1));
		const teamStatsRoster = await Promise.all(promise1);
				teamStatsRoster.map(value2 => {
					value2.map(value1 => {
						outputHTML += `<tr><td id = ${value1.team} onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage.setItem("currentTeam", document.getElementById("${value1.team}").innerHTML); window.location.href = "NHLstatsteam.html";'>${value1.team}</td><td>${value1.Name}</td><td>${value1.GP}</td><td>${value1.Goals}</td><td>${value1.Assists}</td><td>${value1.Points}</td><td>${value1.PlusMinus}</td><td>${value1.PIM}</td><td>${value1.ShotPer}</td><td>${value1.FOPer}</td></tr>`;
					});		
				});

		console.log(outputHTML);
		outputHTML += `</tbody>`;
		document.getElementById('playersTablesOverview').innerHTML = outputHTML;
	}

	async function getPlayerStatsArray(team){
		let playerStats = await getPlayerStats();
		let playerInfo = await getPlayerInfo();
	
		return playerStats.map(info => {
			return{
				...info,
				...playerInfo.find((element) => {
					return element.playerId === info.playerId
				}),
			}
		});

		async function getPlayerStats(){
			return await getAPI(`https://api-web.nhle.com/v1/club-stats/${team}/now`)
				.then(value => {
					console.log(value);
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
	}
}

async function teamStatsTables(team){
    let teamArray = [];
    teamArray = await getTeam()
		.then(value1 => {
			console.log(value1);
			let outputHTML = '';
			outputHTML += sorterTeams('teamTablesOverview', 11);
			value1.forEach(value => {
				if (team != 'ALL'){
					if (value.Abbr == team){
						outputHTML += `<tr><td onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage["currentTeam"] = document.getElementById("NHLteamsstats").options[document.getElementById("NHLteamsstats").options.selectedIndex].text; window.location.href = "NHLstatsteam.html"'>${value.Abbr}</td><td>${value.GP_RS}</td><td>${value.Wins}</td><td>${value.Losses}</td><td>${value.Ties}</td><td>${value.OTL}</td><td>${value.Points}</td><td>${value.PCT}</td><td>${value.l10}</td><td>${value.GF}</td><td>${value.GA}</td><td>${value.Goal_Diff}</td></tr>`;
					}
				}
				else{
					outputHTML += `<tr><td id = ${value.Abbr} onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage.setItem("currentTeam", document.getElementById("${value.Abbr}").innerHTML); window.location.href = "NHLstatsteam.html";'>${value.Abbr}</td><td>${value.GP_RS}</td><td>${value.Wins}</td><td>${value.Losses}</td><td>${value.Ties}</td><td>${value.OTL}</td><td>${value.Points}</td><td>${value.PCT}</td><td>${value.l10}</td><td>${value.GF}</td><td>${value.GA}</td><td>${value.Goal_Diff}</td></tr>`;
				}
			});
    	outputHTML += `</tbody>`;

    	document.getElementById('teamTablesOverview').innerHTML = outputHTML;
		})

	async function getTeam(){
		return await getAPI(`https://hockey1.p.rapidapi.com/v1/nhl/standings`)
			.then(value => {
				console.log(value);
				const newArray = value.body.map(info => {
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
						GF: info.goalFor,
						GA: info.goalAgainst,
						Goal_Diff: info.goalDifferential,
					}
				})
				console.log(newArray);
				return newArray;
			})
	}
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