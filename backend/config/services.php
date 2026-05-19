<?php

return [
    'twilio' => [
        'sid' => env('TWILIO_SID'),
        'token' => env('TWILIO_TOKEN'),
        'from' => env('TWILIO_FROM'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
        'from' => env('MAIL_FROM_ADDRESS', 'onboarding@resend.dev'),
        'from_name' => env('MAIL_FROM_NAME', 'EduTrack'),
    ],
];
