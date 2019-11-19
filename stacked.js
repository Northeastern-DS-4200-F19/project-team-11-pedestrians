d3.csv("./data/csv_files/crime.csv", function(d) {
  return {
    neighborhood: d.neighborhoods,
    offense_type: d.offense_type,
    count: d.count,
  };
}).then(stackChart);

function stackChart(data){
    var neighborhoods = getNeighborhoods(data);
  console.log(data)


  var splitbyoffense = d3.nest()
  .key(function(d) { return d.neighborhood})
  .key(function(d) { return d.offense_type})
  .rollup(function(v) { return d3.sum(v, function(d) { return d.count; }); })
  .entries(data);

  console.log(splitbyoffense);



  var allGroup = d3.map(data, function(d){return(d.offense_type)}).keys()
  console.log(allGroup);


  //   var minSafetyLevel = 0;
  //   var maxSafetyLevel = d3.max(data, function(d){ return d.crimecount;});
  //
  var width  = 1000;
  var height = 500;
    var margin = {
      top: 30,
      bottom: 80,
      left: 50,
      right: 75
    };

  var svg = d3.select('#vis5')
              .attr('width' , width)
              .attr('height', height)
              .style('background', '#efefef');

  var chartGroup = svg.append('g')
                        .append('svg')
                        .attr('transform','translate(' + margin.left +',' + margin.top + ')');
  //
  var xScale = d3.scaleBand()
                 .domain(getNeighborhoods(data))
                 // Shifting by 50 so the last category label doesn't get cut off
                 .range([0, width - margin.right]);
  //
  //   var yScale = d3.scaleLinear()
  //                  .domain([minSafetyLevel, maxSafetyLevel])
  //                  .range([height, 0]);
  //
  var xAxis = d3.axisBottom(xScale);
  //
  //   var yAxis = d3.axisLeft(yScale);
  //
  chartGroup.append('g')
            .attr('class', 'x_axis')
            .attr('transform', 'translate('+ margin.left+', ' + (height - margin.bottom) + ')')
            .call(xAxis)
            .selectAll("text")
            .attr("text-anchor","end")
            .attr("transform","rotate(-90)");

  //   chartGroup.append('g')
  //             .attr('class', 'y_axis')
  //             .attr('transform', 'translate('+ margin.left +', ' + margin.top+')')
  //             .call(yAxis);
  //
  //   var rects = chartGroup
  //               .selectAll("rect")
  //               .data(data)
  //               .enter()
  //               .append("rect")
  //               .attr("class", "derp")
  //               .attr("x", function (d) { return xScale(d.offenseType) + margin.left + 3;})
  //               .attr("width",xScale.bandwidth() - 3)
  //               .attr("y", function (d) { return yScale(d.crimecount) - margin.bottom})
  //               .attr("height", function (d) {return height - yScale(d.crimecount)})
  //               .style("fill", "#69b3a2")
  //
  //   rects.selectAll("rect")
  //           .attr("class", "derp")
  //           .attr("x", function (d) { return xScale(d.offenseType) + margin.left + 3; } )
  //           .attr("width", xScale.bandwidth() - 3)
  //           .attr("y", function (d) { return yScale(d.crimecount)} )
  //           .attr("height", function (d) {return height - yScale(d.crimecount) - margin.top})
  //           .style("fill", "#69b3a2")
  //
  //   rects.exit().remove();
  }


function getNeighborhoods(data) {
  var neighborhoods = [];
  for (i = 0; i < data.length; i++) {
    if(neighborhoods.includes(data[i]["neighborhood"])){

    } else {
      neighborhoods.push(data[i]["neighborhood"])
    }
  }
  neighborhoods = neighborhoods.filter(e => e !== '');
  return neighborhoods
}
