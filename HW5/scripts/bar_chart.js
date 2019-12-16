// ECS163 HW5 Liya Li
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

var x2 = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1);

var y2 = d3.scaleLog()
    .rangeRound([height, 0]).nice();

var xAxis2 = d3.axisBottom(x2),
    yAxis2 = d3.axisLeft(y2);

var gCat2 = "GDP",
    pCat2 = "Country";                 

var labels2 = {
    "GDP" : "GDP ($ per capita)",
    "Country" : "Country"
}

var svg2 = d3.select("body")
    .append("svg")
    .attr("width", outerWidth)
    .attr("height", outerHeight)
    .attr("class", "barchart")
    .append("g")
    .attr("transform", "translate(" + (margin.right + 60) + "," + margin.bottom + ")");

var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// extract only needed data
d3.csv("countries_processed.csv", function(ori_data) {
    // if (error) throw error;

    // filter target data: Asia
    var data = ori_data.filter(function(d) { return (d.Region == 'ASIA (EX. NEAR EAST)') || (d.Region == 'NEAR EAST');})

    data.forEach(function(d){
        d.Country = d.Country,
        d.Population_Density = +d["Pop. Density (per sq. mi.)"],
        d.Region = d.Region,
        d.GDP = +d["GDP ($ per capita)"]
    });

    x2.domain(data.map(function(d) { return d.Country;}));
    y2.domain([d3.min(data, function(d){return d.GDP}), d3.max(data, function(d){return d.GDP})]);

    var radiusScale = d3.scaleLinear()
        .range([4,10])
        .domain([d3.min(data, function(d) { return d.Population_Density;}), d3.max(data, function(d) { return d.Population_Density;})]);

    // add the X Axis
    svg2.append("g")
        .attr("transform", "translate(0," + height + ")")
        .style("font", "Lato")   // modify x axis label font
        .call(xAxis2); 

    // add label for X axis
    svg2.append("text")
        .attr("transform", "translate(" + (width - (width/4)) + " ," + (height + margin.bottom - 1) + ")")
        .style("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("font-weight", "700")
        .text("Country");

    // add the Y Axis
    svg2.append("g")
        .call(yAxis2);

    // add label for Y axis
    svg2.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("font-weight", "700")
        .text("GDP ($ per capital)");

    // add barchart title
    svg2.append("svg:text")
        .attr("class", "title")
        .attr("x", width/2 - 80)
        .attr("y", 0)
        .attr("font-size", "16px")
        .attr("font-weight", "700")
        .style("text-decoration", "underline")
        .attr("font-family", "sans-serif")
        .text("GDP in Asia Countries");

    // add rects
    svg2.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d){ return x2(d.Country);})
        .attr("width", x2.bandwidth())
        .attr("y", function(d){ return y2(d.GDP);})
        .attr("height", function(d){ return height - y2(d.GDP);})
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
                    labels2[pCat2] + ": " + d[pCat2] + "<br>"  + labels2[gCat2] + ": " + d[gCat2] 
                )
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");

            // when tough one bar in barchart, update the style in scatter plot for that point
            d3.selectAll('.' + d.Country)
                    .attr("r", 11)
                    .style("fill", "black")
                    .style("opacity", 0.2)
       })
       .on("mouseout", function() {
            tip
                .transition()
                .duration(500)
                .style("opacity", 0);
       });

    // add legend
    svg2.append("rect")     // for Asia except near east
        .attr("x", 35)
        .attr("y", 5)
        .attr("height", 20)
        .attr("width", 20)
        .style("fill", colorScale(1))

    svg2.append("text")
        .attr("x", 60)
        .attr("y", 20)
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .text("Asia (Except Near East)")    

    svg2.append("rect")     // for near east
        .attr("x", 35)
        .attr("y", 27)
        .attr("height", 20)
        .attr("width", 20)
        .style("fill", colorScale(2))

    svg2.append("text")
        .attr("x", 60)
        .attr("y", 40)
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .text("Near East") 

});

