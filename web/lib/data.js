import { DEFAULT_HERE, distanceKm } from './geo';

// km = distancia al centro demo de Bogotá (se recalcula con la ubicación real si el usuario la comparte)
const S = (id, name, zone, km, rating, reviews, price, promo, now, cat, imgs, ll, services) => ({
  id, name, zone, km: Math.round(distanceKm(DEFAULT_HERE[0], DEFAULT_HERE[1], ll[0], ll[1]) * 10) / 10,
  rating, reviews, price, promo, now, cat, imgs, ll, services,
});
/** Servicios base por rubro: [nombre, minutos, precio USD]; cada comercio los escala con su factor m. */
const svcBy = {
  cut: [['Corte y peinado', 45, 16], ['Brushing', 40, 12], ['Corte + color', 120, 40]],
  nails: [['Manicura semipermanente', 60, 15], ['Pedicura spa', 60, 18], ['Uñas esculpidas', 90, 28]],
  color: [['Balayage', 150, 55], ['Mechas babylights', 140, 48], ['Tinte de raíz', 90, 30]],
  brows: [['Diseño de cejas', 30, 12], ['Laminado de cejas', 45, 24], ['Lifting de pestañas', 60, 28]],
  skin: [['Limpieza facial profunda', 60, 30], ['Hidratación glow', 50, 26], ['Masaje relajante', 60, 34]],
  beard: [['Corte clásico', 40, 12], ['Fade + barba', 50, 16], ['Afeitado a navaja', 30, 10]],
};
/** Comercio de ejemplo inventado (prototipo) */
const N = (id, name, zone, ll, cat, rating, reviews, m, promo, now, imgs) => {
  const services = svcBy[cat].map(([n, min, p]) => [n, min, Math.round(p * m)]);
  return S(id, name, zone, 0, rating, reviews, Math.min(...services.map((x) => x[2])), promo, now, cat, imgs, ll, services);
};
export const salons = [
  S('estudio-norte', 'Estudio Norte', 'Centro', 0.6, 4.9, 312, 18, '−20%', true, 'cut', ['salon-1.jpg', 'detail.jpg', 'salon-2.jpg'], [4.6097, -74.0817], [['Corte y lavado', 45, 18], ['Color completo', 120, 38], ['Perfilado de barba', 30, 10]]),
  S('nail-lab', 'Nail Lab', 'Chapinero', 1.2, 4.7, 148, 15, null, true, 'nails', ['nails.jpg', 'detail.jpg', 'salon-1.jpg'], [4.6486, -74.0628], [['Manicura semipermanente', 60, 15], ['Diseño de uñas', 90, 24]]),
  S('casa-olivo', 'Casa Olivo', 'Teusaquillo', 1.8, 4.8, 201, 22, '−30%', false, 'color', ['salon-2.jpg', 'salon-1.jpg', 'detail.jpg'], [4.636, -74.09], [['Balayage', 150, 55], ['Tratamiento capilar', 50, 22], ['Perfilado de cejas', 25, 10]]),
  S('barberia-sur', 'Barbería Sur', 'Chicó', 2.1, 4.6, 97, 12, null, true, 'beard', ['barber.jpg', 'salon-2.jpg', 'salon-1.jpg'], [4.67, -74.045], [['Corte clásico', 40, 12], ['Barba y toalla caliente', 30, 10]]),
  S('atelier-piel', 'Atelier Piel', 'Usaquén', 2.6, 4.9, 76, 30, null, false, 'skin', ['detail.jpg', 'nails.jpg', 'salon-2.jpg'], [4.695, -74.031], [['Limpieza facial', 60, 30], ['Masaje relajante', 50, 34], ['Diseño de cejas', 30, 12]]),
  S('brow-studio', 'Brow Studio', 'Chapinero Alto', 1.5, 4.9, 184, 14, '−15%', true, 'brows', ['detail.jpg', 'salon-2.jpg', 'nails.jpg'], [4.655, -74.055], [['Diseño y perfilado de cejas', 30, 14], ['Laminado de cejas', 45, 26], ['Henna de cejas', 40, 20], ['Microblading', 120, 80]]),
  // Comercios de ejemplo inventados
  N('tijera-fina', 'Tijera Fina', 'Quinta Camacho', [4.6545, -74.0605], 'cut', 4.8, 221, 1.1, null, true, ['reels/hair-1.jpg', 'salon-1.jpg', 'salon-2.jpg']),
  N('esmalte-club', 'Esmalte Club', 'Zona G', [4.6562, -74.0572], 'nails', 4.9, 302, 1.2, '−10%', true, ['reels/nails-1.jpg', 'nails.jpg', 'detail.jpg']),
  N('rubio-miel', 'Rubio Miel', 'Zona Rosa', [4.6672, -74.0532], 'color', 4.7, 165, 1, '−25%', false, ['reels/color-1.jpg', 'salon-2.jpg', 'salon-1.jpg']),
  N('arco-perfecto', 'Arco Perfecto', 'Chicó', [4.6735, -74.0478], 'brows', 4.8, 143, 1.1, null, true, ['reels/makeup-1.jpg', 'detail.jpg', 'salon-2.jpg']),
  N('piel-de-luna', 'Piel de Luna', 'Rosales', [4.6512, -74.0518], 'skin', 4.9, 118, 1.2, null, true, ['reels/skin-1.jpg', 'detail.jpg', 'reels/makeup-1.jpg']),
  N('navaja-real', 'Navaja Real', 'La Candelaria', [4.5972, -74.0728], 'beard', 4.7, 256, 0.9, '−15%', true, ['reels/barber-1.jpg', 'barber.jpg', 'salon-2.jpg']),
  N('studio-mechon', 'Studio Mechón', 'Galerías', [4.6432, -74.0752], 'cut', 4.6, 98, 0.9, '−20%', false, ['salon-2.jpg', 'reels/hair-1.jpg', 'salon-1.jpg']),
  N('unas-de-seda', 'Uñas de Seda', 'Rosales', [4.6498, -74.0545], 'nails', 4.8, 187, 1.1, null, false, ['nails.jpg', 'reels/nails-1.jpg', 'salon-1.jpg']),
  N('balayage-house', 'Balayage House', 'Santa Bárbara', [4.6981, -74.0402], 'color', 4.9, 274, 1.1, null, true, ['salon-2.jpg', 'reels/color-1.jpg', 'detail.jpg']),
  N('mirada-studio', 'Mirada Studio', 'Galerías', [4.6418, -74.0778], 'brows', 4.7, 89, 0.9, '−20%', true, ['detail.jpg', 'reels/makeup-1.jpg', 'nails.jpg']),
  N('spa-aloe', 'Spa Aloe', 'Usaquén', [4.6968, -74.0335], 'skin', 4.8, 203, 1.1, '−15%', false, ['reels/makeup-1.jpg', 'reels/skin-1.jpg', 'detail.jpg']),
  N('the-fade-room', 'The Fade Room', 'Zona G', [4.6578, -74.0555], 'beard', 4.9, 341, 1.2, null, true, ['barber.jpg', 'reels/barber-1.jpg', 'salon-1.jpg']),
  N('peluqueria-ana', 'La Peluquería de Ana', 'Pasadena', [4.6885, -74.0612], 'cut', 4.7, 156, 0.8, null, true, ['salon-1.jpg', 'salon-2.jpg', 'reels/hair-1.jpg']),
  N('polish-bar', 'Polish Bar', 'Usaquén', [4.6942, -74.0298], 'nails', 4.6, 112, 1, '−30%', true, ['detail.jpg', 'nails.jpg', 'reels/nails-1.jpg']),
  N('cobre-color', 'Cobre Color Bar', 'Niza', [4.7162, -74.0718], 'color', 4.6, 77, 0.9, null, true, ['reels/color-1.jpg', 'salon-1.jpg', 'salon-2.jpg']),
  N('ceja-bonita', 'Ceja Bonita', 'Modelia', [4.6668, -74.1182], 'brows', 4.5, 64, 0.8, '−10%', false, ['reels/makeup-1.jpg', 'salon-1.jpg', 'detail.jpg']),
  N('dermaglow', 'Dermaglow', 'Parque 93', [4.6772, -74.0482], 'skin', 4.9, 289, 1.3, null, true, ['reels/skin-1.jpg', 'salon-2.jpg', 'detail.jpg']),
  N('barberia-don-pepe', 'Barbería Don Pepe', 'Normandía', [4.6655, -74.1052], 'beard', 4.6, 132, 0.8, null, false, ['reels/barber-1.jpg', 'salon-2.jpg', 'barber.jpg']),
  N('corte-co', 'Corte & Co', 'Parque 93', [4.6765, -74.0495], 'cut', 4.9, 264, 1.3, '−15%', true, ['reels/hair-1.jpg', 'detail.jpg', 'salon-2.jpg']),
  N('mani-spa-93', 'Mani Spa 93', 'Parque 93', [4.6781, -74.0469], 'nails', 4.7, 141, 1.2, null, true, ['reels/nails-1.jpg', 'salon-1.jpg', 'nails.jpg']),
  N('ocre-salon', 'Ocre Salón', 'Chapinero', [4.6452, -74.0641], 'color', 4.8, 192, 1, '−20%', true, ['salon-1.jpg', 'reels/color-1.jpg', 'salon-2.jpg']),
  N('lash-brow-85', 'Lash & Brow 85', 'Zona Rosa', [4.6688, -74.0545], 'brows', 4.9, 231, 1.2, null, true, ['detail.jpg', 'salon-2.jpg', 'reels/makeup-1.jpg']),
  N('bruma-facial', 'Bruma Facial', 'La Candelaria', [4.5988, -74.0705], 'skin', 4.6, 73, 0.9, '−20%', true, ['reels/skin-1.jpg', 'reels/makeup-1.jpg', 'salon-1.jpg']),
  N('bigote-club', 'Bigote Club', 'Cedritos', [4.7221, -74.0405], 'beard', 4.7, 158, 1, null, true, ['barber.jpg', 'salon-1.jpg', 'reels/barber-1.jpg']),
  N('salon-bambu', 'Salón Bambú', 'Cedritos', [4.7205, -74.0428], 'cut', 4.5, 81, 0.9, null, false, ['salon-2.jpg', 'reels/hair-1.jpg', 'detail.jpg']),
  N('nacar-nails', 'Nácar Nails', 'Salitre', [4.6532, -74.1048], 'nails', 4.8, 126, 0.9, '−15%', false, ['nails.jpg', 'detail.jpg', 'reels/nails-1.jpg']),
  N('tono-tierra', 'Tono Tierra', 'Park Way', [4.6275, -74.0772], 'color', 4.7, 108, 0.9, null, false, ['reels/color-1.jpg', 'detail.jpg', 'salon-1.jpg']),
  N('brow-bar-colina', 'Brow Bar Colina', 'Colina Campestre', [4.7335, -74.0632], 'brows', 4.6, 95, 1, null, true, ['reels/makeup-1.jpg', 'nails.jpg', 'salon-2.jpg']),
  N('raiz-spa', 'Raíz Spa', 'Quinta Camacho', [4.6528, -74.0618], 'skin', 4.7, 144, 1, null, false, ['detail.jpg', 'reels/skin-1.jpg', 'salon-2.jpg']),
  N('old-town-barber', 'Old Town Barber', 'Suba', [4.7412, -74.0842], 'beard', 4.5, 69, 0.9, '−10%', true, ['reels/barber-1.jpg', 'barber.jpg', 'salon-1.jpg']),
];
export const cats = ['cut', 'nails', 'color', 'brows', 'skin', 'beard'];
export const catIcon = { cut: 'corte', nails: 'unas', color: 'color', brows: 'cejas', skin: 'piel', beard: 'barba' };
export const rates = { USD: 1, COP: 4000, ARS: 1400, MXN: 18, BRL: 5.5 }; // referencia del prototipo, no cotización real

/** Feed B · reels con fotos + copy inventado (prototipo) */
export const demoComments = {
  es: [
    { u: 'camila.r', t: '¿Tienen turno mañana a la mañana?' },
    { u: 'lucas_fade', t: 'Fui la semana pasada, impecable 🔥' },
    { u: 'sofimakeup', t: '¿El −20% aplica a color también?' },
  ],
  en: [
    { u: 'camila.r', t: 'Any slots tomorrow morning?' },
    { u: 'lucas_fade', t: 'Went last week — amazing 🔥' },
    { u: 'sofimakeup', t: 'Does the −20% apply to color too?' },
  ],
  pt: [
    { u: 'camila.r', t: 'Tem horário amanhã de manhã?' },
    { u: 'lucas_fade', t: 'Fui semana passada, impecável 🔥' },
    { u: 'sofimakeup', t: 'O −20% vale também para cor?' },
  ],
};

export const reels = [
  {
    id: 'estudio-norte', handle: 'estudionorte', name: 'Estudio Norte', zone: 'Centro', km: 0.6, rating: 4.9, price: 18, promo: '−20%', likes: 2140, chats: 96, following: true,
    imgs: ['reels/hair-1.jpg', 'salon-1.jpg', 'detail.jpg'],
    caption: { es: 'Corte + brushing express · turno libre hoy 17:30 con Valen', en: 'Cut + express blowout · open today 5:30 PM with Valen', pt: 'Corte + escova express · horário livre hoje 17:30 com Valen' },
  },
  {
    id: 'nail-lab', handle: 'naillab.bo', name: 'Nail Lab', zone: 'Chapinero', km: 1.2, rating: 4.7, price: 15, promo: null, likes: 1892, chats: 74, following: true,
    imgs: ['reels/nails-1.jpg', 'nails.jpg', 'detail.jpg'],
    caption: { es: 'Semipermanente nude + french micro · 3 cupos esta tarde', en: 'Nude gel + micro french · 3 slots this afternoon', pt: 'Esmalte em gel nude + french micro · 3 horários à tarde' },
  },
  {
    id: 'casa-olivo', handle: 'casaolivo', name: 'Casa Olivo', zone: 'Teusaquillo', km: 1.8, rating: 4.8, price: 22, promo: '−30%', likes: 3011, chats: 128, following: false,
    imgs: ['reels/color-1.jpg', 'salon-2.jpg', 'salon-1.jpg'],
    caption: { es: 'Balayage miel · promo flash −30% solo esta semana', en: 'Honey balayage · flash −30% this week only', pt: 'Balayage mel · promo flash −30% só esta semana' },
  },
  {
    id: 'barberia-sur', handle: 'barberiasur', name: 'Barbería Sur', zone: 'Chicó', km: 2.1, rating: 4.6, price: 12, promo: null, likes: 1560, chats: 52, following: true,
    imgs: ['reels/barber-1.jpg', 'barber.jpg', 'salon-2.jpg'],
    caption: { es: 'Fade + barba a navaja · walk-in hasta las 20:00', en: 'Fade + straight-razor beard · walk-in until 8 PM', pt: 'Fade + barba na navalha · walk-in até às 20:00' },
  },
  {
    id: 'atelier-piel', handle: 'atelierpiel', name: 'Atelier Piel', zone: 'Usaquén', km: 2.6, rating: 4.9, price: 30, promo: null, likes: 980, chats: 41, following: false,
    imgs: ['reels/skin-1.jpg', 'detail.jpg', 'reels/makeup-1.jpg'],
    caption: { es: 'Limpieza glow + peeling enzimático · piel luminosa en 50 min', en: 'Glow cleanse + enzyme peel · luminous skin in 50 min', pt: 'Limpeza glow + peeling enzimático · pele luminosa em 50 min' },
  },
  {
    id: 'estudio-norte', handle: 'glowlys.looks', name: 'Look del día', zone: 'Palermo · demo', km: 0.9, rating: 4.8, price: 28, promo: '−15%', likes: 4220, chats: 210, following: false,
    imgs: ['reels/makeup-1.jpg', 'reels/hair-1.jpg', 'nails.jpg'],
    caption: { es: 'Maquillaje social soft glam · ideal para eventos de noche', en: 'Soft glam social makeup · perfect for evening events', pt: 'Maquiagem social soft glam · ideal para eventos à noite' },
  },
  {
    id: 'brow-studio', handle: 'browstudio.co', name: 'Brow Studio', zone: 'Chapinero Alto', km: 1.5, rating: 4.9, price: 14, promo: '−15%', likes: 1204, chats: 58, following: false,
    imgs: ['detail.jpg', 'salon-2.jpg', 'nails.jpg'],
    caption: { es: 'Laminado + diseño de cejas · 2 cupos libres hoy', en: 'Brow lamination + shaping · 2 slots open today', pt: 'Laminação + design de sobrancelhas · 2 horários hoje' },
  },
];

export const BRAND = 'Glowlys';
export const F0 = { cat: null, max: 60, promo: false, now: false, rate: false };
export const norm = (x) => (x || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export const matchQ = (s, q) => { const k = norm(q); if (!k) return true; return norm([s.name, s.zone, ...s.services.map((x) => x[0])].join(' ')).includes(k); };
/** Sugerencias al escribir (3+ letras): categorías, servicios, comercios y zonas */
export const suggest = (q, tr = {}) => {
  const k = norm(q);
  if (k.length < 3) return [];
  const out = [];
  cats.forEach((c) => { if (norm(tr[c]).includes(k)) out.push({ type: 'cat', label: tr[c], value: c, n: salons.filter((x) => x.cat === c).length }); });
  const svc = new Map();
  salons.forEach((x) => x.services.forEach(([name, , usd]) => { if (norm(name).includes(k)) { const e = svc.get(name) || { n: 0, usd }; svc.set(name, { n: e.n + 1, usd: Math.min(e.usd, usd) }); } }));
  [...svc.entries()].forEach(([name, e]) => out.push({ type: 'service', label: name, value: name, n: e.n, usd: e.usd }));
  salons.forEach((x) => { if (norm(x.name).includes(k)) out.push({ type: 'salon', label: x.name, value: x.id, sub: x.zone }); });
  [...new Set(salons.map((x) => x.zone))].forEach((z) => { if (norm(z).includes(k)) out.push({ type: 'zone', label: z, value: z }); });
  return out.slice(0, 8);
};
export const applyF = (f = F0, list = salons) => list.filter((s) => (!f.cat || s.cat === f.cat) && s.price <= f.max && (!f.promo || s.promo) && (!f.now || s.now) && (!f.rate || s.rating >= 4.5));

export const t = {
  es: { classicView: 'Vista clásica', videoView: 'Vista video', settings: 'Configuración', sCat: 'Categoría', sService: 'Servicio', sSalon: 'Comercio', sZone: 'Zona', sPlaces: 'comercios', sPlace: 'comercio', sFrom: 'desde', roleTitle: '¿Cómo querés usar Glowlys?', roleUser: 'Busco comercios', roleUserP: 'Encontrá salones cerca, reservá, pagá y sumá puntos.', roleShop: 'Quiero registrar mi comercio', roleShopP: 'Aparecé en el mapa, mostrá tus servicios y recibí reservas. 60 días gratis.', shopAcc: 'Cuenta de comercio', shopAccSub: 'Creá tu cuenta para registrar tu negocio.', myShop: 'Mi comercio', registerShop: 'Registrar mi comercio', follow: 'Seguir', unfollow: 'Siguiendo', search: 'Buscar', searchPh: 'Corte, color, uñas, barrio…', needAuth: 'Ingresá o creá tu cuenta para dar me gusta, seguir comercios, comentar y reservar.', done2: 'Listo', category: 'Categoría', q1: 'Servicio', q2: 'Cuándo', q3: 'Zona', ph1: 'Corte, color, uñas', ph2: 'Cualquier día', ph3: 'Cerca tuyo', all: 'Todo', promos: 'Promos', now: 'Ahora', cut: 'Corte', nails: 'Uñas', color: 'Color', brows: 'Cejas', skin: 'Piel', beard: 'Barba', filters: 'Filtros', maxP: 'Precio máximo', onlyPromo: 'Solo con promo', avail: 'Disponible ahora', r45: 'Puntuación 4,5 o más', clear: 'Borrar', show: 'Mostrar', results: 'resultados', showMap: 'Mostrar mapa', showList: 'Mostrar lista', book: 'Reservar turno', from: 'desde', services: 'Servicios', reviews: 'reseñas', back: 'Volver', points: 'Ganás 40 puntos si reservás en Glowlys', gateT: 'Ingresá para reservar', gateP: 'Explorás sin cuenta. Para reservar y pagar necesitamos saber quién sos.', gateB: 'Ingresar o crear cuenta', s1: 'Elegí el servicio', s2: 'Elegí día y horario', s3: 'Revisá y confirmá', next: 'Siguiente', confirm: 'Confirmar y pagar', done: '¡Reserva confirmada!', doneP: 'Sumaste 40 puntos. Te avisamos por WhatsApp 24 h y 2 h antes.', total: 'Total', close: 'Cerrar', home: 'Inicio', map: 'Mapa', appts: 'Turnos', favs: 'Favoritos', profile: 'Perfil', following: 'Siguiendo', forYou: 'Para vos', nearYou: 'Cerca tuyo', useLocation: 'Usar mi ubicación', geoDenied: 'No pudimos acceder a tu ubicación. Mostramos Bogotá de ejemplo.', noAppts: 'Todavía no tenés turnos. Reservá uno para verlo acá.', noFavs: 'Guardá salones con el corazón para verlos acá.', guest: 'Invitado', loggedIn: 'Sesión activa', logout: 'Cerrar sesión', pointsHint: 'Los puntos se suman al confirmar una reserva.', lang: 'Idioma', currency: 'Moneda', searching: 'Buscando…', login: 'Ingresar', loginTitle: 'Ingresá a Glowlys', loginSub: 'Reservá turnos y guardá tus favoritos.', continueGoogle: 'Continuar con Google', continueEmail: 'Continuar con email', createAccount: 'Crear cuenta', noAccount: '¿No tenés cuenta?', loginBtn: 'Iniciar sesión', email: 'Email', password: 'Contraseña', name: 'Nombre', authError: 'Email o contraseña inválidos (mín. 4 caracteres).', comments: 'Comentarios', commentPh: 'Escribí un comentario…', send: 'Enviar', share: 'Compartir', shared: 'Link copiado', shareText: 'Mirá esto en Glowlys', geoFar: 'Todavía no hay comercios en tu zona. Mostramos Bogotá de ejemplo.', secPop: 'Populares cerca tuyo', secPromo: 'Promos de la semana', secNow: 'Con turno hoy', nearS: 'cerca tuyo', emptyFollowing: 'Todavía no seguís a ningún comercio. Tocá Seguir en cualquier salón de Para vos y aparecerá acá.' },
  en: { classicView: 'Classic view', videoView: 'Video view', settings: 'Settings', sCat: 'Category', sService: 'Service', sSalon: 'Business', sZone: 'Area', sPlaces: 'businesses', sPlace: 'business', sFrom: 'from', roleTitle: 'How do you want to use Glowlys?', roleUser: 'I’m looking for businesses', roleUserP: 'Find salons nearby, book, pay and earn points.', roleShop: 'I want to register my business', roleShopP: 'Show up on the map, list your services and get bookings. 60 days free.', shopAcc: 'Business account', shopAccSub: 'Create your account to register your business.', myShop: 'My business', registerShop: 'Register my business', follow: 'Follow', unfollow: 'Following', search: 'Search', searchPh: 'Cut, color, nails, area…', needAuth: 'Log in or sign up to like, follow businesses, comment and book.', done2: 'Done', category: 'Category', q1: 'Service', q2: 'When', q3: 'Area', ph1: 'Cut, color, nails', ph2: 'Any day', ph3: 'Near you', all: 'All', promos: 'Deals', now: 'Now', cut: 'Cut', nails: 'Nails', color: 'Color', brows: 'Brows', skin: 'Skin', beard: 'Beard', filters: 'Filters', maxP: 'Maximum price', onlyPromo: 'Deals only', avail: 'Available now', r45: 'Rating 4.5 or more', clear: 'Clear', show: 'Show', results: 'results', showMap: 'Show map', showList: 'Show list', book: 'Book appointment', from: 'from', services: 'Services', reviews: 'reviews', back: 'Back', points: 'Earn 40 points when you book on Glowlys', gateT: 'Log in to book', gateP: 'Browse without an account. To book and pay we need to know who you are.', gateB: 'Log in or sign up', s1: 'Choose a service', s2: 'Choose day and time', s3: 'Review and confirm', next: 'Next', confirm: 'Confirm and pay', done: 'Booking confirmed!', doneP: 'You earned 40 points. We will remind you on WhatsApp 24 h and 2 h before.', total: 'Total', close: 'Close', home: 'Home', map: 'Map', appts: 'Bookings', favs: 'Saved', profile: 'Profile', following: 'Following', forYou: 'For you', nearYou: 'Near you', useLocation: 'Use my location', geoDenied: 'Location unavailable. Showing Bogotá as demo.', noAppts: 'No bookings yet. Book one to see it here.', noFavs: 'Tap the heart on a salon to save it here.', guest: 'Guest', loggedIn: 'Signed in', logout: 'Log out', pointsHint: 'Points are added when you confirm a booking.', lang: 'Language', currency: 'Currency', searching: 'Searching…', login: 'Log in', loginTitle: 'Log in to Glowlys', loginSub: 'Book appointments and save favorites.', continueGoogle: 'Continue with Google', continueEmail: 'Continue with email', createAccount: 'Create account', noAccount: 'No account yet?', loginBtn: 'Log in', email: 'Email', password: 'Password', name: 'Name', authError: 'Invalid email or password (min. 4 characters).', comments: 'Comments', commentPh: 'Write a comment…', send: 'Send', share: 'Share', shared: 'Link copied', shareText: 'Check this on Glowlys', geoFar: 'No businesses in your area yet. Showing Bogotá as demo.', secPop: 'Popular near you', secPromo: 'Deals this week', secNow: 'Open slots today', nearS: 'near you', emptyFollowing: 'You’re not following any business yet. Tap Follow on any salon in For you and it will show up here.' },
  pt: { classicView: 'Visão clássica', videoView: 'Visão em vídeo', settings: 'Configurações', sCat: 'Categoria', sService: 'Serviço', sSalon: 'Negócio', sZone: 'Região', sPlaces: 'negócios', sPlace: 'negócio', sFrom: 'desde', roleTitle: 'Como você quer usar o Glowlys?', roleUser: 'Procuro negócios', roleUserP: 'Encontre salões perto, reserve, pague e ganhe pontos.', roleShop: 'Quero cadastrar meu negócio', roleShopP: 'Apareça no mapa, mostre seus serviços e receba reservas. 60 dias grátis.', shopAcc: 'Conta de negócio', shopAccSub: 'Crie sua conta para cadastrar seu negócio.', myShop: 'Meu negócio', registerShop: 'Cadastrar meu negócio', follow: 'Seguir', unfollow: 'Seguindo', search: 'Buscar', searchPh: 'Corte, cor, unhas, bairro…', needAuth: 'Entre ou crie sua conta para curtir, seguir negócios, comentar e reservar.', done2: 'Pronto', category: 'Categoria', q1: 'Serviço', q2: 'Quando', q3: 'Região', ph1: 'Corte, cor, unhas', ph2: 'Qualquer dia', ph3: 'Perto de você', all: 'Tudo', promos: 'Promos', now: 'Agora', cut: 'Corte', nails: 'Unhas', color: 'Cor', brows: 'Sobrancelhas', skin: 'Pele', beard: 'Barba', filters: 'Filtros', maxP: 'Preço máximo', onlyPromo: 'Só com promo', avail: 'Disponível agora', r45: 'Nota 4,5 ou mais', clear: 'Limpar', show: 'Mostrar', results: 'resultados', showMap: 'Mostrar mapa', showList: 'Mostrar lista', book: 'Reservar horário', from: 'a partir de', services: 'Serviços', reviews: 'avaliações', back: 'Voltar', points: 'Ganhe 40 pontos ao reservar no Glowlys', gateT: 'Entre para reservar', gateP: 'Explore sem conta. Para reservar e pagar precisamos saber quem você é.', gateB: 'Entrar ou criar conta', s1: 'Escolha o serviço', s2: 'Escolha dia e horário', s3: 'Revise e confirme', next: 'Próximo', confirm: 'Confirmar e pagar', done: 'Reserva confirmada!', doneP: 'Você ganhou 40 pontos. Avisamos pelo WhatsApp 24 h e 2 h antes.', total: 'Total', close: 'Fechar', home: 'Início', map: 'Mapa', appts: 'Reservas', favs: 'Salvos', profile: 'Perfil', following: 'Seguindo', forYou: 'Para você', nearYou: 'Perto de você', useLocation: 'Usar minha localização', geoDenied: 'Sem localização. Mostramos Bogotá como demo.', noAppts: 'Ainda sem reservas. Reserve uma para ver aqui.', noFavs: 'Toque no coração para salvar salões aqui.', guest: 'Convidado', loggedIn: 'Sessão ativa', logout: 'Sair', pointsHint: 'Pontos entram ao confirmar a reserva.', lang: 'Idioma', currency: 'Moeda', searching: 'Buscando…', login: 'Entrar', loginTitle: 'Entre no Glowlys', loginSub: 'Reserve horários e salve favoritos.', continueGoogle: 'Continuar com Google', continueEmail: 'Continuar com email', createAccount: 'Criar conta', noAccount: 'Ainda não tem conta?', loginBtn: 'Entrar', email: 'Email', password: 'Senha', name: 'Nome', authError: 'Email ou senha inválidos (mín. 4 caracteres).', comments: 'Comentários', commentPh: 'Escreva um comentário…', send: 'Enviar', share: 'Compartilhar', shared: 'Link copiado', shareText: 'Veja isso no Glowlys', geoFar: 'Ainda não há negócios na sua região. Mostramos Bogotá como demo.', secPop: 'Populares perto de você', secPromo: 'Promos da semana', secNow: 'Com horário hoje', nearS: 'perto de você', emptyFollowing: 'Você ainda não segue nenhum negócio. Toque em Seguir em qualquer salão de Para você e ele aparece aqui.' },
};
