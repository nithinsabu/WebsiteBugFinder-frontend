import React from "react";
import "./LLMResponseView.css";
interface Finding {
    Section?: string;
    Issue?: string;
    Details?: string;
    Code?: string;
    Category?: string;
    "Recommended Fix"?: string;
}

interface KeyFinding {
    Issue?: string;
    "Recommended Fix"?: string;
}

interface Discrepancies {
    Summary?: string;
    Findings?: Finding[];
}

interface NonLLMEvaluationReport {
    Summary?: string;
    "Key Findings"?: KeyFinding[];
    "Recommended Fix"?: string;
}

interface LLMResponse {
    "Executive Summary"?: string;
    "Detailed Analysis"?: {
        "Content Discrepancies"?: Discrepancies;
        "Styling Discrepancies"?: Discrepancies;
        "Intentional Flaws And Known Issues"?: Discrepancies;
        "Functional Discrepancies"?: Discrepancies;
    };
    "Non-LLM Evaluations"?: {
        "Accessibility Report"?: NonLLMEvaluationReport;
        "Performance Report"?: NonLLMEvaluationReport;
        "Validation Report"?: NonLLMEvaluationReport;
        "Layout Report"?: NonLLMEvaluationReport;
    };
    "Other Issues"?: Finding[];
}

interface Props {
    llmResponseResult: LLMResponse | null;
    errorFlag: boolean;
}

const LLMResponseView: React.FC<Props> = ({ llmResponseResult, errorFlag }) => {
    if (errorFlag!==false) {
        return (
            <div className="llm-response error">
                Gemini Review failed to load.
            </div>
        );
    }
    // console.log(llmResponseResult);
    const renderFindings = (findings?: Finding[]) => {
        if (!findings?.length) return null;
        return (
            <ul>
                {findings.map((f, idx) => (
                    <li key={idx}>
                        {f.Issue && (
                            <>
                                <strong>Issue:</strong> {f.Issue} <br />
                            </>
                        )}
                        {f.Section && (
                            <>
                                <strong>Section:</strong> {f.Section} <br />
                            </>
                        )}
                        {f.Category && (
                            <>
                                <strong>Category:</strong> {f.Category} <br />
                            </>
                        )}
                        {f.Details && (
                            <>
                                <strong>Details:</strong> {f.Details} <br />
                            </>
                        )}
                        {f.Code && (
                            <>
                                <strong>Code:</strong> <code>{f.Code}</code> <br />
                            </>
                        )}
                        {f["Recommended Fix"] && (
                            <>
                                <strong>Recommended Fix:</strong> {f["Recommended Fix"]}
                            </>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    const renderKeyFindings = (findings?: { Issue?: string; "Recommended Fix"?: string }[]) => {
        if (!findings?.length) return null;
        return (
            <ul>
                {findings.map((f, idx) => (
                    <li key={idx}>
                        {f.Issue && (
                            <>
                                <strong>Issue:</strong> {f.Issue} <br />
                            </>
                        )}
                        {f["Recommended Fix"] && (
                            <>
                                <strong>Recommended Fix:</strong> {f["Recommended Fix"]}
                            </>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    return !llmResponseResult ? (
        <div className="llm-response-placeholder">
            <h3>No Gemini Result Available</h3>
        </div>
    ) : (
        <div className="result-viewer">
            <h1>Gemini Review:</h1>
            {llmResponseResult["Executive Summary"] && (
                <section className="executive-summary">
                    <h2>Executive Summary</h2>
                    <p>{llmResponseResult["Executive Summary"]}</p>
                </section>
            )}

            {llmResponseResult["Detailed Analysis"] && (
                <section className="detailed-analysis">
                    <h2>Detailed Analysis</h2>
                    {Object.entries(llmResponseResult["Detailed Analysis"]).map(([key, value], idx) =>
                        value ? (
                            <div key={idx} className="analysis-section">
                                <h3>{key}</h3>
                                {value.Summary && <p>{value.Summary}</p>}
                                {renderFindings(value.Findings)}
                            </div>
                        ) : null
                    )}
                </section>
            )}

            {llmResponseResult["Non-LLM Evaluations"] && (
                <section className="non-llm-evaluations">
                    <h2>Automated Tool Reports</h2>
                    {Object.entries(llmResponseResult["Non-LLM Evaluations"]).map(([key, value], idx) =>
                        value ? (
                            <div key={idx} className="evaluation-section">
                                <h3>{key}</h3>
                                {value.Summary && <p>{value.Summary}</p>}
                                {renderKeyFindings(value["Key Findings"])}
                                {value["Recommended Fix"] && (
                                    <p>
                                        <strong>Recommended Fix:</strong> {value["Recommended Fix"]}
                                    </p>
                                )}
                            </div>
                        ) : null
                    )}
                </section>
            )}

            {llmResponseResult["Other Issues"]?.length && (
                <section className="other-issues">
                    <h2>Other Issues</h2>
                    {renderFindings(llmResponseResult["Other Issues"])}
                </section>
            )}
        </div>
    );
};

export default LLMResponseView;
export type { LLMResponse };
