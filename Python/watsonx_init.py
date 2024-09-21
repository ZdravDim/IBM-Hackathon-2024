import subprocess
import gzip
import json
import chromadb
import random
import string

import os
from dotenv import load_dotenv
load_dotenv('./.env')


def get_credentials():
	return {
		"url" : "https://us-south.ml.cloud.ibm.com",
		"apikey" : os.getenv("CLOUD_API_KEY")
	}

model_id = "ibm/granite-13b-chat-v2"
project_id = os.getenv("PROJECT_ID")

parameters = {
    "decoding_method": "greedy",
    "max_new_tokens": 300,
    "min_new_tokens": 20,
    "repetition_penalty": 1.1
}

from ibm_watsonx_ai.foundation_models import Model

model = None

from ibm_watsonx_ai.client import APIClient

wml_credentials = get_credentials()
client = APIClient(credentials=wml_credentials, project_id=project_id)

vector_index_id = "93cc3441-6288-4710-9d72-9add66850fdc"
vector_index_details = client.data_assets.get_details(vector_index_id)
vector_index_properties = None

from ibm_watsonx_ai.foundation_models.embeddings.sentence_transformer_embeddings import SentenceTransformerEmbeddings

emb = None

def hydrate_chromadb():
    data = client.data_assets.get_content(vector_index_id)
    content = gzip.decompress(data)
    stringified_vectors = str(content, "utf-8")
    vectors = json.loads(stringified_vectors)

    chroma_client = chromadb.Client()

    # make sure collection is empty if it already existed
    collection_name = "my_collection"
    try:
        collection = chroma_client.delete_collection(name=collection_name)
    except:
        print("Collection didn't exist - nothing to do.")
    collection = chroma_client.create_collection(name=collection_name)

    vector_embeddings = []
    vector_documents = []
    vector_metadatas = []
    vector_ids = []

    for vector in vectors:
        vector_embeddings.append(vector["embedding"])
        vector_documents.append(vector["content"])
        metadata = vector["metadata"]
        lines = metadata["loc"]["lines"]
        clean_metadata = {}
        clean_metadata["asset_id"] = metadata["asset_id"]
        clean_metadata["asset_name"] = metadata["asset_name"]
        clean_metadata["url"] = metadata["url"]
        clean_metadata["from"] = lines["from"]
        clean_metadata["to"] = lines["to"]
        vector_metadatas.append(clean_metadata)
        asset_id = vector["metadata"]["asset_id"]
        random_string = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        id = "{}:{}-{}-{}".format(asset_id, lines["from"], lines["to"], random_string)
        vector_ids.append(id)

    collection.add(
        embeddings=vector_embeddings,
        documents=vector_documents,
        metadatas=vector_metadatas,
        ids=vector_ids
    )
    return collection

chroma_collection = None

def watsonx_initialize():
    global model
    global emb
    global chroma_collection
    global vector_index_properties

    emb = SentenceTransformerEmbeddings('sentence-transformers/all-MiniLM-L6-v2')

    model = Model(
        model_id=model_id,
        params=parameters,
        credentials=get_credentials(),
        project_id=project_id
    )

    vector_index_properties = vector_index_details["entity"]["vector_index"]

    chroma_collection = hydrate_chromadb()

def get_emb():
    return emb

def get_model():
    return model

def get_chroma_collection():
    return chroma_collection

def get_vector_index_properties():
    return vector_index_properties