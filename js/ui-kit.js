(function () {
    let toastRegion;
    let activeModal = null;

    function ensureToastRegion() {
        if (toastRegion) {
            return toastRegion;
        }

        toastRegion = document.createElement('div');
        toastRegion.className = 'toast-region';
        toastRegion.setAttribute('aria-live', 'polite');
        document.body.appendChild(toastRegion);
        return toastRegion;
    }

    function toast(message, type = 'info') {
        const region = ensureToastRegion();
        const item = document.createElement('div');

        item.className = `toast toast-${type}`;
        item.textContent = message;
        region.appendChild(item);

        window.setTimeout(() => {
            item.classList.add('toast-leave');
            window.setTimeout(() => item.remove(), 220);
        }, 3600);
    }

    function setFeedback(element, message, type = 'info') {
        if (!element) {
            return;
        }

        element.textContent = message || '';
        element.dataset.type = type;
    }

    function setButtonLoading(button, loading, loadingText = 'Traitement...') {
        if (!button) {
            return;
        }

        if (loading) {
            button.dataset.originalText = button.textContent;
            button.textContent = loadingText;
            button.disabled = true;
            button.classList.add('is-loading');
            return;
        }

        button.textContent = button.dataset.originalText || button.textContent;
        button.disabled = false;
        button.classList.remove('is-loading');
        delete button.dataset.originalText;
    }

    function closeModal() {
        if (!activeModal) {
            return;
        }

        activeModal.remove();
        activeModal = null;
        document.body.classList.remove('modal-open');
        document.removeEventListener('keydown', handleEscape);
    }

    function handleEscape(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    }

    function createField(field, value) {
        const group = document.createElement('div');
        const label = document.createElement('label');
        let input;

        group.className = field.full ? 'form-group modal-field-full' : 'form-group';
        label.textContent = field.label;
        label.setAttribute('for', `modal-${field.name}`);

        if (field.type === 'select') {
            input = document.createElement('select');
            (field.options || []).forEach((option) => {
                const opt = document.createElement('option');
                opt.value = option.value;
                opt.textContent = option.label;
                input.appendChild(opt);
            });
        } else if (field.type === 'textarea') {
            input = document.createElement('textarea');
            input.rows = field.rows || 4;
        } else {
            input = document.createElement('input');
            input.type = field.type || 'text';
        }

        input.id = `modal-${field.name}`;
        input.name = field.name;
        input.value = value ?? field.value ?? '';
        input.placeholder = field.placeholder || '';
        input.required = Boolean(field.required);

        if (field.min !== undefined) {
            input.min = field.min;
        }

        if (field.max !== undefined) {
            input.max = field.max;
        }

        if (field.autocomplete) {
            input.autocomplete = field.autocomplete;
        }

        group.append(label, input);
        return group;
    }

    function openFormModal(config) {
        closeModal();

        const overlay = document.createElement('div');
        const dialog = document.createElement('section');
        const header = document.createElement('div');
        const title = document.createElement('h2');
        const closeButton = document.createElement('button');
        const form = document.createElement('form');
        const body = document.createElement('div');
        const footer = document.createElement('div');
        const cancelButton = document.createElement('button');
        const submitButton = document.createElement('button');
        const feedback = document.createElement('p');

        overlay.className = 'modal-overlay';
        dialog.className = 'modal-dialog';
        header.className = 'modal-header';
        closeButton.className = 'modal-close';
        closeButton.type = 'button';
        closeButton.textContent = 'Fermer';
        form.className = 'modal-form';
        body.className = 'modal-grid';
        footer.className = 'modal-footer';
        cancelButton.className = 'btn btn-ghost';
        submitButton.className = 'btn btn-primary';
        feedback.className = 'form-feedback';
        feedback.setAttribute('aria-live', 'polite');

        title.textContent = config.title;
        cancelButton.type = 'button';
        cancelButton.textContent = 'Annuler';
        submitButton.type = 'submit';
        submitButton.textContent = config.submitLabel || 'Enregistrer';

        (config.fields || []).forEach((field) => {
            body.appendChild(createField(field, config.values?.[field.name]));
        });

        header.append(title, closeButton);
        footer.append(cancelButton, submitButton);
        form.append(body, feedback, footer);
        dialog.append(header, form);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        activeModal = overlay;
        document.body.classList.add('modal-open');
        document.addEventListener('keydown', handleEscape);

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                closeModal();
            }
        });
        closeButton.addEventListener('click', closeModal);
        cancelButton.addEventListener('click', closeModal);

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const data = Object.fromEntries(new FormData(form).entries());

            setFeedback(feedback, '');
            setButtonLoading(submitButton, true, config.loadingLabel || 'Enregistrement...');

            try {
                await config.onSubmit(data);
                closeModal();
            } catch (error) {
                console.error(error);
                setFeedback(feedback, error.message || 'Action impossible.', 'error');
            } finally {
                setButtonLoading(submitButton, false);
            }
        });

        window.setTimeout(() => {
            form.querySelector('input, select, textarea')?.focus();
        }, 40);
    }

    window.EduTrackUiKit = {
        closeModal,
        openFormModal,
        setButtonLoading,
        setFeedback,
        toast,
    };
}());
