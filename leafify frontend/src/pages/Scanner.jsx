import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

/**
 * Scanner.jsx - Leaf/Plant Scanner 🌿
 * Connected to FastAPI Backend (http://127.0.0.1:8000)
 */

export default function Scanner({ onBack }) { 
  const navigate = useNavigate(); // Initialize hook
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
  const [capturedCropped, setCapturedCropped] = useState(null);
  const [capturedFull, setCapturedFull] = useState(null);
  const [message, setMessage] = useState("");
  const [torchOn, setTorchOn] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false); // New state for loading spinner

  // Overlay proportions
  const overlay = { wRatio: 0.85, hRatio: 0.85, borderRadius: 20 };

  const displayMessage = (text, isError = false) => {
    const msg = isError ? `🚨 ${text}` : `ℹ️ ${text}`;
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000);
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);
  
  // Handle Back Button
  useEffect(() => {
    if (onBack) {
      window.history.pushState({ scannerActive: true }, '');
      const handlePopState = (event) => {
        if (event.state === null || !event.state.scannerActive) {
          handleBack();
        }
      };
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onBack]);

  async function startCamera() {
    stopCamera();
    displayMessage("Activating camera..."); 
    try {
      const constraints = {
        video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      };
      const s = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
      setMessage("");
      setTorchOn(false);
    } catch (e) {
      console.error("startCamera error:", e);
      displayMessage("Cannot open camera. Check permissions or upload an image.", true); 
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    if (!message.startsWith("🚨")) {
        setMessage("⏸️ Camera stopped.");
    }
  }

  function handleBack() {
    stopCamera();
    if (onBack) onBack();
    else navigate('/'); // Default to home if no prop provided
  }

  function switchCamera() {
    setCapturedCropped(null);
    setCapturedFull(null);
    setFacingMode((p) => (p === "user" ? "environment" : "user"));
  }

  async function toggleTorch() {
    if (!stream) {
      displayMessage("Camera stopped.", true);
      return;
    }
    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) return;
    const capabilities = videoTrack.getCapabilities?.();
    if (!capabilities || !capabilities.torch) {
      displayMessage("Flashlight not available on this device/browser.", true);
      return;
    }
    try {
      await videoTrack.applyConstraints({ advanced: [{ torch: !torchOn }] });
      setTorchOn((t) => !t);
    } catch (e) {
      console.error("toggleTorch error", e);
      displayMessage("Flashlight error.", true);
    }
  }

  function captureAndCrop() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (!vw || !vh) {
      displayMessage("Camera not ready — please wait a moment.", true);
      return;
    }

    canvas.width = vw;
    canvas.height = vh;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, vw, vh);
    const fullDataUrl = canvas.toDataURL("image/jpeg", 0.95);
    setCapturedFull(fullDataUrl);

    const overlayW = Math.floor(vw * overlay.wRatio);
    const overlayH = Math.floor(vh * overlay.hRatio);
    const overlayX = Math.floor((vw - overlayW) / 2);
    const overlayY = Math.floor((vh - overlayH) / 2);

    const cropCanvas = document.createElement("canvas");
    cropCanvas.width = overlayW;
    cropCanvas.height = overlayH;
    const cropCtx = cropCanvas.getContext("2d");

    cropCtx.fillStyle = "#ffffff";
    cropCtx.fillRect(0, 0, overlayW, overlayH);
    cropCtx.drawImage(canvas, overlayX, overlayY, overlayW, overlayH, 0, 0, overlayW, overlayH);

    const croppedDataUrl = cropCanvas.toDataURL("image/jpeg", 0.92);
    setCapturedCropped(croppedDataUrl);

    stopCamera();
    displayMessage("Photo taken and cropped!");
  }

  function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    stopCamera();
    displayMessage("Processing uploaded image...");
    
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const imgW = img.naturalWidth;
        const imgH = img.naturalHeight;
        const c = canvasRef.current;
        c.width = imgW;
        c.height = imgH;
        const ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0, imgW, imgH);
        const full = c.toDataURL("image/jpeg", 0.95);
        setCapturedFull(full);

        const overlayW = Math.floor(imgW * overlay.wRatio);
        const overlayH = Math.floor(imgH * overlay.hRatio);
        const overlayX = Math.floor((imgW - overlayW) / 2);
        const overlayY = Math.floor((imgH - overlayH) / 2);

        const cropCanvas = document.createElement("canvas");
        cropCanvas.width = overlayW;
        cropCanvas.height = overlayH;
        const cropCtx = cropCanvas.getContext("2d");
        cropCtx.fillStyle = "#fff";
        cropCtx.fillRect(0, 0, overlayW, overlayH);
        cropCtx.drawImage(c, overlayX, overlayY, overlayW, overlayH, 0, 0, overlayW, overlayH);
        
        const croppedDataUrl = cropCanvas.toDataURL("image/jpeg", 0.92);
        setCapturedCropped(croppedDataUrl);
        displayMessage("Image uploaded and ready for analysis!");
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  // --- HELPER: Convert Base64 DataURI to Blob ---
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  // --- MAIN API FUNCTION ---
  async function analyzeImage() {
    if (!capturedCropped) {
      displayMessage("No image to analyze. Please take a photo or upload one.", true);
      return;
    }
    
    setIsAnalyzing(true);
    displayMessage("Analyzing the leaf... (Connecting to AI)");
    
    try {
      // 1. Convert Base64 image to Blob
      const imageBlob = dataURItoBlob(capturedCropped);

      // 2. Create FormData (Required for FastAPI UploadFile)
      const formData = new FormData();
      formData.append("file", imageBlob, "captured_leaf.jpg");

      // 3. Send Request to FastAPI
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData, // No 'Content-Type' header needed; fetch sets it automatically for FormData
      });

      if (!res.ok) {
        throw new Error(`Server Error: ${res.statusText}`);
      }

      const data = await res.json();
      displayMessage("Analysis complete!");
      
      // 4. Navigate to Result Page with Data
      navigate('/result', { state: { analysisData: data, imagePreview: capturedCropped } });

    } catch (e) {
      console.error("analyzeImage error", e);
      displayMessage("Analysis failed. Is the backend running on port 8000?", true);
    } finally {
      setIsAnalyzing(false);
    }
  }

  function retake() {
    setCapturedCropped(null);
    setCapturedFull(null);
    setMessage("");
    startCamera();
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-lime-50 via-green-100 to-emerald-100 p-4 sm:p-8 overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col h-full">
        <header className="flex items-center justify-center mb-4 relative">
            <h2 className="text-4xl font-extrabold text-green-800 text-center">
                Leafify Plant Scanner
            </h2>
        </header>

        {/* Message Banner */}
        {message && (
          <p
            className={`p-3 text-center font-medium rounded-xl shadow-lg transition mb-4 ${
              message.startsWith("🚨")
                ? "bg-red-100 text-red-800 border border-red-300"
                : "bg-green-100 text-green-800 border border-green-300"
            }`}
          >
            {message}
          </p>
        )}

        {/* Camera / Preview box */}
        <div
          className="relative bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex-grow"
          style={{ minHeight: '200px', maxHeight: "800px" }}
        >
          {!capturedCropped ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="border-8 border-yellow-400 rounded-3xl animate-pulse" 
                  style={{
                    width: `${overlay.wRatio * 100}%`,
                    height: `${overlay.hRatio * 100}%`,
                    boxShadow: "0 0 0 1000px rgba(0,0,0,0.5)",
                  }}
                />
              </div>
              <div className="absolute right-4 top-4 flex gap-3">
                <button
                  onClick={switchCamera}
                  className="bg-green-700/90 hover:bg-green-800 text-white p-3 rounded-full shadow-lg transition transform hover:scale-110"
                  title="Switch Camera"
                >
                  🔄
                </button>
                <button
                  onClick={toggleTorch}
                  className={`p-3 rounded-full shadow-lg transition transform hover:scale-110 ${
                    torchOn ? "bg-yellow-400 text-black" : "bg-gray-400/80 text-white"
                  }`}
                  title="Toggle Flashlight"
                >
                  💡
                </button>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 p-8">
              <img
                src={capturedCropped}
                alt="Captured leaf preview"
                className="max-h-full max-w-full object-contain border-4 border-green-600 rounded-lg shadow-xl"
              />
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls below camera */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          {!capturedCropped ? (
            <>
              <button
                onClick={captureAndCrop}
                disabled={!stream}
                className="col-span-2 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xl uppercase px-4 py-5 rounded-2xl shadow-xl transition transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📸 Take Photo
              </button>

              <label className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold text-lg uppercase px-4 py-4 rounded-xl shadow-md transition transform hover:scale-[1.02] text-center cursor-pointer">
                🖼️ Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={startCamera}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold text-lg uppercase px-4 py-4 rounded-xl shadow-md transition transform hover:scale-[1.02]"
              >
                ▶️ Reset
              </button>
            </>
          ) : (
            <>
              <button
                onClick={analyzeImage}
                disabled={isAnalyzing}
                className="col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xl uppercase px-4 py-5 rounded-2xl shadow-xl transition transform hover:scale-[1.01] disabled:opacity-70 disabled:cursor-wait"
              >
                {isAnalyzing ? "⏳ Analyzing..." : "🔎 Analyze Plant Health"}
              </button>

              <button
                onClick={retake}
                disabled={isAnalyzing}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold text-lg uppercase px-4 py-4 rounded-xl shadow-md transition transform hover:scale-[1.02]"
              >
                ↩️ Retake
              </button>

              <button
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = capturedCropped;
                  a.download = "plant_scan_cropped.jpg";
                  a.click();
                }}
                className="bg-slate-600 hover:bg-slate-700 text-white font-semibold text-lg uppercase px-4 py-4 rounded-xl shadow-md transition transform hover:scale-[1.02]"
              >
                ⬇️ Save
              </button>
            </>
          )}
        </div>

        {/* Info Tip */}
        <div className="mt-4 p-4 bg-green-200 text-green-900 rounded-xl border-l-4 border-green-600 shadow-inner">
          <p className="text-sm font-bold flex items-center gap-2">
            <span className="text-lg">✨</span> Farmer Tip:
          </p>
          <p className="text-sm mt-1">
              Center the most important part of the leaf inside the <span className="font-bold">yellow box</span> before tapping 'Take Photo'. The app will focus on this area.
          </p>
        </div>
      </div>
    </div>
  );
}