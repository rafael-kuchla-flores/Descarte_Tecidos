import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { RiRecycleFill, RiMenuLine, RiCloseLine, RiArrowDownSFill } from 'react-icons/ri'
import { useAuth } from '../../hooks/useAuth'
import UserAvatar from '../useravatar/UserAvatar'

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const linkClass = ({ isActive }) =>
        `relative rounded pb-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-800 focus-visible:ring-offset-2
    after:absolute after:bottom-0 after:left-0
    after:h-[2px] after:bg-green-800
    after:transition-all after:duration-300
    ${isActive
            ? 'text-green-800 after:w-full'
            : 'after:w-0 hover:text-green-800 hover:after:w-full'
        }`

    const handleLogout = () => {
        if (logout) logout()
        navigate('/')
    }
    return (
        <>
            <header className="w-full bg-gray-100 px-4 py-3 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 md:flex-row md:justify-between">
                    <Link to="/" aria-label="Ecotecido, página inicial" className="logo flex items-center gap-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-800 focus-visible:ring-offset-2">
                        <RiRecycleFill className="h-10 w-10 text-green-800 sm:h-12 sm:w-12" />
                        <span className="text-xl font-bold text-green-800">ECOTECIDO</span>
                    </Link>

                    <div className="hidden md:block">
                        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-semibold text-gray-700 sm:gap-x-5 sm:text-base lg:gap-x-6">
                            <li>
                                <NavLink to="/" className={linkClass}>Início</NavLink>
                            </li>
                            <li>
                                <NavLink to="/como-funciona" className={linkClass}>Como funciona</NavLink>
                            </li>
                            <li>
                                <NavLink to="/pontos-de-coleta" className={linkClass}>Pontos de Coleta</NavLink>
                            </li>
                            <li>
                                <NavLink to="/campanhas" className={linkClass}>Campanhas</NavLink>
                            </li>
                            <li>
                                <NavLink to="/conteudos" className={linkClass}>Conteúdos</NavLink>
                            </li>
                            <li className="hidden xl:list-item"><Link to="/conteudos?favoritos=1" className="rounded text-green-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2">Favoritos</Link></li>
                            {user && <li><NavLink to="/carteira" className={linkClass}>Carteira</NavLink></li>}
                        </ul>
                    </div>

                    {/* BOTÕES DESKTOP */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/perfil" aria-label="Abrir meu perfil" className="flex items-center gap-2 text-[#123C2C]">
                                    <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#2a5d48] font-bold text-white shadow-sm">
                                        <UserAvatar />
                                    </span>
                                    <span className="text-[15px] font-medium flex items-center gap-1">
                                        Olá, {user.name || user.nome || 'Usuário'}

                                        <RiArrowDownSFill className="text-gray-600" />
                                    </span>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="text-[15px] font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    Sair
                                </button>
                            </div>
                        ) : (

                            <>
                                <Link to="/login" className="rounded-full border border-green-800 px-5 py-2 text-sm font-bold text-green-800 hover:bg-emerald-50">Entrar</Link>
                                <Link to="/register" className="rounded-full bg-green-800 px-5 py-2 text-sm font-bold text-white hover:bg-green-900">Cadastrar</Link>
                            </>
                        )}
                    </div>

                    {/* BOTÃO MENU MOBILE */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="rounded text-2xl text-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-800 focus-visible:ring-offset-2 md:hidden"
                        aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-navigation"
                    >
                        {menuOpen ? <RiCloseLine /> : <RiMenuLine />}
                    </button>
                </div>

                {/* MENU MOBILE */}
                {menuOpen && (
                    <nav id="mobile-navigation" className="border-t border-gray-200 bg-gray-100 px-5 pb-5 md:hidden" aria-label="Navegação móvel">
                        <ul className="flex flex-col gap-4 pt-4 font-semibold text-gray-700">
                            <li><NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>Início</NavLink></li>
                            <li><NavLink to="/como-funciona" className={linkClass} onClick={() => setMenuOpen(false)}>Como funciona</NavLink></li>
                            <li><NavLink to="/pontos-de-coleta" className={linkClass} onClick={() => setMenuOpen(false)}>Pontos de Coleta</NavLink></li>
                            <li><NavLink to="/campanhas" className={linkClass} onClick={() => setMenuOpen(false)}>Campanhas</NavLink></li>
                            <li><NavLink to="/conteudos" className={linkClass} onClick={() => setMenuOpen(false)}>Conteúdos</NavLink></li>
                            <li><Link to="/conteudos?favoritos=1" className={linkClass({ isActive: false })} onClick={() => setMenuOpen(false)}>Meus favoritos</Link></li>
                            {user && <li><NavLink to="/carteira" className={linkClass} onClick={() => setMenuOpen(false)}>Cashback e carteira</NavLink></li>}
                        </ul>

                        {/* BOTÕES MOBILE */}
                        <div className="mt-5 flex flex-col gap-3 border-t border-gray-300 pt-4">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Link to="/perfil" aria-label="Abrir meu perfil" className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#2a5d48] font-bold text-white">
                                            <UserAvatar />
                                        </Link>
                                        <Link to="/perfil" className="text-[15px] font-medium text-[#123C2C]">
                                            Olá, {user.name || user.nome || 'Usuário'}
                                        </Link>
                                    </div>
                                    <button type="button" onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full rounded-full bg-red-600 px-5 py-2 font-bold text-white hover:bg-red-700">Sair</button>
                                </>
                            ) : (
                                <div className="flex gap-2">
                                    <Link to="/login" className="w-full" onClick={() => setMenuOpen(false)}>
                                        <span className="block rounded-full border border-green-800 px-4 py-2 text-center font-bold text-green-800">Entrar</span>
                                    </Link>
                                    <Link to="/register" className="w-full" onClick={() => setMenuOpen(false)}>
                                        <span className="block rounded-full bg-green-800 px-4 py-2 text-center font-bold text-white">Cadastrar</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>
                )}
            </header>
        </>
    )
}

export default Header