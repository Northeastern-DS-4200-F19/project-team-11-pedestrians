function tablevis(deets, stuff) {
    //Creating the table
	let table = d3.select('#tablevis')
		.append("table")
		.attr("class", "table table-condensed table-stripled"),
		thead = table.append("thead"),
		tbody = table.append("tbody");

		var columns = Math.round(stuff[d.properties.Name]);

		var header = thead.append("tr")
		.selectAll("th")
		.data(columns)
		.enter()
		.append("th")
		.text(function(d) {return d["properties"]["Name"]})


		let rows = tbody.selectAll("tr")
		.data(deet)
		.enter()
		.append("tr")
		// Highlighting table contents
		.on("mouseover", (d, i, elements) => {
   		  d3.select(elements[i]).classed("mouseover", true)
   		})
   		.on("mouseout", (d, i, elements) => {
          d3.select(elements[i]).classed("mouseover", false)
    	})
    	var cells = rows.selectAll("td")
    		.data(function(row){
    			return columns.map(function(d, i){
    				return {i: d, value: row[d]};
    			});
    		})
    		.enter()
    		.append("td")
    		.html(function(d){return d.value;});
    return table;
};
