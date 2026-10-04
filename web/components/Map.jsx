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

let leafletPromise = null;
const loadLeaflet = () => {
  if (!leafletPromise) leafletPromise = import('leaflet').then((m) => m.default);
  return leafletPromise;
};

export default function MapView({ items, label, onPick, here, active = true }) {
  const el = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const onPickRef = useRef(onPick);
  const labelRef = useRef(label);
  onPickRef.current = onPick;
  labelRef.current = label;

  useEffect(() => {
    if (!active || !el.current) return undefined;
    let dead = false;

    (async () => {
      const L = await loadLeaflet();
      if (dead || !el.current) return;

      if (!mapRef.current) {
        const center = here || DEFAULT_HERE;
        const map = L.map(el.current, {
          zoomControl: false,
          preferCanvas: true,
          fadeAnimation: false,
          zoomAnimation: false,
        }).setView(center, 12);
        mapRef.current = map;
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '© OSM © CARTO',
          maxZoom: 18,
          subdomains: 'abcd',
          updateWhenIdle: true,
        }).addTo(map);
        layerRef.current = L.layerGroup().addTo(map);
        requestAnimationFrame(() => map.invalidateSize());
      }

      const map = mapRef.current;
      const group = layerRef.current;
      group.clearLayers();

      if (here) {
        L.circleMarker(here, {
          radius: 7,
          color: '#B5532F',
          fillColor: '#B5532F',
          fillOpacity: 0.95,
          weight: 2,
        }).addTo(group);
      }

      items.forEach((s) => {
        const icon = L.divIcon({
          className: 'pin',
          html: pinHtml(labelRef.current(s), s.promo),
          iconSize: [72, 40],
          iconAnchor: [36, 40],
        });
        L.marker(s.ll, { icon })
          .addTo(group)
          .on('click', () => onPickRef.current?.(s.id));
      });

      if (items.length) {
        const bounds = L.latLngBounds(items.map((s) => s.ll));
        if (here) bounds.extend(here);
        map.fitBounds(bounds.pad(0.18), { animate: false });
      } else if (here) {
        map.setView(here, 13, { animate: false });
      }
      map.invalidateSize(false);
    })();

    return () => { dead = true; };
  }, [items, here, active]);

  useEffect(() => {
    if (!el.current || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => {
      if (mapRef.current && el.current?.offsetHeight > 0) {
        mapRef.current.invalidateSize(false);
      }
    });
    ro.observe(el.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => () => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      layerRef.current = null;
    }
  }, []);

  return <div ref={el} className="map" role="application" aria-label="Mapa" />;
}
