import React, { useState } from "react";
import "./Upload.css";
import { useSelector } from "react-redux";
import { type RootState } from "../../redux/store";

const Upload: React.FC = () => {
    const [isFileUpload, setIsFileUpload] = useState<boolean>(false);
    const [htmlFile, setHtmlFile] = useState<File | null>(null);
    const [url, setUrl] = useState("");
    const [designFile, setDesignFile] = useState<File | null>(null);
    const [SpecificationsFile, setSpecificationsFile] = useState<File | null>(null);
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const email = useSelector((state: RootState) => state.app.email);

    const onHtmlFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setHtmlFile(e.target.files[0]);
            setUrl("");
        }
    };

    const onUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
        if (e.target.value) {
            setHtmlFile(null);
        }
    };

    const onDesignFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setDesignFile(e.target.files[0]);
        }
    };

    const onSpecificationsFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSpecificationsFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        const baseUrl = import.meta.env.VITE_API_URL;
        const formData = new FormData();

        if (!email) {
            alert("Email not set. Please log in first.");
            return;
        }
        if (!email || !name.trim()) return alert("Email and name are required.");
        if (!htmlFile && !url.trim()) return alert("Provide HTML file or URL.");
        if (htmlFile && url.trim()) return alert("Only one of HTML file or URL allowed.");

        if (htmlFile) {
            formData.append("htmlFile", htmlFile);
        } else if (url.trim()) {
            formData.append("url", url);
        }

        if (designFile) {
            formData.append("designFile", designFile);
        }

        if (SpecificationsFile) {
            formData.append("specificationFile", SpecificationsFile);
        }

        if (name.trim()) {
            formData.append("name", name.trim());
        }

        try {
            const response = await fetch(`${baseUrl}/WebpageAnalyse/upload?email=${encodeURIComponent(email)}`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                // const id = await response.text();
                alert("Upload successful");
                setHtmlFile(null);
                setUrl("");
                setDesignFile(null);
                setSpecificationsFile(null);
                setName("");
            } else {
                const errorText = await response.text();
                alert(`Upload failed: ${errorText || "Unknown error"}`);
            }
        } catch (error) {
            console.error(error);
            alert("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="upload-container" onSubmit={handleSubmit}>
            <button type="button" className="toggle-upload-btn" onClick={() => setIsFileUpload(prev => !prev)}>
                {isFileUpload ? "Enter URL" : "Upload HTML File"}
            </button>

            {isFileUpload && (
                <label className="upload-label">
                    Upload HTML File:
                    <input type="file" accept=".html" onChange={onHtmlFileChange} disabled={!!url} />
                </label>
            )}

            {!isFileUpload && (
                <label className="upload-label">
                    Enter URL:
                    <input type="url" value={url} onChange={onUrlChange} placeholder="https://example.com" disabled={!!htmlFile} />
                </label>
            )}

            <label className="upload-label">
                Optional: Upload design file:
                <input type="file" onChange={onDesignFileChange} />
            </label>

            <label className="upload-label">
                Optional: Specifications design file:
                <input type="file" onChange={onSpecificationsFileChange} />
            </label>

            <label className="upload-label">
                Optional: Give a name:
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Project Name" />
            </label>

            <button type="submit" disabled={isSubmitting || (!htmlFile && !url)}>
                {isSubmitting ? "Uploading..." : "Submit"}
            </button>
        </form>
    );
};

export default Upload;
