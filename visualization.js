// NOTE: Sample code from class was used on this assignment
// We plan to add it to the Acknowledgements section but do not know the format.

d3.csv("./data/ChesterSquareSurveyResponses.csv", function(d) {
  return {
    visittime: d.visittime,
    safetylevel: + d.safetylevel
  };
  console.log(d)
}).then(lineChart);

function lineChart(data){
  console.log(data);

  var minSafetyLevel = 0;
  var maxSafetyLevel = 10;

  var width  = 700;
  var height = 500;
  var margin = {
    top: 30,
    bottom: 30,
    left: 50,
    right: 30
  };

  var svg = d3.select('body')
              .append('svg')
              .attr('width' , width)
              .attr('height', height)
              .style('background', '#efefef');

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

  chartGroup.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate('+ margin.left+', ' + (height - margin.bottom) + ')')
            .call(xAxis);

  var yAxis = d3.axisLeft(yScale);

  chartGroup.append('g')
            .attr('class', 'y axis')
            .attr('transform', 'translate('+ margin.left +', ' + margin.top+')')
            .call(yAxis);

  svg.append('g')
     .selectAll("dot")
     .data(data)
     .enter()
     .append("circle")
     .attr("cx", function (d) { return xScale(d.visittime) + margin.left; } )
     .attr("cy", function (d) { return yScale(d.safetylevel) + margin.top; } )
     .attr("r", 5)
     .style("fill", "#69b3a2")
}




