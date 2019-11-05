console.log('hello world!');

var dataset = []

d3.csv("./data/ChesterSquareSurveyResponses.csv").then(function(data){
  var time = []
  var safety = []
  console.log(data)
  for(let i = 0; i < data.length; i ++) {
    time.push(data[i]["Visit-Time"]);
    safety.push(data[i]["Safety-Level"]);
    // time.push(data[i][3])
    // safety.push(data[i][6])
  }
  dataset.push(time)
  dataset.push(safety)
});

