export interface RegionDestination {
  id: string;
  key?: string;
  name: string;
  nameEN?: string;
  slug: string;
  subtitle: string;
  subtitleEN?: string;
  featuredImageGradient: string;
  image?: string;
  status?: "active" | "draft" | "inactive";
  subDestinations: {
    name: string;
    nameEN?: string;
    slug: string;
    image?: string;
  }[];
}

export const localizedRegions: Record<"id" | "en", RegionDestination[]> = {
  id: [
    {
      id: "indonesia",
      name: "Indonesia",
      slug: "indonesia",
      subtitle: "Negeri kepulauan megah dengan ribuan budaya, pantai eksotis, dan petualangan tanpa batas.",
      featuredImageGradient: "from-[#E0F2FE] to-[#7DD3FC]",
      subDestinations: []
    },
    {
      id: "thailand",
      name: "Thailand",
      slug: "thailand",
      subtitle: "Kuil emas yang berkilau, pasar terapung yang hidup, dan pantai tropis yang memukau.",
      featuredImageGradient: "from-[#BAE6FD] to-[#38BDF8]",
      subDestinations: []
    },
    {
      id: "vietnam",
      name: "Vietnam",
      slug: "vietnam",
      subtitle: "Teluk karst spektakuler, kota kolonial kuno, dan kehangatan budaya lokal.",
      featuredImageGradient: "from-[#7DD3FC] to-[#0284C7]",
      subDestinations: []
    },
    {
      id: "korea",
      name: "Korea",
      slug: "korea",
      subtitle: "Perpaduan harmonis antara tradisi dinasti masa lalu dan masa depan teknologi modern.",
      featuredImageGradient: "from-[#38BDF8] to-[#0369A1]",
      subDestinations: []
    },
    {
      id: "japan",
      name: "Jepang",
      slug: "japan",
      subtitle: "Bunga sakura yang anggun, kuil bersejarah yang tenang, dan kota metropolitan futuristik.",
      featuredImageGradient: "from-[#E0F2FE] to-[#38BDF8]",
      subDestinations: []
    },
    {
      id: "china",
      name: "China",
      slug: "china",
      subtitle: "Tembok Raksasa yang melegenda, pemandangan pegunungan mistis, dan kota megapolitan.",
      featuredImageGradient: "from-[#E0F2FE] to-[#7DD3FC]",
      subDestinations: []
    },
    {
      id: "hongkong",
      name: "Hongkong",
      slug: "hongkong",
      subtitle: "Gedung pencakar langit megah, pelabuhan legendaris, dan perpaduan budaya timur-barat yang unik.",
      featuredImageGradient: "from-[#BAE6FD] to-[#38BDF8]",
      subDestinations: []
    },
    {
      id: "india",
      name: "India",
      slug: "india",
      subtitle: "Simfoni warna-warni budaya, Taj Mahal yang megah, dan rempah-rempah yang menggoda.",
      featuredImageGradient: "from-[#BAE6FD] to-[#38BDF8]",
      subDestinations: []
    },
    {
      id: "others",
      name: "Lainnya",
      slug: "others",
      subtitle: "Jelajahi berbagai destinasi impian menakjubkan lainnya di seluruh belahan dunia.",
      featuredImageGradient: "from-[#7DD3FC] to-[#0284C7]",
      subDestinations: []
    }
  ],
  en: [
    {
      id: "indonesia",
      name: "Indonesia",
      slug: "indonesia",
      subtitle: "A majestic archipelagic nation with thousands of cultures, exotic beaches, and endless adventures.",
      featuredImageGradient: "from-[#E0F2FE] to-[#7DD3FC]",
      subDestinations: []
    },
    {
      id: "thailand",
      name: "Thailand",
      slug: "thailand",
      subtitle: "Glittering golden temples, vibrant floating markets, and stunning tropical beaches.",
      featuredImageGradient: "from-[#BAE6FD] to-[#38BDF8]",
      subDestinations: []
    },
    {
      id: "vietnam",
      name: "Vietnam",
      slug: "vietnam",
      subtitle: "Spectacular karst bays, ancient colonial towns, and warm local culture.",
      featuredImageGradient: "from-[#7DD3FC] to-[#0284C7]",
      subDestinations: []
    },
    {
      id: "korea",
      name: "Korea",
      slug: "korea",
      subtitle: "A harmonious blend of past dynasty traditions and high-tech modern future.",
      featuredImageGradient: "from-[#38BDF8] to-[#0369A1]",
      subDestinations: []
    },
    {
      id: "japan",
      name: "Japan",
      slug: "japan",
      subtitle: "Graceful cherry blossoms, serene historic temples, and futuristic metropolises.",
      featuredImageGradient: "from-[#E0F2FE] to-[#38BDF8]",
      subDestinations: []
    },
    {
      id: "china",
      name: "China",
      slug: "china",
      subtitle: "The legendary Great Wall, mystical mountain landscapes, and megacities.",
      featuredImageGradient: "from-[#E0F2FE] to-[#7DD3FC]",
      subDestinations: []
    },
    {
      id: "hongkong",
      name: "Hong Kong",
      slug: "hongkong",
      subtitle: "Majestic skyscrapers, legendary harbors, and a unique fusion of East and West cultures.",
      featuredImageGradient: "from-[#BAE6FD] to-[#38BDF8]",
      subDestinations: []
    },
    {
      id: "india",
      name: "India",
      slug: "india",
      subtitle: "A colorful symphony of cultures, the majestic Taj Mahal, and enticing spices.",
      featuredImageGradient: "from-[#BAE6FD] to-[#38BDF8]",
      subDestinations: []
    },
    {
      id: "others",
      name: "Others",
      slug: "others",
      subtitle: "Explore other breathtaking dream destinations across the globe.",
      featuredImageGradient: "from-[#7DD3FC] to-[#0284C7]",
      subDestinations: []
    }
  ]
};

export const indonesianRegions = localizedRegions["id"];
