/**
 * Lexis Premium — Form Validation Schemas
 * 
 * Menggunakan validasi manual yang setara dengan Zod API.
 * Saat Zod tersedia (npm install zod), ganti fungsi ini dengan:
 *   import { z } from 'zod';
 *   export const loginSchema = z.object({ ... });
 * 
 * Setiap validator mengembalikan:
 *   { success: true, data } atau { success: false, errors: { [field]: string } }
 */

// ===================== HELPERS =====================
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_PHONE = /^(\+62|62|0)[0-9]{8,13}$/;
const REGEX_NIK   = /^[0-9]{16}$/;
const REGEX_PASSWORD_STRONG = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

/**
 * Sanitize: hapus karakter HTML berbahaya untuk mencegah XSS dasar
 */
export function sanitize(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ===================== LOGIN =====================
/**
 * @param {{ email: string, password: string }} data
 * @returns {{ success: boolean, errors?: object, data?: object }}
 */
export function validateLogin(data) {
  const errors = {};
  
  // Email
  if (!data.email || data.email.trim().length === 0) {
    errors.email = "Email tidak boleh kosong.";
  } else if (!REGEX_EMAIL.test(data.email.trim())) {
    errors.email = "Format email tidak valid (contoh: nama@domain.com).";
  }
  
  // Password
  if (!data.password || data.password.length === 0) {
    errors.password = "Kata sandi tidak boleh kosong.";
  } else if (data.password.length < 8) {
    errors.password = "Kata sandi minimal 8 karakter.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }
  
  return {
    success: true,
    data: {
      email: sanitize(data.email.trim().toLowerCase()),
      password: data.password, // jangan sanitize password
    },
  };
}

// ===================== REGISTER (CLIENT) =====================
/**
 * @param {object} data - form data dari RegisterDetailsPage
 * @returns {{ success: boolean, errors?: object, data?: object }}
 */
export function validateRegisterClient(data) {
  const errors = {};
  
  // Nama Lengkap
  if (!data.name || data.name.trim().length < 3) {
    errors.name = "Nama lengkap minimal 3 karakter.";
  } else if (data.name.trim().length > 100) {
    errors.name = "Nama terlalu panjang (maks. 100 karakter).";
  }

  // Email
  if (!data.email || !REGEX_EMAIL.test(data.email.trim())) {
    errors.email = "Masukkan alamat email yang valid.";
  }

  // Password
  if (!data.password || data.password.length < 8) {
    errors.password = "Kata sandi minimal 8 karakter.";
  } else if (!REGEX_PASSWORD_STRONG.test(data.password)) {
    errors.password = "Harus mengandung huruf besar, kecil, angka, dan simbol.";
  }

  // Konfirmasi Password
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Konfirmasi kata sandi tidak cocok.";
  }

  // Nomor Telepon
  if (!data.phone || !REGEX_PHONE.test(data.phone.replace(/[\s-]/g, ""))) {
    errors.phone = "Format nomor telepon tidak valid (contoh: 08123456789).";
  }

  // NIK
  if (data.ktp && !REGEX_NIK.test(data.ktp.replace(/\s/g, ""))) {
    errors.ktp = "NIK harus 16 digit angka.";
  }

  // Tanggal lahir (optional tapi jika diisi harus valid)
  if (data.dob) {
    const dob = new Date(data.dob);
    const today = new Date();
    const minAge = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());
    if (isNaN(dob.getTime())) {
      errors.dob = "Tanggal lahir tidak valid.";
    } else if (dob > minAge) {
      errors.dob = "Anda harus berusia minimal 17 tahun.";
    }
  }

  // Persetujuan
  if (!data.agree) {
    errors.agree = "Anda harus menyetujui ketentuan layanan.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      name: sanitize(data.name.trim()),
      email: sanitize(data.email.trim().toLowerCase()),
      phone: sanitize(data.phone.trim()),
      dob: data.dob,
      gender: data.gender,
      education: data.education,
      ktp: data.ktp ? data.ktp.replace(/\s/g, "") : "",
      address: sanitize(data.address.trim()),
      instagram: sanitize(data.instagram.trim()),
      facebook: sanitize(data.facebook.trim()),
    },
  };
}

// ===================== CHANGE PASSWORD =====================
/**
 * @param {{ currentPassword: string, newPassword: string, confirmNewPassword: string }} data
 * @returns {{ success: boolean, errors?: object }}
 */
export function validateChangePassword(data) {
  const errors = {};

  if (!data.currentPassword || data.currentPassword.length < 1) {
    errors.currentPassword = "Kata sandi saat ini wajib diisi.";
  }

  if (!data.newPassword || data.newPassword.length < 8) {
    errors.newPassword = "Kata sandi baru minimal 8 karakter.";
  } else if (!REGEX_PASSWORD_STRONG.test(data.newPassword)) {
    errors.newPassword = "Harus mengandung huruf besar, kecil, angka, dan simbol.";
  }

  if (data.newPassword === data.currentPassword) {
    errors.newPassword = "Kata sandi baru tidak boleh sama dengan kata sandi lama.";
  }

  if (data.newPassword !== data.confirmNewPassword) {
    errors.confirmNewPassword = "Konfirmasi kata sandi tidak cocok.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return { success: true };
}

// ===================== PASSWORD STRENGTH =====================
/**
 * Mengembalikan skor kekuatan password 0-4 dan warnanya
 * @param {string} password
 * @returns {{ score: number, label: string, color: string }}
 */
export function passwordStrength(password) {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { score: 0, label: "", color: "" },
    { score: 1, label: "Lemah", color: "#ba1a1a" },
    { score: 2, label: "Cukup", color: "#e65100" },
    { score: 3, label: "Baik", color: "#2e7d32" },
    { score: 4, label: "Kuat", color: "#1b5e20" },
  ];
  return levels[score];
}
