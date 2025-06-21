import fitz  # PyMuPDF
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from ..models.summary import SummaryRequest, SummaryResponse
from transformers import BartForConditionalGeneration, BartTokenizer
from docx import Document
import io
import torch

router = APIRouter()

# Global variables for model and tokenizer
model = None
tokenizer = None

def load_model():
    """Load model and tokenizer with memory optimizations"""
    global model, tokenizer
    if model is None or tokenizer is None:
        print("Loading model and tokenizer...")
        model_name = "facebook/bart-large-cnn"
        
        # Load tokenizer first
        tokenizer = BartTokenizer.from_pretrained(model_name)
        
        # Load model with optimizations
        model = BartForConditionalGeneration.from_pretrained(
            model_name,
            torch_dtype=torch.float16,  # Use half precision to save memory
            low_cpu_mem_usage=True,
            device_map="auto" if torch.cuda.is_available() else None
        )
        
        # Move to CPU if no GPU available
        if not torch.cuda.is_available():
            model = model.cpu()
        
        print("Model loaded successfully!")

def summarize_text(text: str, length: str) -> str:
    """Summarize text with memory optimizations"""
    global model, tokenizer
    
    # Load model if not loaded
    if model is None or tokenizer is None:
        load_model()
    
    # Determine summary length
    text_length = len(text.split())
    if length == "short":
        min_length = max(10, int(text_length * 0.1))
        max_length = max(20, int(text_length * 0.2))
    elif length == "medium":
        min_length = max(30, int(text_length * 0.2))
        max_length = max(60, int(text_length * 0.4))
    else:  # long
        min_length = max(50, int(text_length * 0.4))
        max_length = max(100, int(text_length * 0.6))
        
    # Process in smaller chunks if text is too long
    max_input_length = 1024
    if len(text.split()) > max_input_length:
        words = text.split()
        chunks = [' '.join(words[i:i+max_input_length]) for i in range(0, len(words), max_input_length)]
        summaries = []
        
        for chunk in chunks:
            inputs = tokenizer.batch_encode_plus(
                [chunk], max_length=max_input_length, return_tensors="pt", truncation=True
            )
            
            with torch.no_grad():  # Disable gradient computation to save memory
                summary_ids = model.generate(
                    inputs["input_ids"],
                    num_beams=2,  # Reduced from 4 to save memory
                    min_length=min_length // len(chunks),
                    max_length=max_length // len(chunks),
                    early_stopping=True,
                    do_sample=False,
                )
            
            summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
            summaries.append(summary)
        
        return ' '.join(summaries)
    else:
        inputs = tokenizer.batch_encode_plus(
            [text], max_length=max_input_length, return_tensors="pt", truncation=True
        )
        
        with torch.no_grad():  # Disable gradient computation to save memory
            summary_ids = model.generate(
                inputs["input_ids"],
                num_beams=2,  # Reduced from 4 to save memory
                min_length=min_length,
                max_length=max_length,
                early_stopping=True,
                do_sample=False,
            )
        
        summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        return summary

@router.post("/summarize/text", response_model=SummaryResponse)
async def summarize_text_route(request: SummaryRequest):
    summary = summarize_text(request.text, request.length)
    return SummaryResponse(summary=summary)

@router.post("/summarize/pdf", response_model=SummaryResponse)
async def summarize_pdf_route(file: UploadFile = File(...), length: str = Form(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="File must be a PDF.")

    try:
        pdf_document = fitz.open(stream=await file.read(), filetype="pdf")
        text = ""
        for page_num in range(len(pdf_document)):
            page = pdf_document.load_page(page_num)
            text += page.get_text()
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF.")

        summary = summarize_text(text, length)
        return SummaryResponse(summary=summary)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@router.post("/summarize/docx", response_model=SummaryResponse)
async def summarize_docx_route(file: UploadFile = File(...), length: str = Form(...)):
    if not file.filename.lower().endswith('.docx'):
        raise HTTPException(status_code=400, detail="File must be a DOCX file.")

    try:
        # Read the uploaded file
        file_content = await file.read()
        doc = Document(io.BytesIO(file_content))
        
        # Extract text from all paragraphs
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from DOCX file.")

        summary = summarize_text(text, length)
        return SummaryResponse(summary=summary)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

# Health check endpoint
@router.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": model is not None} 