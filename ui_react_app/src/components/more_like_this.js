import React, { useState } from "react";
import { Image, Card, Modal, Grid, Header, Loader } from "semantic-ui-react";
import twitter from "./images/twitter.png";

export const MoreLikeThis = (props) => {
  const open = props.open;
  const tweet = props.tweet;
  const tweets = props.moreLikeThisTweets;

  return (
    <>
      {tweets.length > 0 ? (
        <Modal open={open} onClose={() => props.openClose(false)}>
          <Modal.Header>More Like This Tweets</Modal.Header>
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
                      <Header
                        as="h5"
                        icon="smile outline"
                        color="green"
                        content="Sentiment"
                      />
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
