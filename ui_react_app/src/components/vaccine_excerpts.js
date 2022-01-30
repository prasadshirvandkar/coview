import React, { useState } from "react";
import { Image, Card, Modal, Grid, Header, Loader } from "semantic-ui-react";
import twitter from "./images/twitter.png";
import happy from "./images/emoticon-happy-outline.png";
import sad from "./images/emoticon-sad-outline.png";
import neutral from "./images/emoticon-neutral-outline.png";

export const VaccineExcerpts = (props) => {
  const open = props.open;
  const tweets = props.vaccineexcerptstweets;

  const get_sentiment = (sentiment) => {
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
      {tweets.length > 0 ? (
        <Modal open={open} onClose={() => props.openClose(false)}>
          <Modal.Header>Vaccine Excerpts or Disinformation Tweets</Modal.Header>
          <Modal.Content scrolling>
            {tweets.map((tweet) => (
              <Card fluid key={tweet["id"] + tweet["id"]}>
                <Card.Content>
                  <Image floated="left" avatar src={twitter} />
                  <Card.Header>Person</Card.Header>
                  <Card.Meta>{tweet["tweet_date"]}</Card.Meta>
                  <Card.Description>
                    <p style={{ fontSize: "16px" }}>{tweet["tweet_text"]}</p>
                    <a href={tweet["tweet_urls"]}>{tweet["tweet_urls"]}</a>
                  </Card.Description>
                </Card.Content>
                <Card.Content
                  extra
                  style={{ margin: "6px", marginTop: "10px" }}
                >
                  <Grid columns="equal" textAlign="center">
                    <Grid.Column>
                      <div>{get_sentiment(tweet["sentiment"])}</div>
                    </Grid.Column>
                  </Grid>
                </Card.Content>
              </Card>
            ))}
          </Modal.Content>
          <Modal.Actions></Modal.Actions>
        </Modal>
      ) : (
        <div>
          <Loader active inline="centered" style={{ marginTop: "10%" }} />
        </div>
      )}
    </>
  );
};

export default VaccineExcerpts;
