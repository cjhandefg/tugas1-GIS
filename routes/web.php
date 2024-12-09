<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\MapTugasController;

Route::get('/tugas1', [MapTugasController::class, 'tugas1']);

Route::get('/', function () {
    return view('welcome');
});


