import { Link } from 'react-router-dom'
import Header from '../../components/Header/Header'

const NotFound = () => (
  <>
    <Header />
    <main className="mx-auto flex min-h-[65vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-[#245747]">Erro 404</p>
      <h1 className="mt-3 text-3xl font-bold text-[#11271F] sm:text-4xl">Página não encontrada</h1>
      <p className="mt-4 max-w-md text-gray-600">O endereço pode ter mudado ou não estar disponível. Você pode voltar ao início ou procurar pontos de coleta.</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link to="/" className="rounded-lg bg-[#153D2C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#245747]">Voltar ao início</Link>
        <Link to="/pontos-de-coleta" className="rounded-lg border border-[#153D2C] px-5 py-3 text-sm font-semibold text-[#153D2C] hover:bg-emerald-50">Ver pontos de coleta</Link>
      </div>
    </main>
  </>
)

export default NotFound
