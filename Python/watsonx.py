from watsonx_init import get_model, get_emb, get_chroma_collection, get_vector_index_properties

def proximity_search( question ):
    query_vectors = get_emb().embed_query(question)
    query_result = get_chroma_collection().query(
        query_embeddings=query_vectors,
        n_results=get_vector_index_properties()["settings"]["top_k"],
        include=["documents", "metadatas", "distances"]
    )

    documents = list(reversed(query_result["documents"][0]))

    return "\n".join(documents)

def get_response( chatMessage ):
    prompt_input = """<|system|>
    You are Granite Chat, an AI language model developed by IBM. You are a cautious assistant. You carefully follow instructions. You are helpful and harmless and you follow ethical guidelines and promote positive behavior. You are a AI language model designed to function as a specialized Retrieval Augmented Generation (RAG) assistant. When generating responses, prioritize correctness, i.e., ensure that your response is correct given the context and user query, and that it is grounded in the context. Furthermore, make sure that the response is supported by the given document or context. Always make sure that your response is relevant to the question. If an explanation is needed, first provide the explanation or reasoning, and then give the final answer. Avoid repeating information unless asked.
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

