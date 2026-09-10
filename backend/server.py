from fastapi import FastAPI, APIRouter, Query
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
