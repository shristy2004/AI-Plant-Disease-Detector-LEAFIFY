 # 🌿 LEAFIFY  
## AI-Powered Plant Disease Detection System

An intelligent web application that detects plant diseases from leaf images using **Deep Learning (CNN)** and provides instant analysis through a modern, responsive interface.

---

## 🚀 Live Demo

🌐 **Try LEAFIFY Live:**  
**https://ai-plant-disease-detector-leafify.vercel.app**

---

## 🚀 Project Overview

**LEAFIFY** is an AI-based plant disease detection system that enables users to:

- 📸 Upload a plant leaf image
- 🧠 Analyze the image using a trained CNN model
- 🌱 Detect plant disease with prediction confidence
- 📊 Visualize model training performance

## 🛠️ Technology Stack

### 🔧 Build Tool
- Vite

### 🖥️ Frontend
- React.js
- Tailwind CSS
- React Router

### ⚙️ Backend
- FastAPI
- Uvicorn

### 🧠 Deep Learning
- PyTorch
- Convolutional Neural Networks (CNN)

### 🖼️ Image Processing
- OpenCV
- Pillow

### 📊 Data Processing
- NumPy
- Pandas

### 📈 Visualization
- Matplotlib
- Seaborn

### 📦 API Handling
- Multipart File Upload
- REST API

---

## 🏗️ System Architecture

```text
User
   │
   ▼
React Frontend
   │
   ▼
FastAPI Backend
   │
   ▼
PyTorch CNN Model
   │
   ▼
Prediction Result
   │
   ▼
Treatment Recommendation
   │
   ▼
Frontend Display
```

---

## 📂 Project Structure

```text
AI-Plant-Disease-Detector-LEAFIFY/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── model/
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
├── leafify_ml_part/
│   ├── model training
│   ├── dataset
│   └── learning_curves.png
│
└── README.md
```

---

## 🧠 How It Works

1. User uploads a plant leaf image.
2. React frontend sends the image to the FastAPI backend.
3. FastAPI preprocesses the image using OpenCV and Pillow.
4. Image is converted into tensors using NumPy.
5. The trained PyTorch CNN predicts the disease class.
6. Backend returns:
   - Disease Prediction
   - Confidence Score
   - Recommended Treatment
7. React displays the result beautifully to the user.

---

## ✨ Features

- ✅ AI-powered disease prediction
- ✅ Upload plant leaf images
- ✅ Confidence score visualization
- ✅ Recommended treatment suggestions
- ✅ Responsive modern UI
- ✅ REST API integration
- ✅ Fast inference using PyTorch
- ✅ FastAPI Swagger Documentation
- ✅ Fully deployed using Render + Vercel

---

## ⚡ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/shristy2004/AI-Plant-Disease-Detector-LEAFIFY.git
cd AI-Plant-Disease-Detector-LEAFIFY
```

---

### 2. Backend Setup

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend runs at

```
http://127.0.0.1:8000
```

Swagger Documentation

```
http://127.0.0.1:8000/docs
```

---

### 3. Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at

```
http://localhost:5173
```

---

## 🌍 Deployment

### Frontend

Hosted on **Vercel**

### Backend

Hosted on **Render**

---

## 🌾 Real-World Impact

- 🌱 Early plant disease detection
- 💰 Reduces crop losses
- 📈 Improves agricultural productivity
- 🤖 AI-assisted farming
- 🚜 Helps farmers make faster decisions

---

## 🔮 Future Improvements

- 📱 Mobile camera integration
- 🌐 Multi-language support
- 📍 GPS-based disease monitoring
- 📊 Improved CNN accuracy
- 🌿 Fertilizer recommendation
- ☁️ AWS Cloud deployment
- 📈 Disease severity estimation

---

## ⭐ Support

If you found this project helpful:

⭐ Star this repository

🍴 Fork the project

🤝 Contribute to improve it

💚 Share it with others
