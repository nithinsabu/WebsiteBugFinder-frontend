import React from "react";
import './PageSpeedResponseView.css';

interface Distribution {
  min: number;
  max?: number;
  proportion: number;
}

interface MetricModel {
  percentile: number;
  distributions: Distribution[];
  category: string;
}

interface Metrics {
  CUMULATIVE_LAYOUT_SHIFT_SCORE: MetricModel;
  EXPERIMENTAL_TIME_TO_FIRST_BYTE: MetricModel;
  FIRST_CONTENTFUL_PAINT_MS: MetricModel;
  INTERACTION_TO_NEXT_PAINT: MetricModel;
  LARGEST_CONTENTFUL_PAINT_MS: MetricModel;
}

interface LoadingExperience {
  metrics: Metrics;
  overall_category: string;
  labTest: boolean;
}

interface CategoryScore {
  score: number;
}

interface LighthouseCategories {
  performance: CategoryScore;
  seo: CategoryScore;
  ["best-practices"]: CategoryScore;
  accessibility: CategoryScore;
}

interface LighthouseResult {
  categories: LighthouseCategories;
}

export interface PageSpeedResponse {
  loadingExperience: LoadingExperience;
  lighthouseResult: LighthouseResult;
}

interface Props {
  data?: PageSpeedResponse | null;
}

const metricFullName: Record<string, string> = {
  CUMULATIVE_LAYOUT_SHIFT_SCORE: "Cumulative Layout Shift",
  EXPERIMENTAL_TIME_TO_FIRST_BYTE: "Time To First Byte",
  FIRST_CONTENTFUL_PAINT_MS: "First Contentful Paint",
  INTERACTION_TO_NEXT_PAINT: "Interaction To Next Paint",
  LARGEST_CONTENTFUL_PAINT_MS: "Largest Contentful Paint",
};

const getBarClass = (index: number) => {
  switch (index) {
    case 0: return "bar-fast";
    case 1: return "bar-average";
    case 2: return "bar-poor";
    default: return "";
  }
};

const getScoreColor = (score: number) => {
  if (score*100 >= 90) return "score-good";
  if (score*100 >= 50) return "score-improve";
  return "score-poor";
};

const PageSpeedResponseView: React.FC<Props> = ({ data }) => {
  if (!data) return <div className="page-speed-metrics"><h1>Failed to load PageSpeed data</h1></div>;

  const metrics = data.loadingExperience.metrics;
  const categories = data.lighthouseResult.categories;

  const renderMetric = (key: keyof Metrics) => {
    const metric = metrics[key];
    return (
      <div className="metric" key={key}>
        <h2>{metricFullName[key]}</h2>
        <div className="metric-details">
          <span className={`label ${getBarClass(0)}`}>Fast</span>
          <span className={`label ${getBarClass(1)}`}>Average</span>
          <span className={`label ${getBarClass(2)}`}>Poor</span>
          <div className="histogram">
            {metric.distributions.map((d, idx) => (
              <div
                key={idx}
                className={`histogram-bar ${getBarClass(idx)}`}
                style={{ flex: d.proportion }}
                title={`Min: ${d.min}, Max: ${d.max ?? "∞"}, Proportion: ${(d.proportion * 100).toFixed(1)}%`}
              />
            ))}
          </div>
          <div className="percentile">75th percentile: <strong>{metric.percentile}</strong></div>
        </div>
      </div>
    );
  };

  return (
    <div className="page-speed-metrics">
      <h1>PageSpeed Metrics</h1>
      <div><strong>Overall Category:</strong> {data.loadingExperience.overall_category}</div>

      <div className="metrics-section">
        {renderMetric("CUMULATIVE_LAYOUT_SHIFT_SCORE")}
        {renderMetric("EXPERIMENTAL_TIME_TO_FIRST_BYTE")}
        {renderMetric("FIRST_CONTENTFUL_PAINT_MS")}
        {renderMetric("INTERACTION_TO_NEXT_PAINT")}
        {renderMetric("LARGEST_CONTENTFUL_PAINT_MS")}
      </div>

      <div className="categories-section">
  <h2>Lighthouse Scores</h2>
  <div className="score-row">
    {Object.entries(categories).map(([key, { score }]) => (
      <div key={key} className="score-column">
        <div className="score-label">
          {key.charAt(0).toUpperCase() + key.slice(1).replace("-", " ")}: {(score * 100).toFixed(0)}%
        </div>
        <div className="score-bar">
          <div
            className={`score-fill ${getScoreColor(score * 100)}`}
            style={{ width: `${score * 100}%` }}
          />
        </div>
      </div>
    ))}
  </div>
</div>

    </div>
  );
};

export default PageSpeedResponseView;
