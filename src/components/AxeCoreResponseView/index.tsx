import React from "react";
import "./AxeCoreResponseView.css";
interface AxeCoreNode {
    Impact?: string;
    Html?: string;
    ["Failure Summary"]?: string;
  }
  
  export interface AxeCoreViolation {
    Id?: string;
    Description?: string;
    Help?: string;
    Nodes: AxeCoreNode[];
  }


  
  interface Props {
    violations: AxeCoreViolation[];
  }
  
  const AxeViolationsView: React.FC<Props> = ({ violations }) => {
    if (!violations || !violations?.length) {
      return (
        <div className="axe-violation-placeholder">
          <h3>No Accessibility Violations Found or Failed to load Accessibility Violations.</h3>
        </div>
      );
    }
  
    return (
      <div className="axe-violations-container">
        <h1>Accessibility Violations (Axe Core)</h1>
        {violations.map((violation, index) => (
          <div key={index} className="axe-violation-card">
            <h4>{violation.Id || "Unknown Violation"}</h4>
            <p><strong>Description:</strong> {violation.Description}</p>
            <p><strong>Help:</strong> {violation.Help}</p>
  
            {violation.Nodes.length > 0 && (
              <div className="axe-node-list">
                <h5>Affected Nodes:</h5>
                {violation.Nodes.map((node, idx) => (
                  <div key={idx} className="axe-node-card">
                    <p><strong>Impact:</strong> {node.Impact}</p>
                    <pre className="axe-node-html">{node.Html}</pre>
                    <p><strong>Failure Summary:</strong> {node["Failure Summary"]}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  export default AxeViolationsView;
  