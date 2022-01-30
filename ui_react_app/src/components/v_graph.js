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
      text: "Topics wise Tweets Distribution",
    },
  },
};

class VGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reactionso: "",
      loadgraph: true,
    };
  }

  componentWillMount() {
    /*
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
      */
  }

  render() {
    const labels = [
      "covid",
      "vaccines",
      "hospital",
      "lockdowns",
      "socialdistancing",
      "quarantine",
      "masks",
      "covaxin",
      "virus",
      "symptoms",
      "staysafe",
      "workfromhome",
      "modi",
    ];

    var arr = [];
    while (arr.length < labels.length) {
      arr.push(Math.random(Math.random() * (900 - 50)));
    }

    arr = arr.sort();
    arr = arr.reverse();

    const data = {
      labels,
      datasets: [
        {
          label: "Tweets Count",
          data: [
            4563, 3532, 3123, 3001, 2928, 2867, 2765, 1954, 1758, 1734, 1654,
            1612, 1000,
          ],
          backgroundColor: "rgba(53, 162, 235, 1)",
        },
      ],
    };

    return this.state.loadgraph ? (
      <div>
        <Bar options={options} data={data} />
      </div>
    ) : (
      <div></div>
    );
  }
}

export default VGraph;
