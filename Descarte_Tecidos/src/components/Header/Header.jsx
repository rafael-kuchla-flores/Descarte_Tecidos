import React, { useState } from 'react'
import Button from '../btns/Button'
import { NavLink } from 'react-router-dom'
import { RiRecycleFill, RiMenuLine, RiCloseLine } from 'react-icons/ri'
const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false)

    const linkClass = ({ isActive }) =>
        `relative pb-1 transition-colors
    after:absolute after:bottom-0 after:left-0
    after:h-[2px] after:bg-green-800
    after:transition-all after:duration-300
    ${isActive
            ? 'text-green-800 after:w-full'
            : 'after:w-0 hover:text-green-800 hover:after:w-full'
        }`

    return (
        <>
            <header className="w-full bg-gray-100 px-4 py-3 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 md:flex-row md:justify-between">
                    <div className="logo flex items-center gap-2">
                        <RiRecycleFill className="h-10 w-10 text-green-800 sm:h-12 sm:w-12" />
                        <h1 className="text-xl font-bold text-green-800  ">Tecidos <span className="text-green-800 block">Conscientes</span></h1>
                    </div>

                    <div className="hidden md:block">
                        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-semibold text-gray-700 sm:gap-x-5 sm:text-base lg:gap-x-6">
                            <li>
                                <NavLink to="/" className={({ isActive }) => `relative pb-1 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-green-800 after:transition-all after:duration-300 ${isActive ? 'text-green-800 after:w-full' : 'after:w-0 hover:text-green-800 hover:after:w-full'}`}>
                                    Início
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/como-funciona" className={({ isActive }) => `relative pb-1 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-green-800 after:transition-all after:duration-300 ${isActive ? 'text-green-800 after:w-full' : 'after:w-0 hover:text-green-800 hover:after:w-full'}`}>
                                    Como funciona
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/pontos-de-coleta" className={({ isActive }) => `relative pb-1 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-green-800 after:transition-all after:duration-300 ${isActive ? 'text-green-800 after:w-full' : 'after:w-0 hover:text-green-800 hover:after:w-full'}`}>
                                    Pontos de Coleta
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/campanhas" className={({ isActive }) => `relative pb-1 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-green-800 after:transition-all after:duration-300 ${isActive ? 'text-green-800 after:w-full' : 'after:w-0 hover:text-green-800 hover:after:w-full'}`}>
                                    Campanhas
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/conteudos" className={({ isActive }) => `relative pb-1 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-green-800 after:transition-all after:duration-300 ${isActive ? 'text-green-800 after:w-full' : 'after:w-0 hover:text-green-800 hover:after:w-full'}`}>
                                    Conteúdos
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    <div className="hidden md:flex">
                        <Button className="font-bold" props="Entrar" />
                        <Button className="bg-green-800 text-white font-bold" props="Cadastrar" />
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

                            <li>
                                <NavLink
                                    to="/"
                                    end
                                    className={linkClass}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Início
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/como-funciona"
                                    className={linkClass}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Como funciona
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/pontos-de-coleta"
                                    className={linkClass}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Pontos de Coleta
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/campanhas"
                                    className={linkClass}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Campanhas
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/conteudos"
                                    className={linkClass}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Conteúdos
                                </NavLink>
                            </li>

                        </ul>


                        {/* BOTÕES */}
                        <div className="mt-5 flex gap-2">

                            <Button
                                className="flex-1 font-bold"
                                props="Entrar"
                            />

                            <Button
                                className="flex-1 bg-green-800 font-bold text-white"
                                props="Cadastrar"
                            />

                        </div>

                    </nav>
                )}

            </header>
        </>
    )
}

export default Header