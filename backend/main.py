# This is a sample Python script.

# Press ⌃R to execute it or replace it with your code.
# Press Double ⇧ to search everywhere for classes, files, tool windows, actions, and settings.

from app import app
import pickle
import json
import requests, uuid, json

from microsofttranslator import Translator

'''
def bulk(collected_tweets):
    collected_tweets = json.loads(collected_tweets)
    for doc in collected_tweets[:20000]:
        yield {
            '_index': index_coview,
            "_id": uuid.uuid4(),
            "_source": doc
        }
'''

asda = 'https://webhooks.mongodb-stitch.com/api/client/v2.0/app/covid-19-qppza/service/REST-API/incoming_webhook/global?' \
       'country=US&hide_fields=_id,%20country,%20country_code,%20country_iso2,%20country_iso3,%20loc,%20state,%20uid'

if __name__ == '__main__':

    # Add your subscription key and endpoint
    subscription_key = "a1b409e0240540fd88b155ef673bbe73"
    endpoint = "https://api.cognitive.microsofttranslator.com"

    # Add your location, also known as region. The default is global.
    # This is required if using a Cognitive Services resource.
    location = "eastus"

    path = '/translate'

    params = {
        'api-version': '3.0',
        'from': 'en',
        'to': ['de', 'it']
    }
    constructed_url = endpoint + path

    headers = {
        'Ocp-Apim-Subscription-Key': subscription_key,
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        'X-ClientTraceId': str(uuid.uuid4())
    }

    # You can pass more than one object in body.
    body = [{
        'text': 'Hello World!'
    }]

    request = requests.post(constructed_url, params=params, headers=headers, json=body)
    response = request.json()

    print(json.dumps(response, sort_keys=True, ensure_ascii=False, indent=4, separators=(',', ': ')))
