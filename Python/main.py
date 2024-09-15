import os
from dotenv import load_dotenv
load_dotenv('../.env')

def get_credentials():
	return {
		"url" : "https://us-south.ml.cloud.ibm.com",
		"apikey" : os.getenv("CLOUD_API_KEY")
	}

model_id = "ibm/granite-13b-chat-v2"
project_id = os.getenv("PROJECT_ID")

parameters = {
    "decoding_method": "greedy",
    "max_new_tokens": 900,
    "repetition_penalty": 1.05
}

from ibm_watsonx_ai.foundation_models import Model

model = Model(
	model_id = model_id,
	params = parameters,
	credentials = get_credentials(),
	project_id = project_id
)

from ibm_watsonx_ai.client import APIClient

wml_credentials = get_credentials()
client = APIClient(credentials=wml_credentials, project_id=project_id)

vector_index_id = "a2fb0562-5ddb-4e31-b702-c4b97c896858"
vector_index_details = client.data_assets.get_details(vector_index_id)
vector_index_properties = vector_index_details["entity"]["vector_index"]

from ibm_watsonx_ai.foundation_models.embeddings.sentence_transformer_embeddings import SentenceTransformerEmbeddings

emb = SentenceTransformerEmbeddings('sentence-transformers/all-MiniLM-L6-v2')

import subprocess
import gzip
import json
import chromadb
import random
import string

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

chroma_collection = hydrate_chromadb()

def proximity_search( question ):
    query_vectors = emb.embed_query(question)
    query_result = chroma_collection.query(
        query_embeddings=query_vectors,
        n_results=vector_index_properties["settings"]["top_k"],
        include=["documents", "metadatas", "distances"]
    )

    documents = list(reversed(query_result["documents"][0]))

    return "\n".join(documents)

prompt_input = """<|system|>
You are Granite Chat, an AI language model developed by IBM. You are a cautious assistant. You carefully follow instructions. You are helpful and harmless and you follow ethical guidelines and promote positive behavior. You are a AI language model designed to function as a specialized Retrieval Augmented Generation (RAG) assistant. When generating responses, prioritize correctness, i.e., ensure that your response is correct given the context and user query, and that it is grounded in the context. Furthermore, make sure that the response is supported by the given document or context. Always make sure that your response is relevant to the question. If an explanation is needed, first provide the explanation or reasoning, and then give the final answer. Avoid repeating information unless asked.
<|user|>
Tell me something about "Циклус слања захтева за читање".
<|assistant|>
The term "Циклус слања захтева за читање" in the provided document appears to be a phrase in a foreign language, likely Serbian. A rough translation of this phrase is "Circuit breaker request for reading." In the context of the document, it seems to be referring to a request for a circuit breaker to read or access certain data. The exact meaning may depend on the broader context of the document, but based on the information provided, it is clear that this term is related to the reading or accessing of data.
"""

question = input("Question: ")
grounding = proximity_search(question)
formattedQuestion = f"""<|user|>
[Document]
{grounding}
[End]
{question}
<|assistant|>
"""
prompt = f"""{prompt_input}{formattedQuestion}"""
generated_response = model.generate_text(prompt=prompt.replace("__grounding__", grounding), guardrails=False)
print(f"AI: {generated_response}")

