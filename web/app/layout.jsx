import './globals.css';
import Shell from '../components/Shell';
export const metadata = { title: 'Glowly · Descubrí belleza cerca tuyo', description: 'Prototipo Glowly: encontrá, reservá y ganá puntos en salones, barberías y estética.', robots: { index: false, follow: false }, icons: { icon: '/icon.png' } };
export default function Layout({ children }) { return (<html lang="es" data-v="a"><body><Shell>{children}</Shell></body></html>); }
