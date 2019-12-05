/**
 * Linechart function object.
 * @param {} deets 
 */
function lineChart(deets){
  /**
   * Transforms the data into the required format.
   * @param {*} d data set passed through
   */
  // TODO Fix Real Estate Averaging
  const filterLine = (d) => {
      let transformed = null;
      if(state.neighborhood.length == 0) {
        d = d;
      } else {
        d = d.filter(obj => state.neighborhood.includes(obj.neighborhood))
      }
      if(state.view == "demographic") {
        transformed = d.filter(obj => obj.category == "Bachelor's Degree or Higher")
      } else if (state.view === "real_estate") {
        transformed = d.map((item) => {
                return {"time":new Date(Date.parse(item.time)).getFullYear(),"value": item.value / 1000}
              }).sort((a,b) => a.time - b.time);
    } else {
      transformed = d.sort((a,b) => a.category - b.category)
    }
    return d3.nest()
              .key(function(d) { return d.time; })
              .rollup(function(v) { return d3.sum(v, function(d) { return d.value; });})
              .entries(transformed)
              .sort((a,b) => { return d3.ascending(parseInt(a.key), parseInt(b.key))});
  }

  var data = filterLine(deets)
  // setting constants
  var width  = 600;
  var height = 400;
  var margin = {
    top: 40,
    bottom: 75,
    left: 75,
    right: 30
  };
  var mintime = Math.max(data.map(row => parseInt(row.key)));
  var maxtime = Math.max(data.map(row => parseInt(row.key)));

  var minvalue = 0;
  var maxvalue = Math.max(data.map(row => d.value));

  // removing labels
  d3.select(".x_axis_label").remove();
  d3.select(".y_axis_label").remove();
  d3.select(".title").remove();

  //setting table labels
  var title = "";
  var x_axis_label = "";
  var y_axis_label = "";

  if(state["view"] == "crime"){
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

  var svg = d3.select('#vis3')
              .attr("class", "vis3")
              .attr('width' , width)
              .attr('height', height)
              .append("rect")
              .attr("x",0)
              .attr("y",0)
              .attr("height",height)
              .attr("width",width)
              .attr("stroke","black")
              .attr("stroke-width","border")
              .attr("fill","none")
              // .style('background', '#efefef');

  // appending svg
  var chartGroup = d3.select('#vis3').append('g')
  					          .append('svg')
                      .attr('transform','translate(' + margin.left +',' + margin.top + ')')

  // Adding Graph Title
  chartGroup.append("text")
          .attr("x", width/2)
          .attr("y", margin.top - 20)
          .attr('class', 'title')
          .attr("text-anchor", "middle")
          .style("font-size", "20px")
          .style("text-decoration", "underline")
          .text(title);

  // x scale
  var xScale = d3.scaleLinear()
                 .domain([mintime, maxtime])
                 .range([0, width - 100]);

  // y scale
  var yScale = d3.scaleLinear()
                 .domain([minvalue, maxvalue])
                 .range([height - margin.bottom - margin.top, 0]);

  var xAxis = d3.axisBottom(xScale);

  var yAxis = d3.axisLeft(yScale);

  chartGroup.append('g')
            .attr('class', 'x_axis')
            .attr('transform', 'translate('+ margin.left+', ' + (height - margin.bottom) + ')')
            .call(xAxis)
            .style("font-size", "14px");


  // Adding X-Axis Label
  chartGroup.append("text")
            .attr("x", width/2)
            .attr("y", height - margin.bottom + 40)
            .attr("class", "x_axis_label")
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text(x_axis_label);

  // Setting the Y axis labels
  chartGroup.append('g')
            .attr('class', 'y_axis')
            .attr('transform', 'translate('+ margin.left +', ' + margin.top+')')
            .call(yAxis)
            .style("font-size", "14px");

  // Adding Y-Axis Label
  chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height/2)
            .attr("y", margin.left - 60)
            .attr("class", "y_axis_label")
            .style("font-size", "16px")
            .attr("text-anchor", "middle")
            .text(y_axis_label);

  var paths = chartGroup
            .datum(data)
            .append("path")
            .attr("class","derp")
            .attr("fill", "none")
            .attr("stroke", d => {
              return state.colors[state["view"]]})
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
            .x(function (d) {
              return xScale(d.key) + margin.left; })
            .y(function (d) { 
              return yScale(d.value) + margin.top; }));

  paths.exit().remove();
  chartGroup.exit().remove()
}
