const DEFAULT_API_URL = 'http://127.0.0.1:8000/api';

const API_BASE_URL = (window.EDUTRACK_API_URL || DEFAULT_API_URL).replace(/\/$/, '');

async function request(path, options = {}) {
    const hasBody = options.body !== undefined;
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

    if (!response.ok) {
        const validationMessage = payload?.errors
            ? Object.values(payload.errors).flat().join('\n')
            : null;

        throw new Error(validationMessage || payload?.message || `Erreur API (${response.status})`);
    }

    return payload;
}

export const api = {
    async listerEleves() {
        const payload = await request('/eleves');
        return payload.data || [];
    },

    async listerAnalyses() {
        const payload = await request('/analyses');
        return payload.data || [];
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
