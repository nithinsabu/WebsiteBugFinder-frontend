import React from "react";
import { useParams } from "react-router-dom";
import ListUploads from "../../components/ListUploads";
import UploadResult from "../../components/UploadResult";
import "./ViewResult.css";

const ViewResult: React.FC = () => {
  const { webpageId } = useParams<{ webpageId?: string }>();
  return (
    <div className="viewresult-container">
      <div className="listuploads-section">
        <ListUploads />
      </div>
      <div className="uploadresult-section">
        {webpageId ? (
          <UploadResult webpageId={webpageId} />
        ) : (
          <p className="placeholder-text"><b>Select a URL to view its result. </b></p>
        )}
      </div>
    </div>
  );
};

export default ViewResult;
