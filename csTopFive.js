function csTopFive(deets){

  // Acknowledgement
  //https://bl.ocks.org/caravinden/d04238c4c9770020ff6867ee92c7dac1
    var width  = 600;
    var height = 400;
      var margin = {
        top: 20,
        bottom: 115,
        left: 50,
        right: 50
      };
    var svg = d3.select('#vis7')
                .attr('width' , width)
                .attr('height', height)
                // .style('background', '#efefef');
  
    var chartGroup = svg.append('g')
                          .append('svg')
                          .attr('transform','translate(' + margin.left +',' + margin.top + ')');
    var plz = []
    Object.keys(deets).forEach(key => {
      current = {}
      current["key"] = key
      current["value"] = deets[key]
      plz.push(current);
    });
    plz.pop()
    console.log(plz)
    d3.select(".x_axis_label3").remove();
    d3.select(".y_axis_label3").remove();
    d3.select(".title3").remove();
    d3.selectAll(".legend").remove();

  
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
    } else if (state["view"] == "demographic") {
      title = "Percentage of People with Different Degrees";
      y_axis_label = "Percentage of people with this type of Degree";
      x_axis_label = "Neighborhood in Boston";
    }
  
  
    
    var categories = Object.keys(deets)
    categories.pop()
    //
    var xScale = d3.scaleBand()
                   .domain(categories)
                   // Shifting by 50 so the last category label doesn't get cut off
                   .range([margin.left, width - margin.right]);
    //
    var values = Object.values(deets)
    values.pop()

    var yScale = d3.scaleLinear()
                     .domain([0, Math.max(...values)])
                     .range([height - margin.bottom - margin.top, 0]);
  
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
  
  
    chartGroup.append('g')
              .attr('transform', 'translate(0, ' + (height - margin.bottom) + ')')
              .call(xAxis)
              .selectAll("text")
              .attr("text-anchor","end")
              .style("font-size", "9px")
              .attr("transform","rotate(-90)")
              
  
      // Adding X-Axis Label
      svg.append("text")
         .attr("x", width/2)
         .attr("y", height - margin.bottom + 110)
         .attr("text-anchor", "middle")
         .style("font-size", "16px")
         .text(x_axis_label);
  
      chartGroup.append('g')
                .attr('transform', 'translate('+ margin.left +', ' + margin.top+')')
                .call(yAxis);
  
      // Adding Y-Axis Label
      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", - height/2)
        .attr("y", margin.left - 30)
        .style("font-size", "16px")
        .attr("text-anchor", "middle")
        .text(y_axis_label);
  
      console.log(deets)
      var bars = chartGroup.selectAll("rect").data(plz)
      bars.exit().remove()
      bars.enter()
          .append("rect")
          .merge(bars)
          .attr("x", function (d) { 
              return xScale(d.key);
            })
          .attr("width",xScale.bandwidth() - 7)
          .attr("y", function (d) { return height - yScale(d["value"]) - margin.bottom})
          .attr("height", function (d) {return yScale(d["value"])})
          .attr("stroke",(d) => {
              return "black"
          })
          .attr("fill", "#DCDCDC")
  
    // Adding Graph Title
    svg.append("text")
    .attr("x", width/2)
    .attr("y", margin.top)
    .attr('class', 'title3')
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("text-decoration", "underline")
    .text(title);
    }
  