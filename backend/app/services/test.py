import weaviate
from weaviate.connect import ConnectionParams

# ✅ Connect to Weaviate
client = weaviate.WeaviateClient(
    connection_params=ConnectionParams.from_url("http://localhost:8080", grpc_port=0),
    skip_init_checks=True
)
client.connect()
# ✅ Get the collection

collection = client.collections.get("Document")
jeopardy = client.collections.get("Document")

data_object = jeopardy.query.fetch_object_by_id("a7b0136c-013b-4382-8629-fe4879b24ed8")

print(data_object.properties)
# uuid = "88d8525c-44e3-4f9f-abcb-ccd1e0a8e25b"
# document = client.collections.get("PDFDocument").data.get(uuid)
# # ✅ Check if the document exists
# if document:
#     print("✅ Document Found:")
#     print(document)
# else:
#     print("❌ No document found for this UUID")
# print("collection details are ",collection)
# for item in collection.iterator():
#     print("entered for loop")
#     print(item.uuid, item.properties)

# ✅ Close connection
client.close()
