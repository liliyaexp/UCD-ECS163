// ECS163 HW5 Liya Li
// set up
var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 80
    },

    outerWidth = 1050,
    outerHeight = 500,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;

var x = d3.scaleLog()
    .range([0, width]).nice();

var y = d3.scaleLog()
    .range([height, 0]).nice();

var xAxis = d3.axisBottom(x),
    yAxis = d3.axisLeft(y);

var xCat = "Area",                     // age
    yCat = "Population",               // prob
    rCat = "Population_Density",       // los_ics
    pCat = "Country";                  // firstcare unit

var labels = {
    "Country": "Country",
    "Population": "Population",
    "Area": "Area (per sq. mi.)",
    "Population_Density": "Population Density (sq. mi.)"
}

var svg = d3.select("body")
    .append("svg")
    .attr("class", "scatter")
    .attr("width", outerWidth)
    .attr("height", outerHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

var tip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// extract only needed data
d3.csv("countries_processed.csv", function(ori_data) {
    // if (error) throw error;

    // filter target data: Asia
    var data = ori_data.filter(function(d) { return (d.Region == 'ASIA (EX. NEAR EAST)') || (d.Region == 'NEAR EAST');})

    data.forEach(function(d){
        d.Country = d.Country,
        d.Region = d.Region,
        d.Population = +d.Population,
        d.Population_Density = +d["Pop. Density (per sq. mi.)"],
        d.Area = +d["Area (sq. mi.)"],
        d.GDP = +d["GDP ($per capita)"]
    });

    x.domain([d3.min(data, function(d){return d.Area}), d3.max(data, function(d){return d.Area})]);
    y.domain([d3.min(data, function(d){return d.Population}), d3.max(data, function(d){return d.Population})]);

    var radiusScale = d3.scaleLinear()
        .range([4,10])
        .domain([d3.min(data, function(d) { return d.Population_Density;}), d3.max(data, function(d) { return d.Population_Density;})]);

    // define the line
    var valueline = d3.line()
        .x(function(d) { return x(d.Area); })
        .y(function(d) { return y(d.Population); });

    // add the valueline path
    svg.append("line")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline);

    // add circles
    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("class", function(d){ return d.Country})
        .attr("r", function(d){ return radiusScale(d.Population_Density);})
        .attr("cx", function(d){ return x(d.Area);})
        .attr("cy", function(d){ return y(d.Population);})
        .style("fill", function(d){
            if(d.Region == 'ASIA (EX. NEAR EAST)')
                {return colorScale(1);}
            else
                {return colorScale(2);}
            })
        .style("opacity", 0.8)
        .on("mouseover", function(d) {
            tip
                .transition()
                .duration(200)
                .style("opacity", 0.9);

            tip
                .html(
                    labels[pCat] + ": " + d[pCat] + "<br>"  + labels[xCat] + ": " + d[xCat] + "<br>" + labels[yCat] + ": " + d[yCat] + "<br>" + labels[rCat] + ": " + d[rCat]
                )
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
       })
       .on("mouseout", function() {
            tip
                .transition()
                .duration(500)
                .style("opacity", 0);
       });

    // add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .style("font", "Lato")   // modify x axis label font
        .call(xAxis); 

    // add label for X axis
    svg.append("text")
        .attr("transform", "translate(" + (width/2) + " ," + (height + margin.bottom - 1) + ")")
        .style("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("font-weight", "700")
        .text("Area (sq. mi.)")

    // add the Y Axis
    svg.append("g")
        .call(yAxis);

    // add label for Y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("font-weight", "700")
        .text("Population")

    // add scatterplot title
    svg.append("svg:text")
        .attr("class", "title")
        .attr("x", width/2 - 80)
        .attr("y", 10)
        .attr("font-size", "16px")
        .attr("font-weight", "700")
        .text("Area vs Population (Asia)")
        .style("text-decoration", "underline")
        .attr("font-family", "sans-serif")

    // add legend
    svg.append("rect")     // for Asia except near east
        .attr("x", 35)
        .attr("y", 25)
        .attr("height", 20)
        .attr("width", 20)
        .style("fill", colorScale(1))

    svg.append("text")
        .attr("x", 60)
        .attr("y", 40)
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .text("Asia (Except Near East)")    

    svg.append("rect")     // for near east
        .attr("x", 35)
        .attr("y", 47)
        .attr("height", 20)
        .attr("width", 20)
        .style("fill", colorScale(2))

    svg.append("text")
        .attr("x", 60)
        .attr("y", 60)
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .text("Near East") 
});