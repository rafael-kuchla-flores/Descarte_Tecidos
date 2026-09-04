import React, { useState } from 'react'
import Button from '../btns/Button'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { RiRecycleFill, RiMenuLine, RiCloseLine, RiArrowDownSFill } from 'react-icons/ri'
import { useAuth } from '../../hooks/useAuth'

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const linkClass = ({ isActive }) =>
        `relative pb-1 transition-colors
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
    const avatarLetter = user?.nome ? user.nome.charAt(0).toUpperCase() : 'U';

    return (
        <>
            <header className="w-full bg-gray-100 px-4 py-3 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 md:flex-row md:justify-between">
                    <div className="logo flex items-center gap-2">
                        <RiRecycleFill className="h-10 w-10 text-green-800 sm:h-12 sm:w-12" />
                        <h1 className="text-xl font-bold text-green-800">Tecidos <span className="text-green-800 block">Conscientes</span></h1>
                    </div>

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
                        </ul>
                    </div>

                    {/* BOTÕES DESKTOP */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 cursor-pointer text-[#123C2C]">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2a5d48] font-bold text-white shadow-sm">
                                        {avatarLetter}
                                    </div>
                                    <span className="text-[15px] font-medium flex items-center gap-1">
                                        Olá, {user.nome || 'Usuário'} 
                                        <RiArrowDownSFill className="text-gray-600" />
                                    </span>
                                </div>
                                
                                <button 
                                    onClick={handleLogout} 
                                    className="text-[15px] font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    Sair
                                </button>
                            </div>
                        ) : (

                            <>
                                <Link to="/login">
                                    <Button className="font-bold">Entrar</Button>
                                </Link>
                                <Link to="/register">
                                    <Button className="bg-green-800 text-white font-bold">Cadastrar</Button>
                                </Link>
                            </>
                        )}
                    </div>
                    
                    {/* BOTÃO MENU MOBILE */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-2xl text-green-800 md:hidden"
                        aria-label="Abrir menu"
                    >
                        {menuOpen ? <RiCloseLine /> : <RiMenuLine />}
                    </button>
                </div>
                
                {/* MENU MOBILE */}
                {menuOpen && (
                    <nav className="border-t border-gray-200 bg-gray-100 px-5 pb-5 md:hidden">
                        <ul className="flex flex-col gap-4 pt-4 font-semibold text-gray-700">
                            <li><NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>Início</NavLink></li>
                            <li><NavLink to="/como-funciona" className={linkClass} onClick={() => setMenuOpen(false)}>Como funciona</NavLink></li>
                            <li><NavLink to="/pontos-de-coleta" className={linkClass} onClick={() => setMenuOpen(false)}>Pontos de Coleta</NavLink></li>
                            <li><NavLink to="/campanhas" className={linkClass} onClick={() => setMenuOpen(false)}>Campanhas</NavLink></li>
                            <li><NavLink to="/conteudos" className={linkClass} onClick={() => setMenuOpen(false)}>Conteúdos</NavLink></li>
                        </ul>

                        {/* BOTÕES MOBILE */}
                        <div className="mt-5 flex flex-col gap-3 border-t border-gray-300 pt-4">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2a5d48] font-bold text-white">
                                            {avatarLetter}
                                        </div>
                                        <span className="text-[15px] font-medium text-[#123C2C]">
                                            Olá, {user.nome || 'Usuário'}
                                        </span>
                                    </div>
                                    <Button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full bg-red-600 text-white font-bold border-none">
                                        Sair
                                    </Button>
                                </>
                            ) : (
                                <div className="flex gap-2">
                                    <Link to="/login" className="w-full" onClick={() => setMenuOpen(false)}>
                                        <Button className="w-full font-bold">Entrar</Button>
                                    </Link>
                                    <Link to="/register" className="w-full" onClick={() => setMenuOpen(false)}>
                                        <Button className="w-full bg-green-800 text-white font-bold">Cadastrar</Button>
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