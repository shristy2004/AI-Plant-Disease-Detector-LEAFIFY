import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Scanner.jsx - Leaf/Plant Scanner 🌿
 * Updates:
 * - REMOVED Multilingual support.
 * - REMOVED Language selector.
 * - Defaults strictly to English.
 */

export default function Scanner() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null); // used for capture + crop
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState("environment"); // 'user' or 'environment'
  const [capturedCropped, setCapturedCropped] = useState(null); // dataURL cropped to overlay
  const [capturedFull, setCapturedFull] = useState(null); // full-frame dataURL (optional)
  const [message, setMessage] = useState("");
  const [torchOn, setTorchOn] = useState(false);

  // Overlay proportions (relative to video size)
  const overlay = { wRatio: 0.85, hRatio: 0.85, borderRadius: 20 };

  // Utility function to set message and clear it after a delay
  const displayMessage = (text, isError = false) => {
    const msg = isError ? `🚨 ${text}` : `ℹ️ ${text}`;
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000); // Clear message after 5 seconds
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

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

  async function analyzeImage() {
    if (!capturedCropped) {
      displayMessage("No image to analyze. Please take a photo or upload one.", true);
      return;
    }

    displayMessage("Analyzing the leaf...");

    try {
      // Convert Base64 DataURL to Blob
      const blob = await (await fetch(capturedCropped)).blob();

      // Create FormData
      const formData = new FormData();
      formData.append("file", blob, "leaf.jpg");

      // Send to FastAPI
      const res = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server Error ${res.status}: ${errorText}`);
      }

      const data = await res.json();

      console.log("API Response:", data);

      displayMessage("Analysis complete!");

      navigate("/result", {
        state: {
          result: data,
        },
      });

    } catch (e) {
      console.error(e);
      displayMessage("Analysis failed. Check backend or network connection.", true);
    }
  }

  function retake() {
    setCapturedCropped(null);
    setCapturedFull(null);
    setMessage("");
    startCamera();
  }

  return (
    // FULL PAGE MODE: h-screen w-full and flex-col for non-scrolling layout
    <div className="h-screen w-full bg-gradient-to-br from-lime-50 via-green-100 to-emerald-100 p-4 sm:p-8 overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col h-full">
        <header className="flex items-center justify-center mb-4 relative">
          {/* Title - Hardcoded English */}
          <h2 className="text-4xl font-extrabold text-green-800 text-center">
            Leafify Plant Scanner
          </h2>
          {/* No Language Selector here anymore */}
        </header>

        {/* Message Banner */}
        {message && (
          <p
            className={`p-3 text-center font-medium rounded-xl shadow-lg transition mb-4 ${message.startsWith("🚨")
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
          {/* Video or preview image */}
          {!capturedCropped ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Overlay guide: styled centered rectangle */}
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
              {/* Top Right controls (switch and torch) */}
              <div className="absolute right-4 top-4 flex gap-3">
                <button
                  onClick={switchCamera}
                  className="bg-green-700/90 hover:bg-green-800 text-white p-3 rounded-full shadow-lg transition transform hover:scale-110"
                  title="Switch Camera (Front/Back)"
                >
                  🔄
                </button>
                <button
                  onClick={toggleTorch}
                  className={`p-3 rounded-full shadow-lg transition transform hover:scale-110 ${torchOn ? "bg-yellow-400 text-black" : "bg-gray-400/80 text-white"
                    }`}
                  title="Toggle Flashlight"
                >
                  💡
                </button>
              </div>
            </>
          ) : (
            // Show cropped preview
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
              {/* Take Photo - Primary Action */}
              <button
                onClick={captureAndCrop}
                disabled={!stream}
                className="col-span-2 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xl uppercase px-4 py-5 rounded-2xl shadow-xl transition transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📸 Take Photo (Capture Plant)
              </button>

              {/* Upload Image - Secondary Action */}
              <label className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold text-lg uppercase px-4 py-4 rounded-xl shadow-md transition transform hover:scale-[1.02] text-center cursor-pointer">
                🖼️ Upload from Gallery
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>

              {/* Restart Camera - Utility Action */}
              <button
                onClick={startCamera}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold text-lg uppercase px-4 py-4 rounded-xl shadow-md transition transform hover:scale-[1.02]"
              >
                ▶️ Start/Reset Camera
              </button>
            </>
          ) : (
            <>
              {/* Analyze - Primary Action */}
              <button
                onClick={analyzeImage}
                className="col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xl uppercase px-4 py-5 rounded-2xl shadow-xl transition transform hover:scale-[1.01]"
              >
                🔎 Analyze Plant Health
              </button>

              {/* Retake - Secondary Action */}
              <button
                onClick={retake}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold text-lg uppercase px-4 py-4 rounded-xl shadow-md transition transform hover:scale-[1.02]"
              >
                ↩️ Retake Photo
              </button>

              {/* Download - Utility Action */}
              <button
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = capturedCropped;
                  a.download = "plant_scan_cropped.jpg";
                  a.click();
                }}
                className="bg-slate-600 hover:bg-slate-700 text-white font-semibold text-lg uppercase px-4 py-4 rounded-xl shadow-md transition transform hover:scale-[1.02]"
              >
                ⬇️ Save Image
              </button>
            </>
          )}
        </div>

        {/* Info Tip - Hardcoded English */}
        <div className="mt-4 p-4 bg-green-200 text-green-900 rounded-xl border-l-4 border-green-600 shadow-inner">
          <p className="text-sm font-bold flex items-center gap-2">
            <span className="text-lg">✨</span> Farmer Tip:
          </p>
          <p className="text-sm mt-1">
            Center the most important part of the leaf/plant (the area with the problem) inside the <span className="font-bold">yellow box</span> before tapping <span className="font-bold">'Take Photo'</span>. The app will automatically focus on this area for the best analysis.
          </p>
        </div>
      </div>
    </div>
  );
}