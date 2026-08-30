import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaLongArrowAltRight } from 'react-icons/fa'
import defaultCard from '../../assets/images/image.png'

const CampaignCard = ({
  id,
  image = defaultCard,
  startDate,
  endDate,
  status,
  title,
  description,
}) => {
  return (
    <article className="border border-gray-300 rounded-lg shadow-md p-4 flex flex-col">

      {/* Imagem */}
      <div className="overflow-hidden rounded-lg">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
        />
      </div>

      {/* Data e status */}
      <div className="flex justify-between items-center mb-2 py-2">

        <div className="flex gap-1">
          <time
            className="text-gray-700 text-xs"
            dateTime={startDate}
          >
            {startDate}
          </time>

          <span className="text-gray-700 text-xs">
            a
          </span>

          <time
            className="text-gray-700 text-xs"
            dateTime={endDate}
          >
            {endDate}
          </time>
        </div>

        <span className="text-green-900 px-2 py-1 rounded-full bg-green-100">
          {status}
        </span>

      </div>

      {/* Descrição */}
      <div>
        <h2 className="text-2xl font-bold text-green-900 mb-2">
          {title}
        </h2>

        <p className="text-lg text-gray-700 mb-8">
          {description}
        </p>
      </div>

      {/* Link */}
      <div className="mt-auto">

        <NavLink
          to={`/campanhas/${id}`}
          className="flex items-center gap-2"
        >
          Saiba mais
          <FaLongArrowAltRight />
        </NavLink>

      </div>

    </article>
  )
}

export default CampaignCard