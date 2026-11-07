import { getCampaignStatus, formatCampaignDate } from '../../utils/campaignPresentation'
import { NavLink } from 'react-router-dom'
import { FaLongArrowAltRight } from 'react-icons/fa'
import defaultCard from '../../assets/images/hero-fabrics.jpg'

const CampaignCard = ({
  id,
  image = defaultCard,
  startDate,
  endDate,
  title,
  description,
}) => {
  const displayStatus = getCampaignStatus({ startDate, endDate })
  return (
    <article className="border border-gray-300 rounded-lg shadow-md p-4 flex flex-col">

      <p className="mb-2 text-xs font-semibold text-amber-800">Campanha demonstrativa — informações ilustrativas</p>
      {/* Imagem */}
      <div className="overflow-hidden rounded-lg">
        <img
          src={image || defaultCard}
          onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = defaultCard }}
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
            {formatCampaignDate(startDate)}
          </time>

          <span className="text-gray-700 text-xs">
            a
          </span>

          <time
            className="text-gray-700 text-xs"
            dateTime={endDate}
          >
            {formatCampaignDate(endDate)}
          </time>
        </div>

        <span className="text-green-900 px-2 py-1 rounded-full bg-green-100">
          {displayStatus}
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