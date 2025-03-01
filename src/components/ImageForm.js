// components/ImageForm.js
import { useState } from "react";
import "../styles/ImageForm.css";

function ImageForm() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);
  const [prevPrompt, setPrevPrompt] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setGeneratedImage(null);
    setError(null);
    setPrevPrompt(prompt);

    try {
      const response = await fetch(process.env.REACT_APP_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-rapidapi-Key": process.env.REACT_APP_RAPIDAPI_KEY,
          "X-rapidapi-Host": process.env.REACT_APP_RAPIDAPI_HOST,
        },
        body: new URLSearchParams({
          num_images: "1",
          text: prompt,
        }),
      });
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      if (!blob) {
        throw new Error("Failed to generate image.");
      }
      setGeneratedImage(imageUrl);
    } catch (error) {
      setError(
        "An error occurred while generating the image. Please try again."
      );
    }

    setLoading(false);
    setPrompt("");
  };

  const downloadImage = (imageUrl, filename) => {
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      })
      .catch((error) => console.error("Error downloading the image:", error));
  };

  return (
    <div className="image-form-container">
      <div className="generated-content">
        {prevPrompt && <div className="prompt-bubble">{prevPrompt}</div>}
        {loading ? (
          <p className="generating-text">Generating...</p>
        ) : (
          generatedImage && (
            <div className="image-display">
              <img
                src={generatedImage}
                alt="Generated AI Art"
                className="generated-image"
                onClick={() => window.open(generatedImage, "_blank")}
              />
              <button
                className="download-button"
                onClick={() =>
                  downloadImage(generatedImage, "generated-image.jpg")
                }
              >
                Download
              </button>
            </div>
          )
        )}
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="image-form">
        <textarea
          className="image-input"
          placeholder="Enter your prompt..."
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
        />
        <button
          className="generate-button"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Image"}
        </button>
      </div>
    </div>
  );
}

export default ImageForm;
