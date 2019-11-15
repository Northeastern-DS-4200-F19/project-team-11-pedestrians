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
<<<<<<< HEAD
<<<<<<< HEAD
var state = 'crime'
=======
var state = {view:'crime',neighborhood:""};
>>>>>>> 91828fdb072333220450f58d900517b19ebc4e14
=======
var state = {view:'crime',neighborhood:""};
>>>>>>> 91828fdb072333220450f58d900517b19ebc4e14
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
<<<<<<< HEAD
<<<<<<< HEAD
              return `<p class="tool"><span>${d["properties"]["Name"]}</span><br>Total ${state}: ${Math.round(d["properties"][state])}</p>`
            });
    graph.call(tip);
  //TODO convert to per feet not raw values
  var stuff = info["features"].map(d => Math.round(d["properties"][state]))
  var daMax = Math.max(...stuff);
  var color = d3.scaleLinear().domain([0,daMax]).range(["white",colors[state]])
=======
              return `<p class="tool"><span>${d["properties"]["Name"]}</span><br>Total ${state["view"]}: ${Math.round(d["properties"][state["view"]])}</p>`
            });
    graph.call(tip);
  //TODO convert to per feet not raw values
  var stuff = info["features"].map(d => Math.round(d["properties"][state["view"]]))
  var daMax = Math.max(...stuff);
  var color = d3.scaleLinear().domain([0,daMax]).range(["white",colors[state["view"]]])
>>>>>>> 91828fdb072333220450f58d900517b19ebc4e14
=======
              return `<p class="tool"><span>${d["properties"]["Name"]}</span><br>Total ${state["view"]}: ${Math.round(d["properties"][state["view"]])}</p>`
            });
    graph.call(tip);
  //TODO convert to per feet not raw values
  var stuff = info["features"].map(d => Math.round(d["properties"][state["view"]]))
  var daMax = Math.max(...stuff);
  var color = d3.scaleLinear().domain([0,daMax]).range(["white",colors[state["view"]]])
>>>>>>> 91828fdb072333220450f58d900517b19ebc4e14
  var paths = graph.selectAll("path").data(info.features)

    //updating stuff
    paths.attr('d', geoGenerator)
          .attr("fill",d => {
<<<<<<< HEAD
<<<<<<< HEAD
              return color(d["properties"][state])
            })
          .attr("stroke","grey")
          .attr("stroke-width",1)
=======
              return color(d["properties"][state["view"]])
            })
          .attr("stroke","grey")
=======
              return color(d["properties"][state["view"]])
            })
          .attr("stroke","grey")
>>>>>>> 91828fdb072333220450f58d900517b19ebc4e14
          .attr("stroke-width",(d) => {
            if(d["properties"]["Name"] === state["neighborhood"]) {
              return 3
            } else {
              return 1
            }
          })
<<<<<<< HEAD
>>>>>>> 91828fdb072333220450f58d900517b19ebc4e14
=======
>>>>>>> 91828fdb072333220450f58d900517b19ebc4e14
          .attr("class","neighborhoods")
          .on("mouseover",function(d){show(d,this)})
          .on("mouseout",function(d){hide(d,this)})

    //removing stuff
    paths.exit().remove();
<<<<<<< HEAD

<<<<<<< HEAD
    //removing stuff
    paths.exit().remove();

=======
>>>>>>> 91828fdb072333220450f58d900517b19ebc4e14
    //adding stuff
    paths.enter()
          .append('path')
          .attr('d', geoGenerator)
          .attr("fill",d => {
<<<<<<< HEAD
            return color(d["properties"][state])})
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
    //         return d.properties["Name"];
    //       })
    //       .attr("text-anchor","end")
    //       .attr("fill","white")
    //       .attr("font-size","8")
    //       .attr("class","labels");
    
=======
=======

    //adding stuff
    paths.enter()
          .append('path')
          .attr('d', geoGenerator)
          .attr("fill",d => {
>>>>>>> 91828fdb072333220450f58d900517b19ebc4e14
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
<<<<<<< HEAD
>>>>>>> 91828fdb072333220450f58d900517b19ebc4e14
=======
>>>>>>> 91828fdb072333220450f58d900517b19ebc4e14
}

//load all datasets here
var promises = [
    d3.json("./data/bostonv2.geojson")
]

const letsGo = (d) => {
  update(d[0]);
}

<<<<<<< HEAD
<<<<<<< HEAD
Promise.all(promises).then((d) => letsGo(d));
=======
const render = () => Promise.all(promises).then((d) => letsGo(d));

render()
>>>>>>> 91828fdb072333220450f58d900517b19ebc4e14
=======
const render = () => Promise.all(promises).then((d) => letsGo(d));

render()
>>>>>>> 91828fdb072333220450f58d900517b19ebc4e14
