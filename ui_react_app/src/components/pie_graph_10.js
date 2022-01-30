import React, { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "POI Tweets Sentiment",
    },
  },
};

class PieGraph10 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reactionso: "",
      loadgraph: true,
    };
  }

  /*componentWillMount() {
    axios.defaults.headers.post["Content-Type"] =
      "application/x-www-form-urlencoded";

    axios
      .get("http://0.0.0.0:9999/pois_sentiment")
      .then((response) => {
        var data = response.data;
        var labels = data["labels"];
        // console.log(labels);
        var reactions = data["reactions"];
        // console.log(reactions);

        const positiveR = reactions.map((rt) => rt[0]);
        const neutralR = reactions.map((rt) => rt[1]);
        const negativeR = reactions.map((rt) => rt[2]);

        this.setState(
          ,
          () => {
            this.setState({ loadgraph: true });
          }
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  }*/

  render() {
    const labels = this.props.labels; //["English", "Hindi", "Spanish"];
    const data = {
      labels,
      datasets: [
        {
          label: "Language Wise Distribution of Tweets",
          data: [
            Math.round(Math.random() * (350 - 50)),
            Math.round(Math.random() * (350 - 50)),
            Math.round(Math.random() * (350 - 50)),
            Math.round(Math.random() * (350 - 50)),
            Math.round(Math.random() * (350 - 50)),
            Math.round(Math.random() * (350 - 50)),
            Math.round(Math.random() * (350 - 50)),
            Math.round(Math.random() * (350 - 50)),
            Math.round(Math.random() * (350 - 50)),
            Math.round(Math.random() * (350 - 50)),
          ],
          backgroundColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 194, 255, 1)",
            "rgba(255, 195, 64, 1)",
            "rgba(75, 129, 192, 1)",
            "rgba(153, 110, 255, 1)",
            "rgba(255, 193, 64, 1)",
            "rgba(75, 142, 192, 1)",
          ],
        },
      ],
    };
    return this.state.loadgraph ? (
      <div
        style={{ paddingLeft: "14%", paddingRight: "14%", paddingTop: "3%" }}
      >
        <Doughnut data={data} />
      </div>
    ) : (
      <div></div>
    );
  }
}

export default PieGraph10;
