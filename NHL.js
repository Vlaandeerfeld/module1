const date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

async function getAPI(url){

	console.log(localStorage[url]);
	localStorage['day'] = localStorage['day'] ?? day;
	localStorage['month'] = localStorage['month'] ?? month;
	localStorage['year'] = localStorage['year'] ?? year; 
	console.log(day === Number(localStorage['day']));
	if (day > Number(localStorage['day']) || month > Number(localStorage['month']) || year > Number(localStorage['year']) || localStorage[url] == undefined){
		keys = '3d8b532b6amsh9d0a8e0a2b73df6p1748b4jsn711a2222c274';
			let options = {
				method: 'GET',
				headers: {
					'X-RapidAPI-Key': keys,
					'X-RapidAPI-Host': 'hockey1.p.rapidapi.com'
				}
			};
			try {
				const response = await fetch(url, options);
				const result = await response.json()
				console.log(await result.body);
				localStorage[url] = JSON.stringify(result);
				console.log(url);
				return result;
			} catch (error) {
				console.error(error);
			}
	}
	else{
		return JSON.parse(localStorage[url]);
	}
}

async function leagueFilters(){
	let outputHTML = '';
    outputHTML += `<option value = 'NHL'>NHL</option>`;

	document.getElementById('NHLleaguesstats').innerHTML = outputHTML;
}

async function teamFilters(){
	let outputHTML = '';

    let leagueArray = [];
    const teamArray = await getAPI('https://hockey1.p.rapidapi.com/v1/nhl/teams')
    const sortedTeamArray = teamArray.body.slice(0,32).map(value => {
       	return{
        	    Abbr: value.abbrev
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
			let outputHTML = '';
			outputHTML += `<tbody><tr><th onclick = 'sortTable("teamTablesOverview", 0)'>Team</th><th onclick = 'sortTableNum("teamTablesOverview", 1)'>GP</th><th onclick = 'sortTableNum("teamTablesOverview", 2)'>Wins</th><th onclick = 'sortTableNum("teamTablesOverview", 3)'>Losses</th><th onclick = 'sortTableNum("teamTablesOverview", 4)'>Ties</th><th onclick = 'sortTableNum("teamTablesOverview", 5)'>OTL</th><th onclick = 'sortTableNum("teamTablesOverview", 6)'>Points</th><th onclick = 'sortTableNum("teamTablesOverview", 7)'>PCT</th><th onclick = 'sortTableNum("teamTablesOverview", 8)'>G</th></tr>`;
			value1.forEach(value => {
				if (team != 'ALL'){
					if (value.Abbr == team){
						outputHTML += `<tr><td onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage["currentTeam"] = document.getElementById("NHLteamsstats").options[document.getElementById("NHLteamsstats").options.selectedIndex].text; window.location.href = "NHLstatsteam.html"'>${value.Abbr}</td><td>${value.GP_RS}</td><td>${value.Wins}</td><td>${value.Losses}</td><td>${value.Ties}</td><td>${value.OTL}</td><td>${value.Points}</td><td>${value.PCT}</td><td>${value.G_RS}</td></tr>`;
					}
				}
				else{
					outputHTML += `<tr><td id = ${value.Abbr} onclick = 'localStorage["currentLeague"] = document.getElementById("NHLleaguesstats").options[document.getElementById("NHLleaguesstats").options.selectedIndex].text; localStorage.setItem("currentTeam", document.getElementById("${value.Abbr}").innerHTML); window.location.href = "NHLstatsteam.html";'>${value.Abbr}</td><td>${value.GP_RS}</td><td>${value.Wins}</td><td>${value.Losses}</td><td>${value.Ties}</td><td>${value.OTL}</td><td>${value.Points}</td><td>${value.PCT}</td><td>${value.G_RS}</td></tr>`;
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
						G_RS: info.goalFor,
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
	let playerStats = await getPlayerStats();

	console.log(player);
	console.log(playerStats.Name);
	const arrayPlayerStats = playerStats.find(info => {
		return info.Name === player;
	})

	console.log(arrayPlayerStats);

	async function getPlayerStats(){
		return await getAPI(`https://hockey1.p.rapidapi.com/v1/nhl/teams-stats?teamAbbrev=${team}`)
			.then(value => {
				console.log(value);
				const newArray = value.body.skaters.map(info => {
					return {
						playerId: info.playerId,
						headshot: info.headshot,
						Name: `${info.firstName.default} ${info.lastName.default}`,
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
			return newArray;
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

    let teamStats = await getTeamStats();
	let teamRoster = await getTeamRoster();
	let teamInfo = await getTeamInfo();

	console.log(teamRoster);
	console.log(teamStats);
	console.log(teamInfo);

	const combinedArray = teamStats.map(info => ({
		...info,
		...teamRoster.find((element) => {
			return element.playerId === info.playerId
		}),
	}))

	async function getTeamInfo(){
		return await getAPI(`https://hockey1.p.rapidapi.com/v1/nhl/teams`)
			.then(value => {
				return value.body.find((info) => {
						return info.abbrev === team	
				})			
		})
	}

	async function getTeamStats(){
		return await getAPI(`https://hockey1.p.rapidapi.com/v1/nhl/teams-stats?teamAbbrev=${team}`)
			.then(value => {
				console.log(value);
				const newArraySkaters = value.body.skaters.map(info => {
					return {
						playerId: info.playerId,
						points: info.points,
						TOI: info.avgTimeOnIcePerGame,	
					}
				})
				const newArrayGoalies = value.body.goalies.map(info => {
					return {
						playerId: info.playerId,
						points: info.points,
						TOI: info.avgTimeOnIcePerGame,	
					}
				})
				console.log(newArraySkaters);
				return newArraySkaters.concat(newArrayGoalies);		
			})
	}

	async function getTeamRoster(){
		return await getAPI(`https://hockey1.p.rapidapi.com/v1/nhl/teams-roster?teamAbbrev=${team}`)
			.then(value => {
				console.log(value);
				const newArrayForwards = value.body.forwards.map(info => {
					return {
						playerId: info.id,
						headshot: info.headshot,
						name: `${info.firstName.default} ${info.lastName.default}`,
						position: info.positionCode,
						hand: info.shootsCatches,
						height: info.heightInInches,
						weight: info.weightInPounds,
						DOB: info.birthDate,
					}
				})
				const newArrayDefensemen = value.body.defensemen.map(info => {
					return {
						playerId: info.id,
						headshot: info.headshot,
						name: `${info.firstName.default} ${info.lastName.default}`,
						position: info.positionCode,
						hand: info.shootsCatches,
						height: info.heightInInches,
						weight: info.weightInPounds,
						DOB: info.birthDate,
					}
				})
				const newArrayGoalies = value.body.goalies.map(info => {
					return {
						playerId: info.id,
						headshot: info.headshot,
						name: `${info.firstName.default} ${info.lastName.default}`,
						position: info.positionCode,
						hand: info.shootsCatches,
						height: info.heightInInches,
						weight: info.weightInPounds,
						DOB: info.birthDate,
					}
				})
				console.log(newArrayForwards.concat(newArrayDefensemen.concat(newArrayGoalies)));
				return newArrayForwards.concat(newArrayDefensemen.concat(newArrayGoalies));
			})
	}
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
	document.getElementById('NHLTeamLogo').innerHTML = teamInfo.name.default;

	let url = teamInfo.darkLogo;

	combinedArray.sort(compareNumbers).reverse().forEach(value => {

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
				<tr><td id = '${value.name}' onclick = 'localStorage.setItem("currentPlayer", document.getElementById("${value.name}").id); window.location.href = "NHLstatsplayer.html"'>${value.name}</td><td>${value.DOB}</td><td>${2023 - value.DOB.slice(0,4)}</td><td>${Math.floor(value.height / 12)}'${value.height % 12}"</td><td>${value.weight}</td></tr>
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

function compareNumbers(a, b) {
	return a.TOI - b.TOI;
  }