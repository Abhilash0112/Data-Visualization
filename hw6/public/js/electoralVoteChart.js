class ElectoralVoteChart {
    /**
     * Constructor for the ElectoralVoteChart
     *
     * @param trendChart an instance of the ShiftChart class
     */
    constructor (trendChart, activeYear){

        // Follow the constructor method in yearChart.js
        // assign class 'content' in style.css to electoral-vote chart
        this.trendChart = trendChart;
        this.activeYear = activeYear;

        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        let divelectoralVotes = d3.select("#electoral-vote").classed("content", true);


        this.svgBounds = divelectoralVotes.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 150;


        this.svg = divelectoralVotes.append("svg")
            .attr("width",this.svgWidth)
            .attr("height",this.svgHeight)

    };

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (party) {
        if (party == "R"){
            return "republican";
        }
        else if (party == "D"){
            return "democrat";
        }
        else if (party == "I"){
            return "independent";
        }
    }


    /**
     * Creates the stacked bar chart, text content and tool tips for electoral vote chart
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */


   update (electionResult, colorScale, activeYear){

    let _this = this;
    this.activeYear = activeYear;
    let totalev = d3.sum(electionResult, d=>d.Total_EV);
    let scale = d3.scaleLinear()
                    .domain([0, totalev])
                    .range([_this.margin.left, _this.svgWidth - _this.margin.right]);

          //console.log(electionResult)
    // ******* TODO: PART II *******
       // Group the states based on the winning party for the state;
       // then sort them based on the margin of victory

       // Create the stacked bar chart.
       // Use the global color scale to color code the rectangles for Democrates and Republican.
       // Use #089c43 to color Independent party.
       // HINT: Use .electoralVotes class to style your bars.

       // Display total count of electoral votes won by the Democrat, Republican and Independent party(if there's candidate).
       // on top of the corresponding groups of bars.
       // HINT: Use the .electoralVoteText class to style your text elements; Use this in combination with
       // Use chooseClass method to get a color based on the party wherever necessary

       // Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
       // HINT: Use .middlePoint class to style this bar.

       // Just above this, display the text mentioning the total number of electoral votes required
       // to win the elections throughout the country
       // HINT: Use .electoralVotesNote class to style this text element
       // HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    electionResult.sort(function(x, y){
        if(x["State_Winner"] == "I") return -10000;
        if(y["State_Winner"] == "I") return 10000;
        else if(parseInt(x["RD_Difference (bin)"]) == parseInt(y["RD_Difference (bin)"]))
            return d3.ascending(parseFloat(x["RD_Difference"]), parseFloat(y["RD_Difference"]));
        else
            return d3.ascending(parseInt(x["RD_Difference (bin)"]), parseInt(y["RD_Difference (bin)"]));
    });

    let k = 0;
    let rectData = _this.svg.selectAll("rect").data(electionResult);
    let rect  = rectData.enter().append("rect").attr("id", d=>d.Abbreviation);

    rectData.exit().remove();
    rectData = rect.merge(rectData);

    rectData.attr("x", function(d){let p = k; k+= parseInt(d.Total_EV); return scale(p);})
            .attr("y", _this.svgHeight / 2 - 10)
            .attr("height", 20)
            .attr("width", function(d) {return scale(k) - scale(k - parseInt(d.Total_EV)) - 1;})
            .attr("class", d=>_this.chooseClass(d["State_Winner"]))
            .attr("style", function(d){ if(d["State_Winner"] != "I") return "fill: "+colorScale(parseInt(d["RD_Difference (bin)"]));});





    let position = 0;
    let data = [{"id": "independent", "votes": d3.sum(electionResult, function(d){ if(d.State_Winner == "I") return d.Total_EV;})},
                {"id": "democrat", "votes": d3.sum(electionResult, function(d){ if(d.State_Winner == "D") return d.Total_EV;})},
                {"id": "republican", "votes": d3.sum(electionResult, function(d){ if(d.State_Winner == "R") return d.Total_EV;})},
                {"id": "midtext", "votes": "Electoral Vote (270 needed to win)"}];

    let textData = _this.svg.selectAll(".electoralVotesNote").data(data);
    let newtext = textData.enter()
                                .append("text")
                                .attr("y", _this.svgHeight / 2 - 30);


    textData.exit().remove();
    textData = newtext.merge(textData);

    textData.text(d=>{if(d.votes != 0) return d.votes})
                    .attr("x", function(d){
                        if(d.id == "midtext")
                            return scale(totalev/2)
                        let p = position;
                        position += parseInt(d.votes);
                        if(d.id == "republican")
                            p = position;
                        return scale(p);

                    })
                    .attr("class", d=> "electoralVotesNote "+ d.id)
                    .attr("id", d=>d.id);




    let midrectdatum = _this.svg.selectAll(".middlePoint").data([0]);
    let midrect = midrectdatum.enter()
                                .append("rect")
                                .attr("class", "middlePoint")
                                .attr("id", "half");


    midrectdatum.exit().remove();
    midrectdatum = midrect.merge(midrectdatum);

    midrectdatum.attr("x", d=>scale(totalev/2))
                .attr("y", _this.svgHeight / 2 - 20)
                .attr("height", 40)
                .attr("width", 2);


    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.
    _this.trendChart.update("", "ev");
    let brushed = function() {
        let selection = d3.event.selection, selectedStates = [], k = 0;
        //console.log(selection);
        if(selection) {
            let states = _this.svg.selectAll("rect").attr("x", function(d){
                let x = parseFloat(d3.select(this).attr("x")), width = parseFloat(d3.select(this).attr("width"));
                if(x >= selection[0] && x < selection[1])
                {
                    if((x + width) <= selection[1])
                        selectedStates[k++] = d3.select(this).data()[0];
                }
                return x;
            });
        }
        _this.trendChart.update(selectedStates, "ev");
    }
    let brush = d3.brushX().extent([[scale(0), _this.svgHeight / 2 - 15],[scale(totalev), _this.svgHeight / 2 + 15]]).on("end", brushed);
    _this.svg.append("g").attr("class", "brush").call(brush);

    };
}