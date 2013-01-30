var temprain = function(el, json, attr, xformat, yaxisleg, width, height) { 
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = width - margin.left - margin.right,
        height = height - margin.top - margin.bottom;


    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickFormat(xformat)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var colorscale2 = d3.scale.category20c();

    var line = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.temp); })
        .interpolate("basis")

    var svg = d3.select(el).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var gradient = svg.append("svg:defs")
  .append("svg:linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "100%")
    .attr("spreadMethod", "pad");

gradient.append("svg:stop")
    .attr("offset", "0%")
    .attr("stop-color", "#fff")
    .attr("stop-opacity", 1);

gradient.append("svg:stop")
    .attr("offset", "100%")
    .attr("stop-color", "#f2f2f2")
    .attr("stop-opacity", 1);

svg.append("svg:rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "url(#gradient)");

    x.domain(d3.extent(json, function(d) { return d.date; }));
    y.domain(d3.extent(json, function(d) { return d.temp; }));

    // Y Axis grid
    var yrule = svg.selectAll("g.y")
        .data(y.ticks(10))
        .enter().append("g")
        .attr("class", "y axis")
      .append("svg:line")
        .attr("class", "yLine")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", y)
        .attr("y2", y)
        .attr("stroke-dasharray", "5,5")
        .style('stroke', function(d, i) { 
            if(d == 0) {
                return 'steelblue';
            }
            return '#eee';
        })
        .style("shape-rendering", "crispEdges")
        ;

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);


    // Y Axis legend
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(yaxisleg);

    // Temp line
    var pathos = svg.append("path")
      .datum(json)
      .attr("class", "line")
      .attr("stroke", "red")
      .attr("d", line)
    // Low Temp line
    var line = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.tempmin); })
        .interpolate("basis")
    var pathoslow = svg.append("path")
      .datum(json)
      .attr("class", "line")
      .attr("stroke-dasharray", "5,5")
      .attr("stroke", "steelblue")
      .attr("d", line)
    // High Temp line
    var line = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.tempmax); })
        .interpolate("basis")
    var pathoslow = svg.append("path")
      .datum(json)
      .attr("class", "line")
      .attr("stroke-dasharray", "5,5")
      .attr("stroke", "darkred")
      .attr("d", line)

    /*
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);
    */
    var x = d3.time.scale()
        .range([0, 1]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(xformat)

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")

    x.domain(json.map(function(d) { return d.date; }));
    y.domain([0, d3.max(json, function(d) { return d.daily_rain; })]);


    var barxpos = function(d) { 
      var nr = x(d.date);
      var bwidth = (width/json.length)*0.8
      var barmargin = (width/json.length)*0.2
      var barx = width-bwidth;
      return  nr*bwidth + nr*barmargin;
    }

    svg.selectAll(".bar")
      .data(json)
    .enter().append("rect")
      .attr("class", "bar")
      .attr('rx', 3)
      .attr('ry', 3)
      .attr("x", barxpos )
      .attr("width", (width/json.length)*0.8)
      .attr("y", function(d) { return height; })
      .attr("height", function(d) { return 0; })
      .on('mouseover', hover)
      .transition().delay(function (d,i){ return 300;})
      .duration(150)
      .attr("y", function(d) { return y(d.daily_rain); })
      .attr("height", function(d) { return height - y(d.daily_rain); })

      ;

    var valfmt = function(d) { 
        var nr = d.daily_rain;
        if (nr == 0) return '';
        if (nr < 1 )
            return Number(nr).toFixed(1);
        return parseInt(nr);
    }
    svg.selectAll("text.score")
        .data(json)
        .enter().append("text")
        .attr("x", barxpos)
        .attr("y", function(d){ return y(d.daily_rain) + 10 } )
        .attr("dx", (width/json.length)*0.4)
        .attr("dy", ".36em")
        .attr("text-anchor", "end")
        .attr('class', 'score')
        .style("text-anchor", "middle")
        .text(valfmt)

  var focus = svg.append("g")
      .attr("class", "focus");

  focus.append("line")
      .attr("class", "x")
      .attr("y1", y(0) - 6)
      .attr("y2", y(0) + 6);

  focus.append("line")
      .attr("class", "y")
      .attr("x1", width - 6)
      .attr("x2", width + 6);

  focus.append("circle")
      .attr("r", 3.5);


  svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mousemove", mousemove);

  function mousemove() {
    var d = json[Math.round((x.invert(d3.mouse(this)[0]) - json[0].date) / 60*60*24)];
    focus.select("circle").attr("transform", "translate(" + x(d[0]) + "," + y(d[1]) + ")");
    focus.select(".x").attr("transform", "translate(" + x(d[0]) + ",0)");
    focus.select(".y").attr("transform", "translate(0," + y(d[1]) + ")");
    svg.selectAll(".x.axis path").style("fill-opacity", Math.random()); // XXX Chrome redraw bug
  }


}