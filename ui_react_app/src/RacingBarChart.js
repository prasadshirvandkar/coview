import React, { useRef, useEffect } from "react";
import { easeLinear, select, scaleBand, scaleLinear, max } from "d3";
import useResizeObserver from "./useResizeObserver";

function RacingBarChart({ data }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions) return;

    // sorting the data
    console.log("data change:");
    console.log(data);
    data.sort((a, b) => b.value - a.value);

    const yScale = scaleBand()
      .paddingInner(0.1)
      .domain(data.map((value, index) => index)) // [0,1,2,3,4,5]
      .range([0, dimensions.height]); // [0, 200]

    const xScale = scaleLinear()
      .domain([0, max(data, (entry) => entry.value)]) // [0, 65 (example)]
      .range([0, 10]); // [0, 400 (example)]

    // draw the bars
    svg
      .selectAll(".bar")
      .data(data, (entry, index) => entry.name)
      .join((enter) =>
        enter.append("rect").attr("y", (entry, index) => yScale(index))
      )
      .attr("fill", (entry) => entry.color)
      .attr("class", "bar")
      .attr("x", 0)
      .attr("height", yScale.bandwidth())
      .transition()
      .ease(easeLinear)
      .attr("width", (entry) => xScale(entry.value))
      .attr("y", (entry, index) => yScale(index));

    // draw the labels
    svg
      .selectAll(".label")
      .data(data, (entry, index) => entry.name)
      .join((enter) =>
        enter
          .append("text")
          .attr(
            "y",
            (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5
          )
      )
      .text((entry) => `${entry.name}: ${entry.value}`)
      .attr("class", "label")
      // .attr("align", "left")
      .attr("x", 10)
      .transition()
      .attr("y", (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5);
    // svg
    //   .selectAll(".title")
    //   .enter()
    //   .append("div")
    //   .style("border", "1px black solid")
    //   .attr("class", "title")
    //   .text("hello world")
    //   .html(d => d);
    // svg
    //   .selectAll(".title")
    //   .data(data, (entry, index) => entry.name)
    //   .join(
    //     (enter) => enter.append("text")
    //     // .attr(
    //     //   "y",
    //     //   (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5
    //     // )
    //   )
    //   .text((entry) => `${entry.date}`)
    //   .attr("class", "title")
    //   .attr("x", 10)
    //   .transition();
    // .attr("y", (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5);
  }, [data, dimensions]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef} style={{ height: "600px", width: "800px" }}></svg>
    </div>
  );
}

export default RacingBarChart;
