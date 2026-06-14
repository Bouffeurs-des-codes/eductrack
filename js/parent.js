const api = window.EduTrackApi;
const uiKit = window.EduTrackUiKit;
const schoolData = window.EduTrackSchoolData;

let eleves = [];
let analyses = [];
let rapportActif = null;

function vider(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function formatPourcentage(valeur) {
    return valeur === null || valeur === undefined ? 'N/A' : `${Math.round(valeur)}%`;
}

function formatMoyenne(valeur) {
    return valeur === null || valeur === undefined ? 'N/A' : `${Number(valeur).toFixed(1)} / 20`;
}

function normaliserStatut(statut) {
    if (statut === 'Regulier et performant') {
        return 'R\u00e9gulier et performant';
    }

    if (statut === 'En difficulte') {
        return 'En difficult\u00e9';
    }

    if (statut === 'Donnees insuffisantes') {
        return 'Donn\u00e9es insuffisantes';
    }

    return statut || 'Donn\u00e9es insuffisantes';
}

function statutClass(statut) {
    const normalise = normaliserStatut(statut);

    if (normalise === 'Régulier et performant') {
        return 'text-green';
    }

    if (normalise === 'En difficulté') {
        return 'text-red';
    }

    return 'text-gray';
}

function libellePresence(statut) {
    const labels = {
        P: 'Présent',
        A: 'Absent',
        R: 'Retard',
    };

    return labels[statut] || statut || 'N/A';
}

function setParentTab(tab) {
    document.querySelectorAll('[data-parent-tab]').forEach((button) => {
        button.classList.toggle('active', button.dataset.parentTab === tab);
    });

    document.querySelectorAll('[data-parent-section]').forEach((section) => {
        section.classList.toggle('is-hidden', section.dataset.parentSection !== tab);
        section.classList.toggle('active-panel', section.dataset.parentSection === tab);
    });
}

function peuplerSelectParent() {
    const select = document.getElementById('parent-eleve');
    const params = new URLSearchParams(window.location.search);
    const eleveParam = params.get('eleve');

    vider(select);

    if (!eleves.length) {
        select.add(new Option('Aucun enfant disponible', ''));
        return;
    }

    eleves.forEach((eleve) => {
        select.add(new Option(`${eleve.nom} - ${eleve.classe}`, eleve.id));
    });

    if (eleveParam && eleves.some((eleve) => String(eleve.id) === eleveParam)) {
        select.value = eleveParam;
    }
}

function afficherTableVide(tbody, colSpan, message) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = colSpan;
    td.textContent = message;
    tr.appendChild(td);
    tbody.appendChild(tr);
}

function afficherNotes(notes = []) {
    const tbody = document.getElementById('parent-notes');
    vider(tbody);

    if (!notes.length) {
        afficherTableVide(tbody, 3, 'Aucune note enregistrée.');
        return;
    }

    notes.forEach((note) => {
        const tr = document.createElement('tr');
        const type = document.createElement('td');
        const valeur = document.createElement('td');
        const date = document.createElement('td');

        type.textContent = note.type || 'N/A';
        valeur.textContent = note.valeur !== undefined ? `${Number(note.valeur).toFixed(1)} / 20` : 'N/A';
        date.textContent = note.date_note || 'N/A';
        tr.append(type, valeur, date);
        tbody.appendChild(tr);
    });
}

function afficherPresences(presences = []) {
    const tbody = document.getElementById('parent-presences');
    vider(tbody);

    if (!presences.length) {
        afficherTableVide(tbody, 2, 'Aucune présence enregistrée.');
        return;
    }

    presences.forEach((presence) => {
        const tr = document.createElement('tr');
        const date = document.createElement('td');
        const statut = document.createElement('td');
        const badge = document.createElement('span');

        date.textContent = presence.date_presence || 'N/A';
        badge.className = presence.statut === 'P' ? 'text-green' : presence.statut === 'A' ? 'text-red' : 'text-gray';
        badge.textContent = libellePresence(presence.statut);
        statut.appendChild(badge);
        tr.append(date, statut);
        tbody.appendChild(tr);
    });
}

function afficherDashboardParent() {
    const select = document.getElementById('parent-eleve');
    const eleveId = Number(select.value || eleves[0]?.id);
    const analyse = analyses.find((item) => Number(item.eleve.id) === eleveId);
    const eleve = analyse?.eleve || eleves.find((item) => Number(item.id) === eleveId);
    const report = document.getElementById('parent-report');
    const statutElement = document.getElementById('parent-statut');

    rapportActif = analyse || null;

    if (!eleve) {
        document.getElementById('parent-nom').textContent = 'Aucun élève';
        document.getElementById('parent-classe').textContent = 'N/A';
        document.getElementById('parent-presence').textContent = 'N/A';
        document.getElementById('parent-moyenne').textContent = 'N/A';
        statutElement.textContent = 'N/A';
        statutElement.className = '';
        vider(report);
        afficherNotes([]);
        afficherPresences([]);
        return;
    }

    document.getElementById('parent-nom').textContent = eleve.nom;
    document.getElementById('parent-classe').textContent = eleve.classe || 'N/A';
    document.getElementById('parent-presence').textContent = formatPourcentage(analyse?.taux_presence ?? null);
    document.getElementById('parent-moyenne').textContent = formatMoyenne(analyse?.moyenne ?? null);
    statutElement.textContent = normaliserStatut(analyse?.statut_general);
    statutElement.className = statutClass(analyse?.statut_general);

    vider(report);
    [
        ['Présences enregistrées', analyse?.total_presences ?? 0],
        ['Jours présents', analyse?.jours_presents ?? 0],
        ['Notes enregistrées', analyse?.nombre_notes ?? 0],
        ['Contact SMS', eleve.parent_phone || 'Non renseigné'],
        ['Contact email', eleve.parent_email || 'Non renseigné'],
    ].forEach(([label, value]) => {
        const row = document.createElement('div');
        const labelElement = document.createElement('span');
        const valueElement = document.createElement('strong');

        row.className = 'parent-report-row';
        labelElement.textContent = label;
        valueElement.textContent = value;
        row.append(labelElement, valueElement);
        report.appendChild(row);
    });

    afficherNotes(rapportActif?.notes || []);
    afficherPresences(rapportActif?.presences || []);
    uiKit.toast(`Affichage de ${eleve.nom}`, 'info');
}

document.addEventListener('DOMContentLoaded', async () => {
    document.querySelectorAll('[data-parent-tab]').forEach((button) => {
        button.addEventListener('click', () => setParentTab(button.dataset.parentTab));
    });
    setParentTab('resume');

    try {
        const user = JSON.parse(localStorage.getItem('eductrack_user') || 'null');
        let rapportsParent = [];

        try {
            rapportsParent = await api.listerEnfantsParent(user?.role === 'parent' ? user.email : null);
        } catch (error) {
            console.warn('Endpoint parent indisponible, fallback analyses globales.', error);
        }

        if (rapportsParent.length) {
            analyses = rapportsParent;
            eleves = rapportsParent.map((rapport) => rapport.eleve);
        } else {
            const donnees = await schoolData.chargerDonneesScolaires();
            eleves = donnees.eleves;
            analyses = donnees.analyses;
        }

        peuplerSelectParent();
        afficherDashboardParent();
        document.getElementById('parent-eleve').addEventListener('change', afficherDashboardParent);
    } catch (error) {
        console.error(error);
        uiKit.toast("Impossible de charger l'espace parent.", 'error');
    }
});
