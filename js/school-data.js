const schoolDataApi = window.EduTrackApi;

async function chargerDonneesScolaires() {
    try {
        const [eleves, analyses] = await Promise.all([
            schoolDataApi.listerEleves(),
            schoolDataApi.listerAnalyses(),
        ]);

        return { eleves, analyses };
    } catch (error) {
        console.warn('API indisponible, affichage avec les donnees locales.', error);
        const eleves = await chargerElevesLocaux();
        return {
            eleves,
            analyses: creerAnalysesInitiales(eleves),
        };
    }
}

async function chargerElevesLocaux() {
    const response = await fetch('js/eleves.json');

    if (!response.ok) {
        throw new Error('Impossible de charger les \u00e9l\u00e8ves locaux.');
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
}

function creerAnalysesInitiales(eleves) {
    return eleves.map((eleve) => ({
        eleve,
        total_presences: 0,
        jours_presents: 0,
        nombre_notes: 0,
        taux_presence: null,
        moyenne: null,
        statut_general: 'Donn\u00e9es insuffisantes',
    }));
}

window.EduTrackSchoolData = {
    chargerDonneesScolaires,
};
