import { salons } from '../../../lib/data';
import Detail from '../../../components/Detail';
export const generateStaticParams = () => salons.map((s) => ({ id: s.id }));
const find = async (params) => { const { id } = await params; return salons.find((x) => x.id === id); };
export async function generateMetadata({ params }) { const s = await find(params); return { title: `${s?.name || 'Salón'} · Glowlys` }; }
export default async function Page({ params }) { return <Detail s={await find(params)} />; }
