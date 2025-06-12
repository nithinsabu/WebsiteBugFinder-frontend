import React from "react";
import { useParams } from "react-router-dom";
import ListUploads from "../ListUploads";
import UploadResult from "../UploadResult";
import "./ViewResult.css";

const ViewResult: React.FC = () => {
  const { url } = useParams<{ url?: string }>();

  return (
    <div className="viewresult-container">
      <div className="listuploads-section">
        <ListUploads />
      </div>
      <div className="uploadresult-section">
        {url ? (
          <UploadResult url={url} />
        ) : (
          <p className="placeholder-text"><b>Select a URL to view its result. </b></p>
        )}
      </div>
    </div>
  );
};

export default ViewResult;
