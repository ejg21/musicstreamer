import React, { useEffect, useState } from "react";

const NewFeaturesPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const FEATURE_VERSION = "v1.2";
    const hasSeenPopup = localStorage.getItem("seenNewFeatures") === FEATURE_VERSION;
    if (!hasSeenPopup) {
      setShowPopup(true);
    }
  }, []);

  const handleClose = () => {
    const FEATURE_VERSION = "v1.2";
    localStorage.setItem("seenNewFeatures", FEATURE_VERSION);
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-lg shadow-xl w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold">What's New (v1.2)</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Recreated new search API to fix searches since the other one went down.</li>
        </ul>
        <button
          onClick={handleClose}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

export default NewFeaturesPopup;
