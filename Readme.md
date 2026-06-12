# 🌿 TERRA AI — Crop Yield Prediction & Smart Agricultural Analytics

> AI-powered platform for predicting crop yield using Random Forest ML,
> built with React, Flask, MySQL, and Claude AI assistant.

---

## 📁 Project Structure

```
terra-ai/
│
├── frontend/
│   ├── src/
│   │   └── App.jsx          ← Complete React application
│   ├── package.json
│   └── index.html
│
├── backend/
│   ├── app.py               ← Flask REST API (all endpoints)
│   ├── requirements.txt
│   └── .env.example
│
├── ml_model/
│   ├── train_model.py       ← Random Forest training script
│   └── sample_dataset.csv   ← Auto-generated on first run
│
├── database/
│   └── schema.sql           ← MySQL schema + seed data
│
└── README.md
```

---

## ⚙️ Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Recharts, Lucide-React        |
| Backend    | Python 3.11, Flask, Flask-JWT-Extended  |
| ML Engine  | Scikit-learn, NumPy, Pandas             |
| Database   | MySQL 8                                 |
| AI Chat    | Claude (Anthropic API)                  |

---

## 🚀 Installation — Step by Step

### Prerequisites
- Node.js 18+
- Python 3.10+
- MySQL 8.0+
- VS Code (recommended)

---

### Step 1 — Clone / Download

```bash
git clone https://github.com/yourname/terra-ai.git
cd terra-ai
```

---

### Step 2 — Database Setup

```bash
mysql -u root -p < database/schema.sql
```

This creates the `terra_ai` database with all tables and seeds
a default admin account:
- Email: `admin@terra.ai`
- Password: `Admin@123`

---

### Step 3 — Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — set your DB_PASSWORD and JWT_SECRET
```

**Train the ML model first** (required before starting API):

```bash
cd ../ml_model
python train_model.py
# Output: crop_yield_model.pkl — loaded by Flask automatically
```

**Start the Flask server:**

```bash
cd ../backend
python app.py
# API running at http://localhost:5000
```

---

### Step 4 — Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
# App running at http://localhost:5173
```

---

### Step 5 — VS Code Setup (Recommended)

Install these extensions:
- **ES7+ React/Redux/React-Native snippets**
- **Python** (Microsoft)
- **Pylance**
- **MySQL** (cweijan)
- **Thunder Client** (API testing)
- **Tailwind CSS IntelliSense**

Open workspace:
```
File → Open Folder → terra-ai/
```

---

## 🔌 API Reference

All endpoints require `Authorization: Bearer <token>` except auth routes.

### Auth

| Method | Endpoint             | Description             |
|--------|----------------------|-------------------------|
| POST   | /api/auth/register   | Register new user       |
| POST   | /api/auth/login      | Login, returns JWT      |
| GET    | /api/auth/me         | Get current user info   |

### Predictions

| Method | Endpoint                  | Description                  |
|--------|---------------------------|------------------------------|
| POST   | /api/predict              | Run ML yield prediction      |
| GET    | /api/predictions          | List prediction history      |
| GET    | /api/predictions/:id      | Get single prediction        |

**POST /api/predict — Request body:**
```json
{
  "crop":        "Rice",
  "soil_type":   "Loamy",
  "temperature": 28.5,
  "humidity":    65,
  "rainfall":    900,
  "fertilizer":  120,
  "irrigation":  "Drip"
}
```

**Response:**
```json
{
  "id": 42,
  "predicted_yield": 6.83,
  "unit": "tonnes/hectare",
  "accuracy": 94.2,
  "status": "Excellent",
  "recommendations": [
    "Maintain current practices",
    "Monitor for pests proactively"
  ]
}
```

### Dashboard

| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| GET    | /api/dashboard/stats            | KPI summary cards        |
| GET    | /api/dashboard/yield-trend      | Monthly yield chart data |
| GET    | /api/dashboard/crop-distribution| Predictions per crop     |

### Soil & Weather

| Method | Endpoint       | Description              |
|--------|----------------|--------------------------|
| GET    | /api/soil      | List soil records        |
| POST   | /api/soil      | Add soil test result     |
| GET    | /api/weather   | Last 30 days weather     |
| POST   | /api/weather   | Log weather data point   |

### Admin (admin role only)

| Method | Endpoint                         | Description           |
|--------|----------------------------------|-----------------------|
| GET    | /api/admin/users                 | All users + stats     |
| PATCH  | /api/admin/users/:id/status      | Activate/deactivate   |
| GET    | /api/admin/predictions/all       | All predictions       |

---

## 🧠 ML Model Details

| Property        | Value                     |
|-----------------|---------------------------|
| Algorithm       | Random Forest Regressor   |
| Trees           | 200                       |
| Max Depth       | 15                        |
| Training Samples| 8,000 (synthetic + real)  |
| R² Score        | ~0.937                    |
| MAE             | ~0.24 t/ha                |
| RMSE            | ~0.38 t/ha                |
| CV Folds        | 5                         |

**Input Features:**
1. Crop type (encoded)
2. Soil type (encoded)
3. Temperature (°C)
4. Humidity (%)
5. Rainfall (mm)
6. Fertiliser (kg/ha)
7. Irrigation method (encoded)

---

## 🌐 Frontend Pages

| Page            | Route       | Description                        |
|-----------------|-------------|------------------------------------|
| Login/Register  | /auth       | Secure JWT authentication          |
| Dashboard       | /dashboard  | KPI cards + 4 interactive charts   |
| Yield Prediction| /predict    | ML form + animated results panel   |
| Analytics       | /analytics  | Seasonal trends + pie distribution |
| AI Assistant    | /chatbot    | Claude-powered farming advisor     |
| Admin Panel     | /admin      | Users, predictions, datasets       |
| Settings        | /settings   | Theme, language, model info        |

---

## 🐳 Docker Deployment (Optional)

```bash
# Build & run all services
docker-compose up --build

# Services:
# - frontend  → http://localhost:5173
# - backend   → http://localhost:5000
# - mysql     → localhost:3306
```

---

## 🔒 Security Notes

- JWT tokens expire in 12 hours
- Passwords hashed with bcrypt (cost factor 12)
- CORS restricted to frontend origin in production
- Admin endpoints check role in DB (not just token)
- Change `JWT_SECRET` and `DB_PASSWORD` before deploying

---

## 📊 Sample Prediction (cURL)

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@terra.ai","password":"Admin@123"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

# 2. Predict
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "crop":"Rice","soil_type":"Loamy",
    "temperature":28,"humidity":65,
    "rainfall":900,"fertilizer":120,
    "irrigation":"Drip"
  }'
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "Add my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — free to use for personal and commercial projects.

---

*Built with ❤️ for smarter farming — TERRA AI v2.1.0*