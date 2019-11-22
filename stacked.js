var width  = 1000;
var height = 600;
var margin = {
  top: 20,
  bottom: 115,
  left: 50,
  right: 100
};

function stackChart(deets){
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
    let keys = Object.keys(obj)
    keys.pop()
    keys.forEach(offense => total += obj[offense])
    totals[obj.neighborhood] = total
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
      d3.schemeTableau10
      )
                    //.range(["#efefef","orange","yellow","green","blue","purple","indigo","white","black","grey","navy","indigo","brown","maroon"])
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
            .attr("transform","rotate(-90)");

    chartGroup.append('g')
              .attr('class', 'y_axis')
              .attr('transform', 'translate('+ margin.left +', ' + margin.top+')')
              .call(yAxis);
  //
    var group = chartGroup
                .append("svg" )
                .selectAll("g.layer")
                .data(main_data, d => d)
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
        // .attr("id", (d,e) => {
        //   if(state.neighborhood.includes(e)) {
        //     return e + " highlighted"
        //   } else {
        //     return e;
        //   }
        // })
        .attr("x", function (d) { return xScale(d.data.neighborhood) + margin.left + 20;})
        .attr("width",xScale.bandwidth() - 3)
        .attr("y", function (d) { return yScale(d[1])+margin.top})
        .attr("height", function (d) {return yScale(d[0]) - yScale(d[1])})
        .attr("stroke", (d,e) => {
          if(state.neighborhood.includes(d.data.neighborhood)) {
            return "black"
          } else {
            return "white"
          }
        }).on("click", d => {
          state.setN = d.data.neighborhood;
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
            .attr("cx", width - 150)
            .attr("r" , 10)
            .attr("cy", (d,i) => y(i * 5) - 100)
            .attr("fill", (d) => z(d.key))
      
      var texts = legends.selectAll("circle > text").data(main_data, d => d.key)
          texts.enter()
              .append("text")
              .merge(texts)
              .attr("x", width - 120)
              .attr("y", (d,i) => y(i * 5) - 100)
              .attr("text-anchor","begin")
              .text(d => d.key)
              .attr("font-size","10")
              .attr("class","stuff")
      circles.exit().remove()
      texts.exit().remove()
      legends.exit().remove()
  }
