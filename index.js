const stateBttns = document.querySelectorAll(".btn")
var state = {scope:"boston",view:'crime',neighborhood:[], data: {"crime": null,"demographic": null,"real_estate":null, "survey":null }, set setN(x) {
  this.neighborhood = Array.from(x);
  updateViz()
}, set removeN(x) {
  this.neighborhood = []
  updateViz()
},colors:{"crime":"red","real_estate":"green","demographic":"blue", "chester_square":"orange"},
  set setView(x) {
    this.view = x;
    removeChart();
    lineChart(filterLine(state.data[state.view]));
    stackChart(filterBar(state.data[state.view]));
    geoViz({"data":state.data[state.view],"info":state.data["geo"]});
  }};

const removeChart = () => {
  d3.selectAll(".stuff").remove()
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
                      safetylevel: + d.safetylevel,
                      hour: parseInt(d.hour,10)
                    }}),
        d3.json("./data/json_files/boston.geojson")
    ]

const filterBar = (d) => {
  var result = {}
  var rArray = []
  var categorys = new Set(d.map(obj => obj.category));
  var neighborhoods = new Set(d.map(obj => obj.neighborhood));
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

const filterCsBar = (d) => {
  var result = {}
  var rArray = []
  var categorys = new Set(d.map(obj => obj.category));
  var neighborhoods = new Set(d.map(obj => obj.neighborhood));
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
    for(let i = 0; i < 10; i++) {
      filtered_row[sortedKeys[i]] = row[sortedKeys[i]]
    }
    filtered_row["neighborhood"] = neighborhood
    rArray.push(filtered_row)
  })
  return rArray.filter(a => a.neighborhood == "Chester Square")
}

const transformSurvey = (d) => {
  var result = {}
  for(let i = 0; i < 23; i++) {
    result[i] = {"total":0,"records":0}
  }
  d.forEach(row => {
      result[row.hour]["total"] += row.safetylevel 
      result[row.hour]["records"] += 1
    })
    var final = [];
  Object.keys(result).forEach(key => {
    current = {}
    current["key"] = parseInt(key)
    if(parseInt(key) <= 7) {
      current["value"] = result["7"]["total"]/result["7"]["records"]
    } else if (parseInt(key) <= 14) {
      current["value"] = result["14"]["total"]/result["14"]["records"]
    } else {
      current["value"] = result["21"]["total"]/result["21"]["records"]
    }
    final.push(current)
  })
  return final;
}

const filterLine = (d) => {
  if(state.neighborhood.length == 0) {
    d = d;
  } else {
    d = d.filter(obj => state.neighborhood.includes(obj.neighborhood))
  }
  if(state.view == "demographic") {
    return d.filter(obj => obj.category == "Bachelor's Degree or Higher")
  } else if (state.view === "real_estate") {
    return d.map((item) => {
            return {"time":new Date(Date.parse(item.time)).getFullYear(),"value": item.value}
          }).sort((a,b) => a.time - b.time);
 } else {
  return d.sort((a,b) => a.category - b.category)
 }
}

const render = () => {
    lineChart(filterLine(state.data[state.view]));
    stackChart(filterBar(state.data[state.view]));
    geoViz({"data":state.data[state.view],"info":state.data["geo"]});
    csTopFive(filterCsBar(state.data["crime"])[0]);
    csOverTime({"actual":filterLine(state.data["crime"]).filter(a => a.neighborhood == "Chester Square"),"perceived":transformSurvey(state.data["survey"])})
}

const updateViz = () => {
  removeChart();
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
    e.preventDefault()
    state.setView = btn.attributes["data-activity"].nodeValue;
  })
});

load();
