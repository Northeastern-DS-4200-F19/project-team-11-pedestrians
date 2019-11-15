const stateBttns = document.querySelectorAll(".btn")
var colors = {"crime":"red","real_estate":"green"}
var state = {view:'crime',neighborhood:""};

//load all datasets here
var promises = [
        d3.csv("./data/ChesterSquareSurveyResponses.csv",function(d) {
                  return {
                    visittime: d.visittime,
                    safetylevel: + d.safetylevel
                  }}),
        d3.csv("./data/aggregatecrime.csv",function(d){
                return {
                            hour: d.hour,
                            crimecount: + d.crimecount
                          };
                        }),
        d3.json("./data/bostonv2.geojson")
    ]

const filterLine = (d) => {
  
}

const letsGo = (d) => {
        scatterplot(d[0]);
        lineChart(d[1]);
        geoViz(d[2]);
} 

const render = () => {
        Promise.all(promises).then(letsGo);
};

stateBttns.forEach(btn => {
    btn.addEventListener("click",(e) => {
        e.preventDefault();
        state["view"] = btn.attributes["data-activity"].nodeValue;
        render()
    });
});

render();