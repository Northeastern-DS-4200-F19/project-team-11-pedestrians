function scatterplot(data){
  var minSafetyLevel = 0;
  var maxSafetyLevel = 10;

  var width  = 1000;
  var height = 600;
  var margin = {
    top: 50,
    bottom: 100,
    left: 75,
    right: 30
  };

  var svg = d3.select('#vis4')
              // .append('svg')
              .attr('width' , width)
              .attr('height', height)
              .style('background', '#efefef');

  // Adding Graph Title
  svg.append("text")
            .attr("x", width/2)
            .attr("y", margin.top - 20)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Perceived Safety Level at Different Times of Day in Chester Square Park");

  var chartGroup = svg.append('g')
                      .append('svg')
                      .attr('transform','translate(' + margin.left +',' + margin.top + ')');

  var xScale = d3.scaleOrdinal()
                 .domain(["", "Morning", "Afternoon", "Evening"])
                 // Shifting by 50 so the last category label doesn't get cut off
                 .range([0, 100, width/2, width - 100]);

  var yScale = d3.scaleLinear()
                 .domain([minSafetyLevel, maxSafetyLevel])
                 .range([height - margin.bottom - margin.top, 0]);

  var xAxis = d3.axisBottom(xScale);

  var yAxis = d3.axisLeft(yScale);

  chartGroup.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate('+ margin.left+', ' + (height - margin.bottom) + ')')
            .call(xAxis);

  // Adding X-Axis Label
  svg.append("text")
     .attr("x", width/2)
     .attr("y", height - margin.bottom + 50)
     .attr("text-anchor", "middle")
     .style("font-size", "12px")
     .text("Time of Day");

  chartGroup.append('g')
            .attr('class', 'y axis')
            .attr('transform', 'translate('+ margin.left +', ' + margin.top+')')
            .call(yAxis);

  // Adding Y-Axis Label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -225)
    .attr("y", 30)
    .style("font-size", "12px")
    .attr("text-anchor", "end")
    .text("Perceived Safety Level");

  var dots = chartGroup
     .selectAll("dot")
     .data(data)
     .enter()
     .append("circle")
     .attr("cx", function (d) { return xScale(d.visittime) + margin.left; } )
     .attr("cy", function (d) { return yScale(d.safetylevel) + margin.top; } )
     .attr("r", 5)
     .style("fill", "#69b3a2")

    dots.exit().remove();
}
