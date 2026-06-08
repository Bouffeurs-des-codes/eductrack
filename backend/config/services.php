<?php

return [
    'twilio' => [
        'sid' => env('TWILIO_SID'),
        'token' => env('TWILIO_TOKEN'),
        'from' => env('TWILIO_FROM'),
    ],

    'coussema' => [
        'key' => env('COUSSEMA_API_KEY'),
        'base_url' => env('COUSSEMA_BASE_URL', 'https://api.coussema.com'),
        'sender_name' => env('COUSSEMA_SENDER_NAME', 'COUSSEMA'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
        'from' => env('MAIL_FROM_ADDRESS', 'onboarding@resend.dev'),
        'from_name' => env('MAIL_FROM_NAME', 'EduTrack'),
    ],
];
