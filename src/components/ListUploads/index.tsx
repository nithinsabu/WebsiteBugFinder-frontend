import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { type RootState } from "../../redux/store";
import { setWebpages } from "../../redux/appSlice";
import "./ListUploads.css";

const ListUploads: React.FC = () => {
  const dispatch = useDispatch();
  const email = useSelector((state: RootState) => state.app.email);
  const webpages = useSelector((state: RootState) => state.app.webpages);

  useEffect(() => {
    const fetchWebpages = async () => {
      if (!email) return alert("Please login.");
      try {
        const baseUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${baseUrl}/WebpageAnalyse/list-webpages?email=${encodeURIComponent(email)}`);
        if (res.ok) {
          const data = await res.json();
          dispatch(setWebpages(data));
        } else {
          console.error("Failed to fetch webpages");
        }
      } catch (err) {
        console.error("Error fetching webpages:", err);
      }
    };

    fetchWebpages();
  }, [email, dispatch]);

  return (
    <div className="sidebar-only">
      <h2 className="sidebar-title">Uploaded URLs</h2>
      {webpages.length === 0 ? (
        <p className="sidebar-empty">No URLs uploaded.</p>
      ) : (
        <ul className="url-list">
          {webpages.map((page) => (
            <li key={page.id}>
            <Link to={`/view-webpage/${page.id}`} className="url-button full-link">
              <div className="link-title">{page.name || page.fileName || page.url || "Untitled"}</div>
              {page.uploadDate && (
                <div className="upload-date">
                  {new Date(page.uploadDate).toLocaleString()}
                </div>
              )}
            </Link>
          </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListUploads;
