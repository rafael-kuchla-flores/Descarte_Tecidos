import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FaLongArrowAltRight } from 'react-icons/fa'
import defaultCard from '../../assets/images/image.png'
import { getPostImage } from '../../services/contentService'

export const PostCoverImage = ({ postId, alt, className }) => {
  const [imageUrl, setImageUrl] = useState(defaultCard)

  useEffect(() => {
    let active = true
    let objectUrl = ''

    getPostImage(postId)
      .then((blob) => {
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
  linkTo
}) => {
  return (
    <article className="border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden bg-white">
      
      
      <PostCoverImage postId={id} alt={title} className="w-full h-48 object-cover" />

      
      <div className="p-5 flex flex-col flex-grow">
        

        <div className="mb-4">
          <span className="text-[#2B6054] text-xs font-semibold px-3 py-1 rounded-full bg-[#E5F1EE]">
            {category}
          </span>
        </div>


        <div>
          <h2 className="text-lg font-bold text-[#1A2E28] mb-2 leading-tight">
            {title}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {description}
          </p>
        </div>

  
        <div className="mt-auto">
          <NavLink
            to={linkTo || `/conteudos/${id}`}
            className="flex items-center gap-2 rounded text-[#2B6054] font-medium text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B6054] focus-visible:ring-offset-2"
          >
            Ler mais
            <FaLongArrowAltRight className="text-xs" />
          </NavLink>
        </div>
        
      </div>
    </article>
  )
}

export default ContentCard