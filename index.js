const stateBttns = document.querySelectorAll(".btn")
var colors = {"crime":"red","real_estate":"green"}
var state = {view:'crime',neighborhood:"", set setN(x) {
  this.neighborhood = x;
  removeChart();
  lineChart(filterLine(db[lineIndex]));
  stackChart(filterBar(db[0]));
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
                            hour: parseInt(d.hour),
                            crimecount: + d.count,
                            neighborhood: d.neighborhoods,
                            offenseType: d.offense_type.split(' ')[0]
                          };
                        }),
        d3.csv("./data/csv_files/real_estate.csv",function(d){
          return {
                      hour: d.Date,
                      crimecount: + d.Value,
                      neighborhood: d.neighborhood
                    };
                  }),
        d3.csv("./data/csv_files/ChesterSquareSurveyResponses.csv",function(d) {
                    return {
                      visittime: d.visittime,
                      safetylevel: + d.safetylevel
                    }}),
        d3.json("./data/json_files/bostonv2.geojson"),
    ]

const filterBar = (d) => {
  var result = {}
  var rArray = []
  var offenseTypes = new Set(d.map(obj => obj.offenseType));
  var neighborhoods = new Set(d.map(obj => obj.neighborhood))
  neighborhoods.forEach(n => {
    row = {}
    offenseTypes.forEach(ot => {
      row[ot] = 0
    })
    result[n] = row
  })
  d.forEach(obj => {
    result[obj.neighborhood][obj.offenseType] = result[obj.neighborhood][obj.offenseType] + obj.crimecount
  })
  Object.keys(result).forEach(neighborhood => {
    row = result[neighborhood]
    filtered_row = {}
    sortedKeys = Object.keys(result[neighborhood]).sort((a,b) => {
      return result[neighborhood][b] - result[neighborhood][a]}
      )
    for(let i = 0; i < 5; i++) {
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
        return {"hour":parseInt(item.hour),"crimecount": item.crimecount}
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
        rArray.push({"hour": new Date(key).getFullYear(), "crimecount": result[key]});
      })
      return rArray.sort((a,b) => a.hour > b.hour);
    } else {
      return d.filter(obj => obj.neighborhood === state.neighborhood).map((item) => {
        return {"hour":new Date(item.hour).getFullYear(),"crimecount": item.crimecount / 1000}
      }).sort((a,b) => a.hour > b.hour);
    }
  }
}

const letsGo = (d) => {
        db = d;
        scatterplot(d[2]);
        lineChart(filterLine(d[lineIndex]));
        stackChart(filterBar(d[0]));
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
        d3.selectAll(".derp").remove()
        d3.selectAll(".x_axis").remove()
        d3.selectAll(".y_axis").remove()
        lineChart(filterLine(db[lineIndex]))
        stackChart(filterBar(db[0]));
    });
});

render();
