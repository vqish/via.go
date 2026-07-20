// =============================================
// via.go — Core Types
// =============================================

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  location?: string;
  coverImage?: string;
  createdAt: Date;
  travelStats: TravelStats;
  settings: UserSettings;
}

export interface TravelStats {
  countriesVisited: number;
  citiesVisited: number;
  totalTrips: number;
  totalDistance: number;
  travelStreak: number;
  wishlistCount: number;
}

export interface UserSettings {
  theme: 'dark' | 'light';
  currency: string;
  language: string;
  units: 'metric' | 'imperial';
  notifications: boolean;
  privacy: 'public' | 'friends' | 'private';
  nationality: string;
}

export interface Country {
  id: string;
  name: string;
  code: string; // ISO 3166-1 alpha-2
  capital: string;
  currency: string;
  currencySymbol: string;
  languages: string[];
  timeZone: string;
  climate: string;
  bestMonths: string[];
  visaInfo: string;
  emergencyNumbers: EmergencyNumbers;
  etiquette: string[];
  transportation: string;
  safetyInfo: string;
  internetAvailability: 'excellent' | 'good' | 'moderate' | 'poor';
  simInfo: string;
  plugType: string;
  coverImage: string;
  flagEmoji: string;
  continent: string;
  population?: number;
  area?: number;
  callingCode?: string;
}

export interface EmergencyNumbers {
  police: string;
  ambulance: string;
  fire: string;
  general?: string;
}

export interface City {
  id: string;
  countryId: string;
  name: string;
  description: string;
  coverImage: string;
  location: GeoPoint;
  population?: number;
  timezone?: string;
  tags?: string[];
}

export interface Attraction {
  id: string;
  cityId: string;
  countryId: string;
  name: string;
  description: string;
  address: string;
  category: AttractionCategory;
  images: string[];
  openingHours: string;
  entryFee: string;
  estimatedDuration: string;
  bestTime: string;
  rating: number;
  reviewCount: number;
  location: GeoPoint;
  mapsUrl?: string;
  website?: string;
  tags?: string[];
}

export type AttractionCategory =
  | 'tourist_attraction'
  | 'museum'
  | 'park'
  | 'beach'
  | 'temple'
  | 'monument'
  | 'shopping'
  | 'cafe'
  | 'restaurant'
  | 'nightlife'
  | 'hidden_gem';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Trip {
  id: string;
  userId: string;
  name: string;
  description?: string;
  coverImage?: string;
  countries: string[];
  cities: string[];
  startDate: Date;
  endDate: Date;
  travelers: number;
  tripType: TripType;
  status: TripStatus;
  budget?: number;
  currency?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TripType = 
  | 'leisure'
  | 'adventure'
  | 'business'
  | 'family'
  | 'romantic'
  | 'solo'
  | 'group'
  | 'backpacking';

export type TripStatus =
  | 'planning'
  | 'upcoming'
  | 'ongoing'
  | 'completed'
  | 'cancelled';

export interface ItineraryDay {
  id: string;
  tripId: string;
  date: Date;
  dayNumber: number;
  activities: Activity[];
}

export interface Activity {
  id: string;
  time: string;
  place: string;
  mapsUrl?: string;
  notes?: string;
  cost?: number;
  currency?: string;
  duration?: string;
  category?: string;
  attractionId?: string;
  order: number;
}

export interface TravelList {
  id: string;
  userId: string;
  name: string;
  description?: string;
  coverImage?: string;
  items: ListItem[];
  isFavorite: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  shareCode?: string;
}

export interface ListItem {
  id: string;
  type: 'attraction' | 'city' | 'country';
  referenceId: string;
  name: string;
  image?: string;
  order: number;
  addedAt: Date;
}

export interface PackingList {
  id: string;
  userId: string;
  tripId?: string;
  name: string;
  categories: PackingCategory[];
  createdAt: Date;
}

export interface PackingCategory {
  id: string;
  name: string;
  icon: string;
  items: PackingItem[];
}

export interface PackingItem {
  id: string;
  name: string;
  quantity: number;
  checked: boolean;
  notes?: string;
}

export interface BudgetEntry {
  id: string;
  tripId: string;
  userId: string;
  category: BudgetCategory;
  amount: number;
  currency: string;
  description: string;
  date: Date;
  receipt?: string;
}

export type BudgetCategory =
  | 'flights'
  | 'hotels'
  | 'food'
  | 'shopping'
  | 'transport'
  | 'activities'
  | 'miscellaneous';

export interface JournalEntry {
  id: string;
  userId: string;
  tripId?: string;
  title: string;
  content: string;
  photos: string[];
  videos?: string[];
  location?: string;
  mood?: string;
  rating?: number;
  date: Date;
  createdAt: Date;
}

export interface Note {
  id: string;
  userId: string;
  tripId?: string;
  title: string;
  content: string; // Rich text / HTML
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  userId: string;
  category: DocumentCategory;
  name: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  expiryDate?: Date;
  notes?: string;
  uploadedAt: Date;
}

export type DocumentCategory =
  | 'passport'
  | 'visa'
  | 'insurance'
  | 'tickets'
  | 'hotel_booking'
  | 'other';

export interface UserDestination {
  id: string;
  userId: string;
  type: 'country' | 'city' | 'attraction';
  referenceId: string;
  status: DestinationStatus;
  notes?: string;
  visitedAt?: Date;
  addedAt: Date;
}

export type DestinationStatus =
  | 'visited'
  | 'want_to_visit'
  | 'planning'
  | 'favorite';

export interface SearchResult {
  id: string;
  type: 'country' | 'city' | 'attraction' | 'trip' | 'list' | 'note';
  name: string;
  subtitle?: string;
  image?: string;
  url: string;
}
