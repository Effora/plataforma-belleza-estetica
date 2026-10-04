import './globals.css';
import Shell from '../components/Shell';

export const metadata = {
  title: 'Glowlys · Descubrí belleza cerca tuyo',
  description: 'Glowlys: encontrá, reservá y ganá puntos en salones, barberías y estética cerca tuyo.',
  robots: { index: false, follow: false },
  icons: { icon: '/icon.png' },
};

export default function Layout({ children }) {
  return (
    <html lang="es" data-v="a">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
