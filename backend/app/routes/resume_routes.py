import json
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Analysis, User
from ..auth import get_current_user
from ..parser import extract_text
from ..ai import analyze_resume

router = APIRouter(prefix="/resume", tags=["resume"])
MAX_SIZE = 5 * 1024 * 1024  # 5 MB

@router.post("/analyze")
async def analyze(file: UploadFile = File(...),
                  target_role: str = Form("Software Engineer"),
                  user: User = Depends(get_current_user),
                  db: Session = Depends(get_db)):
    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(413, "File too large (max 5 MB)")
    try:
        text = extract_text(file.filename, content)
    except ValueError as e:
        raise HTTPException(400, str(e))
    if len(text.strip()) < 100:
        raise HTTPException(400, "Couldn't read text from this file")

    try:
        result = analyze_resume(text, target_role)
    except Exception as e:
        import traceback
        traceback.print_exc()          # prints the full error in your backend terminal
        raise HTTPException(502, f"AI analysis failed: {type(e).__name__}: {e}")

    row = Analysis(user_id=user.id, filename=file.filename,
                   result_json=json.dumps(result))
    db.add(row); db.commit()
    return {"id": row.id, **result}

@router.get("/history")
def history(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = (db.query(Analysis).filter(Analysis.user_id == user.id)
            .order_by(Analysis.created_at.desc()).all())
    return [{"id": r.id, "filename": r.filename, "created_at": r.created_at,
             "result": json.loads(r.result_json)} for r in rows]