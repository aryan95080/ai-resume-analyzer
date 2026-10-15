import { useEffect, useState } from "react";
import api from "../api";
import ResultView from "../components/ResultView";

export default function History() {
  const [items, setItems] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/resume/history")
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;
  if (!items.length) return <div className="card">No analyses yet.</div>;

  return (
    <>
      <h2>Past analyses</h2>
      {items.map((item) => (
        <div key={item.id} className="card">
          <div className="history-row"
               onClick={() => setOpenId(openId === item.id ? null : item.id)}>
            <div>
              <strong>{item.filename}</strong>
              <small> · {new Date(item.created_at).toLocaleString()}</small>
            </div>
            <span className="score-pill">{item.result.score}/100</span>
          </div>
          {openId === item.id && <ResultView result={item.result} />}
        </div>
      ))}
    </>
  );
}