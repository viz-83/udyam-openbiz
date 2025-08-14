import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { Step2Schema } from "../validators/validate.js";
import { aadhaarKey, normalizeAadhaar } from "../services/aadhaar.util.js";

const prisma = new PrismaClient();

// POST /api/applications/submit
export async function submitStep2(req, res, next) {
  try {
    // Expect aadhaarNo (again) to identify the record + all step2 fields
    const aadhaarNo = normalizeAadhaar(req.body.aadhaarNo);
    if (!aadhaarNo) return res.status(400).json({ error: "aadhaarNo is required" });

    // Validate Step 2 against scraped rules
    const data = Step2Schema.parse({
      pan: req.body.pan,
      enterpriseName: req.body.enterpriseName,
      orgType: req.body.orgType,
      incorpDate: req.body.incorpDate,
      hasGstin: req.body.hasGstin,
      gstin: req.body.gstin,
      socialCategory: req.body.socialCategory,
      physicallyDisabled: req.body.physicallyDisabled,
      authorisedName: req.body.authorisedName,
      mobile: req.body.mobile,
      email: req.body.email,
      nic2Digit: req.body.nic2Digit,
      majorActivity: req.body.majorActivity
    });

    const key = aadhaarKey(aadhaarNo);
    const existing = await prisma.udyamApplication.findFirst({ where: { aadhaarKey: key } });
    if (!existing) return res.status(404).json({ error: "Application not found" });
    if (!existing.otpVerified) return res.status(400).json({ error: "OTP is not verified" });

    const updated = await prisma.udyamApplication.update({
      where: { id: existing.id },
      data: {
        pan: data.pan,
        enterpriseName: data.enterpriseName,
        orgType: data.orgType,
        incorpDate: new Date(data.incorpDate),
        hasGstin: data.hasGstin,
        gstin: data.hasGstin ? data.gstin : null,
        socialCategory: data.socialCategory,
        physicallyDisabled: data.physicallyDisabled,
        authorisedName: data.authorisedName,
        mobile: data.mobile,
        email: data.email,
        nic2Digit: data.nic2Digit,
        majorActivity: data.majorActivity,
        submittedAt: new Date()
      }
    });

    res.json({ ok: true, message: "Application submitted", id: updated.id });
  } catch (e) {
    if (e?.issues) return res.status(400).json({ error: e.issues });
    next(e);
  }
}
