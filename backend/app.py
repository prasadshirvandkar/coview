import json
import random

from flask import Flask, request, jsonify
from flask_cors import CORS

from elastic import elastic_operations as elastic_op
import queries as query
from elastic.elastic_conn import ElasticConn
import twitter
import news

app = Flask(__name__)
CORS(app, resources=r'*', headers='Content-Type')


def add_search_suggestions():
    search_suggestions = json.load(open('data/search_suggestions.json'))
    search_suggest = {}
    for ss in search_suggestions:
        val = ss['key']
        for v in val:
            search_suggest[v] = val

    return search_suggest


class App:
    def __init__(self):
        self.elastic_client = ElasticConn().get_client()
        self.search_suggestions = add_search_suggestions()


@app.route("/test", methods=['GET'])
def test():
    return app_n.elastic_client.indices


@app.route("/create_index", methods=['GET'])
def create_index():
    return elastic_op.create_index(app_n.elastic_client)


@app.route("/add_doc", methods=['POST'])
def add_document():
    doc = request.json['document']
    return elastic_op.add_doc(app_n.elastic_client, doc)


@app.route("/search_poi/<poi_name>", methods=['GET'])
def search_by_poi(poi_name):
    return jsonify(query.search_poi(app_n.elastic_client, poi_name))


@app.route("/search_poi_id/<poi_id>", methods=['GET'])
def search_by_poi_id(poi_id):
    return jsonify(query.search_poi_id(app_n.elastic_client, poi_id))


@app.route("/get_all_pois", methods=['GET'])
def get_all_pois():
    return jsonify(query.get_pois_agg(app_n.elastic_client))


@app.route("/search_hashtags/<hashtag>", methods=['GET'])
def search_by_hashtag(hashtag):
    return jsonify(query.search_hashtags(app_n.elastic_client, hashtag))


@app.route("/search_text", methods=['POST'])
def search_by_text():
    translate = request.json['translate']
    text = request.json['query']
    searched_text = query.search_text_with_pois(
        app_n.elastic_client, text, translate)
    return jsonify(searched_text)


@app.route("/update_tweets/<q>", methods=['GET'])
def update_data_from_twitter(q):
    tweets = twitter.get_tweets(q)
    if len(tweets) > 0:
        elastic_op.add_docs_in_bulk_tweets(app_n.elastic_client, tweets)
    return jsonify('Success')


@app.route("/search_replies/<tweet_id>", methods=['GET'])
def search_by_replies(tweet_id):
    return jsonify(query.search_replied_to_tweet_id_tweets(app_n.elastic_client, tweet_id))


@app.route("/search_tweets_country/<country>", methods=['GET'])
def search_tweets_country(country):
    return jsonify(query.search_based_on_country(app_n.elastic_client, country))


@app.route("/search_by_date/<date>", methods=['GET'])
def search_by_date(date):
    split_date = date.split(';')
    return jsonify(query.search_date_range(app_n.elastic_client, split_date[0], split_date[0]))


@app.route("/get_top_headlines/<text>", methods=['GET'])
def get_top_headlines(text):
    return jsonify(news.get_top_headlines_from_all(text))


@app.route("/get_search_suggestions/<q>", methods=['GET'])
def get_search_suggestions(q):
    search_suggestions = []
    if q in app_n.search_suggestions:
        search_suggestions = random.sample(app_n.search_suggestions[q], 4)
    return jsonify(search_suggestions)


@app.route("/more_like_this/<q>", methods=['GET'])
def get_more_like_this(q):
    return jsonify(query.search_more_like_this(app_n.elastic_client, q))


@app.route("/get_reactions_for_tweet/<tweet_id>", methods=['GET'])
def get_reactions_for_tweet(tweet_id):
    reply_count = random.randint(10, 40)
    pos = random.randint(1, reply_count)
    reply_count -= pos
    neg = random.randint(1, reply_count)
    reply_count -= neg
    ntr = reply_count
    return jsonify([reply_count, pos, ntr, neg]) # query.get_reactions_for_tweet(app_n.elastic_client, tweet_id))


@app.route("/filter_tweets", methods=['POST'])
def search_by_filter():
    hashtag = request.json['hashtag']
    poi = request.json['poi_name']
    q = request.json['query']
    country = request.json['country']
    translate = request.json['translate']
    semantic = request.json['sentiment']

    return jsonify(query.search_filters(app_n.elastic_client, q, poi, country, hashtag, translate, semantic))


@app.route("/pois_sentiment", methods=['GET'])
def get_pois_sentiment():
    return jsonify(query.pois_sentiment(app_n.elastic_client))


@app.route("/get_tweets_count", methods=['POST'])
def get_tweets_count():
    field = request.json['field']
    text = request.json['query']
    tweet_counts = query.get_tweets_lang_or_country(app_n.elastic_client, text, field)
    return jsonify(tweet_counts)


@app.route("/get_sentiment_count/<q>", methods=['GET'])
def get_sentiment_count(q):
    sentiments = query.get_sentiment_country(app_n.elastic_client, q)
    return jsonify(sentiments)


@app.route("/get_vaccine_excerpts", methods=['GET'])
def get_vaccine_excerpts():
    return jsonify(query.get_vaccine_excerpts(app_n.elastic_client))


if __name__ == "__main__":
    app_n = App()
    app.run(host='0.0.0.0', port=9999)

    # query.get_vaccine_excerpts(app_n.elastic_client)
    # elastic_op.add_docs_in_bulk(app_n.elastic_client)

    index_coview = 'p4_coview'
    '''
    semantic = ['positive', 'neutral', 'negative']
    
    json_v = elastic_queries.get_all_data(app_n.elastic_client)

    with open('data.json', 'w') as outfile:
        json.dump(json_v, outfile)
    '''

    # print(query.get_tweets_lang_or_country(app_n.elastic_client, 'covid', 'tweet_lang'))
    # query.get_sentiment_country(app_n.elastic_client, 'covid')
    # elastic_op.create_index(app_n.elastic_client)
    # elastic_op.add_docs_in_bulk_m(app_n.elastic_client)

    # elastic_op.json_to_bulk_add(app_n.elastic_client)

    # print(query.get_all_pois(app_n.elastic_client))
    # query.search_text_with_pois(app_n.elastic_client, 'covid', 'false')
    # print(query.pois_sentiment(app_n.elastic_client))

    # print(query.search_partial_queries(app_n.elastic_client, 'covid')[:1])
    # print(query.search_hashtags(app_n.elastic_client, 'covid'))
    # print(len(query.search_date_range(app_n.elastic_client, '2020-05-05T00:00:00', '2021-09-18T17:00:00')))
    # print(query.search_more_like_this(app_n.elastic_client, 'covid cases'))
    # search_data('hydroxychloroquine')
    # print(add_docs_in_bulk())
