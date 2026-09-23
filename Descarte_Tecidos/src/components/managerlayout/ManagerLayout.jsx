import React, { useState } from 'react'
import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth' 
import { 
  RiRecycleFill, 
  RiLayoutGridLine, 
  RiMapPinLine, 
  RiTimeLine, 
  RiShirtLine, 
  RiUser3Line, 
  RiBox3Line, 
  RiBarChartBoxLine,
  RiLogoutBoxLine,
  RiArrowDownSLine,
  RiMenuLine,
  RiCloseLine
} from 'react-icons/ri'

const ManagerLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    if (logout) logout()
    navigate('/')
  }

  
  const avatarLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'G'

  const menuItems = [
    { name: 'Dashboard', icon: RiLayoutGridLine, path: '/manager/dashboard' },
    { name: 'Ponto de Coleta', icon: RiMapPinLine, path: '/manager/collection-point' },
    { name: 'Horários', icon: RiTimeLine, path: '/manager/horarios' },
    { name: 'Tipos de Tecidos', icon: RiShirtLine, path: '/manager/tipos-tecidos' },
    { name: 'Operadores', icon: RiUser3Line, path: '/manager/operadores' },
    { name: 'Recebimentos', icon: RiBox3Line, path: '/manager/recebimentos' },
    { name: 'Relatórios', icon: RiBarChartBoxLine, path: '/manager/relatorios' },
  ]

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
      isActive
        ? 'bg-[#20523e] font-medium text-white shadow-sm'
        : 'font-medium text-emerald-100/70 hover:bg-[#153b2d] hover:text-white'
    }`

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] font-sans overflow-hidden">
      
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-[#0d2a1f] text-white transition-transform duration-300 ease-in-out md:static md:translate-x-0 flex-shrink-0 border-r border-[#133a2c] ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full border border-emerald-400/30 bg-[#153b2d] flex items-center justify-center text-emerald-400 text-lg">
              <RiRecycleFill />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">Ecotecido</span>
          </div>
          <button 
            className="md:hidden text-2xl text-gray-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <RiCloseLine />
          </button>
        </div>
        
        
        <div className="px-6 pb-5 mb-4 border-b border-emerald-900/40">
          <h2 className="font-bold text-sm text-white">{user?.name || 'Gerente'}</h2>
          <p className="text-xs text-emerald-200/60 mt-0.5">Gerente do Ponto de Coleta</p>
        </div>
        
        <nav className="flex flex-col gap-1.5 px-4 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={navLinkClass}
              >
                <Icon className="text-lg" />
                <span>{item.name}</span>
              </NavLink>
            )
          })}
        </nav>
        
        <div className="px-4 pb-6 pt-4 mt-auto">
          <button 
            onClick={handleLogout} 
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-emerald-100/70 hover:bg-[#153b2d] hover:text-white transition-colors"
          >
            <RiLogoutBoxLine className="text-lg" /> Sair
          </button>
        </div>
      </aside>
      
      <main className="flex-1 flex flex-col overflow-y-auto w-full h-full">
        
        <header className="flex items-center justify-between px-6 sm:px-8 py-5">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden text-2xl text-gray-800 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <RiMenuLine />
            </button>
          </div>
          
          <div className="flex items-center gap-3.5 cursor-pointer ml-auto">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0d2a1f] text-sm font-bold text-white shadow-sm overflow-hidden">
              {avatarLetter}
            </div>
            
            <span className="hidden sm:flex text-sm font-semibold text-gray-700 items-center">
              Olá, {user?.name || 'Gerente'} <RiArrowDownSLine className="ml-1 text-gray-500" />
            </span>
          </div>
        </header>
        
        <div className="px-6 sm:px-8 pb-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default ManagerLayout