# 🌿 LEAFIFY  
## AI-Powered Plant Disease Detection System

An intelligent web application that detects plant diseases from leaf images using **Deep Learning (CNN)** and provides instant analysis through a modern, responsive interface.

---

## 🚀 Project Overview

**LEAFIFY** is an AI-based plant disease detection system that enables users to:

- 📸 Upload a plant leaf image  
- 🧠 Analyze the image using a trained CNN model  
- 🌱 Detect plant disease with prediction confidence  
- 📊 Visualize model training performance  

This project integrates **Deep Learning, Computer Vision, and Full-Stack Web Development** to create a practical agricultural solution.

---

## 🛠️ Technology Stack

### 🔧 Build Tool
- Vite

### 🖥️ Frontend
- React.js  
- Tailwind CSS  

### ⚙️ Backend
- FastAPI  

### 🧠 Deep Learning
- PyTorch  
- Convolutional Neural Networks (CNN)  

### 🖼️ Image & Data Processing
- OpenCV  
- Pillow  
- NumPy  
- Pandas  

### 📊 Visualization
- Matplotlib  
- Seaborn  

### 📦 API Handling
- Multipart (File upload handling for APIs)

---

## 🏗️ System Architecture

```
User 
   ↓
React Frontend 
   ↓
FastAPI Backend 
   ↓
PyTorch CNN Model 
   ↓
Prediction Result 
   ↓
Frontend Display
```

---

## 📂 Project Structure

```
AI-Plant-Disease-Detector-LEAFIFY/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── model/
│
├── leafify-frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── leafify_ml_part/
│   └── training & model files
│
└── README.md
```

---

## 🧠 How It Works

1. User uploads a plant leaf image through the web interface.  
2. Image is processed using **OpenCV & Pillow**.  
3. Image data is converted into tensors using **NumPy**.  
4. A trained **CNN model (PyTorch)** predicts the disease class.  
5. FastAPI returns the prediction response.  
6. React frontend displays the result with confidence score.

---

## ✨ Key Features

- ✅ Real-time image upload  
- ✅ AI-based disease prediction  
- ✅ Clean & responsive UI  
- ✅ REST API integration  
- ✅ Model performance visualization  
- ✅ Modular and scalable architecture  

---

## ⚡ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/shristy2004/AI-Plant-Disease-Detector-LEAFIFY.git
cd AI-Plant-Disease-Detector-LEAFIFY
```

---

### 2️⃣ Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at:
```
http://127.0.0.1:8000
```

---

### 3️⃣ Frontend Setup

```bash
cd leafify-frontend
npm install
npm run dev
```

Frontend runs at:
```
http://localhost:5173
```

---

## 🌍 Real-World Impact

- 🌾 Early detection of plant diseases  
- 💰 Reduction in crop loss  
- 📈 Increased agricultural productivity  
- 🤖 Practical implementation of AI in farming  

---

## 🔮 Future Improvements

- 📱 Mobile camera integration  
- ☁️ Cloud deployment (AWS / Render / Vercel)  
- 🌐 Multi-language support  
- 📊 Improved model accuracy with larger dataset  
- 🌱 Fertilizer & treatment recommendation system  

---

## ⭐ Support

If you found this project helpful:

- Give it a ⭐ on GitHub  
- Share it with others  
- Contribute to enhance the project  
