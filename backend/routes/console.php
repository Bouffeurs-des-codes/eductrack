<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('edutrack:info', function (): void {
    $this->info('EduTrack API is ready.');
})->purpose('Display EduTrack backend information');
