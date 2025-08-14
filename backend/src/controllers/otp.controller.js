// src/controllers/otp.controller.js
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import crypto from "crypto";
import { Step1Schema } from "../validators/validate.js";

const prisma = new PrismaClient();
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// ----------------- SEND OTP -----------------
export const sendOtp = async (req, res) => {
  try {
    const { aadhaarNo, ownerName } = req.body;

    Step1Schema.parse({ aadhaarNo, ownerName });

    const aadhaarHash = crypto.createHash("sha256").update(aadhaarNo).digest("hex");
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.otp.create({
      data: { aadhaarKey: aadhaarHash, code: otp, expiresAt }
    });

    res.json({ message: "OTP sent successfully", otp });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.errors || err.message });
  }
};

// ----------------- CHECK OTP -----------------
export const checkOtp = async (req, res) => {
  try {
    const { aadhaarNo, otp } = req.body;

    if (!aadhaarNo || !otp) {
      return res.status(400).json({ error: "Aadhaar and OTP are required" });
    }

    const aadhaarHash = crypto.createHash("sha256").update(aadhaarNo).digest("hex");

    const otpRecord = await prisma.otp.findFirst({
      where: { aadhaarKey: aadhaarHash },
      orderBy: { createdAt: "desc" }
    });

    if (!otpRecord) return res.status(400).json({ error: "No OTP found" });
    if (otpRecord.code !== otp) return res.status(400).json({ error: "Invalid OTP" });
    if (new Date() > otpRecord.expiresAt) return res.status(400).json({ error: "OTP expired" });

    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: { verifiedAt: new Date() }
    });

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.errors || err.message });
  }
};
