import torch
import torch.nn as nn
from torchvision import transforms, models
from fastapi import FastAPI, File, UploadFile, HTTPException
#new
from fastapi.middleware.cors import CORSMiddleware 
from PIL import Image
import io
import uvicorn

app = FastAPI()

#new
origins = [
    "http://localhost:5173", # Vite default port
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --- CONFIGURATION ---
MODEL_PATH = "fast_plant_model.pth"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 1. DEFINE CLASS NAMES (Must be sorted alphabetically, just like ImageFolder does)
# I extracted these from your Treatment Dictionary
CLASS_NAMES = sorted([
    "Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy",
    "Blueberry___healthy", "Cherry_(including_sour)___Powdery_mildew", "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot", "Corn_(maize)___Common_rust_", 
    "Corn_(maize)___Northern_Leaf_Blight", "Corn_(maize)___healthy", "Grape___Black_rot", 
    "Grape___Esca_(Black_Measles)", "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)", "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)", "Peach___Bacterial_spot", "Peach___healthy",
    "Pepper,_bell___Bacterial_spot", "Pepper,_bell___healthy", "Potato___Early_blight", 
    "Potato___Late_blight", "Potato___healthy", "Raspberry___healthy", "Soybean___healthy",
    "Squash___Powdery_mildew", "Strawberry___Leaf_scorch", "Strawberry___healthy",
    "Tomato___Bacterial_spot", "Tomato___Early_blight", "Tomato___Late_blight", "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot", "Tomato___Spider_mites Two-spotted_spider_mite", "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus", "Tomato___Tomato_mosaic_virus", "Tomato___healthy"
])

# 2. TREATMENT DATA (From your notebook)
TREATMENT_RECOMMENDATIONS = {
  "Apple___Apple_scab": ["Apply fungicides (captan or sulfur).", "Rake and destroy fallen leaves.", "Prune trees for airflow."],
  "Apple___Black_rot": ["Remove mummified fruit.", "Apply fungicides.", "Prune trees."],
  "Apple___Cedar_apple_rust": ["Remove nearby cedar trees.", "Apply fungicides at pink bud stage.", "Plant resistant varieties."],
  "Apple___healthy": ["Regular watering.", "Prune annually.", "Monitor for pests."],
  "Blueberry___healthy": ["Maintain acidic soil (pH 4.5-5.5).", "Mulch with pine bark.", "Prune older canes."],
  "Cherry_(including_sour)___Powdery_mildew": ["Apply sulfur fungicides.", "Prune for air circulation.", "Avoid overhead watering."],
  "Cherry_(including_sour)___healthy": ["Provide full sun.", "Fertilize in early spring.", "Prune dead branches."],
  "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": ["Rotate crops.", "Plant resistant hybrids.", "Plow under crop debris."],
  "Corn_(maize)___Common_rust_": ["Plant resistant hybrids.", "Apply fungicides early.", "Destroy volunteer corn."],
  "Corn_(maize)___Northern_Leaf_Blight": ["Plant resistant hybrids.", "Rotate crops.", "Apply foliar fungicides."],
  "Corn_(maize)___healthy": ["Nitrogen fertilization.", "Control weeds.", "Maintain moisture."],
  "Grape___Black_rot": ["Remove mummified berries.", "Apply mancozeb/myclobutanil.", "Weed underneath vines."],
  "Grape___Esca_(Black_Measles)": ["Prune infected wood.", "Protect pruning wounds.", "Remove dead vines."],
  "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": ["Apply fungicides.", "Improve air circulation.", "Remove debris."],
  "Grape___healthy": ["Prune annually.", "Train vines to trellis.", "Monitor nutrients."],
  "Orange___Haunglongbing_(Citrus_greening)": ["Remove infected trees.", "Control Asian Citrus Psyllid.", "Use disease-free stock."],
  "Peach___Bacterial_spot": ["Plant resistant varieties.", "Apply copper sprays.", "Avoid heavy nitrogen."],
  "Peach___healthy": ["Prune to open center.", "Thin fruit.", "Apply dormant oil sprays."],
  "Pepper,_bell___Bacterial_spot": ["Use disease-free seeds.", "Rotate crops.", "Apply copper bactericides."],
  "Pepper,_bell___healthy": ["Stake plants.", "Maintain consistent moisture.", "Mulch."],
  "Potato___Early_blight": ["Apply fungicides.", "Crop rotation.", "Keep plants vigorous."],
  "Potato___Late_blight": ["Destroy infected plants immediately.", "Apply preventative fungicides.", "Use certified seed."],
  "Potato___healthy": ["Hill soil around stems.", "Monitor for beetles.", "Harvest after vines die."],
  "Raspberry___healthy": ["Prune fruited canes.", "Maintain narrow rows.", "Support with trellis."],
  "Soybean___healthy": ["Ensure spacing.", "Monitor for aphids.", "Maintain soil pH 6.0-6.8."],
  "Squash___Powdery_mildew": ["Apply neem oil or sulfur.", "Space plants widely.", "Water at base."],
  "Strawberry___Leaf_scorch": ["Remove infected leaves.", "Apply captan or copper.", "Renovate beds."],
  "Strawberry___healthy": ["Mulch with straw.", "Remove runners.", "Full sun."],
  "Tomato___Bacterial_spot": ["Remove infected plants.", "Copper fungicides.", "Rotate crops."],
  "Tomato___Early_blight": ["Trim lower leaves.", "Mulch soil.", "Stake plants."],
  "Tomato___Late_blight": ["Remove/destroy plant.", "Copper fungicide.", "Water at base."],
  "Tomato___Leaf_Mold": ["Increase ventilation.", "Apply chlorothalonil.", "Reduce humidity."],
  "Tomato___Septoria_leaf_spot": ["Remove infected leaves.", "Apply chlorothalonil.", "Clean debris."],
  "Tomato___Spider_mites Two-spotted_spider_mite": ["Spray water stream.", "Neem oil.", "Keep plants watered."],
  "Tomato___Target_Spot": ["Remove debris.", "Apply azoxystrobin.", "Avoid overhead irrigation."],
  "Tomato___Tomato_Yellow_Leaf_Curl_Virus": ["Remove plants.", "Control whiteflies.", "Reflective mulches."],
  "Tomato___Tomato_mosaic_virus": ["Remove plants (no cure).", "Wash hands thoroughly.", "Disinfect tools."],
  "Tomato___healthy": ["Stake plants.", "Water consistently.", "Prune suckers."]
}

# --- MODEL LOADING LOGIC ---
def load_model():
    """Recreates the EfficientNet-B0 architecture and loads weights"""
    print(f"Loading model on {DEVICE}...")
    try:
        # 1. Create Architecture
        model = models.efficientnet_b0(weights=None)
        # 2. Modify Head (Must match training!)
        model.classifier[1] = nn.Linear(model.classifier[1].in_features, len(CLASS_NAMES))
        # 3. Load Weights
        # We use map_location to ensure it loads even if you trained on GPU but run on CPU
        state_dict = torch.load(MODEL_PATH, map_location=DEVICE)
        model.load_state_dict(state_dict)
        model.to(DEVICE)
        model.eval()
        print("Model loaded successfully!")
        return model
    except Exception as e:
        print(f"Error loading model: {e}")
        return None

# Load model globally so we don't reload it per request
model = load_model()

# --- PREPROCESSING (Must match training!) ---
# In your notebook, you used Resize(128,128) and ToTensor() for validation
transform = transforms.Compose([
    transforms.Resize((128, 128)),
    transforms.ToTensor()
])

@app.get("/")
def home():
    return {"message": "Plant Disease API is running (PyTorch Version)"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    try:
        # 1. Read and Prepare Image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # 2. Transform (Resize -> Tensor -> Add Batch Dimension)
        input_tensor = transform(image).unsqueeze(0).to(DEVICE)

        # 3. Inference
        with torch.no_grad():
            outputs = model(input_tensor)
            # Calculate probabilities
            probs = torch.nn.functional.softmax(outputs, dim=1)[0]
            # Get max probability and index
            confidence, pred_idx = torch.max(probs, 0)

        # 4. Process Results
        predicted_index = pred_idx.item()
        predicted_class = CLASS_NAMES[predicted_index]
        conf_score = float(confidence.item()) * 100

        # Get treatment advice
        treatment = TREATMENT_RECOMMENDATIONS.get(predicted_class, ["No specific advice available."])

        return {
            "filename": file.filename,
            "prediction": predicted_class,
            "confidence": f"{conf_score:.2f}%",
            "treatment": treatment
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)