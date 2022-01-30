import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reactionso: "",
      loadgraph: false,
    };
  }

  componentWillMount() {
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
          {
            reactionso: {
              labels,
              datasets: [
                {
                  label: "Positive",
                  data: positiveR,
                  backgroundColor: "rgba(53, 162, 235, 1)",
                },
                {
                  label: "Neutral",
                  data: neutralR,
                  backgroundColor: "rgba(53, 162, 235, 0.4)",
                },
                {
                  label: "Negative",
                  data: negativeR,
                  backgroundColor: "rgba(255, 0, 0, 1)",
                },
              ],
            },
          },
          () => {
            this.setState({ loadgraph: true });
          }
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return this.state.loadgraph ? (
      <div>
        <Bar options={options} data={this.state.reactionso} />
      </div>
    ) : (
      <div></div>
    );
  }
}

export default Graph;
