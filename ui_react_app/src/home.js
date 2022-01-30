import React, { useState, createRef } from "react";
import {
  Container,
  Grid,
  Header,
  Sticky,
  Ref,
  Input,
  Form,
  Button,
} from "semantic-ui-react";
import { CenterPanel } from "./components/center_panel";
import LeftPanel from "./components/left_panel";
import { RightPanel } from "./components/right_panel";
import axios from "axios";

export const Home = () => {
  const [searchedValue, setSearchedValue] = useState("");
  const [searchValToSend, setSearchValToSend] = useState("");
  const [translate, setTranslate] = useState("true");

  const [dataLoaded, setIsDataLoaded] = useState(false);
  const [load, setIsLoad] = useState(false);
  const [searchEmpty, setIsSearchEmpty] = useState(false);

  const [news, setNews] = useState([]);
  const [poi_info, setPoiInfo] = useState([]);
  const [poi_tweets, setPoiTweets] = useState([]);
  const [general_tweets, setGeneralTweets] = useState([]);
  const [searchedSuggest, setSearchedSuggests] = useState([]);
  const [reactionsg, setReactionsG] = useState([]);

  const [hashtagsl, setHashtagsL] = useState([]);
  const [hashtagsc, setHashtagsC] = useState([]);
  const [responseData, setResponseData] = useState([]);

  const contextRef = createRef();

  const searchCall = (value) => {
    axios.defaults.headers.post["Content-Type"] =
      "application/x-www-form-urlencoded";
    axios
      .post("http://0.0.0.0:9999/search_text", {
        query: value,
        translate: translate,
      })
      .then((response) => {
        setIsLoad(false);
        setIsSearchEmpty(false);
        setSearchValToSend(value);
        newsCall(value);

        var data = response.data;
        console.log(data);
        var generalTweets = data[0]["general_tweets"];
        setGeneralTweets(generalTweets);

        var poi_i = data[1]["poi_info"];
        console.log(poi_i);
        setPoiInfo(poi_i.length > 0 ? poi_i[0] : []);

        var poi_tweets = data[2]["poi_tweets"];
        setPoiTweets(poi_tweets);

        getDataAxios();

        setReactionsG(data[3]);

        setHashtagsL([data[4]["hashtags_label"]]);
        setHashtagsC([data[5]["hashtags_count"]]);

        setIsDataLoaded(true);

        if (generalTweets.length == 0) {
          makeUpdateTweetCall(value);
        }
      })
      .catch(function (error) {
        console.log(error);
        setTimeout(() => {
          setIsLoad(false);
        }, 2000);
      });
  };

  const makeUpdateTweetCall = (value) =>
    axios
      .get("http://0.0.0.0:9999/update_tweets/" + value)
      .then((response) => {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

  const getDataAxios = () => {
    axios
      .get("http://0.0.0.0:9999/get_all_pois")
      .then((response) => {
        response = response.data;
        setResponseData(response);
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const newsCall = (query) =>
    axios
      .get("http://0.0.0.0:9999/get_top_headlines/" + query)
      .then((response) => {
        setNews(response.data);
      })
      .catch(function (error) {
        console.log(error);
        setTimeout(() => {
          setIsLoad(false);
        }, 2000);
      });

  const searchSuggestCall = (value) =>
    axios
      .get("http://0.0.0.0:9999/get_search_suggestions/" + value)
      .then((response) => {
        setTimeout(() => {
          setSearchedSuggests(response.data);
        }, 600);
      })
      .catch(function (error) {
        console.log(error);
        setTimeout(() => {
          setIsLoad(false);
        }, 2000);
      });

  const searchClick = () => {
    console.log("Search Click");
    var searchValue = document.getElementById("searchbar").value;
    setSearchedValue(searchValue);
    if (
      searchValue === null ||
      searchValue === undefined ||
      searchValue === ""
    ) {
      setIsSearchEmpty(true);
      setTimeout(() => {
        setIsSearchEmpty(false);
        setIsDataLoaded(false);
      }, 2000);
    } else {
      setIsDataLoaded(false);
      setIsLoad(true);
      searchCall(searchValue);
      searchSuggestCall(searchValue);
    }
  };

  const handleInputChange = (e) => {
    var val = e.target.value;
    if (val === null || val === undefined || val === "") {
      setSearchedSuggests([]);
    }
  };

  const handleButtonChange = (e) => {
    var button_value = e.target.value;
    document.getElementById("searchbar").value = button_value;
    setSearchedValue(button_value);

    setIsDataLoaded(false);
    setIsLoad(true);
    searchCall(button_value);
    searchSuggestCall(button_value);
  };

  const loadDataFromChild = () => {
    setIsDataLoaded(false);
    setIsLoad(true);
  };

  const stopDataFromChild = () => {
    setIsDataLoaded(false);
    setIsLoad(false);
    setIsSearchEmpty(true);
  };

  const setTranslateFromChild = (data) => {
    setTranslate(data);
  };

  const fetchDataBasedOnFilters = (data) => {
    var generalTweets = data[0]["general_tweets"];
    setGeneralTweets(generalTweets);

    var poi_i = data[1]["poi_info"];
    console.log(poi_i);
    setPoiInfo(poi_i.length > 0 ? poi_i[0] : []);

    var poi_tweets = data[2]["poi_tweets"];
    setPoiTweets(poi_tweets);

    setIsDataLoaded(true);
    setIsLoad(false);
    setIsSearchEmpty(false);
  };

  return (
    <div>
      <Container fluid>
        <div
          id="navbar"
          class="ui fixed inverted main menu"
          style={{ padding: "2px", backgroundColor: "#005073" }}
        >
          <div class="container">
            <div class="title item" style={{ fontSize: "20px" }}>
              <b>Coview - Twitter Search Engine and Semantic Analysis</b>
            </div>
          </div>
        </div>
        <Header as="h2" inverted textAlign="center" style={{ marginTop: "3%" }}>
          Relaxed 4x8x4
        </Header>
        <Grid relaxed style={{ marginLeft: "6%", marginRight: "5%" }}>
          <Grid.Row>
            <Grid.Column width={4}>
              <Ref innerRef={contextRef}>
                <Sticky context={contextRef}>
                  <LeftPanel
                    searchedValue={searchedValue}
                    fetchData={fetchDataBasedOnFilters}
                    loadData={loadDataFromChild}
                    stopData={stopDataFromChild}
                    translateFromChild={setTranslateFromChild}
                  />
                </Sticky>
              </Ref>
            </Grid.Column>
            <Grid.Column width={8}>
              <Form>
                <Form.Field>
                  <Input
                    id="searchbar"
                    fluid
                    size="big"
                    placeholder="Search..."
                    onChange={handleInputChange}
                    action={{
                      content: "Search",
                      icon: "search",
                      onClick: searchClick,
                    }}
                  />
                </Form.Field>
              </Form>
              {searchedSuggest.length > 0 ? (
                <div style={{ marginTop: "2%" }}>
                  <Grid.Column>
                    <span color="grey">Search Suggestions:</span>
                    <Button.Group>
                      {searchedSuggest.map((name) => (
                        <Button onClick={handleButtonChange} value={name}>
                          {name}
                        </Button>
                      ))}
                    </Button.Group>
                  </Grid.Column>
                </div>
              ) : (
                <div></div>
              )}
              <CenterPanel
                poi_info={poi_info}
                poi_tweets={poi_tweets}
                general_tweets={general_tweets}
                dataLoaded={dataLoaded}
                load={load}
                searchEmpty={searchEmpty}
                searchedValueToSend={searchValToSend}
                reactionsg={reactionsg}
                hashtagsl={hashtagsl}
                hashtagsc={hashtagsc}
                allpois={responseData}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <RightPanel news={news} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

export default Home;
