export default function ResultView({ result }) {
  const scoreClass =
    result.score >= 75 ? "good" : result.score >= 50 ? "ok" : "bad";

  return (
    <div className="result">
      <div className="card score-card">
        <div className={`score ${scoreClass}`}>{result.score}</div>
        <div>
          <h3>Overall score</h3>
          <p>{result.summary}</p>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h3>✅ Strengths</h3>
          <ul>{result.strengths?.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>

        <div className="card">
          <h3>📄 Sections found</h3>
          <div className="tags">
            {result.sections_found?.map((s, i) => <span key={i} className="tag found">{s}</span>)}
          </div>
          <h3 style={{ marginTop: 16 }}>⚠️ Missing sections</h3>
          <div className="tags">
            {result.missing_sections?.length
              ? result.missing_sections.map((s, i) => <span key={i} className="tag missing">{s}</span>)
              : <p>None, nice!</p>}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>🔧 Improvements</h3>
        {result.improvements?.map((item, i) => (
          <div key={i} className="improvement">
            <strong>{item.area}</strong>
            <p><em>Issue:</em> {item.issue}</p>
            <p><em>Fix:</em> {item.suggestion}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>🔑 Keywords to add</h3>
        <div className="tags">
          {result.keywords_missing?.map((k, i) => <span key={i} className="tag missing">{k}</span>)}
        </div>
      </div>

      {result.rewrite_examples?.length > 0 && (
        <div className="card">
          <h3>✍️ Rewrite examples</h3>
          {result.rewrite_examples.map((r, i) => (
            <div key={i} className="rewrite">
              <p className="before"><strong>Before:</strong> {r.original}</p>
              <p className="after"><strong>After:</strong> {r.improved}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}