from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware
from app.routes.upload import router

app = FastAPI()
app.include_router(router,prefix="/files")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/")
def home():
    return {"message" : "Fast api is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app",host="0.0.0.0",port = 8000)

