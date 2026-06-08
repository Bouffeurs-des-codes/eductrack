<div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.5;">
    <h2 style="margin: 0 0 12px;">Nouvelle note EduTrack</h2>
    <p>Bonjour,</p>
    <p>
        Une nouvelle note a ete enregistree pour
        <strong>{{ $eleve->nom }}</strong>.
    </p>
    <p>
        Type : <strong>{{ $note->type }}</strong><br>
        Note : <strong>{{ number_format($note->valeur, 1) }}/20</strong><br>
        Moyenne actuelle : <strong>{{ number_format($moyenne, 1) }}/20</strong>
    </p>
    <p style="margin-top: 24px; color: #64748b; font-size: 13px;">
        Ceci est un message automatique de l'etablissement.
    </p>
</div>
