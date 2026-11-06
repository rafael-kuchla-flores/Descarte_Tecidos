import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FaLongArrowAltRight } from 'react-icons/fa'
import { RiHeartFill, RiHeartLine } from 'react-icons/ri'
import defaultCard from '../../assets/images/image.png'
import { getPostImage } from '../../services/contentService'

export const PostCoverImage = ({ postId, alt, className }) => {
  const [imageUrl, setImageUrl] = useState(defaultCard)

  useEffect(() => {
    let active = true
    let objectUrl = ''

    getPostImage(postId)
      .then((blob) => {
        if (!blob) return
        objectUrl = URL.createObjectURL(blob)
        if (active) setImageUrl(objectUrl)
        else URL.revokeObjectURL(objectUrl)
      })
      .catch(() => active && setImageUrl(defaultCard))

    return () => {
      active = false
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [postId])

  return <img src={imageUrl} alt={alt} loading="lazy" className={className} />
}

const ContentCard = ({
  id,
  category,
  title,
  description,
  linkTo,
  isFavorite = false,
  favoriteDisabled = false,
  onToggleFavorite,
}) => (
  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
    <PostCoverImage postId={id} alt={title} className="h-48 w-full object-cover" />

    <div className="flex flex-grow flex-col p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="rounded-full bg-[#E5F1EE] px-3 py-1 text-xs font-semibold text-[#2B6054]">
          {category || 'Educação ambiental'}
        </span>
        {onToggleFavorite && (
          <button
            type="button"
            onClick={() => onToggleFavorite(id)}
            aria-pressed={isFavorite}
            disabled={favoriteDisabled}
            aria-label={isFavorite ? `Remover ${title} dos favoritos` : `Favoritar ${title}`}
            title={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full text-[#245747] transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#245747]"
          >
            {isFavorite ? <RiHeartFill className="text-xl" aria-hidden="true" /> : <RiHeartLine className="text-xl" aria-hidden="true" />}
          </button>
        )}
      </div>

      <h2 className="mb-2 text-lg font-bold leading-tight text-[#1A2E28]">{title}</h2>
      <p className="mb-6 text-sm text-gray-600">{description}</p>

      <NavLink
        to={linkTo || `/conteudos/${id}`}
        className="mt-auto inline-flex items-center gap-2 rounded text-sm font-semibold text-[#245747] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#245747]"
      >
        Ler mais <FaLongArrowAltRight className="text-xs" aria-hidden="true" />
      </NavLink>
    </div>
  </article>
)

export default ContentCard
