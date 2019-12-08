function tablevis(deets,cs, neigh) {
	
	var stuff = d3.nest()
                .key(function(d) { return d.neighborhood; })
                .rollup(function(v) { if(state.view == "real_estate") {
                  return d3.mean(v, function(d) { return d.value;})
                } else {return d3.sum(v, function(d) { return d.value; });}})
                .entries(deets)
                .sort((a,b) => { return d3.ascending(parseInt(a.key), parseInt(b.key))});

    var cs_total = d3.sum(cs, function(d) {return d});
    var values = stuff.map(s => s.value);
    var total = Math.round(d3.sum(values, function(d) {return d}));


    if (cs_total == 0) {
    	cs_total = "Data not available";
    }
    //Creating the table
	let table = d3.select('.table')
		thead = d3.select("#heading");
		tbody = d3.select("#table_body");

var metric = "";

if(state["view"] == "crime"){
    metric = "Crime Reports By Hour";
  } else if (state["view"] == "real_estate") {
    metric = "Real Estate Prices over Time (in $)";
  } else if (state["view"] == "demographic") {
    metric = "Total Individuals with Bachelor's Degrees";
  }

		var supplement = 0

		if(Object.keys(stuff).length == 1) {
			supplement =  stuff[0].key
		} else if(Object.keys(stuff).length == neigh.size) {
			supplement = "Boston"
		} else {
			supplement = "Group"
		}
   var data = {
    	"Metric": metric,
    	"Chester Square":cs_total}
    	data[supplement] = total;
		var columns = Object.keys(data);
		var values = Object.values(data);
		
	var header = thead
		.selectAll("th")
		.data(columns)
		.enter()
		.append("th")
		.attr("class","header")
		.text(function(d) {return d})

	var valued = [values]
	let rows = tbody.selectAll("tr")
					.data(valued)
					.enter()
					.append("tr")
					.attr("class","row")

   var cells = rows.selectAll("td")
    		.data(d => d)
    		.enter()
			.append("td")
			.attr("class","column")
    		.html(function(d){return d});
    return table;
	header.exit.remove();
	cells.exit.remove();
	table.exit().remove();
};
