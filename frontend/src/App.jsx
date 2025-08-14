import React, { useState } from "react";
import schema from "./schema/udyam_final_schema_clean.json";
import DynamicForm from "./components/DynamicForm";
import ProgressBar from "./components/ProgressBar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import api from "./api";

export default function App() {
  const [step, setStep] = useState(1);
  const [collected, setCollected] = useState({});

  // Step 1 submit
  const handleStep1 = async (data) => {
    try {
      const res = await api.post("/otp/send", {
        aadhaarNo: data.aadhaarNo,
        ownerName: data.ownerName,
        consent: data.consent,
      });
      console.log("OTP Send Response:", res.data);
      setCollected((prev) => ({ ...prev, ...data }));
      setStep(2);
    } catch (err) {
      console.error("Step 1 Error:", err.response?.data || err.message);
      alert("Failed to send OTP");
    }
  };

  // Step 2 submit
  const handleStep2 = async (data) => {
    try {
      const finalData = { ...collected, ...data };
      const res = await api.post("/applications/submit", finalData);
      console.log("Application Submit Response:", res.data);
      alert("Application submitted successfully!");
    } catch (err) {
      console.error("Step 2 Error:", err.response?.data || err.message);
      alert("Failed to submit application");
    }
  };

  // Step 1 fields (only Aadhaar, Name, Consent)
  const step1Fields = [
    { ...schema.step1[0], name: "aadhaarNo", label: "Aadhaar Number", required: true, maxlength: 12, pattern: "^[0-9]{12}$" },
    { ...schema.step1[1], name: "ownerName", label: "Owner Name", required: true },
    { ...schema.step1[2], name: "consent", type: "checkbox", label: schema.step1[2].label || "I consent", required: true }
  ];

  const step2Fields = schema.step2.map(f => {
  if (f.label?.toLowerCase().includes("gst")) {
    return {
      ...f,
      name: "gstNumber", // match backend
      required: true,
      pattern: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$",
      label: "GST Number"
    };
  }
  // map other field names here if backend expects different keys
  return f;
});

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 pt-24 px-4 flex justify-center">
        <div className="w-full max-w-5xl pb-16">
          {/* Page Heading */}
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            UDYAM REGISTRATION FORM
          </h1>
          <p className="text-lg text-center text-gray-600 mb-8">
            For New Enterprise who are not Registered yet as MSME
          </p>

          {/* Aadhaar Verification Card */}
          <div className="bg-white max-w-5xl w-full rounded shadow border">
            <div className="bg-blue-600 text-white px-6 py-3 rounded-t text-lg font-semibold">
              Aadhaar Verification With OTP
            </div>
            <div className="p-6">
              <ProgressBar step={step} />

              {step === 1 && (
                <DynamicForm
                  fields={step1Fields}
                  onSubmit={handleStep1}
                  defaultValues={collected}
                  layout="two-column-step1"
                  submitLabel="Validate & Generate OTP"
                  extraContent={
                    <ul className="list-disc pl-5 mt-4 text-sm text-gray-700 space-y-1">
                      <li>Aadhaar number shall be required for Udyam Registration.</li>
                      <li>
                        The Aadhaar number shall be of the proprietor in the case of a
                        proprietorship firm, of the managing partner in the case of a
                        partnership firm and of a karta in the case of a Hindu
                        Undivided Family (HUF).
                      </li>
                      <li>
                        In case of a Company or a Limited Liability Partnership or a
                        Cooperative Society or a Society or a Trust, the organisation
                        or its authorised signatory shall provide its GSTIN and PAN
                        along with its Aadhaar number.
                      </li>
                    </ul>
                  }
                />
              )}

              {step === 2 && (
                <DynamicForm
                  fields={step2Fields}
                  onSubmit={handleStep2}
                  onBack={() => setStep(1)}
                  submitLabel="Submit"
                  defaultValues={collected}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
