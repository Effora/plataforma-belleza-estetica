'use client';
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
export default function MapView({ items, label, onPick }) {
  const el = useRef();
  useEffect(() => {
    let map, dead = false;
    (async () => {
      const L = (await import('leaflet')).default; if (dead) return;
      map = L.map(el.current, { zoomControl: false }).setView([4.65, -74.065], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
      items.forEach((s) => L.marker(s.ll, { icon: L.divIcon({ className: 'pin', html: `<b>${label(s)}</b>`, iconSize: [64, 30] }) }).addTo(map).on('click', () => onPick(s.id)));
    })();
    return () => { dead = true; map && map.remove(); };
  }, [items]);
  return <div ref={el} className="map" />;
}
