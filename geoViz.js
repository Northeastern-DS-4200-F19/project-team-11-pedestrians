var width  = 1280;
var height = 720;
var margin = {
  top: 30,
  bottom: 30,
  left: 50,
  right: 30
};
const centerBoston = [-71.0589,42.3601]
const graphHeight = height - margin.top - margin.bottom;
const graphWidth = width - margin.left - margin.right;

const svg = d3.select("#vis-svg")
const graph = svg.append("g").attr("height",graphHeight).attr("width",graphWidth);
//lon and lat to x and y
var projection = d3.geoEquirectangular()                   
                    .center(centerBoston)
                    .scale(100000);

 var albersProjection = d3.geoAlbers()
    .scale( 190000 )
    .rotate( [71.057,0] )
    .center( [0, 42.313] )
    .translate( [width/2,height/2] );

var geoGenerator = d3.geoPath()
    .projection(projection);

//the update function
const update = data => {
    console.log(data);
    // var b = geoGenerator.bounds(plane)
    // var s = .9 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
    // var t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
    // var plane = topojson.feature(data, data.objects.collection).features;
    // var paths = graph.selectAll("path").data(plane)
    var paths = graph.selectAll("path").data(data.features);
    // projection .fitSize([width,height],plane);
    //painting
    paths.enter()
    .append('path')
    .attr("fill","#fff")
    .attr("stroke","#333")
    .attr('d', geoGenerator);
    
}

//load all datasets here
var promises = [
    d3.json("./data/map.topojson")
    // d3.json("./data/boston.geojson")
]

const go = (data) => {
    update(data[0]);
}

Promise.all(promises).then(go);
