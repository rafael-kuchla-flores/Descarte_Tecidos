import React, { useState, useEffect } from 'react'
import {
  RiSearchLine,
  RiUserAddLine,
  RiPencilLine,
  RiDeleteBinLine,
  RiArrowDownSLine,
  RiCloseLine
} from 'react-icons/ri'
import userService from '../../../services/userService'

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('Todos os tipos')
  const [usersList, setUsersList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    password: '',
    role: 'DOADOR'
  })
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await userService.getUsers()
      const list = Array.isArray(data) ? data : data?.content || []
      setUsersList(list)
    } catch (err) {
      console.error(err)
      setError('Erro ao carregar a lista de usuários.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])


  const handleEditClick = (user) => {
    setFormError('')
    setEditingId(user.id)
    setFormData({
      name: user.name,
      email: user.email,
      cpf: user.document,
      phone: user.phone || '',
      password: '',
      role: user.roles && user.roles.includes('ADMIN') ? 'ADMIN' : 'DOADOR'
    })
    setIsModalOpen(true)
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    let formattedPhone = formData.phone;
    if (formattedPhone && !formattedPhone.startsWith('+')) {
      formattedPhone = `+55${formattedPhone}`;
    }

    const dataToSend = {
      name: formData.name,
      email: formData.email,
      phone: formattedPhone,
      document: formData.cpf,
      roles: [formData.role]
    };


    if (!editingId) {
      dataToSend.password = formData.password;
    }

    try {
      setSubmitting(true)

      if (editingId) {
        await userService.updateUser(editingId, dataToSend)
      } else {
        await userService.createUser(dataToSend)
      }

      setIsModalOpen(false)
      setEditingId(null)
      setFormData({ name: '', email: '', cpf: '', phone: '', password: '', role: 'DOADOR' })
      fetchUsers()
    } catch (err) {
      console.error(err)
      if (err.data && err.data.fieldErrors && Array.isArray(err.data.fieldErrors)) {
        const errorMessages = err.data.fieldErrors.map(e => `${e.field}: ${e.message}`).join(' | ')
        setFormError(`Opa! Corrija isso: ${errorMessages}`)
      } else {
        setFormError(err.data?.message || 'Erro ao salvar usuário. Verifique os campos.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja inativar este usuário?')) {
      try {

        await userService.deleteUser(id)

        fetchUsers()
      } catch (err) {
        console.error(err)
        alert('Erro ao inativar o usuário. Verifique o console.')
      }
    }
  }

  const filteredUsers = usersList.filter(user => {
    const matchesSearch = (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())


    const userRole = (user.roles || []).join(',').toUpperCase()

    if (roleFilter === 'Doador') return matchesSearch && userRole.includes('DOADOR')
    if (roleFilter === 'Administrador') return matchesSearch && userRole.includes('ADMIN')

    return matchesSearch
  })

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123C2C] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1a5640] transition-colors w-full sm:w-auto cursor-pointer"
        >
          <RiUserAddLine className="text-lg" />
          + Adicionar usuário
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-50 rounded-xl">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 border-b border-gray-100">
          <div className="relative w-full sm:w-[320px]">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
              <RiSearchLine className="text-lg" />
            </span>
            <input
              type="text"
              placeholder="Buscar usuário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:border-[#123C2C] focus:outline-none transition-colors"
            />
          </div>

          <div className="relative w-full sm:w-[200px]">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm text-gray-800 focus:border-[#123C2C] focus:outline-none transition-colors cursor-pointer"
            >
              <option value="Todos os tipos">Todos os tipos</option>
              <option value="Doador">Doador</option>
              <option value="Administrador">Administrador</option>
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <RiArrowDownSLine className="text-lg" />
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">Nome</th>
                <th className="py-4 px-6">E-mail</th>
                <th className="py-4 px-6">Tipo</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-400">Carregando usuários...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-400">Nenhum usuário encontrado.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900">{user.name}</td>
                    <td className="py-4 px-6 text-gray-500">{user.email}</td>
                    <td className="py-4 px-6 text-gray-600">
                      {user.roles && user.roles.includes('ADMIN') ? 'Administrador' : 'Doador'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${user.active !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                        {user.active !== false ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">

                        <button
                          onClick={() => handleEditClick(user)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <RiPencilLine className="text-lg" />
                        </button>
                      </div>
                    </td>


                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <RiDeleteBinLine className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 sm:px-6 border-t border-gray-100 flex items-center justify-between text-xs sm:text-sm text-gray-500">
          <span>Mostrando {filteredUsers.length} de {usersList.length} usuários</span>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-xl cursor-pointer"
            >
              <RiCloseLine />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-6">Cadastrar Novo Usuário</h2>

            {formError && (
              <div className="mb-4 p-3 text-xs text-red-700 bg-red-50 rounded-lg">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Maria Santos"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:border-[#123C2C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">E-mail *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Ex: maria@email.com"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:border-[#123C2C] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">CPF / CNPJ *</label>
                  <input
                    type="text"
                    required
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:border-[#123C2C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Telefone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(00) 00000-0000"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:border-[#123C2C] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Senha Inicial *</label>
                  <input
                    type="password"
                    required={!editingId}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Mínimo de caracteres"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:border-[#123C2C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Papel (Role) *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-[#123C2C] focus:outline-none cursor-pointer"
                  >
                    <option value="DOADOR">Doador (DOADOR)</option>
                    <option value="ADMIN">Administrador (ADMIN)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#123C2C] text-sm font-semibold text-white hover:bg-[#1a5640] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Salvando...' : 'Salvar Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users