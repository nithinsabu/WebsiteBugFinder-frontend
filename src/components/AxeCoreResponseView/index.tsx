import React from "react";
import "./AxeCoreResponseView.css";
interface AxeCoreNode {
    Impact?: string;
    Html?: string;
    FailureSummary?: string;
  }
  
  export interface AxeCoreViolation {
    Id?: string;
    Description?: string;
    Help?: string;
    Nodes: AxeCoreNode[];
  }


  
  interface Props {
    violations: AxeCoreViolation[];
    errorFlag: boolean;
  }
  
  const AxeViolationsView: React.FC<Props> = ({ violations, errorFlag }) => {

    if (errorFlag!==false){
      return (
        <div className="axecore-response error">
           Accessibility Violations failed to load.
        </div>
      );
    }
    if (!violations || 
      !violations?.length) {
      return (
        <div className="axe-violation-placeholder">
          <h3>No Accessibility Violations Found.</h3>
        </div>
      );
    }
  
    return (
      <div className="axe-violations-container">
        <h2>Accessibility Violations from Axe Core <strong>({violations.length})</strong></h2>
        {violations.map((violation, index) => (
          <div key={index} className="axe-violation-card">
            <h4>Rule: {violation.Id}</h4>
            <p><strong>Description:</strong> {violation.Description}</p>
            <p><strong>Help:</strong> {violation.Help}</p>
  
            {violation.Nodes.length > 0 && (
              <div className="axe-node-list">
                <h4>Affected Nodes ({violation.Nodes.length}):</h4>
                {violation.Nodes.map((node, idx) => (
                  <div key={idx} className="axe-node-card">
                    <p><strong>Impact:</strong> {node.Impact}</p>
                    <pre className="axe-node-html">{node.Html}</pre>
                    <p><strong>Failure Summary:</strong> {node.FailureSummary}</p>
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
  