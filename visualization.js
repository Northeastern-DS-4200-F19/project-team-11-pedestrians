console.log('hello world!');

var dataset = [];

d3.csv("/data/ChesterSquareSurveyResponses.csv").then(function(data) {
  console.log("hi");
});

console.log(dataset);