const stateBttns = document.querySelectorAll(".btn")
var colors = {"crime":"red","real_estate":"green","demographic":"blue"}
var state = {view:'crime',neighborhood:[], data: {"crime": null,"demographic": null,"real_estate":null, "survey":null }, set setN(x) {
  this.neighborhood = x;
  removeChart();
  render()
}};

const removeChart = () => {
  d3.selectAll(".derp").remove()
  d3.selectAll(".x_axis").remove()
  d3.selectAll(".y_axis").remove()
}

var lineIndex = 0;
var db = []
//load all datasets here
var promises = [
        d3.csv("./data/csv_files/crime.csv",function(d){
                return {
                            time: parseInt(d.time),
                            value: +d.value,
                            neighborhood: d.neighborhood,
                            category: d.category
                          };
                        }),
        d3.csv("./data/csv_files/real_estate.csv",function(d){
          return {
                      time: d.time,
                      value: +d.value,
                      neighborhood: d.neighborhood,
                      category: d.category
                    };
                  }),
        d3.csv("./data/csv_files/demographic.csv",function(d){
          return {
                      time: d.time,
                      value: +d.value,
                      neighborhood: d.neighborhood,
                      category: d.category
                    };
                  }),
        d3.csv("./data/csv_files/ChesterSquareSurveyResponses.csv",function(d) {
                    return {
                      visittime: d.visittime,
                      safetylevel: + d.safetylevel
                    }}),
        d3.json("./data/json_files/boston.geojson")
    ]

const filterBar = (d) => {
  var result = {}
  var rArray = []
  var categorys = new Set(d.map(obj => obj.category));
  var neighborhoods = new Set(d.map(obj => obj.neighborhood))
  neighborhoods.forEach(n => {
    row = {}
    categorys.forEach(ot => {
      row[ot] = 0
    })
    result[n] = row
  })
  d.forEach(obj => {
    result[obj.neighborhood][obj.category] = result[obj.neighborhood][obj.category] + obj.value
  })
  Object.keys(result).forEach(neighborhood => {
    row = result[neighborhood]
    filtered_row = {}
    sortedKeys = Object.keys(result[neighborhood]).sort((a,b) => {
      return result[neighborhood][b] - result[neighborhood][a]}
      )
      var max = 0
      if(state.view !== "demographic") {
        max = 5
      } else {
        max = sortedKeys.length
      }
    for(let i = 0; i < max; i++) {
      filtered_row[sortedKeys[i]] = row[sortedKeys[i]]
    }
    filtered_row["neighborhood"] = neighborhood
    rArray.push(filtered_row)
  })
  return rArray
}

const filterLine = (d) => {
  var result = {}
  var rArray = []
  if(lineIndex == 0) {
    if(state.neighborhood.length == 0) {
      d.forEach(obj => {
        if (Object.keys(result).includes(String(obj.time))) {
          result[obj.time] = result[obj.time] + obj.value
        } else {
          result[obj.time] = obj.value
        }
      })
      Object.keys(result).forEach(key => {
        rArray.push({"time": parseInt(key), "value": result[key]});
      })
      return rArray.sort((a,b) => a.time > b.time);
    } else {
      return d.filter(obj => state.neighborhood.includes(obj.neighborhood)).map((item) => {
        return {"time":parseInt(item.time),"value": item.value}
      }).sort((a,b) => a.time > b.time);
    }
  } else {
    if(state.neighborhood === "") {
      d.forEach(obj => {
        if (Object.keys(result).includes(String(obj.time))) {
          result[obj.time] = result[obj.time] + (obj.value / 1000)
        } else {
          result[obj.time] = (obj.value / 1000)
        }
      })
      Object.keys(result).forEach(key => {
        rArray.push({"time": new Date(key).getFullYear(), "value": result[key]});
      })
      return rArray.sort((a,b) => a.time > b.time);
    } else {
      return d.filter(obj => obj.neighborhood === state.neighborhood).map((item) => {
        return {"time":new Date(item.time).getFullYear(),"value": item.value / 1000}
      }).sort((a,b) => a.time > b.time);
    }
  }
}

const render = () => {
        scatterplot(state.data["survey"]);
        lineChart(filterLine(state.data[state.view]));
        stackChart(filterBar(state.data[state.view]));
        geoViz({"data":state.data[state.view],"info":state.data["geo"]});
}

const setData = (d) => {
  state.data["crime"] = d[0];
  state.data["real_estate"] = d[1];
  state.data["demographic"] = d[2];
  state.data["survey"] = d[3];
  state.data["geo"] = d[4];
}

const load = () => {
    Promise.all(promises).then(setData).then(render);
};

stateBttns.forEach(btn => {
  btn.addEventListener("click" , (e) => {
    state["view"] = btn.attributes["data-activity"].nodeValue;
    removeChart()
    render()
  })
})

load();