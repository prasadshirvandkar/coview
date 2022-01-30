import React, { useState, useEffect } from "react";
import { Card, Checkbox, Dropdown, Header, Button } from "semantic-ui-react";
import axios from "axios";
import VaccineExcerpts from "./vaccine_excerpts";

const countryOptions = [
  { key: "in", value: "India", flag: "in", text: "India" },
  { key: "us", value: "USA", flag: "us", text: "United States" },
  { key: "mx", value: "Mexico", flag: "mx", text: "Mexico" },
];

const poiOptions = [
  { key: "nm", value: "18839785", text: "Narendra Modi" },
  { key: "rh", value: "3171712086", text: "Rahul Gandhi" },
  { key: "mm", value: "432697203", text: "Mansukh Mandaviya" },
  { key: "si", value: "130104041", text: "Smriti Irani" },
  { key: "mh", value: "2596143056", text: "Ministry of Health" },
];

const hashtagOptions = [
  { key: "co", value: "covid", text: "Covid" },
  { key: "va", value: "vaccine", text: "Vaccine" },
  { key: "lk", value: "lockdown", text: "Lockdown" },
  { key: "cl", value: "clinical trial", text: "Clinical Trial" },
  { key: "sd", value: "social distancing", text: "Social Distancing" },
  { key: "qt", value: "quarantine", text: "Quarantine" },
  { key: "vh", value: "vaccine hesitancy", text: "Vaccine Hesitancy" },
  { key: "ms", value: "masks", text: "Masks" },
  { key: "cv", value: "covaxin", text: "Covaxin" },
  { key: "vi", value: "virus", text: "Virus" },
  { key: "sy", value: "symptoms", text: "Symptoms" },
  { key: "st", value: "staysafe", text: "Staysafe" },
  { key: "wh", value: "workfromhome", text: "Workfromhome" },
  { key: "mo", value: "modi", text: "Modi" },
];

const semanticOptions = [
  { key: "po", value: "positive", text: "Positive" },
  { key: "ng", value: "negative", text: "Negative" },
  { key: "nt", value: "neutral", text: "Neutral" },
];

class LeftPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      poiName: "",
      hashtag: "",
      sentiment: "",
      country: "",
      translate: "false",
      tweets_e: [],
      open: false,
    };
  }

  render() {
    const callFilter = () => {
      var that = this;
      this.props.loadData();
      axios.defaults.headers.post["Content-Type"] =
        "application/x-www-form-urlencoded";

      axios
        .post("http://0.0.0.0:9999/filter_tweets", {
          query: this.props.searchedValue,
          poi_name: this.state.poiName,
          country: this.state.country,
          hashtag: this.state.hashtag,
          sentiment: this.state.sentiment,
          translate: this.state.translate,
        })
        .then((response) => {
          var data = response.data;
          console.log(data);
          this.props.fetchData(data);
        })
        .catch(function (error) {
          console.log(error);
          that.props.stopData();
        });
    };

    const onPoiChanged = (e, { value }) => {
      this.setState({ poiName: value }, () => {
        callFilter();
      });
    };

    const onCountryChanged = (e, { value }) => {
      this.setState({ country: value }, () => {
        callFilter();
      });
    };

    const onHashtagChanged = (e, { value }) => {
      this.setState({ hashtag: value }, () => {
        callFilter();
      });
    };

    const onSentimentChanged = (e, { value }) => {
      this.setState({ sentiment: value }, () => {
        callFilter();
      });
    };

    const handleChange = (e, { checked }) => {
      this.setState({ translate: checked.toString() });
      this.props.translateFromChild(checked.toString());
    };

    const openCloseModal = (data) => {
      this.setState({ open: data });
    };

    const onClickVaccineEx = () => {
      this.setState({ open: true });
      axios
        .get("http://192.168.1.168:9999/get_vaccine_excerpts")
        .then((response) => {
          console.log(response.data);
          this.setState({ tweets_e: response.data });
        })
        .catch(function (error) {
          console.log(error);
          setTimeout(() => {}, 2000);
        });
    };

    return (
      <Card>
        <Card.Content header="Search By" />
        <Card.Content>
          <Button fluid primary size="large" onClick={onClickVaccineEx}>
            Search Vaccine Excerpts
          </Button>
          {this.state.open ? (
            <VaccineExcerpts
              open={this.state.open}
              openClose={openCloseModal}
              vaccineexcerptstweets={this.state.tweets_e}
            />
          ) : (
            <></>
          )}
          <Header as="h5">POIs</Header>
          <Dropdown
            clearable
            placeholder="Select POI"
            fluid
            multiple
            closeOnEscape
            search
            selection
            options={poiOptions}
            onChange={onPoiChanged}
          />
          <Header as="h5">Country</Header>
          <Dropdown
            clearable
            placeholder="Select Country"
            fluid
            search
            multiple
            closeOnEscape
            selection
            options={countryOptions}
            onChange={onCountryChanged}
          />
          <Header as="h5">Hashtags</Header>
          <Dropdown
            clearable
            placeholder="Select Hashtags"
            fluid
            search
            selection
            multiple
            options={hashtagOptions}
            onChange={onHashtagChanged}
          />
          <Header as="h5">Semantic</Header>
          <Dropdown
            clearable
            placeholder="Select Sentiment"
            fluid
            search
            selection
            multiple
            options={semanticOptions}
            onChange={onSentimentChanged}
          />
        </Card.Content>
        <Card.Content extra style={{ padding: "8%" }}>
          <div>
            <Checkbox
              center
              toggle
              defaultChecked
              label="Translate Search Query"
              onChange={handleChange}
            />
          </div>
        </Card.Content>
      </Card>
    );
  }
}

export default LeftPanel;
