/** Class representing a Tree. */
class Tree {
	/**
	 * Creates a Tree Object
	 * parentNode, children, parentName,level,position
	 * @param {json[]} json - array of json object with name and parent fields
	 */
	constructor(json) {
	    this.objects = json;
        this.nt = new Array();
        this.pos = new Array();
        this.nt["root"] = new Node("root", undefined);
        for(var jsonitr of this.objects){
            this.nt[jsonitr.name] = new Node(jsonitr.name, jsonitr.parent);
        }
	}

	/**
	 * Function that builds a tree from a list of nodes with parent refs
	 */
	buildTree() {
	    let levels = 0;
        for(var a in this.nt){
            if(a ==="root"){
                this.parentNode = this.nt[a];
                continue;
            }
            let b = this.nt[a].parentName;
            this.nt[a].parentNode = this.nt[b];
            this.nt[b].addChild(this.nt[a]);
        }
        this.assignLevel(this.nt["root"].children[levels],levels);
        this.assignPosition(this.nt["root"].children[levels],levels);
	//Assigning Positions and Levels
	}
	assignLevel(node, lev)
	{
        node.level = lev;
        for(var childlevel of node.children)
        {
            this.assignLevel(childlevel, lev+1);
        }
    /**
	 * Recursive function that assign levels to each node
	 */
	}
	/**
	 * Recursive function that assign positions to each node
	 */
	 maxval(x, y) {
	    if(x>y)
	    {
	    return x;
	    }
	    else
	    {
	    return y;
	    }
	}

	assignPosition(node, position) {
        /**node.position = position;
        for(let e of node.children){
            this.assignPosition(e, position+1);
        }**/
        this.pos[node.level] = this.maxval(this.pos[node.level], position);
		node.position = this.pos[node.level];
        if(this.pos[node.level] === undefined)
			this.pos[node.level] = 0;
		for(var childpos of node.children)
			this.assignPosition(childpos, this.pos[node.level]);
		this.pos[node.level] = this.pos[node.level]+1;

	}

	/**
	 * Function that renders the tree
	 */
	renderTree() {
        var i = 0;
		let treebody = d3.select("body");
		treebody.append("svg").attr("width", 1000).attr("height", 800);
		let dataArr = new Array();
		for(var j in this.nt){
			if(j != "root")
			    dataArr[i++] = [this.nt[j].level, this.nt[j].position, this.nt[j].name, this.nt[j].parentNode];
		    }
		let svg = d3.select("svg");
		svg.selectAll("line")
			.data(dataArr)
			.enter().append("line")
			.attr("x1", function(display){
			                return display[0] * 150 + 100;
			            })
			.attr("y1", function(display){
			                return display[1] * 100 + 120;
			                })
			.attr("x2", function(display){
			                if(display[3].name == "root") return display[0] * 150 + 75; return display[3].level * 150 + 80;
			                })
			.attr("y2", function(display){
			                if(display[3].name == "root") return display[1] * 100 + 100; return display[3].position * 100 + 120;
			                });

		svg.selectAll("g")
			.data(dataArr)
			.enter().append("g").append("circle")
			.attr("cx", function(display){
			                return display[0] * 150 + 100;
			                })
			.attr("cy", function(display){
			                return display[1] * 100 + 120;
			                })
			.attr("r", 35)
			.style("fill", "steelblue");

		svg.selectAll("g")
			.data(dataArr)
			.append("g").append("text")
			.text(function(display){
			    return display[2];
			    })
			.attr("x", function(display){
			                return display[0] * 150 + 75;
			                })
			.attr("y", function(display){
			                return display[1] * 100 + 125;
			                })
			.style("fill", "white");
	}


}


