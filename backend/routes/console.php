<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');


Artisan::command('media:schedule-cleanup', function (Schedule $schedule) {
    $schedule->command('media:cleanup --days=1')->daily();
});