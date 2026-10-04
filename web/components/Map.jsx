'use client';
import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { DEFAULT_HERE } from '../lib/geo';

const TILES = [
  {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    opts: { attribution: '© OSM © CARTO', maxZoom: 18, subdomains: 'abcd', updateWhenIdle: true },
  },
  {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    opts: { attribution: '© OpenStreetMap', maxZoom: 19, updateWhenIdle: true },
  },
];

const pinHtml = (text, promo) => `
  <div class="gpin ${promo ? 'gpin--promo' : ''}">
    ${promo ? `<em>${promo}</em>` : ''}
    <b>${text}</b>
  </div>
`;

let leafletPromise = null;
const loadLeaflet = () => {
  if (!leafletPromise) {
    leafletPromise = import('leaflet').then((m) => m.default);
  }
  return leafletPromise;
};

export default function MapView({ items, label, onPick, here, active = true }) {
  const el = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const tileRef = useRef(null);
  const tileIndex = useRef(0);
  const onPickRef = useRef(onPick);
  const labelRef = useRef(label);
  const [err, setErr] = useState('');
  onPickRef.current = onPick;
  labelRef.current = label;

  useEffect(() => {
    if (!active || !el.current) return undefined;
    let dead = false;
    setErr('');

    (async () => {
      const L = await loadLeaflet();
      if (dead || !el.current) return;

      const center = here || DEFAULT_HERE;
      if (!mapRef.current) {
        const map = L.map(el.current, {
          zoomControl: false,
          preferCanvas: true,
          fadeAnimation: false,
          zoomAnimation: false,
        }).setView(center, 12);
        mapRef.current = map;
        layerRef.current = L.layerGroup().addTo(map);

        const attachTiles = (index) => {
          const conf = TILES[index];
          if (!conf) {
            setErr('No se pudo cargar el mapa. Revisá tu conexión e intentá de nuevo.');
            return;
          }
          if (tileRef.current) {
            map.removeLayer(tileRef.current);
            tileRef.current = null;
          }
          tileIndex.current = index;
          let fails = 0;
          const layer = L.tileLayer(conf.url, conf.opts);
          layer.on('tileerror', () => {
            fails += 1;
            if (fails >= 3 && tileIndex.current === index) {
              attachTiles(index + 1);
            }
          });
          layer.addTo(map);
          tileRef.current = layer;
        };
        attachTiles(0);
        requestAnimationFrame(() => map.invalidateSize(false));
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
    })().catch(() => {
      if (!dead) setErr('No se pudo cargar el mapa. Revisá tu conexión e intentá de nuevo.');
    });

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
      tileRef.current = null;
    }
  }, []);

  return (
    <div className="map-wrap">
      <div ref={el} className="map" role="application" aria-label="Mapa" />
      {err && <p className="map-err" role="alert">{err}</p>}
    </div>
  );
}
