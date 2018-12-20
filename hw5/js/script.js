 /**
     * Loads in the table information from fifa-matches-2018.json
     */
//d3.json('data/fifa-matches-2018.json').then( data => {

    /**
     * Loads in the tree information from fifa-tree-2018.csv and calls createTree(csvData) to render the tree.
     *
     */
    //d3.csv("data/fifa-tree-2018.csv").then(csvData => {

        //Create a unique "id" field for each game
        /*csvData.forEach( (d, i) => {
            d.id = d.Team + d.Opponent + i;
        });

        //Create Tree Object
        let tree = new Tree();
        tree.createTree(csvData);

        //Create Table Object and pass in reference to tree object (for hover linking)

        let table = new Table(data,tree);

        table.createTable();
        table.updateTable();
    });
});*/



// // ********************** HACKER VERSION ***************************
/**
 * Loads in fifa-matches-2018.csv file, aggregates the data into the correct format,
 * then calls the appropriate functions to create and populate the table.
 *
 */

 d3.csv("data/fifa-matches-2018.csv").then( matchesCSV => {
    let rankList = {"Group": 0, "Round of Sixteen": 1, "Quarter Finals": 2, "Semi Finals": 3, "Fourth Place": 4, "Third Place": 5, "Runner-Up":6, "Winner": 7}
	let ranking = function(d){
		return ranklist[d];
	}
	let result = function(d){
		for(iter in rankList)
			if(rankList[iter] == d)
				return iter;
	}

	let teamData = d3.nest()
					    .key(function (d) {
					        	return d.Team;
					   		})
					    .rollup(function (leaves) {
					    		let wins = d3.sum(leaves, function(l){return l.Wins});
					    		let losses = d3.sum(leaves, function(l){return l.Losses;});
					    		let goalsMade = d3.sum(leaves, function(l){return l["Goals Made"];});
					    		let goalsConceded = d3.sum(leaves, function(l){return l["Goals Conceded"];});
					    		let deltaGoals = goalsMade - goalsConceded;
					    		let totalGames = d3.sum(leaves, d=>1);
					    		let games = [], k =0;
					    		for(let i of leaves){
					    			//console.log(i.Opponent);
					    			let obj = {};
					    			obj.key = i.Opponent;
					    			obj.value = {
					    				"Delta Goals": [],
					    				"Goals Conceded": i["Goals Conceded"],
					    				"Goals Made": i["Goals Made"],
					    				"Losses": [],
					    				"Opponent": i.Team,
					    				"Wins": [],
					    				"Result": {"label": i.Result, "ranking": rankList[i.Result]},
					    				"type": "game",

					    			}
					    			//console.log(obj);
						    		games[k++] = obj;
					    		}
					    		let ranking = d3.max(leaves, d=>rankList[d.Result]);

					    		games.sort(function(x, y){
					    			return d3.descending(x.value.Result.ranking, y.value.Result.ranking);
					    		});

					    		let json = {
					    			"Delta Goals": deltaGoals,
					    			"Goals Made": goalsMade,
					    			"Goals Conceded": goalsConceded,
					    			"Losses": losses,
					    			"Result": {"label": result(ranking), "ranking": ranking},
					    			"TotalGames": totalGames,
					    			"Wins": wins,
					    			"games": games,
					    			"type": "aggregate"
					    		};
					    		return json;
					    	})
					    .entries(matchesCSV);
//     /**
//      * Loads in the tree information from fifa-tree-2018.csv and calls createTree(csvData) to render the tree.
//      *
//      */
    d3.csv("data/fifa-tree-2018.csv").then( treeCSV => {

//     // ******* TODO: PART I *******
                treeCSV.forEach(function (d, i) {
            d.id = d.Team + d.Opponent + i;
        });

        //Create Tree Object
        let tree = new Tree();
        tree.createTree(treeCSV);

        //Create Table Object and pass in reference to tree object (for hover linking)
        let table = new Table(teamData,tree);

        table.createTable();
        table.updateTable();

      });
 });
// ********************** END HACKER VERSION ***************************