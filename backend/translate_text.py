import requests, uuid, json
from googletrans import Translator

subscription_key = "<Your Microsoft Translator Service Azure Key>"
endpoint = "https://api.cognitive.microsofttranslator.com"

location = "eastus"

path = '/translate'

params = {
    'api-version': '3.0',
    'to': ['en', 'hi', 'es']
}
constructed_url = endpoint + path

headers = {
    'Ocp-Apim-Subscription-Key': subscription_key,
    'Ocp-Apim-Subscription-Region': location,
    'Content-type': 'application/json',
    'X-ClientTraceId': str(uuid.uuid4())
}


def translate_text(text):
    body = [{'text': text}]
    response = requests.post(constructed_url, params=params, headers=headers, json=body).json()
    print('Not working')
    return {r['to']: r['text'] for r in response[0]['translations']}


if __name__ == "__main__":
    print(translate_text('Hello World'))
