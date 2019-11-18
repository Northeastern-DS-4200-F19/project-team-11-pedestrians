function stackChart(data){
    console.log("testing" + data[1])
    var minSafetyLevel = 0;
    var maxSafetyLevel = d3.max(data, function(d){ return d.crimecount;});

    var width  = 1200;
    var height = 500;
    var margin = {
      top: 30,
      bottom: 30,
      left: 50,
      right: 30
    };

    var svg = d3.select('#vis5')
                .attr('width' , width)
                .attr('height', height)
                .style('background', '#efefef');

  var chartGroup = svg.append('g')
                        .append('svg')
                        .attr('transform','translate(' + margin.left +',' + margin.top + ')');

    var xScale = d3.scaleBand()
                   .domain([...data.map(d => d.offenseType)])
                   // Shifting by 50 so the last category label doesn't get cut off
                   .range([0, width + margin.left]);

    var yScale = d3.scaleLinear()
                   .domain([minSafetyLevel, maxSafetyLevel])
                   .range([height, 0]);

    var xAxis = d3.axisBottom(xScale);

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

    var rects = chartGroup
                .selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("class", "derp")
                .attr("x", function (d) { return xScale(d.offenseType) + margin.left + 3;})
                .attr("width",xScale.bandwidth() - 3)
                .attr("y", function (d) { return yScale(d.crimecount) - margin.bottom})
                .attr("height", function (d) {return height - yScale(d.crimecount)})
                .style("fill", "#69b3a2")

    rects.selectAll("rect")
            .attr("class", "derp")
            .attr("x", function (d) { return xScale(d.offenseType) + margin.left + 3; } )
            .attr("width", xScale.bandwidth() - 3)
            .attr("y", function (d) { return yScale(d.crimecount)} )
            .attr("height", function (d) {return height - yScale(d.crimecount) - margin.top})
            .style("fill", "#69b3a2")

    rects.exit().remove();
  }
