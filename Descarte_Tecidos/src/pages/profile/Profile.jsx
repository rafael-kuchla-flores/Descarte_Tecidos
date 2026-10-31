import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiArrowLeftLine } from 'react-icons/ri'
import { useAuth } from '../../hooks/useAuth'
import userService from '../../services/userService'

const Profile = () => {
  const { user, syncUserProfile } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })
  const [avatarUrl, setAvatarUrl] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [removeAvatar, setRemoveAvatar] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    let active = true
    let loadedAvatarUrl = ''

    const loadProfile = async () => {
      try {
        const profile = await userService.getProfile()
        if (!active) return
        setFormData({
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
        })
        try {
          const avatar = await userService.getAvatar()
          if (!active) return
          loadedAvatarUrl = URL.createObjectURL(avatar)
          setAvatarUrl(loadedAvatarUrl)
        } catch (avatarError) {
          if (avatarError.status === 404 && active) {
            setAvatarUrl('')
          } else if (active) {
            setError(avatarError.message || 'Não foi possível carregar o avatar.')
          }
        }
      } catch (requestError) {
        if (active) setError(requestError.message || 'Não foi possível carregar seu perfil.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadProfile()
    return () => {
      active = false
      if (loadedAvatarUrl) URL.revokeObjectURL(loadedAvatarUrl)
    }
  }, [user?.id, user?.avatarRevision])

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0] || null
    setAvatarFile(file)
    setPreviewUrl(file ? URL.createObjectURL(file) : '')
    setRemoveAvatar(false)
    setError('')
    setFeedback('')
  }

  const handleRemoveAvatar = () => {
    setAvatarFile(null)
    setPreviewUrl('')
    setRemoveAvatar(true)
    setError('')
    setFeedback('A foto será removida ao salvar o perfil.')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setFeedback('')

    try {
      let avatarResponse = null
      if (avatarFile && !removeAvatar) {
        avatarResponse = await userService.updateAvatar(avatarFile)
      }

      const profileResponse = await userService.updateProfile(formData, removeAvatar)
      const getResponseUser = (response) => {
        if (!response || typeof response !== 'object') return null
        if (response.user && typeof response.user === 'object') return response.user
        const userFields = ['id', 'name', 'email', 'phone', 'role', 'roles', 'pointId']
        return userFields.some((field) => field in response) ? response : null
      }
      const avatarUser = getResponseUser(avatarResponse)
      const profileUser = getResponseUser(profileResponse)
      const updatedUser = profileUser
        ? { ...avatarUser, ...formData, ...profileUser }
        : await userService.getProfile()
      const latestToken = profileResponse?.token || avatarResponse?.token

      syncUserProfile(updatedUser, latestToken)
      setAvatarFile(null)
      setPreviewUrl('')
      setRemoveAvatar(false)
      setAvatarUrl('')
      setFeedback('Perfil atualizado com sucesso.')
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível atualizar o perfil.')
    } finally {
      setSaving(false)
    }
  }

  const handleBack = () => {
    const historyIndex = window.history.state?.idx
    if (typeof historyIndex === 'number' && historyIndex > 0) {
      navigate(-1)
      return
    }

    const role = user?.role?.replace(/^ROLE_/, '').toUpperCase()
    const homeByRole = {
      ADMIN: '/admin',
      PONTO_COLETA_GERENTE: '/gerente',
      PONTO_COLETA_OPERADOR: '/operator/dashboard',
      USER: '/',
      DOADOR: '/',
    }
    navigate(homeByRole[role] || '/', { replace: true })
  }

  if (loading) return <p role="status" className="p-8 text-center text-gray-500">Carregando perfil...</p>

  const displayedAvatar = previewUrl || (removeAvatar ? '' : avatarUrl)

  return (
    <main className="mx-auto w-full max-w-3xl p-5 sm:p-8">
      <button type="button" onClick={handleBack} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2B6054] hover:underline">
        <RiArrowLeftLine aria-hidden="true" /> Voltar
      </button>
      <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
      <p className="mt-1 text-sm text-gray-500">Atualize seus dados e sua foto de perfil.</p>

      {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {feedback && <p role="status" className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{feedback}</p>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-lg border border-gray-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          {displayedAvatar ? (
            <img src={displayedAvatar} alt="Avatar do usuário" className="h-24 w-24 rounded-full border border-gray-200 object-cover" />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#2a5d48] text-3xl font-bold text-white" aria-label="Sem avatar">
              {(formData.name || user?.name || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="space-y-2">
            <label className="inline-flex cursor-pointer items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              Escolher foto
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarChange} className="sr-only" />
            </label>
            {(avatarUrl || avatarFile) && !removeAvatar && (
              <button type="button" onClick={handleRemoveAvatar} className="ml-3 text-sm font-semibold text-red-700 hover:underline">Remover foto</button>
            )}
            <p className="text-xs text-gray-500">Formatos aceitos: JPEG, PNG ou WebP.</p>
          </div>
        </div>

        <label className="block text-sm font-semibold text-gray-700">Nome
          <input required minLength="3" maxLength="120" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2.5 font-normal" />
        </label>
        <label className="block text-sm font-semibold text-gray-700">E-mail
          <input required type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2.5 font-normal" />
        </label>
        <label className="block text-sm font-semibold text-gray-700">Telefone
          <input value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2.5 font-normal" />
        </label>
        <div className="flex justify-end border-t border-gray-100 pt-4">
          <button type="submit" disabled={saving} className="rounded-md bg-[#123C2C] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
            {saving ? 'Salvando...' : 'Salvar perfil'}
          </button>
        </div>
      </form>
    </main>
  )
}

export default Profile