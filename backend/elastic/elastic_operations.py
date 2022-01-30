import pickle
from elasticsearch import helpers
import uuid
import json
import random

index_coview = 'p4_coview'
index_pois = 'p4_coview_poi'
index_search_suggestions = 'p4_coview_search_suggest'

semantic = ['positive', 'neutral', 'negative']


def add_docs_in_bulk(client):
    with open('../data/antivaccine_5.pkl', 'rb') as handle:
        collected_tweets = pickle.load(handle)
    to_add = []
    for doc in collected_tweets[:500]:
        to_add.append({'_index': index_coview, "_id": doc['id'], "_source": doc})
    return helpers.bulk(client, to_add)


def add_docs_in_bulk_m(client):
    for i in range(0, 4):
        with open(f"data/{i}_consolidated_tweets_with_sentiment.pickle", 'rb') as handle:
            collected_tweets = pickle.load(handle)
        to_add = []
        for doc in collected_tweets:
            to_add.append({'_index': index_coview, "_id": doc['id'], "_source": doc})
        helpers.bulk(client, to_add)


def add_docs_in_bulk_tweets(client, docs):
    to_add = []
    for doc in docs:
        to_add.append({'_index': index_coview, "_id": doc['id'], "_source": doc})
    return helpers.bulk(client, to_add)


def convert_pickle_to_json():
    with open('data/consolidated_tweets_with_id.pickle', 'rb') as handle:
        collected_tweets = pickle.load(handle)
    with open('../data.json', 'w') as outfile:
        json.dump(collected_tweets, outfile)


def json_to_bulk_add(client):
    json_v = json.load(open('../data.json'))
    to_add = []
    for doc in json_v:
        doc['sentiment'] = random.choice(semantic)
        to_add.append({'_index': index_coview, "_id": doc['id'], "_source": doc})

    return helpers.bulk(client, to_add)


def add_pois(client):
    pois = json.load(open('../data/pois.json'))
    [client.index(index=index_pois, id=uuid.uuid4(), document=poi) for poi in pois]


def create_index(client):
    client.indices.delete(index=index_coview, ignore=[400, 404])
    return client.indices.create(index=index_coview, body=json.load(open('../data/mapping.json')))


def create_index_poi(client):
    # client.indices.delete(index=index_coview, ignore=[400, 404])
    return client.indices.create(index=index_pois, body=json.load(open('../data/mapping_poi.json')))


def create_index_search_suggestions(client):
    # client.indices.delete(index=index_pois, ignore=[400, 404])
    return client.indices.create(index=index_search_suggestions,
                                 body=json.load(open('../data/mapping_search_suggestions.json')))


def add_doc(client, doc):
    return client.get_client().index(index=index_coview, id=uuid.uuid4(), document=doc)


if __name__ == "__main__":
    print(json_to_bulk_add(None))
