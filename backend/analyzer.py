#from indexer import Indexer
import nltk
from textblob import TextBlob
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from googletrans import Translator
import pickle
from nltk.corpus import stopwords
from tqdm import tqdm
# import numpy as np
# # from PIL import Image
#from wordcloud import WordCloud, STOPWORDS
# from IPython.display import display
# from google.cloud import translate_v2 as translate
# import six
# import re


#stop_words = set(stopwords.words('english'))

translator = Translator()
#indexer = Indexer()

# def create_wordcloud(text):
#     mask = np.array(Image.open("cloud.png"))
#     stopwords = set(STOPWORDS)
#     wc = WordCloud(background_color="white",
#                    mask=mask,
#                    max_words=3000,
#                    stopwords=stopwords,
#                    repeat=False)
#     hashtag_str = ""
#     for i in range(len(text)):
#         if i == len(text)-1:
#             hashtag_str += text[i]
#         else:
#             hashtag_str += text[i]+", "
#     # print(hashtag_str)
#     wc.generate(hashtag_str)
#     wc.to_file("wc.png")
#     print("Word Cloud Saved Successfully")
#     path = "wc.png"
#     display(Image.open(path))

if __name__ == "__main__":
    file_path = "data/0_consolidated_tweets_with_id.pickle"  # input file path
    output_file = 'data/0_consolidated_tweets_with_sentiment.pickle'  # output file path
    with open(file_path, 'rb') as file:
        docs = pickle.load(file)
    data_with_sentiment = []
    POI_list = {}
    for doc in tqdm(docs):
        try:
            tweet_lang = doc["tweet_lang"]
            eng_text = translator.translate(
                doc[f"text_{tweet_lang}"], dest="en")
            # print(translator.detect(doc['tweet_text']))
            doc["english_translation"] = eng_text.text
            print(doc["english_translation"])                       #for testing, comment this line after test
            score = SentimentIntensityAnalyzer().polarity_scores(
                doc["english_translation"])
            # print(score)
            neg = score['neg']
            neu = score['neu']
            pos = score['pos']
            comp = score['compound']

            if neg > pos:
                doc["sentiment"] = "negative"

            elif pos > neg:
                doc["sentiment"] = "positive"

            elif pos == neg:
                doc["sentiment"] = "neutral"
            print(doc["sentiment"])                     #for testing, comment this line after test
            data_with_sentiment.append(doc)
            # indexer.create_documents(doc)
            # print(doc)
            # print("")
            # try:
            #     POI_list.append(doc["poi_name"])
            # except:
            #     pass
        except:
            pass

    with open(output_file, 'wb') as handle:
        pickle.dump(data_with_sentiment, handle)

    #     try:
    #         if "NaN" in doc["hashtags"]:
    #             pass
    #         else:
    #             for hash_tag in doc["hashtags"]:
    #                 hashtag_list.append(hash_tag)
    #     except:
    #         pass
    # # create_wordcloud(hashtag_list)
    # print(hashtag_list)
