const api = window.EduTrackApi;
const uiKit = window.EduTrackUiKit;
const { afficherAnalyses, peuplerSelects } = window.EduTrackUi;
const schoolData = window.EduTrackSchoolData;

let devoirs = [];
let classesDisponibles = [];
let filtreDevoir = {
    recherche: '',
    classe: '',
};

function vider(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function afficherErreur(error, feedbackId) {
    console.error(error);
    const message = error.message || "Une erreur est survenue avec l'API EduTrack.";
    uiKit.setFeedback(document.getElementById(feedbackId), message, 'error');
    uiKit.toast(message, 'error');
}

function messageNotification(resultat) {
    if (!resultat.notification) {
        return resultat.message;
    }

    return `${resultat.message} ${resultat.notification.message}`;
}

function normaliserTexte(value) {
    return String(value || '').trim().toLowerCase();
}

async function chargerDonnees() {
    const { eleves, analyses } = await schoolData.chargerDonneesScolaires();

    classesDisponibles = [...new Set(eleves.map((eleve) => eleve.classe).filter(Boolean))].sort();
    peuplerSelects(eleves);
    peuplerFiltresDevoirs();
    afficherAnalyses(analyses);
    await chargerDevoirs();
}

function peuplerFiltresDevoirs() {
    const select = document.getElementById('devoir-classe-filter');
    const valeur = select.value;

    select.innerHTML = '<option value="">Toutes les classes</option>';
    classesDisponibles.forEach((classe) => select.add(new Option(classe, classe)));
    select.value = classesDisponibles.includes(valeur) ? valeur : '';
    filtreDevoir.classe = select.value;
}

async function chargerDevoirs() {
    try {
        devoirs = await api.listerDevoirs();
    } catch (error) {
        console.warn('Impossible de charger les devoirs depuis API.', error);
        devoirs = [];
    }

    afficherDevoirs();
}

function devoirsFiltres() {
    const recherche = normaliserTexte(filtreDevoir.recherche);

    return devoirs.filter((devoir) => {
        const matchClasse = !filtreDevoir.classe || devoir.classe === filtreDevoir.classe;
        const matchSearch = !recherche || [devoir.titre, devoir.classe, devoir.matiere, devoir.description].some((value) => normaliserTexte(value).includes(recherche));
        return matchClasse && matchSearch;
    });
}

function afficherDevoirs() {
    const tbody = document.getElementById('tableau-devoirs');
    const liste = devoirsFiltres();

    vider(tbody);

    if (!liste.length) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 5;
        td.textContent = 'Aucun devoir ne correspond aux filtres.';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    liste.forEach((devoir) => {
        const tr = document.createElement('tr');
        const titre = document.createElement('td');
        const classe = document.createElement('td');
        const matiere = document.createElement('td');
        const date = document.createElement('td');
        const action = document.createElement('td');
        const actions = document.createElement('div');
        const titreStrong = document.createElement('strong');

        actions.className = 'action-row';
        titreStrong.textContent = devoir.titre;
        titre.appendChild(titreStrong);
        if (devoir.description) {
            const description = document.createElement('span');
            description.className = 'table-muted';
            description.textContent = devoir.description;
            titre.append(document.createElement('br'), description);
        }
        classe.textContent = devoir.classe;
        matiere.textContent = devoir.matiere;
        date.textContent = devoir.date_limite || 'N/A';
        actions.append(
            creerBouton('Modifier', 'link-button', () => ouvrirFormDevoir(devoir)),
            creerBouton('Supprimer', 'link-button text-danger-action', (event) => supprimerDevoir(devoir.id, event.currentTarget)),
        );
        action.appendChild(actions);
        tr.append(titre, classe, matiere, date, action);
        tbody.appendChild(tr);
    });
}

function creerBouton(label, className, onClick) {
    const button = document.createElement('button');
    button.className = className;
    button.type = 'button';
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
}

function optionsClasses() {
    return classesDisponibles.map((classe) => ({ value: classe, label: classe }));
}

function ouvrirFormDevoir(devoir = null) {
    uiKit.openFormModal({
        title: devoir ? 'Modifier un devoir' : 'Planifier un devoir',
        submitLabel: devoir ? 'Modifier' : 'Enregistrer',
        values: devoir,
        fields: [
            { name: 'titre', label: 'Titre', required: true, placeholder: 'Ex : exercices sur les fonctions' },
            { name: 'classe', label: 'Classe', type: 'select', required: true, options: optionsClasses() },
            { name: 'matiere', label: 'Matière', required: true, placeholder: 'Ex : mathématiques' },
            { name: 'date_limite', label: 'Date limite', type: 'date' },
            { name: 'description', label: 'Consignes', type: 'textarea', full: true, placeholder: 'Décrire le travail à réaliser' },
        ],
        onSubmit: async (data) => {
            data.date_limite = data.date_limite || null;

            if (devoir) {
                await api.modifierDevoir(devoir.id, data);
                uiKit.toast('Devoir modifié.', 'success');
                uiKit.setFeedback(document.getElementById('devoir-feedback'), 'Devoir modifié.', 'success');
            } else {
                await api.enregistrerDevoir(data);
                uiKit.toast('Devoir enregistré.', 'success');
                uiKit.setFeedback(document.getElementById('devoir-feedback'), 'Devoir enregistré.', 'success');
            }

            await chargerDevoirs();
        },
    });
}

async function executerAvecBouton(button, action, loadingText) {
    uiKit.setButtonLoading(button, true, loadingText);

    try {
        await action();
    } finally {
        uiKit.setButtonLoading(button, false);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('btn-devoir-open').addEventListener('click', () => ouvrirFormDevoir());
    document.getElementById('devoir-search').addEventListener('input', (event) => {
        filtreDevoir.recherche = event.target.value;
        afficherDevoirs();
    });
    document.getElementById('devoir-classe-filter').addEventListener('change', (event) => {
        filtreDevoir.classe = event.target.value;
        afficherDevoirs();
    });

    try {
        uiKit.setFeedback(document.getElementById('devoir-feedback'), 'Chargement des données...', 'info');
        await chargerDonnees();
        uiKit.setFeedback(document.getElementById('devoir-feedback'), 'Données chargées.', 'success');
    } catch (error) {
        afficherErreur(error, 'devoir-feedback');
    }
});

document.getElementById('btn-presence').addEventListener('click', async (event) => {
    const button = event.currentTarget;

    await executerAvecBouton(button, async () => {
        const eleveId = parseInt(document.getElementById('eleve-presence').value, 10);
        const statut = document.querySelector('input[name="statut"]:checked').value;

        if (!eleveId) {
            uiKit.setFeedback(document.getElementById('presence-feedback'), 'Veuillez sélectionner un élève.', 'error');
            return;
        }

        try {
            const resultat = await api.enregistrerPresence({ eleveId, statut });
            const message = messageNotification(resultat);
            uiKit.setFeedback(document.getElementById('presence-feedback'), message, 'success');
            uiKit.toast(message, 'success');
            await chargerDonnees();
        } catch (error) {
            afficherErreur(error, 'presence-feedback');
        }
    }, 'Enregistrement...');
});

document.getElementById('btn-note').addEventListener('click', async (event) => {
    const button = event.currentTarget;

    await executerAvecBouton(button, async () => {
        const eleveId = parseInt(document.getElementById('eleve-note').value, 10);
        const type = document.getElementById('type-note').value;
        const valeur = parseFloat(document.getElementById('valeur-note').value);

        if (!eleveId) {
            uiKit.setFeedback(document.getElementById('note-feedback'), 'Veuillez sélectionner un élève.', 'error');
            return;
        }

        if (Number.isNaN(valeur) || valeur < 0 || valeur > 20) {
            uiKit.setFeedback(document.getElementById('note-feedback'), 'Veuillez entrer une cote valide entre 0 et 20.', 'error');
            return;
        }

        try {
            const resultat = await api.enregistrerNote({ eleveId, type, valeur });
            const moyenne = Number(resultat.moyenne).toFixed(1);
            const message = resultat.notification ? messageNotification(resultat) : `${resultat.message} Moyenne : ${moyenne}/20`;

            uiKit.setFeedback(document.getElementById('note-feedback'), message, 'success');
            uiKit.toast(message, 'success');
            document.getElementById('valeur-note').value = '';
            await chargerDonnees();
        } catch (error) {
            afficherErreur(error, 'note-feedback');
        }
    }, 'Enregistrement...');
});

async function supprimerDevoir(id, button) {
    if (!confirm('Supprimer ce devoir ?')) {
        return;
    }

    uiKit.setButtonLoading(button, true, 'Suppression...');
    try {
        await api.supprimerDevoir(id);
        uiKit.setFeedback(document.getElementById('devoir-feedback'), 'Devoir supprimé.', 'success');
        uiKit.toast('Devoir supprimé.', 'success');
        await chargerDevoirs();
    } catch (error) {
        afficherErreur(error, 'devoir-feedback');
    } finally {
        uiKit.setButtonLoading(button, false);
    }
}
