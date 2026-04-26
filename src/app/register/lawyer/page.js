"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import SuccessModal from "@/components/SuccessModal";

export default function LawyerWizardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [serverError, setServerError] = useState("");
  
  // Data State
  const [formData, setFormData] = useState({
    // Step 1
    fullname: "",
    title: "",
    dob: "",
    gender: "",
    email: "",
    office_address: "",
    phone: "",
    ktp: "",
    password: "",
    // Step 2
    photo: null,
    specialty: "",
    experience: "",
    firm: "",
    bio: "",
    // Step 3
    docKtp: null,
    docLicense: null,
    docCert: null,
    docSelfie: null
  });

  const [previews, setPreviews] = useState({
    photo: null,
    docKtp: null,
    docLicense: null,
    docCert: null,
    docSelfie: null
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setServerError("");
  };

  const handleFileChange = (e, targetId) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file maksimal 5MB");
        return;
      }
      setFormData(prev => ({ ...prev, [targetId]: file }));
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => ({ ...prev, [targetId]: reader.result }));
        };
        reader.readAsDataURL(file);
      } else {
        setPreviews(prev => ({ ...prev, [targetId]: 'pdf-preview' }));
      }
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.fullname || !formData.email || !formData.password || !formData.phone || !formData.ktp)) {
       alert("Harap lengkapi informasi dasar yang wajib");
       return;
    }
    if (step === 2 && (!formData.specialty || !formData.experience || !formData.bio || !formData.photo)) {
       alert("Harap lengkapi profil profesional dan foto");
       return;
    }
    if (step === 3 && (!formData.docKtp || !formData.docLicense || !formData.docCert)) {
       alert("Harap unggah dokumen wajib");
       return;
    }
    setStep(prev => prev + 1);
  };
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setServerError("");
    
    try {
      // 1. Sign up user di Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullname,
            role: "lawyer",
          }
        }
      });

      if (authError) throw authError;

      // 2. Insert ke tabel profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            full_name: formData.fullname,
            phone: formData.phone,
            city: formData.office_address,
            role: 'lawyer',
            updated_at: new Date(),
          }
        ]);

      if (profileError) throw profileError;

      // 3. Insert ke tabel lawyers
      const { error: lawyerError } = await supabase
        .from('lawyers')
        .insert([
          {
            id: authData.user.id,
            specialization: formData.specialty,
            bio: formData.bio,
            price_per_hour: 0, // Default, bisa diupdate nanti
          }
        ]);

      if (lawyerError) throw lawyerError;

      // TODO: Unggah berkas ke Supabase Storage (opsional untuk MVP lokal)

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", "lawyer");
      localStorage.setItem("userName", formData.fullname.split(' ')[0] || "Advokat");

      setShowModal(true);
      setTimeout(() => {
          router.push("/dashboard/lawyer");
      }, 4000);
    } catch (err) {
      setServerError(err.message || "Gagal melakukan pendaftaran.");
      alert(err.message || "Gagal melakukan pendaftaran.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI Helper for Steps
  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex justify-between items-end mb-3">
        <div>
          <span className="text-[11px] font-headline font-black uppercase tracking-widest text-primary mb-1 block opacity-60">Langkah {step} dari 4</span>
          <h1 className="text-3xl font-headline font-black tracking-tighter text-on-surface">
            {step === 1 ? "Informasi Dasar" : step === 2 ? "Profil Profesional" : step === 3 ? "Unggah Dokumen" : "Tinjau & Kirim"}
          </h1>
        </div>
        <div className="text-right">
          <span className="text-on-surface-variant text-xs font-bold opacity-60">{step * 25}% Selesai</span>
        </div>
      </div>
      <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-1000 ease-in-out" 
          style={{ width: `${step * 25}%` }}
        ></div>
      </div>
    </div>
  );


  return (
    <main className="flex-grow flex flex-col items-center justify-center px-6 py-8 md:py-12 bg-white">
      <SuccessModal 
        isOpen={showModal}
        title="Berkas Terkirim!"
        description="Dewan Etika tengah meninjau dokumen Anda. Anda akan diarahkan ke dashboard."
        toastTitle="Pendaftaran Terkirim"
        toastDescription="Dokumen sedang diproses untuk verifikasi profesional."
      />
      <div className="w-full max-w-xl">
        {/* Progress Indicator */}
        {renderStepIndicator()}

        {/* Wizard Content */}
        <div className="space-y-8">
          {/* STEP 1: INFORMASI DASAR */}
          {step === 1 && (
            <div className="animate-in slide-in-from-right-8 duration-700 ease-out space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative group md:col-span-2">
                  <label className="block text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1.5 ml-1" htmlFor="fullname">Nama Lengkap</label>
                  <input 
                    className="no-box-input w-full text-sm md:text-base font-medium focus:outline-none transition-all duration-300" 
                    id="fullname" value={formData.fullname} onChange={handleChange} placeholder="Contoh: Adnan Buyung" type="text"
                  />
                </div>
                <div className="relative group">
                  <label className="block text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1.5 ml-1" htmlFor="title">Gelar</label>
                  <input 
                    className="no-box-input w-full text-sm md:text-base font-medium focus:outline-none transition-all duration-300" 
                    id="title" value={formData.title} onChange={handleChange} placeholder="S.H., M.H." type="text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <label className="block text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1.5 ml-1" htmlFor="dob">Tanggal Lahir</label>
                  <input 
                    className="no-box-input w-full text-sm md:text-base font-medium focus:outline-none transition-all duration-300" 
                    id="dob" value={formData.dob} onChange={handleChange} type="date"
                  />
                </div>
                <div className="relative group">
                  <label className="block text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1.5 ml-1" htmlFor="gender">Jenis Kelamin</label>
                  <select 
                    className="no-box-input w-full text-sm md:text-base font-medium focus:outline-none transition-all duration-300" 
                    id="gender" value={formData.gender} onChange={handleChange}
                  >
                    <option value="" disabled>Pilih Jenis Kelamin</option>
                    <option value="pria">Pria</option>
                    <option value="wanita">Wanita</option>
                  </select>
                </div>
              </div>

              <div className="relative group">
                <label className="block text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1.5 ml-1" htmlFor="email">Alamat Email</label>
                <input 
                  className="no-box-input w-full text-sm md:text-base font-medium focus:outline-none transition-all duration-300" 
                  id="email" value={formData.email} onChange={handleChange} placeholder="nama@firma.com" type="email"
                />
              </div>

              <div className="relative group">
                <label className="block text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1.5 ml-1" htmlFor="office_address">Alamat Kantor / Firma</label>
                <input 
                  className="no-box-input w-full text-sm md:text-base font-medium focus:outline-none transition-all duration-300" 
                  id="office_address" value={formData.office_address} onChange={handleChange} placeholder="Contoh: Jl. Sudirman No. 45, Jakarta Selatan" type="text"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <label className="block text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1.5 ml-1" htmlFor="phone">Nomor Telepon</label>
                  <input 
                    className="no-box-input w-full text-sm md:text-base font-medium focus:outline-none transition-all duration-300" 
                    id="phone" value={formData.phone} onChange={handleChange} placeholder="+62 ..." type="tel"
                  />
                </div>
                <div className="relative group">
                  <label className="block text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1.5 ml-1" htmlFor="ktp">Nomor KTP</label>
                  <input 
                    className="no-box-input w-full text-sm md:text-base font-medium focus:outline-none transition-all duration-300" 
                    id="ktp" value={formData.ktp} onChange={handleChange} placeholder="Contoh: 3271234567890001" type="text"
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="block text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1.5 ml-1" htmlFor="password">Kata Sandi</label>
                <input 
                  className="no-box-input w-full text-sm md:text-base font-medium focus:outline-none transition-all duration-300" 
                  id="password" value={formData.password} onChange={handleChange} placeholder="••••••••" type="password"
                />
              </div>

              <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <Link href="/register" className="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest hover:text-primary transition-colors order-2 md:order-1">
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  <span>Kembali</span>
                </Link>
                <button 
                  onClick={nextStep}
                  className="button-shine w-full md:w-auto px-10 py-3 rounded-lg bg-primary text-white font-headline font-black text-xs uppercase tracking-widest shadow-lg hover:opacity-90 active:scale-[0.98] transition-all order-1 md:order-2"
                >
                  Lanjutkan
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PROFIL PROFESIONAL */}
          {step === 2 && (
            <div className="animate-in slide-in-from-right-8 duration-700 ease-out space-y-8">
              <div className="bg-white rounded-xl p-6 md:p-10 border border-outline-variant/10 shadow-sm">
                <div className="space-y-8">
                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative group text-center">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-surface-container-low flex items-center justify-center ring-2 ring-surface relative">
                        {previews.photo ? (
                          <Image src={previews.photo} alt="Profile" fill className="object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-outline-variant text-4xl">person</span>
                        )}
                        <input 
                          type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'photo')}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer pointer-events-none">
                          <span className="material-symbols-outlined text-white text-2xl">photo_camera</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-headline font-black text-brand-blue text-xs uppercase tracking-widest">Unggah Foto Profil</p>
                      <p className="text-on-surface-variant text-[10px] mt-1 opacity-60 font-medium">Foto formal, jas/blazer.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Specialization */}
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 px-1">Spesialisasi Hukum</label>
                      <div className="underline-plus bg-surface-container-low px-4 py-2 rounded-lg">
                        <select 
                          id="specialty" value={formData.specialty} onChange={handleChange}
                          className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium p-0 appearance-none outline-none"
                        >
                          <option disabled value="">Pilih Spesialisasi</option>
                          <option value="Hukum Pidana">Hukum Pidana</option>
                          <option value="Hukum Perdata">Hukum Perdata</option>
                          <option value="Hukum Korporasi">Hukum Korporasi</option>
                          <option value="Hukum Tata Negara">Hukum Tata Negara</option>
                          <option value="Hukum Internasional">Hukum Internasional</option>
                        </select>
                      </div>
                    </div>
                    {/* Years of Experience */}
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 px-1">Tahun Pengalaman</label>
                      <div className="underline-plus bg-surface-container-low px-4 py-2 rounded-lg">
                        <input 
                          id="experience" value={formData.experience} onChange={handleChange}
                          className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium p-0 outline-none" 
                          placeholder="Contoh: 10" type="number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Law Firm Name */}
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 px-1">Nama Firma Hukum <span className="opacity-40">(Opsional)</span></label>
                    <div className="underline-plus bg-surface-container-low px-4 py-2 rounded-lg">
                      <input 
                        id="firm" value={formData.firm} onChange={handleChange}
                        className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium p-0 outline-none" 
                        placeholder="Nama kantor atau firma Anda" type="text"
                      />
                    </div>
                  </div>

                  {/* Short Bio */}
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 px-1">Biografi Singkat</label>
                    <div className="underline-plus bg-surface-container-low px-4 py-2 rounded-lg">
                      <textarea 
                        id="bio" value={formData.bio} onChange={handleChange}
                        className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium p-0 resize-none outline-none" 
                        placeholder="Ceritakan latar belakang pendidikan dan fokus praktik Anda..." rows="3"
                      />
                    </div>
                    <p className="text-[9px] uppercase tracking-widest text-on-surface-variant/40 font-bold mt-1 px-1 text-right">Maksimum 300 kata</p>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 flex items-center justify-between border-t border-outline-variant/10">
                    <button 
                      onClick={prevStep}
                      className="flex items-center gap-1.5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors group" type="button"
                    >
                      <span className="material-symbols-outlined text-sm">arrow_back</span>
                      Kembali
                    </button>
                    <button 
                      onClick={nextStep}
                      className="bg-primary text-white px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg hover:opacity-90 active:scale-95 transition-all"
                    >
                      Lanjutkan
                    </button>
                  </div>
                </div>
              </div>

              {/* Help text area */}
              <div className="p-5 bg-surface-container-low rounded-xl flex gap-4 items-start border border-outline-variant/10">
                <span className="material-symbols-outlined text-primary text-xl">info</span>
                <div>
                  <h4 className="font-headline font-black text-brand-blue text-xs uppercase tracking-widest">Verifikasi Profil</h4>
                  <p className="text-xs text-on-surface-variant/80 mt-1 leading-relaxed">
                    Profil profesional Anda akan menjadi identitas utama di hadapan klien. Tim verifikasi Lexis Premium akan meninjau kelengkapan data Anda.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: UNGGAH DOKUMEN */}
          {step === 3 && (
            <div className="animate-in slide-in-from-right-8 duration-700 ease-out space-y-8">
              <div className="text-center mb-6">
                <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed font-bold opacity-60 uppercase tracking-widest">
                  Unggah Dokumen Verifikasi
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'docKtp', label: 'KTP', icon: 'badge' },
                  { id: 'docLicense', label: 'KTA Advokat', icon: 'account_balance_wallet' },
                  { id: 'docCert', label: 'BAS / Sertifikat', icon: 'verified' },
                ].map((doc) => (
                  <div key={doc.id} className="bg-white p-6 rounded-xl border border-outline-variant/20 flex flex-col gap-4 group hover:border-primary/30 transition-all shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue">{doc.label}</span>
                        <span className="text-[9px] text-on-surface-variant/40 font-bold uppercase tracking-tighter">Wajib</span>
                      </div>
                      <span className="material-symbols-outlined text-primary text-xl opacity-60">{doc.icon}</span>
                    </div>
                    <div className="relative border-2 border-dashed border-outline-variant/20 rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors cursor-pointer group/upload">
                      {formData[doc.id] ? (
                        <div className="flex flex-col items-center gap-1">
                           <span className="material-symbols-outlined text-green-600 text-lg">check_circle</span>
                           <span className="text-[9px] font-black text-on-surface truncate max-w-[100px]">{formData[doc.id].name}</span>
                        </div>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-outline-variant group-hover/upload:text-primary transition-colors text-xl">cloud_upload</span>
                          <span className="text-[9px] font-black uppercase tracking-widest">Pilih Berkas</span>
                        </>
                      )}
                      <input 
                        type="file" onChange={(e) => handleFileChange(e, doc.id)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                ))}

                {/* Selfie with KTP (Optional) */}
                <div className="bg-surface-container-low p-6 rounded-xl flex flex-col gap-4 border border-outline-variant/10">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue">Selfie KTP</span>
                      <span className="text-[9px] text-primary font-black uppercase">Opsional</span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant text-xl opacity-40">photo_camera</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-container-high flex-shrink-0 relative">
                       {previews.docSelfie ? (
                          <img src={previews.docSelfie} alt="Preview" className="w-full h-full object-cover" />
                       ) : (
                          <div className="w-full h-full flex items-center justify-center text-outline-variant/50">
                             <span className="material-symbols-outlined text-xl">person</span>
                          </div>
                       )}
                       <input 
                        type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'docSelfie')}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                       />
                    </div>
                    <div className="flex flex-col justify-center">
                      <button className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:underline pointer-events-none">
                        Upload
                      </button>
                      <p className="text-[8px] text-on-surface-variant font-medium opacity-40 tracking-tight leading-tight">Foto harus jelas.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-8 flex items-center justify-between pt-6 border-t border-outline-variant/10">
                <button 
                  onClick={prevStep}
                  className="flex items-center gap-1.5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors group"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Kembali
                </button>
                <button 
                  onClick={nextStep}
                  className="bg-primary text-white px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg hover:opacity-90 active:scale-95 transition-all"
                >
                  Lanjutkan
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: TINJAU & KIRIM */}
          {step === 4 && (
            <div className="animate-in slide-in-from-right-8 duration-700 ease-out space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column: Summary */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Personal Summary Card */}
                    <section className="bg-white p-6 rounded-2xl border border-outline-variant/10 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-40 hover:opacity-100 transition-opacity">
                        <button onClick={() => setStep(1)} className="text-primary flex items-center gap-1 text-[9px] font-black uppercase tracking-widest">
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                      </div>
                      <div className="flex items-start gap-5">
                        <div className="w-20 h-20 rounded-xl overflow-hidden shadow-sm border border-outline-variant/10 flex-shrink-0 relative">
                          <Image fill className="object-cover" src={previews.photo || "https://via.placeholder.com/150"} alt="Profile" />
                        </div>
                        <div className="space-y-0.5">
                          <h2 className="text-lg font-black text-brand-blue font-headline uppercase tracking-tight">{formData.fullname} {formData.title && `, ${formData.title}`}</h2>
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest">{formData.specialty || "Spesialisasi"}</p>
                          <div className="flex items-center gap-3 mt-3">
                            <span className="bg-primary/5 text-primary px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase border border-primary/10">Verification Pending</span>
                            <span className="text-on-surface-variant text-[9px] font-bold opacity-40 flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">apartment</span> {formData.firm || "Praktek Mandiri"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Pro Summary Section */}
                    <section className="px-2">
                      <h3 className="text-[9px] font-black text-on-surface-variant/40 font-headline uppercase tracking-[0.2em] mb-4">Ringkasan Profil</h3>
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="w-0.5 bg-primary/10 rounded-full"></div>
                          <div>
                            <h4 className="font-black text-brand-blue text-[10px] uppercase tracking-widest">Pengalaman</h4>
                            <p className="text-xs text-on-surface-variant/70 mt-1 font-medium">{formData.experience} Tahun Pengalaman.</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-0.5 bg-primary/10 rounded-full"></div>
                          <div className="flex-1">
                            <h4 className="font-black text-brand-blue text-[10px] uppercase tracking-widest">Biografi</h4>
                            <p className="text-[11px] text-on-surface-variant/60 mt-1 leading-relaxed italic font-medium">"{formData.bio}"</p>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="md:col-span-1">
                    <div className="sticky top-28 space-y-4">
                      <div className="bg-surface-container-low p-6 rounded-2xl space-y-6 shadow-sm border border-outline-variant/10">
                        <div>
                          <h3 className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-2">Konfirmasi</h3>
                          <p className="text-[9px] text-on-surface-variant leading-relaxed font-bold opacity-60">Saya menyatakan data yang diberikan adalah benar.</p>
                        </div>
                        <div className="space-y-3">
                          <label className="flex items-start gap-2 cursor-pointer group">
                            <input className="mt-0.5 rounded-sm border-outline-variant text-primary focus:ring-primary h-3 w-3" type="checkbox" required />
                            <span className="text-[9px] text-on-surface-variant font-black uppercase tracking-widest opacity-60">Setuju Syarat & Ketentuan</span>
                          </label>
                          <label className="flex items-start gap-2 cursor-pointer group">
                            <input className="mt-0.5 rounded-sm border-outline-variant text-primary focus:ring-primary h-3 w-3" type="checkbox" required />
                            <span className="text-[9px] text-on-surface-variant font-black uppercase tracking-widest opacity-60">Bersedia Diverifikasi</span>
                          </label>
                        </div>
                        <div className="space-y-2 pt-2">
                           <button 
                            onClick={handleSubmit}
                            className="w-full py-4 bg-primary text-white rounded-xl font-headline font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:opacity-90 active:scale-95 transition-all"
                           >
                              Kirim Berkas
                           </button>
                           <button 
                            onClick={prevStep}
                            className="w-full py-3 bg-transparent text-on-surface-variant font-black text-[9px] uppercase tracking-widest hover:bg-white rounded-xl transition-all flex items-center justify-center gap-1.5 border border-outline-variant/10"
                           >
                              Revisi
                           </button>
                        </div>
                      </div>

                      {/* Trust Badge */}
                      <div className="p-4 rounded-2xl flex items-start gap-3 border border-outline-variant/10 opacity-60">
                        <span className="material-symbols-outlined text-brand-blue text-xl">verified_user</span>
                        <div>
                          <h4 className="text-[9px] font-black text-brand-blue uppercase tracking-widest font-headline">Enkripsi AES-256</h4>
                          <p className="text-[8px] text-on-surface-variant leading-relaxed font-bold">Data aman dan terverifikasi.</p>
                        </div>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Decorative Editorial Note */}
        <div className="mt-12 p-6 border-t border-outline-variant/10 flex flex-col md:flex-row gap-6 items-center text-center md:text-left">
          <div className="w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center shrink-0 opacity-40">
             <span className="material-symbols-outlined text-brand-blue text-2xl">policy</span>
          </div>
          <div>
            <h3 className="font-headline font-black text-on-surface-variant/40 uppercase text-[10px] tracking-[0.2em] mb-1 italic">Standar Verifikasi Lexis</h3>
            <p className="text-on-surface-variant text-[10px] font-medium leading-[1.6] opacity-40">
              Setiap pendaftaran ditinjau secara manual oleh Dewan Etika untuk memastikan integritas jaringan hukum kami. Informasi Anda rahasia dan aman.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
