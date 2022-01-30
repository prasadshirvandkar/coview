import React, { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import { Loader } from "semantic-ui-react";

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

class LanguageWiseGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: ["Label"],
      counts: [100],
    };
  }

  componentWillMount() {
    axios.defaults.headers.post["Content-Type"] =
      "application/x-www-form-urlencoded";

    axios
      .post("http://0.0.0.0:9999/get_tweets_count", {
        query: this.props.searchedValue,
        field: this.props.field,
      })
      .then((response) => {
        var data = response.data;
        var l = data["labels"];
        var c = data["counts"];
        console.log(l);
        console.log(c);
        this.setState(
          {
            labels: l,
            counts: c,
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
    const labels = this.state.labels; //["English", "Hindi", "Spanish"];
    const count = this.state.counts;
    const data = {
      labels,
      datasets: [
        {
          label: "Language Wise Distribution of Tweets",
          data: count,
          backgroundColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
          ],
        },
      ],
    };
    return this.state.loadgraph ? (
      <div
        style={{ paddingLeft: "20%", paddingRight: "20%", paddingTop: "3%" }}
      >
        <Doughnut data={data} />
      </div>
    ) : (
      <div>
        <Loader active inline="centered" style={{ marginTop: "10%" }} />
      </div>
    );
  }
}

export default LanguageWiseGraph;
