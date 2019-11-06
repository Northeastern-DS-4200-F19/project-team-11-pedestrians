  
console.log('hello world!');

var dataset = []

d3.csv("./data/ChesterSquareSurveyResponses.csv").then(function(data){
  var time = []
  var safety = []
  console.log(data)
  for(let i = 0; i < data.length; i ++) {
    var row = []

    var visittime = data[i]["Visit-Time"];

    //row.push(data[i]["Visit-Time"]);
    row.push(parseInt(data[i]["Safety-Level"]));
    // time.push(data[i][3])
    // safety.push(data[i][6])
    dataset.push(row)
	}
	console.log(dataset)
}).then(lineChart);

function lineChart(data){
  console.log(data);
  var maxTime  = 2;
  var minTime  = 0;
  var maxSafety = 10;

  var width  = 600;
  var height = 500;
  var margin = {
    top: 30,
    bottom: 30,
    left: 30,
    right: 30
  };

  var svg = d3.select('body')
  .append('svg')
    .attr('width' , width)
    .attr('height', height)
    .style('background', '#efefef');

  var chartGroup = svg
  .append('g')
    .attr('transform','translate(' + margin.left +',' + margin.top + ')');

  var xScale = d3.scaleOrdinal()
  .domain(["Morning", "Afternoon", "Evening"])
  .range([0, width]);

  var yScale = d3.scaleLinear()
  	.domain([0, maxSafety])
  	.range([height - margin.bottom - margin.top, 0]);

  
  var xAxis = d3.axisBottom(xScale);
	chartGroup.append('g')
  	.attr('class', 'x axis')
  	.attr('transform', 'translate(0, ' + (height - margin.bottom - margin.top) + ')')
  	.call(xAxis);


  var yAxis = d3.axisLeft(yScale);
	chartGroup.append('g')
  	.attr('class', 'y axis')
  	.attr('transform', 'translate(0, 0)')
  	.call(yAxis);

  // chartGroup.append('path')
  //   .attr('d', line(data))
  //   .attr('class', 'dataLine');
}












