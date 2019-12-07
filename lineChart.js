function lineChart(deets) {
  var data = d3
    .nest()
    // .key(function(d){ return d.neighborhood == "Chester Square"})
    .key(function(d) {
      return d.time;
    })
    // .key(function(d) { return d.neighborhood == "Chester Square"})
    .rollup(function(v) {
      return d3.sum(v, function(d) {
        return d.value;
      });
    })
    .entries(deets)
    .sort((a, b) => {
      return d3.ascending(parseInt(a.key), parseInt(b.key));
    });
  var width = 600;
  var height = 400;
  var margin = {
    top: 40,
    bottom: 75,
    left: 75,
    right: 30
  };
  
  var mintime = d3.min(data, function(d) {
    return parseInt(d.key);
  });
  var maxtime = d3.max(data, function(d) {
    return parseInt(d.key);
  });

  var minvalue = 0;
  var maxvalue = d3.max(data, function(d) {
    return d.value;
  });


  //setting table labels
  var title = "";
  var x_axis_label = "";
  var y_axis_label = "";

  if (state["view"] == "crime") {
    title = "Crime By Hour in Boston";
    y_axis_label = "Crime Count";
    x_axis_label = "Hour of Day";
  } else if (state["view"] == "real_estate") {
    title = "Real Estate Prices over Time";
    y_axis_label = "Average Price Per Square Feet";
    x_axis_label = "Year";
  } else if (state["view"] == "demographic") {
    title = "Bachelor's Degrees Over Time";
    y_axis_label = "Bachelor's Degrees Per Year";
    x_axis_label = "Year";
  }

  var svg = d3
    .select("#vis3")
    .attr("class", "vis3")
    .attr("width", width)
    .attr("height", height);
  // .style('background', '#efefef');

  var chartGroup = svg
    .append("g")
    .append("svg")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Adding Graph Title
  chartGroup
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.top - 20)
    .attr("class", "title")
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("text-decoration", "underline")
    .text(title);

  var xScale = d3
    .scaleLinear()
    .domain([mintime, maxtime])
    .range([0, width - 100]);

  var yScale = d3
    .scaleLinear()
    .domain([minvalue, maxvalue + 1000])
    .range([height - margin.bottom - margin.top, 0]);

  var xAxis = d3.axisBottom(xScale);

  var yAxis = d3.axisLeft(yScale);

  var x_axis = chartGroup
    .append("g")
    .attr("class", "x_axis")
    .attr(
      "transform",
      "translate(" + margin.left + ", " + (height - margin.bottom) + ")"
    )
    .call(xAxis)
    .style("font-size", "14px");

  // Adding X-Axis Label
  chartGroup
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - margin.bottom + 40)
    .attr("class", "x_axis_label")
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text(x_axis_label);

  var y_axis = chartGroup
    .append("g")
    .attr("class", "y_axis")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
    .call(yAxis)
    .style("font-size", "14px");

  // Adding Y-Axis Label
  chartGroup
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", margin.left - 60)
    .attr("class", "y_axis_label")
    .style("font-size", "16px")
    .attr("text-anchor", "middle")
    .text(y_axis_label);

  var paths = chartGroup
    .datum(data)
    .append("path")
    .attr("class", "derp")
    .attr("fill", "none")
    .attr("stroke", d => {
      return colors[state["view"]];
    })
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x(function(d) {
          return xScale(d.key) + margin.left;
        })
        .y(function(d) {
          return yScale(d.value) + margin.top;
        })
    );

  paths.exit().remove();
  chartGroup.exit().remove();
}
