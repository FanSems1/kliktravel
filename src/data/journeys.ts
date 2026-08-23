export interface JourneyChapter {
  id: string;
  title: string;
  text: string;
  layout: "left" | "right" | "full";
}

export interface JourneyItinerary {
  day: string;
  title: string;
  description: string;
}

export interface JourneyAccommodation {
  name: string;
  city: string;
  roomType: string;
}

export interface JourneyFlight {
  airline: string;
  route: string[];
}

export interface JourneyFAQ {
  q: string;
  a: string;
}

export interface Journey {
  id: string;
  slug: string;
  title: string;
  destination: string; 
  subtitle: string;
  durationDays: number;
  durationLabel: string;
  dates: string;
  airline: string;
  price: string;
  priceRaw: number;
  travelMonth: string; 
  travelStyle: string; 
  imageGradient: string; 
  image: string;
  
  introHeading: string;
  introDescription: string;
  countriesCount: number; 
  chapters: JourneyChapter[];
  itinerary: JourneyItinerary[];
  highlights: string[];
  accommodations: JourneyAccommodation[];
  flights: JourneyFlight;
  inclusions: string[];
  exclusions: string[];
  faqs: JourneyFAQ[];
  status?: "Available" | "Closed" | "Draft" | "active" | "draft" | "inactive" | "AVAILABLE" | "CLOSED" | "DRAFT";
  remainingSeats?: number;
  maxSeats?: number;
}

export const localizedJourneys: Record<"id" | "en", Journey[]> = {
  id: [
    {
      id: "1",
      slug: "komodo-sailing",
      title: "Ekspedisi Berlayar Komodo",
      destination: "Indonesia",
      subtitle: "Pelayaran phinisi privat melintasi pantai pasir merah muda, sabana berbatu, dan habitat naga prasejarah.",
      durationDays: 5,
      durationLabel: "5 Hari",
      dates: "12 — 16 Agu 2026",
      airline: "Garuda Indonesia",
      price: "IDR 24.5 JT",
      priceRaw: 24500000,
      travelMonth: "Agu 2026",
      travelStyle: "Petualangan Bahari",
      imageGradient: "from-[#38BDF8] to-[#0369A1]",
      image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1200",
      introHeading: "MENGARUNGI ALAM NAGA.",
      introDescription: "Memulai perjalanan menggunakan kapal Phinisi kayu pilihan menjelajahi pulau-pulau terpencil di kepulauan Komodo. Berjalan kaki melintasi sabana berbatu untuk melihat komodo prasejarah, berenang bersama pari manta raksasa, dan menyaksikan matahari terbenam di atas pulau-pulau vulkanik dari dek privat Anda.",
      countriesCount: 1,
      chapters: [
        {
          id: "01",
          title: "Labuan Bajo",
          text: "Gerbang masuk Anda menuju kepulauan. Sebuah kota pelabuhan yang berkembang dikelilingi oleh perbukitan. Nikmati hidangan laut segar dan pemandangan matahari terbenam yang spektakuler sebelum menaiki kapal privat Anda.",
          layout: "left"
        },
        {
          id: "02",
          title: "Padar & Komodo",
          text: "Mendaki puncak Pulau Padar untuk menikmati panorama pantai tiga warna yang ikonik, lalu melangkahkan kaki di Pulau Komodo untuk perjalanan berpemandu mencari predator puncak legendaris.",
          layout: "right"
        },
        {
          id: "03",
          title: "Pantai Merah Muda & Manta Point",
          text: "Berenang di perairan sebening kristal. Biarkan arus laut membawa Anda melayang di atas terumbu karang yang subur dan berdampingan dengan pari manta yang anggun.",
          layout: "full"
        }
      ],
      itinerary: [
        {
          day: "HARI 01",
          title: "Tiba di Labuan Bajo",
          description: "Tiba di Bandara Komodo. Diantar menuju pelabuhan dan menaiki kapal Phinisi pilihan kami. Berlayar menuju Pulau Kelor untuk pendakian singkat dan matahari terbenam."
        },
        {
          day: "HARI 02",
          title: "Padar & Pantai Merah Muda",
          description: "Pendakian matahari terbit di Pulau Padar. Melanjutkan pelayaran menuju Pantai Merah Muda untuk berenang dan piknik di tepi pantai."
        },
        {
          day: "HARI 03",
          title: "Taman Nasional Komodo",
          description: "Pendakian pagi bersama petugas (rangers) untuk melihat Komodo. Snorkeling melayang di Manta Point pada sore hari."
        },
        {
          day: "HARI 04",
          title: "Kanawa & Sebayur",
          description: "Menemukan terumbu karang perawan di Sebayur. Menikmati makan malam perpisahan BBQ di gundukan pasir terpencil di bawah taburan bintang."
        },
        {
          day: "HARI 05",
          title: "Kembali ke Pelabuhan",
          description: "Berlayar kembali ke Labuan Bajo. Pengantaran ke bandara untuk penerbangan pulang Anda."
        }
      ],
      highlights: [
        "Pelayaran kapal Phinisi pilihan privat",
        "Trekking melihat Komodo bersama petugas ahli",
        "Berenang bersama Pari Manta",
        "Matahari terbit di Pulau Padar",
        "Makan malam privat di gundukan pasir (sandbank)"
      ],
      accommodations: [
        {
          name: "Ayana Lako di'a (Phinisi Pilihan)",
          city: "Kepulauan Komodo",
          roomType: "Kabin Master Suite"
        }
      ],
      flights: {
        airline: "Garuda Indonesia",
        route: ["Jakarta (CGK)", "Labuan Bajo (LBJ)"]
      },
      inclusions: [
        "Penerbangan domestik dengan Garuda Indonesia",
        "Penginapan 4 malam di kapal Phinisi pilihan",
        "Seluruh makanan disiapkan oleh koki privat di kapal",
        "Peralatan snorkeling dan pemandu privat",
        "Biaya masuk Taman Nasional dan tip petugas"
      ],
      exclusions: [
        "Minuman beralkohol",
        "Asuransi perjalanan pribadi",
        "Peralatan selam (tersedia untuk penyelam bersertifikat berdasarkan permintaan)"
      ],
      faqs: [
        {
          q: "Apakah saya harus bisa berenang?",
          a: "Meskipun snorkeling menjadi daya tarik utama, mereka yang tidak bisa berenang tetap dapat menikmati pendakian pulau yang menakjubkan, piknik di pantai, dan mengamati kehidupan laut dari kapal pendamping (tender boat) yacht."
        }
      ]
    },
    {
      id: "2",
      slug: "java-heritage",
      title: "Jalur Warisan Jawa",
      destination: "Indonesia",
      subtitle: "Perjalanan kereta melintasi candi-candi kuno, kota-kota kolonial, dan kawah gunung berapi berasap.",
      durationDays: 8,
      durationLabel: "8 Hari",
      dates: "10 — 17 Nov 2026",
      airline: "KAI Panoramic",
      price: "IDR 18.0 JT",
      priceRaw: 18000000,
      travelMonth: "Nov 2026",
      travelStyle: "Penemuan Budaya",
      imageGradient: "from-[#E0F2FE] to-[#38BDF8]",
      image: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?q=80&w=1200",
      introHeading: "CANDI DI BALIK KABUT.",
      introDescription: "Melintasi tulang punggung pulau Jawa menggunakan kereta panoramik pilihan. Menyaksikan matahari terbit yang menyinari candi Borobudur, bersepeda melintasi desa-desa kerajaan Jawa, dan berdiri di tepi Gunung Bromo yang bergemuruh.",
      countriesCount: 1,
      chapters: [],
      itinerary: [],
      highlights: [],
      accommodations: [],
      flights: { airline: "KAI Panoramic", route: ["Jakarta", "Yogyakarta", "Surabaya"] },
      inclusions: [],
      exclusions: [],
      faqs: []
    },
    {
      id: "3",
      slug: "bali-wellness",
      title: "Penyembuhan Spiritual Bali",
      destination: "Indonesia",
      subtitle: "Penyembuhan mendalam di tengah persawahan terasering dan pura air suci Ubud.",
      durationDays: 6,
      durationLabel: "6 Hari",
      dates: "04 — 09 Des 2026",
      airline: "Garuda Indonesia",
      price: "IDR 15.5 JT",
      priceRaw: 15500000,
      travelMonth: "Des 2026",
      travelStyle: "Eskapisme Wellness",
      imageGradient: "from-[#E0F2FE] to-[#7DD3FC]",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200",
      introHeading: "KEMBALI KE PUSAT DIRI.",
      introDescription: "Mundur sejenak ke jantung Bali. Terlibat dalam ritual penyucian privat bersama pemangku (pendeta tinggi) setempat, yoga harian menghadap tebing sungai Ayung, dan bersantap organik langsung dari hasil bumi.",
      countriesCount: 1,
      chapters: [],
      itinerary: [],
      highlights: [],
      accommodations: [],
      flights: { airline: "Garuda Indonesia", route: ["Jakarta", "Denpasar"] },
      inclusions: [],
      exclusions: [],
      faqs: []
    },
    {
      id: "4",
      slug: "sumatra-wilds",
      title: "Ekspedisi Hutan Sumatra",
      destination: "Indonesia",
      subtitle: "Trekking jauh ke dalam Ekosistem Leuser untuk menjumpai orangutan liar.",
      durationDays: 7,
      durationLabel: "7 Hari",
      dates: "14 — 20 Jul 2026",
      airline: "Citilink",
      price: "IDR 12.0 JT",
      priceRaw: 12000000,
      travelMonth: "Jul 2026",
      travelStyle: "Petualangan Aktif",
      imageGradient: "from-[#BAE6FD] to-[#38BDF8]",
      image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200",
      introHeading: "MEMASUKI HUTAN PRIMAL.",
      introDescription: "Menjelajah ke salah satu tempat terakhir di bumi tempat orangutan, badak, gajah, dan harimau hidup berdampingan di alam liar. Sebuah rute perjalanan yang menantang namun sangat memuaskan dipandu oleh pemandu ahli masyarakat adat.",
      countriesCount: 1,
      chapters: [],
      itinerary: [],
      highlights: [],
      accommodations: [],
      flights: { airline: "Citilink", route: ["Jakarta", "Medan"] },
      inclusions: [],
      exclusions: [],
      faqs: []
    }
  ],
  en: [
    {
      id: "1",
      slug: "komodo-sailing",
      title: "Komodo Sailing Expedition",
      destination: "Indonesia",
      subtitle: "A private phinisi voyage through pristine pink beaches, rugged savannas, and prehistoric dragon habitats.",
      durationDays: 5,
      durationLabel: "5 Days",
      dates: "12 — 16 Aug 2026",
      airline: "Garuda Indonesia",
      price: "IDR 24.5 JT",
      priceRaw: 24500000,
      travelMonth: "Aug 2026",
      travelStyle: "Marine Adventure",
      imageGradient: "from-[#7DD3FC] to-[#0284C7]",
      image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1200",
      introHeading: "SAIL THE DRAGON'S REALM.",
      introDescription: "Embark on a luxury wooden Phinisi yacht exploring the remote islands of the Komodo archipelago. Trek through rugged savannas to spot ancient dragons, swim with giant manta rays, and watch the sun set over volcanic crater islands from your private deck.",
      countriesCount: 1,
      chapters: [
        {
          id: "01",
          title: "Labuan Bajo",
          text: "Your gateway to the islands. A burgeoning harbor town surrounded by hills. Enjoy fresh seafood and spectacular sunsets before boarding your private vessel.",
          layout: "left"
        },
        {
          id: "02",
          title: "Padar & Komodo",
          text: "Hike to the summit of Padar Island for an iconic tri-color beach panorama, then step onto Komodo Island for a guided trek to find the legendary apex predator.",
          layout: "right"
        },
        {
          id: "03",
          title: "Pink Beach & Manta Point",
          text: "Snorkel in crystal clear waters. Let the ocean currents carry you above thriving coral reefs and alongside graceful manta rays.",
          layout: "full"
        }
      ],
      itinerary: [
        {
          day: "DAY 01",
          title: "Labuan Bajo Arrival",
          description: "Arrive at Komodo Airport. Transfer to the harbor and board our luxury Phinisi. Sail to Kelor Island for a short hike and sunset."
        },
        {
          day: "DAY 02",
          title: "Padar & Pink Beach",
          description: "Sunrise trek on Padar Island. Continue sailing to Pink Beach for snorkeling and a beachfront picnic."
        },
        {
          day: "DAY 03",
          title: "Komodo National Park",
          description: "Early morning trek with rangers to spot Komodo Dragons. Afternoon drift snorkel at Manta Point."
        },
        {
          day: "DAY 04",
          title: "Kanawa & Sebayur",
          description: "Discover the untouched corals of Sebayur. Enjoy a farewell BBQ dinner on a deserted sandbank under the stars."
        },
        {
          day: "DAY 05",
          title: "Return to Harbor",
          description: "Sail back to Labuan Bajo. Transfer to the airport for your flight home."
        }
      ],
      highlights: [
        "Private luxury Phinisi sailing",
        "Komodo Dragon trekking with expert rangers",
        "Snorkeling with Manta Rays",
        "Sunrise at Padar Island",
        "Private sandbank dining"
      ],
      accommodations: [
        {
          name: "Ayana Lako di'a (Luxury Phinisi)",
          city: "Komodo Archipelago",
          roomType: "Master Suite Cabin"
        }
      ],
      flights: {
        airline: "Garuda Indonesia",
        route: ["Jakarta (CGK)", "Labuan Bajo (LBJ)"]
      },
      inclusions: [
        "Domestic flights on Garuda Indonesia",
        "4 Nights accommodation on luxury Phinisi",
        "All meals crafted by private onboard chef",
        "Snorkeling gear and private guides",
        "National Park entrance fees and ranger tips"
      ],
      exclusions: [
        "Alcoholic beverages",
        "Personal travel insurance",
        "Diving equipment (available for certified divers upon request)"
      ],
      faqs: [
        {
          q: "Do I need to know how to swim?",
          a: "While snorkeling is a major highlight, non-swimmers can still enjoy the stunning island hikes, beach picnics, and observing marine life from the yacht's tender boat."
        }
      ]
    },
    {
      id: "2",
      slug: "java-heritage",
      title: "Java Heritage Trails",
      destination: "Indonesia",
      subtitle: "A train journey through ancient temples, colonial cities, and smoky volcanic craters.",
      durationDays: 8,
      durationLabel: "8 Days",
      dates: "10 — 17 Nov 2026",
      airline: "KAI Panoramic",
      price: "IDR 18.0 JT",
      priceRaw: 18000000,
      travelMonth: "Nov 2026",
      travelStyle: "Cultural Discovery",
      imageGradient: "from-[#38BDF8] to-[#0369A1]",
      image: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?q=80&w=1200",
      introHeading: "TEMPLES IN THE MIST.",
      introDescription: "Traverse the spine of Java island via luxury panoramic trains. Witness the sunrise illuminating the Borobudur temple, cycle through royal Javanese villages, and stand on the edge of the roaring Mount Bromo.",
      countriesCount: 1,
      chapters: [],
      itinerary: [],
      highlights: [],
      accommodations: [],
      flights: { airline: "KAI Panoramic", route: ["Jakarta", "Yogyakarta", "Surabaya"] },
      inclusions: [],
      exclusions: [],
      faqs: []
    },
    {
      id: "3",
      slug: "bali-wellness",
      title: "Bali Spiritual Wellness",
      destination: "Indonesia",
      subtitle: "Deep healing amidst the terraced rice paddies and sacred water temples of Ubud.",
      durationDays: 6,
      durationLabel: "6 Days",
      dates: "04 — 09 Dec 2026",
      airline: "Garuda Indonesia",
      price: "IDR 15.5 JT",
      priceRaw: 15500000,
      travelMonth: "Dec 2026",
      travelStyle: "Wellness Escape",
      imageGradient: "from-[#E0F2FE] to-[#38BDF8]",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200",
      introHeading: "RETURN TO CENTER.",
      introDescription: "Retreat into the heart of Bali. Engage in private purification rituals with local high priests, daily yoga overlooking the Ayung river gorge, and farm-to-table organic dining.",
      countriesCount: 1,
      chapters: [],
      itinerary: [],
      highlights: [],
      accommodations: [],
      flights: { airline: "Garuda Indonesia", route: ["Jakarta", "Denpasar"] },
      inclusions: [],
      exclusions: [],
      faqs: []
    },
    {
      id: "4",
      slug: "sumatra-wilds",
      title: "Sumatra Jungle Expedition",
      destination: "Indonesia",
      subtitle: "Trekking deep into the Leuser Ecosystem to encounter wild orangutans.",
      durationDays: 7,
      durationLabel: "7 Days",
      dates: "14 — 20 Jul 2026",
      airline: "Citilink",
      price: "IDR 12.0 JT",
      priceRaw: 12000000,
      travelMonth: "Jul 2026",
      travelStyle: "Active Adventure",
      imageGradient: "from-[#E0F2FE] to-[#7DD3FC]",
      image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200",
      introHeading: "INTO THE PRIMAL FOREST.",
      introDescription: "Venture into one of the last places on earth where orangutans, rhinos, elephants, and tigers coexist in the wild. A challenging but highly rewarding trek led by expert indigenous guides.",
      countriesCount: 1,
      chapters: [],
      itinerary: [],
      highlights: [],
      accommodations: [],
      flights: { airline: "Citilink", route: ["Jakarta", "Medan"] },
      inclusions: [],
      exclusions: [],
      faqs: []
    }
  ]
};

export const journeys = localizedJourneys["id"];
