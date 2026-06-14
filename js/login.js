const API_BASE_URL = 'http://127.0.0.1:8000/api';

const routesParRole = {
    parent: 'parent.html',
    enseignant: 'enseignant.html',
    admin: 'admin.html',
    login: 'index.html',
};

const comptesLocaux = [
    { email: 'admin@gmail.com', password: 'password', role: 'admin', name: 'Administrateur EduTrack' },
    { email: 'enseignant@gmail.com', password: 'password', role: 'enseignant', name: 'Enseignant EduTrack' },
    { email: 'skykayumbabokomo@gmail.com', password: 'password', role: 'parent', name: 'Parent EduTrack' },
];

const form = document.getElementById('login-form');
const feedback = document.getElementById('login-feedback');
const steps = Array.from(document.querySelectorAll('.login-steps li'));

function normaliserRole(role) {
    return String(role || '').trim().toLowerCase();
}

function naviguerVersPage(page) {
    const role = normaliserRole(page);
    const destination = routesParRole[role] || routesParRole.login;

    console.log('[EduTrack Navigation] href simple', { role, destination });
    window.location.href = destination;
}

window.naviguerEduTrack = naviguerVersPage;

function setStepState(doneCount, activeIndex = doneCount) {
    console.log('[EduTrack Login] Etapes', { doneCount, activeIndex });

    steps.forEach((step, index) => {
        step.classList.toggle('step-done', index < doneCount);
        step.classList.toggle('step-active', index === activeIndex && index >= doneCount);
    });
}

function setFeedback(message, type = 'info') {
    if (message) {
        console.log('[EduTrack Login] Feedback', { type, message });
    }

    feedback.textContent = message;
    feedback.dataset.type = type;
}

function updateStepsFromForm() {
    const data = Object.fromEntries(new FormData(form).entries());
    const hasCredentials = Boolean(data.email && data.password);
    const hasRole = Boolean(data.role);

    if (hasCredentials && hasRole) {
        setStepState(2, 2);
        return;
    }

    if (hasCredentials) {
        setStepState(1, 1);
        return;
    }

    setStepState(0, 0);
}

function loginLocal(data) {
    const email = String(data.email || '').trim().toLowerCase();

    console.log('[EduTrack Login] Fallback local', {
        email,
        role: data.role,
    });

    return comptesLocaux.find((compte) => (
        compte.email === email
        && compte.password === data.password
        && compte.role === data.role
    ));
}

async function loginApi(data) {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(payload.message || `Erreur API (${response.status})`);
    }

    return payload.data;
}

async function authentifier(data) {
    console.log('[EduTrack Login] Tentative login', {
        email: data.email,
        role: data.role,
    });

    try {
        const user = await loginApi(data);
        console.log('[EduTrack Login] API OK', user);
        return user;
    } catch (error) {
        console.error('[EduTrack Login] API KO', error);
        const compte = loginLocal(data);

        if (!compte) {
            throw error;
        }

        console.warn('[EduTrack Login] Utilisation compte local de test', compte);
        return {
            name: compte.name,
            email: compte.email,
            role: compte.role,
            local: true,
        };
    }
}

function ouvrirDashboard(user) {
    const role = normaliserRole(user.role);

    setStepState(3, -1);
    setFeedback(`Connexion r\u00e9ussie. Ouverture de l'espace ${role}.`, 'success');

    setTimeout(() => {
        naviguerVersPage(role);
    }, 350);
}

form.addEventListener('input', () => {
    setFeedback('');
    updateStepsFromForm();
});

form.addEventListener('change', () => {
    setFeedback('');
    updateStepsFromForm();
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const button = form.querySelector('button[type="submit"]');
    const data = Object.fromEntries(new FormData(form).entries());

    console.log('[EduTrack Login] Submit intercepte', {
        email: data.email,
        role: data.role,
        hasPassword: Boolean(data.password),
    });

    button.disabled = true;
    button.textContent = 'Connexion...';
    setFeedback('V\u00e9rification des identifiants...', 'info');

    try {
        const user = await authentifier(data);
        user.role = normaliserRole(user.role || data.role);
        localStorage.setItem('eductrack_user', JSON.stringify(user));
        button.textContent = 'Connexion r\u00e9ussie';
        ouvrirDashboard(user);
    } catch (error) {
        console.error('[EduTrack Login] Connexion echouee', error);
        setStepState(0, 0);
        setFeedback(error.message || 'Connexion impossible.', 'error');
        button.disabled = false;
        button.textContent = 'Se connecter';
    }
});

updateStepsFromForm();
