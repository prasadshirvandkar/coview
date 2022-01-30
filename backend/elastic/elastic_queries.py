import json

index_coview = 'p4_coview'
index_pois = 'p4_coview_poi'
index_search_suggestions = 'p4_coview_search_suggest'


def create_matchers_query(fields, values):
    assert len(fields) == len(values)
    return [{'match': {fields[i]: values[i]}} for i in range(len(fields))]


def create_fuzzy_matchers_query(fields, values):
    assert len(fields) == len(values)
    return [{'match': {fields[i]: {'query': values[i], 'fuzziness': 'AUTO'}}} for i in range(len(fields))]


def search_poi_data(client, fields, queries):
    query = {
        "bool": {
            "should": create_matchers_query(fields, queries),
        }
    }

    return process_search_results_for_poi(client, query)


def search_suggestions(client, query):
    query = {
        "match": {
            "key": query
        }
    }

    return process_search_results_search_suggestions(client, query)


def get_all_data(client):
    query = {
        "bool": {
            "must": {
                "exists": {
                    "field": "tweet_text"
                }
            }
        }
    }

    return process_search_results_coview(client, query)


def search_data(client, fields, queries):
    query = {
        "bool": {
            "should": create_fuzzy_matchers_query(fields, queries),
        }
    }

    return process_search_results_coview(client, query)


def search_data_with_filter(client, fields, queries, poi, country, hashtag, sentiment):
    filter_queries = []
    if len(poi) > 0:
        filter_queries.append({"terms": {"poi_id": poi}})
    if len(country) > 0:
        filter_queries.append({"terms": {"country": country}})
    if len(hashtag) > 0:
        filter_queries.append({"terms": {"hashtags": hashtag}})
    if len(sentiment) > 0:
        filter_queries.append({"terms": {"sentiment": sentiment}})

    query = {
        "bool": {
            "should": create_matchers_query(fields, queries),
            "filter": {
                "bool": {
                    "must": filter_queries
                }
            }
        }
    }

    print(query)

    return process_search_results_coview(client, query)


def get_filtered_queries(client, values):
    query = {
        "bool": {
            "filter": [
                {
                    "terms": {
                        "replied_to_tweet_id": values
                    }
                },
                {
                    "terms": {
                        "sentiment": ["negative", "positive"]
                    }
                }
            ]
        }
    }

    resp = client.search(index=index_coview, query=query, scroll='1m')
    scroll_id = resp['_scroll_id']
    results = resp['hits']['hits']

    search_results = []
    while len(results):
        search_results.extend([res['_source'] for res in results])
        result = client.scroll(scroll_id=scroll_id, scroll='2m')
        if scroll_id != result['_scroll_id']:
            print(f"New Scroll Id: {result['_scroll_id']}")
        scroll_id = result['_scroll_id']
        results = result['hits']['hits']
    return search_results


def search_date_range(client, from_date, to_date):
    to_date = 'now' if not to_date else to_date
    query = {
        "range": {
            "tweet_date": {
                "gte": from_date,  # "2020-05-05T00:00:00",
                "lte": to_date  # "2021-09-18T17:00:00"
            }
        }
    }

    return process_search_results_coview(client, query)


def more_like_this(client, text):
    query = {
        "more_like_this": {
            "fields": ["tweet_text", "text_en", "text_hi", "text_es"],
            "like": text,
            "min_term_freq": 1,
            "max_query_terms": 60
        }
    }

    return process_search_results_coview(client, query)


def all_pois(client):
    query = {
        "match": {
            "verified": "true"
        }
    }

    resp = client.search(index=index_coview, query=query, scroll='1m')
    scroll_id = resp['_scroll_id']
    results = resp['hits']['hits']

    search_results = []
    while len(results):
        search_results.extend([res['_source'] for res in results])
        result = client.scroll(scroll_id=scroll_id, scroll='2m')
        if scroll_id != result['_scroll_id']:
            print(f"New Scroll Id: {result['_scroll_id']}")
        scroll_id = result['_scroll_id']
        results = result['hits']['hits']
    return search_results


def all_pois_2(client, value):
    query = {
        "bool": {
            "filter": {
                "terms": {
                    "poi_id": ["82119937", "132225222", "3171712086", "18839785", "813286", "3437532637", "151968088",
                               "146569971", "216776631", "237372254", "1342520820", "86124722", "39860797", "939091",
                               "44783853"]
                }
            }
        }
    }

    resp = client.search(index=index_coview, query=query, scroll='1m')
    scroll_id = resp['_scroll_id']
    results = resp['hits']['hits']

    search_results = []
    while len(results):
        search_results.extend([res['_source'] for res in results])
        result = client.scroll(scroll_id=scroll_id, scroll='2m')
        if scroll_id != result['_scroll_id']:
            print(f"New Scroll Id: {result['_scroll_id']}")
        scroll_id = result['_scroll_id']
        results = result['hits']['hits']
    return search_results


def partial_queries(client, query):
    query = {
        "wildcard": {
            "tweet_text": {
                "value": f"*{query}*",
                "boost": 1.0,
                "rewrite": "constant_score"
            }
        }
    }

    return process_search_results_coview(client, query)


def process_search_results_coview(client, query):
    return process_search_results(client, index_coview, query)


def process_search_results_search_suggestions(client, query):
    return process_search_results(client, index_search_suggestions, query)


def process_search_results_for_poi(client, query):
    return process_search_results(client, index_pois, query)


def process_search_results(client, index_name, query):
    resp = client.search(index=index_name, query=query, scroll='1m')
    scroll_id = resp['_scroll_id']
    results = resp['hits']['hits']

    search_results = []
    while len(results):
        search_results.extend([res['_source'] for res in results])
        if len(search_results) > 2000:
            break
        result = client.scroll(scroll_id=scroll_id, scroll='2m')
        if scroll_id != result['_scroll_id']:
            print(f"New Scroll Id: {result['_scroll_id']}")
        scroll_id = result['_scroll_id']
        results = result['hits']['hits']

    return search_results
