import { useState } from "react";
import api from "../api";
import ResultView from "../components/ResultView";

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("Software Engineer");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError("Please choose a PDF or DOCX file");
    setError("");
    setResult(null);
    setLoading(true);

    const form = new FormData();
    form.append("file", file);
    form.append("target_role", role);

    try {
      const res = await api.post("/resume/analyze", form);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="card">
        <h2>Analyze your resume</h2>
        <form onSubmit={handleSubmit}>
          <label>Target role</label>
          <input value={role} onChange={(e) => setRole(e.target.value)}
                 placeholder="e.g. Full Stack Developer" />
          <label>Resume (PDF or DOCX, max 5 MB)</label>
          <input type="file" accept=".pdf,.docx"
                 onChange={(e) => setFile(e.target.files[0])} />
          {error && <p className="error">{error}</p>}
          <button className="btn" disabled={loading}>
            {loading ? "Analyzing... (can take 10-20 seconds)" : "Analyze"}
          </button>
        </form>
      </div>

      {loading && <div className="spinner" />}
      {result && <ResultView result={result} />}
    </>
  );
}