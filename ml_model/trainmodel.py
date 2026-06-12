# ============================================================
# TERRA AI — ML Model Training Script
# File: ml_model/train_model.py
# Run: python train_model.py
# Output: crop_yield_model.pkl (loaded by Flask at runtime)
# ============================================================

import numpy as np
import pandas as pd
import pickle, os
from sklearn.ensemble          import RandomForestRegressor
from sklearn.model_selection   import train_test_split, cross_val_score
from sklearn.preprocessing     import StandardScaler, LabelEncoder
from sklearn.metrics           import mean_absolute_error, mean_squared_error, r2_score

# ── Reproducibility ──────────────────────────────────────────
SEED = 42
np.random.seed(SEED)

# ── Encoding maps (must stay in sync with backend/app.py) ────
CROP_MAP = {"Rice":0,"Wheat":1,"Corn":2,"Soybeans":3,"Cotton":4,"Sugarcane":5,"Barley":6,"Potato":7}
SOIL_MAP = {"Loamy":0,"Sandy":1,"Clay":2,"Silty":3,"Peaty":4,"Chalky":5}
IRRI_MAP = {"Drip":0,"Sprinkler":1,"Flood":2,"Rain-fed":3,"Furrow":4}

# ────────────────────────────────────────────────────────────
# 1. GENERATE SYNTHETIC TRAINING DATASET
#    (replace csv_path below to load your real data instead)
# ────────────────────────────────────────────────────────────

def generate_dataset(n=8000):
    """
    Create a realistic synthetic agricultural dataset.
    Replace this function by loading a CSV when real data is available:
        df = pd.read_csv("your_data.csv")
    """
    crops   = list(CROP_MAP.keys())
    soils   = list(SOIL_MAP.keys())
    irris   = list(IRRI_MAP.keys())

    # Base yields per crop (t/ha)
    base_yields = {"Rice":5.5,"Wheat":4.0,"Corn":7.0,"Soybeans":3.5,
                   "Cotton":1.8,"Sugarcane":65,"Barley":4.2,"Potato":25}
    soil_mults  = {"Loamy":1.15,"Sandy":0.85,"Clay":0.95,"Silty":1.10,"Peaty":1.05,"Chalky":0.90}
    irri_mults  = {"Drip":1.12,"Sprinkler":1.08,"Flood":1.00,"Rain-fed":0.88,"Furrow":1.04}

    rows = []
    for _ in range(n):
        crop   = np.random.choice(crops)
        soil   = np.random.choice(soils)
        irri   = np.random.choice(irris)
        temp   = np.random.uniform(10, 42)
        hum    = np.random.uniform(25, 95)
        rain   = np.random.uniform(100, 3000)
        fert   = np.random.uniform(0, 300)

        b  = base_yields[crop]
        tf = 1 - ((temp - 25) / 20) ** 2 * 0.3
        hf = 1 - ((hum  - 65) / 40) ** 2 * 0.2
        rf = min(1.15, 0.7 + rain / 1500)
        ff = 0.75 + (fert / 200) * 0.35

        yield_val = (b * soil_mults[soil] * irri_mults[irri] * tf * hf * rf * ff
                     + np.random.normal(0, b * 0.04))   # add realism noise
        yield_val = max(0.1, round(yield_val, 3))

        rows.append({
            "crop":        CROP_MAP[crop],
            "soil_type":   SOIL_MAP[soil],
            "temperature": round(temp, 1),
            "humidity":    round(hum,  1),
            "rainfall":    round(rain, 1),
            "fertilizer":  round(fert, 1),
            "irrigation":  IRRI_MAP[irri],
            "yield":       yield_val,
        })

    return pd.DataFrame(rows)


# ────────────────────────────────────────────────────────────
# 2. SAVE SAMPLE CSV  (handy for inspection / re-use)
# ────────────────────────────────────────────────────────────

CSV_PATH   = os.path.join(os.path.dirname(__file__), "sample_dataset.csv")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "crop_yield_model.pkl")

print("🌱  Generating training dataset …")
df = generate_dataset(n=8000)
df.to_csv(CSV_PATH, index=False)
print(f"    Saved {len(df)} rows → {CSV_PATH}")


# ────────────────────────────────────────────────────────────
# 3. FEATURES & TARGET
# ────────────────────────────────────────────────────────────

FEATURES = ["crop","soil_type","temperature","humidity","rainfall","fertilizer","irrigation"]
TARGET   = "yield"

X = df[FEATURES].values
y = df[TARGET].values

print(f"\n📊  Dataset shape : X={X.shape}, y={y.shape}")
print(f"    Yield range   : {y.min():.2f} – {y.max():.2f} t/ha")


# ────────────────────────────────────────────────────────────
# 4. TRAIN / TEST SPLIT
# ────────────────────────────────────────────────────────────

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=SEED
)
print(f"\n✂️   Train: {len(X_train)} | Test: {len(X_test)}")


# ────────────────────────────────────────────────────────────
# 5. FEATURE SCALING
# ────────────────────────────────────────────────────────────

scaler  = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s  = scaler.transform(X_test)


# ────────────────────────────────────────────────────────────
# 6. RANDOM FOREST MODEL
# ────────────────────────────────────────────────────────────

print("\n🌲  Training Random Forest Regressor …")
rf = RandomForestRegressor(
    n_estimators = 200,
    max_depth    = 15,
    min_samples_split = 4,
    min_samples_leaf  = 2,
    max_features = "sqrt",
    n_jobs       = -1,
    random_state = SEED,
)
rf.fit(X_train_s, y_train)
print("    Training complete ✅")


# ────────────────────────────────────────────────────────────
# 7. EVALUATION
# ────────────────────────────────────────────────────────────

y_pred = rf.predict(X_test_s)

mae  = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2   = r2_score(y_test, y_pred)

print("\n" + "="*50)
print("  MODEL EVALUATION RESULTS")
print("="*50)
print(f"  MAE  (Mean Absolute Error)  : {mae:.4f} t/ha")
print(f"  RMSE (Root Mean Sq. Error)  : {rmse:.4f} t/ha")
print(f"  R²   (Coefficient of Det.)  : {r2:.4f}")
print(f"  Accuracy (R² × 100)         : {r2*100:.1f}%")
print("="*50)

# Cross-validation for robustness check
cv_scores = cross_val_score(rf, X_train_s, y_train, cv=5, scoring="r2")
print(f"\n  5-Fold CV R² : {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

# Feature importance table
print("\n  FEATURE IMPORTANCES:")
for feat, imp in sorted(zip(FEATURES, rf.feature_importances_), key=lambda x: -x[1]):
    bar = "█" * int(imp * 40)
    print(f"    {feat:<15} {imp:.4f}  {bar}")


# ────────────────────────────────────────────────────────────
# 8. SAVE MODEL BUNDLE
# ────────────────────────────────────────────────────────────

bundle = {
    "model":    rf,
    "scaler":   scaler,
    "encoder":  None,          # categorical features are integer-encoded
    "features": FEATURES,
    "r2_score": r2,
    "mae":      mae,
    "rmse":     rmse,
}

with open(MODEL_PATH, "wb") as f:
    pickle.dump(bundle, f)

print(f"\n💾  Model saved → {MODEL_PATH}")
print("    Load in Flask: pickle.load(open('crop_yield_model.pkl','rb'))")
print("\n✅  Done! Run `python backend/app.py` to start the API server.")