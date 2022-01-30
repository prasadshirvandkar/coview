import React, { useState } from "react";
import {
  Grid,
  Icon,
  Segment,
  Card,
  Image,
  Button,
  Header,
} from "semantic-ui-react";
import twitter from "./images/twitter.png";
import happy from "./images/emoticon-happy-outline.png";
import sad from "./images/emoticon-sad-outline.png";
import neutral from "./images/emoticon-neutral-outline.png";
import { MoreLikeThis } from "./more_like_this";
import axios from "axios";
import Highlight from "react-highlighter";
import { PeopleReactions } from "./people_reactions";

export const TweetCardsCenter = (props) => {
  const [open, setOpen] = useState(false);
  const [openReactions, setOpenReactions] = useState(false);
  const [stance, setStance] = useState("");
  const [replyCount, setReplyCount] = useState(0);
  const [moreLikeThisTweets, setMoreLikeThisTweets] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [reactionsd, setReactionsD] = useState([]);
  const tweet = props.tweet;
  const highlight = props.highlight;

  const onClickMoreLikeThis = () => {
    setOpen(true);
    var value = "";
    if ("text_en" in tweet) {
      value = tweet["text_en"];
    } else if ("text_es" in tweet) {
      value = tweet["text_es"];
    } else {
      value = tweet["text_hi"];
    }

    axios
      .get("http://0.0.0.0:9999/more_like_this/" + value)
      .then((response) => {
        setMoreLikeThisTweets(response.data);
      })
      .catch(function (error) {
        console.log(error);
        setTimeout(() => {}, 2000);
      });
  };

  const onClickReactions = () => {
    axios
      .get("http://0.0.0.0:9999/get_reactions_for_tweet/" + tweet["id"])
      .then((response) => {
        setOpenReactions(true);
        setReactions(response.data);
        var reply = response.data;
        setReactionsD([reply[1], reply[2], reply[3]]);
        setReplyCount(reply[0]);

        var comment = "People seems to be with POI";
        if (reply[2] >= reply[1] && reply[2] >= reply[3]) {
          comment = "People seems to be Neutral about the Tweet";
        } else if (reply[3] >= reply[1] && reply[3] >= reply[2]) {
          comment = "People seems to be against the tweet";
        }
        setStance(comment);
      })
      .catch(function (error) {
        console.log(error);
        setTimeout(() => {}, 2000);
      });
  };

  const openCloseModal = (data) => {
    setOpen(data);
  };

  const openCloseReactionsModal = (data) => {
    setOpenReactions(data);
  };

  const sentiment = () => {
    var sentiment = tweet["sentiment"];
    if (sentiment == "positive") {
      return (
        <Header
          as="h5"
          icon={
            <i className="icon">
              <img width={25} height={25} src={happy} />
            </i>
          }
          color="green"
          content="Positive"
        />
      );
    } else if (sentiment == "neutral") {
      return (
        <Header
          as="h5"
          icon={
            <i className="icon">
              <img width={25} height={25} src={neutral} />
            </i>
          }
          color="yellow"
          content="Neutral"
        />
      );
    } else {
      return (
        <Header
          as="h5"
          icon={
            <i className="icon">
              <img width={25} height={25} src={sad} />
            </i>
          }
          color="red"
          content="Negative"
        />
      );
    }
  };

  return (
    <>
      <Card fluid>
        <Card.Content>
          <Image floated="left" avatar src={twitter} />
          <Card.Header>
            {"poi_name" in tweet ? tweet["poi_name"] : "Twitter User"}
          </Card.Header>
          <Card.Meta>{tweet["tweet_date"]}</Card.Meta>
          <Card.Description>
            <Highlight search={highlight} style={{ fontSize: "16px" }}>
              {tweet["tweet_text"]}
            </Highlight>
          </Card.Description>
        </Card.Content>
        <Card.Content extra style={{ margin: "6px", marginTop: "10px" }}>
          <Grid columns="equal" textAlign="center">
            <Grid.Column>
              <div>{sentiment()}</div>
            </Grid.Column>
            {"poi_name" in tweet ? (
              <Grid.Column onClick={onClickReactions}>
                <Header
                  as="h5"
                  icon="hand point up outline"
                  color="blue"
                  content="Reactions"
                />
                {openReactions ? (
                  <PeopleReactions
                    open={openReactions}
                    openClose={openCloseReactionsModal}
                    reactions={reactions}
                    replyCount={replyCount}
                    reactionsD={reactionsd}
                    stanceD={stance}
                  />
                ) : (
                  <></>
                )}
              </Grid.Column>
            ) : (
              <> </>
            )}
            <Grid.Column onClick={onClickMoreLikeThis}>
              <Header
                as="h5"
                icon="list alternate outline"
                color="blue"
                content="More Like This"
              />
              {open ? (
                <MoreLikeThis
                  open={open}
                  openClose={openCloseModal}
                  moreLikeThisTweets={moreLikeThisTweets}
                />
              ) : (
                <></>
              )}
            </Grid.Column>
          </Grid>
        </Card.Content>
      </Card>
    </>
  );
};
