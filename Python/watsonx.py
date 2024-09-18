from watsonx_init import get_model, get_emb, get_chroma_collection, get_vector_index_properties
from fastapi import UploadFile

def proximity_search( question ):
    query_vectors = get_emb().embed_query(question)
    query_result = get_chroma_collection().query(
        query_embeddings=query_vectors,
        n_results=get_vector_index_properties()["settings"]["top_k"],
        include=["documents", "metadatas", "distances"]
    )

    documents = list(reversed(query_result["documents"][0]))

    return "\n".join(documents)

def get_chat_response( chatMessage ):
    prompt_input = """<|system|>
    You are a AI language model designed to function as a specialized Retrieval Augmented Generation (RAG) assistant. When generating responses, prioritize correctness, i.e., ensure that your response is correct given the context and user query, and that it is grounded in the context. Always make sure that your response is relevant to the question. Avoid repeating information unless asked. You serve as law helper. You will always be grounded with files of US Code. Always provide information from given documents. If you are not certain in your answer, respond with "I need more information". You will bring all of information about asked questions, but always look at the documents. Be always gramatically correct.
    <|user|>
    History of user's questions...
    <|assistant|>
    History of assistant's responses...
    """

    question = chatMessage.requestMessage
    grounding = proximity_search(question)
    formattedQuestion = f"""<|user|>
    [Document]
    {grounding}
    [End]
    {question}
    <|assistant|>
    """
    prompt = f"""{prompt_input}{formattedQuestion}"""
    generated_response = get_model().generate_text(prompt=prompt.replace("__grounding__", grounding), guardrails=False)
    print(f"AI: {generated_response}")
    return generated_response

def get_summarization_response( summarizationMessage: str, document: UploadFile ):
    print(document.filename)
    # handle the file...
    return "Summarization message..."

