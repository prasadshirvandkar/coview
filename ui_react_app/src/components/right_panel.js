import React, { useState } from "react";
import { Card, Divider, Icon, Item } from "semantic-ui-react";

export const RightPanel = (props) => {
  const news = props.news;
  return (
    <Card fluid>
      <Card.Content header="Headlines for Today" />
      <Card.Content>
        {news.map((article) => (
          <div key={article["title"]}>
            <Item>
              <Item.Image size="small" src={article["image"]} />

              <Item.Content>
                <Item.Header as="a">
                  <a href={article["url"]} target="_blank">
                    {article.title}
                  </a>
                </Item.Header>
                <Item.Meta>
                  <span className="price">{article["source"]["name"]}</span>
                </Item.Meta>
                <Item.Description>{article["description"]}</Item.Description>
              </Item.Content>
            </Item>
            <Divider />
          </div>
        ))}
      </Card.Content>
      <Card.Content extra>
        <Icon name="user" />
        Something
      </Card.Content>
    </Card>
  );
};
