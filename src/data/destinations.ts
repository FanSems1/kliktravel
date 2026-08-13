export interface RegionDestination {
  id: string;
  name: string;
  nameEN?: string;
  slug: string;
  subtitle: string;
  subtitleEN?: string;
  featuredImageGradient: string;
  image?: string;
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
      subDestinations: [
        { name: "Bali", slug: "bali" },
        { name: "Gunung Bromo", slug: "bromo" },
        { name: "Labuan Bajo", slug: "labuan-bajo" },
        { name: "Raja Ampat", slug: "raja-ampat" }
      ]
    },
    {
      id: "thailand",
      name: "Thailand",
      slug: "thailand",
      subtitle: "Kuil emas yang berkilau, pasar terapung yang hidup, dan pantai tropis yang memukau.",
      featuredImageGradient: "from-[#BAE6FD] to-[#38BDF8]",
      subDestinations: [
        { name: "Bangkok", slug: "bangkok" },
        { name: "Phuket", slug: "phuket" },
        { name: "Chiang Mai", slug: "chiang-mai" }
      ]
    },
    {
      id: "vietnam",
      name: "Vietnam",
      slug: "vietnam",
      subtitle: "Teluk karst spektakuler, kota kolonial kuno, dan kehangatan budaya lokal.",
      featuredImageGradient: "from-[#7DD3FC] to-[#0284C7]",
      subDestinations: [
        { name: "Hanoi", slug: "hanoi" },
        { name: "Ho Chi Minh", slug: "ho-chi-minh" },
        { name: "Da Nang", slug: "da-nang" }
      ]
    },
    {
      id: "korea",
      name: "Korea",
      slug: "korea",
      subtitle: "Perpaduan harmonis antara tradisi dinasti masa lalu dan masa depan teknologi modern.",
      featuredImageGradient: "from-[#38BDF8] to-[#0369A1]",
      subDestinations: [
        { name: "Seoul", slug: "seoul" },
        { name: "Busan", slug: "busan" },
        { name: "Jeju", slug: "jeju" }
      ]
    },
    {
      id: "japan",
      name: "Jepang",
      slug: "japan",
      subtitle: "Bunga sakura yang anggun, kuil bersejarah yang tenang, dan kota metropolitan futuristik.",
      featuredImageGradient: "from-[#E0F2FE] to-[#38BDF8]",
      subDestinations: [
        { name: "Tokyo", slug: "tokyo" },
        { name: "Kyoto", slug: "kyoto" },
        { name: "Osaka", slug: "osaka" }
      ]
    },
    {
      id: "china",
      name: "China",
      slug: "china",
      subtitle: "Tembok Raksasa yang melegenda, pemandangan pegunungan mistis, dan kota megapolitan.",
      featuredImageGradient: "from-[#E0F2FE] to-[#7DD3FC]",
      subDestinations: [
        { name: "Beijing", slug: "beijing" },
        { name: "Shanghai", slug: "shanghai" },
        { name: "Chengdu", slug: "chengdu" }
      ]
    },
    {
      id: "india",
      name: "India",
      slug: "india",
      subtitle: "Simfoni warna-warni budaya, Taj Mahal yang megah, dan rempah-rempah yang menggoda.",
      featuredImageGradient: "from-[#BAE6FD] to-[#38BDF8]",
      subDestinations: [
        { name: "Delhi", slug: "delhi" },
        { name: "Mumbai", slug: "mumbai" },
        { name: "Jaipur", slug: "jaipur" }
      ]
    },
    {
      id: "others",
      name: "Lainnya",
      slug: "others",
      subtitle: "Jelajahi berbagai destinasi impian menakjubkan lainnya di seluruh belahan dunia.",
      featuredImageGradient: "from-[#7DD3FC] to-[#0284C7]",
      subDestinations: [
        { name: "Eropa", slug: "europe" },
        { name: "Amerika", slug: "america" },
        { name: "Australia", slug: "australia" }
      ]
    }
  ],
  en: [
    {
      id: "indonesia",
      name: "Indonesia",
      slug: "indonesia",
      subtitle: "A majestic archipelagic nation with thousands of cultures, exotic beaches, and endless adventures.",
      featuredImageGradient: "from-[#E0F2FE] to-[#7DD3FC]",
      subDestinations: [
        { name: "Bali", slug: "bali" },
        { name: "Mount Bromo", slug: "bromo" },
        { name: "Labuan Bajo", slug: "labuan-bajo" },
        { name: "Raja Ampat", slug: "raja-ampat" }
      ]
    },
    {
      id: "thailand",
      name: "Thailand",
      slug: "thailand",
      subtitle: "Glittering golden temples, vibrant floating markets, and stunning tropical beaches.",
      featuredImageGradient: "from-[#BAE6FD] to-[#38BDF8]",
      subDestinations: [
        { name: "Bangkok", slug: "bangkok" },
        { name: "Phuket", slug: "phuket" },
        { name: "Chiang Mai", slug: "chiang-mai" }
      ]
    },
    {
      id: "vietnam",
      name: "Vietnam",
      slug: "vietnam",
      subtitle: "Spectacular karst bays, ancient colonial towns, and warm local culture.",
      featuredImageGradient: "from-[#7DD3FC] to-[#0284C7]",
      subDestinations: [
        { name: "Hanoi", slug: "hanoi" },
        { name: "Ho Chi Minh", slug: "ho-chi-minh" },
        { name: "Da Nang", slug: "da-nang" }
      ]
    },
    {
      id: "korea",
      name: "Korea",
      slug: "korea",
      subtitle: "A harmonious blend of past dynasty traditions and high-tech modern future.",
      featuredImageGradient: "from-[#38BDF8] to-[#0369A1]",
      subDestinations: [
        { name: "Seoul", slug: "seoul" },
        { name: "Busan", slug: "busan" },
        { name: "Jeju", slug: "jeju" }
      ]
    },
    {
      id: "japan",
      name: "Japan",
      slug: "japan",
      subtitle: "Graceful cherry blossoms, serene historic temples, and futuristic metropolises.",
      featuredImageGradient: "from-[#E0F2FE] to-[#38BDF8]",
      subDestinations: [
        { name: "Tokyo", slug: "tokyo" },
        { name: "Kyoto", slug: "kyoto" },
        { name: "Osaka", slug: "osaka" }
      ]
    },
    {
      id: "china",
      name: "China",
      slug: "china",
      subtitle: "The legendary Great Wall, mystical mountain landscapes, and megacities.",
      featuredImageGradient: "from-[#E0F2FE] to-[#7DD3FC]",
      subDestinations: [
        { name: "Beijing", slug: "beijing" },
        { name: "Shanghai", slug: "shanghai" },
        { name: "Chengdu", slug: "chengdu" }
      ]
    },
    {
      id: "india",
      name: "India",
      slug: "india",
      subtitle: "A colorful symphony of cultures, the majestic Taj Mahal, and enticing spices.",
      featuredImageGradient: "from-[#BAE6FD] to-[#38BDF8]",
      subDestinations: [
        { name: "Delhi", slug: "delhi" },
        { name: "Mumbai", slug: "mumbai" },
        { name: "Jaipur", slug: "jaipur" }
      ]
    },
    {
      id: "others",
      name: "Others",
      slug: "others",
      subtitle: "Explore other breathtaking dream destinations across the globe.",
      featuredImageGradient: "from-[#7DD3FC] to-[#0284C7]",
      subDestinations: [
        { name: "Europe", slug: "europe" },
        { name: "America", slug: "america" },
        { name: "Australia", slug: "australia" }
      ]
    }
  ]
};

export const indonesianRegions = localizedRegions["id"];
