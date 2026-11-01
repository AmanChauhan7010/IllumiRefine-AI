from fastapi import FastAPI, UploadFile, File
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from processor import SCIFilter
import cv2
import numpy as np
import uvicorn
import os

app = FastAPI(title="IllumiRefine SCI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the Deep Learning Model
# Note: Ensure the weights folder exists with the .pt file!
sci = SCIFilter(weights_path='weights/difficult.pt')

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "IllumiRefine SCI API is running!",
        "docs_url": "/docs",
        "enhance_url": "/enhance"
    }

@app.post("/enhance")
async def enhance_image(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        return Response(content="Invalid image format", status_code=400)

    # Process with AI directly in memory
    enhanced_img = sci.enhance(img)
    if enhanced_img is None:
        return Response(content="Enhancement failed", status_code=500)
    
    _, encoded_img = cv2.imencode('.png', enhanced_img)
    return Response(content=encoded_img.tobytes(), media_type="image/png")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)