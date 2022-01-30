import React, { useState } from "react";
import {
  Input,
  Segment,
  Header,
  Divider,
  Form,
  Message,
  Loader,
  Card,
  Button,
  Image,
  Icon,
  Label,
  List,
  Tab,
} from "semantic-ui-react";
import axios from "axios";
import { TweetCardsCenter } from "./tweet_cards_center";
import Graph from "../graph";

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
import PieGraph from "./pie_graph";
import PieGraph10 from "./pie_graph_10";
import VGraph from "./v_graph";
import GenericLineChartMod from "../generic_line_chart_mod";
import RacingBarChartMod from "../racing_bar_chart_mod";
import LanguageWiseGraph from "./language_wise_graph";
import SentimentGraph from "./sentiment_graph";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const CenterPanel = (props) => {
  const poi_info = props.poi_info;
  const poi_tweets = props.poi_tweets;
  const general_tweets = props.general_tweets;
  const dataLoaded = props.dataLoaded;
  const load = props.load;
  const searchEmpty = props.searchEmpty;
  const reactions = props.reactionsg;
  const hashtagsl = props.hashtagsl;
  const hashtagsc = props.hashtagsc;

  const searchedValueToHighlight = props.searchedValueToSend;

  const allPois = props.allpois;

  const options = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "People Reactions on Searched Query",
      },
    },
  };

  const labels = ["Positive", "Neutral", "Negative"];
  const data = {
    labels,
    datasets: [
      {
        label: "Reactions",
        data: reactions,
        borderColor: "rgb(30,144,255, 1)",
        backgroundColor: "rgba(30,144,255, 0.8)",
      },
    ],
  };

  const hashtags = [];
  const mySet1 = new Set();
  for (let i = 0; i < 10; i++) {
    if (hashtags.length == 10) {
      break;
    }
    var general_tweet = general_tweets[i];
    if (general_tweet != undefined) {
      if ("hashtags" in general_tweet) {
        for (let j = 0; j < general_tweet["hashtags"].length; j++) {
          var hashtg = general_tweet["hashtags"][j].toLowerCase();
          if (hashtg !== "nan" && !mySet1.has(hashtg)) {
            hashtags.push(hashtg);
            mySet1.add(hashtg);
            if (hashtags.length == 10) {
              break;
            }
          }
        }
      }
    }
  }

  const panes = [
    {
      menuItem: "Tweets from POI",
      render: () => (
        <Tab.Pane>
          {poi_tweets === null || poi_tweets.length == 0 ? (
            <div></div>
          ) : (
            <div>
              {poi_tweets.map((tweet, i) => (
                <TweetCardsCenter
                  key={"tid" + i}
                  tweet={tweet}
                  style={{ marginTop: "10%" }}
                  highlight=""
                />
              ))}
            </div>
          )}
        </Tab.Pane>
      ),
    },
    {
      menuItem: "General Population Tweets",
      render: () => (
        <Tab.Pane>
          {general_tweets === null || general_tweets.length == 0 ? (
            <div>
              {searchEmpty ? (
                <div></div>
              ) : (
                <Message color="orange" as="h5">
                  No Tweets for the searched query. Try for a different one !!
                </Message>
              )}
            </div>
          ) : (
            <div>
              {general_tweets.map((tweet, i) => (
                <TweetCardsCenter
                  key={"tid" + i + "234235234"}
                  tweet={tweet}
                  style={{ marginTop: "10%" }}
                  highlight={searchedValueToHighlight}
                />
              ))}
            </div>
          )}
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Analysis",
      render: () => (
        <div>
          <Header as="h3" attached="top" style={{ color: "#005073" }}>
            POI Sentiments Overall
          </Header>
          <Graph />
          <Header as="h3" attached="top" style={{ color: "#005073" }}>
            Top 10 Hashtags
          </Header>
          <PieGraph10 labels={hashtags} counts={hashtagsc[0]} />
          <Header as="h3" attached="top" style={{ color: "#005073" }}>
            Time wise Live POI Tweets Data
          </Header>
          <RacingBarChartMod allpois={allPois} />
          <Header as="h3" attached="top" style={{ color: "#005073" }}>
            Time wise POI Tweets Data
          </Header>
          <GenericLineChartMod allpois={allPois} />
          <Header as="h3" attached="top" style={{ color: "#005073" }}>
            Country Wise Distribution of Tweets
          </Header>
          <LanguageWiseGraph
            searchedValue={searchedValueToHighlight}
            field="country"
          />
          <Header as="h3" attached="top" style={{ color: "#005073" }}>
            Language Wise Distribution of Tweets
          </Header>
          <LanguageWiseGraph
            searchedValue={searchedValueToHighlight}
            field="tweet_lang"
          />
          <Header as="h3" attached="top" style={{ color: "#005073" }}>
            Language Wise Sentiment of Tweets
          </Header>
          <SentimentGraph searchedValue={searchedValueToHighlight} />
          <Header as="h3" attached="top" style={{ color: "#005073" }}>
            Topic wise Tweets in Corpus
          </Header>
          <VGraph />
        </div>
      ),
    },
  ];

  return (
    <div>
      {dataLoaded ? (
        <div>
          <Divider horizontal>Searched Tweets</Divider>
          <p>
            Showing Top <i>100</i> Results
          </p>
          <Bar options={options} data={data} style={{ marginBottom: "3%" }} />
          {poi_info === null || poi_info.length == 0 ? (
            <div></div>
          ) : (
            <div>
              <Header as="h3" attached="top" style={{ color: "#005073" }}>
                Info
              </Header>
              <Segment attached>
                <Card fluid>
                  <Card.Content>
                    <Image
                      floated="right"
                      size="mini"
                      src="https://react.semantic-ui.com/images/avatar/large/steve.jpg"
                    />
                    <Card.Header>{poi_info["name"]}</Card.Header>
                    <Card.Meta>@{poi_info["username"]}</Card.Meta>
                    <Card.Description>
                      <List>
                        <List.Item>
                          <h5>Designation: {poi_info["designation"]}</h5>
                        </List.Item>
                        <List.Item>Party: {poi_info["party"]}</List.Item>
                        <List.Item>
                          Born:{" "}
                          {poi_info["born"] + " (" + poi_info["age"] + ")"}
                        </List.Item>
                      </List>
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <Button.Group>
                      <Button as="div" labelPosition="right">
                        <Button color="blue">
                          <Icon name="user circle outline" />
                          Followers
                        </Button>
                        <Label as="a" basic color="blue" pointing="left">
                          {poi_info["followers"]}
                        </Label>
                      </Button>
                      <Button
                        as="div"
                        labelPosition="right"
                        style={{ marginLeft: "5%" }}
                      >
                        <Button color="blue">
                          <Icon name="paper plane outline" />
                          Tweets
                        </Button>
                        <Label as="a" basic color="blue" pointing="left">
                          {poi_info["tweets"]}
                        </Label>
                      </Button>
                    </Button.Group>
                  </Card.Content>
                </Card>
              </Segment>
            </div>
          )}
          <Tab panes={panes} />
        </div>
      ) : load ? (
        <Loader active inline="centered" style={{ marginTop: "10%" }} />
      ) : (
        <div style={{ paddingTop: "5%" }}>
          {searchEmpty ? (
            <Message color="red" as="h5">
              Error Occured. Input a query to search something ...
            </Message>
          ) : (
            <Message color="blue" as="h5">
              Nothing Searched Yet. Input query into Search Bar above to search
              for tweets. :)
            </Message>
          )}
        </div>
      )}
    </div>
  );
};
