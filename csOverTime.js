function csOverTime(deets){
  console.log(deets["perceived"])
    // Acknowledgement
    // https://bl.ocks.org/d3noob/814a2bcb3e7d8d8db74f36f77c8e6b7f
    var data = d3.nest()
                .key(function(d) { return d.time; })
                .rollup(function(v) { return d3.sum(v, function(d) { return d.value; }); })
                .entries(deets["actual"])
                .sort((a,b) => { return d3.ascending(parseInt(a.key), parseInt(b.key))})
    var width  = 600;
    var height = 400;
    var margin = {
      top: 40,
      bottom: 75,
      left: 75,
      right: 75
    };
    var mintime = d3.min(data, function(d){return parseInt(d.key);});
    var maxtime = d3.max(data, function(d){return parseInt(d.key);});
    var minvalue = 0;
    var maxvalue  = d3.max(data, function(d){return d.value;});
    var maxvalueII = Math.max(...Object.values(deets["perceived"]));

    d3.select(".x_axis_label").remove();
    d3.select(".y_axis_label").remove();
    d3.select(".title").remove();
  
    var title = "";
    var x_axis_label = "";
    var y_axis_label = "";
  
    if(state["view"] == "crime"){
      title = "Crime By Hour in Chester Square";
      y_axis_label = "Crime Count";
      x_axis_label = "Hour of Day";
    } else if (state["view"] == "real_estate") {
      title = "Real Estate Prices over Time";
      y_axis_label = "Average Price Per Square Feet";
      x_axis_label = "Year";
    } else if (state["view"] == "demographic") {
      title = "Bachelor's Degrees Over Time";
      y_axis_label = "Bachelor's Degrees Per Year";
      x_axis_label = "Year";
    }
  
    var svg = d3.select('#vis8')
                .attr("class", "vis8")
                .attr('width' , width)
                .attr('height', height)
                .append("rect")
                .attr("x",0)
                .attr("y",0)
                .attr("height",height)
                .attr("width",width)
                .attr("stroke","black")
                .attr("stroke-width","border")
                .attr("fill","none");
                // .style('background', '#efefef');
  
    var chartGroup = d3.select('#vis8').append('g')
                        .append('svg')
                        .attr('transform','translate(' + margin.left +',' + margin.top + ')');
  
    // Adding Graph Title
    chartGroup.append("text")
            .attr("x", width/2)
            .attr("y", margin.top - 20)
            .attr('class', 'title')
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("text-decoration", "underline")
            .text(title);
  
    var xScale = d3.scaleLinear()
                   .domain([mintime, maxtime])
                   .range([margin.left, width - margin.right]);
  
    var yScale = d3.scaleLinear()
                   .domain([minvalue, maxvalue])
                   .range([height - margin.bottom - margin.top, 0]);
    
    var yScaleII = d3.scaleLinear()
                   .domain([minvalue, 10])
                   .range([height - margin.bottom - margin.top, 0]);

    var xAxis = d3.axisBottom(xScale);
  
    var yAxis = d3.axisLeft(yScale);
    var yAxisII = d3.axisRight(yScaleII);
  
    var x_axis = chartGroup.append('g')
              .attr('transform', 'translate(0, ' + (height - margin.bottom) + ')')
              .call(xAxis)
              .style("font-size", "14px");
  
  
    // Adding X-Axis Label
    chartGroup.append("text")
              .attr("x", width/2)
              .attr("y", height - margin.bottom + 40)
              .attr("text-anchor", "middle")
              .style("font-size", "16px")
              .text(x_axis_label);
  
    var y_axis = chartGroup.append('g')
              .attr('transform', 'translate('+ margin.left +', ' + margin.top+')')
              .call(yAxis)
              .style("font-size", "14px");

    var y_axis_ii = chartGroup.append('g')
              .attr('transform', 'translate('+ (width - margin.right) +', ' + margin.top+')')
              .call(yAxisII)
              .style("font-size", "14px");
  
    // Adding Y-Axis Label
    chartGroup.append("text")
              .attr("transform", "rotate(-90)")
              .attr("x", -height/2)
              .attr("y", margin.left/2)
              .style("font-size", "16px")
              .attr("text-anchor", "middle")
              .text(y_axis_label);

    // Second Y Axis
              chartGroup.append("text")
              .attr("transform", "rotate(-90)")
              .attr("x", -height/2)
              .attr("y", width - margin.right/2)
              .style("font-size", "16px")
              .attr("text-anchor", "middle")
              .text("Perceived Safety");
  
    var paths = chartGroup
              .datum(data)
              .append("path")
              .attr("fill", "none")
              .attr("stroke", d => {
                return state.colors[state["view"]]})
              .attr("stroke-width", 1.5)
              .attr("d", d3.line()
              .x(function (d) {
                return xScale(d.key); })
              .y(function (d) { 
                return yScale(d.value) + margin.top; }));

    var pathII = chartGroup
                .datum(deets["perceived"])
                .append("path")
                .attr("fill", "none")
                .attr("stroke", d => {
                  return "orange"})
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                .x(function (d) {
                  return xScale(d.key); })
                .y(function (d) { 
                  return yScaleII(d.value) + margin.top; }));
    
                  var z = d3.scaleOrdinal()
                  .range(["red","orange"])
                  .domain(["actual","perceived"]);

    var y = d3.scaleLinear()
                      .domain([0,100])
                      .range([(height - margin.bottom - margin.top), margin.top])

    // var legend = chartGroup.append("g")
    //                         .selectAll("circle")
    //                         .data(deets, d => d.key)
    //                         .enter()
    //                         .append("circle")
    //                         .merge(legend)
    //                         .attr("cx", width - margin.right)
    //                         .attr("cy",(d,i) => y(i*5))
    //                         .attr("r",10)
    //                         .attr("stroke","black")
    //                         .attr("fill",d => z(d));

    // Gotta fix that circle stuff dude
    // var dots = chartGroup
    //               .append("g")
    //               .selectAll("dot")
    //               .datum(deets["survey"])
    //               .enter()
    //               .append("circle")
    //               .attr("cx", function (d) { return xScale(d.key) + margin.left; })
    //               .attr("cy", function (d) { return yScaleII(d.value) + margin.top; })
    //               .attr("r", 10)
    //               .style("fill", "#69b3a2");
    paths.exit().remove();
    chartGroup.exit().remove()
  dots.exit().remove()
  }
  