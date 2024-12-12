import { SQLiteDatabase } from "expo-sqlite";

class KadgisController {
    private static instance: KadgisController;
    private db: SQLiteDatabase;
    private constructor(db: SQLiteDatabase) {
        this.db = db;
    }

    static async getInstance(db: SQLiteDatabase): Promise<KadgisController> {
        if (!KadgisController.instance) {
            KadgisController.instance = new KadgisController(db);
            await KadgisController.instance.setupDatabase();
            console.log('the table has ben created');
        }
        return KadgisController.instance;
    }

    private async setupDatabase() {
        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS kadgis_data1 (
                id TEXT PRIMARY KEY NOT NULL,
                date TEXT,
                plotNumber TEXT,
                name TEXT,
                gender TEXT,
                maritalStatus TEXT,
                dob TEXT,
                nationality TEXT,
                stateOfOrigin TEXT,
                lga TEXT,
                email TEXT,
                nin TEXT,
                bvn TEXT,
                phoneNumber1 TEXT,
                phoneNumber2 TEXT,
                landSize TEXT,
                landUse TEXT,
                landPurpose TEXT,
                propertyType TEXT,
                propertyOccupancy TEXT,
                accessAllowed TEXT,
                numberOfBuildings INTEGER,
                numberOfOccupants INTEGER,
                street TEXT,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
                pictures TEXT, -- JSON array
                latitude REAL,
                longitude REAL,
                uploadedBy TEXT

            );
        `);


    }

    // Add a new record
    async addRecord(data: {
        date: string;
        plotNumber: string;
        name: string;
        gender: string;
        maritalStatus: string;
        dob: string;
        nationality: string;
        stateOfOrigin: string;
        lga: string;
        email: string;
        nin: string;
        bvn: string;
        phoneNumber1: string;
        phoneNumber2: string;
        landSize: string;
        landUse: string;
        landPurpose: string;
        propertyType: string;
        propertyOccupancy: string;
        accessAllowed: string;
        numberOfBuildings: number;
        numberOfOccupants: number;
        street: string;
        pictures: string[];
        latitude: number | null;
        longitude: number | null;
        uploadedBy: string;
    }) {
        const id = this.generateId();

        await this.db.runAsync(
            `INSERT INTO kadgis_data1 (
                id, date, plotNumber, name, gender, maritalStatus, dob, nationality, 
                stateOfOrigin, lga, email, nin, bvn, phoneNumber1, phoneNumber2, landSize, landUse, 
                landPurpose, propertyType, propertyOccupancy, accessAllowed, numberOfBuildings, numberOfOccupants, street, pictures, latitude, 
                longitude, uploadedBy
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                data.date,
                data.plotNumber,
                data.name,
                data.gender,
                data.maritalStatus,
                data.dob,
                data.nationality,
                data.stateOfOrigin,
                data.lga,
                data.email,
                data.nin,
                data.bvn,
                data.phoneNumber1,
                data.phoneNumber2,
                data.landSize,
                data.landUse,
                data.landPurpose,
                data.propertyType,
                data.propertyOccupancy,
                data.accessAllowed,
                data.numberOfBuildings,
                data.numberOfOccupants,
                data.street,
                JSON.stringify(data.pictures ?? []),
                data.latitude,
                data.longitude,
                data.uploadedBy,
            ]
        );

        return id;
    }

    // Get a single record by ID
    async getRecordById(id: string): Promise<any | null> {
        const result = await this.db.getFirstAsync<any>(
            `SELECT * FROM kadgis_data WHERE id = ?`,
            [id]
        );
        return result ? { ...result, accessAllowed: !!result.accessAllowed } : null;
    }

    // Update an existing record
    async updateRecord(
        id: string,
        updatedData: Partial<{
            date: string;
            plotNumber: string;
            name: string;
            gender: string;
            maritalStatus: string;
            dob: string;
            nationality: string;
            stateOfOrigin: string;
            lga: string;
            email: string;
            nin: string;
            bvn: string;
            phoneNumber1: string;
            phoneNumber2: string;
            landSize: string;
            landUse: string;
            landPurpose: string;
            propertyType: string;
            propertyOccupancy: string;
            accessAllowed: string;
            numberOfBuildings: number;
            numberOfOccupants: number;
            street: string;
            pictures: string[];
            latitude: number;
            longitude: number;
            uploadedBy: string;
        }>
    ) {
        const keys = Object.keys(updatedData);
        const values = keys.map((key) => updatedData[key]);
        const placeholders = keys.map((key) => `${key} = ?`).join(", ");

        await this.db.runAsync(
            `UPDATE kadgis_data SET ${placeholders}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
            [...values, id]
        );
    }

    // Delete a record by ID
    async deleteRecordById(id: string) {
        await this.db.runAsync(`DELETE FROM kadgis_data WHERE id = ?`, [id]);
    }

    // Retrieve all records
    async getAllRecords(): Promise<any[]> {
        const results = await this.db.getAllAsync<any>(`SELECT * FROM kadgis_data`);
        return results.map((result) => ({
            ...result,
            accessAllowed: !!result.accessAllowed,
        }));
    }

    // Search records
    async searchRecords(keyword: string): Promise<any[]> {
        const results = await this.db.getAllAsync<any>(
            `SELECT * FROM kadgis_data WHERE name LIKE ? OR plotNumber LIKE ?`,
            [`%${keyword}%`, `%${keyword}%`]
        );
        return results.map((result) => ({
            ...result,
            accessAllowed: !!result.accessAllowed,
        }));
    }

    // Delete all records
    async deleteAllRecords() {
        await this.db.runAsync(`DELETE FROM kadgis_data`);
    }

    // Check if a record exists by ID
    async doesRecordExist(id: string): Promise<boolean> {
        const result = await this.db.getFirstAsync<{ count: number }>(
            `SELECT COUNT(*) as count FROM kadgis_data WHERE id = ?`,
            [id]
        );
        return result.count > 0;
    }

    // Generate a unique ID
    private generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
    // count property
    async countProperty(): Promise<number> {
        const result = await this.db.getFirstAsync<{ count: number }>(
            'SELECT COUNT(*) as count FROM kadgis_data1'
        );
        return result.count;
    }

    async countTypes(types: string[]): Promise<{ type: string; count: number }[]> {
        const counts = await Promise.all(
            types.map(async (type) => {
                const result = await this.db.getFirstAsync<{ count: number }>(
                    `SELECT COUNT(*) as count FROM kadgis_data1 WHERE landUse = ?`,
                    type
                );
                return { type, count: result.count };
            })
        );
        return counts;
    }

}

export default KadgisController;
