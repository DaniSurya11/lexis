import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const lawyers = [
  {
    email: 'maya@lexis.com',
    password: 'password123',
    full_name: 'Maya Santoso, S.H., M.H.',
    city: 'Surabaya',
    specialization: 'Hukum Perdata',
    price_per_hour: 850000,
    rating: 4.8,
    bio: 'Maya Santoso ahli dalam penyelesaian sengketa perdata, waris, dan hukum keluarga.',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwZbb-rfvhaTKUGTGGTqUzhtFeZ1zWOa_SKWYKdWcp1lUguRzTeLfOUJQTm4Cfi2B9it9mPFXcRNXLvYwIVbd7KgwHzrkViEeJxKfonzyo23XFblrxf1sLZe050XpbYvyCUYjYharLIc9pYhLFaLOkRTGRgaHpioSL3gwWh1Ol4jiU0I1Ml5VbzAysxxudbDfnR8DLERl7k1KFIKBbPFWGlYxnRSAlXtrTzzAiGES7_7__Rcj8ba_Tvyt48tr2ZkygjFaavzC0qSk',
  },
  {
    email: 'raka@lexis.com',
    password: 'password123',
    full_name: 'Raka Pradana, S.H.',
    city: 'Bandung',
    specialization: 'Hukum Pidana',
    price_per_hour: 1500000,
    rating: 5.0,
    bio: 'Advokat senior di bidang hukum pidana dengan rekam jejak panjang dalam kasus korupsi dan cybercrime.',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7brCPtcN9kMINOYDTQwUyEFCHGW3_bML7EQhffsfaOeRRoS-pOrmarqCVbp1VlHLizZ-Pfz1loSi4zye9yigQJYG-VdTZlWxBBUNfiIZ0ByqOVMbg2t9uVInTSNQ1PJtfCeV1LqfYk2a9Ab4J0ePS36xil1YAGwSNtw0jT4HcVJhT6PtsocrUAqEXvrBigmTMRvpXYzBOb5CwdsNsqJKMFhWHVE_gFsa9Bj3imwJOqsNmc5wR1R19Xx07Rc9AnIbZo8KIJzQ58X4',
  },
  {
    email: 'diana@lexis.com',
    password: 'password123',
    full_name: 'Diana Putri, S.H.',
    city: 'Medan',
    specialization: 'Hukum Internasional',
    price_per_hour: 1000000,
    rating: 4.7,
    bio: 'Spesialis dalam hukum komersial internasional dan penyusunan kontrak lintas batas negara.',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRXWtAHnfSS1-YWrGn-hCLVhLW5-NEwx-FJCQf28-l2-8DUvSbsOTupjvvHvewMH7ucSy0x6bO9467r4l84jD0J3YnksNxXkgJqbUrBLP23R2W5K7aW71JzOfVACVEsTCYGYVNCZQVExesbJ0TnwERFDtHu0eRShTSuVH8NcVe8hXSkvFO2dL-jieI4eQ5c5cWDYpy2-sm6P-YXH4ofuK5X5PP9jF1R9x-de31fT2qTmB4dRcoUcbO4kw5TFB4f5j7aJMSEbb7wo0',
  },
  {
    email: 'budi@lexis.com',
    password: 'password123',
    full_name: 'Budi Hartono, S.H.',
    city: 'Jakarta',
    specialization: 'Ketenagakerjaan',
    price_per_hour: 750000,
    rating: 4.8,
    bio: 'Fokus pada penyelesaian sengketa hubungan industrial dan undang-undang cipta kerja.',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCe7m93xWQYAmXL7_k7W7pTfBPAjEdXkUFD7R_msn4YoK1r1F10DyogGGGnl9u9J1poqRir9a_zK1q2a9vbvF44TE_TAc_qOxh8u-TzaPon3t1Og5271-YnvxcTu9AcS3oSCT9ONw5bB5XdB3N0yAJ5txWcvPl-b74t09ierryVW-YwtcZC6xbdj9zVlHv3r1i5f13MpceO2hL9l5mo1cqF0L5W2mMyTm9vdZEnTfsGfe6IXsMmgwGo5gqC5VQshQD4mL0C-KU5KkM',
  },
  {
    email: 'reza@lexis.com',
    password: 'password123',
    full_name: 'Reza Fahlevi, S.H.',
    city: 'Jakarta',
    specialization: 'Hukum Pajak',
    price_per_hour: 1100000,
    rating: 4.9,
    bio: 'Berpengalaman tinggi dalam mitigasi risiko perpajakan dan sengketa pajak.',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCS7XrlhWcnHmTqVZ6OIeGwgMqk16ZBsbcgcrZ0Jw-anB3qnLBkyzcndfX8_8a6gEzz5nTpDFg9vtWITtivfontO5fQb7s9yk0dT3LcGkbQsp0LLbzQIE_Bh_Vue0Y1rsh-XJEOcEZ02NXYRnYQ8ZiL503G3EmCbpLCTgGE6O6HDsLdW41VtPW8KuZA6sv4B7bZOOoKojW9hJ2xnp6DfANtDCrd2L9YDCIQOATplgV1GH_C-HoCvZMMJEjPYjEskzz0QZKMZi3k-m0',
  },
  {
    email: 'siska@lexis.com',
    password: 'password123',
    full_name: 'Siska Wijaya, S.H.',
    city: 'Tangerang',
    specialization: 'Properti & Real Estate',
    price_per_hour: 900000,
    rating: 4.6,
    bio: 'Ahli dalam transaksi lahan skala besar, akuisisi properti, dan perizinan pembangunan.',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUuocqsOCMlj9twdyeTGPgeftKQsr6eBsc92wcOIn-J9Kui7NGQM68fccpFCWd7htDuxxcbft3K3iFPQZCJi7zL7TCe6vi5T_KXiyf0wxQp3wAtlR-sYBZaf4AgVgdvmKxae1vTyxUg_YQvEJrYNpdCFHXt-75HapN3ds5VrnWjBARjXPORmLBvKs9cmoVOfbthGLur1_w_sO460DJrdagreFU6a_IgteTWeqaMaYWY1lFMgwjnRNnuwF0NAGRaSRgykLtvAXlcus',
  },
  {
    email: 'irwan@lexis.com',
    password: 'password123',
    full_name: 'Dr. Irwan Syah, S.H.',
    city: 'Jakarta',
    specialization: 'Hukum Konstruksi',
    price_per_hour: 2500000,
    rating: 5.0,
    bio: 'Praktisi paling dihormati dalam hukum konstruksi dengan pengalaman lebih dari dua dekade.',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwsEkoK2k5YUrVD9XVQAh4ZpmVpDJfgPpa0B5d4zcqtM5AuhtxSJY_08r0LOtJGAnFX1TsFeTpI_6o8wfqG56z7c8D1RhXt1Q6lyY1TDRXh9aiHGOUdx7Yxf_IYWLHl1tFOyPvZL5FP3W9ptP9Zya7ogGGNMr5qZq5FTRcRXSaaf7488n7OC0gGcOwPf9mY3g1iUi-z2yPnULEhnWkxFBfdwaF8cY3GgbpB40XeTZAvXOCq_P39eOhuF2YeaEY13aLyGXSEBeVPbs',
  },
];

async function seedLawyers() {
  console.log('🚀 Starting lawyer seeding via Admin API...\n');

  for (const lawyer of lawyers) {
    console.log(`Processing: ${lawyer.full_name} (${lawyer.email})`);

    // 1. Hapus user lama jika ada (dari SQL insert yang salah)
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existing = existingUsers?.users?.find(u => u.email === lawyer.email);
    if (existing) {
      console.log(`  ⚠️  User exists, deleting old record...`);
      // Hapus dari lawyers & profiles dulu (cascade)
      await supabase.from('lawyers').delete().eq('id', existing.id);
      await supabase.from('profiles').delete().eq('id', existing.id);
      await supabase.auth.admin.deleteUser(existing.id);
    }

    // 2. Buat user baru via Admin API (cara yang BENAR)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: lawyer.email,
      password: lawyer.password,
      email_confirm: true,
      user_metadata: {
        full_name: lawyer.full_name,
        role: 'lawyer',
      },
    });

    if (authError) {
      console.error(`  ❌ Auth error: ${authError.message}`);
      continue;
    }

    const userId = authData.user.id;
    console.log(`  ✅ Auth created: ${userId}`);

    // 3. Insert profile
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: userId,
      full_name: lawyer.full_name,
      role: 'lawyer',
      city: lawyer.city,
      avatar_url: lawyer.avatar_url,
    });

    if (profileError) {
      console.error(`  ❌ Profile error: ${profileError.message}`);
      continue;
    }
    console.log(`  ✅ Profile created`);

    // 4. Insert lawyer record
    const { error: lawyerError } = await supabase.from('lawyers').upsert({
      id: userId,
      specialization: lawyer.specialization,
      price_per_hour: lawyer.price_per_hour,
      rating: lawyer.rating,
      bio: lawyer.bio,
    });

    if (lawyerError) {
      console.error(`  ❌ Lawyer error: ${lawyerError.message}`);
      continue;
    }
    console.log(`  ✅ Lawyer record created\n`);
  }

  console.log('🎉 Seeding complete!\n');
  console.log('Login credentials for all lawyers:');
  console.log('Password: password123');
  console.log('Emails:', lawyers.map(l => l.email).join(', '));
}

seedLawyers().catch(console.error);
