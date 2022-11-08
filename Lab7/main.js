import * as d3 from "d3";

let dataUrl = "https://jsonblob.com/api/1039328202555932672"

let resp = await fetch(dataUrl)
let json = await resp.json()

console.log(json[100]);

// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 60 };
var width = 800 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;
var height2 = 160;
var margin2 = { top: 10 + height, right: 30, bottom: 30 + height + height2, left: 60 };

// append the svg object to the body of the page
var graph = d3.select("#root")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", (height + height2) + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

lineGraph(json)

function lineGraph(data)
{
    // Add X axis --> it is a date format
    var x = d3.scaleTime()
        .domain(d3.extent(data,
            (d) =>
            {
                return Date.parse(d.Date);
            }
        ))
        .range([0, width]);

    graph.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([300, d3.max(data,
            (d) =>
            {
                return +d.Interpolated;
            })
        ])
        .range([height, 0]);

    // Add Y axis
    var y2 = d3.scaleLinear()
        .domain([300, d3.max(data,
            (d) =>
            {
                return +d.Interpolated;
            })
        ])
        .range([height, 0]);

    graph.append("text")      // text label for the x axis
        .attr("x", width / 2)
        .attr("y", height + 30)
        .style("text-anchor", "middle")
        .text("Year");


    graph.append("text")      // text label for the y axis
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 50)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Carbon (PPM)");

    graph.append("g").call(d3.axisLeft(y));

    // Add the interpolated line
    graph.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x((d) => { return x(Date.parse(d.Date)); })
            .y((d) => { return y(d.Interpolated) })
        )

    // Add the trend line
    graph.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x((d) => { return x(Date.parse(d.Date)); })
            .y((d) => { return y(d.Trend) })
        )
}
