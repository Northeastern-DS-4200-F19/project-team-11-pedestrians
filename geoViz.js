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
const canvas = d3.select("#vis-svg")
              .attr("height",height)
              .attr("width",width)
              .attr("border","black")
              .append("rect")
              .attr("x",0)
              .attr("y",0)
              .attr("height",height)
              .attr("width",width)
              // .attr("stroke","black")
              // .attr("stroke-width","border")
              .attr("fill","none")
  const graph = d3.select("#vis-svg").append("svg");
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
  console.log(deets.data)
  var info = deets.info
  // // Add brushing
  // d3.select("#vis-svg")
  //       .call( d3.brush()                     // Add the brush feature using the d3.brush function
  //         .extent( [ [0,0], [400,400] ] )       // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
  //       )

  var title = "";
  console.log(title);

  if(state["view"] == "crime"){
    title = "Crime Choropleth Map of Boston";
  } else if (state["view"] == "real_estate") {
    title = "Real Estate Choropleth Map of Boston";
  }

  d3.select(".title2").remove();
  d3.select("#vis-svg").append("text")
            .attr("x", 250)
            .attr("y", 20)
            .attr("class", "title2")
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text(title);

  var tip = d3.tip()
            .attr("class","tip")
            .html(d => {
              return `<div class="card blue-grey darken-1">
              <div class="card-content white-text">
              <div class="card-title"><span>${d["properties"]["Name"]}</span></div>
              <p class="tool"><br>Total ${state["view"]}: ${Math.round(stuff[d.properties.Name])}</p>
              </div>
              </div>`
            })
            .attr("x", width).attr("y", height);

            var hide = (d,target) => {
              console.log("Hidden")
              state.setN = "";
              d3.select(".tip").remove();
              tip.hide(d,this);
              d3.select(target).attr("stroke","grey");
            };

  var stuff = d3.nest().key(function(d) {return d.neighborhood})
                  .rollup(function(v) {return d3.sum(v,function(d){return d.value})})
                  .object(deets.data);
  var daMax = Math.max(...Object.keys(stuff).map(key => stuff[key]));
  console.log(daMax)
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
          console.log(stuff[d.properties.Name])
          return color(stuff[d.properties.Name])})
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

    var show = (d,target) => {
      state.setN = d.properties.Name;
      // tip.show(d,target);
      // d3.select(target).attr("stroke","blue");
    };

    var hide = (d,target) => {
      state.removeN = [];
      // tip.hide(d);
      // d3.select(target).attr("stroke","grey");
    };

    graph.call(brush);
    function brush (g) {
      const nlist = []
      const brush = d3.brush().on("end",brushEnd)
      .extent([
        [-margin.left,-margin.bottom],
        [width+margin.right, height + margin.top] 
      ]);

    g.call(brush);
    
    function brushEnd(){
      // We don't want infinite recursion
      if(d3.event.sourceEvent.type!="end"){
        d3.select(this).call(brush.move, null);
      } 
      if (d3.event.selection === null) return;

      const [
        [x0, y0],
        [x1, y1]
      ] = d3.event.selection; 
      // If within the bounds of the brush, select it
      
      // d3.selectAll(".layer").each(function(d){
      //   var neighborhood = d3.select(this).attr("id")
      //   var x = geoGenerator(neighborhood);
      //   if(x0 <= x && x1 >= x) {
      //     nlist.push(d3.select(this).attr("id"))
      //   }
      //   // state.setN = nlist
      // })
      console.log(d3.event.selection)
      console.log(new Set(nlist))
      state.setN = new Set(nlist)
     }  
    }
}

const geoViz = (d) => {
  update(d);
}
