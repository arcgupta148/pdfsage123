import openai
import os
import weaviate
from weaviate.connect import ConnectionParams
from dotenv import load_dotenv

load_dotenv()
OPEN_API_KEY = os.getenv("OPEN_API_KEY")
hostpoint="http://weaviate:8080"
client = weaviate.WeaviateClient(
    connection_params=ConnectionParams.from_url(hostpoint,grpc_port=50051),
    skip_init_checks=True
)



def generate_embedding_openai(text):
    try:
        if not OPEN_API_KEY:
            return ValueError("Missing open api key, please add to the env variable")
        
        openai.api_key = OPEN_API_KEY

        response = openai.embeddings.create(
        input= text,
            model ="text-embedding-ada-002"
        )

        return response.data[0].embedding
    except Exception as e:
        return {"error" : str(e)}
    

def store_embedding(filename,text,embedding):
    print("Embedding to be stored are ",embedding)
    try:
        client.connect()
        doc = client.collections.get("Document123")
        uuid=doc.data.insert(
            properties = {"filename": filename,"text":text,},
            vector= embedding
        )
        print("UUID IS ",uuid)
        client.close()
    except Exception as e:
        return {"error" : str(e)}

def print_embeddings():
    print("Entered print embedding fucntion")
    client = weaviate.WeaviateClient(
    connection_params=ConnectionParams.from_url(hostpoint,grpc_port=50051),
    skip_init_checks=True
)
    client.connect()
    collection = client.collections.get("Document123")
    try:
        data_object = collection.query.fetch_object_by_id(
            "",
            include_vector=True
        )
        print(data_object)
    except Exception as e:
        print(f"Error fetching object: {e}")
    client.close()  
