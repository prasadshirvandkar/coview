import translate_text
from elastic.elastic_queries import search_data, search_date_range, more_like_this, partial_queries, search_poi_data, \
    search_data_with_filter, all_pois, all_pois_2, get_filtered_queries

countries = ['India', 'USA', 'Mexico']
languages = ['hi', 'en', 'es']


def search_poi(client, name):
    return search_data(client, ['poi_name'], [name])


def search_poi_id(client, poi_id):
    return search_data(client, ['poi_id'], [poi_id])


def search_hashtags(client, hashtags):
    return search_data(client, ['hashtags'], [hashtags])


def search_replied_to_tweet_id_tweets(client, tweet_id):
    return search_data(client, ['replied_to_tweet_id'], [tweet_id])


def search_based_on_country(client, country):
    return search_data(client, ['country'], [country])


def search_on_date_range(client, from_date, to_date):
    return search_date_range(client, from_date, to_date)


def search_partial_queries(client, query):
    return partial_queries(client, query)


def get_reactions_for_tweet(client, tweet_id):
    response = client.search(
        index="p4_coview",
        body={
            "query": {
                "match": {
                    "replied_to_tweet_id": f"{tweet_id}"
                }
            },
            "aggs": {
                "find_semantic": {
                    "terms": {
                        "field": "sentiment"
                    }
                }
            }
        }
    )
    buckets = response['aggregations']['find_semantic']['buckets']
    reactions = {'positive': 0, 'negative': 0, 'neutral': 0}
    for bucket in buckets:
        reactions[bucket['key']] = bucket['doc_count']
    return [reactions['positive'], reactions['neutral'], reactions['negative']]


def search_more_like_this(client, value):
    translated = translate_text.translate_text(value)
    query = [value, translated['en'], translated['hi'], translated['es']]
    return more_like_this(client, query)


def pois_sentiment(client):
    response = client.search(
        index="p4_coview",
        body={
            "query": {
                "bool": {
                    "must": {
                        "exists": {
                            "field": "poi_id"
                        }
                    }
                }
            },
            "aggs": {
                "find_semantic": {
                    "terms": {
                        "field": "sentiment"
                    }
                },
                "poi_group": {
                    "terms": {
                        "field": "poi_id"
                    }
                }
            }
        }
    )

    overall_semantic = response['aggregations']['find_semantic']['buckets']
    reactions = {'positive': 0, 'negative': 0, 'neutral': 0}
    for bucket in overall_semantic:
        reactions[bucket['key']] = bucket['doc_count']

    results = {'overall_reactions': [reactions['positive'], reactions['neutral'], reactions['negative']]}
    poi_names = []
    poi_reactions = []
    poi_group = response['aggregations']['poi_group']['buckets']
    for poi in poi_group:
        poi_name, responses = get_reactions_for_pois(client, poi['key'])
        poi_names.append(poi_name)
        poi_reactions.append(responses)

    results['labels'] = poi_names
    results['reactions'] = poi_reactions
    return results


def get_all_pois(client):
    return all_pois(client)


def get_reactions_for_pois(client, poi_id):
    response = client.search(
        index="p4_coview",
        body={
            "query": {
                "match": {
                    "poi_id": f"{poi_id}"
                }
            },
            "aggs": {
                "find_semantic": {
                    "terms": {
                        "field": "sentiment"
                    }
                }
            }
        }
    )

    poi_name = response['hits']['hits'][0]['_source']['poi_name']
    buckets = response['aggregations']['find_semantic']['buckets']
    reactions_poi = {'positive': 0, 'negative': 0, 'neutral': 0}
    for poi_bucket in buckets:
        reactions_poi[poi_bucket['key']] = poi_bucket['doc_count']
    return poi_name, [reactions_poi['positive'], reactions_poi['neutral'], reactions_poi['negative']]


def get_pois_agg(client):
    response = client.search(
        index="p4_coview",
        body={
            "query": {
                "bool": {
                    "must": {
                        "exists": {
                            "field": "poi_id"
                        }
                    }
                }
            },
            "aggs": {
                "metadata": {
                    "terms": {
                        "field": "poi_id",
                        "size": "15"
                    }
                }
            }
        }
    )

    buckets = response['aggregations']['metadata']['buckets']
    poi_ids = [bucket['key'] for bucket in buckets]
    pois = all_pois_2(client, poi_ids)
    return pois


def get_tweets_lang_or_country(client, query, field):
    response = client.search(
        index="p4_coview",
        body={
            "query": {
                "match": {
                    "tweet_text": f"{query}"
                }
            },
            "aggs": {
                "metadata": {
                    "terms": {
                        "field": f"{field}"
                    }
                }
            }
        }
    )

    buckets = response['aggregations']['metadata']['buckets']
    resp_l = []
    resp_c = []
    for bucket in buckets:
        if (bucket['key'] in countries) or (bucket['key'] in languages):
            resp_l.append(bucket['key'])
            resp_c.append(bucket['doc_count'])
    return {'labels': resp_l, 'counts': resp_c}


def get_sentiment_country(client, query):
    sentiment_country_wise = []
    for country in countries:
        response = client.search(
            index="p4_coview",
            body={
                "query": {
                    "bool": {
                        "must": [
                            {
                                "match": {
                                    "tweet_text": f"{query}"
                                }
                            },
                            {
                                "match": {
                                    "country": f"{country}"
                                }
                            }
                        ]
                    }
                },
                "aggs": {
                    "metadata": {
                        "terms": {
                            "field": "sentiment"
                        }
                    }
                }
            }
        )

        buckets = response['aggregations']['metadata']['buckets']
        reactions_poi = {'positive': 0, 'negative': 0, 'neutral': 0}
        for poi_bucket in buckets:
            reactions_poi[poi_bucket['key']] = poi_bucket['doc_count']
        sentiment_country_wise.append(
            {country: [reactions_poi['positive'], reactions_poi['neutral'], reactions_poi['negative']]})

    return sentiment_country_wise


def get_vaccine_excerpts(client):
    response = client.search(
        index="p4_coview",
        body={
            "query": {
                "bool": {
                    "filter": {
                        "term": {
                            "sentiment": "positive"
                        }
                    },
                    "should": [
                        {
                            "match": {
                                "tweet_text": "vaccine"
                            }
                        },
                        {
                            "match": {
                                "tweet_text": "hesitancy"
                            }
                        },
                        {
                            "match": {
                                "tweet_text": "clinical"
                            }
                        },
                        {
                            "match": {
                                "tweet_text": "trials"
                            }
                        },
                        {
                            "match": {
                                "hashtags": "vaccine"
                            }
                        }
                    ]
                }
            },
            "aggs": {
                "metadata": {
                    "terms": {
                        "field": "id",
                        "size": "25000"
                    }
                }
            }
        }
    )

    buckets = response['aggregations']['metadata']['buckets']
    tweet_ids = [int(bucket['key']) for bucket in buckets]

    filtered = get_filtered_queries(client, tweet_ids)
    return filtered


def search_filters(client, value, poi_name, country, hashtag, translate, sentiment):
    fields, query = create_query(value, translate)
    searched_results = search_data_with_filter(client, fields, query, poi_name, country, hashtag, sentiment)

    filter_results = []
    poi_tweets = []
    general_tweets = []
    reactions = {'positive': 0, 'negative': 0, 'neutral': 0}
    for res in searched_results:
        reactions[res['sentiment']] += 1
        if 'poi_id' in res:
            poi_tweets.append(res)
        else:
            general_tweets.append(res)

    filter_results.append({'general_tweets': general_tweets})
    filter_results.append({'poi_info': []})
    filter_results.append({'poi_tweets': poi_tweets[:20]})
    filter_results.append([reactions['positive'], reactions['neutral'], reactions['negative']])
    return filter_results


def search_text_with_pois(client, value, translate):
    search_results = []
    poi = search_poi_data(client, ['name', 'name.normalize'], [value, value])
    searched_tweets_all = search_text(client, value, translate)

    if len(poi) > 0:
        poi = poi[0]
        poi_tweets = search_poi_id(client, poi['id'])
        search_results.append({'general_tweets': searched_tweets_all[:100]})
        search_results.append({'poi_info': [poi]})
        search_results.append({'poi_tweets': poi_tweets[:25]})

        reactions = {'positive': 0, 'negative': 0, 'neutral': 0}
        hashtags = {}
        for res in searched_tweets_all:
            reactions[res['sentiment']] += 1
            if 'hashtags' in res:
                for h in res['hashtags']:
                    if h != 'NaN':
                        if h.lower() in hashtags:
                            hashtags[h.lower()] += 1
                        else:
                            hashtags[h.lower()] = 0
        search_results.append([reactions['positive'], reactions['neutral'], reactions['negative']])

        hashtags = dict(sorted(hashtags.items(), key=lambda item: item[1], reverse=True))
        hashtags_l = []
        hashtags_c = []
        count = 0
        for k, v in hashtags.items():
            if count < 10:
                hashtags_l.append(k)
                hashtags_c.append(v)
                count += 1

        search_results.append({'hashtags_label': hashtags_l})
        search_results.append({'hashtags_count': hashtags_c})
    else:
        poi_tweets = []
        general_tweets = []
        reactions = {'positive': 0, 'negative': 0, 'neutral': 0}
        hashtags = {}
        for res in searched_tweets_all:
            reactions[res['sentiment']] += 1
            if 'poi_id' in res:
                poi_tweets.append(res)
            else:
                general_tweets.append(res)

            if 'hashtags' in res:
                for h in res['hashtags']:
                    if h != 'NaN':
                        if h.lower() in hashtags:
                            hashtags[h.lower()] += 1
                        else:
                            hashtags[h.lower()] = 0

        search_results.append({'general_tweets': general_tweets[:100]})
        search_results.append({'poi_info': []})
        search_results.append({'poi_tweets': poi_tweets[:20]})
        search_results.append([reactions['positive'], reactions['neutral'], reactions['negative']])

        hashtags = dict(sorted(hashtags.items(), key=lambda item: item[1], reverse=True))
        hashtags_l = []
        hashtags_c = []
        count = 0
        for k, v in hashtags.items():
            if count < 10:
                hashtags_l.append(k)
                hashtags_c.append(v)
                count += 1

        search_results.append({'hashtags_label': hashtags_l})
        search_results.append({'hashtags_count': hashtags_c})
    return search_results


def search_text(client, value, translate):
    # value = re.sub(r'\W+', '', value)
    fields, query = create_query(value, translate)
    return search_data(client, fields, query)


def create_query(value, translate):
    fields = ['tweet_text']
    query = [value]
    if translate == 'true':
        translated = translate_text.translate_text(value)
        fields.extend(['tweet_text', 'tweet_text', 'tweet_text'])
        query.extend([translated['en'], translated['hi'], translated['es']])

    return fields, query
