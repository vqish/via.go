import { allCountries } from './countries';
import type { Country, City, Attraction } from '../types';

// Extended Country Type for the comprehensive database
export interface CountryDetails extends Country {
  officialName: string;
  nativeName: string;
  iso3: string;
  unRegion: string;
  largestCity: string;
  governmentType: string;
  nationalDish: string;
  nationalAnimal: string;
  nationalFlower: string;
  nationalBird: string;
  drivingSide: 'left' | 'right';
  voltage: string;
  drinkingWaterSafety: string;
  mobileNetworkQuality: string;
  simProviders: string[];
  etiquetteTips: {
    customs: string;
    dress: string;
    tipping: string;
    photography: string;
  };
  budgets: {
    backpacker: number;
    midRange: number;
    luxury: number;
  };
  weatherProfile: {
    spring: { temp: string; desc: string };
    summer: { temp: string; desc: string };
    autumn: { temp: string; desc: string };
    winter: { temp: string; desc: string };
  };
  bestTimeToVisitDetails: {
    rating: string;
    months: string;
    reason: string;
    crowdLevel: string;
    tempRange: string;
    rainfall: string;
    festivals: string;
  };
  visaDetails: {
    visaFree: boolean;
    visaOnArrival: boolean;
    eVisa: boolean;
    traditionalVisa: boolean;
    validity: string;
    documents: string[];
    processingTime: string;
    officialWebsite: string;
    typeText: string;
  };
  foodGuide: {
    topFoods: { name: string; description: string; origin: string; cost: string; whereToTry: string }[];
    streetFood: string[];
    desserts: string[];
    drinks: string[];
    veganNotes: string;
    halalNotes: string;
  };
  cultureGuide: {
    clothing: string;
    music: string;
    greetings: string;
    festivals: string[];
    holidays: string[];
  };
  suggestedItineraries: {
    days: number;
    title: string;
    summary: string;
    stops: string[];
  }[];
  transportationDetails: {
    airports: string[];
    railNetwork: string;
    publicTransport: string;
    taxiAndRideshare: string;
  };
}

// Hand-coded database for top featured countries
const topFeaturedCountries: Record<string, Partial<CountryDetails>> = {
  jp: {
    officialName: 'Japan',
    nativeName: '日本国 (Nihon-koku)',
    iso3: 'JPN',
    unRegion: 'Eastern Asia',
    largestCity: 'Tokyo',
    governmentType: 'Unitary parliamentary constitutional monarchy',
    nationalDish: 'Sushi / Curry Rice',
    nationalAnimal: 'Green Pheasant',
    nationalFlower: 'Cherry Blossom (Sakura)',
    nationalBird: 'Green Pheasant',
    drivingSide: 'left',
    voltage: '100V (Type A/B)',
    drinkingWaterSafety: '100% Safe (Tap water is potable)',
    mobileNetworkQuality: '5G Available / Excellent coverage',
    simProviders: ['IIJmio', 'U-Mobile', 'B-Mobile', 'Docomo eSIM'],
    etiquetteTips: {
      customs: 'Bow when greeting. Never tip. Pay cash or IC card. Carry your trash home.',
      dress: 'Neat, modest, smart casual. Cover tattoos in traditional bathhouses.',
      tipping: 'Strictly no tipping. Tipping is considered rude or confusing.',
      photography: 'Do not take photos of Geishas without permission. Avoid shooting private property.',
    },
    budgets: { backpacker: 60, midRange: 150, luxury: 450 },
    weatherProfile: {
      spring: { temp: '10–20°C', desc: 'Mild days with blooming sakura blossoms.' },
      summer: { temp: '25–35°C', desc: 'Hot, highly humid, and rainy in early summer.' },
      autumn: { temp: '15–22°C', desc: 'Pleasant temperatures and stunning red maple foliage.' },
      winter: { temp: '0–10°C', desc: 'Cold, dry, and snowy in northern areas.' }
    },
    bestTimeToVisitDetails: {
      rating: '★★★★★',
      months: 'March–May / Oct–Nov',
      reason: 'Perfect weather for sightseeing, cherry blossoms, and fall leaves.',
      crowdLevel: 'High (Spring Peak)',
      tempRange: '12–21°C',
      rainfall: 'Low to moderate',
      festivals: 'Gion Matsuri, Hanami, Sanja Matsuri'
    },
    foodGuide: {
      topFoods: [
        { name: 'Sushi', description: 'Vinegared rice topped with fresh raw seafood.', origin: 'Tokyo', cost: '¥1,500 - ¥10,000+', whereToTry: 'Tsukiji Outer Market' },
        { name: 'Ramen', description: 'Wheat noodles in rich pork, soy, or miso broth.', origin: 'Fukuoka/Hokkaido', cost: '¥800 - ¥1,500', whereToTry: 'Ichiran Shinjuku' },
        { name: 'Tempura', description: 'Lightly battered and deep-fried seafood and vegetables.', origin: 'Tokyo', cost: '¥1,200 - ¥4,000', whereToTry: 'Tempura Tsunahachi' }
      ],
      streetFood: ['Takoyaki', 'Yakitori', 'Taiyaki', 'Dango'],
      desserts: ['Mochi', 'Matcha Ice Cream', 'Dorayaki'],
      drinks: ['Green Tea', 'Sake', 'Shochu', 'Matcha Latte'],
      veganNotes: 'Veganism can be challenging due to dashi (fish stock). Look for Shojin Ryori (Buddhist temple food).',
      halalNotes: 'Halal restaurants are growing in Tokyo/Osaka. Check for halal certification certificates.'
    },
    cultureGuide: {
      clothing: 'Kimono and Yukata are worn for festivals and special tea occasions.',
      music: 'Shakuhachi flute, Koto harp, and Shamisen string instruments.',
      greetings: 'Bow (Rei) is standard. Handshakes are common with foreigners.',
      festivals: ['Gion Matsuri (Kyoto)', 'Nebuta Matsuri (Aomori)', 'Yuki Matsuri (Sapporo)'],
      holidays: ['New Year (Jan 1)', 'Golden Week (Apr 29 - May 5)', 'Obon (mid-August)']
    },
    transportationDetails: {
      airports: ['Haneda Airport (HND)', 'Narita International Airport (NRT)', 'Kansai Airport (KIX)'],
      railNetwork: 'Shinkansen (Bullet Trains) and dense JR network connect all islands.',
      publicTransport: 'Extensive subways, trains, and local buses. IC Cards (Suica/Pasmo) work nationwide.',
      taxiAndRideshare: 'Taxis are clean but expensive. Uber is mostly registered luxury cabs.'
    }
  },
  fr: {
    officialName: 'French Republic',
    nativeName: 'République française',
    iso3: 'FRA',
    unRegion: 'Western Europe',
    largestCity: 'Paris',
    governmentType: 'Semi-presidential republic',
    nationalDish: 'Pot-au-Feu / Coq au Vin',
    nationalAnimal: 'Gallic Rooster',
    nationalFlower: 'Iris',
    nationalBird: 'Gallic Rooster',
    drivingSide: 'right',
    voltage: '230V (Type C/E)',
    drinkingWaterSafety: 'Safe in all cities',
    mobileNetworkQuality: 'Excellent 4G/5G coverage',
    simProviders: ['Orange', 'SFR', 'Bouygues', 'Free Mobile'],
    etiquetteTips: {
      customs: 'Greet with "Bonjour" before speaking. Keep meals slow and relaxed.',
      dress: 'Casual chic. Avoid gym clothes, flip-flops, or shorts in restaurants.',
      tipping: 'Service is included. Small tips (1-2 euros) are appreciated but not required.',
      photography: 'Respect privacy. No photos of police or state security installations.',
    },
    budgets: { backpacker: 70, midRange: 180, luxury: 500 },
    weatherProfile: {
      spring: { temp: '8–18°C', desc: 'Fresh days, blooming gardens, and occasional showers.' },
      summer: { temp: '20–30°C', desc: 'Sunny and hot, especially on the Riviera beaches.' },
      autumn: { temp: '10–18°C', desc: 'Crisp air, turning leaves, and harvest seasons.' },
      winter: { temp: '2–8°C', desc: 'Cold, cloudy, with snow in alpine ski resorts.' }
    },
    bestTimeToVisitDetails: {
      rating: '★★★★★',
      months: 'April–June / Sept–Oct',
      reason: 'Beautiful weather, lower tourist crowds, and pleasant walking days.',
      crowdLevel: 'Moderate to High',
      tempRange: '14–24°C',
      rainfall: 'Moderate',
      festivals: 'Bastille Day, Cannes Film Festival, Fête de la Musique'
    },
    foodGuide: {
      topFoods: [
        { name: 'Croissant', description: 'Buttery, flaky, crescent-shaped pastry bread.', origin: 'Paris', cost: '€1.20 - €2.50', whereToTry: 'Du Pain et des Idées' },
        { name: 'Coq au Vin', description: 'Chicken braised in red Burgundy wine with mushrooms.', origin: 'Burgundy', cost: '€18 - €35', whereToTry: 'Le Bistro d\'a Côté' },
        { name: 'Crêpes', description: 'Thin wheat pancake filled with sweet or savory spreads.', origin: 'Brittany', cost: '€3.50 - €8', whereToTry: 'Breizh Café' }
      ],
      streetFood: ['Bagels', 'Panini', 'Socca', 'Galettes'],
      desserts: ['Macarons', 'Crème Brûlée', 'Éclair', 'Tarte Tatin'],
      drinks: ['Red Wine', 'Champagne', 'Calvados', 'Café au Lait'],
      veganNotes: 'Growing in Paris and major cities, but traditional french bistros heavily feature meat and butter.',
      halalNotes: 'Widely available in cities due to a large North African community. Look for Halal butchers.'
    },
    cultureGuide: {
      clothing: 'Historically berets, but modern fashion is clean, tailored, and stylish.',
      music: 'Accordion-driven Chanson, French EDM (Daft Punk), and classical composers.',
      greetings: '"Bonjour" during the day, "Bonsoir" at night. "La bise" cheek-kisses for friends.',
      festivals: ['Cannes Film Festival', 'Nice Carnival', 'Fête de la Musique'],
      holidays: ['Bastille Day (July 14)', 'All Saints Day (Nov 1)', 'Christmas (Dec 25)']
    },
    transportationDetails: {
      airports: ['Charles de Gaulle (CDG)', 'Orly Airport (ORY)', 'Nice Côte d\'Azur (NCE)'],
      railNetwork: 'SNCF TGV High-Speed trains connect Paris to Lyon, Marseille, and Bordeaux.',
      publicTransport: 'Metros, trams, and urban buses operate in all major cities.',
      taxiAndRideshare: 'Uber and local taxi apps (G7) are active in Paris and Lyon.'
    }
  }
};

// Procedural Country details generator for the remaining 195 countries
export function generateCountryDetails(countryId: string, nationality: string = 'us'): CountryDetails {
  const basic = allCountries.find((c) => c.id === countryId) || allCountries[0];
  const featured = topFeaturedCountries[countryId];
  
  // Custom Visa logic
  let visaType = 'eVisa Required';
  let visaFree = false;
  let visaOnArrival = false;
  let eVisa = true;
  let traditionalVisa = false;
  let validityText = '30 days';
  let requiredDocs = ['Valid Passport', 'Return ticket', 'Hotel booking', 'eVisa copy'];
  let processingTimeText = '3 business days';
  
  const isSchengen = ['be', 'cz', 'dk', 'de', 'ee', 'gr', 'es', 'fr', 'hr', 'it', 'lv', 'lt', 'lu', 'hu', 'mt', 'nl', 'at', 'pl', 'pt', 'si', 'sk', 'fi', 'se', 'is', 'li', 'no', 'ch'].includes(countryId);
  const userNationalitySchengen = ['be', 'cz', 'dk', 'de', 'ee', 'gr', 'es', 'fr', 'hr', 'it', 'lv', 'lt', 'lu', 'hu', 'mt', 'nl', 'at', 'pl', 'pt', 'si', 'sk', 'fi', 'se', 'is', 'li', 'no', 'ch'].includes(nationality);
  
  if (nationality === countryId) {
    visaType = 'Citizen';
    visaFree = true;
    eVisa = false;
    validityText = 'No limit';
    requiredDocs = ['National ID or Passport'];
    processingTimeText = 'Immediate';
  } else if (isSchengen && userNationalitySchengen) {
    visaType = 'Freedom of Movement';
    visaFree = true;
    eVisa = false;
    validityText = 'Unlimited';
    requiredDocs = ['Passport or Schengen ID card'];
    processingTimeText = 'No processing required';
  } else {
    // Standard rule subsets
    if (['us', 'gb', 'ca', 'au', 'jp', 'kr', 'de', 'fr', 'it', 'es'].includes(nationality)) {
      // Powerful passport exemption
      if (['th', 'vn', 'my', 'sg', 'id', 'br', 'ar', 'cl', 'za', 'mx', 'ma', 'tr', 'eg'].includes(countryId)) {
        visaType = 'Visa Free';
        visaFree = true;
        eVisa = false;
        validityText = '30 to 90 days';
        requiredDocs = ['Passport valid for 6 months', 'Return flight ticket'];
        processingTimeText = 'Immediate';
      } else if (['eg', 'jo', 'np', 'lk', 'mv'].includes(countryId)) {
        visaType = 'Visa on Arrival';
        visaOnArrival = true;
        eVisa = false;
        validityText = '30 days';
        requiredDocs = ['Passport', 'VoA fee in cash', 'Passport photo'];
        processingTimeText = 'On Arrival';
      } else {
        visaType = 'Traditional Visa Required';
        traditionalVisa = true;
        eVisa = false;
        requiredDocs = ['Valid Passport', 'Visa application form', 'Biometrics', 'Bank statement'];
        processingTimeText = '15 business days';
      }
    }
  }
  
  const typeText = visaType;

  const defaultDetails: CountryDetails = {
    id: basic.id,
    name: basic.name,
    code: basic.code,
    capital: basic.capital,
    currency: basic.currency,
    currencySymbol: basic.currencySymbol,
    languages: [basic.currency.split(' ')[0] + 'ian', 'English'],
    timeZone: 'UTC+1',
    climate: 'Temperate climate, warm summers and cool winters.',
    bestMonths: ['April', 'May', 'September', 'October'],
    visaInfo: `For ${nationality.toUpperCase()} passport holders: ${typeText}`,
    emergencyNumbers: { police: '112', ambulance: '112', fire: '112' },
    etiquette: [
      'Greet locals politely before requesting help.',
      'Dress modestly when visiting historic or religious sights.',
      'Check photography restrictions at monuments.'
    ],
    transportation: 'Taxis, localized buses, and rental car networks are common.',
    safetyInfo: 'Generally safe. Standard precautions against pickpockets are advised.',
    internetAvailability: 'good',
    simInfo: 'Prepaid SIM cards are readily available for tourists at international airports.',
    plugType: isSchengen ? 'Type C & F (230V)' : 'Type A & B (110V)',
    coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200',
    flagEmoji: basic.flagEmoji,
    continent: basic.continent,
    population: 12500000,
    area: 450000,
    callingCode: '+00',
    
    // Extended fields
    officialName: `Republic of ${basic.name}`,
    nativeName: `${basic.name}`,
    iso3: basic.code + 'X',
    unRegion: `${basic.continent} region`,
    largestCity: basic.capital,
    governmentType: 'Constitutional Parliamentary Republic',
    nationalDish: `${basic.name} Stew`,
    nationalAnimal: 'Golden Lion',
    nationalFlower: 'National Rose',
    nationalBird: 'Falcon',
    drivingSide: ['gb', 'au', 'jp', 'in', 'za', 'th', 'nz', 'sg', 'my', 'ke', 'lk'].includes(basic.id) ? 'left' : 'right',
    voltage: '230V / 50Hz',
    drinkingWaterSafety: ['us', 'ca', 'gb', 'fr', 'de', 'it', 'es', 'jp', 'au', 'nz', 'sg'].includes(basic.id) ? 'Safe to drink' : 'Filtered or bottled recommended',
    mobileNetworkQuality: 'Good 4G/LTE standard coverage',
    simProviders: ['Telecom Corp', 'CellNet', 'GlobalMobile'],
    etiquetteTips: {
      customs: 'Shake hands firmly. Say hello and thank you in the native tongue.',
      dress: 'Casual and respectful. Cover knees and shoulders at heritage monuments.',
      tipping: 'Small change is welcome; rounding up is typical.',
      photography: 'Always ask permission before filming people or residential sites.',
    },
    budgets: { backpacker: 40, midRange: 100, luxury: 300 },
    weatherProfile: {
      spring: { temp: '12–22°C', desc: 'Mild temperatures and blooming landscapes.' },
      summer: { temp: '24–32°C', desc: 'Warm, sunny, ideal for city walks and outdoor tours.' },
      autumn: { temp: '14–22°C', desc: 'Cooler days with red and yellow autumn colors.' },
      winter: { temp: '2–10°C', desc: 'Cold nights, brisk air, occasional rain or snow.' }
    },
    bestTimeToVisitDetails: {
      rating: '★★★★★',
      months: 'May–September',
      reason: 'Warm temperatures and sunny clear skies.',
      crowdLevel: 'Moderate',
      tempRange: '18–28°C',
      rainfall: 'Low',
      festivals: 'National Heritage Festival, Independence Day Parade'
    },
    visaDetails: {
      visaFree,
      visaOnArrival,
      eVisa,
      traditionalVisa,
      validity: validityText,
      documents: requiredDocs,
      processingTime: processingTimeText,
      officialWebsite: `https://evisa.gov.${basic.id}`,
      typeText
    },
    foodGuide: {
      topFoods: [
        { name: `Traditional ${basic.name} Stew`, description: 'Slow-cooked vegetables and meat with local herbs.', origin: basic.capital, cost: '$8 - $15', whereToTry: 'Old Town Bistro' },
        { name: 'Spiced Rice Pilaf', description: 'Fragrant basmati rice served with roasted chicken.', origin: 'Central Market', cost: '$6 - $12', whereToTry: 'City Plaza Eatery' },
        { name: 'Honey Glazed Fritters', description: 'Golden fried dough drizzled with orange-blossom honey syrup.', origin: 'Coastal towns', cost: '$3 - $5', whereToTry: 'Local Bakeries' }
      ],
      streetFood: ['Spiced Kebabs', 'Savory Pastries', 'Fried Dumplings'],
      desserts: ['Sweet Fruit Cakes', 'Milk puddings'],
      drinks: ['Spiced Tea', 'Freshly pressed juice', 'Local brew'],
      veganNotes: 'Vegetarian and bean options are usually available; check if chicken stock is used.',
      halalNotes: 'Look for local halal signage in restaurants or markets.'
    },
    cultureGuide: {
      clothing: 'Traditional attire features colorful woven cotton textiles and wraps.',
      music: 'A mix of percussion, folk string instruments, and rhythmic clapping.',
      greetings: 'A handshake or a warm nod accompanied by "Hello".',
      festivals: ['Heritage Culture Week', 'Harvest Moon Festival'],
      holidays: ['National Day', 'New Year\'s Day']
    },
    suggestedItineraries: [
      { days: 1, title: 'Express Capital Tour', summary: 'See the absolute best of the capital city in a single day.', stops: ['Old Market Square', 'National History Palace', 'Scenic Riverwalk'] },
      { days: 3, title: 'Heritage & Nature Escape', summary: 'Discover historic monuments and visit local natural parks.', stops: ['Capital City Museums', 'Emerald Lake Forest Reserve', 'Traditional Village Center'] },
      { days: 7, title: 'Ultimate Country Explorer', summary: 'Travel across regions, checking out top cities and natural wonders.', stops: ['Capital City Tour', 'Northern Mountains', 'Sunny Coast Beaches', 'Lakeside Towns'] }
    ],
    transportationDetails: {
      airports: [`${basic.name} International Airport (${basic.code}A)`],
      railNetwork: 'Intercity passenger trains connect main metropolitan centers.',
      publicTransport: 'Metropolitan buses and localized transit mini-cabs work everywhere.',
      taxiAndRideshare: 'Taxis operate on meters or flat negotiated fees.'
    }
  };

  // Merge featured if applicable
  return {
    ...defaultDetails,
    ...featured,
    etiquetteTips: {
      ...defaultDetails.etiquetteTips,
      ...(featured?.etiquetteTips || {})
    },
    weatherProfile: {
      ...defaultDetails.weatherProfile,
      ...(featured?.weatherProfile || {})
    },
    bestTimeToVisitDetails: {
      ...defaultDetails.bestTimeToVisitDetails,
      ...(featured?.bestTimeToVisitDetails || {})
    },
    foodGuide: {
      ...defaultDetails.foodGuide,
      ...(featured?.foodGuide || {})
    },
    cultureGuide: {
      ...defaultDetails.cultureGuide,
      ...(featured?.cultureGuide || {})
    },
    transportationDetails: {
      ...defaultDetails.transportationDetails,
      ...(featured?.transportationDetails || {})
    }
  };
}

// Procedural Cities Generator
export function getCountryCities(countryId: string): City[] {
  const basic = allCountries.find((c) => c.id === countryId) || allCountries[0];
  
  // Specific static overrides for high quality featured cities
  if (countryId === 'jp') {
    return [
      { id: 'tokyo', countryId: 'jp', name: 'Tokyo', description: 'Capital of Japan, blending modern skyscrapers with ancient shrines.', coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', location: { lat: 35.6762, lng: 139.6503 }, tags: ['metropolis', 'culture', 'food'] },
      { id: 'kyoto', countryId: 'jp', name: 'Kyoto', description: 'Ancient temple city and cultural heart of Japan.', coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800', location: { lat: 35.0116, lng: 135.7681 }, tags: ['temples', 'geisha', 'gardens'] },
      { id: 'osaka', countryId: 'jp', name: 'Osaka', description: 'Vibrant port city famous for its hearty street food and neon-lit canal streets.', coverImage: 'https://images.unsplash.com/photo-1589452271712-64b8a66c7b71?w=800', location: { lat: 34.6937, lng: 135.5023 }, tags: ['streetfood', 'castles', 'nightlife'] }
    ];
  }

  if (countryId === 'fr') {
    return [
      { id: 'paris', countryId: 'fr', name: 'Paris', description: 'City of light, romance, fashion, and art museum landmarks.', coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', location: { lat: 48.8566, lng: 2.3522 }, tags: ['art', 'romance', 'fashion'] },
      { id: 'nice', countryId: 'fr', name: 'Nice', description: 'Stunning coastal resort on the blue Mediterranean French Riviera.', coverImage: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800', location: { lat: 43.7102, lng: 7.2620 }, tags: ['beach', 'riviera', 'sunny'] }
    ];
  }

  // Generates 2 cities dynamically for any other country
  return [
    {
      id: `${countryId}-capital`,
      countryId,
      name: basic.capital,
      description: `The capital and largest city of ${basic.name}, rich in historic monuments, central markets, and government buildings.`,
      coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
      location: { lat: 0, lng: 0 },
      tags: ['capital', 'historic', 'markets']
    },
    {
      id: `${countryId}-secondary`,
      countryId,
      name: `${basic.name} Coastal Haven`,
      description: `A highly recommended scenic hub, famous for local getaways, pristine landscapes, and welcoming food joints.`,
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      location: { lat: 1, lng: 1 },
      tags: ['resort', 'nature', 'food']
    }
  ];
}

// Procedural Attractions Generator
export function getCountryAttractions(countryId: string): Attraction[] {
  const basic = allCountries.find((c) => c.id === countryId) || allCountries[0];
  
  if (countryId === 'jp') {
    return [
      { id: 'tokyo-shinjuku', cityId: 'tokyo', countryId: 'jp', name: 'Shinjuku Gyoen', description: 'Stunning royal gardens containing French, English, and traditional landscape elements.', address: 'Shinjuku City, Tokyo', category: 'park', images: ['https://images.unsplash.com/photo-1551801841-ecad875a5142?w=800'], openingHours: '9:00 AM - 4:30 PM', entryFee: '¥500', estimatedDuration: '2 hours', bestTime: 'Spring (Cherry Blossoms)', rating: 4.8, reviewCount: 1200, location: { lat: 35.6851, lng: 139.7099 } },
      { id: 'tokyo-sensoji', cityId: 'tokyo', countryId: 'jp', name: 'Senso-ji Temple', description: 'Tokyo\'s oldest and most iconic red Buddhist temple, located in Asakusa.', address: 'Taito City, Tokyo', category: 'temple', images: ['https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800'], openingHours: '6:00 AM - 5:00 PM', entryFee: 'Free', estimatedDuration: '1.5 hours', bestTime: 'Early Morning', rating: 4.7, reviewCount: 3400, location: { lat: 35.7147, lng: 139.7966 } },
      { id: 'kyoto-fushimi', cityId: 'kyoto', countryId: 'jp', name: 'Fushimi Inari Shrine', description: 'Famous mountain paths covered with thousands of vermilion Shinto torii gates.', address: 'Fushimi Ward, Kyoto', category: 'temple', images: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800'], openingHours: '24/7', entryFee: 'Free', estimatedDuration: '3 hours', bestTime: 'Morning or Evening', rating: 4.9, reviewCount: 5200, location: { lat: 34.9671, lng: 135.7727 } }
    ];
  }

  if (countryId === 'fr') {
    return [
      { id: 'paris-eiffel', cityId: 'paris', countryId: 'fr', name: 'Eiffel Tower', description: 'Iconic iron lattice tower on the Champ de Mars.', address: 'Avenue Anatole France, Paris', category: 'monument', images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800'], openingHours: '9:30 AM - 11:45 PM', entryFee: '€26', estimatedDuration: '2 hours', bestTime: 'Sunset', rating: 4.8, reviewCount: 8800, location: { lat: 48.8584, lng: 2.2945 } },
      { id: 'paris-louvre', cityId: 'paris', countryId: 'fr', name: 'Louvre Museum', description: 'The world\'s largest art museum, home to the Mona Lisa.', address: 'Rue de Rivoli, Paris', category: 'museum', images: ['https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=800'], openingHours: '9:00 AM - 6:00 PM', entryFee: '€17', estimatedDuration: '4 hours', bestTime: 'Morning', rating: 4.7, reviewCount: 9400, location: { lat: 48.8606, lng: 2.3376 } }
    ];
  }

  // Generates 2 attractions per city for any other country
  return [
    {
      id: `${countryId}-attr1`,
      cityId: `${countryId}-capital`,
      countryId,
      name: `${basic.name} National Museum`,
      description: `A spectacular archive hosting historic national treasures, royal scrolls, and geological relics of ${basic.name}.`,
      address: `100 Palace Ave, ${basic.capital}`,
      category: 'museum',
      images: ['https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=800'],
      openingHours: '9:00 AM - 5:00 PM (Closed Mondays)',
      entryFee: '$10',
      estimatedDuration: '2 hours',
      bestTime: 'Morning',
      rating: 4.6,
      reviewCount: 350,
      location: { lat: 0.05, lng: 0.05 }
    },
    {
      id: `${countryId}-attr2`,
      cityId: `${countryId}-capital`,
      countryId,
      name: `Central Cathedral & Plaza`,
      description: `The architectural heart of the city, showing spectacular stone arches, mosaic windows, and local food vendors.`,
      address: `Central Square, ${basic.capital}`,
      category: 'monument',
      images: ['https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800'],
      openingHours: '7:00 AM - 8:00 PM',
      entryFee: 'Free',
      estimatedDuration: '1 hour',
      bestTime: 'Late Afternoon',
      rating: 4.7,
      reviewCount: 420,
      location: { lat: 0.02, lng: 0.02 }
    },
    {
      id: `${countryId}-attr3`,
      cityId: `${countryId}-secondary`,
      countryId,
      name: `Sands National Beach Park`,
      description: `A pristine stretch of shoreline, ideal for sunbathing, coastal hiking, and trying local fresh seafood.`,
      address: 'Sunset Coast Highway',
      category: 'beach',
      images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'],
      openingHours: '24/7',
      entryFee: 'Free',
      estimatedDuration: '3 hours',
      bestTime: 'Sunny Afternoon',
      rating: 4.8,
      reviewCount: 510,
      location: { lat: 1.05, lng: 1.05 }
    }
  ];
}
