const S = (id, name, zone, km, rating, reviews, price, promo, now, cat, imgs, ll, services) => ({ id, name, zone, km, rating, reviews, price, promo, now, cat, imgs, ll, services });
export const salons = [
  S('estudio-norte', 'Estudio Norte', 'Centro', 0.6, 4.9, 312, 18, '−20%', true, 'cut', ['salon-1.jpg', 'detail.jpg', 'salon-2.jpg'], [4.6097, -74.0817], [['Corte y lavado', 45, 18], ['Color completo', 120, 38], ['Perfilado de barba', 30, 10]]),
  S('nail-lab', 'Nail Lab', 'Chapinero', 1.2, 4.7, 148, 15, null, true, 'nails', ['nails.jpg', 'detail.jpg', 'salon-1.jpg'], [4.6486, -74.0628], [['Manicura semipermanente', 60, 15], ['Diseño de uñas', 90, 24]]),
  S('casa-olivo', 'Casa Olivo', 'Teusaquillo', 1.8, 4.8, 201, 22, '−30%', false, 'color', ['salon-2.jpg', 'salon-1.jpg', 'detail.jpg'], [4.636, -74.09], [['Balayage', 150, 55], ['Tratamiento capilar', 50, 22]]),
  S('barberia-sur', 'Barbería Sur', 'Chicó', 2.1, 4.6, 97, 12, null, true, 'beard', ['barber.jpg', 'salon-2.jpg', 'salon-1.jpg'], [4.67, -74.045], [['Corte clásico', 40, 12], ['Barba y toalla caliente', 30, 10]]),
  S('atelier-piel', 'Atelier Piel', 'Usaquén', 2.6, 4.9, 76, 30, null, false, 'skin', ['detail.jpg', 'nails.jpg', 'salon-2.jpg'], [4.695, -74.031], [['Limpieza facial', 60, 30], ['Masaje relajante', 50, 34]]),
];
export const cats = ['cut', 'nails', 'color', 'skin', 'beard'];
export const catIcon = { cut: 'corte', nails: 'unas', color: 'color', skin: 'piel', beard: 'barba' };
export const rates = { USD: 1, COP: 4000, ARS: 1400, MXN: 18, BRL: 5.5 }; // referencia del prototipo, no cotización real

/** Feed B · reels con fotos + copy inventado (prototipo) */
export const reels = [
  {
    id: 'estudio-norte',
    handle: 'estudionorte',
    name: 'Estudio Norte',
    zone: 'Centro',
    km: 0.6,
    rating: 4.9,
    price: 18,
    promo: '−20%',
    likes: 2140,
    chats: 96,
    imgs: ['reels/hair-1.jpg', 'salon-1.jpg', 'detail.jpg'],
    caption: {
      es: 'Corte + brushing express · turno libre hoy 17:30 con Valen',
      en: 'Cut + express blowout · open today 5:30 PM with Valen',
      pt: 'Corte + escova express · horário livre hoje 17:30 com Valen',
    },
  },
  {
    id: 'nail-lab',
    handle: 'naillab.bo',
    name: 'Nail Lab',
    zone: 'Chapinero',
    km: 1.2,
    rating: 4.7,
    price: 15,
    promo: null,
    likes: 1892,
    chats: 74,
    imgs: ['reels/nails-1.jpg', 'nails.jpg', 'detail.jpg'],
    caption: {
      es: 'Semipermanente nude + french micro · 3 cupos esta tarde',
      en: 'Nude gel + micro french · 3 slots this afternoon',
      pt: 'Esmalte em gel nude + french micro · 3 horários à tarde',
    },
  },
  {
    id: 'casa-olivo',
    handle: 'casaolivo',
    name: 'Casa Olivo',
    zone: 'Teusaquillo',
    km: 1.8,
    rating: 4.8,
    price: 22,
    promo: '−30%',
    likes: 3011,
    chats: 128,
    imgs: ['reels/color-1.jpg', 'salon-2.jpg', 'salon-1.jpg'],
    caption: {
      es: 'Balayage miel · promo flash −30% solo esta semana',
      en: 'Honey balayage · flash −30% this week only',
      pt: 'Balayage mel · promo flash −30% só esta semana',
    },
  },
  {
    id: 'barberia-sur',
    handle: 'barberiasur',
    name: 'Barbería Sur',
    zone: 'Chicó',
    km: 2.1,
    rating: 4.6,
    price: 12,
    promo: null,
    likes: 1560,
    chats: 52,
    imgs: ['reels/barber-1.jpg', 'barber.jpg', 'salon-2.jpg'],
    caption: {
      es: 'Fade + barba a navaja · walk-in hasta las 20:00',
      en: 'Fade + straight-razor beard · walk-in until 8 PM',
      pt: 'Fade + barba na navalha · walk-in até às 20:00',
    },
  },
  {
    id: 'atelier-piel',
    handle: 'atelierpiel',
    name: 'Atelier Piel',
    zone: 'Usaquén',
    km: 2.6,
    rating: 4.9,
    price: 30,
    promo: null,
    likes: 980,
    chats: 41,
    imgs: ['reels/skin-1.jpg', 'detail.jpg', 'reels/makeup-1.jpg'],
    caption: {
      es: 'Limpieza glow + peeling enzimático · piel luminosa en 50 min',
      en: 'Glow cleanse + enzyme peel · luminous skin in 50 min',
      pt: 'Limpeza glow + peeling enzimático · pele luminosa em 50 min',
    },
  },
  {
    id: 'estudio-norte',
    handle: 'glowly.looks',
    name: 'Look del día',
    zone: 'Palermo · demo',
    km: 0.9,
    rating: 4.8,
    price: 28,
    promo: '−15%',
    likes: 4220,
    chats: 210,
    imgs: ['reels/makeup-1.jpg', 'reels/hair-1.jpg', 'nails.jpg'],
    caption: {
      es: 'Maquillaje social soft glam · ideal para eventos de noche',
      en: 'Soft glam social makeup · perfect for evening events',
      pt: 'Maquiagem social soft glam · ideal para eventos à noite',
    },
  },
];

export const t = {
  es: { q1: 'Servicio', q2: 'Cuándo', q3: 'Zona', ph1: 'Corte, color, uñas', ph2: 'Cualquier día', ph3: 'Cerca tuyo', all: 'Todo', promos: 'Promos', now: 'Ahora', cut: 'Corte', nails: 'Uñas', color: 'Color', skin: 'Piel', beard: 'Barba', filters: 'Filtros', maxP: 'Precio máximo', onlyPromo: 'Solo con promo', avail: 'Disponible ahora', r45: 'Puntuación 4,5 o más', clear: 'Borrar', show: 'Mostrar', results: 'resultados', showMap: 'Mostrar mapa', showList: 'Mostrar lista', book: 'Reservar turno', from: 'desde', services: 'Servicios', reviews: 'reseñas', back: 'Volver', points: 'Ganás 40 puntos si reservás en Glowly', gateT: 'Ingresá para reservar', gateP: 'Explorás sin cuenta. Para reservar y pagar necesitamos saber quién sos.', gateB: 'Ingresar o crear cuenta (demo)', s1: 'Elegí el servicio', s2: 'Elegí día y horario', s3: 'Revisá y confirmá', next: 'Siguiente', confirm: 'Confirmar y pagar', done: '¡Reserva confirmada!', doneP: 'Sumaste 40 puntos. Te avisamos por WhatsApp 24 h y 2 h antes.', total: 'Total', close: 'Cerrar', home: 'Inicio', map: 'Mapa', appts: 'Turnos', favs: 'Favoritos', profile: 'Perfil', following: 'Siguiendo', forYou: 'Para vos' },
  en: { q1: 'Service', q2: 'When', q3: 'Area', ph1: 'Cut, color, nails', ph2: 'Any day', ph3: 'Near you', all: 'All', promos: 'Deals', now: 'Now', cut: 'Cut', nails: 'Nails', color: 'Color', skin: 'Skin', beard: 'Beard', filters: 'Filters', maxP: 'Maximum price', onlyPromo: 'Deals only', avail: 'Available now', r45: 'Rating 4.5 or more', clear: 'Clear', show: 'Show', results: 'results', showMap: 'Show map', showList: 'Show list', book: 'Book appointment', from: 'from', services: 'Services', reviews: 'reviews', back: 'Back', points: 'Earn 40 points when you book on Glowly', gateT: 'Log in to book', gateP: 'Browse without an account. To book and pay we need to know who you are.', gateB: 'Log in or sign up (demo)', s1: 'Choose a service', s2: 'Choose day and time', s3: 'Review and confirm', next: 'Next', confirm: 'Confirm and pay', done: 'Booking confirmed!', doneP: 'You earned 40 points. We will remind you on WhatsApp 24 h and 2 h before.', total: 'Total', close: 'Close', home: 'Home', map: 'Map', appts: 'Bookings', favs: 'Saved', profile: 'Profile', following: 'Following', forYou: 'For you' },
  pt: { q1: 'Serviço', q2: 'Quando', q3: 'Região', ph1: 'Corte, cor, unhas', ph2: 'Qualquer dia', ph3: 'Perto de você', all: 'Tudo', promos: 'Promos', now: 'Agora', cut: 'Corte', nails: 'Unhas', color: 'Cor', skin: 'Pele', beard: 'Barba', filters: 'Filtros', maxP: 'Preço máximo', onlyPromo: 'Só com promo', avail: 'Disponível agora', r45: 'Nota 4,5 ou mais', clear: 'Limpar', show: 'Mostrar', results: 'resultados', showMap: 'Mostrar mapa', showList: 'Mostrar lista', book: 'Reservar horário', from: 'a partir de', services: 'Serviços', reviews: 'avaliações', back: 'Voltar', points: 'Ganhe 40 pontos ao reservar no Glowly', gateT: 'Entre para reservar', gateP: 'Explore sem conta. Para reservar e pagar precisamos saber quem você é.', gateB: 'Entrar ou criar conta (demo)', s1: 'Escolha o serviço', s2: 'Escolha dia e horário', s3: 'Revise e confirme', next: 'Próximo', confirm: 'Confirmar e pagar', done: 'Reserva confirmada!', doneP: 'Você ganhou 40 pontos. Avisamos pelo WhatsApp 24 h e 2 h antes.', total: 'Total', close: 'Fechar', home: 'Início', map: 'Mapa', appts: 'Reservas', favs: 'Salvos', profile: 'Perfil', following: 'Seguindo', forYou: 'Para você' },
};
