// d3.csv("./data/aggregatecrime.csv", function(d) {
//   return {
//     hour: d.hour,
//     crimecount: + d.crimecount
//   };
//   console.log(d)
// }).then(lineChart);

function lineChart(data){
  console.log(data);
  var width  = 700;
  var height = 500;
  var margin = {
    top: 30,
    bottom: 30,
    left: 50,
    right: 30
  };

  var minhour = 0;
  var maxhour = 23;

  var mincrimecount = 0;
  var maxcrimecount  = d3.max(data, function(d){return d.crimecount;});

  var svg = d3.select('#vis3')
              .append('svg')
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

  chartGroup.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate('+ margin.left+', ' + (height - margin.bottom) + ')')
            .call(xAxis);

  var yAxis = d3.axisLeft(yScale);

  chartGroup.append('g')
            .attr('class', 'y axis')
            .attr('transform', 'translate('+ margin.left +', ' + margin.top+')')
            .call(yAxis);

  chartGroup.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#69b3a2")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                     .x(function (d) { return xScale(d.hour) + margin.left; })
                     .y(function (d) { return yScale(d.crimecount) + margin.top; } ));
                     chartGroup.exit().remove();
}
