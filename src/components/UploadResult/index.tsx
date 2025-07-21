import React, { useEffect, useState } from "react";
import "./UploadResult.css";
import { useSelector } from "react-redux";
import { type RootState } from "../../redux/store";
import LLMResponseView from "../LLMResponseView";
import { type LLMResponse } from "../LLMResponseView";
import AxeViolationsView from "../AxeCoreResponseView";
import { type AxeCoreViolation } from "../AxeCoreResponseView";
import NuValidatorMessagesView from "../NuValidatorResponseView";
import { type NuValidatorMessage } from "../NuValidatorResponseView";
import ResponsivenessMetricsList from "../ResponsivenessMetricsList";
import { type ResponsivenessMetrics } from "../ResponsivenessMetricsList";
import PageSpeedResponseView from "../PageSpeedResponseView";
import { type PageSpeedResponse } from "../PageSpeedResponseView";
interface ViewResultProps {
  webpageId: string;
}

const UploadResult: React.FC<ViewResultProps> = ({ webpageId }) => {
  const [htmlContent, setHtmlContent] = useState("");
  // const [webpageAnalysisResultString, setWebpageAnalysisResultString] = useState("");
  const [llmResponseResult, setLLMResponseResult] = useState<LLMResponse | null>(null);
  const [axeCoreViolations, setAxeCoreViolations] = useState<AxeCoreViolation[]>([]);
  const [nuValidatorMessages, setNuValidatorMessages] = useState<NuValidatorMessage[]>([]);
  const [responsivenessResults, setResponsivenessResults] = useState<ResponsivenessMetrics[]>([]);
  const [pageSpeedResult, setPageSpeedResult] = useState<PageSpeedResponse | null>(null);
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
          // setWebpageAnalysisResultString(JSON.stringify(data.webpageAnalysisResult, null, 2));
          console.log(data.webpageAnalysisResult.webAuditResults)
          setLLMResponseResult(data.webpageAnalysisResult.llmResponse);
          setAxeCoreViolations(data.webpageAnalysisResult.webAuditResults.axeCoreResult);
          setNuValidatorMessages(data.webpageAnalysisResult.webAuditResults.nuValidatorResult);
          setResponsivenessResults(data.webpageAnalysisResult.webAuditResults.responsivenessResult);
          setPageSpeedResult(data.webpageAnalysisResult.webAuditResults.pageSpeedResult);
        } else {
          const errorText = await res.text();
          console.error("Error fetching webpage:", errorText);
          throw new Error(errorText);
        }
      } catch (err) {
        // setWebpageAnalysisResultString("ERROR fetching content")
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
        {/* <h3>Detected Issues</h3> */}
        {/* <pre className="code-block">{webpageAnalysisResultString}</pre> */}
        <AxeViolationsView violations={axeCoreViolations}/>
        <NuValidatorMessagesView messages={nuValidatorMessages}/>
        <ResponsivenessMetricsList data={responsivenessResults}/>
        <PageSpeedResponseView data={pageSpeedResult}/>
        <LLMResponseView llmResponseResult={llmResponseResult}/>
      </div>
    </div>
  );
};

export default UploadResult;
