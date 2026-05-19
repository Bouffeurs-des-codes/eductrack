import { api } from './api.js';
import { afficherAnalyses, peuplerSelects } from './ui.js';

let eleves = [];

function afficherErreur(error) {
    console.error(error);
    alert(error.message || "Une erreur est survenue avec l'API EduTrack.");
}

function messageNotification(resultat) {
    if (!resultat.notification) {
        return resultat.message;
    }

    return `${resultat.message} ${resultat.notification.message}`;
}

async function chargerDonnees() {
    const [elevesApi, analyses] = await Promise.all([
        api.listerEleves(),
        api.listerAnalyses()
    ]);

    eleves = elevesApi;
    peuplerSelects(eleves);
    afficherAnalyses(analyses);
}

async function executerAvecBouton(button, action) {
    button.disabled = true;

    try {
        await action();
    } finally {
        button.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await chargerDonnees();
    } catch (error) {
        afficherErreur(error);
    }
});

document.getElementById('btn-presence').addEventListener('click', async (event) => {
    const button = event.currentTarget;

    await executerAvecBouton(button, async () => {
        const eleveId = parseInt(document.getElementById('eleve-presence').value, 10);
        const statut = document.querySelector('input[name="statut"]:checked').value;

        if (!eleveId) {
            alert('Veuillez selectionner un eleve.');
            return;
        }

        try {
            const resultat = await api.enregistrerPresence({ eleveId, statut });
            alert(messageNotification(resultat));
            await chargerDonnees();
        } catch (error) {
            afficherErreur(error);
        }
    });
});

document.getElementById('btn-note').addEventListener('click', async (event) => {
    const button = event.currentTarget;

    await executerAvecBouton(button, async () => {
        const eleveId = parseInt(document.getElementById('eleve-note').value, 10);
        const type = document.getElementById('type-note').value;
        const valeur = parseFloat(document.getElementById('valeur-note').value);

        if (!eleveId) {
            alert('Veuillez selectionner un eleve.');
            return;
        }

        if (Number.isNaN(valeur) || valeur < 0 || valeur > 20) {
            alert('Veuillez entrer une cote valide entre 0 et 20.');
            return;
        }

        try {
            const resultat = await api.enregistrerNote({ eleveId, type, valeur });
            const moyenne = Number(resultat.moyenne).toFixed(1);
            alert(resultat.notification ? messageNotification(resultat) : `${resultat.message} Moyenne: ${moyenne}/20`);
            document.getElementById('valeur-note').value = '';
            await chargerDonnees();
        } catch (error) {
            afficherErreur(error);
        }
    });
});
