const api = window.EduTrackApi;
const uiKit = window.EduTrackUiKit;
const schoolData = window.EduTrackSchoolData;

let elevesCourants = [];
let analysesCourantes = [];
let usersCourants = [];
let classesCourantes = [];
let rapportCourant = {};
let sectionActive = 'eleves';

const filtres = {
    eleve: '',
    classe: '',
    classeSearch: '',
    user: '',
    role: '',
};

function vider(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function moyenneValeurs(valeurs) {
    const valeursNumeriques = valeurs.filter((valeur) => valeur !== null && valeur !== undefined && !Number.isNaN(Number(valeur)));
    return valeursNumeriques.length
        ? valeursNumeriques.reduce((total, valeur) => total + Number(valeur), 0) / valeursNumeriques.length
        : null;
}

function formatPourcentage(valeur) {
    return valeur === null || valeur === undefined ? 'N/A' : `${Math.round(valeur)}%`;
}

function formatMoyenne(valeur) {
    return valeur === null || valeur === undefined ? 'N/A' : `${Number(valeur).toFixed(1)} / 20`;
}

function normaliserTexte(value) {
    return String(value || '').trim().toLowerCase();
}

function creerBouton(label, className, onClick) {
    const button = document.createElement('button');
    button.className = className;
    button.type = 'button';
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
}

function message(message, type = 'success') {
    uiKit.setFeedback(document.getElementById('admin-feedback'), message, type);
    uiKit.toast(message, type);
}

function setSectionActive(section, scroll = false) {
    sectionActive = section;

    document.querySelectorAll('[data-admin-section]').forEach((panel) => {
        panel.classList.toggle('active-panel', panel.dataset.adminSection === section);
    });

    document.querySelectorAll('[data-admin-target]').forEach((button) => {
        button.classList.toggle('active', button.dataset.adminTarget === section);
    });

    if (scroll) {
        document.querySelector(`[data-admin-section="${section}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function peuplerFiltreClasses() {
    const select = document.getElementById('admin-classe-filter');
    const valeurActuelle = select.value;
    const noms = [...new Set([
        ...classesCourantes.map((classe) => classe.nom).filter(Boolean),
        ...elevesCourants.map((eleve) => eleve.classe).filter(Boolean),
    ])].sort();

    select.innerHTML = '<option value="">Toutes les classes</option>';
    noms.forEach((nom) => select.add(new Option(nom, nom)));
    select.value = noms.includes(valeurActuelle) ? valeurActuelle : '';
    filtres.classe = select.value;
}

function afficherUsers() {
    const container = document.getElementById('admin-users');
    const recherche = normaliserTexte(filtres.user);
    const users = usersCourants.filter((user) => {
        const matchRole = !filtres.role || user.role === filtres.role;
        const matchSearch = !recherche || [user.name, user.email, user.role].some((value) => normaliserTexte(value).includes(recherche));
        return matchRole && matchSearch;
    });

    vider(container);

    if (!users.length) {
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.textContent = 'Aucun utilisateur ne correspond aux filtres.';
        container.appendChild(empty);
        return;
    }

    users.forEach((user) => {
        const row = document.createElement('div');
        const info = document.createElement('div');
        const title = document.createElement('strong');
        const subtitle = document.createElement('span');
        const actions = document.createElement('div');

        row.className = 'list-item';
        actions.className = 'action-row';
        title.textContent = user.name;
        subtitle.textContent = `${user.email} - ${user.role}`;

        actions.append(
            creerBouton('Modifier', 'link-button', () => ouvrirFormUser(user)),
            creerBouton('Supprimer', 'link-button text-danger-action', (event) => supprimerUser(user.id, event.currentTarget)),
        );
        info.append(title, subtitle);
        row.append(info, actions);
        container.appendChild(row);
    });
}

function afficherClasses() {
    const cardsContainer = document.getElementById('admin-classes');
    const tbody = document.getElementById('admin-classes-table');
    const recherche = normaliserTexte(filtres.classeSearch);
    const classes = classesCourantes.filter((classe) => {
        const nomClasse = classe.nom || classe;
        return !recherche || [nomClasse, classe.niveau, classe.description].some((value) => normaliserTexte(value).includes(recherche));
    });

    vider(cardsContainer);
    vider(tbody);

    if (!classes.length) {
        const emptyCard = document.createElement('div');
        const tr = document.createElement('tr');
        const td = document.createElement('td');

        emptyCard.className = 'empty-state';
        emptyCard.textContent = 'Aucune classe disponible.';
        cardsContainer.appendChild(emptyCard);
        td.colSpan = 4;
        td.textContent = 'Aucune classe à afficher.';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    classes.forEach((classe) => {
        const nomClasse = classe.nom || classe;
        const total = elevesCourants.filter((eleve) => eleve.classe === nomClasse).length;
        const card = document.createElement('button');
        const title = document.createElement('strong');
        const count = document.createElement('span');
        const hint = document.createElement('small');
        const tr = document.createElement('tr');
        const nom = document.createElement('td');
        const niveau = document.createElement('td');
        const description = document.createElement('td');
        const action = document.createElement('td');
        const actions = document.createElement('div');

        card.className = 'class-card interactive-card';
        card.type = 'button';
        title.textContent = nomClasse;
        count.textContent = `${total} élève${total > 1 ? 's' : ''}`;
        hint.textContent = 'Voir les élèves';
        card.append(title, count, hint);
        card.addEventListener('click', () => {
            document.getElementById('admin-classe-filter').value = nomClasse;
            filtres.classe = nomClasse;
            setSectionActive('eleves', true);
            afficherEleves();
        });
        cardsContainer.appendChild(card);

        actions.className = 'action-row';
        nom.textContent = nomClasse;
        niveau.textContent = classe.niveau || 'N/A';
        description.textContent = classe.description || 'N/A';
        actions.append(
            creerBouton('Modifier', 'link-button', () => ouvrirFormClasse(classe)),
            creerBouton('Supprimer', 'link-button text-danger-action', (event) => supprimerClasse(classe.id, event.currentTarget)),
        );
        action.appendChild(actions);
        tr.append(nom, niveau, description, action);
        tbody.appendChild(tr);
    });
}

function afficherEleves() {
    const tbody = document.getElementById('admin-eleves');
    const recherche = normaliserTexte(filtres.eleve);
    const eleves = elevesCourants.filter((eleve) => {
        const matchClasse = !filtres.classe || eleve.classe === filtres.classe;
        const matchSearch = !recherche || [eleve.nom, eleve.classe, eleve.parent_phone, eleve.parent_email].some((value) => normaliserTexte(value).includes(recherche));
        return matchClasse && matchSearch;
    });

    vider(tbody);

    if (!eleves.length) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 5;
        td.textContent = 'Aucun élève ne correspond aux filtres.';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    eleves.forEach((eleve) => {
        const tr = document.createElement('tr');
        const nom = document.createElement('td');
        const classe = document.createElement('td');
        const phone = document.createElement('td');
        const email = document.createElement('td');
        const action = document.createElement('td');
        const actions = document.createElement('div');
        const voir = document.createElement('a');

        actions.className = 'action-row';
        const nomStrong = document.createElement('strong');
        nomStrong.textContent = eleve.nom;
        nom.appendChild(nomStrong);
        classe.textContent = eleve.classe || 'N/A';
        phone.textContent = eleve.parent_phone || 'N/A';
        email.textContent = eleve.parent_email || 'N/A';
        voir.className = 'link-button';
        voir.href = `parent.html?eleve=${encodeURIComponent(eleve.id)}`;
        voir.textContent = 'Voir';

        actions.append(
            voir,
            creerBouton('Modifier', 'link-button', () => ouvrirFormEleve(eleve)),
            creerBouton('Supprimer', 'link-button text-danger-action', (event) => supprimerEleve(eleve.id, event.currentTarget)),
        );
        action.appendChild(actions);
        tr.append(nom, classe, phone, email, action);
        tbody.appendChild(tr);
    });
}

function afficherDashboardAdmin() {
    const alertes = analysesCourantes.filter((analyse) => analyse.statut_general === 'En difficulte' || analyse.statut_general === 'En difficulté').length;
    const presenceMoyenne = moyenneValeurs(analysesCourantes.map((analyse) => analyse.taux_presence));
    const moyenneGenerale = moyenneValeurs(analysesCourantes.map((analyse) => analyse.moyenne));

    document.getElementById('metric-eleves').textContent = elevesCourants.length;
    document.getElementById('metric-classes').textContent = classesCourantes.length;
    document.getElementById('metric-alertes').textContent = alertes;
    document.getElementById('report-presence').textContent = formatPourcentage(rapportCourant.presence_moyenne ?? presenceMoyenne);
    document.getElementById('report-moyenne').textContent = formatMoyenne(rapportCourant.moyenne_generale ?? moyenneGenerale);
    document.getElementById('report-difficulte').textContent = rapportCourant.eleves_en_difficulte ?? alertes;

    peuplerFiltreClasses();
    afficherUsers();
    afficherClasses();
    afficherEleves();
    setSectionActive(sectionActive);
}

async function rechargerAdmin() {
    const [donnees, users, classes, rapport] = await Promise.all([
        schoolData.chargerDonneesScolaires(),
        api.listerUsers(),
        api.listerClasses(),
        api.listerRapports(),
    ]);

    elevesCourants = donnees.eleves;
    analysesCourantes = donnees.analyses;
    usersCourants = users;
    classesCourantes = classes;
    rapportCourant = rapport;
    afficherDashboardAdmin();
}

function optionsClasses() {
    const noms = [...new Set([
        ...classesCourantes.map((classe) => classe.nom).filter(Boolean),
        ...elevesCourants.map((eleve) => eleve.classe).filter(Boolean),
    ])].sort();
    return noms.map((nom) => ({ value: nom, label: nom }));
}

function ouvrirFormUser(user = null) {
    uiKit.openFormModal({
        title: user ? 'Modifier un utilisateur' : 'Ajouter un utilisateur',
        submitLabel: user ? 'Modifier' : 'Créer',
        values: user,
        fields: [
            { name: 'name', label: 'Nom', required: true, autocomplete: 'name' },
            { name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email' },
            {
                name: 'role',
                label: 'Rôle',
                type: 'select',
                required: true,
                options: [
                    { value: 'admin', label: 'Admin' },
                    { value: 'enseignant', label: 'Enseignant' },
                    { value: 'parent', label: 'Parent' },
                ],
            },
            { name: 'password', label: user ? 'Nouveau mot de passe' : 'Mot de passe', type: 'password', required: !user, autocomplete: 'new-password' },
        ],
        onSubmit: async (data) => {
            if (user && !data.password) {
                delete data.password;
            }

            if (user) {
                await api.modifierUser(user.id, data);
                message('Utilisateur modifié.');
            } else {
                await api.creerUser(data);
                message('Utilisateur créé.');
            }

            await rechargerAdmin();
        },
    });
}

function ouvrirFormClasse(classe = null) {
    uiKit.openFormModal({
        title: classe ? 'Modifier une classe' : 'Créer une classe',
        submitLabel: classe ? 'Modifier' : 'Créer',
        values: classe,
        fields: [
            { name: 'nom', label: 'Nom de la classe', required: true },
            { name: 'niveau', label: 'Niveau' },
            { name: 'description', label: 'Description', type: 'textarea', full: true },
        ],
        onSubmit: async (data) => {
            if (classe) {
                await api.modifierClasse(classe.id, data);
                message('Classe modifiée.');
            } else {
                await api.creerClasse(data);
                message('Classe créée.');
            }

            await rechargerAdmin();
        },
    });
}

function ouvrirFormEleve(eleve = null) {
    uiKit.openFormModal({
        title: eleve ? 'Modifier un élève' : 'Ajouter un élève',
        submitLabel: eleve ? 'Modifier' : 'Créer',
        values: eleve,
        fields: [
            { name: 'nom', label: 'Nom complet', required: true },
            { name: 'classe', label: 'Classe', type: 'select', required: true, options: optionsClasses() },
            { name: 'parent_phone', label: 'Téléphone parent', required: true },
            { name: 'parent_email', label: 'Email parent', type: 'email', required: true },
        ],
        onSubmit: async (data) => {
            if (eleve) {
                await api.modifierEleve(eleve.id, data);
                message('Élève modifié.');
            } else {
                await api.creerEleve(data);
                message('Élève créé.');
            }

            await rechargerAdmin();
        },
    });
}

function exporterRapports() {
    const lignes = [
        ['Nom', 'Classe', 'Taux de presence', 'Moyenne', 'Statut'],
        ...analysesCourantes.map((analyse) => [
            analyse.eleve?.nom || '',
            analyse.eleve?.classe || '',
            analyse.taux_presence ?? '',
            analyse.moyenne ?? '',
            analyse.statut_general || '',
        ]),
    ];
    const csv = lignes.map((ligne) => ligne.map((cellule) => `"${String(cellule).replace(/"/g, '""')}"`).join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'edutrack-rapports.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    message('Rapport exporté.');
}

async function supprimerUser(id, button) {
    if (!confirm('Supprimer cet utilisateur ?')) {
        return;
    }

    uiKit.setButtonLoading(button, true, 'Suppression...');
    try {
        await api.supprimerUser(id);
        message('Utilisateur supprimé.');
        await rechargerAdmin();
    } finally {
        uiKit.setButtonLoading(button, false);
    }
}

async function supprimerClasse(id, button) {
    if (!id || !confirm('Supprimer cette classe ?')) {
        return;
    }

    uiKit.setButtonLoading(button, true, 'Suppression...');
    try {
        await api.supprimerClasse(id);
        message('Classe supprimée.');
        await rechargerAdmin();
    } finally {
        uiKit.setButtonLoading(button, false);
    }
}

async function supprimerEleve(id, button) {
    if (!confirm('Supprimer cet élève et ses données liées ?')) {
        return;
    }

    uiKit.setButtonLoading(button, true, 'Suppression...');
    try {
        await api.supprimerEleve(id);
        message('Élève supprimé.');
        await rechargerAdmin();
    } finally {
        uiKit.setButtonLoading(button, false);
    }
}

function brancherEvenements() {
    document.getElementById('btn-user-add').addEventListener('click', () => ouvrirFormUser());
    document.getElementById('btn-classe-add').addEventListener('click', () => ouvrirFormClasse());
    document.getElementById('btn-eleve-add').addEventListener('click', () => ouvrirFormEleve());
    document.getElementById('btn-rapport-export').addEventListener('click', exporterRapports);

    document.querySelectorAll('[data-admin-target]').forEach((button) => {
        button.addEventListener('click', () => setSectionActive(button.dataset.adminTarget, true));
    });

    document.getElementById('admin-user-search').addEventListener('input', (event) => {
        filtres.user = event.target.value;
        afficherUsers();
    });
    document.getElementById('admin-role-filter').addEventListener('change', (event) => {
        filtres.role = event.target.value;
        afficherUsers();
    });
    document.getElementById('admin-classe-search').addEventListener('input', (event) => {
        filtres.classeSearch = event.target.value;
        afficherClasses();
    });
    document.getElementById('admin-eleve-search').addEventListener('input', (event) => {
        filtres.eleve = event.target.value;
        afficherEleves();
    });
    document.getElementById('admin-classe-filter').addEventListener('change', (event) => {
        filtres.classe = event.target.value;
        afficherEleves();
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    brancherEvenements();
    uiKit.setFeedback(document.getElementById('admin-feedback'), 'Chargement du dashboard...', 'info');

    try {
        await rechargerAdmin();
        uiKit.setFeedback(document.getElementById('admin-feedback'), 'Dashboard prêt.', 'success');
    } catch (error) {
        console.error(error);
        uiKit.setFeedback(document.getElementById('admin-feedback'), error.message || 'Impossible de charger le dashboard admin.', 'error');
    }
});
