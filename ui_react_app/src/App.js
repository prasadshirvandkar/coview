import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { Grid, button, PortalInner } from "semantic-ui-react";
import useInterval from "./useInterval";
import React, { useState } from "react";
import RacingBarChart from "./RacingBarChart";
import GenericLineChart from "./GenericLineChart";
import * as Plot from "@observablehq/plot";

function App() {
  const [showAnalytics, setShowAnalytics] = useState(false);
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
  console.log(minDate);
  console.log(e);
  for (var d = minDate; d <= e; d.setMonth(d.getMonth() + 1)) {
    // console.log(d);
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
      // console.log("setting new value: before");
      // console.log(data);
      // console.log("monthyr iter:");
      // console.log(monthYrIteration);
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
                // date: analytics["race_bar_data"]["date"][monthYrIteration],
                // value: analytics["race_bar_data"]["value"][monthYrIteration],
              }
            : entry
        )
      );
      console.log("setting new value: after");
      console.log(data);
      if (currIteration > timeArray.length - 1) {
        setStart(false);
        setMonthYrIteration(0);
        setData(analytics["race_bar_data"]);
      }
    }
  }, 200);

  let queryText = document.getElementById("searchBar");
  let tweets = ["Tweet1", "Tweet2"];
  let tweetsList = tweets.map((item, index) => {
    return <SearchResult text={item}></SearchResult>;
  });

  function searchQuery() {
    console.log("user searched");
    console.log(document.getElementById("searchBar").value);

    // setTimeArray(daysArray, getDataAxios());
    getDataAxios();
  }

  async function getDataAxios() {
    console.log(timeArray);

    /*
    let response = await axios.get(
      // "http://3.137.183.67:8983/solr/IRF21P1/select?q=*%3A*&rows=50000"
      "http://18.216.179.55:8983/solr/IRF21P1/select?q=*%3A*&rows=50000"
      // "http://18.216.179.55:8983/solr/IRF21P1/select?q.op=OR&q=poi_name%3A%22Narendra%20Modi%22&q=poi_name%3A%22Joe%20Biden%22&rows=1000000"

      // "http://18.216.179.55:8983/solr/IRF21P1/select?q.op=OR&q=*%3A*&fl=lang:eng"
      //  , {
      //   params: { lang: "eng" },
      // }
    );*/

    let response = await axios.get("http://0.0.0.0:9999/get_all_pois");
    console.log("Response");
    console.log(response);
    response = response.data;

    let tweet_times = getTweetTimes(response);
    let race_bar_data = getBarChartRaceData(response);
    // tweet_trends = tweet_times.map()
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

    console.log("sorted times:");
    console.log(tweet_times);
    let tweet_mo_yr = tweet_times.map((d) => {
      // let dummy = d.toISOString().split("T")[0].split("-");
      // return dummy[0] + "-" + dummy[1];
      return d.toISOString().split("T")[0];
    });
    console.log("After makingset:");
    let unique_times = [...new Set(tweet_mo_yr)];
    console.log(unique_times);
    let tweet_counts_in_time = unique_times.map(
      (t) => tweet_mo_yr.filter((x) => x == t).length
    );
    let data = [];
    for (let i = 0; i < unique_times.length; i++) {
      // if (tweet_counts_in_time[i] > 200) {
      //   continue;
      // }
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
    // let tweet_times = getTweetTimes(response);
    // let pois = response.map((d) => d.poi_name);
    // let unique_pois = [...new Set(pois)];
    // ;
    let groupByPOI = response
      .filter((tw) => tw.poi_name != undefined)
      .reduce((hash, obj) => {
        // if (obj.poi_name === undefined) return hash;
        return Object.assign(hash, {
          [obj.poi_name]: (hash[obj.poi_name] || []).concat(obj),
        });
      }, {});
    let tweetTimesByPOI = [];
    for (const [poi, poi_tweets] of Object.entries(groupByPOI)) {
      let poi_tweet_times = getTweetTimes(poi_tweets);
      // const randomColor = Math.floor(Math.random() * 16777215).toString(16);
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
    // console.log("Earliest date:");
    // console.log(min_Date);
    let tweet_mo_yr = tweet_times.map(
      (d) => d.getMonth() + "-" + d.getFullYear()
    );
    console.log(tweet_mo_yr);
    tweet_mo_yr = tweet_mo_yr.reverse();
    // console.log("called tweet times:");
    // console.log(timeArray);
    // let unique_times = [...new Set(tweet_mo_yr)];
    // let unique_times_all = [];
    // for (let i = 0; i < timeArray.length; i++){
    //   if (timeArray[i] in unique_times) {
    //     unique_times_all.push(timeArray[i]);
    //   }
    // }
    let tweet_counts_in_time = timeArrayPrev.map(
      (t) => tweet_mo_yr.filter((x) => x == t).length
    );
    console.log("transitions in counts");
    console.log(tweet_counts_in_time);

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

  function transformArrayToData(in_data) {
    let x = in_data["x"];
    let y = in_data["y"];
    let data = [];
    for (let i = 0; i < x.length; i++) {
      data.push({ x: x[i], y: y[i] });
    }
    return data;
  }

  function SearchResult(props) {
    return (
      <div className="search-result">
        <div>{props.text}</div>
        <div>Sentiment comes here.</div>
      </div>
    );
  }

  function QueryResultList(props) {
    return <div>{tweetsList}</div>;
  }
  return (
    <div>
      <div className="search">
        <input type="text" id="searchBar" name="query" />
        <button id="searchButton" onClick={searchQuery}>
          Search
        </button>
        <button class="ui primary button">Save</button>
      </div>
      <div className="filters">
        <input type="checkbox" value="USA" name="country" /> USA
        <input type="checkbox" value="India" name="country" /> India
        <input type="checkbox" value="Mexico" name="country" /> Mexico
        <input type="checkbox" value="Any" name="country" /> Any
      </div>
      <div>
        <div className="heading">Search results</div>
        <QueryResultList></QueryResultList>
      </div>
      {showAnalytics && (
        <div>
          <RacingBarChart data={data} />
        </div>
      )}
      {showAnalytics && (
        <button onClick={() => setStart(!start)}>
          {start ? "Stop" : "Start"}
        </button>
      )}
      {showAnalytics && <p>Time: {timeArray[monthYrIteration]}</p>}
      {showAnalytics && <GenericLineChart data={trendData} />}
      {/* <GenericAreaChart data={analytics["tweet_trends"]}></GenericAreaChart> */}
    </div>
  );
}

export default App;
