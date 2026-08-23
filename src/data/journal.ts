export interface JournalArticle {
  id?: string;
  slug: string;
  image: string;
  categoryID: string;
  categoryEN: string;
  titleID: string;
  titleEN: string;
  excerptID: string;
  excerptEN: string;
  contentID: string;
  contentEN: string;
  dateID: string;
  dateEN: string;
  readTimeID: string;
  readTimeEN: string;
  featured?: boolean;
}

export const journalArticles: JournalArticle[] = [
  {
    slug: "the-rhythm-of-water",
    image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1200",
    categoryID: "Cerita Perjalanan",
    categoryEN: "Travel Stories",
    titleID: "Ritme Air di Amazon",
    titleEN: "The Rhythm of Water in the Amazon",
    excerptID: "Perjalanan mendalam ke cekungan Amazon di mana waktu tidak diukur dengan jam, melainkan oleh aliran sungai dan panggilan kanopi hutan.",
    excerptEN: "A deep journey into the Amazon basin where time is measured not by clocks, but by the flow of the river and the calling of the forest canopy.",
    contentID: "Amazon menawarkan ketenangan yang tak tertandingi bagi jiwa petualang. Mengalir menyusuri sungai-sungai berliku, mendengarkan simfoni alam liar di malam hari, dan menyaksikan matahari tenggelam di balik rimbunnya pepohonan purba. Di sini, setiap riak air memiliki cerita tentang kehidupan yang terus berputar selaras dengan alam.",
    contentEN: "The Amazon offers unparalleled serenity for the adventurous soul. Flowing down winding rivers, listening to the wilderness symphony at night, and watching the sun set behind ancient trees. Here, every ripple in the water tells a story of life spinning in absolute harmony with nature.",
    dateID: "14 Jul 2026",
    dateEN: "Jul 14, 2026",
    readTimeID: "6 mnt membaca",
    readTimeEN: "6 min read",
    featured: true
  },
  {
    slug: "golden-hours-of-bromo",
    image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=800",
    categoryID: "Panduan Destinasi",
    categoryEN: "Destination Guides",
    titleID: "Momen Emas Gunung Bromo",
    titleEN: "The Golden Hours of Mount Bromo",
    excerptID: "Panduan visual dan esai foto menangkap keindahan mistis kabut pagi dan matahari terbit di atas kaldera purba Bromo.",
    excerptEN: "A visual guide and photo essay capturing the mystical beauty of morning mist and sunrise over Bromo's ancient caldera.",
    contentID: `Berdiri di bibir kawah Gunung Bromo sesaat sebelum fajar menyingsing adalah pengalaman spiritual yang tak tertandingi. Ketika kegelapan malam perlahan memudar, kabut tebal menyelimuti lautan pasir (Segara Wedi) di bawahnya bagaikan samudera mistis yang tak berujung, menciptakan suasana sunyi yang begitu syahdu.

Dari kejauhan, siluet Gunung Batok yang berulir indah dan kepulan asap putih vulkanik dari kawah aktif Bromo berdiri kokoh di bawah langit jingga keemasan. Momen-momen inilah yang dinanti-nanti oleh para penjelajah dari seluruh penjuru dunia—sebuah lanskap magis yang terasa seperti ditarik dari planet lain.

> "Bromo bukan sekadar destinasi wisata; ia adalah teater alam semesta tempat keindahan magis bumi dipertunjukkan secara murni."

CHAPTER I: Pendakian Tengah Malam & Cahaya Penanjakan

Perjalanan dimulai pada pukul 03.00 pagi. Dengan menggunakan kendaraan jip 4x4, Anda akan menembus malam yang dingin menuju puncak Penanjakan 1. Sambil menggenggam secangkir kopi atau teh hangat dari kedai lokal, Anda akan menyaksikan matahari perlahan terbit dari balik ufuk timur, membiaskan sinar keemasan di atas jajaran Gunung Bromo, Batok, dan Semeru yang menjulang tinggi.

[GRID]
- https://images.unsplash.com/photo-1626082896492-766af4fc6596?q=80&w=800 | Jip 4x4 di Lautan Pasir
- https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600 | Bibir Kawah

CHAPTER II: Menyeberangi Segara Wedi & Tradisi Luhur Tengger

Setelah menyaksikan matahari terbit, petualangan berlanjut turun ke Segara Wedi (Lautan Pasir). Di sini, Anda bisa menunggangi kuda atau berjalan kaki melintasi hamparan pasir abu vulkanik menuju anak tangga kawah Bromo. Bromo memegang peran suci bagi masyarakat Hindu Tengger. Setiap tahun, mereka menggelar upacara Yadnya Kasada untuk memberikan persembahan hasil bumi ke dalam kawah aktif sebagai wujud syukur dan penghormatan kepada para leluhur.

[TIPS] Tips Perjalanan Jurnal Kurator
- Musim Terbaik: Musim Kemarau (Mei - September) untuk pemandangan langit bersih dan bebas kabut hujan.
- Perlengkapan Wajib: Jaket tebal (suhu bisa turun hingga 5°C), sarung tangan, masker wajah (pelindung debu belerang), dan kacamata.
- Etika Kunjungan: Jangan menginjak tempat sesaji di sekitar pura Luhur Poten di kaki Gunung Bromo.
- Rekomendasi Foto: King Kong Hill menawarkan sudut pemandangan kaldera yang megah dengan kerumunan pengunjung yang lebih sedikit daripada Penanjakan 1.`,
    contentEN: `Standing on the crater rim of Mount Bromo moments before dawn is an unparalleled spiritual encounter. As the shadows of the night slowly recede, a sea of dense mist blankets the ancient caldera below like a mystical, endless ocean, creating a profound silence.

In the distance, the deeply ribbed silhouette of Mount Batok and the steady white plumes of volcanic smoke from Bromo's active vent rise against a golden amber sky. These are the fleeting moments travelers chase—a majestic landscape that feels pulled from another planet entirely.

> "Bromo is not just a destination; it is a grand theater where the earth's raw volcanic beauty is performed in its purest form."

CHAPTER I: The Midnight Ascent & Sunrise over Penanjakan

The journey begins in the freezing stillness at 3:00 AM. Boarding a rugged 4x4 Jeep, you traverse the dark volcanic plain to reach the Penanjakan sunrise viewpoint. Clutching a warm cup of coffee from a local shack, you watch the sun peak over the horizon, bathing Bromo, Batok, and the towering Semeru volcano in a glorious golden glow.

[GRID]
- https://images.unsplash.com/photo-1626082896492-766af4fc6596?q=80&w=800 | 4x4 Jeep Crossing
- https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600 | Crater Rim

CHAPTER II: Traversing Segara Wedi & Tenggerese Heritage

After sunrise, the adventure descends onto the vast ash desert known as Segara Wedi (Sea of Sand). From there, you can ride a horse or hike across the desolate volcanic flats to climb the stairs leading right to the crater's steaming lip. Mount Bromo remains deeply sacred to the Tenggerese Hindu community. Each year, they hold the Yadnya Kasada festival, offering agricultural harvest and livestock into the crater as a gesture of gratitude to the gods.

[PROTOCOL] Curator's Travel Protocol
- Best Season: Dry Season (May - September) for clear, cloudless skies and optimal sunrise viewpoints.
- Travel Essentials: Warm windbreaker (temperatures dip to 5°C), gloves, face mask (for sulfur/ash protection), and sunglasses.
- Cultural Etiquette: Avoid stepping on sacred offering sites (sesaji) around the Luhur Poten temple at the foot of Bromo.
- Best Photo Angle: King Kong Hill offers a majestic panoramic caldera view with fewer crowds than the main Penanjakan 1 platform.`,
    dateID: "28 Jun 2026",
    dateEN: "Jun 28, 2026",
    readTimeID: "4 mnt membaca",
    readTimeEN: "4 min read"
  },
  {
    slug: "a-silk-road-narrative",
    image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=800",
    categoryID: "Cerita Perjalanan",
    categoryEN: "Travel Stories",
    titleID: "Naratif Jalur Sutra Uzbekistan",
    titleEN: "A Silk Road Narrative in Uzbekistan",
    excerptID: "Menjelajahi arsitektur megah bermotif mosaik biru di Samarkand dan lorong-lorong bersejarah Bukhara yang menawan.",
    excerptEN: "Exploring the majestic blue-tiled architecture of Samarkand and the charming historic alleyways of ancient Bukhara.",
    contentID: "Uzbekistan menyembunyikan kekayaan sejarah peradaban Jalur Sutra yang menakjubkan. Menatap kubah-kubah masjid bermosaik biru kobalt di Registan Square, berjalan melintasi pasar tradisional yang telah berusia ratusan tahun, dan menikmati keramahan penduduk lokal yang menyajikan teh hangat di sore hari.",
    contentEN: "Uzbekistan conceals a breathtaking history from the golden age of the Silk Road. Gazing at the cobalt-blue tiled domes of Registan Square, walking through centuries-old bazaars, and enjoying local hospitality over warm tea in the afternoon.",
    dateID: "10 Mei 2026",
    dateEN: "May 10, 2026",
    readTimeID: "8 mnt membaca",
    readTimeEN: "8 min read"
  },
  {
    slug: "48-hours-in-labuan-bajo",
    image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=800",
    categoryID: "Panduan Destinasi",
    categoryEN: "Destination Guides",
    titleID: "48 Jam di Labuan Bajo",
    titleEN: "48 Hours in Labuan Bajo",
    excerptID: "Rencana perjalanan kurasi terbaik mencakup pendakian Pulau Padar, bersantai di Pantai Pink, dan berlayar di atas kapal phinisi mewah.",
    excerptEN: "A curated itinerary covering Padar Island hikes, relaxing on Pink Beach, and sailing aboard a luxury wooden phinisi.",
    contentID: "Gerbang menuju Taman Nasional Komodo ini menawarkan petualangan tropis terbaik. Nikmati trekking pagi hari di Pulau Padar untuk pemandangan tiga teluk ikonik, snorkeling bersama ikan pari manta, dan bermalam di bawah hamparan bintang di dek kapal phinisi kayu tradisional.",
    contentEN: "The gateway to Komodo National Park offers the ultimate tropical adventure. Trek Padar Island early in the morning for views of three iconic bays, snorkel alongside manta rays, and spend the night stargazing on the deck of a traditional wooden phinisi.",
    dateID: "22 Apr 2026",
    dateEN: "Apr 22, 2026",
    readTimeID: "5 mnt membaca",
    readTimeEN: "5 min read"
  },
  {
    slug: "slow-travel-in-kyoto",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800",
    categoryID: "Catatan Kurator",
    categoryEN: "Behind the Scenes",
    titleID: "Seni Perjalanan Lambat di Kyoto",
    titleEN: "The Art of Slow Travel in Kyoto",
    excerptID: "Menemukan ketenangan di taman Zen tersembunyi, upacara minum teh tradisional, dan jalan setapak bambu Kyoto saat musim gugur.",
    excerptEN: "Discovering peace in hidden Zen gardens, traditional tea ceremonies, and Kyoto's autumn maple foliage.",
    contentID: "Kyoto paling baik dinikmati secara perlahan. Berjalan di antara hutan bambu Arashiyama yang berbisik ditiup angin, merenung di taman batu kuil Buddha Zen, dan menikmati keindahan upacara minum teh matcha yang khidmat. Ini adalah seni melambatkan langkah untuk menghargai momen saat ini.",
    contentEN: "Kyoto is best enjoyed slowly. Walk among the whispering bamboo of Arashiyama, meditate in the dry stone gardens of Zen Buddhist temples, and appreciate the mindfulness of a traditional matcha tea ceremony. It is the art of slowing down to appreciate the present moment.",
    dateID: "08 Mar 2026",
    dateEN: "Mar 8, 2026",
    readTimeID: "7 mnt membaca",
    readTimeEN: "7 min read"
  }
];
