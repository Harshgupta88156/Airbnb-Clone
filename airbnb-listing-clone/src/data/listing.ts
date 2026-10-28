import type { Listing, Photo, PhotoRoom } from "@/types/listing";

const LANDSCAPE = { width: 1440, height: 1080 };
const WIDE = { width: 1440, height: 808 };

function room(
  id: string,
  name: string,
  features: string[],
  photoCount: number,
  size = LANDSCAPE,
): PhotoRoom {
  const photos: Photo[] = Array.from({ length: photoCount }, (_, i) => {
    const photoId = `${id}-${String(i + 1).padStart(2, "0")}`;
    return { id: photoId, src: `/images/listing/${photoId}.jpeg`, room: name, ...size };
  });
  return { id, name, features, photos };
}

const rooms: PhotoRoom[] = [
  room("living-room-1", "Living room 1", ["Sofa", "Air conditioning", "Ceiling fan", "TV"], 3),
  room("living-room-2", "Living room 2", ["Ceiling fan", "Hot tub"], 7),
  room(
    "full-kitchen",
    "Full kitchen",
    [
      "Freezer",
      "Fridge",
      "Blender",
      "Cooker",
      "Cooking basics",
      "Kettle",
      "Microwave",
      "Toaster",
      "Wine glasses",
      "Coffee",
      "Crockery and cutlery",
    ],
    2,
  ),
  room(
    "bedroom",
    "Bedroom",
    [
      "Double bed",
      "Air conditioning",
      "Bed linen",
      "Ceiling fan",
      "Clothes storage",
      "Cot",
      "Hangers",
      "Iron",
      "Room-darkening blinds",
      "Cleaning available during stay",
      "Cleaning products",
      "Long-term stays allowed",
      "Private entrance",
      "Wifi",
    ],
    6,
  ),
  room("full-bathroom", "Full bathroom", ["Hairdryer", "Hot water", "Shampoo", "Shower gel"], 1),
  room("gym", "Gym", ["Air conditioning", "Gym", "Exercise equipment", "Ceiling fan"], 5),
  room("exterior", "Exterior", [], 6, WIDE),
  room("pool", "Pool", ["Pool"], 3),
  room("additional", "Additional photos", [], 10),
];

const photoById = new Map(rooms.flatMap((r) => r.photos).map((p) => [p.id, p]));
const findPhoto = (id: string) => {
  const found = photoById.get(id);
  if (!found) throw new Error(`Unknown photo id "${id}"`);
  return found;
};

export const listing: Listing = {
  title: "Romantic Jacuzzi 1BHK Candolim | Mirashya UG10",
  documentTitle:
    "Romantic Jacuzzi 1BHK Candolim | Mirashya UG10 - Serviced apartments for Rent in Candolim, Goa, India - Airbnb",
  headline: "Entire serviced apartment in Candolim, India",
  capacity: ["3 guests", "1 bedroom", "1 bed", "1 bathroom"],
  rating: { score: "4.95", reviewCount: 19 },
  guestFavouriteBlurb: "One of the most loved homes on Airbnb, according to guests",

  host: {
    name: "Mirashya Homes",
    avatar: "/images/people/host.jpeg",
    yearsHosting: 2,
    reviewCount: "1,463",
    rating: "4.68",
    facts: [
      { icon: "balloon", text: "Born in the 80s" },
      { icon: "school", text: "Where I went to school: NICMAR GOA" },
    ],
    coHosts: [
      { name: "Sharath", avatar: "/images/people/cohost-1.jpg" },
      { name: "Aman Dev Pahwa", avatar: "/images/people/cohost-2.jpg" },
      { name: "Maria Karen Priyanka", avatar: "/images/people/cohost-3.jpg" },
      { name: "Simran", avatar: "/images/people/guest-5.jpeg" },
      { name: "Pallavi", avatar: "/images/people/guest-1.jpeg" },
      { name: "Sanyukta", avatar: "/images/people/guest-2.jpeg" },
      { name: "Shruti", tone: "rose" },
      { name: "Amisha", tone: "sky" },
    ],
    responseRate: "100%",
    responseTime: "Responds within an hour",
  },

  highlights: [
    {
      icon: "outdoorEntertainment",
      title: "Outdoor entertainment",
      description: "The pool and alfresco dining are great for summer trips.",
    },
    {
      icon: "ceilingFan",
      title: "Designed for staying cool",
      description: "Beat the heat with the A/C and ceiling fan.",
    },
    {
      icon: "selfCheckIn",
      title: "Self check-in",
      description: "You can check in with the building staff.",
    },
  ],

  description:
    "🌴 Plan Your Relaxing Holiday at Amor De Goa by Mirashya Homes! ✨ Stay in this cozy 1BHK in the heart of Candolim, featuring a private jacuzzi 🛁 for the perfect unwind. Enjoy high-speed WiFi 💻, Smart TV 📺, pet-friendly comfort 🐾, and stylish interiors. Just minutes from Candolim Beach 🏖️, popular cafés, restaurants, and nightlife 🍹, it’s ideal for couples seeking romance, relaxation, and a touch of luxury in North Goa. ❤️🌴",

  sleeping: [
    { room: "Bedroom", beds: "1 double bed", photo: findPhoto("bedroom-01") },
    { room: "Living room", beds: "1 sofa", photo: findPhoto("living-room-1-01") },
  ],

  amenityPreview: [
    { label: "Kitchen", icon: "kitchen" },
    { label: "Wifi", icon: "wifi" },
    { label: "Dedicated workspace", icon: "workspace" },
    { label: "Free parking on premises", icon: "parking" },
    { label: "Pool", icon: "pool" },
    { label: "Hot tub", icon: "hotTub" },
    { label: "Pets allowed", icon: "pets" },
    { label: "Exterior security cameras on property", icon: "securityCamera" },
    { label: "Carbon monoxide alarm", icon: "carbonMonoxideAlarm", unavailable: true },
    { label: "Smoke alarm", icon: "smokeAlarm", unavailable: true },
  ],
  amenityCount: 50,
  amenityGroups: [
    {
      title: "Bathroom",
      amenities: [
        { label: "Hairdryer", icon: "hairdryer" },
        { label: "Cleaning products", icon: "cleaningProducts" },
        { label: "Shampoo", icon: "shampoo" },
        { label: "Hot water", icon: "hotWater" },
        { label: "Shower gel", icon: "showerGel" },
      ],
    },
    {
      title: "Bedroom and laundry",
      amenities: [
        { label: "Washing machine", icon: "washingMachine" },
        { label: "Hangers", icon: "hangers" },
        { label: "Bed linen", icon: "bedLinen" },
        { label: "Room-darkening blinds", icon: "blinds" },
        { label: "Iron", icon: "iron" },
        { label: "Clothes storage", icon: "clothesStorage" },
        { label: "Cot", icon: "cot" },
      ],
    },
    { title: "Entertainment", amenities: [{ label: "TV", icon: "tv" }] },
    { title: "Family", amenities: [{ label: "Cot", icon: "cot" }] },
    {
      title: "Heating and cooling",
      amenities: [
        { label: "Air conditioning", icon: "airConditioning" },
        { label: "Ceiling fan", icon: "ceilingFan" },
      ],
    },
    {
      title: "Home safety",
      amenities: [
        { label: "Exterior security cameras on property", icon: "securityCamera" },
        { label: "Carbon monoxide alarm", icon: "carbonMonoxideAlarm", unavailable: true },
        { label: "Smoke alarm", icon: "smokeAlarm", unavailable: true },
      ],
    },
    {
      title: "Internet and office",
      amenities: [
        { label: "Wifi", icon: "wifi" },
        { label: "Dedicated workspace", icon: "workspace" },
      ],
    },
    {
      title: "Kitchen and dining",
      amenities: [
        { label: "Kitchen", icon: "kitchen" },
        { label: "Fridge", icon: "fridge" },
        { label: "Freezer", icon: "fridge" },
        { label: "Microwave", icon: "microwave" },
        { label: "Cooking basics", icon: "kitchen" },
        { label: "Crockery and cutlery", icon: "crockery" },
        { label: "Kettle", icon: "kettle" },
        { label: "Coffee", icon: "coffee" },
        { label: "Wine glasses", icon: "wineGlasses" },
        { label: "Toaster", icon: "toaster" },
        { label: "Blender", icon: "blender" },
        { label: "Cooker", icon: "cooker" },
      ],
    },
    {
      title: "Location features",
      amenities: [{ label: "Private entrance", icon: "privateEntrance" }],
    },
    {
      title: "Outdoor",
      amenities: [
        { label: "Patio or balcony", icon: "patio" },
        { label: "Outdoor dining area", icon: "outdoorDining" },
      ],
    },
    {
      title: "Parking and facilities",
      amenities: [
        { label: "Free parking on premises", icon: "parking" },
        { label: "Pool", icon: "pool" },
        { label: "Hot tub", icon: "hotTub" },
        { label: "Gym", icon: "gym" },
      ],
    },
    {
      title: "Services",
      amenities: [
        { label: "Pets allowed", icon: "pets" },
        { label: "Cleaning available during stay", icon: "cleanliness" },
        { label: "Long-term stays allowed", icon: "longTermStays" },
        { label: "Self check-in", icon: "selfCheckIn" },
      ],
    },
  ],

  rooms,
  heroPhotoIds: [
    "living-room-2-04",
    "living-room-2-01",
    "living-room-2-02",
    "bedroom-01",
    "exterior-05",
  ],

  booking: {
    currency: "₹",
    totalForStay: 28499,
    defaultStay: { checkIn: "2026-10-18", checkOut: "2026-10-23" },
    guests: "2 guests",
    freeCancellationBefore: "17 October",
    location: "Candolim",
    unavailable: [
      "2026-11-18",
      "2026-11-19",
      "2026-11-20",
      "2026-11-21",
      "2026-11-22",
      "2026-11-23",
      "2026-11-24",
      "2026-11-29",
      "2026-11-30",
    ],
  },

  reviews: {
    blurb: "This home is a guest favourite based on ratings, reviews and reliability",
    // Share of reviews per star rating, 5 → 1.
    distribution: [0.95, 0.05, 0, 0, 0],
    categories: [
      { label: "Cleanliness", score: "5.0", icon: "cleanliness" },
      { label: "Accuracy", score: "5.0", icon: "accuracy" },
      { label: "Check-in", score: "5.0", icon: "key" },
      { label: "Communication", score: "5.0", icon: "communication" },
      { label: "Location", score: "4.8", icon: "map" },
      { label: "Value", score: "4.8", icon: "tag" },
    ],
    tags: [
      { label: "Comfort", count: 6, image: "/images/review-tags/comfort.png" },
      { label: "Accuracy", count: 5, image: "/images/review-tags/accuracy.png" },
      { label: "Hot tub", count: 5, image: "/images/review-tags/hot-tub.png" },
      { label: "Condition", count: 4, image: "/images/review-tags/condition.png" },
      { label: "Hospitality", count: 8, image: "/images/review-tags/hospitality.png" },
      { label: "Cleanliness", count: 4, image: "/images/review-tags/cleanliness.png" },
      { label: "Amenities", count: 2, image: "/images/review-tags/amenities.png" },
      { label: "Decor", count: 2, image: "/images/review-tags/decor.png" },
      { label: "Indoor spaces", count: 2, image: "/images/review-tags/indoor-spaces.png" },
      { label: "Location", count: 2, image: "/images/review-tags/location.png" },
    ],
    featured: [
      {
        author: { name: "Amit", tone: "peach" },
        memberFor: "2 months on Airbnb",
        postedAt: "1 week ago",
        text: "Very helpful and responsive team. Safe and peaceful stay. loved everything about the property.",
      },
      {
        author: { name: "Aheesh", avatar: "/images/people/guest-1.jpeg" },
        memberFor: "3 years on Airbnb",
        postedAt: "2 weeks ago",
        text: "We had a wonderful stay. The apartment was clean, comfortable, and exactly as shown in the photos. The host was very responsive and helpful throughout our stay. We would definitely recommend this place and would love to stay here again.",
      },
      {
        author: { name: "Samiksha", avatar: "/images/people/guest-2.jpeg" },
        memberFor: "8 months on Airbnb",
        postedAt: "May 2026",
        text: "the host nitish was really great help",
      },
      {
        author: { name: "Vedant", tone: "lavender" },
        memberFor: "4 years on Airbnb",
        postedAt: "May 2026",
        text: "We had an amazing stay at this property in Goa! The entire home was spotless and exceptionally well-maintained, making us feel comfortable from the moment we arrived. The cleanliness standards were truly impressive, with every corner of the house looking fresh and pristine.\nThe highlight of our stay was definitely the jacuzzi. It was clean, well-kept, and the perfect place to relax after a day of exploring Goa. It added a luxurious touch to our vacation and made our experience even more memorable.\nThe property was exactly as described, well-equipped, and offered a peaceful atmosphere. We would highly recommend this place to anyone looking for a comfortable, clean, and relaxing stay in Goa. Looking forward to visiting again!",
      },
      {
        author: { name: "Vaibhav S", avatar: "/images/people/guest-3.jpeg" },
        memberFor: "3 years on Airbnb",
        postedAt: "May 2026",
        text: "Great great experience living out there , can't expect more , will always look for it in the future and will recommend my friends too.",
      },
      {
        author: { name: "Mohd", avatar: "/images/people/guest-4.jpeg" },
        memberFor: "5 years on Airbnb",
        postedAt: "May 2026",
        text: "Great place. Exactly as described in the listing.",
      },
    ],
  },

  location: {
    label: "Candolim, Goa, India",
    neighbourhood:
      "Located in the heart of Candolim, Amor de Goa offers a peaceful stay with easy access to beaches, cafés, and popular attractions.",
  },

  thingsToKnow: [
    {
      title: "Cancellation policy",
      icon: "calendarCancel",
      lines: [
        "Free cancellation before 17 October. Cancel before check-in on 18 October for a partial refund.",
        "Review this host’s full policy for details.",
      ],
    },
    {
      title: "House rules",
      icon: "key",
      lines: ["Check-in after 2:00 pm", "Checkout before 11:00 am", "3 guests maximum"],
    },
    {
      title: "Safety & property",
      icon: "shield",
      lines: [
        "Carbon monoxide alarm not reported",
        "Smoke alarm not reported",
        "Exterior security cameras on property",
      ],
    },
  ],

  nearbyStays: [
    {
      title: "Beautiful Studio with a view to die for",
      totalPrice: "₹23,600",
      rating: "4.91",
      image: "/images/nearby/stay-1.jpeg",
    },
    {
      title: "NAQAB - 1bhk with private pool",
      totalPrice: "₹42,218",
      rating: "4.95",
      image: "/images/nearby/stay-2.jpeg",
    },
    {
      title: "Greentique Luxury Flat with plunge pool, Calangute",
      totalPrice: "₹44,506",
      rating: "4.94",
      image: "/images/nearby/stay-3.jpeg",
    },
    {
      title: "The Tropical Studio | 5 mins to Beach",
      totalPrice: "₹22,824",
      rating: "4.96",
      image: "/images/nearby/stay-4.jpeg",
    },
    {
      title: "Luxury Casa Bella 1BHK with plunge pool, Calangute",
      totalPrice: "₹39,942",
      rating: "4.95",
      image: "/images/nearby/stay-5.jpeg",
    },
    {
      title: "Kanso by Earthen Window | Jacuzzi | Terrace | Pool",
      totalPrice: "₹45,648",
      rating: "5.0",
      image: "/images/nearby/stay-6.jpeg",
    },
    {
      title: "Luxury Apt | Private Pool | 6 Mins from Beach",
      totalPrice: "₹48,786",
      rating: "4.93",
      image: "/images/nearby/stay-2.jpeg",
    },
    {
      title: "Serendipity Cottage - Calm Stay in Calangute-Baga.",
      totalPrice: "₹22,824",
      rating: "4.92",
      image: "/images/nearby/stay-4.jpeg",
    },
  ],
};

export const allPhotos: Photo[] = rooms.flatMap((r) => r.photos);
export const heroPhotos: Photo[] = listing.heroPhotoIds.map(findPhoto);
