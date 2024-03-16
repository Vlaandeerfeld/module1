async function getAPI(url){
	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': '74547496c9msh5494298114437afp1e5ccbjsn780ce414b9d8',
			'X-RapidAPI-Host': 'hockey1.p.rapidapi.com'
		}
	};
	
	try {
		const response = await fetch(url, options);
		const result = await response.json();
        console.log(result.body);
		return result;
	} catch (error) {
		console.error(error);
	}
}

function leagueFilters(){
	let outputHTML = '';
    outputHTML += `<option value = 'NHL'>NHL</option>`;

	document.getElementById('NHLleaguesstats').innerHTML = outputHTML;
}

async function teamFilters(){
	let outputHTML = '';

    let leagueArray = [];
   // let teamArray =  await getAPI('https://hockey1.p.rapidapi.com/v1/nhl/teams');
	let sortedTeamArray = [
		{Abbr: 'CGY'}
	]
/*    const sortedTeamArray = teamArray.body.slice(0,32).map(value => {
       return{
            Abbr: value.abbrev
       }
    });
*/

    sortedTeamArray.forEach(value => {
        leagueArray.push(value.Abbr);
    })

    localStorage['NHL'] = leagueArray;

	outputHTML += `<option value = 'ALL' selected>ALL</option>`;

	sortedTeamArray.forEach(value => {
		outputHTML += `<option value = ${value.Abbr}>${value.Abbr}</option>`;
	})
	
	document.getElementById('NHLteamsstats').innerHTML = outputHTML;
}

function seasonFilters(){
	let outputHTML = '';
    outputHTML += `<option value = '2023'>2023</option>`;

	document.getElementById('NHLseasonstats').innerHTML = outputHTML;
}

async function teamTablesOverview(league, season, team){
    let teamArray = [];
    teamArray = await getTeam(team)
		.then(value1 => {
			console.log(value1);
			let outputHTML = '';
			outputHTML += `<tbody><tr><th onclick = 'sortTable("teamTablesOverview", 0)'>Team</th><th onclick = 'sortTableNum("teamTablesOverview", 1)'>GP</th><th onclick = 'sortTableNum("teamTablesOverview", 2)'>Wins</th><th onclick = 'sortTableNum("teamTablesOverview", 3)'>Losses</th><th onclick = 'sortTableNum("teamTablesOverview", 4)'>Ties</th><th onclick = 'sortTableNum("teamTablesOverview", 5)'>OTL</th><th onclick = 'sortTableNum("teamTablesOverview", 6)'>Points</th><th onclick = 'sortTableNum("teamTablesOverview", 7)'>PCT</th><th onclick = 'sortTableNum("teamTablesOverview", 8)'>G</th></tr>`;
			value1.forEach(value => {
				if (team != 'ALL'){
					if (value.Abbr == team){
						outputHTML += `<tr><td onclick = 'localStorage["currentLeague"] = document.getElementById("FHMleaguesstats").options[document.getElementById("FHMleaguesstats").options.selectedIndex].text; localStorage["currentTeam"] = document.getElementById("FHMteamsstats").options[document.getElementById("FHMteamsstats").options.selectedIndex].text; window.location.href = "FHMstatsteam.html"'>${value.Abbr}</td><td>${value.GP_RS}</td><td>${value.Wins}</td><td>${value.Losses}</td><td>${value.Ties}</td><td>${value.OTL}</td><td>${value.Points}</td><td>${value.PCT}</td><td>${value.G_RS}</td></tr>`;
					}
				}
				else{
					outputHTML += `<tr><td id = ${value.Abbr} onclick = 'localStorage["currentLeague"] = document.getElementById("FHMleaguesstats").options[document.getElementById("FHMleaguesstats").options.selectedIndex].text; localStorage.setItem("currentTeam", document.getElementById("${value.Abbr}").innerHTML); window.location.href = "FHMstatsteam.html";'>${value.Abbr}</td><td>${value.GP_RS}</td><td>${value.Wins}</td><td>${value.Losses}</td><td>${value.Ties}</td><td>${value.OTL}</td><td>${value.Points}</td><td>${value.PCT}</td><td>${value.G_RS}</td></tr>`;
				}
			});
    	outputHTML += `</tbody>`;

    	document.getElementById('teamTablesOverview').innerHTML = outputHTML;
		})

	async function getTeam(team){
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
		/*
		if (team == 'ALL'){
        	let teams = localStorage['NHL'].split(',');
        	console.log(teams);
        	teams.forEach(value => {
            	teamArray.push(value + getAPI(`https://hockey1.p.rapidapi.com/v1/nhl/teams-stats?teamAbbrev=${value}`))
				return teamArray;    
        	})
    	}
		else{
			teamArray.push(team + getAPI(`https://hockey1.p.rapidapi.com/v1/nhl/teams-stats?teamAbbrev=${team}`))
			return teamArray;
		}
*/
}