export async function initDB() {
    let db = JSON.parse(localStorage.getItem('eduTrack_db'));

    try {
        // URL relative à ce module : fonctionne même si la page est servie depuis un sous-dossier.
        const response = await fetch(new URL('./eleves.json', import.meta.url));

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const elevesData = await response.json();
        console.log("Données chargées depuis eleves.json:", elevesData);

        db = {
            eleves: Array.isArray(elevesData) ? elevesData : [],
            presences: Array.isArray(db?.presences) ? db.presences : [],
            notes: Array.isArray(db?.notes) ? db.notes : []
        };

        saveDB(db);
        console.log("Base de données synchronisée avec", db.eleves.length, "élèves");
    } catch (error) {
        console.error("Erreur de chargement des données initiales :", error);

        if (!db) {
            db = { eleves: [], presences: [], notes: [] };
            saveDB(db);
        }
    }

    return db;
}

export function getDB() {
    return JSON.parse(localStorage.getItem('eduTrack_db'));
}

export function saveDB(data) {
    localStorage.setItem('eduTrack_db', JSON.stringify(data));
}
