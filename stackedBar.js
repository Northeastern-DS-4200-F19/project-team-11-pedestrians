d3.csv("./data/crimeV4.csv", function(d) {
  return {
    neighborhoods: d.neighborhoods,
    crimeCount: + d.count,
    crimeCategory: d.offense_type
  };
  console.log(d)
}).then(stackedBar);

function stackedBar(data){
  var width  = 700;
  var height = 500;
  var margin = {
    top: 30,
    bottom: 30,
    left: 50,
    right: 30
  };

  var svg = d3.select('#stackedBar')
              .append('svg')
              .attr('width' , width)
              .attr('height', height)
              .style('background', '#efefef');
  var chartGroup = svg.append('g')
                      .append('svg')
                      .attr('transform','translate(' + margin.left +',' + margin.top + ')');
  var xScale = d3.scaleOrdinal()
                 .domain(["", "Allston", "Roxbury", "Dorchester"])
                 // Shifting by 50 so the last category label doesn't get cut off
                 .range([0, 100, width/2, width - 100]);

  var yScale = d3.scaleLinear()
                 .domain([0, d3.max(data, function(d){return d.count;})])
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
