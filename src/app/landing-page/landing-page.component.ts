import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  title = 'EcoRAEE';
  subtitle = 'Reciclaje Responsable de Residuos Electrónicos';
  description = `En EcoRAEE nos dedicamos al reciclaje y manejo adecuado de residuos de aparatos electrónicos. 
  Ayudamos a reducir la contaminación ambiental y a promover la reutilización de materiales valiosos.`;
  mission = `Nuestra misión es transformar el impacto ambiental de los residuos electrónicos y contribuir a un futuro más sostenible.`;
  services = [
    'Recolección de dispositivos electrónicos obsoletos.',
    'Reciclaje y procesamiento de materiales peligrosos.',
    'Promoción de la conciencia ambiental a través de programas educativos.'
  ];
}
