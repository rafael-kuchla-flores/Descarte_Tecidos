import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import userService from '../../services/userService'

const UserAvatar = ({ className = '', imageClassName = '' }) => {
  const { user } = useAuth()
  const [imageUrl, setImageUrl] = useState('')
  const initial = (user?.name || user?.nome || 'U').charAt(0).toUpperCase()

  useEffect(() => {
    let active = true
    let objectUrl = ''

    userService.getAvatar()
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob)
        if (active) setImageUrl(objectUrl)
        else URL.revokeObjectURL(objectUrl)
      })
      .catch((avatarError) => {
        if (!active) return
        setImageUrl('')
        if (avatarError.status !== 404) {
          console.error('Não foi possível carregar o avatar do usuário.', avatarError)
        }
      })

    return () => {
      active = false
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [user?.id, user?.avatarRevision])

  return imageUrl ? (
    <img src={imageUrl} alt={`Avatar de ${user?.name || user?.nome || 'usuário'}`} className={`h-full w-full object-cover ${imageClassName}`} />
  ) : (
    <span className={className}>{initial}</span>
  )
}

export default UserAvatar


