from pydantic import BaseModel

class SummaryRequest(BaseModel):
    text: str
    length: str  # "short", "medium", "long"

class SummaryResponse(BaseModel):
    summary: str 