var width  = 400;
var height = 300;
var margin = {
  top: 30,
  bottom: 30,
  left: 50,
  right: 30
};

const centerBoston = [-71.057,42.313]
const graphHeight = height - margin.top - margin.bottom;
const graphWidth = width - margin.left - margin.right;
const canvas = d3.select("#vis-svg")
              .attr("height",height)
              .attr("width",width)
              .attr("border","black")
              .append("rect")
              .attr("x",0)
              .attr("y",0)
              .attr("height",height)
              .attr("width",width)
              .attr("stroke","black")
              .attr("stroke-width","border")
              .attr("fill","none")
  const graph = d3.select("#vis-svg").append("svg")
                            // .attr("transform", `translate(${margin.left},${margin.top})`);

//lon and lat to x and y
 var albersProjection = d3.geoAlbers()
    .scale( 90000 )
    .rotate( [71.107,0] )
    .center( [0, 42.333] )
    .translate( [graphWidth/2,graphHeight/2] );

var geoGenerator = d3.geoPath()
    .projection(albersProjection);

//the update function
const update = (info) => {
  var tip = d3.tip()
            .attr("class","tip")
            .html(d => {
              return `<div class="card blue-grey darken-1">
              <div class="card-content white-text">
              <div class="card-title"><span>${d["properties"]["Name"]}</span></div>
              <p class="tool"><br>Total ${state["view"]}: ${Math.round(d["properties"][state["view"]])}</p>
              </div>
              </div>`
            })
            .attr("x", width).attr("y", height)
  var stuff = info["features"].map(d => Math.round(d["properties"][state["view"]]));
  var daMax = Math.max(...stuff);
  var color = d3.scaleLinear().domain([0,daMax]).range(["white",colors[state["view"]]]);
  var paths = graph.selectAll("path").data(info.features);
  graph.call(tip);
  

    //removing stuff
    paths.exit().remove();
    //adding stuff
    paths.enter()
          .append('path')
          .merge(paths)
          .attr('d', geoGenerator)
          .attr("fill",d => {
            return color(d["properties"][state["view"]])})
          .attr("stroke",(d) => {
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
          .on("mouseover", function(d){  d3.select(this).attr("stroke","blue");})
          .on("click",function(d){show(d,this)})
          .on("mouseout",function(d){hide(d,this);});

    // var show = (d,target) => {
    //   state.setN = d["properties"]["Name"];
    //   tip.show(d,target);
    //   d3.select(target).attr("stroke","blue");
    // };

    // var hide = (d,target) => {
    //   state.setN = "";
    //   tip.hide(d);
    //   d3.select(target).attr("stroke","grey");
    // };
}

const geoViz = (d) => {
  update(d);
}
