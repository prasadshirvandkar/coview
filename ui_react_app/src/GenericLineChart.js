import { easeLinear, select, scaleBand, scaleLinear, max, svg } from "d3";
import * as d3 from "d3";
import React, { useRef, useEffect } from "react";
import * as Plot from "@observablehq/plot";

function GenericLineChart({ data }) {
  const svg = useRef(null);
  console.log(data);
  data = data.slice(10);
  let chart = Plot.plot({
    style: {
      background: "white",
      color: "rgba(54, 162, 235, 1)",
    },
    y: {
      grid: true,
    },
    x: {
      grid: true,
    },
    // x: { ticks: 10 },
    marks: [
      Plot.line(data, { x: "Time", y: "Count" }),
      Plot.line({
        x: { domain: [new Date("2021-01-01"), new Date("2022-01-01")] },
        grid: true,
      }),
      //   Plot.line(data, {  fill: "#black" }),
      //   Plot.text(data, {
      //     filter: (d) => d.index % 5 === 0,
      //     x: "Time",
      //     y: "Count",
      //     text: "index",
      //     dy: -6,
      //   }),
    ],
  });
  useEffect(() => {
    if (svg.current) {
      svg.current.appendChild(chart);
    }
  }, []);
  return <div ref={svg} />;
}
export default GenericLineChart;
