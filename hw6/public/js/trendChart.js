/** Class implementing the trendChart. */
class TrendChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(electionWinners, allData, activeYear){
        this.divShiftChart = d3.select("#shiftChart").classed("sideBar", true);
        this.electionWinners = electionWinners;
        this.activeYear = activeYear;

        this.allData = allData;

        this.margin = {top: 30, right: 10, bottom: 30, left: 65};
        this.divvotesPercentage = d3.select("#line").attr("style", "width: 100%");


        this.svgBounds = this.divvotesPercentage.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width;
        this.svgHeight = 200;

    };

    chartViz(_this, statesSelection, yrSelection = [1996, 2000, 2004, 2008, 2012]) {

        let dataSvgWidth = _this.svgWidth - _this.margin.left - _this.margin.right;
        let states = [], years = [], i=0;
        for(let iter of statesSelection)
        {
            if(iter.State)
                states[i++] = iter.State;
        }
        i = 0;
        for(let iter of yrSelection)
        {
            if(iter)
                years[i++] = iter;
        }

        let minyr = d3.min(yrSelection, d=>d);
        let maxyr = d3.max(yrSelection, d=>d);

        let xScale = d3.scaleBand()
                        .domain(years)
                        .range([7, dataSvgWidth]);

        let yScale = d3.scaleLinear()
                        .domain([-55, 55])
                        .range([_this.svgHeight-_this.margin.bottom, _this.margin.top]);

        let xAxisScale = d3.scaleBand()
                            .domain(years)
                            .range([2,dataSvgWidth-10]);

        let yAxisScale = d3.scaleBand()
            .domain(["Democrat", "Independent", "Republican"])
            .range([_this.svgHeight - _this.margin.bottom, _this.margin.top]);

        let axisx = d3.axisBottom().scale(xAxisScale);

        let axisy = d3.axisLeft().scale(yAxisScale);

        let aLineGenerator = d3.line()
                                .x((d) => xScale(d.YEAR))
                                .y((d) => {
                                    if(d.data.Direction == "Right")
                                        return yScale(parseFloat(d.data["Shift"]));
                                    else if(d.data.Direction == "Left")
                                        return yScale(-1 * parseFloat(d.data["Shift"]));
                                    else
                                        return yScale(0);
                                });

        let visData = [];
        let copyAllData = _this.allData.slice(0, _this.allData.length);
        //console.log(copyAllData)
        i = 0;
        for(let iter of statesSelection){
            if(iter.State){
                let array = [], j = 0;
                for(let yriter of yrSelection)
                {
                    let selectedyear = [];
                    for(let k of copyAllData)
                    {
                        if(parseInt(k.YEAR) == yriter)
                        {
                            selectedyear = k.data;
                            break;
                        }
                    }

                    for(let k of selectedyear)
                    {
                        if(k.State == iter.State){
                            array[j++] = {"YEAR": yriter, "data": k};
                            break;
                        }
                    }
                }
                visData[i++] = {"State": iter.State, "data": array};
            }
        }

        console.log(visData);

        let svg = _this.divvotesPercentage.selectAll("svg").data(visData);

        let newSvg = svg.enter().append("svg")
                        .attr("width", _this.svgWidth)
                        .attr("height", _this.svgHeight);

        svg.exit().remove();
        svg = newSvg.merge(svg);

        svg.attr("id", d=>d.State);


        let text = svg.selectAll("text.name").data(function(d){return d3.select(this).data();})
        let newText = text.enter().append("text").attr("class", "name");

        text.exit().remove();
        text = newText.merge(text);

        text.text(d=>"State: "+d.State)
            .attr("x", d=>_this.svgWidth / 2 - _this.margin.left)
            .attr("y", d=>_this.margin.top);


        let xAxis = svg.selectAll("g.xAxis").data([0]);
        let newxAxis = xAxis.enter().append("g")
                        .attr("class", "xAxis");

        xAxis.exit().remove();
        xAxis = newxAxis.merge(xAxis);

        xAxis.attr("transform", "translate("+ _this.margin.left +","+ (_this.svgHeight - _this.margin.bottom) + ")")
                .call(axisx)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.9em")
                .attr("dy", "-.5em")
                .attr("transform", "rotate(-90)");


        let yAxis = svg.selectAll("g.yAxis").data(function(d){return d3.select(this).data();});
        let newyAxis = yAxis.enter().append("g")
                        .attr("class", "yAxis");

        yAxis.exit().remove();
        yAxis = newyAxis.merge(yAxis);

        yAxis.attr("transform", "translate("+ _this.margin.left +", 0)")
                .call(axisy)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "+.3em")
                //.attr("dy", "-1em")
                //.attr("transform", "rotate(-90)");


        let data = svg.selectAll("g.data").data(function(d){return d3.select(this).data();});
        let newdata = data.enter().append("g")
                        .attr("class", "data")
                        .attr("width", dataSvgWidth);

        data.exit().remove();
        data = newdata.merge(data);

        data.attr("transform", "translate("+ _this.margin.left +", 5)");

        let centerline = data.selectAll("#centerline").data(function(d){
            return d3.select(this).data();
        });

        let newCenterline = centerline.enter().append("line")
                                        .attr("id", "centerline");

        centerline.exit().remove();
        centerline = newCenterline.merge(centerline);

        centerline
            .attr("x1", 0)
            .attr("y1", _this.svgHeight/2)
            .attr("x2", dataSvgWidth)
            .attr("y2", _this.svgHeight/2)
            .attr("stroke", "grey")
            .attr("stroke-width", 1)
            .attr("fill", "none")
            .attr("style", "opacity: 0.3");

        let line = data.selectAll("path").data(function(d){
            return d3.select(this).data();
        });
        let newline = line.enter().append("path");

        line.exit().remove();
        line = newline.merge(line);

        line.style("opacity", 1)
            .attr("d", d=>aLineGenerator(d.data))
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1)
            .attr("fill", "none")
            .attr("transform", "translate(30, 0)");

    }
    /**
     * Creates a list of states that have been selected by brushing over the Electoral Vote Chart
     *
     * @param selectedStates data corresponding to the states selected on brush
     */
    update(selectedStates, dataType, activeYear){

        let _this = this;
        this.activeYear = activeYear;

        // ******* TODO: PART V *******
        //Display the names of selected states in a list

        //******** TODO: PART VI*******
        //Use the shift data corresponding to the selected years and sketch a visualization
        //that encodes the shift information

        //******** TODO: EXTRA CREDIT I*******
        //Handle brush selection on the year chart and sketch a visualization
        //that encodes the shift informatiomation for all the states on selected years

        //******** TODO: EXTRA CREDIT II*******
        //Create a visualization to visualize the shift data
        //Update the visualization on brush events over the Year chart and Electoral Vote Chart
        console.log(selectedStates);
        let text = "";
        let span = d3.select("#stateList");

        let yrSelection;
        let statesSelection;


        if(dataType == "year")
        {
            if(selectedStates == ""){
                _this.yearText = "", _this.yearSelection = "";
                if(_this.evText == ""){
                 _this.statesSelection = "";
                }
                else{
                    _this.yearSelection = "";
                    if(_this.statesSelection)
                    _this.chartViz(_this, _this.statesSelection);
                }
            }
            else {
                _this.yearSelection = selectedStates;
                text += "<ul>";
                selectedStates.forEach((row)=>{
                    if(row)
                        text += "<li>" + row + "</li>";
                });
                text += "</ul>";
                _this.yearText = text;

                yrSelection = _this.yearSelection;
                if(_this.evText) {
                    if(yrSelection)
                        _this.chartViz(_this, _this.statesSelection, yrSelection);
                    else
                        _this.chartViz(_this, _this.statesSelection);
                }
            }
        }
        else if(dataType == "ev")
        {
            if(selectedStates == "")
                _this.evText = "", _this.selectedStates = "";
            else {
                _this.statesSelection = selectedStates;
                text += "<ul>"
                selectedStates.forEach((row)=>{
                   if(row.State)
                        text += "<li>" + row.State + "</li>"
                });
                text += "</ul>";
                _this.evText = text;
                yrSelection = _this.yearSelection;
                statesSelection = _this.statesSelection;
                if(yrSelection)
                    _this.chartViz(_this, _this.statesSelection, yrSelection);
                else
                    _this.chartViz(_this, _this.statesSelection);

            }
        }

        yrSelection = _this.yearText ? _this.yearText : "";
        statesSelection = _this.evText ? _this.evText : "";
        span.html(yrSelection + statesSelection);


    };


}