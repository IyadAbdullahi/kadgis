import { SQLiteDatabase } from 'expo-sqlite';
import { Mosque } from './form';

class MosqueController {
    private static instance: MosqueController;
    private db: SQLiteDatabase;

    private constructor(db: SQLiteDatabase) {
        this.db = db;
    }

    // Singleton pattern to ensure only one instance
    static async getInstance(db: SQLiteDatabase): Promise<MosqueController> {
        if (!MosqueController.instance) {
            MosqueController.instance = new MosqueController(db);
            await MosqueController.instance.setupDatabase();
        }
        return MosqueController.instance;
    }

    // Setup database schema
    private async setupDatabase() {
        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS mosque (
                id TEXT PRIMARY KEY NOT NULL, 
                name TEXT NOT NULL, 
                streetAddress TEXT,
                cityTown TEXT,
                lga TEXT,
                state TEXT,
                latitude REAL,
                longitude REAL,
                category TEXT,
                ablutionArea INTEGER,
                toiletFacilities INTEGER,
                parkingSpace INTEGER,
                womensPrayerArea INTEGER,
                securitySystem INTEGER,
                pictures TEXT, -- JSON array
                personnel TEXT, -- JSON array
                madrasas TEXT, -- JSON array
                published INTEGER,
                uploadedBy TEXT
            );
        `);
    }

    // Create a new mosque entry
    async addMosque(mosque: Partial<Mosque>) {
        const id = this.generateId();
        await this.db.runAsync(
            `INSERT INTO mosque (id, name, streetAddress, cityTown, lga, state, latitude, longitude, category, ablutionArea, toiletFacilities, parkingSpace, womensPrayerArea, securitySystem, pictures, personnel, madrasas, published, uploadedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                mosque.name,
                mosque.streetAddress,
                mosque.cityTown,
                mosque.lga,
                mosque.state,
                mosque.latitude,
                mosque.longitude,
                mosque.category,
                mosque.ablutionArea ? 1 : 0,
                mosque.toiletFacilities ? 1 : 0,
                mosque.parkingSpace ? 1 : 0,
                mosque.womensPrayerArea ? 1 : 0,
                mosque.securitySystem ? 1 : 0,
                JSON.stringify(mosque.pictures ?? []),
                JSON.stringify(mosque.personnel ?? []),
                JSON.stringify(mosque.madrasas ?? []),
                mosque.published ? 1 : 0,
                mosque.uploadedBy,
            ]
        );
        return id;
    }

    // Fetch mosque details by ID
    async getMosqueById(id: string): Promise<Mosque | null> {
        const result = await this.db.getFirstAsync<Mosque>(
            `SELECT * FROM mosque WHERE id = ?`,
            id
        );
        return result
            ? {
                ...result,
                pictures: JSON.parse(result.pictures),
                personnel: JSON.parse(result.personnel),
                madrasas: JSON.parse(result.madrasas),
            }
            : null;
    }

    // Fetch all mosques with optional filters
    async getAllMosques(filter: Partial<Mosque> = {}): Promise<Mosque[]> {
        const whereClauses: string[] = [];
        const params: any[] = [];

        Object.entries(filter).forEach(([key, value]) => {
            whereClauses.push(`${key} = ?`);
            params.push(value);
        });

        const whereClause = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
        const results = await this.db.getAllAsync<Mosque>(
            `SELECT * FROM mosque ${whereClause}`,
            ...params
        );

        return results.map(result => ({
            ...result,
            pictures: JSON.parse(result.pictures),
            personnel: JSON.parse(result.personnel),
            madrasas: JSON.parse(result.madrasas),
        }));
    }

    // Update the isPublished flag
    async updateIsPublished(id: string, published: boolean): Promise<void> {
        await this.db.runAsync(
            `UPDATE mosque SET published = ? WHERE id = ?`,
            published ? 1 : 0,
            id
        );
    }

    async countMosques(): Promise<number> {
        const result = await this.db.getFirstAsync<{ count: number }>(
            'SELECT COUNT(*) as count FROM mosque'
        );
        return result.count;
    }

    // Generate a unique ID
    private generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
}

export default MosqueController;
