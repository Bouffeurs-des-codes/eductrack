export async function envoyerSMS() {
    console.warn('Les SMS sont maintenant envoyes par le backend Laravel.');
    return { sent: false, skipped: true };
}

export async function envoyerEmailResend() {
    console.warn('Les emails sont maintenant envoyes par le backend Laravel.');
    return { sent: false, skipped: true };
}
