const stateBttns = document.querySelectorAll(".btn")
var colors = {"crime":"red","real_estate":"green"}
var state = {view:'crime',neighborhood:"", set setN(x) {
  this.neighborhood = x;
  removeLineChart();
  lineChart(filterLine(db[lineIndex]));
}};

const removeLineChart = () => {
  d3.select(".derp").remove()
  d3.select(".x_axis").remove()
  d3.select(".y_axis").remove()
}

var lineIndex = 0;
var db = []
//load all datasets here
var promises = [
        d3.csv("./data/aggregatecrimev2.csv",function(d){
                return {
                            hour: parseInt(d.hour),
                            crimecount: + d.count,
                            neighborhood: d.neighborhoods
                          };
                        }),
        d3.csv("./data/real_estate.csv",function(d){
          return {
                      hour: d.Date,
                      crimecount: + d.Value,
                      neighborhood: d.neighborhood
                    };
                  }),
        d3.csv("./data/ChesterSquareSurveyResponses.csv",function(d) {
                    return {
                      visittime: d.visittime,
                      safetylevel: + d.safetylevel
                    }}),
        d3.json("./data/bostonv2.geojson")
    ]

const filterLine = (d) => { 
  result = {}
  rArray = []
  if(lineIndex == 0) {
    if(state.neighborhood === "") {
      d.forEach(obj => {
        if (Object.keys(result).includes(String(obj.hour))) {
          result[obj.hour] = result[obj.hour] + obj.crimecount
        } else {
          result[obj.hour] = obj.crimecount
        }
      })
      Object.keys(result).forEach(key => {
        rArray.push({"hour": parseInt(key), "crimecount": result[key]});
      })
      return rArray.sort((a,b) => a.hour > b.hour);
    } else {
      return d.filter(obj => obj.neighborhood === state.neighborhood).map((item) => {
        return {"hour":item.hour,"crimecount": item.crimecount}
      }).sort((a,b) => a.hour > b.hour);
    }
  } else {
    if(state.neighborhood === "") {
      d.forEach(obj => {
        if (Object.keys(result).includes(String(obj.hour))) {
          result[obj.hour] = result[obj.hour] + (obj.crimecount / 1000)
        } else {
          result[obj.hour] = (obj.crimecount / 1000)
        }
      })
      Object.keys(result).forEach(key => {
        rArray.push({"hour": new Date(key), "crimecount": result[key]});
      })
      return rArray.sort((a,b) => a.hour > b.hour);
    } else {
      return d.filter(obj => obj.neighborhood === state.neighborhood).map((item) => {
        return {"hour":new Date(item.hour),"crimecount": item.crimecount / 1000}
      }).sort((a,b) => a.hour > b.hour);
    }
  }
}

const letsGo = (d) => {
        db = d;
        scatterplot(d[2]);
        lineChart(filterLine(d[lineIndex]));
        geoViz(d[3]);
}

const render = () => {
        Promise.all(promises).then(letsGo);
};

stateBttns.forEach(btn => {
    btn.addEventListener("click",(e) => {
        e.preventDefault();
        state["view"] = btn.attributes["data-activity"].nodeValue;
        geoViz(db[3])
        lineIndex = (lineIndex + 1) % 2

        d3.select(".derp").remove()
        d3.select(".x_axis").remove()
        d3.select(".y_axis").remove()
        lineChart(filterLine(db[lineIndex]))
    });
});

render();