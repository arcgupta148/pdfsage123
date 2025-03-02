import pdfplumber
from docx import Document
import json
chunk_size = 514
def extract_text(file_path):
    ext = file_path.split(".")[-1]
    print("file extension is ",ext)

    if ext=="pdf":
        with pdfplumber.open(file_path) as pdf:
            chunk_text = extract_and_chunk_text(file_path)
            return chunk_text
    elif ext=="docx":
        doc = Document(file_path)
        text = "\n".join([para.text for para in doc.paragraphs])
        # Define the chunk size (same as for txt files)
        
        # Create chunks of the text
        chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
        return chunks
    elif ext == "json":
        with open(file_path, "r") as f:
            data = json.load(f)
            text = json.dumps(data,indent=2)
            chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
        return chunks
    elif ext == "txt":
        with open(file_path,"r") as t:
            chunk_of_text = ext_chunk_text(file_path)
            return chunk_of_text
    return None

def ext_chunk_text(file_path, chunk_size=700):
    with open(file_path, "r") as t:
        text = t.read()    
    chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
    return chunks

def extract_and_chunk_text(file_path, chunk_size=700):
    text_chunks = []
    
    if file_path.endswith(".pdf"):
        with pdfplumber.open(file_path) as pdf:
            full_text = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])
            
            # Break the text into chunks of the specified size
            for i in range(0, len(full_text), chunk_size):
                chunk = full_text[i:i + chunk_size]
                text_chunks.append(chunk)
    
    return text_chunks
