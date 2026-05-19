<?php

namespace App\Services;

use App\Models\Eleve;
use Illuminate\Support\Facades\Http;
use Throwable;

class ParentNotificationService
{
    public function sendAbsenceSms(Eleve $eleve, string $statut): array
    {
        $sid = config('services.twilio.sid');
        $token = config('services.twilio.token');
        $from = config('services.twilio.from');

        if (! $sid || ! $token || ! $from) {
            return $this->skipped('sms', 'Configuration Twilio absente.');
        }

        $label = $statut === 'A' ? 'absent' : 'en retard';
        $message = "EduTrack: Votre enfant {$eleve->nom} est marque {$label}.";

        try {
            $response = Http::asForm()
                ->withBasicAuth($sid, $token)
                ->post("https://api.twilio.com/2010-04-01/Accounts/{$sid}/Messages.json", [
                    'To' => $eleve->parent_phone,
                    'From' => $from,
                    'Body' => $message,
                ]);

            return [
                'channel' => 'sms',
                'sent' => $response->successful(),
                'status' => $response->status(),
                'message' => $response->successful()
                    ? 'SMS envoye.'
                    : ($response->json('message') ?? 'Erreur Twilio.'),
            ];
        } catch (Throwable $e) {
            report($e);

            return $this->failed('sms', 'Erreur reseau Twilio.');
        }
    }

    public function sendLowAverageEmail(Eleve $eleve, float $moyenne): array
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
                    'subject' => "Alerte Performance - {$eleve->nom}",
                    'html' => view('emails.low-average', [
                        'eleve' => $eleve,
                        'moyenne' => $moyenne,
                    ])->render(),
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
