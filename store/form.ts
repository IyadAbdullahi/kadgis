import { create } from 'zustand';

type PersonnelRole = 'Imam' | 'Muadhin' | 'Chairperson' | 'Treasurer' | 'Secretary';
type MosqueCategory = 'Jummaah' | 'Neighborhood' | 'Other';
type PowerSupply = 'Grid' | 'Generator' | 'Solar' | 'None';
type WaterSupply = 'Tap' | 'Borehole' | 'Well' | 'None';
type MadrasaType = 'Primary' | 'Secondary' | 'Islamiya';

interface ContactPerson {
    name: string;
    position: string;
    phone: string;
}

export interface KadgisEnumeration {
    id: string;                // Unique identifier for the record
    date: string;              // Date the enumeration was created
    plotNumber: string;        // Plot number associated with the record
    name: string;         // Full name of the landowner
    gender: string;            // Gender of the owner (e.g., Male, Female)
    maritalStatus: string;     // Marital status (e.g., Single, Married)
    dob: string;       // Owner's date of birth (YYYY-MM-DD)
    nationality: string;       // Nationality of the owner
    stateOfOrigin: string;     // State of origin (e.g., Kaduna, Kano)
    lga: string;               // Local Government Area
    email: string;             // Email address of the owner
    nin: string;               // National Identification Number
    bvn: string;               // Bank Verification Number
    phoneNumber1: string;      // Primary phone number
    phoneNumber2: string;      // Secondary phone number (optional)
    landSize: string;          // Size of the land (e.g., "600sqm")
    landUse: string;           // Land use type (e.g., Residential, Commercial)
    landPurpose: string;       // Purpose of the land (e.g., Farming, Housing)
    propertyType: string;      // Type of property on the land (e.g., Bungalow)
    propertyOccupancy: string; // Occupancy type (e.g., Owner Occupied, Tenant)
    accessAllowed: string;    // Whether access to the property is allowed
    numberOfBuildings: number; // Total number of buildings on the land
    numberOfOccupants: number;
    street: string // Total number of occupants on the land
    pictures: string[];
    latitude: number | null;
    longitude: number | null;
    uploadedBy: string;
}


interface Madrasa {
    name: string;
    type: MadrasaType;
    address: string;
    totalStudents: number;
    contactPerson: ContactPerson;
}

interface Personnel {
    id: string;
    fullName: string;
    phone?: string;
    role?: PersonnelRole;
}

export interface Mosque {
    id: string;
    name: string;
    streetAddress: string;
    cityTown: string;
    lga: string;
    state: string;
    latitude: number;
    longitude: number;
    capacity?: number;
    yearEstablished?: number;
    category: MosqueCategory;
    numberOfFloors?: number;
    ablutionArea: boolean;
    toiletFacilities: boolean;
    parkingSpace: boolean;
    womensPrayerArea: boolean;
    securitySystem: boolean;
    powerSupply?: PowerSupply;
    waterSupply?: WaterSupply;
    pictures: string[];
    personnel: Personnel[];
    madrasas: Madrasa[];
    published: boolean;
    uploadedBy: string | null;
}

interface MosqueStore {
    mosque: Mosque;
    updateMosque: (values: Partial<Mosque>) => void;
    resetMosque: () => void;
}

interface LandStore {
    land: KadgisEnumeration;
    updateLand: (values: Partial<KadgisEnumeration>) => void;
    resetLand: () => void;
}


const initialMosque: Mosque = {
    id: '',
    name: '',
    streetAddress: '',
    cityTown: '',
    lga: '',
    state: '',
    latitude: 0,
    longitude: 0,
    category: 'Other',
    ablutionArea: false,
    toiletFacilities: false,
    parkingSpace: false,
    womensPrayerArea: false,
    securitySystem: false,
    pictures: [],
    personnel: [],
    madrasas: [],
    published: false,
    uploadedBy: null,
};

const initialLand: KadgisEnumeration = {
    id: '',                // Unique identifier for the record
    date: '',              // Date the enumeration was created
    plotNumber: '',       // Plot number associated with the record
    name: '',      // Full name of the landowner
    gender: '',           // Gender of the owner (e.g., Male, Female)
    maritalStatus: '',     // Marital status (e.g., Single, Married)
    dob: '',       // Owner's date of birth (YYYY-MM-DD)
    nationality: '',       // Nationality of the owner
    stateOfOrigin: '',     // State of origin (e.g., Kaduna, Kano)
    lga: '',               // Local Government Area
    email: '',             // Email address of the owner
    nin: '',               // National Identification Number
    bvn: '',               // Bank Verification Number
    phoneNumber1: '',      // Primary phone number
    phoneNumber2: '',      // Secondary phone number (optional)
    landSize: '',          // Size of the land (e.g., "600sqm")
    landUse: '',           // Land use type (e.g., Residential, Commercial)
    landPurpose: '',       // Purpose of the land (e.g., Farming, Housing)
    propertyType: '',      // Type of property on the land (e.g., Bungalow)
    propertyOccupancy: '', // Occupancy type (e.g., Owner Occupied, Tenant)
    accessAllowed: '',    // Whether access to the property is allowed
    numberOfBuildings: 0, // Total number of buildings on the land
    numberOfOccupants: 0,
    street: '',
    pictures: [],
    latitude: 0,
    longitude: 0,
    uploadedBy: '',
};

export const useLanStore = create<LandStore>((set) => ({
    land: initialLand,

    updateLand: (values) => {
        set((state) => ({
            land: { ...state.land, ...values },
        }));
    },

    resetLand: () => {
        set({ land: initialLand });
    },
}));
