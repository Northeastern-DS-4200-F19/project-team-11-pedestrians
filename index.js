const stateBttns = document.querySelectorAll(".btn")
var colors = {"crime":"red","real_estate":"green"}
var state = {view:'crime',neighborhood:"", set setN(x) {
  this.neighborhood = x;
  lineChart(filterLine(db[1]));
}};
var db = []
//load all datasets here
var promises = [
        d3.csv("./data/ChesterSquareSurveyResponses.csv",function(d) {
                  return {
                    visittime: d.visittime,
                    safetylevel: + d.safetylevel
                  }}),
        d3.csv("./data/aggregatecrimev2.csv",function(d){
                return {
                            hour: parseInt(d.hour),
                            crimecount: + d.count,
                            neighborhood: d.neighborhoods
                          };
                        }),
        d3.json("./data/bostonv2.geojson")
    ]

const filterLine = (d) => { 
  result = {}
  rArray = []
  if(state.neighborhood === "") {
    d.forEach(obj => {
      if (Object.keys(result).includes(String(obj.hour))) {
        result[obj.hour] = result[obj.hour] + obj.crimecount
      } else {
        result[obj.hour] = obj.crimecount
      }
    })
    console.log(result)
    Object.keys(result).forEach(key => {
      rArray.push({"hour": parseInt(key), "crimecount": result[key]});
    })
    return rArray.sort((a,b) => a.hour > b.hour);
  } else {
    return d.filter(obj => obj.neighborhood === state.neighborhood).map((item) => {
      return {"hour":item.hour,"crimecount": item.crimecount}
    }).sort((a,b) => a.hour > b.hour);
  }
}

const letsGo = (d) => {
        db = d;
        scatterplot(d[0]);
        lineChart(filterLine(d[1]));
        geoViz(d[2]);
}

const render = () => {
        Promise.all(promises).then(letsGo);
};

stateBttns.forEach(btn => {
    btn.addEventListener("click",(e) => {
        e.preventDefault();
        state["view"] = btn.attributes["data-activity"].nodeValue;
        geoViz(db[2])
        lineChart(filterLine(db[1]))
    });
});

render();