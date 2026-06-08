<?php

namespace App\Services;

use App\Models\Eleve;
use App\Models\Note;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Throwable;

class ParentNotificationService
{
    public function sendPresenceSms(Eleve $eleve, string $statut): array
    {
        $apiKey = config('services.coussema.key');
        $baseUrl = rtrim((string) config('services.coussema.base_url'), '/');
        $senderName = config('services.coussema.sender_name', 'COUSSEMA');

        if (! $apiKey || ! $baseUrl) {
            return $this->skipped('sms', 'Configuration Coussema absente.');
        }

        if (! $eleve->parent_phone) {
            return $this->skipped('sms', 'Numero du parent absent.');
        }

        $labels = [
            'P' => 'present',
            'A' => 'absent',
            'R' => 'en retard',
        ];

        $label = $labels[$statut] ?? 'marque';
        $message = "EduTrack: Votre enfant {$eleve->nom} est marque {$label}.";

        try {
            $response = Http::asJson()
                ->withToken($apiKey)
                ->withHeaders([
                    'Idempotency-Key' => (string) Str::uuid(),
                ])
                ->post("{$baseUrl}/v1/sms/send", [
                    'to' => $eleve->parent_phone,
                    'message' => $message,
                    'senderName' => $senderName,
                    'routing' => 'priority',
                ]);

            $payload = $response->json();
            $sent = $response->successful() && (bool) data_get($payload, 'success', false);

            return [
                'channel' => 'sms',
                'sent' => $sent,
                'status' => $response->status(),
                'message' => $sent
                    ? 'SMS envoye.'
                    : (data_get($payload, 'message') ?? 'Erreur Coussema.'),
                'provider' => $payload,
            ];
        } catch (Throwable $e) {
            report($e);

            return $this->failed('sms', 'Erreur reseau Coussema.');
        }
    }

    public function sendAbsenceSms(Eleve $eleve, string $statut): array
    {
        return $this->sendPresenceSms($eleve, $statut);
    }

    public function sendLowAverageEmail(Eleve $eleve, float $moyenne): array
    {
        return $this->sendEmail(
            $eleve,
            "Alerte Performance - {$eleve->nom}",
            'emails.low-average',
            [
                'eleve' => $eleve,
                'moyenne' => $moyenne,
            ]
        );
    }

    public function sendNoteEmail(Eleve $eleve, Note $note, float $moyenne): array
    {
        return $this->sendEmail(
            $eleve,
            "Nouvelle note - {$eleve->nom}",
            'emails.note-created',
            [
                'eleve' => $eleve,
                'note' => $note,
                'moyenne' => $moyenne,
            ]
        );
    }

    private function sendEmail(Eleve $eleve, string $subject, string $view, array $data): array
    {
        $key = config('services.resend.key');
        $from = config('services.resend.from');
        $fromName = config('services.resend.from_name', 'EduTrack');

        if (! $key || ! $from) {
            return $this->skipped('email', 'Configuration Resend absente.');
        }

        try {
            $response = Http::withToken($key)
                ->post('https://api.resend.com/emails', [
                    'from' => "{$fromName} <{$from}>",
                    'to' => [$eleve->parent_email],
                    'subject' => $subject,
                    'html' => view($view, $data)->render(),
                ]);

            return [
                'channel' => 'email',
                'sent' => $response->successful(),
                'status' => $response->status(),
                'message' => $response->successful()
                    ? 'Email envoye.'
                    : ($response->json('message') ?? 'Erreur Resend.'),
            ];
        } catch (Throwable $e) {
            report($e);

            return $this->failed('email', 'Erreur reseau Resend.');
        }
    }

    private function skipped(string $channel, string $message): array
    {
        return [
            'channel' => $channel,
            'sent' => false,
            'skipped' => true,
            'message' => $message,
        ];
    }

    private function failed(string $channel, string $message): array
    {
        return [
            'channel' => $channel,
            'sent' => false,
            'skipped' => false,
            'message' => $message,
        ];
    }
}
