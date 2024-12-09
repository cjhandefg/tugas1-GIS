<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MapTugasController extends Controller
{
  public function saveAsHtml()
  {
      // Render the Blade view as HTML
      $html = view('tugas1')->render();

      // Save it as a static HTML file in the public folder
      File::put(public_path('tugas1.html'), $html);

      return 'HTML file generated successfully!';
  }
}