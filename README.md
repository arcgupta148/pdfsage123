#PDFSage : AI-Powered Document Retrieval System

Document Ingestion & Embedding Generation

Supports PDF, DOCX, JSON, and TXT file formats.
Generates embeddings using OpenAI or Hugging Face models.
Stores and indexes embeddings in Weaviate (Vector Database).
Re-uploading a document with the same name replaces previous embeddings.
✅ Intelligent Querying

RESTful API endpoints allow querying individual documents.
Retrieves the most relevant text snippets based on semantic search.
Returns metadata such as document ID and extracted snippet.
✅ Performance Optimization

Uses document chunking for better retrieval of large files.
Implements precomputed embeddings to reduce query latency.
✅ Frontend & API

React.js frontend for user interaction.
FastAPI backend for handling document processing and retrieval.
RESTful APIs for document upload, update, and retrieval.
✅ Deployment & Scalability

Containerized using Docker for easy deployment.

git clone https://github.com/arcgupta148/pdfsage123.git

For backend :

Naviagte to backend folder and run
docker-compose up
Please provide the image name as per your choice.
For Frontend : 
Run the following commands
docker build -t "Image Name"
docker run -p 3001:3000 "Image Name"
