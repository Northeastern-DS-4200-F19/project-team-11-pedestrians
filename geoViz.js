var width  = 1280;
var height = 720;
var margin = {
  top: 30,
  bottom: 30,
  left: 50,
  right: 30
};
var colors = {"crime":"red","real_estate":"green"}
var data = []
const centerBoston = [-71.057,42.313]
const graphHeight = height - margin.top - margin.bottom;
const graphWidth = width - margin.left - margin.right;

const graph = d3.select("#vis-svg")
              .attr("height",graphHeight)
              .attr("width",graphWidth)
              .attr("transform", `translate(${margin.left},${margin.bottom})`);

//lon and lat to x and y
var projection = d3.geoEquirectangular()                   

 var albersProjection = d3.geoAlbers()
    .scale( 190000 )
    .rotate( [71.057,0] )
    .center( [0, 42.313] )
    .translate( [width/2,height/2] );

var geoGenerator = d3.geoPath()
    .projection(albersProjection);

//the update function
const update = (data) => {
  var tip = d3.tip()
            .attr("class","tip")
            .html(d => {
              return `<p><span>${d["properties"]["Name"]}</span><br>Total ${state}: ${Math.round(d["properties"][state])}</p>`
            });
    graph.call(tip);
  //TODO convert to per feet not raw values
    var stuff = data["features"].map(d => Math.round(d["properties"][state]))
    var daMax = Math.max(...stuff);
    console.log(daMax)
    var color = d3.scaleLinear().domain([0,daMax]).range(["white",colors[state]])
    var paths = graph.selectAll("path").data(data.features)
    paths.exit().remove();
    // projection.fitSize([width,height],plane);
    //painting
    paths.attr('d', geoGenerator)
          .attr("fill",d => {
      return color(d["properties"][state])})
          .attr("stroke","grey")
          .attr("stroke-width",1)
          .attr("class","neighborhoods")
          .on("mouseover",tip.show)
          .on("mouseout",tip.hide);

          paths.enter()
          .append('path')
          .attr('d', geoGenerator)
          .attr("fill",d => {
            color(d["properties"][state])})
          .attr("stroke","grey")
          .attr("stroke-width",1)
          .on("mouseover",tip.show)
          .on("mouseout",tip.hide)
    // var labels = graph.selectAll(".labels")
    //       .data(data.features)
    //       .enter()
    //       .append('text')
    //       .attr("transform", (d) => {
    //         return `translate(${geoGenerator.centroid(d)})`
    //       })
    //       .text(d => {
    //         return d.properties.Name;
    //       })
    //       .attr("text-anchor","end")
    //       .attr("fill","white")
    //       .attr("font-size","10")
    //       .attr("class","labels");
    
}

//load all datasets here
var promises = [
    //d3.json("./data/map.topojson")
    d3.json("./data/bostonv2.geojson")
]

const letsGo = (d) => {
  data = d
  update(data[0]);
}

Promise.all(promises).then(letsGo);
