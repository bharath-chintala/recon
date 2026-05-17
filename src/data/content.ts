// ─── Recon International — Content Data ────────────────────────────────────
// All site-wide copy and structured data lives here.

export interface Event {
  id: string
  title: string
  date: string
  location: string
  category: 'Conference' | 'Festival' | 'Cultural Exchange' | 'Workshop'
  description: string
  image: string
  featured: boolean
}

export interface Testimonial {
  id: string
  name: string
  role: string
  country: string
  quote: string
  avatar: string
  rating: number
}

export interface Initiative {
  id: string
  title: string
  subtitle: string
  description: string
  bullets: string[]
  image: string
  color: string
  stats: { label: string; value: string }[]
}

export interface TrustMember {
  id: string
  name: string
  role: string
  organisation: string
  country: string
  portrait: string
  bio: string
}

// ─── Events ────────────────────────────────────────────────────────────────

export const events: Event[] = [
  {
    id: 'evt-001',
    title: 'Global Heritage Summit 2026',
    date: '2026-07-15',
    location: 'New Delhi, India',
    category: 'Conference',
    description:
      'A gathering of cultural leaders, policymakers, and heritage practitioners to shape the future of cross-border cultural diplomacy.',
    image: '/images/festivals.jpg',
    featured: true,
  },
  {
    id: 'evt-002',
    title: 'Festival of Living Traditions',
    date: '2026-08-22',
    location: 'Jaipur, India',
    category: 'Festival',
    description:
      'A ten-day celebration of living art forms — from Kathak to Kalaripayattu — uniting practitioners from 32 nations.',
    image: '/images/festivals.jpg',
    featured: true,
  },
  {
    id: 'evt-003',
    title: 'Indo-European Youth Exchange',
    date: '2026-09-10',
    location: 'Vienna, Austria',
    category: 'Cultural Exchange',
    description:
      'A structured 21-day immersive exchange programme for young artists and scholars aged 18–30 from India and the EU.',
    image: '/images/temples.jpg',
    featured: false,
  },
  {
    id: 'evt-004',
    title: 'Traditional Craft Masters Workshop',
    date: '2026-10-05',
    location: 'Varanasi, India',
    category: 'Workshop',
    description:
      'Master weavers, potters, and metalworkers guide participants through dying craft traditions at risk of extinction.',
    image: '/images/festivals.jpg',
    featured: false,
  },
  {
    id: 'evt-005',
    title: 'Silk Route Symposium',
    date: '2026-11-18',
    location: 'Samarkand, Uzbekistan',
    category: 'Conference',
    description:
      'An interdisciplinary academic symposium tracing the cultural and economic legacy of the ancient Silk Route.',
    image: '/images/temples.jpg',
    featured: true,
  },
]

// ─── Testimonials ───────────────────────────────────────────────────────────

export const testimonials: Testimonial[] = [
  {
    id: 'tst-001',
    name: 'Dr. Amara Singh',
    role: 'Cultural Attaché',
    country: 'India',
    quote:
      'Recon International transformed our ministry\'s approach to soft power. Their frameworks for cultural exchange are unmatched in the diplomatic world.',
    avatar: '/images/portraits.jpg',
    rating: 5,
  },
  {
    id: 'tst-002',
    name: 'Prof. Elena Vasquez',
    role: 'Director, UNESCO Cultural Chair',
    country: 'Spain',
    quote:
      'The depth of research and sensitivity with which Recon approaches intangible heritage preservation is truly remarkable. A gold standard in the field.',
    avatar: '/images/portraits.jpg',
    rating: 5,
  },
  {
    id: 'tst-003',
    name: 'James Okafor',
    role: 'Programme Lead',
    country: 'Nigeria',
    quote:
      'Working with Recon on our Pan-African cultural exchange opened doors we never imagined. The network and expertise they bring is extraordinary.',
    avatar: '/images/portraits.jpg',
    rating: 5,
  },
  {
    id: 'tst-004',
    name: 'Minister Yuki Tanaka',
    role: 'Deputy Minister of Culture',
    country: 'Japan',
    quote:
      'Recon International brokered our most successful bilateral cultural agreement in two decades. Their understanding of cross-cultural nuance is unparalleled.',
    avatar: '/images/portraits.jpg',
    rating: 5,
  },
]

// ─── Initiatives ────────────────────────────────────────────────────────────

export const initiatives: Initiative[] = [
  {
    id: 'ini-001',
    title: 'AWAKEN THROUGH TRAVEL',
    subtitle: 'Nourish mind and soul',
    description: 'Experience transformative journeys that blend spiritual practices with cultural exploration in the most serene destinations.',
    bullets: [
      'Transformative journeys that nourish mind and soul',
      'Blend of spiritual practices and cultural exploration',
      'Carefully curated retreats in serene destinations',
      'Travel that leaves a lasting inner imprint',
    ],
    image: '/images/init1.png',
    color: '#335C8B',
    stats: [
      { label: 'Destinations', value: '12+' },
      { label: 'Journeys', value: '50+' },
      { label: 'Attendees', value: '2500+' }
    ]
  },
  {
    id: 'ini-002',
    title: 'JOURNEYS OF THE SOUL',
    subtitle: 'Powerful destinations',
    description: 'Sacred journeys designed for inner peace and self-discovery through mindful travel and cultural immersion.',
    bullets: [
      'Sacred journeys to spiritually powerful destinations',
      'Mindful travel experiences blending nature, culture, and devotion',
      'Guided retreats focused on inner peace and self-discovery',
      'Thoughtfully designed itineraries for balance and transformation',
    ],
    image: '/images/init2.png',
    color: '#2a6f8e',
    stats: [
      { label: 'Sites', value: '45+' },
      { label: 'Retreats', value: '30+' },
      { label: 'Countries', value: '8' }
    ]
  },
  {
    id: 'ini-003',
    title: 'SACRED PATHS',
    subtitle: 'Reflection and healing',
    description: 'Pilgrimages to ancient temples and holy landscapes, designed for reflection, devotion, and spiritual healing.',
    bullets: [
      'Pilgrimages to ancient temples and holy landscapes',
      'Travel designed for reflection, devotion, and healing',
      'Small-group journeys guided by experienced facilitators',
      'Moments of silence, prayer, and spiritual connection',
    ],
    image: '/images/init3.png',
    color: '#4a6fa5',
    stats: [
      { label: 'Temples', value: '120+' },
      { label: 'Groups', value: '200+' },
      { label: 'Healing', value: '100%' }
    ]
  },
]

// ─── Trust Members ──────────────────────────────────────────────────────────

export const trustMembers: TrustMember[] = [
  {
    id: 'trm-001',
    name: 'SHRI KALUVA CHANDRA SHEKHER RAO',
    role: 'Founder & Managing Trustee',
    organisation: 'Recon International',
    country: 'India',
    portrait: '/images/portraits.jpg',
    bio: 'Born in Hathnoora Vill & Mdl, Medak Dist, Telangana State, he holds a postgraduate degree in MA Psychology and comes from an agricultural family. As the founder of "Recon International," he has excelled in strategic planning across sectors such as tourism and culture, coordinating numerous conferences and cultural programs at national and international levels for over two decades. His mission focuses on promoting and preserving cultural heritage and spiritual values through Indian classical, folk, and tribal dance and music. Supported by various governmental and non-governmental organizations, he aims to nurture emerging artists and ensure the transmission of cultural traditions to future generations. He is dedicated to establishing the "Domicile of Rama Rajya" ashram in Ayodhya, providing high-quality accommodation, cuisine, and transportation for devotees.',
  },
  {
    id: 'trm-002',
    name: 'SHRI VEMPATI MADHAVA NAIDU GARU',
    role: 'Trustee & Secretary',
    organisation: 'Recon International',
    country: 'India',
    portrait: '/images/portraits.jpg',
    bio: 'Shri Madhava Naidu Garu, from Tirumala Tirupati, is renowned for his deep devotion to Sri Venkateswara. For the past 50 years, he has exemplified the spirit of generosity and charity, dedicating his life to serving others. His commitment to helping those in need is unwavering; throughout this extensive period, he has never uttered the words "No," "Not possible," "Don\'t know," or "Don\'t do" in response to requests for assistance. This remarkable consistency reflects not only his boundless generosity but also his deep sense of responsibility towards others. His actions embody a profound understanding of service as an expression of faith, reflecting the principles of kindness and selflessness inspired by his devotion. Shri Madhava Naidu Garu\'s life stands as a testament to altruism and dedication, making him a revered figure in his community and a living example of compassion.',
  },
  {
    id: 'trm-003',
    name: 'MS PALLAVI N',
    role: 'Trustee',
    organisation: 'Recon International',
    country: 'India',
    portrait: '/images/portraits.jpg',
    bio: 'Ms. Pallavi N, an MBA graduate and accomplished Financial Consultant, has dedicated the past seven years to serving as a Trustee of the Recon International Charitable Trust in Hyderabad. In this role, she has spearheaded numerous Corporate Social Responsibility (CSR) initiatives focused on uplifting marginalized communities, with particular emphasis on supporting visually challenged students. Notably, she organized a transformative pilgrimage for approximately 400 visually impaired individuals to the Tirumala Temple, fulfilling their lifelong aspirations and demonstrating the power of community collaboration. To ensure the success of this initiative, she worked closely with esteemed organizations such as Tirupati Tirumala Devasthanam, South Central Railway, and APSRTC. She is deeply committed to Women\'s Empowerment, having developed counselling programs that support both personal and professional growth.',
  },
]
