var width  = 960;
var height = 720;
var margin = {
  top: 30,
  bottom: 30,
  left: 50,
  right: 30
};
var colors = {"crime":"red","real_estate":"green"}
const centerBoston = [-71.057,42.313]
const graphHeight = height - margin.top - margin.bottom;
const graphWidth = width - margin.left - margin.right;
var state = {view:'crime',neighborhood:""};
const graph = d3.select("#vis-svg")
              .attr("height",graphHeight)
              .attr("width",graphWidth)
              .attr("transform", `translate(${margin.left},${margin.bottom})`);

//lon and lat to x and y              
 var albersProjection = d3.geoAlbers()
    .scale( 190000 )
    .rotate( [71.057,0] )
    .center( [0, 42.313] )
    .translate( [width/2,height/2] );

var geoGenerator = d3.geoPath()
    .projection(albersProjection);

//the update function
const update = (info) => {
  var tip = d3.tip()
            .attr("class","tip")
            .html(d => {
              return `<p class="tool"><span>${d["properties"]["Name"]}</span><br>Total ${state["view"]}: ${Math.round(d["properties"][state["view"]])}</p>`
            });
    graph.call(tip);
  //TODO convert to per feet not raw values
  var stuff = info["features"].map(d => Math.round(d["properties"][state["view"]]))
  var daMax = Math.max(...stuff);
  var color = d3.scaleLinear().domain([0,daMax]).range(["white",colors[state["view"]]])
  var paths = graph.selectAll("path").data(info.features)

    //updating stuff
    paths.attr('d', geoGenerator)
          .attr("fill",d => {
              return color(d["properties"][state["view"]])
            })
          .attr("stroke","grey")
          .attr("stroke-width",(d) => {
            if(d["properties"]["Name"] === state["neighborhood"]) {
              return 3
            } else {
              return 1
            }
          })
          .attr("class","neighborhoods")
          .on("mouseover",function(d){show(d,this)})
          .on("mouseout",function(d){hide(d,this)})

    //removing stuff
    paths.exit().remove();

    //adding stuff
    paths.enter()
          .append('path')
          .attr('d', geoGenerator)
          .attr("fill",d => {
            return color(d["properties"][state["view"]])})
          .attr("stroke",(d) => {
            console.log(d["properties"]["Name"])
            console.log(state["neighborhood"])
            if(d["properties"]["Name"] === state["neighborhood"]) {
              return "blue"
            } else {
              return "grey"
            }
          })
          .attr("stroke-width",(d) => {
            if(d["properties"]["Name"] === state["neighborhood"]) {
              return 5
            } else {
              return 1
            }
          })
          .on("mouseover",function(d){show(d,this)})
          .on("mouseout",function(d){hide(d,this)})

    var show = (d,target) => {
      state["neighborhood"] = d["properties"]["Name"];
      tip.show(d,target);
      d3.select(target).attr("stroke","blue");
    };

    var hide = (d,target) => {
      state["neighborhood"] = "";
      tip.hide(d,target);
      d3.select(target).attr("stroke","grey");
    };
}

//load all datasets here
var promises = [
    d3.json("./data/bostonv2.geojson")
]

const letsGo = (d) => {
  update(d[0]);
}

const render = () => Promise.all(promises).then((d) => letsGo(d));

render()