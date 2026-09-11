import { Fragment } from 'react';
import { Shirt, MapPin, Package, Sprout, Leaf, TriangleAlert, Check, X } from 'lucide-react';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/footer/Footer';

const etapas = [
  { numero: 1, Icone: Shirt, titulo: 'Separe os tecidos', descricao: 'Selecione roupas e tecidos que você não usa mais.' },
  { numero: 2, Icone: MapPin, titulo: 'Encontre um ponto', descricao: 'Localize o ponto de coleta mais próximo de você.' },
  { numero: 3, Icone: Package, titulo: 'Faça a doação', descricao: 'Leve os itens até o local indicado.' },
  { numero: 4, Icone: Sprout, titulo: 'Gere impacto', descricao: 'Seus tecidos serão destinados corretamente.' },
];

const itensPermitidos = ['Roupas em bom estado', 'Roupas em geral', 'Lençóis e toalhas', 'Calçados'];
const itensProibidos = ['Roupas muito sujas ou molhadas', 'Roupas com mofo', 'Itens contaminados', 'Materiais não têxteis'];

export default function About() {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <Header />

      <main className="bg-white px-6 md:px-10 py-16 font-sans flex-1">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-serif text-4xl font-bold text-emerald-950">Como funciona</h1>
          <p className="mt-4 text-gray-500 leading-relaxed">
            Entenda como dar o destino correto para os seus tecidos e contribuir para um mundo mais sustentável.
          </p>
        </div>

        <div className="mt-16 max-w-4xl mx-auto flex items-start justify-between gap-2">
          {etapas.map((etapa, indice) => (
            <Fragment key={etapa.numero}>
              <div className="flex flex-col items-center text-center w-36 md:w-44">
                <div className="w-10 h-10 rounded-full bg-emerald-950 text-white flex items-center justify-center font-semibold text-sm">
                  {etapa.numero}
                </div>
                <etapa.Icone className="w-6 h-6 text-emerald-800 mt-4" />
                <h3 className="mt-3 font-semibold text-gray-900 text-sm md:text-base">{etapa.titulo}</h3>
                <p className="mt-1 text-xs md:text-sm text-gray-500">{etapa.descricao}</p>
              </div>

              {indice < etapas.length - 1 && (
                <div className="flex-1 border-t-2 border-dashed border-emerald-200 mt-5 hidden sm:block" />
              )}
            </Fragment>
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl bg-emerald-50 p-6">
            <div className="flex items-center gap-2 text-emerald-900 font-semibold">
              <Leaf className="w-5 h-5" />
              O que pode ser doado?
            </div>
            <ul className="mt-4 space-y-3">
              {itensPermitidos.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-amber-50 p-6">
            <div className="flex items-center gap-2 text-amber-800 font-semibold">
              <TriangleAlert className="w-5 h-5" />
              O que não deve ser doado?
            </div>
            <ul className="mt-4 space-y-3">
              {itensProibidos.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <X className="w-4 h-4 text-red-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}