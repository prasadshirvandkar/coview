import requests

url = 'https://api.twitter.com/2/tweets/search/recent'
bearer_token = 'Bearer AAAAAAAAAAAAAAAAAAAAAPYqTgEAAAAAhrmTT00VX3U2vafHfVAOg0T9xpQ%3DO3FJWbDa9g8cm0zIcpF3T8Q2BU3UmlTygqteW9Rvxt3c6cB3Fs'


def search_twitter(q):
    params = {
        'query': f'{q} -is:retweet -is:reply lang=en',
        'tweet.fields': 'author_id,id,entities,geo,public_metrics,created_at',
    }

    return requests.get(url=url, params=params, headers={'Authorization': bearer_token}).json()


def get_tweets(query):
    docs = []
    for tweet in search_twitter(query)['data']:
        doc = {
            'tweet_text': tweet['text'],
            'id': tweet['id'],
            'tweet_date': tweet['created_at']
        }

        if 'urls' in tweet['entities']:
            doc['tweet_urls'] = [u['url'] for u in tweet['entities']['urls']]

        if 'hashtags' in tweet['entities']:
            doc['hashtags'] = [u['tag'] for u in tweet['entities']['hashtags']]

        docs.append(doc)
    return docs
