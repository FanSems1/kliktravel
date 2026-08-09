export interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
  description: string;
  hotel: string;
  image: string;
}

export interface TourPackageDetail {
  slug: string;
  name: string;
  tagline: string;
  duration: string;
  price: string;
  hotelRating: string;
  featuredImage: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
}

export const localizedTourPackages: Record<"id" | "en", Record<string, TourPackageDetail>> = {
  id: {
    tokyo: {
      slug: "tokyo",
      name: "Tokyo",
      tagline: "Simfoni Teknologi Modern & Budaya Klasik Jepang",
      duration: "5 Hari 4 Malam",
      price: "Mulai Rp 16.800.000 / pax",
      hotelRating: "4★ Shinjuku Hotel",
      featuredImage: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=1200",
      highlights: ["Kuil Sensoji Asakusa", "Shibuya Crossing", "Gunung Fuji & Danau Kawaguchiko", "Belanja Harajuku & Ginza"],
      itinerary: [
        {
          day: 1,
          title: "Kedatangan di Tokyo & Check-in Shinjuku",
          activities: ["Penjemputan Bandara", "Check-in Hotel", "Eksplorasi Malam Shinjuku", "Makan Malam Ramen Autentik"],
          description: "Setibanya Anda di Bandara Haneda atau Narita, tim kami akan menjemput dan mengantar Anda menggunakan kereta cepat atau limousine bus menuju hotel di kawasan Shinjuku yang strategis. Setelah beristirahat sejenak, Anda akan diajak menikmati suasana malam Tokyo yang gemerlap dengan gemerlap neon khas Shinjuku, diakhiri dengan makan malam ramen autentik yang menghangatkan.",
          hotel: "Shinjuku Washington Hotel / Setara",
          image: "https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?q=80&w=800"
        },
        {
          day: 2,
          title: "Eksplorasi Tokyo Klasik & Modern",
          activities: ["Kuil Senso-ji", "Nakamise-dori", "Shibuya Crossing", "Shibuya Sky"],
          description: "Perjalanan dimulai dengan mengunjungi Kuil Senso-ji di Asakusa, kuil Buddha tertua dan paling berwarna di Tokyo. Anda dapat berbelanja suvenir dan mencicipi jajanan tradisional di sepanjang jalan Nakamise-dori. Siang harinya, kita akan beralih ke pusat kepopuleran Tokyo modern: Shibuya. Anda akan berkesempatan menyeberang di Shibuya Crossing yang ikonik, berfoto dengan patung Hachiko, dan menikmati pemandangan spektakuler Tokyo 360 derajat dari Shibuya Sky.",
          hotel: "Shinjuku Washington Hotel / Setara",
          image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800"
        },
        {
          day: 3,
          title: "Perjalanan Eksotis ke Gunung Fuji & Kawaguchiko",
          activities: ["Fuji 5th Station", "Danau Kawaguchiko", "Gotemba Premium Outlets"],
          description: "Tinggalkan hiruk pikuk kota menuju alam pegunungan. Kita akan menempuh perjalanan menuju Gunung Fuji, singgah di stasiun ke-5 (jika cuaca mendukung) untuk melihat pemandangan awan dari dekat. Setelah itu, nikmati keindahan Danau Kawaguchiko yang tenang dengan latar belakang Fuji yang megah. Sore harinya, Anda bisa memanjakan diri dengan berbelanja barang bermerek dengan harga diskon di Gotemba Premium Outlets.",
          hotel: "Shinjuku Washington Hotel / Setara",
          image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=800"
        },
        {
          day: 4,
          title: "Budaya Pop Harajuku & Kemewahan Ginza",
          activities: ["Takeshita Street", "Meiji Shrine", "Ginza Shopping District", "Premium Sushi Dinner"],
          description: "Menjelajahi distrik fashion dan budaya anak muda di Harajuku. Anda akan menyusuri Takeshita Street yang penuh warna, kostum cosplay, dan crepe manis. Sebagai penyeimbang, kita akan mampir ke Meiji Shrine yang asri. Siang hari bergeser ke Ginza untuk menikmati suasana jalan raya berbatu bata yang dikelilingi butik kelas dunia. Perjalanan hari ini ditutup dengan makan malam Sushi premium yang tak terlupakan.",
          hotel: "Shinjuku Washington Hotel / Setara",
          image: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=800"
        },
        {
          day: 5,
          title: "Odaiba Marine Park & Penerbangan Pulang",
          activities: ["Odaiba", "Gundam Statue", "Transfer Bandara"],
          description: "Di hari terakhir, kita akan mengunjungi pulau buatan Odaiba. Berjalan santai di Odaiba Marine Park dengan pemandangan Rainbow Bridge dan replika Patung Liberty versi Tokyo. Jangan lupa berfoto dengan patung Gundam Raksasa berskala 1:1. Setelah puas berbelanja suvenir terakhir, Anda akan ditransfer kembali menuju Bandara untuk penerbangan pulang ke Indonesia dengan membawa kenangan indah.",
          hotel: "Check-out",
          image: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=800"
        }
      ],
      inclusions: [
        "Tiket pesawat PP kelas ekonomi (Maskapai Full Service)",
        "Akomodasi 4 malam di hotel bintang 4",
        "Transportasi selama tour (Kereta bawah tanah & Bus Pariwisata)",
        "Tiket masuk tempat wisata sesuai itinerary",
        "Makan pagi, siang, dan malam sesuai jadwal",
        "Tour Guide berbahasa Indonesia",
        "Asuransi Perjalanan Dasar"
      ],
      exclusions: [
        "Biaya pembuatan Visa Jepang",
        "Pengeluaran pribadi (minibar, laundry, telepon)",
        "Tipping untuk Guide & Driver (USD 5 / hari)",
        "Tur opsional di luar jadwal"
      ]
    },
    bali: {
      slug: "bali",
      name: "Bali",
      tagline: "Pesona Dewata: Perpaduan Alam, Budaya & Kemewahan",
      duration: "4 Hari 3 Malam",
      price: "Mulai Rp 4.500.000 / pax",
      hotelRating: "4★ Resort Kuta / Seminyak",
      featuredImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200",
      highlights: ["Pura Tanah Lot", "Tegalalang Rice Terrace", "Pantai Melasti", "Tari Kecak Uluwatu"],
      itinerary: [
        {
          day: 1,
          title: "Kedatangan & Sunset Tanah Lot",
          activities: ["Penjemputan Bandara", "Check-in Hotel", "Pura Tanah Lot", "Makan Malam Romantis"],
          description: "Selamat datang di Pulau Dewata! Setibanya di Bandara Internasional I Gusti Ngurah Rai, Anda akan disambut hangat oleh tim kami dan dikalungi bunga selamat datang. Setelah check-in di resort mewah Anda, sore harinya perjalanan dilanjutkan ke Pura Tanah Lot untuk menikmati pemandangan matahari terbenam yang legendaris di atas tebing batu karang di tengah deburan ombak laut selatan.",
          hotel: "Amnaya Resort Kuta / Setara",
          image: "https://images.unsplash.com/photo-1518548419070-2862a9ec6948?q=80&w=800"
        },
        {
          day: 2,
          title: "Ketenangan Ubud & Alam Kintamani",
          activities: ["Ubud Monkey Forest", "Tegalalang Rice Terrace", "Kintamani", "Kopi Luwak Plantation"],
          description: "Hari ini didedikasikan untuk keindahan alam dan budaya pegunungan Bali. Dimulai dengan menyapa kera-kera suci di Ubud Monkey Forest yang rimbun, lalu berfoto dengan latar belakang sawah berundak ikonik di Tegalalang. Siang hari, Anda akan bersantap buffet dengan udara sejuk dan pemandangan luar biasa dari Gunung dan Danau Batur di Kintamani. Perjalanan ditutup dengan menikmati sore di perkebunan Kopi Luwak lokal.",
          hotel: "Amnaya Resort Kuta / Setara",
          image: "https://images.unsplash.com/photo-1552608180-03022e90d59e?q=80&w=800"
        },
        {
          day: 3,
          title: "Pantai Pasir Putih & Eksotisme Uluwatu",
          activities: ["Pantai Melasti", "Pura Uluwatu", "Pertunjukan Tari Kecak", "Seafood Jimbaran"],
          description: "Rasakan surga pesisir Bali Selatan! Anda akan diajak bersantai di hamparan pasir putih Pantai Melasti yang diapit tebing kapur menjulang. Menjelang senja, kita bergerak menuju Pura Uluwatu yang berdiri gagah di ujung tebing samudera. Di sini, Anda akan menyaksikan pertunjukan magis Tari Kecak tradisional dengan latar belakang matahari terbenam. Malam ditutup sempurna dengan hidangan seafood bakar di pinggir Pantai Jimbaran.",
          hotel: "Amnaya Resort Kuta / Setara",
          image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800"
        },
        {
          day: 4,
          title: "Belanja Oleh-Oleh & Kepulangan",
          activities: ["Pusat Oleh-Oleh Krisna / Joger", "Transfer Bandara"],
          description: "Manfaatkan pagi hari untuk berenang atau bersantai di fasilitas resort. Setelah check-out, tim kami akan mengantar Anda berburu suvenir dan kerajinan tangan khas Bali di pusat oleh-oleh terbesar seperti Krisna atau Joger. Perjalanan diakhiri dengan pengantaran kembali ke Bandara untuk penerbangan menuju kota asal. Sampai jumpa di petualangan selanjutnya!",
          hotel: "Check-out",
          image: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?q=80&w=800"
        }
      ],
      inclusions: [
        "Akomodasi 3 malam di resort bintang 4",
        "Transportasi privat AC nyaman selama tour",
        "Tiket masuk ke semua objek wisata sesuai itinerary",
        "Makan pagi, siang, dan malam (termasuk Seafood Jimbaran)",
        "Driver merangkap Guide yang ramah",
        "Air mineral harian & kalungan bunga"
      ],
      exclusions: [
        "Tiket pesawat dari/ke Bali",
        "Pengeluaran pribadi di hotel (minibar, laundry)",
        "Tipping seikhlasnya",
        "Permainan air / watersport opsional"
      ]
    },
    hanoi: {
      slug: "hanoi",
      name: "Hanoi",
      tagline: "Menyusuri Keindahan Alam & Sejarah Kuno Vietnam",
      duration: "4 Hari 3 Malam",
      price: "Mulai Rp 7.900.000 / pax",
      hotelRating: "4★ Old Quarter Hotel & Cruise",
      featuredImage: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1200",
      highlights: ["Ha Long Bay Cruise", "Hoan Kiem Lake", "Hanoi Old Quarter", "Water Puppet Show"],
      itinerary: [
        {
          day: 1,
          title: "Tiba di Hanoi & Eksplorasi Kota Tua",
          activities: ["Penjemputan Bandara", "Check-in Hotel", "Hoan Kiem Lake", "Water Puppet Show"],
          description: "Setibanya di Bandara Noi Bai, Anda akan dijemput menuju hotel di pusat kota. Sore harinya, kita akan menyusuri pesona romantis kawasan Hanoi Old Quarter dengan becak tradisional (Cyclo), melintasi Danau Hoan Kiem yang tenang, dan menyaksikan pertunjukan ikonik Water Puppet Show yang menceritakan legenda masyarakat Vietnam.",
          hotel: "Silk Path Boutique Hanoi / Setara",
          image: "https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?q=80&w=800"
        },
        {
          day: 2,
          title: "Pelayaran Ajaib Ha Long Bay",
          activities: ["Perjalanan ke Pelabuhan", "Ha Long Bay Cruise", "Sung Sot Cave", "Kayaking"],
          description: "Bersiaplah terpesona! Perjalanan menuju pelabuhan Ha Long dilanjutkan dengan menaiki kapal pesiar mewah melintasi Situs Warisan Dunia UNESCO, Ha Long Bay. Nikmati makan siang seafood di atas kapal sambil mengelilingi gugusan pulau karst batu kapur raksasa. Anda juga akan mengeksplorasi Gua Sung Sot (Surprise Cave) yang megah dan berkesempatan mendayung kayak di perairan zamrud yang tenang.",
          hotel: "Cruise Cabin / Silk Path Boutique",
          image: "https://images.unsplash.com/photo-1557427161-0421272d1297?q=80&w=800"
        },
        {
          day: 3,
          title: "Jejak Sejarah Vietnam",
          activities: ["Mausoleum Ho Chi Minh", "One Pillar Pagoda", "Temple of Literature", "Egg Coffee Experience"],
          description: "Hari ini didedikasikan untuk sejarah, mengunjungi kompleks bersejarah Mausoleum Ho Chi Minh dan kediamannya. Melihat keunikan arsitektur Pagoda Pilar Satu (One Pillar Pagoda) dan menjelajahi Temple of Literature, universitas pertama di Vietnam yang dibangun pada abad ke-11. Sore harinya bersantai di kedai kopi legendaris untuk mencoba Egg Coffee khas Hanoi yang manis dan lembut.",
          hotel: "Silk Path Boutique Hanoi / Setara",
          image: "https://images.unsplash.com/photo-1509060464153-44667396260f?q=80&w=800"
        },
        {
          day: 4,
          title: "Belanja Souvenir & Transfer Bandara",
          activities: ["Dong Xuan Market", "Waktu Luang", "Transfer Bandara"],
          description: "Waktu bebas di pagi hari yang bisa Anda manfaatkan untuk mengunjungi pasar tradisional Dong Xuan. Ini adalah tempat terbaik untuk membeli kopi Vietnam asli, kain sutra, atau cinderamata lainnya. Sesuai dengan jadwal penerbangan, Anda akan dijemput menuju Bandara Noi Bai untuk kembali ke tanah air dengan membawa pengalaman budaya yang kaya.",
          hotel: "Check-out",
          image: "https://images.unsplash.com/photo-1555938171-8b27329910d5?q=80&w=800"
        }
      ],
      inclusions: [
        "Tiket pesawat PP kelas ekonomi",
        "Akomodasi 3 malam (Hotel 4★ & Cruise)",
        "Makan sesuai itinerary (termasuk Seafood di Cruise)",
        "Tiket masuk tempat wisata",
        "Transportasi nyaman ber-AC",
        "Lokal Guide berbahasa Inggris/Indonesia"
      ],
      exclusions: [
        "Pengeluaran pribadi (minibar, belanja)",
        "Tipping Guide & Driver (USD 3 / hari)",
        "Asuransi perjalanan"
      ]
    }
  },
  en: {
    tokyo: {
      slug: "tokyo",
      name: "Tokyo",
      tagline: "A Symphony of Modern Technology & Classic Japanese Culture",
      duration: "5 Days 4 Nights",
      price: "From USD 1,120 / pax",
      hotelRating: "4★ Shinjuku Hotel",
      featuredImage: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=1200",
      highlights: ["Sensoji Temple Asakusa", "Shibuya Crossing", "Mount Fuji & Lake Kawaguchiko", "Harajuku & Ginza Shopping"],
      itinerary: [
        {
          day: 1,
          title: "Arrival in Tokyo & Shinjuku Check-in",
          activities: ["Airport Pick-up", "Hotel Check-in", "Shinjuku Night Exploration", "Authentic Ramen Dinner"],
          description: "Upon your arrival at Haneda or Narita Airport, our team will greet you and transfer you via express train or limousine bus to your strategically located hotel in Shinjuku. After settling in, experience Tokyo's neon-lit nightlife, concluding with a warming bowl of authentic ramen.",
          hotel: "Shinjuku Washington Hotel / Equivalent",
          image: "https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?q=80&w=800"
        },
        {
          day: 2,
          title: "Classic & Modern Tokyo Exploration",
          activities: ["Senso-ji Temple", "Nakamise-dori", "Shibuya Crossing", "Shibuya Sky"],
          description: "Begin at Senso-ji Temple in Asakusa, Tokyo's oldest Buddhist temple. Shop for traditional souvenirs along Nakamise-dori. In the afternoon, dive into modern Shibuya, crossing the world-famous Shibuya Crossing, visiting the Hachiko statue, and viewing Tokyo 360° from Shibuya Sky.",
          hotel: "Shinjuku Washington Hotel / Equivalent",
          image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800"
        },
        {
          day: 3,
          title: "Exotic Trip to Mount Fuji & Kawaguchiko",
          activities: ["Fuji 5th Station", "Lake Kawaguchiko", "Gotemba Premium Outlets"],
          description: "Escape the city bustle towards Mount Fuji. Stop at the 5th Station (weather permitting) for cloud-level views. Next, admire serene Lake Kawaguchiko with majestic Fuji backdrop. Spend the afternoon luxury shopping at Gotemba Premium Outlets.",
          hotel: "Shinjuku Washington Hotel / Equivalent",
          image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=800"
        },
        {
          day: 4,
          title: "Harajuku Pop Culture & Ginza Luxury",
          activities: ["Takeshita Street", "Meiji Shrine", "Ginza Shopping District", "Premium Sushi Dinner"],
          description: "Explore youth fashion in Harajuku along colorful Takeshita Street, visit tranquil Meiji Shrine, then head to Ginza's cobblestone avenues lined with world-class fashion houses. End the day with an unforgettable premium Sushi dinner.",
          hotel: "Shinjuku Washington Hotel / Equivalent",
          image: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=800"
        },
        {
          day: 5,
          title: "Odaiba Marine Park & Departure Flight",
          activities: ["Odaiba", "Gundam Statue", "Airport Transfer"],
          description: "On your final day, stroll along Odaiba Marine Park featuring the Rainbow Bridge and Tokyo's Liberty replica. Take photos with the life-sized Gundam statue before your airport transfer for your flight home.",
          hotel: "Check-out",
          image: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=800"
        }
      ],
      inclusions: [
        "Roundtrip economy class flight (Full Service Airline)",
        "4 Nights accommodation at 4-star hotel",
        "Subway & luxury tourist bus transportation",
        "Entrance fees to all attractions listed",
        "Daily breakfast, lunch, and dinner",
        "English / Indonesian speaking tour guide",
        "Basic Travel Insurance"
      ],
      exclusions: [
        "Japan Visa application fee",
        "Personal expenses (minibar, laundry, phone)",
        "Tipping for Guide & Driver (USD 5 / day)",
        "Optional tours outside schedule"
      ]
    },
    bali: {
      slug: "bali",
      name: "Bali",
      tagline: "The Island of Gods: Nature, Culture & Luxury Combined",
      duration: "4 Days 3 Nights",
      price: "From USD 300 / pax",
      hotelRating: "4★ Resort Kuta / Seminyak",
      featuredImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200",
      highlights: ["Tanah Lot Temple", "Tegalalang Rice Terrace", "Melasti Beach", "Uluwatu Kecak Dance"],
      itinerary: [
        {
          day: 1,
          title: "Arrival & Tanah Lot Sunset",
          activities: ["Airport Pick-up", "Hotel Check-in", "Tanah Lot Temple", "Romantic Dinner"],
          description: "Welcome to Bali! Warm greetings and flower garland reception upon arrival at I Gusti Ngurah Rai Airport. Check in at your luxury resort before visiting Tanah Lot Temple for iconic ocean cliff sunset views.",
          hotel: "Amnaya Resort Kuta / Equivalent",
          image: "https://images.unsplash.com/photo-1518548419070-2862a9ec6948?q=80&w=800"
        },
        {
          day: 2,
          title: "Serene Ubud & Kintamani Nature",
          activities: ["Ubud Monkey Forest", "Tegalalang Rice Terrace", "Kintamani", "Luwak Coffee Plantation"],
          description: "Immerse in Bali's lush highland culture: greet sacred monkeys in Ubud, take photos at Tegalalang rice terraces, enjoy a buffet lunch with Mount and Lake Batur views in Kintamani, and savor artisanal Luwak coffee.",
          hotel: "Amnaya Resort Kuta / Equivalent",
          image: "https://images.unsplash.com/photo-1552608180-03022e90d59e?q=80&w=800"
        },
        {
          day: 3,
          title: "White Sand Beaches & Uluwatu Sunset",
          activities: ["Melasti Beach", "Uluwatu Temple", "Kecak Dance Show", "Jimbaran Seafood"],
          description: "Relax on Melasti Beach's white sands beneath towering limestone cliffs. At dusk, watch the hypnotic Kecak dance atop Uluwatu's ocean cliff temple, followed by a romantic candlelit seafood dinner on Jimbaran Beach.",
          hotel: "Amnaya Resort Kuta / Equivalent",
          image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800"
        },
        {
          day: 4,
          title: "Souvenir Shopping & Farewell",
          activities: ["Local Art Market", "Airport Transfer"],
          description: "Spend the morning relaxing at the resort pool. After check-out, visit local art centers for Balinese handicrafts before your transfer to the airport.",
          hotel: "Check-out",
          image: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?q=80&w=800"
        }
      ],
      inclusions: [
        "3 Nights accommodation at 4-star resort",
        "Private AC transportation throughout tour",
        "Entrance fees to all attractions listed",
        "Daily meals (including Jimbaran Seafood)",
        "Friendly driver-cum-guide",
        "Daily bottled water & welcome flower garland"
      ],
      exclusions: [
        "Flights to/from Bali",
        "Personal expenses (minibar, laundry)",
        "Driver/Guide tips",
        "Optional water sports activities"
      ]
    },
    hanoi: {
      slug: "hanoi",
      name: "Hanoi",
      tagline: "Traversing Vietnam's Natural Wonders & Ancient Heritage",
      duration: "4 Days 3 Nights",
      price: "From USD 520 / pax",
      hotelRating: "4★ Old Quarter Hotel & Cruise",
      featuredImage: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1200",
      highlights: ["Ha Long Bay Cruise", "Hoan Kiem Lake", "Hanoi Old Quarter", "Water Puppet Show"],
      itinerary: [
        {
          day: 1,
          title: "Hanoi Arrival & Old Quarter Tour",
          activities: ["Airport Pick-up", "Hotel Check-in", "Hoan Kiem Lake", "Water Puppet Show"],
          description: "Pick-up from Noi Bai Airport to your Old Quarter hotel. Enjoy a traditional cyclo ride around Hoan Kiem Lake and attend the legendary Water Puppet performance.",
          hotel: "Silk Path Boutique Hanoi / Equivalent",
          image: "https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?q=80&w=800"
        },
        {
          day: 2,
          title: "Magical Ha Long Bay Cruise",
          activities: ["Harbor Transfer", "Ha Long Bay Cruise", "Sung Sot Cave", "Kayaking"],
          description: "Board a luxury cruise sailing through UNESCO World Heritage site Ha Long Bay. Enjoy a seafood lunch surrounded by thousands of limestone islands, explore Sung Sot Cave, and kayak through emerald waters.",
          hotel: "Cruise Cabin / Silk Path Boutique",
          image: "https://images.unsplash.com/photo-1557427161-0421272d1297?q=80&w=800"
        },
        {
          day: 3,
          title: "Vietnam Historic Footsteps",
          activities: ["Ho Chi Minh Mausoleum", "One Pillar Pagoda", "Temple of Literature", "Egg Coffee Experience"],
          description: "Visit the Ho Chi Minh Complex, One Pillar Pagoda, and Vietnam's 11th-century Temple of Literature. Unwind in the afternoon with Hanoi's famous Egg Coffee.",
          hotel: "Silk Path Boutique Hanoi / Equivalent",
          image: "https://images.unsplash.com/photo-1509060464153-44667396260f?q=80&w=800"
        },
        {
          day: 4,
          title: "Souvenir Shopping & Airport Transfer",
          activities: ["Dong Xuan Market", "Free Time", "Airport Transfer"],
          description: "Morning leisure at Dong Xuan Market to purchase authentic Vietnamese coffee, silk, and crafts before your departure airport transfer.",
          hotel: "Check-out",
          image: "https://images.unsplash.com/photo-1555938171-8b27329910d5?q=80&w=800"
        }
      ],
      inclusions: [
        "Roundtrip economy class flight tickets",
        "3 Nights accommodation (4★ Hotel & Cruise)",
        "Meals per itinerary (including Cruise Seafood)",
        "All attraction entrance tickets",
        "Comfortable AC transport",
        "English-speaking local guide"
      ],
      exclusions: [
        "Personal expenses (minibar, shopping)",
        "Guide & Driver tips (USD 3 / day)",
        "Travel insurance"
      ]
    }
  }
};

export const tourPackages = localizedTourPackages["id"];
