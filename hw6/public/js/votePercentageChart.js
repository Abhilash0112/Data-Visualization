/** Class implementing the votePercentageChart. */
class VotePercentageChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(activeYear){
        // Follow the constructor method in yearChart.js
		// assign class 'content' in style.css to vote percentage chart
		this.activeYear = activeYear;
	    this.margin = {top: 30, right: 20, bottom: 30, left: 50};
	    let divvotesPercentage = d3.select("#votes-percentage").classed("content", true);


	    this.svgBounds = divvotesPercentage.node().getBoundingClientRect();
	    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
	    this.svgHeight = 200;


	    this.svg = divvotesPercentage.append("svg")
	        .attr("width",this.svgWidth)
	        .attr("height",this.svgHeight)

    }


	/**
	 * Returns the class that needs to be assigned to an element.
	 *
	 * @param party an ID for the party that is being referred to.
	 */
	chooseClass(data) {
	    if (data == "R"){
	        return "republican";
	    }
	    else if (data == "D"){
	        return "democrat";
	    }
	    else if (data == "I"){
	        return "independent";
	    }
	}

	/**
	 * Renders the HTML content for tool tip
	 *
	 * @param tooltip_data information that needs to be populated in the tool tip
	 * @return text HTML content for toop tip
	 */
	tooltip_render (tooltip_data) {
	    let text = "<ul>";
	    tooltip_data.result.forEach((row)=>{
	        text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+")" + "</li>"
	    });

	    return text;
	}

	/**
	 * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
	 *
	 * @param electionResult election data for the year selected
	 */
	update (electionResult, activeYear){

		let _this = this;
		this.activeYear = activeYear;

		//for reference:https://github.com/Caged/d3-tip
		//Use this tool tip element to handle any hover over the chart
		let tip = d3.tip().attr('class', 'd3-tip')
		    .direction('s')
		    .offset(function() {
		        return [0,30];
		    })
		    .html((d)=> {
		        /* populate data in the following format
		         * tooltip_data = {
		         * "result":[
		         * {"nominee": D_Nominee_prop,"votecount": D_Votes_Total,"percentage": D_PopularPercentage,"party":"D"} ,
		         * {"nominee": R_Nominee_prop,"votecount": R_Votes_Total,"percentage": R_PopularPercentage,"party":"R"} ,
		         * {"nominee": I_Nominee_prop,"votecount": I_Votes_Total,"percentage": I_PopularPercentage,"party":"I"}
		         * ]
		         * }
		         * pass this as an argument to the tooltip_render function then,
		         * return the HTML content returned from that method.
		         * */
		         let result = [], i =0;
		         for(let iter of d.data)
		         {
		         	if(iter.votecount)
		         		result[i++] = (iter);
		         }

		         let tooltip_data = {
		         	"result": result
		         }

		        return _this.tooltip_render(tooltip_data);
		    });


		// ******* TODO: PART III *******

	    //Create the stacked bar chart.
	    //Use the global color scale to color code the rectangles.
	    //HINT: Use .votesPercentage class to style your bars.

		//Display the total percentage of votes won by each party
	    //on top of the corresponding groups of bars.
	    //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
	    // chooseClass to get a color based on the party wherever necessary

	    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
	    //HINT: Use .middlePoint class to style this bar.

	    //Just above this, display the text mentioning details about this mark on top of this bar
	    //HINT: Use .votesPercentageNote class to style this text element

	    //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
	    //then, vote percentage and number of votes won by each party.

	    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

	    let totalev = d3.sum(electionResult, d=>d.Total_EV);
		let scale = d3.scaleLinear()
                .domain([0, totalev])
                .range([_this.margin.left, _this.svgWidth - _this.margin.right]);

		let position = 0, count = 0, position_array = [0, 1/5*totalev];
	    let data = [{"id": "independent", "votes": electionResult[0].I_PopularPercentage},
	                {"id": "democrat", "votes": electionResult[0].D_PopularPercentage},
	                {"id": "republican", "votes": electionResult[0].R_PopularPercentage},
	                {"id": "midtext", "votes": "Popular Vote (50%)"}];

	    let textData = _this.svg.selectAll(".electoralVotesNote").data(data);
	    let newtext = textData.enter()
                                .append("text")
                                .attr("y", _this.svgHeight / 2 - 30);


	    textData.exit().remove();
	    textData = newtext.merge(textData);

	    textData.text(d=>{if(d.votes) return d.votes})
                .attr("x", function(d){
                    if(d.id == "midtext")
                        return scale(totalev/2)
                    let p = 0;
                    if(d.id == "independent" && d.votes)
                    	count = 1;
                    if(count == 1 && d.id == "democrat")
                    	p = 1 * totalev / 5;
                    if(d.id == "republican")
                        p = totalev;
                    return scale(p);

                })
                .attr("class", d=> "electoralVotesNote "+ d.id)
	            .attr("id", d=>d.id);


	    let tipData = [{"nominee": electionResult[0].I_Nominee_prop,"votecount": electionResult[0].I_Votes_Total,"percentage": electionResult[0].I_PopularPercentage,"party":"I"},
					   {"nominee": electionResult[0].D_Nominee_prop,"votecount": electionResult[0].D_Votes_Total,"percentage": electionResult[0].D_PopularPercentage,"party":"D"},
					   {"nominee": electionResult[0].R_Nominee_prop,"votecount": electionResult[0].R_Votes_Total,"percentage": electionResult[0].R_PopularPercentage,"party":"R"}]

	    data = [{"id": "independent", "votes": electionResult[0].I_PopularPercentage, "data": tipData},
                {"id": "democrat", "votes": electionResult[0].D_PopularPercentage, "data": tipData},
                {"id": "republican", "votes": electionResult[0].R_PopularPercentage, "data": tipData}];

	    let barsdata = _this.svg.selectAll("rect").data(data);
	    let bars = barsdata.enter().append("rect").attr("y", _this.svgHeight / 2 - 10).attr("height", 20)
						    .on("mouseover", tip.show)
					        .on("mouseout", tip.hide);

	    position = 0;

	    barsdata.exit().remove();
	    barsdata = bars.merge(barsdata);

	    barsdata.attr("x", function(d) {
            let p = position;
            position += parseInt(d.votes? d.votes.replace("%", "") : 0) * totalev / 100;
            return scale(p);

        })
        .call(tip)
        .attr("width", function(d) {let val =  scale(position) - scale(position - parseInt(d.votes? d.votes.replace("%", "") : 0) * totalev / 100) - 1; return val > 0 ? val : 0;})
        .attr("class", d=>_this.chooseClass(d.id.slice(0, 1).toUpperCase()))


	    let midrectdatum = _this.svg.selectAll(".middlePoint").data([0]);
	    let midrect = midrectdatum.enter()
	                                .append("rect")
	                                .attr("class", "middlePoint")
	                                .attr("id", "halfPercent");


	    midrectdatum.exit().remove();
	    midrectdatum = midrect.merge(midrectdatum);

	    midrectdatum.attr("x", d=>scale(totalev/2))
	                .attr("y", _this.svgHeight / 2 - 20)
	                .attr("height", 40)
	                .attr("width", 2);

	    data = [electionResult[0].I_Nominee_prop, electionResult[0].D_Nominee_prop, electionResult[0].R_Nominee_prop];

	    let nominee = _this.svg.selectAll(".votesPercentageText").data(data);
	    let nomineetext = nominee.enter()
	                                .append("text")
	                                .attr("y", _this.svgHeight / 2 - 60);


	    nominee.exit().remove();
	    nominee = nomineetext.merge(nominee);

	    let independentStatus = false;
	    let party = ["independent", "democrat", "republican"];
	    nominee.text(d=>{if(d) return d;})
                .attr("x", function(d, i){
                    let p = 0;
                    if(i == 0){
                    	if(d != " ")
	                    	independentStatus = true;
	                    else
	                    	independentStatus = false;
                    }

                    if(i == 1){
                    	if(independentStatus)
                    	p = 1/5 * totalev;
                    	else
                    		p = 0;
                    }
                    if(i == 2)
                    	p = totalev;
                    return scale(p);

                })
                .attr("class", function(d, i){ return "votesPercentageText "+party[i];});


	};


}