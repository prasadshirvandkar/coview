import requests

url = 'https://gnews.io/api/v4/top-headlines?&token=<Your API Key From GNews API>'


def get_top_headlines(country, lang, query):
    params = {
        'q': query,
        'country': country,
        'language': lang,
        'topic': 'health'
    }
    return requests.get(url=url, params=params).json()


def get_top_headlines_from_all(query):
    countries = ['in', 'mx', 'us']
    language = [['hi', 'en'], 'es', 'en']
    news = []
    for i in range(len(countries)):
        try:
            headlines = get_top_headlines(countries[i], language[i], query)
            if len(headlines['articles']) > 0:
                news.extend(headlines['articles'][:4])
        except:
            print("Too many requests !!!")
    return news


if __name__ == "__main__":
    # print(get_top_headlines_from_all('narendra'))
    params = {'q': "covid"}
    articles = requests.get(url='https://gnews.io/api/v4/search?token=<Your API Key From GNews API>', params=params).json()
    print(articles)
    # print(articles['articles'])
