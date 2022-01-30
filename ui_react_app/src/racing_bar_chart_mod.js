import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import {
  Grid,
  button,
  PortalInner,
  Modal,
  Button,
  Header,
  Loader,
} from "semantic-ui-react";
import useInterval from "./useInterval";
import React, { useState, useCallback, dispatch } from "react";
import RacingBarChart from "./RacingBarChart";
import GenericLineChart from "./GenericLineChart";
import * as Plot from "@observablehq/plot";

export const RacingBarChartMod = (props) => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState({
    tweet_times: {},
    race_bar_data: {},
    tweet_trends: {},
  });
  const [monthYrIteration, setMonthYrIteration] = useState(0);
  const [start, setStart] = useState(false);
  const [data, setData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [minDate, setMinDate] = useState(new Date("2020-2-01"));
  let e = new Date("2021-10-01");
  let daysArray = [];

  for (var d = minDate; d <= e; d.setMonth(d.getMonth() + 1)) {
    daysArray.push(new Date(d));
  }

  daysArray = daysArray.map((d) => d.getMonth() + "-" + d.getFullYear());
  let daysArrayTransition = [];
  for (let i = 0; i < daysArray.length; i++) {
    daysArrayTransition.push.apply(
      daysArrayTransition,
      Array(11).fill(daysArray[i])
    );
  }
  const [timeArray, setTimeArray] = useState(daysArrayTransition);
  const [timeArrayPrev, setTimeArrayPrev] = useState(daysArray);

  useInterval(() => {
    if (start) {
      let currIteration = monthYrIteration + 1;
      setMonthYrIteration(monthYrIteration + 1);

      setData(
        data.map((entry, index) =>
          true == true
            ? {
                ...entry,
                date:
                  entry.dateList.length <= currIteration
                    ? entry.dateList[entry.dateList.length - 1]
                    : entry.dateList[currIteration],
                value:
                  entry.valueList.length <= currIteration
                    ? entry.valueList[entry.valueList.length - 1]
                    : entry.valueList[currIteration],
              }
            : entry
        )
      );

      if (currIteration > timeArray.length - 1) {
        setStart(false);
        setMonthYrIteration(0);
        setData(analytics["race_bar_data"]);
      }
    }
  }, 200);

  async function getDataAxios() {
    const response = props.allpois;

    let tweet_times = getTweetTimes(response);
    let race_bar_data = getBarChartRaceData(response);
    let tweet_trends = getTweetTrends(response);
    setAnalytics({
      tweet_times: tweet_times,
      race_bar_data: race_bar_data,
      tweet_trends: tweet_trends,
    });
    setData(race_bar_data);
    setTrendData(tweet_trends);
    setShowAnalytics(true);
    race_bar_data.map((poi) =>
      poi.dateList.reduce(function (pre, cur) {
        return Date.parse(pre) > Date.parse(cur) ? cur : pre;
      })
    );
  }

  function getTweetTrends(response) {
    let tweet_times = response.map((tw) => new Date(tw.tweet_date));
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

    return data;
  }

  function getBarChartRaceData(response) {
    let data = {};
    let groupByPOI = response
      .filter((tw) => tw.poi_name != undefined)
      .reduce((hash, obj) => {
        return Object.assign(hash, {
          [obj.poi_name]: (hash[obj.poi_name] || []).concat(obj),
        });
      }, {});
    let tweetTimesByPOI = [];
    for (const [poi, poi_tweets] of Object.entries(groupByPOI)) {
      let poi_tweet_times = getTweetTimes(poi_tweets);
      const randomRed = Math.floor(100 + Math.random() * 100).toString(16);
      const randomGreen = Math.floor(100 + Math.random() * 100).toString(16);
      const randomBlue = Math.floor(100 + Math.random() * 100).toString(16);

      console.log("poitweettimes");
      console.log(poi_tweet_times);
      tweetTimesByPOI.push({
        name: poi,
        category: "India",
        color: "#" + randomRed + randomGreen + randomBlue,
        date: poi_tweet_times["x"][monthYrIteration],
        value: poi_tweet_times["y"][monthYrIteration],
        dateList: poi_tweet_times["x"],
        valueList: poi_tweet_times["y"],
      });
    }
    return tweetTimesByPOI;
  }

  function getTweetTimes(response) {
    let tweet_times = response.map((tw) => new Date(tw.tweet_date));
    let min_Date = tweet_times.reduce(function (pre, cur) {
      return Date.parse(pre) > Date.parse(cur) ? cur : pre;
    });
    let tweet_mo_yr = tweet_times.map(
      (d) => d.getMonth() + "-" + d.getFullYear()
    );
    tweet_mo_yr = tweet_mo_yr.reverse();

    let tweet_counts_in_time = timeArrayPrev.map(
      (t) => tweet_mo_yr.filter((x) => x == t).length
    );

    let tweet_counts_transitions = [tweet_counts_in_time[0]];
    for (let i = 0; i < tweet_counts_in_time.length - 1; i++) {
      let diff = (tweet_counts_in_time[i + 1] - tweet_counts_in_time[i]) / 10;

      for (let t_idx = 0; t_idx < 9; t_idx++) {
        let lastElt =
          tweet_counts_transitions[tweet_counts_transitions.length - 1];
        tweet_counts_transitions.push(lastElt + diff);
      }
      tweet_counts_transitions.push(tweet_counts_in_time[i + 1]);
    }
    tweet_counts_transitions = tweet_counts_transitions.map((t) =>
      t.toFixed(0)
    );
    console.log(tweet_counts_transitions);
    return { x: timeArray, y: tweet_counts_transitions, min_Date: min_Date };
  }

  const map1 = new Map();
  map1.set(1, "Jan");
  map1.set(2, "Feb");
  map1.set(3, "Mar");
  map1.set(4, "Apr");
  map1.set(5, "May");
  map1.set(6, "Jun");
  map1.set(7, "Jul");
  map1.set(8, "Aug");
  map1.set(9, "Sep");
  map1.set(10, "Oct");
  map1.set(11, "Nov");
  map1.set(12, "Dec");

  const showModal = () => {
    setOpen(true);
    getDataAxios();
  };

  return (
    <div style={{ paddingTop: "5%" }}>
      <Modal centered={false} open={open} onClose={() => setOpen(false)}>
        <Modal.Header>Time Series - POI Tweets over Time</Modal.Header>
        <Modal.Content>
          <div>
            <Header as="h3" attached="top" style={{ color: "#005073" }}>
              Time: {timeArray[monthYrIteration]}
            </Header>
            {showAnalytics && (
              <div style={{ padding: "3%" }}>
                <RacingBarChart data={data} />
              </div>
            )}
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button primary onClick={() => setStart(!start)}>
            {start ? "Stop" : "Start"}
          </Button>
        </Modal.Actions>
      </Modal>
      {
        <Button fluid color="blue" onClick={() => showModal()}>
          Show Live Time Graph
        </Button>
      }
    </div>
  );
};

export default RacingBarChartMod;
