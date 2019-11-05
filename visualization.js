// console.log('hello world!');

var dataset = []

d3.csv("./data/ChesterSquareSurveyResponses.csv").then(function(data){
  var time = []
  var safety = []
  console.log(data)
  for(let i = 0; i < data.length; i ++) {
    var row = []

    var visittime = data[i]["Visit-Time"];

    if (visittime == "Morning"){
    	row.push(0);
    }

    if (visittime == "Afternoon"){
    	row.push(1);
    }

    if (visittime == "Evening"){
    	row.push(2);
    }

    //row.push(data[i]["Visit-Time"]);
    row.push(parseInt(data[i]["Safety-Level"]));
    // time.push(data[i][3])
    // safety.push(data[i][6])
    dataset.push(row)
  }



var width = 500;
var height = 500;
var maxSafety = 10;
var minSafety = 0;
var maxTime = 2;
var margin = {
    top: 30,
    bottom: 30,
    left: 30,
    right: 30
};


//Create SVG element
var svg = d3.select("#surveyvis")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

  var chartGroup = svg.append('g')
                      .attr('transform','translate(' + margin.left +',' + margin.top + ')');

  var xScale = d3.scaleTime()
                  .domain([0, maxTime])
                  .range([0, width]);

  var yScale = d3.scaleLinear()
                 .domain([minSafety, maxSafety])
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

  var line = d3.line()
               .x(function(d){return xScale(d.date);})
               .y(function(d){return yScale(d.price);})
               .curve(d3.curveMonotoneX);

  chartGroup.append('path')
            .attr('d', line(dataset))
            .attr('class', 'dataLine');









// var x = d3.scaleTime().range([0, width]);

// var y = d3.scaleLinear().range([height, 0]);
// // Scale the range of the data
// x.domain(d3.extent(data, function (d) {
//      return d.date;
// }));
// y.domain([0, d3.max(data, function (d) {
//      return d.wage;
// })]);


// svg.selectAll("circle")
//    .data(dataset)
//    .enter()
//    .append("circle")
//    .attr("cx", function(d) {
//         return d[0];
//    })
//    .attr("cy", function(d) {
//         return d[1];
//    })
//    .attr("r", 2);


console.log(dataset)
});




// var minSafety = 0;
// var maxSafety = 10;
// var width = 500;
// var height = 500;

// var svg = d3.select("body")
//             .append("svg")
//             .attr("width", width)
//             .attr("height", height);


// svg.selectAll("circle")
//    .data(dataset)
//    .enter()
//    .append("circle")
//    .attr("cx", function(d) {
//         return d[0];
//    })
//    .attr("cy", function(d) {
//         return d[1];
//    })
//    .attr("r", 5);

// var dataset = [
//                   [ 5,     20 ],
//                   [ 480,   90 ],
//                   [ 250,   50 ],
//                   [ 100,   33 ],
//                   [ 330,   95 ],
//                   [ 410,   12 ],
//                   [ 475,   44 ],
//                   [ 25,    67 ],
//                   [ 85,    21 ],
//                   [ 220,   88 ]
//               ];








