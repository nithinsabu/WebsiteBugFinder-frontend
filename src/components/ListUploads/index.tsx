import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { type RootState } from "../../redux/store";
import "./ListUploads.css";

const ListUploads: React.FC = () => {
  const urls = useSelector((state: RootState) => state.app.uploadURLs);

  return (
    <div className="sidebar-only">
      <h2 className="sidebar-title">Uploaded URLs</h2>
      {urls.length === 0 ? (
        <p className="sidebar-empty">No URLs uploaded.</p>
      ) : (
        <ul className="url-list">
          {urls.map((url, idx) => (
            <li key={idx}>
              <Link to={`/view-webpage/${encodeURIComponent(url)}`} className="url-button">
                {url}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListUploads;
