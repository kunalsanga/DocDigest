import fitz  # PyMuPDF
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from ..models.summary import SummaryRequest, SummaryResponse
from transformers import BartForConditionalGeneration, BartTokenizer
from docx import Document
import io

router = APIRouter()

# Load model and tokenizer
model_name = "facebook/bart-large-cnn"
tokenizer = BartTokenizer.from_pretrained(model_name)
model = BartForConditionalGeneration.from_pretrained(model_name)

def summarize_text(text: str, length: str) -> str:
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
        
    inputs = tokenizer.batch_encode_plus(
        [text], max_length=1024, return_tensors="pt", truncation=True
    )
    summary_ids = model.generate(
        inputs["input_ids"],
        num_beams=4,
        min_length=min_length,
        max_length=max_length,
        early_stopping=True,
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