import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./DesignAndSpecificationsPreview.css";
import { type RootState } from "../../redux/store";

type Props = {
    webpageId: string;
};

const DesignAndSpecificationsPreview: React.FC<Props> = ({ webpageId }) => {
    const email = useSelector((state: RootState) => state.app.email);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string>("");
    const [specError, setSpecError] = useState<string>("");
    const [specContent, setSpecContent] = useState<string | null>(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showSpecModal, setShowSpecModal] = useState(false);

    const baseUrl = import.meta.env.VITE_API_URL;

    const previewDesignFile = async () => {
        try {
            const url = `${baseUrl}/WebpageAnalyse/download-designfile/${webpageId}?email=${encodeURIComponent(email)}`;
            const response = await fetch(url);

            if (!response.ok) {
                const errorText = await response.text();
                setImageError(errorText);
                return;
            }

            setImageUrl(url); // Direct URL
            setImageError("");
            setShowImageModal(true);
        } catch (e: unknown) {
            setImageError(`Error: ${(e as Error)?.message ?? String(e)}`);
        }
    };
    const previewSpecifications = async () => {
        try {
            const response = await fetch(`${baseUrl}/WebpageAnalyse/download-specifications/${webpageId}?email=${encodeURIComponent(email)}`);

            if (!response.ok) {
                const errorText = await response.text();
                setSpecError(errorText); // assuming you use setSpecError just like setImageError
                return;
            }

            const { content } = await response.json();
            setSpecContent(content);
            setSpecError("");
            setShowSpecModal(true);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : String(e);
            setSpecError(`Error: ${message}`);
        }
    };

    return (
        <div className="previewer-container">
            <button className="preview-btn" onClick={previewDesignFile}>
                Preview Design File
            </button>
            <button className="preview-btn" onClick={previewSpecifications}>
                Preview Specifications
            </button>

            {/* Design File Modal */}
            {showImageModal && imageUrl && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Design File</h3>
                        <img src={imageUrl} alt="Design File Preview" className="preview-image" />
                        <button className="close-btn" onClick={() => setShowImageModal(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Design File Error */}
            {imageError && (
                <div className="error-message">
                    <strong>Error:</strong> {imageError}
                </div>
            )}

            {/* Specifications Modal */}
            {showSpecModal && specContent && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Specifications</h3>
                        <div className="spec-text">{specContent}</div>
                        <button className="close-btn" onClick={() => setShowSpecModal(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Specifications Error */}
            {specError && (
                <div className="error-message">
                    <strong>Error:</strong> {specError}
                </div>
            )}
        </div>
    );
};
export default DesignAndSpecificationsPreview;
