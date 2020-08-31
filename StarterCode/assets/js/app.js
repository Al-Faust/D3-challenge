/* 
-------------------------------------------------------
Base Project Code
-------------------------------------------------------
 */

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
        .domain([d3.min(newsData, d => d.healthcare) * .8, d3.max(newsData, d => d.healthcare) * 1.2])
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
        .text(d => (d.abbr));

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


/*
-------------------------------------------------------
Bonus Code
-------------------------------------------------------
currently doesn't work
*/
/* 
//use activity 3.12 from week 16
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

//first load data
var chosenX = "poverty"
var chosenY = "healthcare"

//x scale based on chosenX
function xScale(newsData, chosenX) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(newsData, d => d.chosenX) * 0.8, d3.max(newsData, d => d.chosenX) * 1.2])
        .range([0, width]);

    return xLinearScale;
}

//y scale based on chosenY
function yScale(newsData, chosenY) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(newsData, d => d.chosenY) * 0.8, d3.max(newsData, d => d.chosenY) * 1.2])
        .range([height, 0]);

    return yLinearScale;
}

//update new x
function renderX(newXScale, xAxis) {
    var btmAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .transition(500)
        .call(btmAxis);

    return xAxis;
}

//update new y
function renderY(newYScale, yAxis) {
    var lftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .transition(500)
        .call(lftAxis);
        
    return yAxis;
}

//update circles
function renderCircles(circlesGroup, newXScale, chosenX, newYScale, chosenY) {

    circlesGroup.transition()
        .duration(500)
        .attr("cx", d => newXScale(d[chosenX]))
        .attr("cy", d => newYScale(d[chosenY]));

    return circlesGroup;
}

//updating text on circles
function renderText(circlesGroup, newXScale, chosenX, newYScale, chosenY) {

    circlesText.transition()
        .duration(500)
        .attr("x", d => newXScale(d[chosenX]))
        .attr("y", d => newYScale(d[chosenY]));

    return circlesText;
}

//update circles with new tooltip based on axis choice
function updateToolTip(chosenX, chosenY, circlesGroup) {

    var xlabel;
    var ylabel;

    if (chosenX === "poverty") {
        xlabel = "Poverty:";
    } else if (chosenX === "income") {
        xlabel = "Median Income:";
    } else if (chosenX === "age") {
        xlabel = "Age:";
    }

    if (chosenY === "healthcare") {
        ylabel = "Lack Healthcare:";
    } else if (chosenY === "smokes") {
        ylabel = "Smokers:";
    } else if (chosenY === "obesity") {
        ylabel = "Obesity:";
    }

    //creates tooltip based on selected x since income needs to be formated differently
    var toolTip = d3.tip()
        .classed("tooltip", true)
        .offset([80, -60])
        .html(function(d){
            if (chosenX === "poverty") {
                return (`${d.state}<hr>${xlabel} ${d[chosenX]}<br>${ylabel} ${d[chosenY]}%`)
            } else if (chosenX === "income") {
                return (`${d.state}<hr>${xlabel} $${d[chosenX]}<br>${ylabel} ${d[chosenY]}%`)
            } else if (chosenX === "age"){
                return (`${d.state}<hr>${xlabel} ${d[chosenX]}<br>${ylabel} ${d[chosenY]}%`)
            }

        })
    circlesGroup.call(toolTip);

    //shows tooltip on click and hides on mouseout
    circlesGroup.on("click", function(d) {
        toolTip.show(d)
    });
    circlesGroup.on("mouseout", function(d){
        toolTip.hide(d)
    });
    return circlesGroup;
}

//import data
d3.csv("assets/data/data.csv").then(function(newsData) {

    //parse data
    newsData.forEach(function(data){
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
        //console.log(data);
    });

    //scale functions
    var xLinearScale = xScale(newsData, chosenX);
    
    var yLinearScale = yScale(newsData, chosenY);

    //axis functions
    var btmAxis = d3.axisBottom(xLinearScale);
    var lftAxis = d3.axisLeft(yLinearScale);

    //add to chart
    chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(btmAxis);
    
    chartGroup.append("g")
        .classed("y-axis", true)
        .call(lftAxis);

    //add circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(newsData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenX]))
        .attr("cy", d => yLinearScale(d[chosenY]))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", "0.30");

    //add circle text abbrs
    var circlesText = chartGroup.selectAll()
        .data(newsData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[chosenX]))
        .attr("y", d => yLinearScale(d[chosenY]) + 3)
        .style("font-size", "10px")
        .style("fill", "black")
        .style("font-weight", "bold")
        .style("text-anchor", "middle")
        .text(d => (d.abbr));

    //axis labels groups
    var labelGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
    //x labels
    var povlabel = labelGroup.append("text")
        .text("poverty (%)")
        .attr("x", 0)
        .attr("y", 20)
        //used to get on click to work
        .classed("active", true)
        .attr("value", "poverty")

    var agelabel = labelGroup.append("text")
        .text("Age")
        .attr("x", 0)
        .attr("y", 40)
        //used to get on click to work
        .classed("inactive", true)
        .attr("value", "age")

    var inclabel = labelGroup.append("text")
        .text("Median Income")
        .attr("x", 0)
        .attr("y", 60)
        //used to get on click to work
        .classed("inactive", true)
        .attr("value", "income")
    //y labels
    var healthlabel = labelGroup.append("text")
        .text("Healthcare (%)")
        .attr("x", 0 - (height / 2))
        .attr("y", 0 - (margin.left - 60))
        .attr("transform", "rotate(-90)")
        //used to get on click to work
        .classed("active", true)
        .attr("value", "healthcare")

    var smklabel = labelGroup.append("text")
        .text("Smokers (%)")
        .attr("x", 0 - (height / 2))
        .attr("y", 0 - (margin.left - 40))
        .attr("transform", "rotate(-90)")
        //used to get on click to work
        .classed("inactive", true)
        .attr("value", "smoke")

    var obelabel = labelGroup.append("text")
        .text("Obesity (%)")
        .attr("x", 0 - (height / 2))
        .attr("y", 0 - (margin.left - 20))
        .attr("transform", "rotate(-90)")
        //used to get on click to work
        .classed("inactive", true)
        .attr("value", "obesity")

    var circlesGroup = updateToolTip(chosenX, chosenY, circlesGroup)
 
    // nested if on click action
    // if x is clicked
    //     check value
    //         action based on value
    //             updated classes (active/inactive)
    //     else y is clicked
    //         action based on value
    //             updated classes (active/inactive)

    labelGroup.selectAll("text").on("click", function(){
        
        var value = d3.select(this).attr("value")
        // || or
        if (value === "poverty" || value === "age" || value === "income") {
            chosenX = value;

            xLinearScale = xScale(newsData, chosenX);

            xAxis = renderX(xLinearScale, xAxis);

            if (chosenX === "poverty") {
                povlabel
                    .classed("active", true)
                    .classed("inactive", false);
                agelabel
                    .classed("active", false)
                    .classed("inactive", true);
                inclabel
                    .classed("active", false)
                    .classed("inactive", true);
            } else if (chosenX === "age") {
                povlabel
                    .classed("active", false)
                    .classed("inactive", true);
                agelabel
                    .classed("active", true)
                    .classed("inactive", false);
                inclabel
                    .classed("active", false)
                    .classed("inactive", true);
            } else {
                povlabel
                    .classed("active", false)
                    .classed("inactive", true);
                agelabel
                    .classed("active", false)
                    .classed("inactive", true);
                inclabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
        } else {
            chosenY = value;

            yLinearScale = yScale(newsData, chosenY);

            yAxis = renderY(yLinearScale, yAxis);

            if (chosenY === "healthcare") {
                healthlabel
                    .classed("active", true)
                    .classed("inactive", false);
                smklabel
                    .classed("active", false)
                    .classed("inactive", true);
                obelabel
                    .classed("active", false)
                    .classed("inactive", true);
            } else if (chosenY === "smoke") {
                healthlabel
                    .classed("active", false)
                    .classed("inactive", true);
                smklabel
                    .classed("active", true)
                    .classed("inactive", false);
                obelabel
                    .classed("active", false)
                    .classed("inactive", true);
            } else {
                healthlabel
                    .classed("active", false)
                    .classed("inactive", true);
                smklabel
                    .classed("active", false)
                    .classed("inactive", true);
                obelabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
        }

        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenX, chosenY);

        circlesGroup = updateToolTip(chosenX, chosenY, circlesGroup);

        circlesGroup = renderText(circlesGroup, xLinearScale, yLinearScale, chosenX, chosenY);
    })

});
 */