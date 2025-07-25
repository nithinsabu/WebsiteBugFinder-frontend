import React from "react";
import './ResponsivenessMetricsList.css'
export interface ResponsivenessMetrics {
  Viewport?: string;
  Overflow?: boolean;
  ImagesOversize?: boolean;
}

interface ResponsivenessMetricsListProps {
  data: ResponsivenessMetrics[];
  errorFlag: boolean;
}

const ResponsivenessMetricsList: React.FC<ResponsivenessMetricsListProps> = ({ data, errorFlag }) => {
  // console.log(errorFlag)
  if (errorFlag!==false){
    return <div className="responsiveness-metrics error">Responsiveness Results failed to load.</div>;

  }
  return (
    <div className="responsiveness-metrics">
      <h2>Responsiveness Metrics</h2>
      <table className="metrics-table">
        <thead>
          <tr>
            <th>Viewport</th>
            <th>Overflow</th>
            {/* <th>Images Oversize</th> */}
          </tr>
        </thead>
        <tbody>
          {data.map((metric, index) => (
            <tr key={index}>
              <td>{metric.Viewport ?? "-"}</td>
              <td>{metric.Overflow ? "Yes" : "No"}</td>
              {/* <td>{metric.ImagesOversize ? "Yes" : "No"}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResponsivenessMetricsList;
