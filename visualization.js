function scatterplot(data) {
  var minSafetyLevel = 0;
  var maxSafetyLevel = 10;

  var width = 1000;
  var height = 600;
  var margin = {
    top: 50,
    bottom: 100,
    left: 75,
    right: 30
  };

  var svg = d3
    .select("#vis4")
    // .append('svg')
    .attr("width", width)
    .attr("height", height);
  // .style('background', '#efefef');

  d3.select(".x_axis_label4").remove();
  d3.select(".y_axis_label4").remove();
  d3.select(".title4").remove();

  // Adding Graph Title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.top - 10)
    .attr("class", "title4")
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("text-decoration", "underline")
    .text(
      "Perceived Safety Level at Different Times of Day in Chester Square Park"
    );

  var chartGroup = svg
    .append("g")
    .append("svg")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xScale = d3
    .scaleOrdinal()
    .domain(["", "Morning", "Afternoon", "Evening"])
    // Shifting by 50 so the last category label doesn't get cut off
    .range([0, 100, width / 2, width - 110]);

  var yScale = d3
    .scaleLinear()
    .domain([minSafetyLevel, maxSafetyLevel])
    .range([height - margin.bottom - margin.top, 0]);

  var xAxis = d3.axisBottom(xScale);

  var yAxis = d3.axisLeft(yScale);

  chartGroup
    .append("g")
    .attr("class", "x_axis")
    .attr(
      "transform",
      "translate(" + margin.left + ", " + (height - margin.bottom) + ")"
    )
    .call(xAxis)
    .style("font-size", "16px");

  // Adding X-Axis Label
  svg
    .append("text")
    .attr("x", width / 2 + margin.left)
    .attr("y", height - margin.bottom / 2)
    .attr("class", "x_axis_label4")
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .text("Time of Day");

  chartGroup
    .append("g")
    .attr("class", "y_axis")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
    .call(yAxis)
    .style("font-size", "16px");

  // Adding Y-Axis Label
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2 + margin.bottom)
    .attr("y", margin.left / 2)
    .attr("class", "y_axis_label4")
    .style("font-size", "20px")
    .attr("text-anchor", "end")
    .text("Perceived Safety Level");

  var dots = chartGroup
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
      return xScale(d.visittime) + margin.left;
    })
    .attr("cy", function(d) {
      return yScale(d.safetylevel) + margin.top;
    })
    .attr("r", 10)
    .style("fill", "#69b3a2");

  // Add brushing
  chartGroup.call(
    d3
      .brush() // Add the brush feature using the d3.brush function
      .extent([
        [0, 0],
        [width, height]
      ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("start brush", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
  );

  // Function that is triggered when brushing is performed
  function updateChart() {
    extent = d3.event.selection;
    dots.classed("selected", function(d) {
      return isBrushed(
        extent,
        xScale(d.visittime) + margin.left,
        yScale(d.safetylevel) + margin.top
      );
    });
  }

  // A function that return TRUE or FALSE according if a dot is in the selection or not
  function isBrushed(brush_coords, cx, cy) {
    var x0 = brush_coords[0][0],
      x1 = brush_coords[1][0],
      y0 = brush_coords[0][1],
      y1 = brush_coords[1][1];
    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1; // This return TRUE or FALSE depending on if the points is in the selected area
  }

  dots.exit().remove();
}
