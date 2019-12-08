function tablevis(deets,cs) {
	

	console.log(deets);
	var stuff = d3.nest()
                .key(function(d) { return d.neighborhood; })
                .rollup(function(v) { if(state.view == "real_estate") {
                  return d3.mean(v, function(d) { return d.value;})
                } else {return d3.sum(v, function(d) { return d.value; });}})
                .entries(deets)
                .sort((a,b) => { return d3.ascending(parseInt(a.key), parseInt(b.key))});
    console.log(stuff);
    console.log(cs);
    var cs_total = d3.sum(cs, function(d) {return d});
    var values = stuff.map(s => s.value);
    var total = d3.sum(values, function(d) {return d});
    console.log(total)
    console.log(cs_total)

    //Creating the table
	let table = d3.select('.table')
		thead = d3.select("#heading");
		tbody = d3.select("#table_body");

var metric = "";

if(state["view"] == "crime"){
    metric = "Crime By Hour in Boston";
  } else if (state["view"] == "real_estate") {
    metric = "Real Estate Prices over Time";
  } else if (state["view"] == "demographic") {
    metric = "Bachelor's Degrees Over Time";
  }

		var supplement = 0
		console.log(Object.keys(stuff).length)
		if(Object.keys(stuff).length == 1) {
			supplement =  stuff[0].key
		} else if(Object.keys(stuff).length == 28){
			supplement = "Boston"
		} else {
			supplement = "Group"
		}
		console.log(supplement);
   var data = {
    	"metric": metric,
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
