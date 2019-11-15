function lineChart(data){
  console.log(data)
  var width  = 700;
  var height = 500;
  var margin = {
    top: 30,
    bottom: 30,
    left: 50,
    right: 30
  };

  var minhour = d3.min(data, function(d){return d.hour;});
  var maxhour = d3.max(data, function(d){return d.hour;});

  var mincrimecount = 0;
  var maxcrimecount  = d3.max(data, function(d){return d.crimecount;});

  var svg = d3.select('#vis3')
              // .append('svg')
              .attr('width' , width)
              .attr('height', height)
              .style('background', '#efefef');

  var chartGroup = svg.append('g')
  					          .append('svg')
                      .attr('transform','translate(' + margin.left +',' + margin.top + ')');

  var xScale = d3.scaleLinear()
                 .domain([minhour, maxhour])
                 .range([0, width - 100]);

  var yScale = d3.scaleLinear()
                 .domain([mincrimecount, maxcrimecount + 1000])
                 .range([height - margin.bottom - margin.top, 0]);

  var xAxis = d3.axisBottom(xScale);

  var yAxis = d3.axisLeft(yScale);

  var x_axis = chartGroup.append('g')
            .attr('class', 'x_axis')
            .attr('transform', 'translate('+ margin.left+', ' + (height - margin.bottom) + ')')
            .call(xAxis);

  var y_axis = chartGroup.append('g')
            .attr('class', 'y_axis')
            .attr('transform', 'translate('+ margin.left +', ' + margin.top+')')
            .call(yAxis);

  var paths = chartGroup
            .append("path")
            .attr("class","derp")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#69b3a2")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                     .x(function (d) { return xScale(d.hour) + margin.left; })
                     .y(function (d) { return yScale(d.crimecount) + margin.top; }));
                     
  paths.exit().remove();
  chartGroup.exit().remove();

}
