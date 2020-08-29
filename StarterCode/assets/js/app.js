// @TODO: YOUR CODE HERE!
var svgWidth = 850;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 60
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//SVG bounding box
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//import data
d3.csv("assets/data/data.csv").then(function(newsData) {

    //parse data
    newsData.forEach(function(data){
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.age = +data.age;
        console.log(data);
    });

    //scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(newsData, d => d.poverty) * .8, d3.max(newsData, d => d.poverty) * 1.2])
        .range([0, width]);
    
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(newsData, d => d.healthcare) * .8, d3.max(newsData, d => d.healthcare)* 1.2])
        .range([height, 0]);

    //axis functions
    var btmAxis = d3.axisBottom(xLinearScale);
    var lftAxis = d3.axisLeft(yLinearScale);

    //add to chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(btmAxis);
    
    chartGroup.append("g")
        .call(lftAxis);

    //add circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(newsData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", "0.30")
        .text(d => d.abbr);

    //add circle text abbrs
    var circlesText = chartGroup.selectAll()
        .data(newsData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare) + 3)
        .style("font-size", "10px")
        .style("fill", "black")
        .style("font-weight", "bold")
        .style("text-anchor", "middle")
        .text(d => d.abbr);

    //axis labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 20)
        .attr("x", 0 - (height / 2))
        .text("Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
        .text("Poverty (%)");
});