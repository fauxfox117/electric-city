import Database from 'better-sqlite3';

const db = new Database('animal-database.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS animals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        common_name TEXT NOT NULL,
        scientific_name TEXT,
        taxonomic_group TEXT NOT NULL,
        native_region TEXT NOT NULL,
        conservation_status TEXT NOT NULL,
        threats TEXT, -- JSON array as string
        photo_url TEXT,
        fun_fact TEXT,
        facility_context TEXT
    );
`);

export default db;