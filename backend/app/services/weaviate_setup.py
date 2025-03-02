import weaviate
from weaviate.connect import ConnectionParams
from weaviate.classes.config import Configure, Property, DataType



hostpoint="http://weaviate:8080"
# ✅ Connect to Weaviate
client = weaviate.WeaviateClient(
    connection_params=ConnectionParams.from_url(hostpoint,grpc_port=50051),
    skip_init_checks=True
)

# ✅ Explicitly connect to Weaviate
client.connect()

# ✅ Define collection schema
collection_name = "Document123"

# ✅ Check if collection already exists
existing_collections = client.collections.list_all()
#existing_collection_names = [collection["name"] for collection in existing_collections]

if collection_name not in existing_collections:
    client.collections.create(
    "Document123",
    vectorizer_config=Configure.Vectorizer.text2vec_openai(),
    properties=[
        Property(name="filename", data_type=DataType.TEXT),
        Property(name="text", data_type=DataType.TEXT),
    ]
    )
    print(f"✅ Weaviate collection '{collection_name}' created successfully!")
else:
    print(f"✅ Weaviate collection '{collection_name}' already exists!")

# ✅ Close connection to prevent memory leaks
client.close()






