import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  title = 'EcoRAEE';
  subtitle = 'Reciclaje Responsable de Residuos Electrónicos';
  description = `En EcoRAEE nos dedicamos al reciclaje y manejo adecuado de residuos de aparatos electrónicos. 
  Ayudamos a reducir la contaminación ambiental y a promover la reutilización de materiales valiosos.`;
  vision = `Aspiramos a ser la plataforma líder en la gestión digital de residuos de aparatos eléctricos y electrónicos (RAEE), impulsando una transformación global hacia una economía circular y sostenible. Nos comprometemos a reducir los efectos negativos en el medio ambiente y a fomentar la responsabilidad ambiental en cada comunidad en la que operamos.`;
  services = [
    'Recolección de dispositivos electrónicos obsoletos.',
    'Promoción de la conciencia ambiental a través de programas educativos.',
  ];
}
