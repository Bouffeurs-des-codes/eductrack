const DEFAULT_API_URL = 'http://127.0.0.1:8000/api';

const API_BASE_URL = (window.EDUTRACK_API_URL || DEFAULT_API_URL).replace(/\/$/, '');

async function request(path, options = {}) {
    const hasBody = options.body !== undefined;
    const method = options.method || 'GET';
    const url = `${API_BASE_URL}${path}`;

    console.log('[EduTrack API] Requete', { method, url });

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            Accept: 'application/json',
            ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
            ...(options.headers || {})
        }
    });

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

    console.log('[EduTrack API] Reponse', {
        method,
        url,
        status: response.status,
        ok: response.ok,
        payload,
    });

    if (!response.ok) {
        const validationMessage = payload?.errors
            ? Object.values(payload.errors).flat().join('\n')
            : null;

        throw new Error(validationMessage || payload?.message || `Erreur API (${response.status})`);
    }

    return payload;
}

window.EduTrackApi = {
    async login({ email, password, role }) {
        const payload = await request('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password, role })
        });
        return payload.data;
    },

    async listerEleves() {
        const payload = await request('/eleves');
        return payload.data || [];
    },

    async creerEleve(data) {
        return request('/eleves', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async modifierEleve(id, data) {
        return request(`/eleves/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async supprimerEleve(id) {
        return request(`/eleves/${id}`, {
            method: 'DELETE'
        });
    },

    async listerUsers() {
        const payload = await request('/users');
        return payload.data || [];
    },

    async creerUser(data) {
        return request('/users', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async modifierUser(id, data) {
        return request(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async supprimerUser(id) {
        return request(`/users/${id}`, {
            method: 'DELETE'
        });
    },

    async listerClasses() {
        const payload = await request('/classes');
        return payload.data || [];
    },

    async creerClasse(data) {
        return request('/classes', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async modifierClasse(id, data) {
        return request(`/classes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async supprimerClasse(id) {
        return request(`/classes/${id}`, {
            method: 'DELETE'
        });
    },

    async listerAnalyses() {
        const payload = await request('/analyses');
        return payload.data || [];
    },

    async listerRapports() {
        const payload = await request('/rapports');
        return payload.data || {};
    },

    async listerEnfantsParent(email) {
        const query = email ? `?email=${encodeURIComponent(email)}` : '';
        const payload = await request(`/parent/enfants${query}`);
        return payload.data || [];
    },

    async listerDevoirs() {
        const payload = await request('/devoirs');
        return payload.data || [];
    },

    async enregistrerDevoir(data) {
        return request('/devoirs', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async modifierDevoir(id, data) {
        return request(`/devoirs/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async supprimerDevoir(id) {
        return request(`/devoirs/${id}`, {
            method: 'DELETE'
        });
    },

    async enregistrerPresence({ eleveId, statut }) {
        return request('/presences', {
            method: 'POST',
            body: JSON.stringify({
                eleve_id: eleveId,
                statut
            })
        });
    },

    async enregistrerNote({ eleveId, type, valeur }) {
        return request('/notes', {
            method: 'POST',
            body: JSON.stringify({
                eleve_id: eleveId,
                type,
                valeur
            })
        });
    }
};
