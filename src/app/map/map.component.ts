import { Component, OnInit, Input, Inject, PLATFORM_ID, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LocationMarker } from '../shared/interfaces/location-marker.interface';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls, Control } from 'ol/control';
import Overlay from 'ol/Overlay';

// Custom Zoom Control Class
class CustomZoomControl extends Control {
  constructor() {
    const container = document.createElement('div');
    container.className = 'custom-zoom-control';

    const zoomInButton = document.createElement('button');
    zoomInButton.innerHTML = '+';
    zoomInButton.className = 'zoom-button zoom-in';

    const zoomOutButton = document.createElement('button');
    zoomOutButton.innerHTML = '−';
    zoomOutButton.className = 'zoom-button zoom-out';

    container.appendChild(zoomInButton);
    container.appendChild(zoomOutButton);

    super({
      element: container
    });

    zoomInButton.addEventListener('click', () => {
      const view = this.getMap()?.getView();
      if (view) {
        const zoom = view.getZoom() || 0;
        view.animate({
          zoom: zoom + 1,
          duration: 250
        });
      }
    });

    zoomOutButton.addEventListener('click', () => {
      const view = this.getMap()?.getView();
      if (view) {
        const zoom = view.getZoom() || 0;
        view.animate({
          zoom: zoom - 1,
          duration: 250
        });
      }
    });
  }
}

// Custom Full Screen Control Class
class CustomFullscreenControl extends Control {
  private isFullScreen: boolean = false;

  constructor() {
    const button = document.createElement('button');
    button.className = 'custom-fullscreen-button';
    button.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>';

    super({
      element: button
    });

    button.addEventListener('click', () => this.toggleFullScreen());
  }

  private toggleFullScreen() {
    const mapElement = this.getMap()?.getTargetElement();
    if (!mapElement) return;

    if (!this.isFullScreen) {
      if (mapElement.requestFullscreen) {
        mapElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }

    this.isFullScreen = !this.isFullScreen;
  }
}


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @ViewChild('popup') popupElement!: ElementRef;
  @ViewChild('popupContent') popupContent!: ElementRef;

  @Input() locations: LocationMarker[] = [];
  @Input() containerClass: string = '';
  @Input() latitude: number = 51.505;
  @Input() longitude: number = -0.09;
  @Input() zoomLevel: number = 13;
  @Input() minZoom: number = 10;
  @Input() maxZoom: number = 18;

  private map!: Map;
  private markersLayer!: VectorLayer<VectorSource>;
  private popup!: Overlay;
  isLoading: boolean = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.isLoading = false;
      return;
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initializeMap();
      });
    }
  }

  private initializeMap(): void {
    if (!this.mapContainer?.nativeElement || !this.popupElement?.nativeElement) {
      console.error('Map container or popup element not found');
      return;
    }

    // Initialize popup overlay
    this.popup = new Overlay({
      element: this.popupElement.nativeElement,
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [50, 70]
    });

    const initialCenter = fromLonLat([this.longitude, this.latitude]);
  
    const tileLayer = new TileLayer({
      source: new XYZ({
        url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      })
    });
  
    this.markersLayer = new VectorLayer({
      source: new VectorSource()
    });
  
    try {
      this.map = new Map({
        target: this.mapContainer.nativeElement,
        layers: [tileLayer, this.markersLayer],
        overlays: [this.popup],
        controls: defaultControls({ zoom: false, rotate: false }).extend([
          new CustomZoomControl(),
          new CustomFullscreenControl()
        ]),
        view: new View({
          center: initialCenter,
          zoom: this.zoomLevel,
          minZoom: this.minZoom,
          maxZoom: this.maxZoom
        })
      });

      // Add click handler for features
      this.map.on('click', (evt) => {
        const feature = this.map.forEachFeatureAtPixel(evt.pixel, (feature) => feature);
        
        if (feature) {
          const geometry = feature.getGeometry();
          if (geometry && geometry instanceof Point) {
            const coordinates = geometry.getCoordinates();
            const description = feature.get('description');
            
            if (description) {
              this.popupContent.nativeElement.innerHTML = description;
              this.popup.setPosition(coordinates);
              this.popupElement.nativeElement.style.display = 'block';
            }
          }
        } else {
          this.popupElement.nativeElement.style.display = 'none';
        }
      });

      setTimeout(() => {
        this.map.updateSize();
      }, 100);

      this.isLoading = false;
      this.cdr.detectChanges();
      
      if (this.locations.length > 0) {
        this.addMarkers();
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  private addMarkers(): void {
    if (!this.map || !this.markersLayer) {
      console.error('Map or markers layer not initialized');
      return;
    }

    const vectorSource = this.markersLayer.getSource();
    if (!vectorSource) {
      console.error('Vector source is not available.');
      return;
    }
  
    vectorSource.clear();
  
    this.locations.forEach((location) => {
      const coordinates = fromLonLat([location.longitude, location.latitude]);
      const marker = new Feature({
        geometry: new Point(coordinates),
        description: location.description
      });
  
      const iconStyle = new Style({
        image: new Icon({
          color: location.color || 'red',
          crossOrigin: 'anonymous',
          src: 'data:image/svg+xml;charset=utf-8,' +
            encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
              <circle cx="10" cy="10" r="8" fill="${location.color || 'red'}" stroke="white" stroke-width="2" />
            </svg>`)
        })
      });
  
      marker.setStyle(iconStyle);
      vectorSource.addFeature(marker);
    });
  
    if (this.locations.length > 1) {
      const extent = vectorSource.getExtent();
      this.map.getView().fit(extent, {
        padding: [50, 50, 50, 50],
        duration: 500
      });
    }
  }

  updateLocations(newLocations: LocationMarker[]): void {
    this.locations = newLocations;
    if (this.map && this.markersLayer) {
      this.addMarkers();
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.setTarget(undefined);
      this.map = undefined!;
    }
  }
}
