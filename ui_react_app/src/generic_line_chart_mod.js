import axios from "axios";
import { Grid, button, PortalInner, Loader } from "semantic-ui-react";
import useInterval from "./useInterval";
import React, { useState } from "react";
import GenericLineChart from "./GenericLineChart";
import * as Plot from "@observablehq/plot";

class GenericLineChartMod extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trendSet: false,
      trendData: {},
    };
  }

  render() {
    if (this.props.allpois.length > 0 && !this.state.trendSet) {
      let tweet_times = this.props.allpois.map((tw) => new Date(tw.tweet_date));
      tweet_times = tweet_times.sort((d1, d2) => d1.getTime() - d2.getTime());

      let tweet_mo_yr = tweet_times.map((d) => {
        return d.toISOString().split("T")[0];
      });

      let unique_times = [...new Set(tweet_mo_yr)];

      let tweet_counts_in_time = unique_times.map(
        (t) => tweet_mo_yr.filter((x) => x == t).length
      );
      let data = [];
      for (let i = 0; i < unique_times.length; i++) {
        data.push({
          index: i,
          Time: new Date(unique_times[i]),
          Count: tweet_counts_in_time[i],
        });
      }

      this.setState({ trendData: data });
      this.setState({ trendSet: true });
    }

    return (
      <div style={{ paddingBottom: "10%", paddingTop: "4%" }}>
        {this.state.trendSet ? (
          <GenericLineChart data={this.state.trendData} />
        ) : (
          <Loader active inline="centered" style={{ marginTop: "10%" }} />
        )}
      </div>
    );
  }
}

export default GenericLineChartMod;
