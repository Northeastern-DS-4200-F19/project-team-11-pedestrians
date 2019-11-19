  //   var minSafetyLevel = 0;
  //   var maxSafetyLevel = d3.max(data, function(d){ return d.value;});
  //
  var width  = 1000;
  var height = 300;
    var margin = {
      top: 30,
      bottom: 10,
      left: 50,
      right: 75
    };

function stackChart(deets){
  console.log(deets)
  var neighborhoods = [... new Set(deets.map(d => d.neighborhood))]
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
              .style('background', '#efefef');

  var chartGroup = svg.append('g')
                        .append('svg')
                        .attr('transform','translate(' + margin.left +',' + margin.top + ')');
  //
  var xScale = d3.scaleBand()
                 .domain(neighborhoods)
                 // Shifting by 50 so the last category label doesn't get cut off
                 .range([0, width - margin.right - 100]);
  //
    var yScale = d3.scaleLinear()
                   .domain([0, 100])
                   .range([height, margin.top]);
  
    var z = d3.scaleOrdinal(d3.schemeAccent)
                    // .range(["red","orange","yellow","green","blue","purple","indigo","white","black","grey","navy","indigo","brown","maroon"])
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

    chartGroup.append('g')
              .attr('class', 'y_axis')
              .attr('transform', 'translate('+ margin.left +', ' + margin.top+')')
              .call(yAxis);
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
        .attr("x", function (d) { return xScale(d.data.neighborhood) + margin.left + 3;})
        .attr("width",xScale.bandwidth() - 3)
        .attr("y", function (d) { return yScale(d[1]) - margin.bottom})
        .attr("height", function (d) {return yScale(d[0]) - yScale(d[1])})
        .attr("stroke","white")   
  }