var width  = 1280;
var height = 720;
var margin = {
  top: 30,
  bottom: 30,
  left: 50,
  right: 30
};
var state = 'crimes'
var colors = {"crimes":"red","real_estate":"green"}
var tip = d3.tip()
            .attr("class","tip")
            .html(d => {
              return `<p><span>${d["properties"]["Name"]}</span><br>Total Crime: ${Math.round(d["properties"][state])}</p>`
            });
var data = {}
const centerBoston = [-71.057,42.313]
const graphHeight = height - margin.top - margin.bottom;
const graphWidth = width - margin.left - margin.right;

const graph = d3.select("#vis-svg")
              .attr("height",graphHeight)
              .attr("width",graphWidth)
              .attr("transform", `translate(${margin.left},${margin.bottom})`);

graph.call(tip);

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
const update = (d) => {
    data = d
  //TODO convert to per feet not raw values
    var stuff = data["features"].map(d => Math.round(d["properties"][state]))
    var daMax = Math.max(...stuff);
    console.log(daMax)
    var color = d3.scaleLinear().domain([0,daMax]).range(["white",colors[state]])
    var paths = graph.selectAll("path")
                        .data(data.features)
                        .enter()
                        .append('path')
                        .attr("fill",d => {
                          color(d["properties"][state])})
                        .attr("stroke","grey")
                        .attr("stroke-width",1)
                        .attr('d', geoGenerator)
                        .on("mouseover",tip.show)
                        .on("mouseout",tip.hide)
                   
    // projection.fitSize([width,height],plane);
    //painting
    paths.attr("fill",d => {
      return color(d["properties"][state])})
          .attr("stroke","grey")
          .attr("stroke-width",1)
          .attr('d', geoGenerator)
          .attr("class","neighborhoods")
          .on("mouseover",tip.show)
          .on("mouseout",tip.hide);

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

const letsGo = (data) => {
    update(data[0]);
}

Promise.all(promises).then(letsGo);