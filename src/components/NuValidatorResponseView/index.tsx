import React from "react";
import "./NuValidatorResponseView.css";

export interface NuValidatorMessage {
    Type: string;
    "Last Line": number;
    "Last Column": number;
    "First Column": number;
    Message: string;
    Extract: string;
    HiliteStart: number;
    HiliteLength: number;
}

interface Props {
    messages: NuValidatorMessage[];
    errorFlag: boolean;
}

const NuValidatorMessagesView: React.FC<Props> = ({ messages, errorFlag }) => {
    if (errorFlag !== false) {
        return <div className="nuvalidator-response error">Validator Results failed to load.</div>;
    }
    if (!messages?.length) {
        return (
            <div className="nu-validator-placeholder">
                <h3>No Validation Errors Found.</h3>
            </div>
        );
    }

    return (
        <div className="nu-validator-container">
            <h2>Validation Errors <strong>({messages.length}):</strong></h2>
            {messages.map((msg, idx) => (
                <div key={idx} className="nu-validator-card">
                    <p>
                        <strong>Type:</strong> {msg.Type}
                    </p>
                    <p>
                        <strong>Message:</strong>
                        {msg.Message}
                    </p>{" "}
                    <pre className="nu-validator-extract">
                        {msg.Extract.substring(0, msg.HiliteStart)}
                        <span className="highlighted-text">{msg.Extract.substring(msg.HiliteStart, msg.HiliteStart + msg.HiliteLength)}</span>
                        {msg.Extract.substring(msg.HiliteStart + msg.HiliteLength)}
                    </pre>
                    <p>
                        <strong>Location:</strong> Line {msg["Last Line"]}, Column {msg["Last Column"]} (First Column: {msg["First Column"]})
                    </p>
                </div>
            ))}
        </div>
    );
};

export default NuValidatorMessagesView;
