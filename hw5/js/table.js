/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        // Maintain reference to the tree object
        this.tree = treeObject;

        /**List of all elements that will populate the table.*/
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = null;

        ///** Store all match data for the 2018 Fifa cup */
        this.teamData = teamData;

        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** letiables to be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';

        /** Setup the scales*/
        this.goalScale = null;


        /** Used for games/wins/losses*/
        this.gameScale = null;

        /**Color scales*/
        /**For aggregate columns*/
        /** Use colors '#feebe2' and '#690000' for the range*/
        this.aggregateColorScale = null;


        /**For goal Column*/
        /** Use colors '#cb181d' and '#034e7b' for the range */
        this.goalColorScale = null;
    }
    max(a, b){
		return a>b?a:b;
	}

	min(a, b){
		return a<b?a:b;
	}

    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {
        let max = this.max;
		let min = this.min;
        // ******* TODO: PART II *******

        //Update Scale Domains
        let Maxvalue = d3.max(this.teamData, d => {return max(d.value[this.goalsMadeHeader], d.value[this.goalsConcededHeader])});
		//let dataMin = d3.min(data, d => {return min(d.value[goalsMade], d.value[goalsConceded])});

		this.goalScale = d3.scaleLinear()
						.domain([0, Maxvalue])
						.range([this.cell.buffer, 2 * this.cell.width - this.cell.buffer]);


        // Create the axes
        let goalAxis = d3.axisBottom();
		goalAxis.scale(this.goalScale);

        //add GoalAxis to header of col 1.
        let table = d3.select("#goalHeader")
						.append("svg")
						.attr("width", 2 * this.cell.width)
						.attr("height", this.cell.height);
		table.append("g")
				.call(goalAxis);


		this.tableElements = this.teamData.slice();

        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers


        //Set sorting callback for clicking on Team header
        //Clicking on headers should also trigger collapseList() and updateTable().
        let that = this;
        let status = {"Team": false, " Goals ": true, "Round/Result": true, "Wins": true, "Losses": true, "Total Games": true};
        let headrow = d3.select("table").select("thead").select("tr");

        headrow.selectAll("th").on("click", function(d){
        	let selection = d3.select(this).text();
        	if(status[selection] == true)
        		status[selection] = false;
        	else
        		status[selection] = true;
        	that.sort(selection, status[selection]);
        });
        headrow.selectAll("td").on("click", function(d){
			let selection = d3.select(this).text();
        	if(status[selection] == true)
        		status[selection] = false;
        	else
        		status[selection] = true;
        	that.sort(selection, status[selection]);
        });
        //console.log(this.tableElements);
    }

    sort(val, status) {
    	this.collapseList();

    	switch(val)
    	{
    		case "Team":
	    		this.tableElements.sort(function(x, y){
	    			if(status)
	    				return d3.ascending(x.key, y.key);
	    			return d3.descending(x.key, y.key);
	    		});
    		break;
    		case " Goals ":
	    		this.tableElements.sort(function(x, y){
	    			if(status)
	    				return d3.ascending(x.value["Delta Goals"], y.value["Delta Goals"]);
	    			return d3.descending(x.value["Delta Goals"], y.value["Delta Goals"]);
	    		});
    		break;
    		case "Round/Result":
	    		this.tableElements.sort(function(x, y){
	    			if(status)
	    				return d3.ascending(x.value.Result.ranking, y.value.Result.ranking);
	    			return d3.descending(x.value.Result.ranking, y.value.Result.ranking);
	    		});
    		break;
    		case "Wins":
	    		this.tableElements.sort(function(x, y){
	    			if(status)
	    				return d3.ascending(x.value.Wins, y.value.Wins);
	    			return d3.descending(x.value.Wins, y.value.Wins);
	    		});
    		break;
    		case "Losses":
	    		this.tableElements.sort(function(x, y){
	    			if(status)
	    				return d3.ascending(x.value.Losses, y.value.Losses);
	    			return d3.descending(x.value.Losses, y.value.Losses);
	    		});
    		break;
    		case "Total Games":
	    		this.tableElements.sort(function(x, y){
	    			if(status)
	    				return d3.ascending(x.value.TotalGames, y.value.TotalGames);
	    			return d3.descending(x.value.TotalGames, y.value.TotalGames);
	    		});
    		break;

    	}
    	this.updateTable();

    }


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******
        let that = this;
        let goalScale = this.goalScale;
        let cellcenter = this.cell.height/2;
        let maxvalue, minvalue, games, colorScale, barScale;

		maxvalue = d3.max(this.tableElements, d => d.value[this["Delta Goals"]]);
		minvalue = d3.min(this.tableElements, d => d.value[this["Delta Goals"]]);
		games = d3.max(this.tableElements, d=> d.value.TotalGames);

		colorScale = d3.scaleLinear()
							.domain([0, games])
							.range(["#e6ffe6", "#003300"]);

		barScale = d3.scaleLinear()
							.domain([0, games])
							.range([0, this.cell.width - this.cell.buffer]);
        //Create table rows
        let table = d3.select("#matchTable").select("tbody").selectAll("tr").data(this.tableElements);

		let tr = table.enter()
						.append("tr")
						.on("click", (d, i)=>this.updateList(i))
						.on("mouseover", d=>this.tree.updateTree(d))
						.on("mouseout", d=>this.tree.clearTree(d));

		table.exit().remove();
		table = tr.merge(table);

		table.attr("id", d=>d.key)
			 .attr("class", d=>d.value.type);


        //Append th elements for the Team Names
        let th = table.selectAll("th").data(d=>[d.key]);

		let newth =	th.enter()
					.append("th")
					.attr("width", this.cell.width)
					.attr("height", this.cell.height);

		th = newth.merge(th)
					.text(d=>d);

        //Append td elements for the remaining columns.
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'vis' :<'bar', 'goals', or 'text'>, 'value':<[array of 1 or two elements]>}

        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )
        let td = table.selectAll("td")
					.data(d=>[
								{type: d.value.type, vis: "goals",  value:[{type: d.value.type, delta: d.value[this.goalsMadeHeader] - d.value[this.goalsConcededHeader], goals: d.value[this.goalsMadeHeader]}, {type: d.value.type, delta: d.value[this.goalsMadeHeader] - d.value[this.goalsConcededHeader], goals: d.value[this.goalsConcededHeader]}]},
								{type: d.value.type, vis: "text",  value:[d.value.Result.label]},
								{type: d.value.type, vis: "bar",  value:[d.value.Wins]},
								{type: d.value.type, vis: "bar",  value:[d.value.Losses]},
								{type: d.value.type, vis: "bar",  value:[d.value.TotalGames]}
							]);
		let newtd = td.enter().append("td");

		td.exit().remove();
		td = newtd.merge(td);
		let svg = td.filter(function(d){return d.vis == "goals";});

		let newsvg = svg.selectAll("svg").data(function(d){return d3.select(this).data();}).enter()
			.append("svg")
			.attr("width", this.cell.width * 2)
			.attr("height", this.cell.height);

		svg.exit().remove();
		svg = newsvg.merge(svg);

		let goalBars = svg.selectAll("rect").data(function(d){return d3.select(this).data();})

		/*Apending Rectangle*/
		let goalBar = goalBars.enter()
								.append("rect")

		goalBars.exit().remove();
		goalBars = goalBar.merge(goalBars);

		goalBars.attr("x", function(d){return goalScale(that.min(d.value[0].goals, d.value[1].goals));})
				.attr("y", function(d){
					let delta = that.cell.height/4;
					if(d.type == "game")
							delta = that.cell.height/8;
					return cellcenter - delta;
				})
				.attr("height", function(d){if(d.type == "game") return that.cell.height/4; return that.cell.height/2;})
				.attr("width", function(d){
					return Math.abs(goalScale(d.value[0].goals) - goalScale(d.value[1].goals));
				})
				.attr("style", function(d){
					if(d.value[0].delta < 0)
						return "fill: #f3988c";
					else
						return "fill: #a8bad6";
				})
				.on("mouseover", function(d){
					d3.select(this).append("title").text("Goals Scored: " + d.value[0].goals+"\nGoals Conceded: " + d.value[1].goals);
				})
				.on("mouseout", function(d){
					d3.select(this).select("title").remove();
				});


        let circles = svg.selectAll("circle").data(d=>d.value)
		let circle = circles.enter().append("circle");

		circles.exit().remove();
		circles = circle.merge(circles);

		circles.attr("cx", d=>goalScale(d.goals))
			.attr("cy", cellcenter)
			.attr("r", that.cell.height/4)
			.attr("style", function(d,i){
				let val;
				if(d.type == "game")
				{
					if(i == 0)
						val = "stroke: #364e74; stroke-width: 2px; fill: white";
					else
						val = "stroke: #be2714; stroke-width: 2px; fill: white";
					if(d.delta == 0)
						val = "stroke: grey; stroke-width: 2px; fill: white";
				}
				else
				{
					if(i == 0)
						val = "fill: #364e74";
					else
						val = "fill: #be2714";
					if(d.delta == 0)
						val = "fill: grey";
				}
				return val;
			})
			.on("mouseover", function(d){
				d3.select(this)
					.append("title")
					.text(d.goals);
			})
			.on("mouseoout", function(d){
				d3.select(this).remove("title");
			});

        let results = td.filter(function(d){return d.vis == "text";})
						.selectAll("svg")
						.data(function(d){return d3.select(this).data();})
		let resultsvg = results.enter()
							.append("svg")
							.attr("width", 1.6 * this.cell.width)
							.attr("height", this.cell.height);
		results.exit().remove();
		results = resultsvg.merge(results);

		let textfield = results.selectAll("text")
						.data(d=>d.value);
		let newtext = textfield.enter()
								.append("text")
								.attr("x", 0)
								.attr("y", cellcenter);

		textfield.exit().remove();
		textfield = newtext.merge(textfield);

		textfield.attr("width", 1.6 * this.cell.width)
				.attr("height", this.cell.height)
				.text(d=>d);

        let svgdata = td.filter(function(d){return d.vis == "bar";});
		let barSvg = svgdata.selectAll("svg").data(function(d){return d3.select(this).data();});

		let newbarsvg = barSvg.enter()
						.append("svg")
						.attr("width", this.cell.width)
						.attr("height", this.cell.height);

		barSvg.exit().remove();
		barSvg = newbarsvg.merge(barSvg);

		let bars = barSvg.selectAll("rect").data(function(d){return d3.select(this).data();});
		let newBar = bars.enter().append("rect");

		bars.exit().remove();
		bars = newBar.merge(bars);

		bars.attr("x", 0)
			.attr("y", 0)
			.attr("height", this.cell.height)
			.attr("width", function(d){if(d.type == "game") return 0; return barScale(d.value[0]);})
			.attr("style", d=>"fill:"+colorScale(d.value[0]))

		let textf = barSvg.selectAll("text").data(function(d){return d3.select(this).data();});
		let newText = textf.enter().append("text");

		textf.exit().remove();
		textf = newText.merge(textf);

		textf.text(function(d){ if(d.type == "game") return ""; return d.value[0];})
			.attr("x", function(d){ if(d.type == "game") return 0; return barScale(d.value[0])-2;})
			.attr("y", this.cell.height/4 * 3)
			.attr("style", "font-size: 12px ;fill: white; text-anchor: end");
    };

        //Create diagrams in the goals column

        //Set the color of all games that tied to light gray


    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******

        //Only update list for aggregate clicks, not game clicks
        let newlist, newlen = 0;
		let len = this.tableElements.length;
        if(this.tableElements[i].value.type == "aggregate" && (i == (len-1) ? true : this.tableElements[i+1].value.type == "aggregate"))
		{
			newlist = this.tableElements.splice(0, i+1);
			newlist = (newlist.concat(newlist[i].value.games.slice())).slice();
			for(let k = 1; k <= newlist[i].value.games.length;k++){
				let key = "x" + newlist[i].value.games[k-1].key;
				newlist[i+k].key = key;
			}
			this.tableElements = newlist.concat(this.tableElements);
		}
		else if (this.tableElements[i].value.type == "aggregate" && (i == (len-1) ? true : this.tableElements[i+1].value.type == "game"))
		{
			newlen = this.tableElements[i].value.games.length;
			newlist = this.tableElements.splice(i+1, newlen);
			for(let k = 0; k < this.tableElements[i].value.games.length; k++)
				this.tableElements[i].value.games[k].key =
					this.tableElements[i].value.games[k].key.replace("x","");
		}
		else
			return;

		this.updateTable();


    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {

        let count = 0;
		for(let i = this.tableElements.length-1; i>=0; i--)
		{

			if(this.tableElements[i].value.type == "game")
			{
				count++;
			}
			else
			{
				if(count != 0)
				{
					this.tableElements.splice(i+1, count);
				}
				count = 0;
			}
		}
        // ******* TODO: PART IV *******
		this.updateTable();

    }


}