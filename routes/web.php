<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\MapTugasController;

Route::get('/tugas1', [MapTugasController::class, 'tugas1']);

Route::get('/', function () {
  return view('welcome');
});


use App\Http\Controllers\MapDataController;

Route::get('/interactive', [MapDataController::class, 'index'])->name('map.index');
Route::get('/api/markers', [MapDataController::class, 'getMarkers']);
Route::get('/api/polygons', [MapDataController::class, 'getPolygons']);
Route::post('/api/markers', [MapDataController::class, 'storeMarker']);
Route::post('/api/polygons', [MapDataController::class, 'storePolygon']);
