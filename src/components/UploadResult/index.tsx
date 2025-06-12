import React, { useEffect, useState } from "react";
import "./UploadResult.css";

interface ViewResultProps {
  url: string;
}

const UploadResult: React.FC<ViewResultProps> = ({ url }) => {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [llmResponse, setLlmResponse] = useState<string>("");

  useEffect(() => {
    const sampleHtml = `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 1rem; }
            h1 { color: darkblue; }
            .content { background-color: #f0f0f0; padding: 1rem; border-radius: 5px; }
            img { width: 100px; }
          </style>
        </head>
        <body>
          <h1>Welcome to Sample Page</h1>
          <div class="content">
            <p>This is a paragraph with <strong>bold text</strong>.</p>
            <img src="https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg" />
          </div>
        </body>
      </html>
    `;

    const sampleFlaws = `
1. Missing meta tags for SEO.
2. Image lacks alt attribute.
3. No viewport meta tag for responsive design.
4. Inline styles used instead of separate CSS.
5. Low color contrast in content area.
    `;

    setHtmlContent(sampleHtml);
    setLlmResponse(sampleFlaws);
  }, [url]);

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
