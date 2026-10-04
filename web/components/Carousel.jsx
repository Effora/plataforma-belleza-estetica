'use client';
import { useRef, useState } from 'react';
import { Icon } from './Shell';
export default function Carousel({ imgs, alt }) {
  const r = useRef(); const [i, setI] = useState(0);
  const go = (d, e) => { e.preventDefault(); r.current.scrollBy({ left: d * r.current.clientWidth, behavior: 'smooth' }); };
  return (<div className="car"><div className="trk" ref={r} onScroll={(e) => setI(Math.round(e.target.scrollLeft / e.target.clientWidth))}>{imgs.map((m, k) => <img key={m} src={`/media/${m}`} alt={`${alt} ${k + 1}`} loading="lazy" />)}</div>
    {i > 0 && <button className="ar l" aria-label="‹" onClick={(e) => go(-1, e)}><Icon n="atras" size={16} /></button>}
    {i < imgs.length - 1 && <button className="ar r" aria-label="›" onClick={(e) => go(1, e)}><Icon n="atras" size={16} /></button>}
    <div className="dots">{imgs.map((m, k) => <i key={m} className={k === i ? 'on' : ''} />)}</div></div>);
}
