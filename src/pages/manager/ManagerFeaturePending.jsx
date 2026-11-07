import { useEffect, useState } from 'react'
import collectionPointService from '../../services/collectionPointService'
import userService from '../../services/userService'
import { useAuth } from '../../hooks/useAuth'

const ManagerFeaturePending = ({ title, feature }) => {
  const { user } = useAuth()
  const userId = user?.id
  const sessionPointId = user?.pointId
  const [point, setPoint] = useState(null)
  const [pointId, setPointId] = useState(user?.pointId ?? null)
  const [isLoadingPoint, setIsLoadingPoint] = useState(false)
  const [pointError, setPointError] = useState('')

  useEffect(() => {
    if (feature !== 'point') return undefined

    let active = true
    const loadLinkedPoint = async () => {
      setIsLoadingPoint(true)
      setPointError('')

      try {
        let linkedPointId = sessionPointId
        if (!linkedPointId) {
          const currentUser = await userService.getProfile()
          if (!active) return
          linkedPointId = currentUser?.pointId
        }

        if (!linkedPointId) {
          setPointError('Sua conta não possui um ponto de coleta vinculado. Peça ao administrador para conferir o vínculo.')
          return
        }

        setPointId(linkedPointId)
        const linkedPoint = await collectionPointService.getPointById(linkedPointId)
        if (!active) return
        if (!linkedPoint) {
          setPointError(`O ponto vinculado (ID ${linkedPointId}) não foi encontrado.`)
          return
        }
        setPoint(linkedPoint)
      } catch (error) {
        if (active) {
          setPointError(error.message || 'Não foi possível carregar o ponto vinculado à sua conta.')
        }
      } finally {
        if (active) setIsLoadingPoint(false)
      }
    }

    loadLinkedPoint()
    return () => { active = false }
  }, [feature, userId, sessionPointId])

  return (
    <section className="w-full max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {feature === 'point' && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-700">Ponto vinculado à sua conta</h2>
          {isLoadingPoint && <p className="mt-2 text-sm text-gray-500">Carregando ponto vinculado...</p>}
          {pointError && <p role="alert" className="mt-2 text-sm text-amber-700">{pointError}</p>}
          {point && (
            <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-gray-500">Nome</dt><dd className="font-medium text-gray-900">{point.name}</dd></div>
              <div><dt className="text-gray-500">ID do ponto</dt><dd className="font-medium text-gray-900">{pointId}</dd></div>
              <div><dt className="text-gray-500">Endereço</dt><dd className="font-medium text-gray-900">{point.address}</dd></div>
              <div><dt className="text-gray-500">Cidade</dt><dd className="font-medium text-gray-900">{point.city}</dd></div>
              <div><dt className="text-gray-500">Status</dt><dd className="font-medium text-gray-900">{point.status}</dd></div>
              <div><dt className="text-gray-500">Horários</dt><dd className="font-medium text-gray-900">{point.hours}</dd></div>
              <div className="sm:col-span-2"><dt className="text-gray-500">Tecidos aceitos</dt><dd className="font-medium text-gray-900">{point.acceptedClothTypes?.join(', ') || 'Não informado'}</dd></div>
            </dl>
          )}
        </div>
      )}
      <p role="status" className="mt-5 text-sm text-gray-500">
        {feature === 'point'
          ? 'A visualização é somente leitura. A edição ficará disponível quando o Back-end fornecer os endpoints correspondentes.'
          : 'Esta funcionalidade ficará disponível quando o Back-end fornecer e confirmar os endpoints correspondentes. Nenhuma chamada foi enviada.'}
      </p>
    </section>
  )
}

export default ManagerFeaturePending