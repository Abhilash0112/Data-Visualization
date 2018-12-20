/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */
function staircase() {
    // ****** TODO: PART II ******
    //alert("first test");
    let bar1 = document.getElementById("aBarChart");
    let bar1width = new Array();
    //console.log(bar1);
    let i =0;
    for(let j of bar1.children)
        bar1width[i++] = j.attributes.width.nodeValue;

    bar1width.sort(function(a, b) {
        return parseInt(a) - parseInt(b);
    });

    //console.log(bar1width);

    i = 0;
    for(let j of bar1.children) {
        j.attributes.width.nodeValue = bar1width[i++];
    }
}

/**
 * Render the visualizations
 * @param data
 */
function update(data) {
    /**
     * D3 loads all CSV data as strings. While Javascript is pretty smart
     * about interpreting strings as numbers when you do things like
     * multiplication, it will still treat them as strings where it makes
     * sense (e.g. adding strings will concatenate them, not add the values
     * together, or comparing strings will do string comparison, not numeric
     * comparison).
     *
     * We need to explicitly convert values to numbers so that comparisons work
     * when we call d3.max()
     **/

    for (let d of data) {
        d.a = +d.a; //unary operator converts string to number
        d.b = +d.b; //unary operator converts string to number
    }

    // Set up the scales
    let aScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.a)])
        .range([0, 140]);
    let bScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.b)])
        .range([0, 140]);
    let iScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([10, 120]);


    // ****** TODO: PART III (you will also edit in PART V) ******

    // TODO: Select and update the 'a' bar chart bars
    let bar1 = d3.select("#aBarChart");
    let bargraph1 = bar1.selectAll("rect").data(data);
    //console.log(bargraph1);
    bargraph1.enter()
        .append("rect")
        .attr("y", (d, i) => iScale(i))
        .attr("x", 0)
        .attr("height", 10)
        .attr("width", 0)
        .style("opacity", 0)
        .transition()
        .duration(3000)
        .style("opacity", 1)
        .attr("width", d => aScale(d.a))
        .style("fill", "steelblue");
    bargraph1.exit()
        .attr("width", d => aScale(d.a))
        .transition()
        .duration(500)
        .attr("width", 0)
        .remove();
    bargraph1 = bargraph1.merge(bargraph1);
    bargraph1
        .on("mouseover", function(){d3.select(this).style("fill", "orange")})
        .on("mouseout", function(){d3.select(this).style("fill", "steelblue")})
        .transition()
        .duration(3000)
        .attr("y", (d,i) => iScale(i))
        .attr("x", 0)
        .attr("width", d => aScale(d.a))
        .attr("height", 10)
        .attr("fill", "steelblue")
        .style("opacity", 1);

    let bar2 = d3.select("#bBarChart");
    let bargraph2 = bar2.selectAll("rect").data(data);
    //console.log(bargraph2);
    bargraph2.enter()
        .append("rect")
        .attr("y", (d, i) => iScale(i))
        .attr("x", 0)
        .attr("height", 10)
        .attr("width", 0)
        .style("opacity", 0)
        .transition()
        .duration(3000)
        .style("opacity", 1)
        .attr("width", d => bScale(d.b))
        .style("fill", "steelblue");
    bargraph2.exit()
        .attr("width", d => bScale(d.b))
        .transition()
        .duration(3000)
        .attr("width", 0)
        .remove();
    bargraph2 = bargraph2.merge(bargraph2);
    bargraph2
        .on("mouseover", function(){d3.select(this).style("fill", "red")})
        .on("mouseout", function(){d3.select(this).style("fill", "steelblue")})
        .transition()
        .duration(3000)
        .attr("y", (d,i) => iScale(i))
        .attr("x", 0)
        .attr("width", d => bScale(d.b))
        .attr("height", 10)
        .attr("fill", "steelblue")
        .style("opacity", 1);

    // TODO: Select and update the 'a' line chart path using this line generator
    let aLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y((d) => aScale(d.a));
    let line1 = d3.select("#aLineChart");
    let linechart1 = line1.select("path").data(data)
                        .style("opacity", 0)
                        .transition()
                        .duration(3000)
                        .attr("d", aLineGenerator(data))
                        .style("opacity", 1)
                        .attr("stroke", "steelblue")
                        .attr("stroke-width", 1)
                        .attr("fill", "none");

    // TODO: Select and update the 'b' line chart path (create your own generator)
    let bLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y((d) => bScale(d.b));
    let line2 = d3.select("#bLineChart");
    let linechart2 = line2.select("path").data(data)
                        .style("opacity", 0)
                        .transition()
                        .duration(3000)
                        .attr("d", bLineGenerator(data))
                        .style("opacity", 1)
                        .attr("stroke", "steelblue")
                        .attr("stroke-width", 1)
                        .attr("fill", "none");


    // TODO: Select and update the 'a' area chart path using this area generator
    let aAreaGenerator = d3.area()
        .x((d, i) => iScale(i))
        .y0(0)
        .y1(d => aScale(d.a));
    let area1 = d3.select("#aAreaChart");
    let areagraph1 = area1.select("path").data(data)
                        .style("opacity", 0)
                        .transition()
                        .duration(3000)
                        .style("opacity", 1)
                        .attr("d", aAreaGenerator(data))
                        .attr("stroke", "steelblue")
                        .attr("stroke-width", 1)
                        .attr("fill", "steelblue");

    // TODO: Select and update the 'b' area chart path (create your own generator)
    let bAreaGenerator = d3.area()
        .x((d,i) => iScale(i))
        .y0(0)
        .y1(d => bScale(d.b));
    let area2 = d3.select("#bAreaChart");
    let areagraph2 = area2.select("path").data(data)
                        .style("opacity", 0)
                        .transition()
                        .duration(3000)
                        .style("opacity", 1)
                        .attr("d", bAreaGenerator(data))
                        .attr("stroke", "steelblue")
                        .attr("stroke-width", 1)
                        .attr("fill", "steelblue");
    // TODO: Select and update the scatterplot points
    let scatter = d3.select("#scatterplot");
    let scatterplot = scatter.selectAll("circle").data(data);

    scatterplot.enter()
        .append("circle")
        .attr("cx", d => aScale(d.a))
        .attr("cy", d => bScale(d.b))
		.attr("opacity", 0)
		.transition()
		.duration(5000)
		.attr("opacity", 1)
        .attr("r", 5)
        .style("fill", "steelblue");


    scatterplot.exit()
        .attr("opacity", 1)
        .transition()
        .duration(5000)
        .attr("opacity", 0)
        .remove();

    scatterplot = scatterplot.merge(scatterplot);

    scatterplot
        .transition()
        .duration(5000)
        .attr("cx", d => aScale(d.a))
        .attr("cy", d => bScale(d.b))
        .attr("r", 5)
        .style("fill", "steelblue");
    scatterplot.on("click", function() {
        let coords = d3.mouse(this);
        let display = "x: "+coords[0]+", y: "+coords[1];
        console.log(display);
    });
}

/**
 * Update the data according to document settings
 */
async function changeData() {
    //  Load the file indicated by the select menu
    let dataFile = document.getElementById('dataset').value;
    try{
        const data = await d3.csv('data/' + dataFile + '.csv');
        if (document.getElementById('random').checked) { // if random
            update(randomSubset(data));                  // update w/ random subset of data
            alert("test2");
        } else {                                         // else
            update(data);                                // update w/ full data
            alert("test");
        }
    } catch (error) {
        alert('Could not load the dataset!');
    }
}

/**
 *  Slice out a random chunk of the provided in data
 *  @param data
 */
function randomSubset(data) {
    return data.filter( d => (Math.random() > 0.5));
}
