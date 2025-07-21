import React from "react";
import './ResponsivenessMetricsList.css'
export interface ResponsivenessMetrics {
  Viewport?: string;
  Overflow?: boolean;
  ImagesOversize?: boolean;
}

interface ResponsivenessMetricsListProps {
  data: ResponsivenessMetrics[];
}

const ResponsivenessMetricsList: React.FC<ResponsivenessMetricsListProps> = ({ data }) => {
  console.log(data)
  return (
    <div className="responsiveness-metrics">
      <h1>Responsiveness Metrics</h1>
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
