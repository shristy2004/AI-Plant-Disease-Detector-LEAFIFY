import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Leaf, Activity, Shield, XCircle } from 'lucide-react';

/**
 * AnalysisResult.jsx
 * Connected to Router State from Scanner.jsx
 */

const getConfidenceColor = (percent) => {
    if (percent >= 80) return { bar: "bg-green-500", text: "text-green-600", emoji: "✅ High Accuracy" };
    if (percent >= 50) return { bar: "bg-yellow-500", text: "text-yellow-600", emoji: "⚠️ Moderate Accuracy" };
    return { bar: "bg-red-500", text: "text-red-600", emoji: "🚨 Low Accuracy (Uncertain)" };
};

export default function AnalysisResult() {
    const location = useLocation();
    const navigate = useNavigate();

    // 1. Retrieve Data from Router State
    const { analysisData, imagePreview } = location.state || {};

    // 2. Handle Case where user visits page directly without scanning
    useEffect(() => {
        if (!analysisData) {
            navigate('/scanner');
        }
    }, [analysisData, navigate]);

    if (!analysisData) return null;

    // 3. Extract & Parse Data
    const label = analysisData.prediction || "Unknown";
    
    // Parse "98.50%" string to number 98.5
    const confidenceString = analysisData.confidence || "0%";
    const confidenceVal = parseFloat(confidenceString.replace('%', ''));
    
    const treatments = analysisData.treatment || [];
    
    // Determine Color Scheme based on Confidence
    const status = getConfidenceColor(confidenceVal);

    // Helper for "Healthy" labels vs Disease labels
    const isHealthy = label.toLowerCase().includes("healthy");
    const headerColor = isHealthy ? "text-green-700" : "text-red-700";
    const borderColor = isHealthy ? "border-green-600" : "border-red-600";

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-lime-50 via-green-100 to-emerald-100 p-4 sm:p-8">
            <div className="max-w-3xl mx-auto flex flex-col space-y-6">
                
                {/* Header and Back Button */}
                <header className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => navigate('/scanner')}
                        className="bg-white/90 text-green-800 p-3 rounded-full shadow-lg transition transform hover:scale-105 border border-green-200"
                        title="Back to Scanner"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-3xl font-extrabold text-green-800 text-center flex-grow -ml-10">
                        Leafify Analysis
                    </h2>
                    <div className="w-10"></div>
                </header>

                {/* Main Diagnosis Card */}
                <div className={`bg-white rounded-3xl p-6 shadow-2xl border-t-8 ${borderColor}`}>
                    
                    {/* Image Preview */}
                    {imagePreview && (
                        <div className="mb-6 flex justify-center">
                            <img 
                                src={imagePreview} 
                                alt="Scanned Leaf" 
                                className="h-48 w-48 object-cover rounded-xl border-4 border-gray-100 shadow-inner"
                            />
                        </div>
                    )}

                    <div className="flex items-center justify-center space-x-3 mb-6 text-center">
                        <Leaf size={32} className={isHealthy ? "text-green-600" : "text-red-500"} />
                        <div>
                            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Diagnosis Result</p>
                            <h3 className={`text-3xl font-black ${headerColor} leading-tight`}>
                                {label.replace(/_/g, " ")} {/* Clean up underscores */}
                            </h3>
                        </div>
                    </div>

                    {/* AI Confidence Meter */}
                    <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold text-lg text-slate-700 flex items-center gap-2">
                                <Activity size={20} className={status.text} />
                                AI Confidence: <span className={status.text}>{status.emoji}</span>
                            </p>
                            <p className="font-bold text-2xl text-slate-900">{confidenceVal.toFixed(1)}%</p>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                            <div 
                                className={`h-4 rounded-full transition-all duration-1000 ease-out ${status.bar}`} 
                                style={{ width: `${confidenceVal}%` }}
                            ></div>
                        </div>
                        <p className="mt-2 text-xs text-gray-500 text-center">
                            The AI is {confidenceVal}% sure about this result.
                        </p>
                    </div>
                </div>

                {/* Action Plan / Remedies Card */}
                <div className="bg-white rounded-3xl p-6 shadow-2xl border-t-4 border-indigo-600 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Shield size={100} className="text-indigo-600" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-indigo-800 flex items-center gap-3 mb-6 z-10 relative">
                        <Shield size={28} /> 
                        {isHealthy ? "Maintenance Tips" : "Recommended Treatments"}
                    </h3>

                    {treatments.length > 0 ? (
                        <ol className="space-y-4 z-10 relative">
                            {treatments.map((rec, index) => (
                                <li key={index} className="flex items-start gap-3 bg-indigo-50/50 p-3 rounded-lg">
                                    <div className="mt-1 min-w-[20px]">
                                        <CheckCircle size={20} className="text-indigo-600" />
                                    </div>
                                    <span className="text-lg text-slate-700 font-medium leading-relaxed">
                                        {rec}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3">
                            <XCircle size={20} className="text-gray-400" />
                            <p className="text-sm text-slate-600">No specific medical advice available for this category.</p>
                        </div>
                    )}
                </div>

                {/* Follow-up CTA */}
                <button
                    onClick={() => navigate('/scanner')}
                    className="w-full bg-lime-600 hover:bg-lime-700 text-white font-extrabold text-xl uppercase px-4 py-5 rounded-2xl shadow-xl transition transform hover:scale-[1.01] active:scale-95"
                >
                    Scan Another Plant
                </button>

            </div>
        </div>
    );
}