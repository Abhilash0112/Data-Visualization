/** Class implementing the tileChart. */
class TileChart {

    /**
     * Initializes the svg elements required to lay the tiles
     * and to populate the legend.
     */
    constructor(activeYear){
         // Follow the constructor method in yearChart.js
        // assign class 'content' in style.css to tile chart
        this.activeYear = activeYear;
        let divTiles = d3.select("#tiles").classed("content", true);
        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        //Gets access to the div element created for this chart and legend element from HTML
        let svgBounds = divTiles.node().getBoundingClientRect();
        this.svgWidth = svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgWidth/2;
         // Legend
        let legendHeight = 150;
        //add the svg to the div
        let legend = d3.select("#legend").classed("content",true);

        //creates svg elements within the div
        this.legendSvg = legend.append("svg")
                            .attr("width",this.svgWidth)
                            .attr("height",legendHeight)
                            .attr("transform", "translate(" + this.margin.left + ",0)")
                            .style("bgcolor","green")
        this.svg = divTiles.append("svg")
                            .attr("width",this.svgWidth)
                            .attr("height",this.svgHeight)
                            .attr("transform", "translate(" + this.margin.left + ",0)")
                            .style("bgcolor","green")
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
        else if (party== "D"){
            return "democrat";
        }
        else if (party == "I"){
            return "independent";
        }
    }

    /**
     * Renders the HTML content for tool tip.
     *
     * @param tooltip_data information that needs to be populated in the tool tip
     * @return text HTML content for tool tip
     */
    tooltip_render(tooltip_data) {
        let text = "<h2 class ="  + this.chooseClass(tooltip_data.winner) + " >" + tooltip_data.state + "</h2>";
        text +=  "Electoral Votes: " + tooltip_data.electoralVotes;
        text += "<ul>"
        tooltip_data.result.forEach((row)=>{
            //text += "<li>" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
            text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
        });
        text += "</ul>";

        return text;
    }

    /**
     * Creates tiles and tool tip for each state, legend for encoding the color scale information.
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */
    update (electionResult, colorScale, activeYear){
        let _this = this;
        this.activeYear = activeYear;

        this.maxColumns = d3.max(electionResult,function(d){
                                return parseInt(d["Space"]);
                            });


        this.maxRows = d3.max(electionResult,function(d){
                                return parseInt(d["Row"]);
                        });


        this.legendSvg.append("g")
            .attr("class", "legendQuantile")
            .attr("transform", "translate(50,50)")
            .style("font-size","10px");

        let legendQuantile = d3.legendColor()
            //.labelFormat(d3.format(".0f"))
            .shapeHeight(10)
            .shapeWidth(_this.svgWidth / 15)
            .cells(10)
            .orient('horizontal')
            .scale(colorScale);

        this.legendSvg.select(".legendQuantile")
            .call(legendQuantile);

        //for reference:https://github.com/Caged/d3-tip
        //Use this tool tip element to handle any hover over the chart
        let tip = d3.tip().attr('class', 'd3-tip')
            .direction('se')
            .offset(function() {
                return [0,0];
            })
            .html((d)=>{
                /* populate data in the following format
                 * tooltip_data = {
                 * "state": State,
                 * "winner":d.State_Winner
                 * "electoralVotes" : Total_EV
                 * "result":[
                 * {"nominee": D_Nominee_prop,"votecount": D_Votes,"percentage": D_Percentage,"party":"D"} ,
                 * {"nominee": R_Nominee_prop,"votecount": R_Votes,"percentage": R_Percentage,"party":"R"} ,
                 * {"nominee": I_Nominee_prop,"votecount": I_Votes,"percentage": I_Percentage,"party":"I"}
                 * ]
                 * }
                 * pass this as an argument to the tooltip_render function then,
                 * return the HTML content returned from that method.
                 * */
                let tooltip_data = {
                    "state": d.State,
                    "winner": d.State_Winner,
                    "electoralVotes": d.Total_EV,
                    "result": [
                        {"nominee": d.D_Nominee_prop,"votecount": d.D_Votes,"percentage": d.D_Percentage,"party":"D"} ,
                        {"nominee": d.R_Nominee_prop,"votecount": d.R_Votes,"percentage": d.R_Percentage,"party":"R"}
                    ]
                }
                if(d.I_Votes)
                    tooltip_data.result[2] = {"nominee": d.I_Nominee_prop,"votecount": d.I_Votes,"percentage": d.I_Percentage,"party":"I"};
                return _this.tooltip_render(tooltip_data);
            });


            // ******* TODO: PART IV *******
        // Transform the legend element to appear in the center
        // make a call to this element for it to display.

        // Lay rectangles corresponding to each state according to the 'row' and 'column' information in the data.
        // column is coded as 'Space' in the data.

        // Display the state abbreviation and number of electoral votes on each of these rectangles

        // Use global color scale to color code the tiles.

        // HINT: Use .tile class to style your tiles;
        // .tilestext to style the text corresponding to tiles

        //Call the tool tip on hover over the tiles to display stateName, count of electoral votes
        //then, vote percentage and number of votes won by each party.
        //HINT: Use the .republican, .democrat and .independent classes to style your elements.
        //Creates a legend element and assigns a scale that needs to be visualized

            let widthTile = this.svgWidth / (this.maxColumns + 1);
            let heightTile = this.svgHeight / (this.maxRows + 1);

            let tiles = _this.svg.selectAll(".tile").data(electionResult);
            let tileStates = tiles.enter()
                                    .append("rect")
                                    .attr("width", widthTile)
                                    .attr("height", heightTile)
                                    .attr("class", "tile")
                                    .on("mouseover", tip.show)
                                    .on("mouseout", tip.hide);

            tiles.exit().remove();
            tiles = tileStates.merge(tiles);

            tiles.attr("x", d=>d.Space * widthTile)
                    .attr("y", d=>d.Row * heightTile)
                    .attr("class", function(d){
                            return "tile "+_this.chooseClass(d.State_Winner);
                        })
                    .attr("style", function(d){ if(d.State_Winner != "I") return "fill: "+colorScale(d["RD_Difference (bin)"]);})
                    .call(tip);


            let text = _this.svg.selectAll(".tilestext.name").data(electionResult);
            let States = text.enter()
                                .append("text")
                                .attr("class", "tilestext name");


            text.exit().remove();
            text = States.merge(text);

            text.attr("x", d=>d.Space * widthTile + widthTile / 2)
                .attr("y", d=>d.Row * heightTile + heightTile / 2)
                .text(d=>d.Abbreviation);


            text = _this.svg.selectAll(".tilestext.ev").data(electionResult);
            let statesEV = text.enter()
                                .append("text")
                                .attr("class", "tilestext ev");

            text.exit().remove();
            text = statesEV.merge(text);

            text.attr("x", d=>d.Space * widthTile + widthTile / 2)
                .attr("y", d=>d.Row * heightTile + heightTile / 2 + 20)
                .text(d=>d.Total_EV);
    };


}