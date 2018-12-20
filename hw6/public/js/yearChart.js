class YearChart {

    /**
     * Constructor for the Year Chart
     *
     * @param electoralVoteChart instance of ElectoralVoteChart
     * @param tileChart instance of TileChart
     * @param votePercentageChart instance of Vote Percentage Chart
     * @param electionInfo instance of ElectionInfo
     * @param electionWinners data corresponding to the winning parties over mutiple election years
     */
    constructor (electoralVoteChart, tileChart, votePercentageChart, electionWinners, shiftChart, activeYear) {


        this.electoralVoteChart = electoralVoteChart;
        this.tileChart = tileChart;
        this.votePercentageChart = votePercentageChart;
        this.shiftChart = shiftChart;
        this.activeYear = activeYear;

        this.electionWinners = electionWinners;


        this.margin = {top: 10, right: 20, bottom: 30, left: 50};
        let divyearChart = d3.select("#year-chart").classed("fullView", true);


        this.svgBounds = divyearChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 100;


        this.svg = divyearChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
    };


    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (data) {
        if (data == "R") {
            return "yearChart republican";
        }
        else if (data == "D") {
            return "yearChart democrat";
        }
        else if (data == "I") {
            return "yearChart independent";
        }
    }

    /**
     * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
     */
    update (activeYear) {

        let that = this;
        this.activeYear = activeYear;
        let minyr = d3.min(that.electionWinners, function(d){ return d.YEAR;});
        let maxyr = d3.max(that.electionWinners, function(d){ return d.YEAR;});

        let yrScale = d3.scaleLinear()
                        .domain([minyr, maxyr])
                        .range([that.margin.left, that.svgWidth - that.margin.right]);

        //Domain definition for global color scale
        let domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];

        //Color range for global color scale
        let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#860308"];

        //Global colorScale be used consistently by all the charts
        this.colorScale = d3.scaleQuantile()
            .domain(domain)
            .range(range);

        // ******* TODO: PART I *******

        //Style the chart by adding a dashed line that connects all these years.
        //HINT: Use .lineChart to style this dashed line
        that.svg.append("line").attr("x1", 0)
                .attr("y1", that.svgHeight / 2)
                .attr("x2", that.svgWidth)
                .attr("y2", that.svgHeight / 2)
                .attr("class", "lineChart");

        // Create the chart by adding circle elements representing each election year
        //The circles should be colored based on the winning party for that year
        //HINT: Use the .yearChart class to style your circle elements
        //HINT: Use the chooseClass method to choose the color corresponding to the winning party.

        //Clicking on any specific year should highlight that circle and  update the rest of the visualizations
        //HINT: Use .highlighted class to style the highlighted circle

        //Election information corresponding to that year should be loaded and passed to
        // the update methods of other visualizations

        let yearData = that.svg.selectAll("circle").data(that.electionWinners);
        let circles  = yearData.enter().append("circle").attr("id", d=>d.YEAR);

        yearData.exit().remove();
        yearData = circles.merge(yearData);

        yearData.attr("cx", d=> yrScale(d.YEAR))
                .attr("cy", that.svgHeight / 2)
                .attr("r", that.svgHeight / 10)
                .attr("class", d=>that.chooseClass(d.PARTY))
                .on("click", function(d) {
                                deselectCircles();
                                let csv = "data/Year_Timeline_" + d.YEAR + ".csv";
                                d3.select(this).attr("r", that.svgHeight / 10 + 5).attr("id", "selected").classed("highlighted", true);
                                d3.csv(csv, function (error, electoralVoteChart) {
                                    that.electoralVoteChart.update(electoralVoteChart, that.colorScale);
                                    that.votePercentageChart.update(electoralVoteChart);
                                    that.tileChart.update(electoralVoteChart, that.colorScale);
                            });
                    });
        let deselectCircles = function() {
            let selectedCircles = that.svg.selectAll("#selected")
                                            .attr("r", that.svgHeight / 10 )
                                            .attr("id", function(f){ return f.YEAR;})
                                            .classed("highlighted", false);
        }


        //Append text information of each year right below the corresponding circle
        //HINT: Use .yeartext class to style your text elements
        let yearText = that.svg.selectAll("text").data(that.electionWinners);
        let text  = yearText.enter().append("text");

        yearText.exit().remove();
        yearText = text.merge(yearText);

        yearText.attr("x", d=> yrScale(d.YEAR) - 20)
                .attr("y", that.svgHeight / 2 + 30)
                .attr("class", "yearText")
                .text(d=>d.YEAR);



    //******* TODO: EXTRA CREDIT *******

    //Implement brush on the year chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.

    that.shiftChart.update("", "year");
    let brushed = function() {
        let selection = d3.event.selection, selectedStates = [], k = 0;
        //console.log(selection);
        if(selection){
            let states = that.svg.selectAll("circle").attr("cx", function(d){
                let cx = parseFloat(d3.select(this).attr("cx")), r = parseFloat(d3.select(this).attr("r"));
                if(cx - r - 5 >= selection[0] && cx - r - 5 < selection[1])
                {
                    if((cx + r + 5) <= selection[1])
                        selectedStates[k++] = d3.select(this).data()[0].YEAR;
                }
                return cx;
            });
        }
        that.shiftChart.update(selectedStates, "year");
    }
    let brush = d3.brushX().extent([[0, that.svgHeight / 2 + 15],[that.svgWidth, that.svgHeight / 2 + 35]]).on("end", brushed);
    that.svg.append("g").attr("class", "brush").call(brush);

    };

};