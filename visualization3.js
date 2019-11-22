function lineChart(deets){
  console.log(deets)
  var data = d3.nest()
              .key(function(d) { return d.time; })
              .rollup(function(v) { return d3.sum(v, function(d) { return d.value; }); })
              .entries(deets)
              .sort((a,b) => { return d3.ascending(parseInt(a.key), parseInt(b.key))})
  var width  = 600;
  var height = 300;
  var margin = {
    top: 30,
    bottom: 30,
    left: 50,
    right: 30
  };

  var mintime = d3.min(data, function(d){return parseInt(d.key);});
  var maxtime = d3.max(data, function(d){return parseInt(d.key);});

  var minvalue = 0;
  var maxvalue  = d3.max(data, function(d){return d.value;});

  var svg = d3.select('#vis3')
              // .append('svg')
              .attr('width' , width)
              .attr('height', height)
              .style('background', '#efefef');

  var chartGroup = svg.append('g')
  					          .append('svg')
                      .attr('transform','translate(' + margin.left +',' + margin.top + ')');

  var xScale = d3.scaleLinear()
                 .domain([mintime, maxtime])
                 .range([0, width - 100]);

  var yScale = d3.scaleLinear()
                 .domain([minvalue, maxvalue + 1000])
                 .range([height - margin.bottom - margin.top, 0]);

  var xAxis = d3.axisBottom(xScale);

  var yAxis = d3.axisLeft(yScale);

  var x_axis = chartGroup.append('g')
            .attr('class', 'x_axis')
            .attr('transform', 'translate('+ margin.left+', ' + (height - margin.bottom) + ')')
            .call(xAxis)
            .selectAll("text")

  var y_axis = chartGroup.append('g')
            .attr('class', 'y_axis')
            .attr('transform', 'translate('+ margin.left +', ' + margin.top+')')
            .call(yAxis);

  var paths = chartGroup
            .datum(data)
            .append("path")
            .attr("class","derp")
            .attr("fill", "none")
            .attr("stroke", colors[state["view"]])
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
            .x(function (d) { return xScale(parseInt(d.key)) + margin.left; })
            .y(function (d) { return yScale(d.value) + margin.top; }));
      
  paths.exit().remove();
  chartGroup.exit().remove()
}
