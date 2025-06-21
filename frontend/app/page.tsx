"use client";

import { useState } from "react";
import FileUpload from "../components/FileUpload";
import TextArea from "../components/TextArea";
import SummaryDisplay from "../components/SummaryDisplay";

export default function Home() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState("");
  const [summaryLength, setSummaryLength] = useState("medium");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Get API base URL from environment variable or use localhost for development
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleSummarize = async () => {
    setIsLoading(true);
    setSummary("");
    setProgress(0);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    const formData = new FormData();

    if (file) {
      formData.append("file", file);
      formData.append("length", summaryLength);
      
      try {
        // Determine the correct API endpoint based on file type
        let endpoint = "";
        if (file.name.toLowerCase().endsWith('.pdf')) {
          endpoint = `${API_BASE_URL}/api/summarize/pdf`;
        } else if (file.name.toLowerCase().endsWith('.docx')) {
          endpoint = `${API_BASE_URL}/api/summarize/docx`;
        } else {
          throw new Error("Unsupported file type. Please upload a PDF or DOCX file.");
        }

        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to summarize file");
        }

        const data = await response.json();
        setSummary(data.summary);
        setProgress(100);
      } catch (error) {
        console.error(error);
        alert("Error summarizing file. Please try again.");
      }

    } else if (text.trim()) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/summarize/text`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, length: summaryLength }),
        });

        if (!response.ok) {
          throw new Error("Failed to summarize text");
        }

        const data = await response.json();
        setSummary(data.summary);
        setProgress(100);
      } catch (error) {
        console.error(error);
        alert("Error summarizing text. Please try again.");
      }
    } else {
        alert("Please upload a file or paste some text to summarize.");
    }

    clearInterval(progressInterval);
    setIsLoading(false);
    setProgress(0);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        <h1 className="text-6xl font-bold text-center text-white mb-4 drop-shadow-2xl">
          DocDigest
        </h1>
        <p className="text-center text-white/80 text-lg mb-8 drop-shadow-lg">
          Transform your documents into concise summaries with AI
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
            <FileUpload setFile={setFile} />
            <p className="text-center text-white/70 my-4 font-medium">OR</p>
            <TextArea text={text} setText={setText} />
          </div>
          
          <div className="flex flex-col">
            <div className="mb-6 backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
              <h3 className="font-semibold text-xl text-white mb-4 drop-shadow-lg">Summary Length</h3>
              <div className="flex justify-around bg-white/20 rounded-xl p-2 backdrop-blur-sm">
                {["short", "medium", "long"].map((len) => (
                  <button
                    key={len}
                    onClick={() => setSummaryLength(len)}
                    className={`px-6 py-3 rounded-lg capitalize font-medium transition-all duration-300 ${
                      summaryLength === len
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                        : "text-white/80 hover:text-white hover:bg-white/20 hover:scale-105"
                    }`}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSummarize}
              disabled={isLoading || (!file && !text.trim())}
              className="relative w-full bg-green-500 text-white font-bold py-4 px-6 rounded-xl hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-2xl mb-6 overflow-hidden"
            >
              <span className="relative z-10">
                {isLoading ? `Processing... ${progress}%` : "Summarize"}
              </span>
              {isLoading && (
                <div 
                  className="absolute inset-0 bg-green-600 transition-all duration-300 ease-out"
                  style={{ 
                    width: `${progress}%`,
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    animation: 'loading 0.3s ease-out forwards'
                  }}
                >
                  <div className="h-full bg-green-400"></div>
                </div>
              )}
            </button>

            <SummaryDisplay summary={summary} />
          </div>
        </div>
      </div>
    </main>
  );
}
