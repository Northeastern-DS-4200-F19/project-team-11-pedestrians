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


// var svg = d3.select('#surveyvis')
//   .append('svg')        // create an <svg> element
//     .attr('width', 1000) // set its dimentions
//     .attr('height', 1000)













// var width = 500;
// var height = 500;
// var maxSafety = 10;
// var minSafety = 0;
// var maxTime = 2;
// var margin = {
//     top: 30,
//     bottom: 30,
//     left: 30,
//     right: 30
// };



// var x = d3.scaleTime().range([0, width]);
// var y = d3.scaleLinear().range([height, 0]);
// // Scale the range of the data
// x.domain(d3.extent(data, function (d) {
//      return d.date;
// }));
// y.domain([0, d3.max(data, function (d) {
//      return d.wage;
// })]);

// var valueline = d3.line()
//      .x(function (d) {
//           return x(d.date);
//      })
//      .y(function (d) {
//           return y(d.wage);
//      });


//      var svg = d3.select("#surveyvis").append("svg")
//      .attr("width", width + margin.left + margin.right)
//      .attr("height", height + margin.top + margin.bottom)
//      .append("g")
//      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


//      var path = svg.selectAll("dot")
//      .data(data)
//      .enter().append("circle")
//      .attr("r", 5)
//      .attr("cx", function (d) {
//            return x(d.);
//      })
//      .attr("cy", function (d) {
//           return y(d.wage);
//      })
//      .attr("stroke", "#32CD32")
//      .attr("stroke-width", 1.5)
//      .attr("fill", "#FFFFFF");



















// //Create SVG element
// var svg = d3.select("#surveyvis")
//             .append("svg")
//             .attr("width", width)
//             .attr("height", height);

//   var chartGroup = svg.append('g')
//                       .attr('transform','translate(' + margin.left +',' + margin.top + ')');

//   var xScale = d3.scaleTime()
//                   .domain([0, maxTime])
//                   .range([0, width]);

//   var yScale = d3.scaleLinear()
//                  .domain([minSafety, maxSafety])
//                  .range([height - margin.bottom - margin.top, 0]);


//     var xAxis = d3.axisBottom(xScale);


//     chartGroup.append('g')
//             .attr('class', 'x axis')
//             .attr('transform', 'translate(0, ' + (height - margin.bottom - margin.top) + ')')
//             .call(xAxis);

//   var yAxis = d3.axisLeft(yScale);

//   chartGroup.append('g')
//             .attr('class', 'y axis')
//             .attr('transform', 'translate(0, 0)')
//             .call(yAxis);

//   var line = d3.line()
//                .x(function(d){return xScale(d.date);})
//                .y(function(d){return yScale(d.price);})
//                .curve(d3.curveMonotoneX);

//   chartGroup.append('path')
//             .attr('d', line(dataset))
//             .attr('class', 'dataLine');









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








