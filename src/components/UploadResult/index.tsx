import React, { useEffect, useState } from "react";
import "./UploadResult.css";
import { useSelector } from "react-redux";
import { type RootState } from "../../redux/store";

interface ViewResultProps {
  webpageId: string;
}

const UploadResult: React.FC<ViewResultProps> = ({ webpageId }) => {
  const [htmlContent, setHtmlContent] = useState("");
  const [llmResponse, setLlmResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const email = useSelector((state: RootState) => state.app.email);

  useEffect(() => {
    const fetchData = async () => {
      if (!email || !webpageId) return;
      setLoading(true);

      try {
        const baseUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(
          `${baseUrl}/WebpageAnalyse/view-webpage/${webpageId}?email=${encodeURIComponent(email)}`
        );

        if (res.ok) {
          const data = await res.json();
          setHtmlContent(data.htmlContent);
          setLlmResponse(data.llmResponse);
        } else {
          const errorText = await res.text();
          console.error("Error fetching webpage:", errorText);
          throw new Error(errorText);
        }
      } catch (err) {
        setLlmResponse("ERROR fetching content")
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [email, webpageId]);

  if (loading) return <p style={{ padding: "1rem" }}>Loading...</p>;

  return (
    <div className="result-container">
      <div className="html-preview">
        <h3>Rendered HTML</h3>
        <iframe
          title="html-preview"
          srcDoc={htmlContent}
          className="iframe-preview"
        />
      </div>
      <div className="llm-view">
        <h3>Detected Issues</h3>
        <pre className="code-block">{llmResponse}</pre>
      </div>
    </div>
  );
};

export default UploadResult;
