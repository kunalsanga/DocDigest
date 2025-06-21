# DocDigest

DocDigest is a full-stack web application that allows users to summarize text from either raw text input or by uploading a PDF file. It uses a transformer-based model to generate summaries of different lengths (short, medium, long).

## Preview
 ![](https://github.com/kunalsanga/DocDigest/blob/main/main.png)

## Features

- **PDF and Text Summarization**: Summarize content from PDF files or pasted text.
- **Variable Summary Length**: Choose between short, medium, or long summaries.
- **Downloadable Summaries**: Download the generated summary as a `.txt` file.
- **Responsive UI**: A clean and modern user interface built with Next.js and TailwindCSS.

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS, TypeScript
- **Backend**: FastAPI, Python
- **NLP Model**: `facebook/bart-large-cnn` from HuggingFace Transformers
- **PDF Parsing**: `PyMuPDF` (fitz)

## Project Structure

```
/
|-- backend/
|   |-- app/
|   |-- requirements.txt
|
|-- frontend/
|   |-- app/
|   |-- components/
|   |-- package.json
|
|-- README.md
```

## Getting Started

### Prerequisites

- Python 3.8+ and `pip`
- Node.js 18.x+ and `npm` or `yarn`

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/DocDigest.git
    cd DocDigest
    ```

2.  **Set up the backend:**

    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    pip install -r requirements.txt
    ```

3.  **Set up the frontend:**

    ```bash
    cd ../frontend
    npm install
    ```

### Running the Application

1.  **Start the backend server:**

    Open a terminal in the `backend` directory and run:

    ```bash
    uvicorn app.main:app --reload
    ```

    The API will be available at `http://localhost:8000`.

2.  **Start the frontend development server:**

    Open another terminal in the `frontend` directory and run:

    ```bash
    npm run dev
    ```

    The application will be accessible at `http://localhost:3000`.

## Usage

1.  Open your browser and navigate to `http://localhost:3000`.
2.  Either drag and drop a PDF file into the designated area or click to select a file.
3.  Alternatively, paste the text you want to summarize into the text area.
4.  Select the desired summary length (short, medium, or long).
5.  Click the "Summarize" button.
6.  The generated summary will appear on the right side.
7.  Click the "Download Summary" button to save the summary as a text file.

## Deployment

### Frontend (Vercel)

The Next.js frontend can be easily deployed to [Vercel](https://vercel.com). Simply link your Git repository to a new Vercel project.

### Backend (Render)

The FastAPI backend can be deployed to [Render](https://render.com).

1.  Create a new Web Service on Render.
2.  Connect your Git repository.
3.  Set the **runtime** to `Python 3`.
4.  Use the following commands for the build and start steps:
    -   **Build Command**: `pip install -r requirements.txt`
    -   **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

Remember to update the frontend API endpoint to your Render service URL after deployment.
