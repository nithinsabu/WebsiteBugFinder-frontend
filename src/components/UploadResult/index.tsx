import React, { useEffect, useRef, useState } from "react";
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
import html2pdf from "html2pdf.js";
import { type WebpageSummary } from "../../redux/appSlice";
import DesignAndSpecificationsPreview from "../DesignAndSpecificationsPreview";
interface ViewResultProps {
    webpageId: string;
}

interface AnalysisErrorFlags {
    AxeCoreError: boolean;
    NuValidatorError: boolean;
    PageSpeedError: boolean;
    LLMError: boolean;
    ResponsivenessError: boolean;
}

const UploadResult: React.FC<ViewResultProps> = ({ webpageId }) => {
    const [htmlContent, setHtmlContent] = useState("");
    // const [webpageAnalysisResultString, setWebpageAnalysisResultString] = useState("");
    const [llmResponseResult, setLLMResponseResult] = useState<LLMResponse | null>(null);
    const [axeCoreViolations, setAxeCoreViolations] = useState<AxeCoreViolation[]>([]);
    const [nuValidatorMessages, setNuValidatorMessages] = useState<NuValidatorMessage[]>([]);
    const [responsivenessResults, setResponsivenessResults] = useState<ResponsivenessMetrics[]>([]);
    const [pageSpeedResult, setPageSpeedResult] = useState<PageSpeedResponse | null>(null);
    const [analysisErrorFlags, setAnalysisErrorFlags] = useState<AnalysisErrorFlags>({ AxeCoreError: true, NuValidatorError: true, PageSpeedError: true, LLMError: true, ResponsivenessError: true });
    const [loading, setLoading] = useState(true);
    const [webpageDetails, setWebpageDetails] = useState<WebpageSummary | null>(null);
    const reportRef = useRef<HTMLDivElement>(null);
    const email = useSelector((state: RootState) => state.app.email);
    // useEffect(() => {
    //   console.log(analysisErrorFlags)
    // }, [analysisErrorFlags])
    const webpages = useSelector((state: RootState) => state.app.webpages);
    useEffect(() => {
        setWebpageDetails(webpages.find(wp => wp.id === webpageId)!);
        console.log(webpages.find(wp => wp.id === webpageId)!);
    }, [webpageDetails, webpages, webpageId]);
    useEffect(() => {
        const fetchData = async () => {
            if (!email || !webpageId) return;
            setLoading(true);

            try {
                const baseUrl = import.meta.env.VITE_API_URL;
                const res = await fetch(`${baseUrl}/WebpageAnalyse/view-webpage/${webpageId}?email=${encodeURIComponent(email)}`);

                if (res.ok) {
                    const data = await res.json();
                    setHtmlContent(data.htmlContent);
                    // setWebpageAnalysisResultString(JSON.stringify(data.webpageAnalysisResult, null, 2));
                    console.log(data.webpageAnalysisResult);
                    setLLMResponseResult(data.webpageAnalysisResult.llmResponse);
                    setAxeCoreViolations(data.webpageAnalysisResult.webAuditResults.axeCoreResult);
                    setNuValidatorMessages(data.webpageAnalysisResult.webAuditResults.nuValidatorResult);
                    setResponsivenessResults(data.webpageAnalysisResult.webAuditResults.responsivenessResult);
                    setPageSpeedResult(data.webpageAnalysisResult.webAuditResults.pageSpeedResult);
                    setAnalysisErrorFlags({
                        AxeCoreError: data.webpageAnalysisResult.AxeCoreError,
                        NuValidatorError: data.webpageAnalysisResult.NuValidatorError,
                        PageSpeedError: data.webpageAnalysisResult.PageSpeedError,
                        LLMError: data.webpageAnalysisResult.LLMError,
                        ResponsivenessError: data.webpageAnalysisResult.ResponsivenessError,
                    });
                    // console.log({
                    //   AxeCoreError: data.webpageAnalysisResult.AxeCoreError,
                    //   NuValidatorError: data.webpageAnalysisResult.NuValidatorError,
                    //   PageSpeedError: data.webpageAnalysisResult.PageSpeedError,
                    //   LLMError: data.webpageAnalysisResult.LLMError,
                    //   ResponsivenessError: data.webpageAnalysisResult.ResponsivenessError,
                    // })
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

    const handleDownload = () => {
        if (reportRef.current) {
            html2pdf()
                .set({
                    margin: 0.5,
                    filename:  `${webpageId} Report.pdf`,
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
                })
                .from(reportRef.current)
                .save();
        }
    };

    if (loading) return <p style={{ padding: "1rem" }}>Loading...</p>;

    return (
        <div className="result-container">
            <div className="html-preview">
                <h3>Rendered HTML</h3>
                <iframe title="html-preview" srcDoc={htmlContent} className="iframe-preview" />
            </div>
            <DesignAndSpecificationsPreview webpageId={webpageId}/>
            <div className="llm-view" ref={reportRef}>
                {webpageDetails &&<div className="report-info-header">
                    <h2 className="report-title">Webpage Audit Report</h2>
                    <p>
                        <strong>Name:</strong> {webpageDetails.name}
                    </p>
                    <p>
                        <strong>URL/File:</strong> {webpageDetails.fileName ?? webpageDetails.url}
                    </p>
                    <p>
                        <strong>Uploaded On:</strong> {new Date(webpageDetails.uploadDate!).toLocaleString()}
                    </p>
                    <p>
                        <strong>ID:</strong> {webpageDetails.id}
                    </p>
                </div>}
                <LLMResponseView llmResponseResult={llmResponseResult} errorFlag={analysisErrorFlags?.LLMError} />
                <AxeViolationsView violations={axeCoreViolations} errorFlag={analysisErrorFlags?.AxeCoreError} />
                <NuValidatorMessagesView messages={nuValidatorMessages} errorFlag={analysisErrorFlags?.NuValidatorError} />
                <ResponsivenessMetricsList data={responsivenessResults} errorFlag={analysisErrorFlags?.ResponsivenessError} />
                <PageSpeedResponseView data={pageSpeedResult} errorFlag={analysisErrorFlags?.PageSpeedError} />
            </div>
            <button className="download-button" onClick={handleDownload}>
                Download Report
            </button>
        </div>
    );
};

export default UploadResult;
