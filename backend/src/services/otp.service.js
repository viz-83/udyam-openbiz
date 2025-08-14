import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createOtp(aadhaarKey) {
  const code = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
  const otp = await prisma.otp.create({
    data: { aadhaarKey, code, expiresAt }
  });
  return otp;
}

export async function verifyOtp(aadhaarKey, code) {
  // Get latest unexpired OTP
  const now = new Date();
  const record = await prisma.otp.findFirst({
    where: { aadhaarKey, expiresAt: { gt: now }, verifiedAt: null },
    orderBy: { createdAt: "desc" }
  });

  if (!record) return { ok: false, reason: "OTP expired or not found" };

  const attempts = record.attempts + 1;
  if (attempts > 5) return { ok: false, reason: "Too many attempts" };

  if (record.code !== code) {
    await prisma.otp.update({ where: { id: record.id }, data: { attempts } });
    return { ok: false, reason: "Invalid OTP" };
  }

  await prisma.otp.update({ where: { id: record.id }, data: { verifiedAt: new Date() } });
  return { ok: true };
}
