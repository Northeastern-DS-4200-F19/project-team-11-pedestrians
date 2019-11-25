function stackChart(deets){

  var width  = 1200;
  var height = 700;
    var margin = {
      top: 20,
      bottom: 115,
      left: 50,
      right: 180
    };
  console.log(deets)
  var neighborhoods = [... new Set(deets.map(d => d.neighborhood  ))]
  var categories = [... new Set(deets.reduce((a,b) => {
    let keys = Object.keys(b)
    keys.pop()
    return a.concat(keys)
  },[]))]

  categories.pop()

  var totals = {}
  deets.forEach(obj => {
    total = 0
    let keys = Object.keys(obj);
    keys.pop();
    keys.forEach(offense => total += obj[offense]);
    totals[obj.neighborhood] = total;
  });

  var main_data = d3.stack().keys(categories).value((d,k) => {
    if(Object.keys(d).includes(k)) {
      return 100 * d[k]/totals[d.neighborhood]
    } else {
      return 0;
    }
  })(deets)
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
  d3.selectAll(".legend").remove();
  console.log(state);

  chartGroup.call(brush)
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
    console.log(state);
    title = "Percentage of People with Different Degrees";
    y_axis_label = "Percentage of people with this type of Degree";
    x_axis_label = "Neighborhood in Boston";
  }


  //
  var xScale = d3.scaleBand()
                 .domain(neighborhoods)
                 // Shifting by 50 so the last category label doesn't get cut off
                 .range([0, width - margin.right - 150]);
  //
    var yScale = d3.scaleLinear()
                   .domain([0, 100])
                   .range([height - margin.bottom - margin.top, margin.top]);

    var y = d3.scaleLinear()
                      .domain([0,100])
                      .range([(height - margin.bottom - margin.top), margin.top])

  //  var y = d3.scaleLinear()
  //                  .range([height - margin.bottom - margin.top, margin.top]);
    var z = d3.scaleOrdinal(
      )
                    .range(["#eb3434","#eb8934","#ebd034","#c0eb34","#6beb34","#34eb8c","#34ebd6","#34b1eb","#3474eb","#4034eb","#8334eb","#ba34eb","#eb34dc","#eb3499"])
                   .domain([...categories]);

  var xAxis = d3.axisBottom(xScale);
  //

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
    svg.append("text")
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
                .data(main_data, d => d, e => e.data.neighborhood)
                .enter()
                .append("g")
                // .merge(group)
                .attr("class","layer")
                .attr("id",(d,e) =>  d[e].data.neighborhood)
                // .classed("layer",true)
                .attr("fill", d => {
                  return z(d.key)
                })
                // .attr("class", "derp")

    group.exit().remove()

    var bars = chartGroup.selectAll("g.layer").selectAll("rect").data(d => d, e=> e.data.neighborhood)
    bars.exit().remove()
    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("class","derp")
        .attr("x", function (d) { return xScale(d.data.neighborhood) + margin.left + 20;})
        .attr("width",xScale.bandwidth() - 3)
        .attr("y", function (d) { return yScale(d[1])+margin.top})
        .attr("height", function (d) {return yScale(d[0]) - yScale(d[1])})
        .attr("stroke", (d,e) => {
          if(state.neighborhood.includes(d.data.neighborhood)) {
            return "blue"
          } else {
            return "white"
          }
        }).on("click", d => {
          state.setN = [d.data.neighborhood];
        })
        .on("mouseout", (d,e) => {
          state.removeN = d
        })


      var legends = chartGroup.selectAll("g.layer").append("g")
      var circles = legends.selectAll("g.layer > circle").data(main_data, d => d.key)

      circles.enter()
            .append("circle")
            .merge(circles)
            .attr("class", "derp")
            .attr("cx", width - 220)
            .attr("r" , 13)
            .attr("cy", (d,i) => y(i * 5) - 100)
            .attr("fill", (d) => z(d.key))

      var texts = legends.selectAll("g > .stuff").data(main_data, d => d.key)
          texts.enter()
              .append("text")
              .attr("class", "legend")
              .merge(texts)
              .attr("x", width - 200)
              .attr("y", (d,i) => y(i * 5) - 97)
              .attr("text-anchor","begin")
              .attr("fill", "purple")
              .text(d => d.key)
              .attr("font-size","13px")
              .attr("fill","black")
              .attr("class","stuff")
      circles.exit().remove()
      texts.exit().remove()
      legends.exit().remove()



      function brush (g) {
        const nlist = []
        const brush = d3.brush().on("end",brushEnd)
        .extent([
          [0,0],
          [width, height] 
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
        var index = 0
        d3.selectAll(".layer").each(function(d){
          console.log(index)
          index++
          var neighborhood = d3.select(this).attr("id")
          var x = xScale(neighborhood) + margin.left + 20;
          console.log(x)
          if(x0 <= x && x1 >= x) {
            nlist.push(d3.select(this).attr("id"))
          }
          // state.setN = nlist
        })
        console.log(d3.event.selection)
        console.log(new Set(nlist))
        state.setN = new Set(nlist)
       }
      }

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
