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
	let table = d3.select('#table')
		.append("table")
		.attr("class", "table table-condensed table-stripled"),
		thead = table.append("thead"),
		tbody = table.append("tbody");

		var supplement = 0
		console.log(Object.keys(stuff).length)
		if(Object.keys(stuff).length == 1) {
			supplement =  Object.keys(stuff)
		} else if(Object.keys(stuff).length == 28){
			supplement = "Boston"
		} else {
			supplement = "Group"
		}
		console.log(supplement);
   var data = {
    	"metric": "whater",
    	"Chester Square":cs_total}
    	data[supplement] = total;
		var columns = Object.keys(data);
		var stuff = Object.values(data);
		console.log(stuff)
		var header = thead.append("tr")
		.selectAll("th")
		.data(columns)
		.enter()
		.append("th")
		.text(function(d) {return d})


		let rows = tbody.selectAll("tr")
		.data(stuff)
		.enter()
		.append("tr")
   var cells = rows.selectAll("td")
    		.data(d => d)
    		.enter()
    		.append("td")
    		.html(function(d){return d});
    return table;

    table.exit().remove();
};
