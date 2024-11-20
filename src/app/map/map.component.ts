import { Component, OnInit, Input, Inject, PLATFORM_ID, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Interface for location objects
export interface LocationMarker {
  _id?: string;
  name?: string;
  latitude: number;
  longitude: number;
  description?: string;
  icon?: string; // Optional custom icon
  color?: string; // Optional marker color
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  // Input for locations
  @Input() locations: LocationMarker[] = [];

  // Configurable map properties
  @Input() containerClass: string = '';
  @Input() latitude: number = 51.505;
  @Input() longitude: number = -0.09;
  @Input() zoomLevel: number = 13;
  @Input() minZoom: number = 10;
  @Input() maxZoom: number = 18;

  private L: any;
  private map: any;
  private markers: any[] = [];
  isLoading: boolean = true;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngOnInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const { default: L } = await import('leaflet');
        this.L = L;

        await this.loadLeafletCSS();
        this.initializeMap();
      } catch (error) {
        console.error('Error initializing map:', error);
        this.isLoading = false;
      }
    }
  }

  private async loadLeafletCSS(): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
      link.onload = () => resolve();
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  private initializeMap(): void {
    if (!this.L) return;

    // Create map centered on first location or default
    const centerLat = this.locations.length > 0 
      ? this.locations[0].latitude 
      : this.latitude;
    const centerLng = this.locations.length > 0 
      ? this.locations[0].longitude 
      : this.longitude;

    this.map = this.L.map(this.mapContainer.nativeElement, {
      preferCanvas: true,
      zoomControl: true,
      attributionControl: true
    }).setView([centerLat, centerLng], this.zoomLevel);

    // Tile layer setup (same as previous example)
    const tileLayers = [
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
      'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png'
    ];

    let currentLayerIndex = 0;

    const addTileLayer = () => {
      if (currentLayerIndex >= tileLayers.length) {
        console.error('All tile layers failed to load');
        this.isLoading = false;
        return;
      }

      const tileLayer = this.L.tileLayer(tileLayers[currentLayerIndex], {
        attribution: '&copy; OpenStreetMap contributors',
        minZoom: this.minZoom,
        maxZoom: this.maxZoom
      });

      tileLayer.on('load', () => {
        this.isLoading = false;
        this.addMarkers(); // Add markers after map loads
      });

      tileLayer.on('error', () => {
        currentLayerIndex++;
        addTileLayer();
      });

      tileLayer.addTo(this.map);
    };

    addTileLayer();

    // Ensure map renders correctly
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 0);
  }

  // Method to add markers to the map
  private addMarkers(): void {
    // Clear existing markers
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];

    // Create custom icon (optional)
    const createCustomIcon = (color: string = 'red') => {
      return this.L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: ${color};
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 5px rgba(0,0,0,0.5);
          "></div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
    };

    // Add markers for each location
    this.locations.forEach(location => {
      const marker = this.L.marker(
        [location.latitude, location.longitude], 
        { 
          icon: createCustomIcon(location.color) 
        }
      );

      // Add popup if description or name exists
      if (location.name || location.description) {
        marker.bindPopup(`
          <b>${location.name || 'Location'}</b>
          <br>
          ${location.description || ''}
        `);
      }

      marker.addTo(this.map);
      this.markers.push(marker);
    });

    // Fit map to markers if multiple locations
    if (this.locations.length > 1) {
      const group = new this.L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds(), {
        padding: [50, 50] // Add some padding
      });
    }
  }

  // Method to update locations dynamically
  updateLocations(newLocations: LocationMarker[]): void {
    this.locations = newLocations;
    if (this.map) {
      this.addMarkers();
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}