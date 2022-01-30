from elasticsearch import Elasticsearch


class ElasticConn:
    def __init__(self):
        self.client = Elasticsearch('http://localhost:9200')

    def get_client(self):
        return self.client

    def get_info(self):
        return self.client.info()
