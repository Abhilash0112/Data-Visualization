/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {
        
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createTree(treeData) {
        this.treeData = treeData;
        // ******* TODO: PART VI *******
        let height = 800, width = 300;
        let svg = d3.select("#tree");


        //Create a tree and give it a size() of 800 by 300.
        let treemap = d3.tree().size([height, width]);
        let diagonal =  function(s, d) {

            let path = `M ${s.y} ${s.x}
                    C ${(s.y + d.y) / 2} ${s.x},
                      ${(s.y + d.y) / 2} ${d.x},
                      ${d.y} ${d.x}`;

            return path;
        }



        //Create a root for the tree using d3.stratify();
        let root = d3.stratify()
                     .id(function(d, i) { return i; })
                     .parentId(function(d) { return d.ParentGame; })
                     (treeData);
        update(root);

        function update(source) {

            let treeData = treemap(root);
            let nodes = treeData.descendants(),
                links = treeData.descendants().slice(1);
            nodes.forEach(function(d) { d.y = d.depth * 80 + 78; });
            let node = svg.selectAll("g.node")
                            .data(nodes, function(d) { return d.id; });
            let nodeEnter = node.enter().append("g")
                                .attr("class", function(d){
                                    //console.log(d);
                                    if(d.data.Wins == 1)
                                        return "winner";
                                    return "node";
                                })
                                .attr("transform", function(d) {
                                        return "translate(" + d.y + "," + d.x + ")";
                                    });

            nodeEnter.append("circle")
                        .attr("r", 7);

            nodeEnter.append("text")
                       .attr("x", function(d) {
                                return d.children ? -13 : 13; })
                       .attr("dy", ".35em")
                       .attr("id", function(d){return "node"+d.data.id.slice().replace(/[a-z]/gi, '');})
                       .attr("text-anchor", function(d) {
                                return d.children ? "end" : "start"; })
                       .text(function(d) { return d.data.Team; })
                       .style("fill-opacity", 1);

            let link = svg.selectAll("path.link")
                            .data(links, function(d) { return d.id; });
            link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("id", function(d){return d.data.id.slice().replace(/[^a-z]/gi, '');})
                .attr("d", d=>diagonal(d, d.parent))
                .attr("class", "link");
        //Add nodes and links to the tree. 
        }
    }

    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(row) {
        // ******* TODO: PART VII *******
        let selected = row.key;
        if(row.value.type == "aggregate")
        for(let iter of this.treeData)
        {
            if(iter.Team == selected)
                if(iter.Wins == 1)
                {
                    //console.log(iter);
                    let id = "#"+selected+""+ iter.Opponent;
                    d3.select("#tree").select(id).classed("selected", true);
                    d3.select("#tree").select("#node"+iter.ParentGame).classed("selectedLabel", true);
                    d3.select("#tree").select("#node"+iter.id.replace(/[a-z]/gi, '')).classed("selectedLabel", true);
                }
        }
        else
        {
            console.log(row);
            selected = selected.slice(1, selected.length);
            for(let iter of this.treeData)
            {
                if(iter.Team == selected && iter.Opponent == row.value.Opponent)
                {
                    //console.log(iter);
                    let id = "#"+selected+""+ iter.Opponent;
                    d3.select("#tree").select(id).classed("selected", true);
                    d3.select("#tree").select("#node"+iter.id.replace(/[a-z]/gi, '')).classed("selectedLabel", true);
                }
                if(iter.Opponent == selected && iter.Team == row.value.Opponent)
                {
                    //console.log(iter);
                    let id = "#"+iter.Team+""+ iter.Opponent;
                    d3.select("#tree").select(id).classed("selected", true);
                    d3.select("#tree").select("#node"+iter.id.replace(/[a-z]/gi, '')).classed("selectedLabel", true);
                }
            }
        }
    
    }

    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        // ******* TODO: PART VII *******

        // You only need two lines of code for this! No loops!
        d3.selectAll(".selected").classed("selected", false).classed("link", true);
        d3.selectAll(".selectedLabel").classed("selectedLabel", false);
    }
}