import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaLongArrowAltRight } from 'react-icons/fa'
import defaultCard from '../../assets/images/image.png'

const ContentCard = ({
  id,
  image = defaultCard,
  category,
  title,
  description,
  linkTo
}) => {
  return (
    <article className="border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden bg-white">
      
      
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
      />

      
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
            className="flex items-center gap-2 text-[#2B6054] font-medium text-sm hover:underline"
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