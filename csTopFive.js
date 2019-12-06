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
                   .range([0, width - margin.right - margin.left]);
    //
    var values = Object.values(deets)
    values.pop()

      var yScale = d3.scaleLinear()
                     .domain([0, Math.max(...values)])
                     .range([height - margin.bottom - margin.top, 0]);
  
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
  
  
    chartGroup.append('g')
              .attr('class', 'x_axis')
              .attr('transform', 'translate('+ margin.left+', ' + (height - margin.bottom) + ')')
              .call(xAxis)
              .selectAll("text")
              .attr("text-anchor","end")
              .style("font-size", "9px")
              .attr("transform","rotate(-90)")
              
  
      // Adding X-Axis Label
      svg.append("text")
         .attr("x", width/2)
         .attr("y", height - margin.bottom + 110)
         .attr("class", "x_axis_label3")
         .attr("text-anchor", "middle")
         .style("font-size", "16px")
         .text(x_axis_label);
  
      chartGroup.append('g')
                .attr('class', 'y_axis')
                .attr('transform', 'translate('+ margin.left +', ' + margin.top+')')
                .call(yAxis);
  
      // Adding Y-Axis Label
      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", - height/2)
        .attr("y", margin.left - 30)
        .attr("class", "y_axis_label3")
        .style("font-size", "16px")
        .attr("text-anchor", "middle")
        .text(y_axis_label);
  
        console.log(deets)
      var bars = chartGroup.selectAll("rect").data(plz)
      bars.exit().remove()
      bars.enter()
          .append("rect")
          .merge(bars)
          .attr("class","derp")
          .attr("x", function (d) { 
              return xScale(d.key) + margin.left;
            })
            .attr("width",xScale.bandwidth() - 3)
          .attr("y", function (d) { return height - yScale(d["value"]) - margin.bottom})
          .attr("height", function (d) {return yScale(d["value"])})
          .attr("stroke",(d) => {
              return "black"
            // if(state["neighborhood"].includes(d.data.neighborhood)) {
            //   return "orange"
            // } else {
            //   return "white"
            // }
          })
          .attr("fill", "white")
        //   .attr("stroke-width",(d) => {
        //     if(state["neighborhood"].includes(d.data.neighborhood)) {
        //       return 3;
        //     } else {
        //       return 1;
        //     }
        //   })
        //   .on("click", d => {
        //     state.removeN = [];
        //   })
          // .on("mouseout", (d,e) => {
          //   state.removeN = d
          // })
  
    //     function brush (g) {
    //       const nlist = []
    //       const brush = d3.brush().on("end",brushEnd)
    //       .extent([
    //         [0,0],
    //         [width, height] 
    //       ]);
  
    //     g.call(brush);
  
    //     function brushEnd(){
    //       // We don't want infinite recursion
    //       if(d3.event.sourceEvent.type!="end"){
    //         d3.select(this).call(brush.move, null);
    //       }
    //       if (d3.event.selection === null) return;
  
    //       const [
    //         [x0, y0],
    //         [x1, y1]
    //       ] = d3.event.selection;
    //       // If within the bounds of the brush, select it
    //       d3.selectAll(".layer").each(function(d){
    //         var neighborhood = d3.select(this).attr("id")
    //         var x = xScale(neighborhood) + margin.left + 20;
    //         if(x0 <= x && x1 >= x) {
    //           nlist.push(d3.select(this).attr("id"))
    //         }
    //         // state.setN = nlist
    //       })
    //       console.log(d3.event.selection)
    //       console.log(new Set(nlist))
    //       state.setN = new Set(nlist)
    //      }
    //     }
  
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
  