var width  = 500;
var height = 400;
var margin = {
  top: 30,
  bottom: 30,
  left: 50,
  right: 30
};

const centerBoston = [-71.057,42.313]
const graphHeight = height - margin.top - margin.bottom;
const graphWidth = width - margin.left - margin.right;
const canvas = d3.select("#geovis")
              .attr("class", "geoVis")
              .attr("height",height)
              .attr("width",width)
  const graph = d3.select("#geovis").append("svg");
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
const update = (deets) => {
  var info = deets.info

  var title = "";
  if(state["view"] == "crime"){
    title = "Crime Choropleth Map of Boston";
  } else if (state["view"] == "real_estate") {
    title = "Real Estate Choropleth Map of Boston";
  } else if (state["view"] == "demographic") {
    title = "Education Choropleth Map of Boston"
  }

  d3.select(".title2").remove();
  d3.select("#geovis").append("text")
            .attr("x", 250)
            .attr("y", 20)
            .attr("class", "title2")
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text(title);

  var stuff = d3.nest().key(function(d) {return d.neighborhood})
                  .rollup(function(v) {return d3.sum(v,function(d){return d.value})})
                  .object(deets.data);
  var daMax = Math.max(...Object.keys(stuff).map(key => stuff[key])); 
  var color = d3.scaleLinear().domain([0,daMax]).range(["white",state.colors[state["view"]]]);
  var paths = graph.selectAll("path").data(info.features);

  //removing stuff
  paths.exit().remove();

  //adding stuff
  paths.enter()
        .append('path')
        .merge(paths)
        .attr('d', geoGenerator)
        .attr("fill",d => {
          if(stuff[d.properties.Name] == null) {
            return "black"
          } else {
            return color(stuff[d.properties.Name])
          }})
        .attr("stroke",(d) => {
          if(state["neighborhood"].includes(d["properties"]["Name"])) {
            return "black"
          } else {
            return "grey"
          }
        })
        .attr("stroke-width",(d) => {
          if(state["neighborhood"].includes(d["properties"]["Name"])) {
            return 3;
          } else {
            return 1;
          }
        })
        .on("mouseover", function(d){show(d,this);})
        .on("click",function(d){show(d,this)})
        .on("mouseout",function(d){hide(d,this);});

    var show = (d) => {
      state.setN = [d.properties.Name];
    };

    var hide = (d,target) => {
      state.setN = "";
    };
}

const geoViz = (d) => {
  update(d);
}