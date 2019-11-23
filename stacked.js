  //   var minSafetyLevel = 0;
  //   var maxSafetyLevel = d3.max(data, function(d){ return d.value;});
  //
  var width  = 1100;
  var height = 700;
    var margin = {
      top: 20,
      bottom: 115,
      left: 50,
      right: 100
    };

function stackChart(deets){


  console.log(deets)
  var neighborhoods = [... new Set(deets.map(d => d.neighborhood  ))]
  var offenses = [... new Set(deets.reduce((a,b) => {
    let keys = Object.keys(b)
    keys.pop()
    return a.concat(keys)
  },[]))]

  offenses.pop()

  var totals = {}
  deets.forEach(obj => {
    total = 0
    let keys = Object.keys(obj)
    keys.pop()
    keys.forEach(offense => total += obj[offense])
    totals[obj.neighborhood] = total
  });

  console.log(neighborhoods)
  console.log(offenses)
  console.log(totals)

  var main_data = d3.stack().keys(offenses).value((d,k) => {
    if(Object.keys(d).includes(k)) {
      return 100 * d[k]/totals[d.neighborhood]
    } else {
      return 0;
    }
  })(deets)

  console.log(main_data)
  var svg = d3.select('#vis5')
              .attr('width' , width)
              .attr('height', height)
              // .style('background', '#efefef');

  var chartGroup = svg.append('g')
                        .append('svg')
                        .attr('transform','translate(' + margin.left +',' + margin.top + ')');

  console.log(state);

  d3.select(".x_axis_label3").remove();
  d3.select(".y_axis_label3").remove();
  d3.select(".title3").remove();

  var title = "";
  var x_axis_label = "";
  var y_axis_label = "";

  if(state["view"] == "crime"){
    title = "Top 5 Crimes in Boston";
    y_axis_label = "Percentage of Top 5 Crimes";
    x_axis_label = "Neighborhood in Boston";
  } else if (state["view"] == "real_estate") {
    title = "Division of Type of Homes";
    y_axis_label = "Percentage of Homes of this Type";
    x_axis_label = "Neighborhood in Boston";
  }

  // Adding Graph Title
  chartGroup.append("text")
          .attr("x", width/2)
          .attr("y", margin.top)
          .attr('class', 'title3')
          .attr("text-anchor", "middle")
          .style("font-size", "20px")
          .style("text-decoration", "underline")
          .text(title);

  //
  var xScale = d3.scaleBand()
                 .domain(neighborhoods)
                 // Shifting by 50 so the last category label doesn't get cut off
                 .range([0, width - margin.right - 30]);
  //
    var yScale = d3.scaleLinear()
                   .domain([0, 100])
                   .range([height - margin.bottom - margin.top, margin.top]);

    var z = d3.scaleOrdinal(
      d3.schemeTableau10
      )
                    //.range(["#efefef","orange","yellow","green","blue","purple","indigo","white","black","grey","navy","indigo","brown","maroon"])
                   .domain([...offenses]);

  var xAxis = d3.axisBottom(xScale);
  //

  var yAxis = d3.axisLeft(yScale);


  chartGroup.append('g')
            .attr('class', 'x_axis')
            .attr('transform', 'translate('+ margin.left+', ' + (height - margin.bottom) + ')')
            .call(xAxis)
            .selectAll("text")
            .attr("text-anchor","end")
            .attr("transform","rotate(-90)");

    // Adding X-Axis Label
    chartGroup.append("text")
       .attr("x", width/2)
       .attr("y", height - margin.bottom + 100)
       .attr("class", "x_axis_label3")
       .attr("text-anchor", "middle")
       .style("font-size", "16px")
       .text(x_axis_label);

    chartGroup.append('g')
              .attr('class', 'y_axis')
              .attr('transform', 'translate('+ margin.left +', ' + margin.top+')')
              .call(yAxis);

    // Adding Y-Axis Label
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", - height/2)
      .attr("y", margin.left - 30)
      .attr("class", "y_axis_label3")
      .style("font-size", "16px")
      .attr("text-anchor", "middle")
      .text(y_axis_label);

  //
    var group = chartGroup
                .append("svg" )
                .selectAll("g.layer")
                .data(main_data, d => d.key)
                .enter()
                .append("g")
                // .merge(group)
                .classed("layer",true)
                .attr("fill", d => z(d.key))

                // .attr("class", "derp")

    group.exit().remove()

    var bars = chartGroup.selectAll("g.layer").selectAll("rect").data(d => d, e=> e.data.neighborhood)
    bars.exit().remove()
    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("class","derp")
        .attr("id", (d,e) => {
          if(state.neighborhood.includes(e)) {
            return e + " highlighted"
          } else {
            return e;
          }
        })
        .attr("x", function (d) { return xScale(d.data.neighborhood) + margin.left + 20;})
        .attr("width",xScale.bandwidth() - 3)
        .attr("y", function (d) { return yScale(d[1])+margin.top})
        .attr("height", function (d) {return yScale(d[0]) - yScale(d[1])})
        .attr("stroke", (d,e) => {
          if(state.neighborhood.includes(e)) {
            return "blue"
          } else {
            return "white"
          }
        })

    // // Add brushing
    // svg
    //   .call( d3.brush()                 // Add the brush feature using the d3.brush function
    //     .extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    //     .on("start brush", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
    //   )
    //
    // // Function that is triggered when brushing is performed
    // function updateChart() {
    //   extent = d3.event.selection
    //   console.log(extent)
    //   bars.classed("selected", function(d){ return isBrushed(extent, xScale(d.data.neighborhood) + margin.left + 20, yScale(d[1]) + margin.top ) } )
    // }
    //
    // // A function that return TRUE or FALSE according if a dot is in the selection or not
    // function isBrushed(brush_coords, cx, cy) {
    //   return true
    // }   // This return TRUE or FALSE depending on if the points is in the selected area
    //
  }
