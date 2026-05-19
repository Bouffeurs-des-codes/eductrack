function vider(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function statutClass(statut) {
    if (statut === 'Regulier et performant') {
        return 'text-green';
    }

    if (statut === 'En difficulte') {
        return 'text-red';
    }

    return 'text-gray';
}

export function peuplerSelects(eleves) {
    const selectPresence = document.getElementById('eleve-presence');
    const selectNote = document.getElementById('eleve-note');

    vider(selectPresence);
    vider(selectNote);

    if (!eleves.length) {
        const option = new Option('Aucun eleve disponible', '');
        selectPresence.add(option.cloneNode(true));
        selectNote.add(option);
        return;
    }

    eleves.forEach((eleve) => {
        const label = `${eleve.nom} - ${eleve.classe}`;
        selectPresence.add(new Option(label, eleve.id));
        selectNote.add(new Option(label, eleve.id));
    });
}

export function afficherAnalyses(analyses) {
    const tbody = document.getElementById('tableau-analyse');
    vider(tbody);

    if (!analyses.length) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 4;
        td.textContent = 'Aucune donnee disponible.';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    analyses.forEach((analyse) => {
        const tr = document.createElement('tr');
        const nom = document.createElement('td');
        const nomStrong = document.createElement('strong');
        const presence = document.createElement('td');
        const moyenne = document.createElement('td');
        const statut = document.createElement('td');
        const statutBadge = document.createElement('span');

        nomStrong.textContent = analyse.eleve.nom;
        nom.appendChild(nomStrong);
        presence.textContent = analyse.taux_presence === null ? 'N/A' : `${analyse.taux_presence}%`;
        moyenne.textContent = analyse.moyenne === null ? 'N/A' : `${Number(analyse.moyenne).toFixed(1)} / 20`;
        statutBadge.className = statutClass(analyse.statut_general);
        statutBadge.textContent = analyse.statut_general;
        statut.appendChild(statutBadge);

        tr.append(nom, presence, moyenne, statut);
        tbody.appendChild(tr);
    });
}

export function mettreAJourTableauAnalyse(db) {
    const analyses = db.eleves.map((eleve) => {
        const presencesEleve = db.presences.filter((presence) => presence.eleveId === eleve.id);
        const totalPresences = presencesEleve.length;
        const joursPresents = presencesEleve.filter((presence) => presence.statut === 'P').length;
        const notesEleve = db.notes.filter((note) => note.eleveId === eleve.id);
        const moyenne = notesEleve.length
            ? notesEleve.reduce((total, note) => total + note.valeur, 0) / notesEleve.length
            : null;
        const tauxPresence = totalPresences ? Math.round((joursPresents / totalPresences) * 100) : null;
        let statutGeneral = 'Donnees insuffisantes';

        if (tauxPresence !== null && moyenne !== null) {
            statutGeneral = moyenne >= 10 && tauxPresence >= 80
                ? 'Regulier et performant'
                : 'En difficulte';
        }

        return {
            eleve,
            taux_presence: tauxPresence,
            moyenne,
            statut_general: statutGeneral
        };
    });

    afficherAnalyses(analyses);
}
