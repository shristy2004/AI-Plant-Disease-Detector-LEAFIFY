import React from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import { motion } from "framer-motion";
import { Camera, Leaf, Cpu, CheckCircle, Users, ShieldCheck, Zap, Star, Scan, MessageSquare, Repeat } from "lucide-react";

/**
 * 🌿 Leafify Landing Page Component 🌿
 * Updates:
 * - Connected "Start Scanning" buttons to React Router.
 */

export default function Landing({ variant = "split" }) {
    const navigate = useNavigate(); // 2. Initialize Hook

    // 3. Define the navigation handler
    const handleGetStarted = () => {
        navigate("/scanner");
    };

    // We render the full page structure regardless of the hero variant chosen.
    // We pass our new handleGetStarted function down to the children.
    return (
        <LandingPage onGetStarted={handleGetStarted} heroVariant={variant} />
    );
}

function LandingPage({ onGetStarted, heroVariant }) {
    let HeroComponent;
    if (heroVariant === "center") HeroComponent = CenteredHero;
    else if (heroVariant === "feature") HeroComponent = FeatureHero;
    else HeroComponent = SplitHero; // Default

    return (
        <>
            {/* 1. Main Hero Section */}
            <HeroComponent onGetStarted={onGetStarted} />

            {/* 2. Page Content Sections */}
            <HowItWorksSection onGetStarted={onGetStarted} />
            <TestimonialSection />
            <FinalCtaSection onGetStarted={onGetStarted} />

            {/* Optional: Simple Footer */}
            <footer className="bg-gray-800 text-center text-sm text-gray-400 p-6">
                &copy; {new Date().getFullYear()} Leafify. Built for a healthier harvest.
            </footer>
        </>
    );
}

/* ---------- Animation variants (Shared) ---------- */
const container = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
};

const fadeUp = {
    hidden: { y: 15, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const float = {
    hover: { y: -6, scale: 1.01, transition: { type: "spring", stiffness: 300 } },
    tap: { scale: 0.99 },
};

const rotate = {
    animate: { rotate: 360, transition: { duration: 4, repeat: Infinity, ease: "linear" } },
};

/* ---------------------------------------------------------------------- */
/* ---------- 1. Hero Variants (Existing) ---------- */
/* ---------------------------------------------------------------------- */

function SplitHero({ onGetStarted }) {
    return (
        <section className="min-h-screen flex items-center bg-gradient-to-br from-lime-50 via-green-100 to-emerald-100 relative overflow-hidden">
            {/* Animated background particles for depth */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute top-10 left-10 w-40 h-40 bg-lime-300 rounded-full opacity-10 blur-2xl"
                    animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-20 right-20 w-32 h-32 bg-emerald-400 rounded-full opacity-10 blur-2xl"
                    animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
                    transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            <div className="max-w-7xl mx-auto w-full px-6 py-24 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Copy & CTA */}
                    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                        <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl font-extrabold leading-tight text-slate-900">
                            <span className="text-lime-600">Leafify</span> — Instant Crop Health from Your Pocket
                        </motion.h1>

                        <motion.p variants={fadeUp} className="text-xl text-slate-700 max-w-xl">
                            Snap a photo of any leaf to get an accurate diagnosis, severity score, and simple, step-by-step remedies tailored to your crop.
                        </motion.p>

                        <motion.div variants={fadeUp} className="flex flex-wrap gap-4 items-center pt-4">
                            <motion.button
                                whileHover={{ scale: 1.03, boxShadow: "0 15px 30px rgba(16,185,129,0.4)" }}
                                whileTap={{ scale: 0.97 }}
                                onClick={onGetStarted}
                                className="inline-flex items-center gap-3 bg-green-600 text-white text-lg font-semibold px-7 py-4 rounded-xl shadow-xl hover:bg-green-700 transition focus:outline-none focus:ring-4 focus:ring-green-300"
                            >
                                <Camera size={20} /> Start Scanning Now
                            </motion.button>

                            <motion.a
                                variants={fadeUp}
                                href="#how"
                                className="px-6 py-4 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-white transition"
                            >
                                How it works
                            </motion.a>
                        </motion.div>

                        {/* Feature pills */}
                        <motion.div variants={fadeUp} className="pt-10"> 
                            <h3 className="text-sm font-bold uppercase text-slate-500 mb-4">Core Features</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg"> 
                                <FeaturePill icon={<Leaf size={18} />} title="Plant-Aware AI" desc="Regional crop models for accuracy" />
                                <FeaturePill icon={<Cpu size={18} />} title="Lightning Fast" desc="Results in under 3 seconds" />
                                <FeaturePill icon={<ShieldCheck size={18} />} title="Data Private" desc="Photos stay on your device" />
                                <FeaturePill icon={<Users size={18} />} title="Field-Tested" desc="Trusted by 3,000+ farmers" />
                            </div>
                        </motion.div>

                    </motion.div>

                    {/* Right: Device mock (floating card) */}
                    <div className="flex items-center justify-center lg:justify-end">
                        <motion.div
                            initial={{ y: 50, opacity: 0, rotateZ: 3 }}
                            animate={{ y: 0, opacity: 1, rotateZ: 0 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                            whileHover={{ y: -12, boxShadow: "0 40px 60px rgba(16,185,129,0.2)" }}
                            className="relative w-80 sm:w-96 rounded-3xl p-6 bg-gradient-to-br from-green-600 to-lime-500 text-white shadow-2xl"
                        >
                            {/* Animated icon (ZAP) */}
                            <motion.div className="absolute top-4 right-4" {...rotate}>
                                <Zap size={28} className="text-yellow-300 drop-shadow-lg" />
                            </motion.div>

                            {/* Placeholder for Scanner Screen */}
                            <motion.div 
                                className="rounded-2xl h-64 flex flex-col justify-end p-5 shadow-inner" 
                                {...float}
                                style={{ 
                                    backgroundImage: 'url(https://via.placeholder.com/400x300/10b981/ffffff?text=Leafify+Scan+UI)', 
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                <div className="flex items-center justify-between backdrop-blur-sm bg-black/40 p-3 rounded-xl border border-white/20">
                                    <div>
                                        <div className="text-base font-semibold">Tomato — Early Blight</div>
                                        <div className="text-xs opacity-90">Severity: <span className="font-bold text-yellow-300">37%</span> · Curable</div>
                                    </div>

                                    <div className="bg-white/30 rounded-full p-2">
                                        <Camera size={20} />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Recommendations card */}
                            <motion.div
                                initial={{ y: 15, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mt-4 bg-white rounded-xl p-4 text-slate-700 shadow-md border border-slate-100"
                            >
                                <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                    <CheckCircle size={16} className="text-green-500 fill-current" />
                                    Action Plan (High Priority)
                                </div>
                                <ul className="mt-2 text-sm list-inside space-y-1 pl-3 text-slate-600">
                                    <li className="list-disc">Isolate and remove affected leaves.</li>
                                    <li className="list-disc">Apply organic copper fungicide (local variant).</li>
                                    <li className="list-disc">Improve air circulation and spacing.</li>
                                </ul>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function CenteredHero({ onGetStarted }) {
    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lime-50 via-green-100 to-emerald-100 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute top-20 left-20 w-40 h-40 bg-lime-300 rounded-full opacity-15 blur-2xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute bottom-20 right-20 w-32 h-32 bg-emerald-400 rounded-full opacity-10 blur-2xl"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                transition={{ duration: 0.6 }} 
                className="max-w-3xl text-center px-6 py-16 relative z-10 bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border border-white/80"
            >
                <motion.h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight" whileHover={{ scale: 1.02 }}>
                    <span className="text-lime-600">Leafify</span> — Crop Health, <span className="text-green-600">Simplified</span>.
                </motion.h1>
                <p className="mt-4 text-lg text-slate-700 max-w-2xl mx-auto">Upload or scan a leaf and get **accurate diagnosis**, severity score, and easy-to-follow remedies in seconds.</p>

                <div className="mt-10 flex justify-center gap-4">
                    <motion.button 
                        onClick={onGetStarted} 
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-7 py-3 rounded-xl shadow-lg hover:bg-green-700 font-semibold" 
                        whileHover={{ scale: 1.05 }}
                    >
                        <Camera size={18} /> Start Scanning
                    </motion.button>
                    <motion.a 
                        href="#learn" 
                        className="px-7 py-3 rounded-xl text-slate-700 font-semibold flex items-center gap-2 border border-slate-300 hover:bg-white transition" 
                        whileHover={{ scale: 1.05 }}
                    >
                        Learn more
                    </motion.a>
                </div>

                <div className="mt-12 grid grid-cols-3 gap-6 border-t border-slate-200 pt-6">
                    <Stat number="95%+" label="Field Accuracy" />
                    <Stat number="<3s" label="Response Time" />
                    <Stat number="3k+" label="Active Farmers" />
                </div>

                <motion.div className="mt-8 flex justify-center items-center gap-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    {[...Array(5)].map((_, i) => (
                        <motion.div key={i} whileHover={{ scale: 1.2 }}>
                            <Star size={20} className="text-yellow-400 fill-current" />
                        </motion.div>
                    ))}
                    <span className="ml-3 text-sm font-medium text-slate-600">Rated 4.9/5 by users</span>
                </motion.div>
            </motion.div>
        </section>
    );
}

function FeatureHero({ onGetStarted }) {
    return (
        <section className="py-24 bg-gradient-to-r from-white via-lime-50 to-emerald-50 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute top-10 right-10 w-24 h-24 bg-lime-300 rounded-full opacity-15 blur-lg"
                    animate={{ y: [0, 25, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center">
                    <motion.div className="text-base font-bold tracking-wider text-lime-600 uppercase" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                        Built for Farmers, Powered by AI
                    </motion.div>
                    <motion.h2 className="text-4xl font-extrabold text-slate-900 mt-3 leading-tight" whileHover={{ scale: 1.01 }}>
                        Leafify Tools That Make Decisions Simple & Fast
                    </motion.h2>
                    <p className="mt-4 text-lg text-slate-700 max-w-2xl mx-auto">From instant diagnosis to safe, localized remedies and follow-up tracking — Leafify helps every step of the way.</p>
                </div>

                <div className="mt-16 grid md:grid-cols-3 gap-8">
                    <FeatureCard icon={<Leaf size={28} className="text-green-600" />} title="Accurate Disease ID" desc="Detect fungal, bacterial diseases, and nutritional deficiencies with high precision." />
                    <FeatureCard icon={<CheckCircle size={28} className="text-indigo-600" />} title="Severity Score" desc="Instantly see how serious the problem is to prioritize treatment and minimize loss." />
                    <FeatureCard icon={<ShieldCheck size={28} className="text-amber-600" />} title="Safe & Local Remedies" desc="Get verified, step-by-step guidance, preferring sustainable and local remedies." />
                </div>

                <div className="mt-16 text-center">
                    <motion.button 
                        onClick={onGetStarted} 
                        className="px-8 py-4 rounded-xl bg-green-600 text-white font-semibold text-lg shadow-xl hover:bg-green-700 transition focus:ring-4 focus:ring-green-300" 
                        whileHover={{ scale: 1.05 }}
                    >
                        Try Live Demo
                    </motion.button>
                </div>

                <motion.div className="mt-10 text-center" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}>
                    <div className="bg-green-200 rounded-full h-3 mx-auto max-w-sm">
                        <motion.div className="bg-green-600 h-3 rounded-full" initial={{ width: 0 }} animate={{ width: "95%" }} transition={{ duration: 1.5, delay: 1 }} />
                    </div>
                    <p className="mt-2 text-sm text-slate-600 font-medium">Over 95% detection accuracy confirmed in Leafify field trials.</p>
                </motion.div>
            </div>
        </section>
    );
}

/* ---------------------------------------------------------------------- */
/* ---------- 2. New Sections (Content) ---------- */
/* ---------------------------------------------------------------------- */

function HowItWorksSection({ onGetStarted }) {
    const steps = [
        { icon: Scan, title: "1. Scan the Leaf", desc: "Use your phone's camera (or upload a photo) and center the troubled area in the yellow box." },
        { icon: Cpu, title: "2. Instant Diagnosis", desc: "Our regional AI model processes the image in seconds to identify the disease or deficiency." },
        { icon: CheckCircle, title: "3. Apply Remedy", desc: "Receive a simple, step-by-step action plan with localized, safe solutions." },
    ];

    return (
        <section id="how" className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6 text-center">
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={container}>
                    <motion.div variants={fadeUp} className="text-base font-bold tracking-wider text-lime-600 uppercase">
                        Harvest More, Worry Less
                    </motion.div>
                    <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-slate-900 mt-3 leading-tight">
                        How Leafify Delivers Rapid Health Reports
                    </motion.h2>
                </motion.div>

                <div className="mt-16 grid md:grid-cols-3 gap-10">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            whileHover={{ y: -8, boxShadow: "0 20px 30px rgba(16,185,129,0.15)" }}
                            className="text-center p-6 bg-green-50 rounded-2xl border border-green-200 shadow-lg cursor-pointer"
                        >
                            <div className="inline-flex p-4 bg-white rounded-full text-green-600 mb-4 shadow-xl">
                                <step.icon size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                            <p className="mt-3 text-slate-700">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.button
                    onClick={onGetStarted}
                    className="mt-16 px-8 py-3 rounded-xl bg-lime-600 text-white font-semibold text-lg shadow-lg hover:bg-lime-700 transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Start Your First Scan
                </motion.button>
            </div>
        </section>
    );
}

function TestimonialSection() {
    const testimonial = {
        quote: "Leafify saved my tomato crop this season. I got an accurate diagnosis within seconds, which is faster than waiting days for a technician. Simple, fast, and essential.",
        name: "Aisha M.",
        title: "Small-scale Farmer, Kenya",
    };

    return (
        <section className="py-24 bg-gradient-to-tr from-green-500 to-emerald-600 text-white">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={container}>
                    <motion.div variants={fadeUp} className="flex justify-center mb-6 gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={24} className="text-yellow-300 fill-current" />
                        ))}
                    </motion.div>
                    
                    <motion.blockquote 
                        variants={fadeUp} 
                        className="text-3xl italic font-light leading-snug mb-8"
                        whileHover={{ scale: 1.01 }}
                    >
                        &ldquo;{testimonial.quote}&rdquo;
                    </motion.blockquote>

                    <motion.p variants={fadeUp} className="text-lg font-semibold text-white">
                        {testimonial.name}
                    </motion.p>
                    <motion.p variants={fadeUp} className="text-sm text-gray-200">
                        {testimonial.title}
                    </motion.p>
                </motion.div>
                
                <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/30 pt-8">
                    <Stat number="95%+" label="Accuracy" color="text-white" />
                    <Stat number="3k+" label="Trusted Farmers" color="text-white" />
                    <Stat number="50+" label="Crop Types" color="text-white" />
                </div>
            </div>
        </section>
    );
}

function FinalCtaSection({ onGetStarted }) {
    return (
        <section className="py-20 bg-green-900">
            <div className="max-w-5xl mx-auto px-6 text-center">
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={container}>
                    <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-white leading-tight">
                        Ready to Protect Your Harvest?
                    </motion.h2>
                    <motion.p variants={fadeUp} className="mt-3 text-xl text-gray-200">
                        Get started instantly, no sign-up required.
                    </motion.p>
                    <motion.button
                        variants={fadeUp}
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(255, 255, 255, 0.2)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onGetStarted}
                        className="mt-8 inline-flex items-center gap-3 bg-white text-green-800 text-xl font-bold px-10 py-4 rounded-xl shadow-2xl hover:bg-gray-100 transition"
                    >
                        <Repeat size={24} /> Start Scanning Today
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}

/* ---------------------------------------------------------------------- */
/* ---------- Helper Components ---------- */
/* ---------------------------------------------------------------------- */

function FeaturePill({ icon, title, desc }) {
    return (
        <motion.div 
            className="flex items-start gap-3 bg-white/80 border border-slate-200 rounded-xl p-4 shadow-sm backdrop-blur-sm" 
            whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}
        >
            <div className="text-green-600 p-1 rounded-full bg-green-100">{icon}</div>
            <div>
                <div className="text-sm font-bold text-slate-900">{title}</div>
                <div className="text-xs text-slate-500">{desc}</div>
            </div>
        </motion.div>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <motion.div 
            whileHover={{ y: -8, boxShadow: "0 20px 30px rgba(0,0,0,0.08)" }} 
            className="p-8 bg-white rounded-3xl shadow-lg border border-slate-100 transition duration-300"
        >
            <div className="flex flex-col items-start gap-3">
                <motion.div className="p-4 bg-green-50 rounded-xl" whileHover={{ rotate: 5, scale: 1.1 }}>
                    {icon}
                </motion.div>
                <div className="pt-2">
                    <div className="text-xl font-bold text-slate-900">{title}</div>
                    <div className="text-base text-slate-600 mt-2">{desc}</div>
                </div>
            </div>
        </motion.div>
    );
}

function Stat({ number, label, color = "text-green-700" }) {
    return (
        <motion.div className="text-center" whileHover={{ scale: 1.1, textShadow: "0 0 8px rgba(0,0,0,0.05)" }}>
            <div className={`text-3xl font-extrabold ${color}`}>{number}</div>
            {/* Fixed: Changed text-gray-200 to text-slate-500 so it is visible on white backgrounds.
               The TestimonialSection passes color="text-white" to override this.
            */}
            <div className={`text-sm mt-1 ${color === "text-white" ? "text-gray-200" : "text-slate-500"}`}>{label}</div>
        </motion.div>
    );
}