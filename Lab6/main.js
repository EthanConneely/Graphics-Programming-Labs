import * as d3 from "d3";

let dataUrl = "https://jsonblob.com/api/1039328202555932672"

let resp = await fetch(dataUrl)
let json = await resp.json()

// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 60 };
var width = 800 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;
var margin2 = { top: 10, right: 30, bottom: 30, left: 60 };
var height2 = 160;

// append the svg object to the body of the page
var graph = d3.select("#root")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + height2 + 100)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



// Add X axis --> it is a date format
var x = d3.scaleTime()
    .domain(d3.extent(json,
        (d) =>
        {
            return Date.parse(d.Date);
        }
    ))
    .range([0, width]);



lineGraph(json)

function lineGraph(data)
{

    var x2 = d3.scaleTime()
        .domain(d3.extent(data,
            (d) =>
            {
                return Date.parse(d.Date);
            }
        ))
        .range([0, width]);

    graph.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "xAxis")
        .call(d3.axisBottom(x));

    graph.append("g")
        .attr("transform", "translate(0," + (height + height2) + ")")
        .call(d3.axisBottom(x2));


    // Add Y axis
    var y = d3.scaleLinear()
        .domain([300, d3.max(data,
            (d) =>
            {
                return +d.Interpolated;
            })
        ])
        .range([height, 0]);

    graph.append("g").call(d3.axisLeft(y));


    // Add bottom zoom Y axis
    var y2 = d3.scaleLinear()
        .domain([300, d3.max(data,
            (d) =>
            {
                return +d.Interpolated;
            })
        ])
        .range([height + height2, height + 40]);


    var trendLine = d3.line()
        .x((d) => { return x(Date.parse(d.Date)); })
        .y((d) => { return y(d.Trend) })

    var interpolatedLine = d3.line()
        .x((d) => { return x(Date.parse(d.Date)); })
        .y((d) => { return y(d.Interpolated) })

    const scale = (number, [inMin, inMax], [outMin, outMax]) =>
    {
        return (number - inMin) / (inMax - inMin) * (outMax - outMin) + outMin;
    }

    graph.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);

    var brush = d3.brushX()
        .extent([[0, height + 40], [width, height + height2]])
        .on("brush end", (e) =>
        {
            if (e.sourceEvent == "ZoomEvent")
            {
                return
            }
            let numRange = x2.domain();
            let out = [numRange[0].valueOf(), numRange[1].valueOf()]

            let min = scale(e.selection[0], x2.range(), out)
            let max = scale(e.selection[1], x2.range(), out)

            x.domain([min, max])

            var s = e.selection || x2.range();

            graph.select(".xAxis").call(d3.axisBottom(x));
            graph.select(".trendLine").attr("d", trendLine);
            graph.select(".interpolatedLine").attr("d", interpolatedLine);

            graph.select(".zoom").call(zoom.transform, d3.zoomIdentity
                .scale(width / (s[1] - s[0]))
                .translate(-s[0], 0), "BrushEven");
        });

    var isZoom = false;

    var zoom = d3.zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", (e) =>
        {
            if (e.sourceEvent == "BrushEvent")
            {
                return
            }
            var t = e.transform;
            x.domain(t.rescaleX(x2).domain());


            graph.select(".xAxis").call(d3.axisBottom(x));
            graph.select(".trendLine").attr("d", trendLine);
            graph.select(".interpolatedLine").attr("d", interpolatedLine);

            graph.select(".brush").call(brush.move, x.range().map(t.invertX, t), "ZoomEvent");

        });

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


    // Add the interpolated line
    graph.append("path")
        .datum(data)
        .attr("class", "interpolatedLine")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("clip-path", "url(#clip)")
        .attr("d", interpolatedLine)

    // Add the trend line
    graph.append("path")
        .datum(data)
        .attr("class", "trendLine")
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("clip-path", "url(#clip)")
        .attr("stroke-width", 1.5)
        .attr("d", trendLine)

    // Add the trend line
    graph.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x((d) => { return x2(Date.parse(d.Date)); })
            .y((d) => { return y2(d.Trend) })
        )

    // Add the interpolated line
    graph.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x((d) => { return x2(Date.parse(d.Date)); })
            .y((d) => { return y2(d.Interpolated) })
        )

    graph.append("rect")
        .attr("class", "zoom")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoom);

    graph.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, x2.range());

}
