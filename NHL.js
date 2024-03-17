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
    let teamArray =  await getAPI('https://hockey1.p.rapidapi.com/v1/nhl/teams');
    const sortedTeamArray = teamArray.body.slice(0,32).map(value => {
       return{
            Abbr: value.abbrev
       }
    });

    sortedTeamArray.forEach(value => {
        leagueArray.push(value.Abbr);
    })

    localStorage['NHL'] = leagueArray;

	outputHTML += `<option value = 'ALL' selected>ALL</option>`;

	sortedTeamArray.forEach(value => {
		outputHTML += `<option value = '${value.Abbr}'>${value.Abbr}</option>`;
	})
	
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

function playerStatsNHL(){

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

				document.getElementById('FHMPlayerPortrait').style.backgroundColor = value['Secondary Color'];
				document.getElementById('FHMPlayerPortrait').style.color = value['Primary Color'];
				document.getElementById('FHMPlayerPortrait').style.fontSize = '100px';
			

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
	document.getElementById('FHMPlayerPortrait').innerHTML = outputHTMLPlayerName;

}


async function teamStatsNHL(){
	console.log(localStorage['currentLeague']);
	console.log(localStorage['currentTeam']);
	let team = localStorage['currentTeam'];

    let teamStats = await getTeamStats();
	let teamRoster = await getTeamRoster();

	console.log(teamRoster);
	console.log(teamStats);

	const combinedArray = teamStats.map(info => {
		return teamRoster.find((element) => {
			return element.playerId === info.playerId;
		})
	});

	async function getTeamStats(){
		return await getAPI(`https://hockey1.p.rapidapi.com/v1/nhl/teams-stats?teamAbbrev=${team}`)
			.then(value => {
				console.log(value);
				const newArraySkaters = value.body.skaters.map(info => {
					return {
						playerId: info.playerId,
						points: info.points,	
					}
				})
				console.log(newArraySkaters);
				return newArraySkaters;
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
//	let outputHTMLLinesStats = '';

	outputHTMLRoster += `
			<tbody>
			<tr><th>LW</th><th>C</th><th>RW</th></tr>
`;
	outputHTMLRosterStats += `<tbody>`;
//	outputHTMLLinesStats += `<tbody>`;
	outputHTMLRosterStats += `<tr><th onclick = 'sortTable("NHLstatsteamRosterStats", 0)'>Name</th><th onclick = 'sortTable("NHLstatsteamRosterStats", 1)'>DOB</th><th onclick = 'sortTableNum("NHLstatsteamRosterStats", 2)'>Age</th><th onclick = 'sortTable("NHLstatsteamRosterStats", 3)'>Height</th><th onclick = 'sortTableNum("NHLstatsteamRosterStats", 4)'>Weight</th></tr>`;

	combinedArray.sort(compareNumbers).reverse().forEach(value => {
		/*if (value.Abbr == team){

			console.log(value['Primary Color']);
			console.log(value['Secondary Color']);
			document.getElementById('FHMTeamLogo').style.backgroundColor = value['Secondary Color'];
			document.getElementById('FHMTeamLogo').style.color = value['Primary Color'];
			document.getElementById('FHMTeamLogo').style.fontSize = '100px';
			document.getElementById('FHMTeamLogo').innerHTML = value['Name'] + ' ' + value['Nickname'];

			let url = `https://assets.nhle.com/logos/nhl/svg/${value.Abbr}_dark.svg`;
		*/	
		if(value.position == 'L'){
			LW.push(value.name);
		}
		else if(value.position =='C'){
			C.push(value.name);
		}
		else if(value.position =='R'){
			RW.push(value.name);
		}

/*
			let F1Points = 0;
			let F2Points = 0;
			let F3Points = 0;
			let F4Points = 0;
			let D1Points = 0;
			let D2Points = 0;
			let D3Points = 0;

			for(let count = 0; count <= 25; count++){
*/

			outputHTMLRosterStats += `
				<tr><td id = '${value.name}' onclick = 'localStorage.setItem("currentPlayer", document.getElementById("${value.name}").id); window.location.href = "NHLstatsplayer.html"'>${value.name}</td><td>${value.DOB}</td><td>${2023 - value.DOB.slice(0,4)}</td><td>${Math.floor(value.height / 12)}'${value.height % 12}"</td><td>${value.weight}</td></tr>
			`;
/*				if(value['Last Name' + count.toString()] == value['LW1_line'] || value['Last Name' + count.toString()] == value['C1_line'] || value['Last Name' + count.toString()] == value['RW1_line']){
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
		})
	*/	})
		outputHTMLRoster += `
				<tr><td>${LW[0]}</td><td>${C[0]}</td><td>${RW[0]}</td></tr>
				<tr><td>${LW[1]}</td><td>${C[1]}</td><td>${RW[1]}</td></tr>
				<tr><td>${LW[2]}</td><td>${C[2]}</td><td>${RW[2]}</td></tr>
				<tr><td>${LW[3]}</td><td>${C[3]}</td><td>${RW[3]}</td></tr>
				</tbody>
		`;
		outputHTMLRosterStats += `</tbody>`;
//		outputHTMLLinesStats += `<tbody>`;
		document.getElementById('NHLstatsteamRoster').innerHTML = outputHTMLRoster;
		document.getElementById('NHLstatsteamRosterStats').innerHTML = outputHTMLRosterStats;
//		document.getElementById('FHMstatsteamLinesStats').innerHTML = outputHTMLLinesStats;
}

function compareNumbers(a, b) {
	return a - b;
  }