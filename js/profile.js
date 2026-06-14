(function () {
    function lireUtilisateur() {
        try {
            return JSON.parse(localStorage.getItem('eductrack_user') || 'null');
        } catch (error) {
            console.warn('[EduTrack Profil] Utilisateur localStorage illisible.', error);
            return null;
        }
    }

    function initials(name, role) {
        const source = String(name || role || 'ET').trim();
        const parts = source.split(/\s+/).filter(Boolean);

        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }

        return source.slice(0, 2).toUpperCase();
    }

    document.addEventListener('DOMContentLoaded', () => {
        const user = lireUtilisateur();
        const nameElement = document.querySelector('[data-profile-name]');
        const roleElement = document.querySelector('[data-profile-role]');
        const initialsElement = document.querySelector('[data-profile-initials]');
        const logout = document.querySelector('.profile-logout');

        if (user) {
            if (nameElement) {
                nameElement.textContent = user.name || user.email || 'Utilisateur EduTrack';
            }

            if (roleElement) {
                roleElement.textContent = user.role || 'Utilisateur';
            }

            if (initialsElement) {
                initialsElement.textContent = initials(user.name || user.email, user.role);
            }
        }

        logout?.addEventListener('click', () => {
            localStorage.removeItem('eductrack_user');
        });
    });
}());
