import { Controller } from "@hotwired/stimulus";
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

// class MC < Controller
export default class extends Controller {
  // @values = {}
  static values = {
    apiKey: String,
    markers: Array,
    banana: String
  }

  // def initialize()
  connect() {
    console.log(`Banana value is: ${this.bananaValue}`)
    mapboxgl.accessToken = this.apiKeyValue;

    // this.something == @something
    // Mapboxgl::Map.new()
    this.map = new mapboxgl.Map({
      container: this.element,
      style: 'mapbox://styles/epems/ckfgv9jef20ae19qcweazlcvl'
    });
    this._addMarkersToMap();
    this._fitMapToMarkers();

    this.map.addControl(new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl
    }));

  }

  _addMarkersToMap() {
    this.markersValue.forEach((marker) => {
      const popup = new mapboxgl.Popup().setHTML(marker.info_window);

      // Create a HTML element for your custom marker
      const customMarker = document.createElement('div');
      customMarker.className = 'marker';
      customMarker.style.backgroundImage = `url('${marker.image_url}')`;
      customMarker.style.backgroundSize = 'contain';
      customMarker.style.width = '48px';
      customMarker.style.height = '48px';

      // Marker.new()
      new mapboxgl.Marker(customMarker)
        .setLngLat([marker.lng, marker.lat])
        .setPopup(popup)
        .addTo(this.map);
    });
  }

  _fitMapToMarkers() {
    const bounds = new mapboxgl.LngLatBounds();
    this.markersValue.forEach(marker => bounds.extend([marker.lng, marker.lat]));
    this.map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 5000 });
  }
}
