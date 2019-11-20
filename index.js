const stateBttns = document.querySelectorAll(".btn")
var colors = {"crime":"red","real_estate":"green"}
var state = {view:'crime',neighborhood:"", set setN(x) {
  this.neighborhood = x;
  removeChart();
  geoViz(db[3])
  lineChart(filterLine(db[lineIndex]));
  stackChart(filterBar(db[lineIndex]));
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
        d3.csv("./data/csv_files/ChesterSquareSurveyResponses.csv",function(d) {
                    return {
                      visittime: d.visittime,
                      safetylevel: + d.safetylevel
                    }}),
        d3.json("./data/json_files/bostonv2.geojson")
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
      return d.filter(obj => obj.neighborhood === state.neighborhood).map((item) => {
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

var btn1 = document.querySelector(".btn1")
var btn2 = document.querySelector(".btn2")

btn1.addEventListener("click" , (e) => {
  console.log(0)
  state["view"] = btn1.attributes["data-activity"].nodeValue;
  lineIndex = 0
  d3.selectAll(".derp").remove()
  d3.selectAll(".x_axis").remove()
  d3.selectAll(".y_axis").remove()
  geoViz(db[3])
  lineChart(filterLine(db[lineIndex]))
  stackChart(filterBar(db[lineIndex]));
})

btn2.addEventListener("click" , (e) => {
  console.log(1)
  state["view"] = btn2.attributes["data-activity"].nodeValue;
  lineIndex = 1
  d3.selectAll(".derp").remove()
  d3.selectAll(".x_axis").remove()
  d3.selectAll(".y_axis").remove()
  geoViz(db[3])
  lineChart(filterLine(db[lineIndex]))
  stackChart(filterBar(db[lineIndex]));
})

// btn3.addEventListener("click" , e => {
//   state["view"] = btn.attributes["data-activity"].nodeValue;
//   lineIndex = 0
//   d3.selectAll(".derp").remove()
//   d3.selectAll(".x_axis").remove()
//   d3.selectAll(".y_axis").remove()
//   geoViz(db[3])
//   lineChart(filterLine(db[lineIndex]))
//   stackChart(filterBar(db[lineIndex]));
// })
// stateBttns.forEach(btn => {
//     btn.addEventListener("click",(e) => {
//         e.preventDefault();
//         state["view"] = btn.attributes["data-activity"].nodeValue;
//         lineIndex = (lineIndex + 1) % 2
//         d3.selectAll(".derp").remove()
//         d3.selectAll(".x_axis").remove()
//         d3.selectAll(".y_axis").remove()
//         geoViz(db[3])
//         lineChart(filterLine(db[lineIndex]))
//         stackChart(filterBar(db[lineIndex]));
//     });
// });

render();