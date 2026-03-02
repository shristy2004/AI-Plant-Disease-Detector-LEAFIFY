#LEAFIFY
🌿 AI Plant Disease Detection – LEAFIFY

An AI-powered web application that detects plant diseases from leaf images using Deep Learning (CNN) and provides instant analysis through a modern web interface.

🚀 Project Overview

LEAFIFY is an intelligent plant disease detection system that allows users to:

📸 Upload a leaf image

🧠 Analyze the image using a trained CNN model

🌱 Detect plant disease with prediction confidence

📊 Visualize model performance

This project combines Deep Learning, Computer Vision, and Full-Stack Web Development to deliver a real-world agricultural solution.

🛠️ Tech Stack
🔧 Build Tool

Vite

🖥️ Frontend
React.js

Tailwind CSS

⚙️ Backend

FastAPI

🧠 Deep Learning

PyTorch

Convolutional Neural Networks (CNN)

🖼️ Image & Data Processing

OpenCV

Pillow

NumPy

Pandas

📊 Visualization

Matplotlib

Seaborn

📦 API Handling

🏗️ System Architecture
User → React Frontend → FastAPI Backend → PyTorch CNN Model → Prediction → Response → UI Display

📂 Project Structure
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



🧠 How It Works

User uploads a plant leaf image.

Image is processed using OpenCV & Pillow.

Image is converted to tensor using NumPy.

CNN model (trained in PyTorch) predicts disease class.

FastAPI returns prediction result.

React displays result beautifully.

📸 Key Features

✅ Real-time image upload

✅ Deep learning prediction

✅ Clean modern UI

✅ REST API integration

✅ Performance visualization

✅ Modular project structure

✅ Scalable architecture

⚡ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/AI-Plant-Disease-Detector-LEAFIFY.git
cd AI-Plant-Disease-Detector-LEAFIFY

🌍 Real-World Impact

🌾 Helps farmers detect disease early

💰 Reduces crop loss

📈 Improves agricultural productivity

🤖 Demonstrates practical AI application

🔮 Future Improvements

Add mobile camera integration

Deploy on cloud (AWS / Render / Vercel)

Add multi-language support

Improve model accuracy with larger dataset

Add fertilizer recommendation system

⭐ Support

If you found this project helpful:

Give it a ⭐ on GitHub
Share it with others
