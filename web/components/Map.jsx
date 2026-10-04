'use client';
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { DEFAULT_HERE } from '../lib/geo';

const pinHtml = (text, promo) => `
  <div class="gpin ${promo ? 'gpin--promo' : ''}">
    ${promo ? `<em>${promo}</em>` : ''}
    <b>${text}</b>
  </div>
`;

export default function MapView({ items, label, onPick, here }) {
  const el = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    let dead = false;
    (async () => {
      const L = (await import('leaflet')).default;
      if (dead || !el.current) {
        return;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      const center = here || DEFAULT_HERE;
      const map = L.map(el.current, { zoomControl: false }).setView(center, 13);
      mapRef.current = map;
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(map);

      if (here) {
        L.circleMarker(here, {
          radius: 8,
          color: '#B5532F',
          fillColor: '#B5532F',
          fillOpacity: 0.9,
          weight: 2,
        }).addTo(map).bindTooltip('Vos', { permanent: false });
      }

      items.forEach((s) => {
        const icon = L.divIcon({
          className: 'pin',
          html: pinHtml(label(s), s.promo),
          iconSize: [72, 40],
          iconAnchor: [36, 40],
        });
        L.marker(s.ll, { icon })
          .addTo(map)
          .on('click', () => onPick?.(s.id));
      });

      if (items.length) {
        const bounds = L.latLngBounds(items.map((s) => s.ll));
        if (here) {
          bounds.extend(here);
        }
        map.fitBounds(bounds.pad(0.2));
      }
    })();
    return () => {
      dead = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  // label/onPick estables vía closure; remount al cambiar items/here
  }, [items, here]);

  return <div ref={el} className="map" role="application" aria-label="Mapa" />;
}
