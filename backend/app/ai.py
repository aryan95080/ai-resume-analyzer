import json
import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

SYSTEM = """You are an expert technical recruiter and resume coach.
Analyze the resume text and respond with ONLY valid JSON, no markdown, in this shape:
{
  "score": <0-100 integer>,
  "summary": "<2-3 sentence overall impression>",
  "strengths": ["..."],
  "sections_found": ["Education", "Projects", ...],
  "missing_sections": ["..."],
  "improvements": [{"area": "...", "issue": "...", "suggestion": "..."}],
  "keywords_missing": ["..."],
  "rewrite_examples": [{"original": "...", "improved": "..."}]
}
Be specific and honest. Only reference things actually in the resume."""

def analyze_resume(text: str, target_role: str = "Software Engineer") -> dict:
    api_key = os.getenv("LLM7_API_KEY")
    if not api_key or api_key == "replace-with-your-llm7-api-key":
        raise RuntimeError("Set LLM7_API_KEY in backend/.env")

    client = OpenAI(
        api_key=api_key,
        base_url=os.getenv("LLM7_BASE_URL", "https://api.llm7.io/v1"),
    )
    response = client.chat.completions.create(
        model=os.getenv("LLM7_MODEL", "default"),
        messages=[
            {"role": "system", "content": SYSTEM},
            {
                "role": "user",
                "content": f"Target role: {target_role}\n\nRESUME:\n{text[:15000]}",
            },
        ],
        max_tokens=2000,
    )
    content = response.choices[0].message.content
    if not content:
        raise ValueError("The AI service returned an empty response")

    raw = content.strip()
    if raw.startswith("```"):
        raw = raw.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    return json.loads(raw)