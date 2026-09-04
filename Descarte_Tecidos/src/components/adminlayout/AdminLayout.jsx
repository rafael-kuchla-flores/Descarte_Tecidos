import React, { useState } from 'react'
import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth' 
import { 
  RiRecycleFill, 
  RiHome4Line, 
  RiUser3Line, 
  RiMapPinLine, 
  RiMegaphoneLine, 
  RiFileTextLine, 
  RiSettings4Line, 
  RiLogoutBoxLine,
  RiArrowDownSLine,
  RiMenuLine,
  RiCloseLine
} from 'react-icons/ri'

const AdminLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    if (logout) logout()
    navigate('/')
  }

  const avatarLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'A'

   const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
      isActive
        ? 'bg-[#2a5d48] font-semibold text-white'
        : 'font-medium text-gray-300 hover:bg-[#1f4f3a]'
    }`

  return (
    <div className="flex h-screen w-full bg-[#F3F4F6] font-sans overflow-hidden">
      
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-[#123C2C] text-white transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-8">
          <div className="flex items-center gap-3">
            <RiRecycleFill className="h-8 w-8 text-white" />
            <h1 className="text-[17px] font-bold leading-tight">
              Tecidos <span className="block font-normal">Conscientes</span>
            </h1>
          </div>
          <button 
            className="md:hidden text-2xl text-gray-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <RiCloseLine />
          </button>
        </div>

        <nav className="flex flex-col gap-2 px-4 flex-1 mt-4 overflow-y-auto">

          <NavLink to="/admin" end onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>
            <RiHome4Line className="text-lg" /> Dashboard
          </NavLink>
          <NavLink to="/admin/users" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>
            <RiUser3Line className="text-lg" /> Usuários
          </NavLink>
          <NavLink to="/admin/collect-points" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>
            <RiMapPinLine className="text-lg" /> Pontos de coleta
          </NavLink>
          <NavLink to="/admin/campaigns" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>
            <RiMegaphoneLine className="text-lg" /> Campanhas
          </NavLink>
          <NavLink to="/admin/content" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>
            <RiFileTextLine className="text-lg" /> Conteúdos
          </NavLink>
          <NavLink to="/admin/settings" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>
            <RiSettings4Line className="text-lg" /> Configurações
          </NavLink>
        </nav>

        <div className="px-4 pb-6 pt-4 mt-auto">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-300 hover:bg-[#1f4f3a] transition-colors">
            <RiLogoutBoxLine className="text-lg" /> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto w-full h-full">
        
        <header className="flex items-center justify-between px-4 sm:px-8 py-6">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden text-2xl text-gray-800 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <RiMenuLine />
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">Painel Admin</h2>
          </div>
          
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#123C2C] text-sm font-bold text-white shadow-sm overflow-hidden">
              {avatarLetter}
            </div>
            <span className="hidden sm:flex text-sm font-semibold text-gray-700 items-center">
              Olá, {user?.name || 'Admin'} <RiArrowDownSLine className="ml-1 text-gray-500" />
            </span>
          </div>
        </header>

        <div className="px-4 sm:px-8 pb-8">
          <Outlet />
        </div>

      </main>
    </div>
  )
}

export default AdminLayout