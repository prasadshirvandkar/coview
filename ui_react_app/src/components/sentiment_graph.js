import React, { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import { Loader, Header } from "semantic-ui-react";

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

class SentimentGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ind_counts: [100],
      us_counts: [100],
      me_counts: [100],
    };
  }

  componentWillMount() {
    axios.defaults.headers.post["Content-Type"] =
      "application/x-www-form-urlencoded";

    axios
      .get(
        "http://0.0.0.0:9999/get_sentiment_count/" + this.props.searchedValue
      )
      .then((response) => {
        var data = response.data;
        console.log(response);
        this.setState(
          {
            ind_counts: data[0]["India"],
            us_counts: data[1]["USA"],
            me_counts: data[2]["Mexico"],
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
    const labels = ["Positive", "Neutral", "Negative"];
    const in_count = this.state.ind_counts;
    const us_count = this.state.us_counts;
    const mx_count = this.state.me_counts;

    const data1 = {
      labels,
      datasets: [
        {
          label: "Country Wise Sentiment Distribution of Tweets",
          data: in_count,
          backgroundColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
          ],
        },
      ],
    };

    const data2 = {
      labels,
      datasets: [
        {
          label: "Country Wise Sentiment Distribution of Tweets",
          data: us_count,
          backgroundColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
          ],
        },
      ],
    };

    const data3 = {
      labels,
      datasets: [
        {
          label: "Country Wise Sentiment Distribution of Tweets",
          data: mx_count,
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
        <Header as="h3">India Sentiment on Tweets</Header>
        <Doughnut data={data1} />
        <Header as="h3">United States Sentiment on Tweets</Header>
        <Doughnut data={data2} />
        <Header as="h3">Mexico Sentiment on Tweets</Header>
        <Doughnut data={data3} />
      </div>
    ) : (
      <div>
        <Loader active inline="centered" style={{ marginTop: "10%" }} />
      </div>
    );
  }
}

export default SentimentGraph;
