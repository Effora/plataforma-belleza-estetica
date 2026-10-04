// Registro de comercios (frontend). Los datos se guardarán en Supabase cuando se conecte el backend.
export const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
export const PAY_METHODS = ['card', 'nequi', 'pse', 'transfer', 'cash'];
export const COUNTRIES = [['CO', 'Colombia'], ['AR', 'Argentina'], ['MX', 'México'], ['BR', 'Brasil'], ['CL', 'Chile'], ['PE', 'Perú'], ['UY', 'Uruguay'], ['US', 'United States'], ['ES', 'España']];
export const STEPS = ['biz', 'where', 'hours', 'media', 'svc', 'pay', 'plan'];

export const M0 = {
  name: '', cats: [], desc: '', phone: '', country: 'CO',
  address: '', city: '', lat: null, lng: null,
  hours: Object.fromEntries(DAYS.map((d) => [d, { on: d !== 'sun', from: '09:00', to: '19:00' }])),
  pay: { card: true, nequi: false, pse: false, transfer: false, cash: true },
  payout: { country: 'CO', holder: '', docType: '', bank: '', type: 'savings', account: '' },
  plan: 'basic',
  status: 'draft',
};

const es = {
  roleTitle: 'Bienvenida/o a Glowlys', roleSub: '¿Qué querés hacer?',
  roleUser: 'Busco comercios', roleUserSub: 'Encontrá salones cerca tuyo, reservá y sumá puntos.',
  roleBiz: 'Quiero registrar mi comercio', roleBizSub: 'Aparecé en el mapa, recibí reservas y gestioná tu negocio.',
  bizTitle: 'Creá la cuenta de tu comercio', bizSub: 'Con esta cuenta vas a cargar tu comercio, tus servicios y tus cobros.',
  myShop: 'Mi comercio', editShop: 'Editar mi comercio', registerShop: 'Registrar mi comercio',
  step: 'Paso', of: 'de', next: 'Siguiente', back: 'Atrás', publish: 'Enviar mi comercio', saveExit: 'Guardar y salir',
  s_biz: 'Tu comercio', s_where: 'Ubicación', s_hours: 'Horarios', s_media: 'Fotos y videos', s_svc: 'Servicios', s_pay: 'Pagos y cobros', s_plan: 'Plan',
  bizName: 'Nombre del comercio', bizCats: 'Qué ofrecés (podés elegir varias)', bizDesc: 'Descripción', bizDescPh: 'Contá en pocas líneas qué hace especial a tu comercio.', bizPhone: 'WhatsApp de contacto',
  country: 'País', address: 'Dirección', addressPh: 'Calle, número, barrio', city: 'Ciudad', useGeo: 'Usar mi ubicación actual', geoOk: 'Ubicación guardada', geoHelp: 'Con la dirección y la ubicación te mostramos en el mapa para quienes buscan cerca.',
  hoursHelp: 'Marcá los días que atendés y el horario de apertura y cierre.', open: 'Abierto', closed: 'Cerrado', copyAll: 'Copiar el horario de Lunes a los demás días abiertos',
  mon: 'Lunes', tue: 'Martes', wed: 'Miércoles', thu: 'Jueves', fri: 'Viernes', sat: 'Sábado', sun: 'Domingo',
  photos: 'Fotos del comercio', photosHelp: 'La primera foto es la portada. Mínimo 1.', addPhotos: 'Agregar fotos', videos: 'Videos (opcional)', addVideos: 'Agregar videos', remove: 'Quitar', cover: 'Portada',
  filesNote: 'Por ahora los archivos solo se ven en esta sesión. Al conectar el backend se suben a Supabase Storage.',
  svcHelp: 'Cargá los servicios con su precio. Las fotos y videos de cada servicio son opcionales.', addSvc: 'Agregar servicio', svcName: 'Nombre del servicio', svcDesc: 'Descripción', svcPrice: 'Precio (USD)', svcMin: 'Duración (min)', svcMedia: 'Foto o video (opcional)', svcSave: 'Guardar servicio', svcEmpty: 'Todavía no cargaste servicios.', cancel: 'Cancelar', min: 'min',
  payMethods: 'Medios de pago que aceptás', card: 'Tarjeta', nequi: 'Nequi', pse: 'PSE', transfer: 'Transferencia', cash: 'Efectivo en el local',
  payHelp: 'Los clientes pagan la reserva completa desde la app. Indicá la cuenta donde querés recibir esos pagos.',
  payoutTitle: 'Cuenta para recibir tus pagos', holder: 'Titular de la cuenta', docType: 'Documento del titular', bank: 'Banco o billetera', accType: 'Tipo de cuenta', savings: 'Ahorros', checking: 'Corriente', accNum: 'Número de cuenta', accPh: 'Número de cuenta o CBU/CLABE',
  payoutNote: 'Prototipo: la cuenta se asociará a la pasarela de pagos al conectar el backend. No guardamos el número en este dispositivo.',
  planHelp: 'Sin comisiones por cliente. Podés cambiar de plan cuando quieras.',
  planBasic: 'Básico', planBasicP: 'USD 0 por 60 días', planBasicD: ['Perfil en el marketplace', 'Agenda online', 'Hasta 50 reservas por mes'],
  planPro: 'Pro', planProP: 'USD 25 por mes', planProD: ['Reservas ilimitadas', 'Recordatorios por WhatsApp y email', 'CRM, caja, sucursales y reseñas', 'Posición destacada en el mapa'],
  chosen: 'Elegido', choose: 'Elegir', summary: 'Resumen',
  doneTitle: '¡Recibimos tu comercio!', doneP: 'Lo revisamos y, cuando esté aprobado, aparece en el mapa para quienes buscan cerca. Te avisamos por WhatsApp.', doneBtn: 'Volver a la app', status: 'Estado', statusReview: 'En revisión',
  need: 'Completá los campos obligatorios para seguir.',
  nm: 'Corte, uñas, color…',
};
const en = {
  roleTitle: 'Welcome to Glowlys', roleSub: 'What would you like to do?',
  roleUser: 'I’m looking for businesses', roleUserSub: 'Find salons near you, book and earn points.',
  roleBiz: 'I want to register my business', roleBizSub: 'Show up on the map, get bookings and run your business.',
  bizTitle: 'Create your business account', bizSub: 'With this account you’ll set up your business, services and payouts.',
  myShop: 'My business', editShop: 'Edit my business', registerShop: 'Register my business',
  step: 'Step', of: 'of', next: 'Next', back: 'Back', publish: 'Submit my business', saveExit: 'Save and exit',
  s_biz: 'Your business', s_where: 'Location', s_hours: 'Opening hours', s_media: 'Photos & videos', s_svc: 'Services', s_pay: 'Payments & payouts', s_plan: 'Plan',
  bizName: 'Business name', bizCats: 'What you offer (pick several)', bizDesc: 'Description', bizDescPh: 'Tell us in a few lines what makes your business special.', bizPhone: 'Contact WhatsApp',
  country: 'Country', address: 'Address', addressPh: 'Street, number, area', city: 'City', useGeo: 'Use my current location', geoOk: 'Location saved', geoHelp: 'With your address and location we show you on the map to people searching nearby.',
  hoursHelp: 'Mark the days you’re open and your opening and closing times.', open: 'Open', closed: 'Closed', copyAll: 'Copy Monday’s hours to the other open days',
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
  photos: 'Business photos', photosHelp: 'The first photo is the cover. At least 1.', addPhotos: 'Add photos', videos: 'Videos (optional)', addVideos: 'Add videos', remove: 'Remove', cover: 'Cover',
  filesNote: 'For now files only live in this session. Once the backend is connected they upload to Supabase Storage.',
  svcHelp: 'Add your services with prices. Photos and videos for each service are optional.', addSvc: 'Add service', svcName: 'Service name', svcDesc: 'Description', svcPrice: 'Price (USD)', svcMin: 'Duration (min)', svcMedia: 'Photo or video (optional)', svcSave: 'Save service', svcEmpty: 'No services yet.', cancel: 'Cancel', min: 'min',
  payMethods: 'Payment methods you accept', card: 'Card', nequi: 'Nequi', pse: 'PSE', transfer: 'Bank transfer', cash: 'Cash at the venue',
  payHelp: 'Customers pay the full booking in the app. Tell us the account where you want to receive those payments.',
  payoutTitle: 'Account to receive your payouts', holder: 'Account holder', docType: 'Holder’s ID number', bank: 'Bank or wallet', accType: 'Account type', savings: 'Savings', checking: 'Checking', accNum: 'Account number', accPh: 'Account number or IBAN/CBU/CLABE',
  payoutNote: 'Prototype: the account will be linked to the payment gateway once the backend is connected. We don’t store the number on this device.',
  planHelp: 'No per-customer commissions. Change plan any time.',
  planBasic: 'Basic', planBasicP: 'USD 0 for 60 days', planBasicD: ['Marketplace profile', 'Online scheduling', 'Up to 50 bookings per month'],
  planPro: 'Pro', planProP: 'USD 25 per month', planProD: ['Unlimited bookings', 'WhatsApp and email reminders', 'CRM, cash register, branches and reviews', 'Featured spot on the map'],
  chosen: 'Selected', choose: 'Choose', summary: 'Summary',
  doneTitle: 'We got your business!', doneP: 'We’ll review it and, once approved, it shows up on the map for people searching nearby. We’ll let you know on WhatsApp.', doneBtn: 'Back to the app', status: 'Status', statusReview: 'In review',
  need: 'Complete the required fields to continue.',
  nm: 'Cut, nails, color…',
};
const tm = { es, en, pt: es };
export const tmFor = (lang) => ({ ...es, ...(tm[lang] || {}) });
