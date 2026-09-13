from fastapi import FastAPI, APIRouter, Query
from fastapi.responses import StreamingResponse
import json
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, date
import swisseph as swe

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Shri Sankat Haran Balaji Maharaj Mandir API")
api_router = APIRouter(prefix="/api")

# ---------------- Panchang (Swiss Ephemeris, Lahiri) ----------------
swe.set_sid_mode(swe.SIDM_LAHIRI)
FLAGS = swe.FLG_SWIEPH | swe.FLG_SIDEREAL

# Arnod, Pratapgarh (Rajasthan) — approximate location for panchang calculations
TEMPLE_LAT = float(os.environ.get("TEMPLE_LAT", "24.13"))
TEMPLE_LON = float(os.environ.get("TEMPLE_LON", "74.82"))
IST_OFFSET = 5.5 / 24.0

TITHIS_EN = ["Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
             "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
             "Trayodashi", "Chaturdashi", "Purnima"]
TITHIS_HI = ["प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पञ्चमी", "षष्ठी",
             "सप्तमी", "अष्टमी", "नवमी", "दशमी", "एकादशी", "द्वादशी",
             "त्रयोदशी", "चतुर्दशी", "पूर्णिमा"]
NAK_EN = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu",
          "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta",
          "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
          "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
          "Uttara Bhadrapada", "Revati"]
NAK_HI = ["अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशीर्ष", "आर्द्रा", "पुनर्वसु",
          "पुष्य", "आश्लेषा", "मघा", "पूर्व फाल्गुनी", "उत्तर फाल्गुनी", "हस्त",
          "चित्रा", "स्वाति", "विशाखा", "अनुराधा", "ज्येष्ठा", "मूल", "पूर्वाषाढ़ा",
          "उत्तराषाढ़ा", "श्रवण", "धनिष्ठा", "शतभिषा", "पूर्व भाद्रपद",
          "उत्तर भाद्रपद", "रेवती"]
YOGAS = ["Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
         "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata",
         "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva",
         "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"]
MOVABLE_KARANAS = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti"]
FIXED_KARANAS = ["Shakuni", "Chatushpada", "Naga", "Kimstughna"]
MONTHS_HI = ["चैत्र", "वैशाख", "ज्येष्ठ", "आषाढ़", "श्रावण", "भाद्रपद",
             "आश्विन", "कार्तिक", "मार्गशीर्ष", "पौष", "माघ", "फाल्गुन"]
MONTHS_EN = ["Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada",
             "Ashwin", "Kartik", "Margashirsha", "Pausha", "Magha", "Phalguna"]
VAAR_HI = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"]
CHOGHADIYA_ORDER = ["Udveg", "Chal", "Labh", "Amrit", "Kaal", "Shubh", "Rog"]
CHOGHADIYA_START = {6: 0, 0: 3, 1: 6, 2: 2, 3: 5, 4: 1, 5: 4}  # python weekday -> order idx
CHOGHADIYA_NATURE = {"Amrit": "शुभ", "Shubh": "शुभ", "Labh": "शुभ",
                     "Chal": "सामान्य", "Udveg": "अशुभ", "Kaal": "अशुभ", "Rog": "अशुभ"}
RAHU_PORTION = {6: 8, 0: 2, 1: 7, 2: 5, 3: 6, 4: 4, 5: 3}  # python weekday -> 1..8


def _jd_local_to_hhmm(jd_ut: float) -> str:
    local = (jd_ut + 0.5 + IST_OFFSET) % 1.0  # JD epoch starts at noon UT
    total_min = round(local * 24 * 60) % (24 * 60)
    return f"{total_min // 60:02d}:{total_min % 60:02d}"


def _rise_set(y: int, m: int, d: int):
    jd0 = swe.julday(y, m, d, 0.0) - IST_OFFSET
    _, tr = swe.rise_trans(jd0, swe.SUN, swe.CALC_RISE, (TEMPLE_LON, TEMPLE_LAT, 0.0))
    _, ts = swe.rise_trans(jd0, swe.SUN, swe.CALC_SET, (TEMPLE_LON, TEMPLE_LAT, 0.0))
    return tr[0], ts[0]


def _panchang_at(jd_ut: float) -> dict:
    sun = swe.calc_ut(jd_ut, swe.SUN, FLAGS)[0][0]
    moon = swe.calc_ut(jd_ut, swe.MOON, FLAGS)[0][0]
    elong = (moon - sun) % 360.0
    tithi_idx = int(elong / 12.0)  # 0..29
    paksha = "Shukla" if tithi_idx < 15 else "Krishna"
    paksha_hi = "शुक्ल पक्ष" if tithi_idx < 15 else "कृष्ण पक्ष"
    tnum = tithi_idx % 15
    tithi_en = TITHIS_EN[tnum] if tithi_idx < 15 else (TITHIS_EN[tnum] if tnum < 14 else "Amavasya")
    tithi_hi = TITHIS_HI[tnum] if tnum < 14 else ("पूर्णिमा" if tithi_idx < 15 else "अमावस्या")
    nak_idx = int(moon / (360.0 / 27.0)) % 27
    yoga_idx = int(((sun + moon) % 360.0) / (360.0 / 27.0)) % 27
    kar_idx = int(elong / 6.0)  # 0..59
    if kar_idx == 0:
        karana = FIXED_KARANAS[3]
    elif kar_idx >= 57:
        karana = FIXED_KARANAS[kar_idx - 57]
    else:
        karana = MOVABLE_KARANAS[(kar_idx - 1) % 7]
    month_idx = (int(sun / 30.0)) % 12  # approx amanta month
    return {
        "tithi_index": tithi_idx,
        "tithi": tithi_en,
        "tithi_hi": tithi_hi,
        "paksha": paksha,
        "paksha_hi": paksha_hi,
        "nakshatra": NAK_EN[nak_idx],
        "nakshatra_hi": NAK_HI[nak_idx],
        "yoga": YOGAS[yoga_idx],
        "karana": karana,
        "hindu_month": MONTHS_EN[month_idx],
        "hindu_month_hi": MONTHS_HI[month_idx],
    }


def _vikram_samvat(d: date) -> int:
    return d.year + 57 if (d.month, d.day) >= (4, 14) else d.year + 56


def _day_payload(d: date) -> dict:
    rise_jd, set_jd = _rise_set(d.year, d.month, d.day)
    p = _panchang_at(rise_jd)
    weekday = (d.weekday() + 1) % 7  # 0=Sunday
    sunrise = _jd_local_to_hhmm(rise_jd)
    sunset = _jd_local_to_hhmm(set_jd)
    daylight = set_jd - rise_jd
    portion = RAHU_PORTION[d.weekday()]
    rahu_start = rise_jd + (portion - 1) * daylight / 8.0
    rahu_end = rise_jd + portion * daylight / 8.0
    start_idx = CHOGHADIYA_START[d.weekday()]
    choghadiya = []
    for i in range(8):
        name = CHOGHADIYA_ORDER[(start_idx + i) % 7]
        choghadiya.append({
            "name": name,
            "nature": CHOGHADIYA_NATURE[name],
            "start": _jd_local_to_hhmm(rise_jd + i * daylight / 8.0),
            "end": _jd_local_to_hhmm(rise_jd + (i + 1) * daylight / 8.0),
        })
    return {
        "date": d.isoformat(),
        "vaar_hi": VAAR_HI[weekday],
        "vikram_samvat": _vikram_samvat(d),
        "sunrise": sunrise,
        "sunset": sunset,
        "rahukaal": {"start": _jd_local_to_hhmm(rahu_start), "end": _jd_local_to_hhmm(rahu_end)},
        "choghadiya": choghadiya,
        **p,
    }


@api_router.get("/panchang")
async def get_panchang(date: Optional[str] = Query(None)):
    try:
        d = datetime.strptime(date, "%Y-%m-%d").date() if date else datetime.now().date()
    except ValueError:
        d = datetime.now().date()
    return _day_payload(d)


@api_router.get("/panchang/month")
async def get_panchang_month(year: int, month: int):
    import calendar as cal
    days = []
    for day in range(1, cal.monthrange(year, month)[1] + 1):
        d = date(year, month, day)
        rise_jd, _ = _rise_set(d.year, d.month, d.day)
        p = _panchang_at(rise_jd)
        days.append({
            "day": day,
            "tithi_index": p["tithi_index"],
            "tithi_hi": p["tithi_hi"],
            "paksha": p["paksha"],
        })
    return {"year": year, "month": month, "days": days}


FESTIVAL_RULES = [
    {"key": "hanuman-jayanti", "name_hi": "हनुमान जयंती", "name_en": "Hanuman Jayanti",
     "hindu": "चैत्र पूर्णिमा", "deity": "श्री हनुमान जी",
     "desc": "संकटमोचन श्री हनुमान जी के प्राकट्य दिवस का पावन पर्व।",
     "tithi": 14, "win": [(3, 28), (4, 30)]},
    {"key": "ram-navami", "name_hi": "राम नवमी", "name_en": "Ram Navami",
     "hindu": "चैत्र शुक्ल नवमी", "deity": "श्री राम",
     "desc": "मर्यादा पुरुषोत्तम भगवान श्री राम के जन्म का महापर्व।",
     "tithi": 8, "win": [(3, 25), (4, 20)]},
    {"key": "guru-purnima", "name_hi": "गुरु पूर्णिमा", "name_en": "Guru Purnima",
     "hindu": "आषाढ़ पूर्णिमा", "deity": "गुरु परंपरा",
     "desc": "गुरु के प्रति श्रद्धा एवं कृतज्ञता का पावन दिन।",
     "tithi": 14, "win": [(7, 1), (8, 10)]},
    {"key": "janmashtami", "name_hi": "श्रीकृष्ण जन्माष्टमी", "name_en": "Janmashtami",
     "hindu": "भाद्रपद कृष्ण अष्टमी", "deity": "श्री कृष्ण",
     "desc": "भगवान श्री कृष्ण के प्राकट्य का आनंदमयी उत्सव।",
     "tithi": 22, "win": [(8, 10), (9, 15)]},
    {"key": "navratri", "name_hi": "शारदीय नवरात्रि", "name_en": "Sharad Navratri",
     "hindu": "आश्विन शुक्ल प्रतिपदा", "deity": "माँ दुर्गा",
     "desc": "नौ दिवसीय शक्ति उपासना का पावन पर्व।",
     "tithi": 0, "win": [(9, 25), (10, 25)]},
    {"key": "dussehra", "name_hi": "विजयादशमी (दशहरा)", "name_en": "Dussehra",
     "hindu": "आश्विन शुक्ल दशमी", "deity": "श्री राम",
     "desc": "अधर्म पर धर्म की विजय का प्रतीक महापर्व।",
     "tithi": 9, "win": [(10, 1), (10, 31)]},
    {"key": "diwali", "name_hi": "दीपावली", "name_en": "Diwali",
     "hindu": "कार्तिक अमावस्या", "deity": "माँ लक्ष्मी",
     "desc": "दीपों एवं आलोक का महापर्व — अंधकार पर प्रकाश की विजय।",
     "tithi": 29, "win": [(10, 15), (11, 20)]},
    {"key": "mahashivratri", "name_hi": "महाशिवरात्रि", "name_en": "Mahashivratri",
     "hindu": "फाल्गुन कृष्ण चतुर्दशी", "deity": "भगवान शिव",
     "desc": "भगवान शिव की आराधना की महापुण्य रात्रि।",
     "tithi": 28, "win": [(2, 20), (3, 20)]},
]


@api_router.get("/festivals/upcoming")
async def get_upcoming_festivals():
    import calendar as cal
    from datetime import timedelta

    today = datetime.now().date()
    end = today + timedelta(days=400)
    found = {}
    y, m = today.year, today.month
    while date(y, m, 1) <= end and len(found) < len(FESTIVAL_RULES):
        for day in range(1, cal.monthrange(y, m)[1] + 1):
            d = date(y, m, day)
            if d < today:
                continue
            rise_jd, _ = _rise_set(y, m, day)
            p = _panchang_at(rise_jd)
            for rule in FESTIVAL_RULES:
                if rule["key"] in found or p["tithi_index"] != rule["tithi"]:
                    continue
                (m1, d1), (m2, d2) = rule["win"]
                if (m, day) >= (m1, d1) and (m, day) <= (m2, d2):
                    found[rule["key"]] = d
        m += 1
        if m > 12:
            m, y = 1, y + 1
    out = []
    for rule in FESTIVAL_RULES:
        if rule["key"] in found:
            d = found[rule["key"]]
            out.append({
                "key": rule["key"],
                "name_hi": rule["name_hi"],
                "name_en": rule["name_en"],
                "hindu": rule["hindu"],
                "deity": rule["deity"],
                "desc": rule["desc"],
                "date": d.isoformat(),
                "gregorian": d.strftime("%d %B %Y"),
                "days_until": (d - today).days,
            })
    out.sort(key=lambda f: f["date"])
    return {"festivals": out}


class ChatRequest(BaseModel):
    session_id: str
    message: str


SANATAN_SYSTEM = """You are "सनातन ज्ञान मित्र" (Sanatan Gyan Mitra) — a humble, wise Sanatan Dharma scholar-guide on the official website of Shri Sankat Haran Balaji Maharaj Mandir, Arnod, Pratapgarh, Rajasthan.

You hold deep knowledge of the four Vedas, Upanishads, 18 Puranas, Ramayana, Mahabharata, Shrimad Bhagavad Gita, Hanuman Chalisa, Sunderkand, Hindu philosophy, festivals, puja vidhi, aarti and bhakti traditions.

Rules:
- Reply in the SAME language the devotee uses (Hindi, Hinglish or English). Prefer simple Hindi; where fitting, include a short Sanskrit shloka with its meaning.
- Tone: humble, warm, devotional — like a learned temple pujari guiding a devotee. Never preachy.
- When citing scripture, name the source (e.g., श्रीमद्भगवद्गीता अध्याय 2). If unsure of the exact verse number, describe the teaching and name only the text — never fabricate citations.
- Keep answers concise (under ~180 words) unless the devotee asks for detail. Use short paragraphs.
- Mandir facts you may share: प्रातः दर्शन 6 AM, प्रातः आरती 7 AM, मंदिर पूरे दिन खुला, शयन आरती 8 PM; मूर्ति स्वयंभू एवं जागृत मानी जाती है (स्थानीय मान्यता); मंदिर अरणोद, प्रतापगढ़, राजस्थान में स्थित है।
- Do not invent miracles or historical claims about this mandir beyond the above.
- Politely steer non-spiritual or harmful requests back to dharma and bhakti."""


@api_router.post("/chat")
async def sanatan_chat(req: ChatRequest):
    from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone

    now = datetime.now(timezone.utc).isoformat()
    await db.chat_messages.insert_one(
        {"session_id": req.session_id, "role": "user", "content": req.message, "ts": now}
    )
    history = (
        await db.chat_messages.find({"session_id": req.session_id}, {"_id": 0})
        .sort("ts", 1)
        .to_list(40)
    )
    context = "\n".join(
        f"{'भक्त' if h['role'] == 'user' else 'ज्ञान मित्र'}: {h['content']}" for h in history[-13:-1]
    )
    prompt = (
        f"पूर्व वार्तालाप:\n{context}\n\nभक्त का नया प्रश्न: {req.message}"
        if context
        else req.message
    )

    async def gen():
        full = []
        try:
            chat = LlmChat(
                api_key=os.environ.get("EMERGENT_LLM_KEY"),
                session_id=f"sanatan-{req.session_id}-{uuid.uuid4()}",
                system_message=SANATAN_SYSTEM,
            ).with_model("openai", "gpt-5.4")
            async for ev in chat.stream_message(UserMessage(text=prompt)):
                if isinstance(ev, TextDelta):
                    full.append(ev.content)
                    yield f"data: {json.dumps({'token': ev.content})}\n\n"
                elif isinstance(ev, StreamDone):
                    break
        except Exception as e:
            logging.getLogger(__name__).error(f"chat error: {e}")
            yield f"data: {json.dumps({'error': 'क्षमा करें, अभी उत्तर उपलब्ध नहीं हो पाया। कृपया पुनः प्रयास करें। 🙏'})}\n\n"
        await db.chat_messages.insert_one(
            {
                "session_id": req.session_id,
                "role": "assistant",
                "content": "".join(full),
                "ts": datetime.now(timezone.utc).isoformat(),
            }
        )
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        gen(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@api_router.get("/chat/history/{session_id}")
async def get_chat_history(session_id: str):
    msgs = (
        await db.chat_messages.find(
            {"session_id": session_id}, {"_id": 0, "role": 1, "content": 1}
        )
        .sort("ts", 1)
        .to_list(100)
    )
    return {"messages": msgs}


# ---------------- Owner Auth (JWT) + Site Settings ----------------
import jwt
import bcrypt
from fastapi import HTTPException, Request

JWT_SECRET = os.environ.get("JWT_SECRET")
JWT_ALGORITHM = "HS256"
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "").lower()
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_owner_token(email: str) -> str:
    from datetime import timedelta
    payload = {
        "sub": email,
        "role": "owner",
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_owner(request: Request) -> str:
    auth = request.headers.get("Authorization", "")
    token = auth[7:] if auth.startswith("Bearer ") else request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    if payload.get("role") != "owner":
        raise HTTPException(status_code=403, detail="Forbidden")
    return payload["sub"]


class LoginRequest(BaseModel):
    email: str
    password: str


@api_router.post("/auth/login")
async def owner_login(req: LoginRequest, request: Request):
    email = req.email.lower().strip()
    identifier = f"{request.client.host}:{email}"
    att = await db.login_attempts.find_one({"identifier": identifier})
    now_iso = datetime.now(timezone.utc).isoformat()
    if att and att.get("count", 0) >= 5 and att.get("locked_until", "") > now_iso:
        raise HTTPException(status_code=429, detail="बहुत अधिक प्रयास। 15 मिनट बाद पुनः प्रयास करें।")
    user = await db.users.find_one({"email": email, "role": "owner"})
    if not user or not verify_password(req.password, user["password_hash"]):
        from datetime import timedelta
        count = (att or {}).get("count", 0) + 1
        lock = (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat() if count >= 5 else ""
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$set": {"identifier": identifier, "count": count, "locked_until": lock}},
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="गलत ईमेल या पासवर्ड")
    await db.login_attempts.delete_one({"identifier": identifier})
    return {
        "token": create_owner_token(email),
        "user": {"email": email, "name": user.get("name", "Owner"), "role": "owner"},
    }


@api_router.get("/auth/me")
async def auth_me(request: Request):
    email = await get_owner(request)
    return {"email": email, "role": "owner"}


class SevaSettings(BaseModel):
    qrImage: str = ""
    accountName: str = ""
    bankName: str = ""
    accountNumber: str = ""
    ifsc: str = ""
    upiId: str = ""


@api_router.get("/seva")
async def get_seva_settings():
    doc = await db.site_settings.find_one({"key": "seva"}, {"_id": 0, "key": 0})
    return doc or {}


@api_router.put("/admin/seva")
async def put_seva_settings(req: SevaSettings, request: Request):
    await get_owner(request)
    await db.site_settings.update_one(
        {"key": "seva"}, {"$set": {"key": "seva", **req.model_dump()}}, upsert=True
    )
    return {"ok": True}


# ---------------- Object Storage + QR Upload ----------------
import requests as _requests
from fastapi import UploadFile, File
from fastapi.responses import Response

STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
APP_NAME = "balaji-arnod"
_storage_key = None


def init_storage(force: bool = False):
    global _storage_key
    if _storage_key and not force:
        return _storage_key
    resp = _requests.post(
        f"{STORAGE_URL}/init",
        json={"emergent_key": os.environ.get("EMERGENT_LLM_KEY")},
        timeout=30,
    )
    resp.raise_for_status()
    _storage_key = resp.json()["storage_key"]
    return _storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    resp = _requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": init_storage(), "Content-Type": content_type},
        data=data,
        timeout=120,
    )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    resp = _requests.get(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": init_storage()},
        timeout=60,
    )
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}


@api_router.post("/admin/qr-upload")
async def upload_qr(request: Request, file: UploadFile = File(...)):
    await get_owner(request)
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="केवल image file (jpg/png/webp) अपलोड करें")
    data = await file.read()
    if len(data) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="फ़ाइल 5MB से छोटी होनी चाहिए")
    ext = (file.filename.rsplit(".", 1)[-1].lower() if file.filename and "." in file.filename else "png")
    path = f"{APP_NAME}/uploads/qr/{uuid.uuid4()}.{ext}"
    result = put_object(path, data, file.content_type)
    await db.files.insert_one(
        {
            "id": str(uuid.uuid4()),
            "storage_path": result["path"],
            "original_filename": file.filename,
            "content_type": file.content_type,
            "size": result["size"],
            "is_deleted": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
    )
    url = f"/api/files/{result['path']}"
    await db.site_settings.update_one(
        {"key": "seva"}, {"$set": {"key": "seva", "qrImage": url}}, upsert=True
    )
    return {"url": url}


@api_router.get("/files/{path:path}")
async def download_file(path: str):
    if not path.startswith(f"{APP_NAME}/uploads/qr/"):
        raise HTTPException(status_code=403, detail="Forbidden")
    record = await db.files.find_one({"storage_path": path, "is_deleted": False})
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    try:
        data, content_type = get_object(path)
    except Exception:
        raise HTTPException(status_code=404, detail="File not found")
    return Response(content=data, media_type=record.get("content_type", content_type))


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


def _safe_verify(plain: str, hashed: str) -> bool:
    try:
        return verify_password(plain, hashed)
    except Exception:
        return False


@api_router.put("/auth/change-password")
async def change_password(req: ChangePasswordRequest, request: Request):
    email = await get_owner(request)
    if len(req.new_password) < 8:
        raise HTTPException(status_code=400, detail="नया पासवर्ड कम से कम 8 अक्षरों का हो")
    user = await db.users.find_one({"email": email, "role": "owner"})
    if not user or not _safe_verify(req.current_password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="वर्तमान पासवर्ड गलत है")
    await db.users.update_one(
        {"email": email}, {"$set": {"password_hash": hash_password(req.new_password)}}
    )
    return {"ok": True}


@app.on_event("startup")
async def seed_owner():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    try:
        init_storage()
        logging.getLogger(__name__).info("Storage initialized")
    except Exception as e:
        logging.getLogger(__name__).error(f"Storage init failed: {e}")
    if not ADMIN_EMAIL or not ADMIN_PASSWORD:
        return
    existing = await db.users.find_one({"email": ADMIN_EMAIL})
    if existing is None:
        await db.users.insert_one(
            {
                "email": ADMIN_EMAIL,
                "password_hash": hash_password(ADMIN_PASSWORD),
                "name": "Mandir Owner",
                "role": "owner",
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        )
        await db.site_settings.update_one(
            {"key": "admin_seed"},
            {"$set": {"key": "admin_seed", "env_password_hash": hash_password(ADMIN_PASSWORD)}},
            upsert=True,
        )
        return
    marker = await db.site_settings.find_one({"key": "admin_seed"})
    env_changed = True
    if marker and _safe_verify(ADMIN_PASSWORD, marker.get("env_password_hash", "")):
        env_changed = False
    elif marker is None and _safe_verify(ADMIN_PASSWORD, existing["password_hash"]):
        env_changed = False
    if env_changed:
        await db.users.update_one(
            {"email": ADMIN_EMAIL}, {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}}
        )
    if marker is None or env_changed:
        await db.site_settings.update_one(
            {"key": "admin_seed"},
            {"$set": {"key": "admin_seed", "env_password_hash": hash_password(ADMIN_PASSWORD)}},
            upsert=True,
        )


# ---------------- Daily Shloka (AI, cached per day) ----------------
FALLBACK_SHLOKAS = [
    {
        "sanskrit": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
        "meaning_hi": "हे अर्जुन! कर्म करना ही तेरा अधिकार है, उसके फलों में कभी नहीं। कर्म के फल को अपना उद्देश्य मत बना और अकर्मण्यता से भी आसक्त मत हो।",
        "source": "श्रीमद्भगवद्गीता · अध्याय २ · श्लोक ४७",
    },
    {
        "sanskrit": "संकट कटै मिटै सब पीरा।\nजो सुमिरै हनुमत बलबीरा॥",
        "meaning_hi": "जो भक्त बलशाली हनुमान जी का स्मरण करता है, उसके सभी संकट कट जाते हैं और समस्त पीड़ाएँ मिट जाती हैं।",
        "source": "श्री हनुमान चालीसा",
    },
    {
        "sanskrit": "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥",
        "meaning_hi": "सभी धर्मों का त्याग कर केवल मेरी शरण में आ जा। मैं तुझे समस्त पापों से मुक्त कर दूँगा — शोक मत कर।",
        "source": "श्रीमद्भगवद्गीता · अध्याय १८ · श्लोक ६६",
    },
]


@api_router.get("/shloka/today")
async def shloka_today():
    today = datetime.now().date().isoformat()
    cached = await db.daily_shloka.find_one({"date": today}, {"_id": 0})
    if cached:
        return cached
    shloka = None
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        import re

        day_num = int(today.replace("-", ""))
        src = "श्रीमद्भगवद्गीता" if day_num % 2 == 0 else "हनुमान चालीसा या रामायण परंपरा"
        chat = LlmChat(
            api_key=os.environ.get("EMERGENT_LLM_KEY"),
            session_id=f"shloka-{today}",
            system_message="You are a Sanatan Dharma scholar. Reply ONLY with valid JSON, no markdown.",
        )
        resp = await chat.send_message(
            UserMessage(
                text=(
                    f"आज के लिए {src} से एक प्रेरणादायक श्लोक या चौपाई चुनें। "
                    'Reply ONLY as JSON: {"sanskrit": "मूल संस्कृत/अवधी पंक्तियाँ", "meaning_hi": "सरल हिन्दी भावार्थ (2-3 पंक्तियाँ)", "source": "सटीक स्रोत"}'
                )
            )
        )
        match = re.search(r"\{.*\}", resp, re.S)
        data = json.loads(match.group(0))
        shloka = {
            "date": today,
            "sanskrit": data["sanskrit"],
            "meaning_hi": data["meaning_hi"],
            "source": data["source"],
            "ai": True,
        }
    except Exception as e:
        logging.getLogger(__name__).warning(f"shloka generation failed: {e}")
    if not shloka:
        day_of_year = datetime.now().timetuple().tm_yday
        f = FALLBACK_SHLOKAS[day_of_year % len(FALLBACK_SHLOKAS)]
        shloka = {"date": today, **f, "ai": False}
    await db.daily_shloka.update_one({"date": today}, {"$set": shloka}, upsert=True)
    return shloka


# ---------------- YouTube Media (public RSS, no API key) ----------------
YOUTUBE_CHANNELS = [
    {"name": "Shri Sankat Haran Balaji Maharaj", "handle": "@sankatharanbalaji", "subscribe": "https://www.youtube.com/@sankatharanbalaji"},
    {"name": "Arnod Balaji (Songs)", "handle": "@arnodbalaji", "subscribe": "https://www.youtube.com/@arnodbalaji"},
]


def _resolve_channel_id(handle: str):
    import re

    try:
        r = _requests.get(
            f"https://www.youtube.com/{handle}",
            timeout=20,
            headers={"User-Agent": "Mozilla/5.0"},
        )
        m = re.search(r'"channelId":"(UC[\w-]+)"', r.text) or re.search(r"channel_id=(UC[\w-]+)", r.text)
        return m.group(1) if m else None
    except Exception:
        return None


def _channel_videos(channel_id: str, limit: int = 8):
    import xml.etree.ElementTree as ET

    r = _requests.get(
        f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}",
        timeout=20,
        headers={"User-Agent": "Mozilla/5.0"},
    )
    root = ET.fromstring(r.text)
    ns = {"a": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015"}
    vids = []
    for e in root.findall("a:entry", ns)[:limit]:
        vid = e.find("yt:videoId", ns).text
        vids.append(
            {
                "id": vid,
                "title": e.find("a:title", ns).text,
                "published": e.find("a:published", ns).text,
                "thumb": f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg",
                "url": f"https://www.youtube.com/watch?v={vid}",
            }
        )
    return vids


@api_router.get("/media/youtube")
async def youtube_media():
    cached = await db.media_cache.find_one({"key": "youtube"}, {"_id": 0})
    now = datetime.now(timezone.utc)
    if cached and (now - datetime.fromisoformat(cached["ts"])).total_seconds() < 1800:
        return cached["data"]
    channels = []
    for ch in YOUTUBE_CHANNELS:
        cid = _resolve_channel_id(ch["handle"])
        entry = {
            **ch,
            "channelId": cid,
            "videos": [],
            "liveUrl": f"https://www.youtube.com/{ch['handle']}/live",
        }
        if cid:
            try:
                entry["videos"] = _channel_videos(cid)
            except Exception:
                pass
        channels.append(entry)
    data = {"channels": channels}
    await db.media_cache.update_one(
        {"key": "youtube"},
        {"$set": {"key": "youtube", "ts": now.isoformat(), "data": data}},
        upsert=True,
    )
    return data


class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


@api_router.get("/")
async def root():
    return {"message": "Shri Sankat Haran Balaji Maharaj Mandir API"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
