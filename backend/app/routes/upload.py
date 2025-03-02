from fastapi import APIRouter, UploadFile, File 
import shutil
import os
import weaviate
from app.services.extract_text import extract_text
from app.services.embedding import generate_embedding_openai
from app.services.embedding import store_embedding
from app.services.embedding import print_embeddings
from weaviate.connect import ConnectionParams
from weaviate.classes.query import MetadataQuery,Filter
import re
router = APIRouter()
hostpoint="http://weaviate:8080"
upload_dir = "uploads"
os.makedirs(upload_dir,exist_ok=True)
@router.post("/upload/")
async def upload_file(file :  UploadFile = File(...)):
    file_path = os.path.join(upload_dir,file.filename)
    try:
        with open(file_path,"wb") as buffer:
            shutil.copyfileobj(file.file,buffer)
        extract_texts = extract_text(file_path)
        #print("Extracted text is ",extract_texts.size())
        for extract_texts in extract_texts:
            embedding_generated = generate_embedding_openai(extract_texts)
            print(f"Embedding generated size: {len(embedding_generated)}")

            #print(embedding_generated)
            store_embedding(file.filename,extract_texts,embedding_generated)
        return {"filename" : file.filename, "path" : file_path}
    except Exception as e :
        return {"error" : str(e)}


@router.post("/query/")
async def query_response(document_id: str , query: str):
    print("Entered the response for query")
    try:
        query_embedding = generate_embedding_openai(query)
        client = weaviate.WeaviateClient(
        connection_params=ConnectionParams.from_url(hostpoint,grpc_port=50051),
        skip_init_checks=True
    )
        client.connect()
        collection = client.collections.get("Document123")
        response =collection.query.near_vector(near_vector=query_embedding,
            filters=Filter.by_property("filename").equal(document_id),
            limit=3,
            return_metadata=MetadataQuery(distance=True),
        )
        print("Reponse for the query is ",response)
        return response
    except Exception as e:
        return {"error" : str(e)}
    
@router.post("/queryjsonstructure/")
async def structured_query_response(document_id:str , query:str):
    print("Entered Structured Query Response ")
    return "" 

def extract_best_snippet(text: str, query: str, window_size=10000):
    
    # Find all occurrences of query words in the document text
    query_words = query.split()  # Split query into words
    matches = []

    for word in query_words:
        for match in re.finditer(rf"\b{re.escape(word)}\b", text, re.IGNORECASE):
            matches.append(match.start())  # Store the match position
    
    if not matches:
        return None  # No relevant match found
    
    # Find the most central match
    best_match_pos = min(matches, key=lambda x: abs(len(text) // 2 - x))
    
    # Extract a snippet of text around the best match
    start = max(0, best_match_pos - window_size // 2)
    end = min(len(text), best_match_pos + window_size // 2)
    
    return text[start:end] + "..."
