import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import cashbackService from '../../services/cashbackService'

const formatDate = (value) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Data indisponível' : date.toLocaleString('pt-BR')
}

const DisposalReview = () => {
  const { user } = useAuth()
  const pointId = user?.pointId
  const [disposals, setDisposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [reasons, setReasons] = useState({})
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  const loadPending = useCallback(async () => {
    if (!pointId) {
      setError('Não foi possível identificar o ponto de coleta deste usuário.')
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    try {
      const response = await cashbackService.getPendingDisposals(pointId, { page: 0, size: 100 })
      setDisposals(response.content || [])
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível carregar os descartes pendentes.')
    } finally {
      setLoading(false)
    }
  }, [pointId])

  useEffect(() => {
    Promise.resolve().then(loadPending)
  }, [loadPending])

  const handleConfirm = async (id) => {
    setBusyId(id)
    setError('')
    setFeedback('')
    try {
      const disposal = await cashbackService.confirmDisposal(id)
      setFeedback(`Descarte confirmado. ${disposal.earnedPoints} pontos foram creditados ao doador.`)
      await loadPending()
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível confirmar o descarte.')
    } finally {
      setBusyId(null)
    }
  }

  const handleReject = async (id) => {
    const justification = String(reasons[id] || '').trim()
    if (!justification) {
      setError('Informe a justificativa antes de rejeitar o descarte.')
      return
    }
    setBusyId(id)
    setError('')
    setFeedback('')
    try {
      await cashbackService.rejectDisposal(id, justification)
      setFeedback('Descarte rejeitado.')
      await loadPending()
    } catch (requestError) {
      setError(requestError.data?.fieldErrors?.map((item) => item.message).join(' ') || requestError.message || 'Não foi possível rejeitar o descarte.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <main className="mx-auto max-w-5xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Descartes pendentes</h1>
        <p className="mt-1 text-sm text-gray-600">Confirme os descartes recebidos para creditar cashback ou rejeite-os com uma justificativa.</p>
      </header>
      {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {feedback && <p role="status" className="mb-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">{feedback}</p>}
      {loading ? <p role="status" className="py-10 text-center text-gray-500">Carregando descartes...</p>
        : disposals.length === 0 ? <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">Não há descartes aguardando confirmação.</p>
          : <div className="space-y-4">
            {disposals.map((item) => (
              <article key={item.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col justify-between gap-3 sm:flex-row">
                  <div>
                    <h2 className="font-bold text-gray-900">{item.userName}</h2>
                    <p className="mt-1 text-sm text-gray-500">{item.collectionPointName} · {formatDate(item.createdAt)}</p>
                  </div>
                  <span className="h-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">Pendente</span>
                </div>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <div><dt className="text-gray-500">Peso informado</dt><dd className="font-semibold">{item.approximateWeightInKg} kg</dd></div>
                  <div><dt className="text-gray-500">Tecidos</dt><dd className="font-semibold">{(item.clothTypes || []).join(', ') || 'Não informado'}</dd></div>
                  <div><dt className="text-gray-500">Cashback após confirmação</dt><dd className="font-semibold text-emerald-700">{item.approximateWeightInKg * item.pointsPerKg} pontos</dd></div>
                </dl>
                <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row">
                  <input aria-label={`Justificativa para rejeitar descarte ${item.id}`} value={reasons[item.id] || ''} onChange={(event) => setReasons((current) => ({ ...current, [item.id]: event.target.value }))} placeholder="Justificativa necessária para rejeição" className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                  <div className="flex gap-2">
                    <button type="button" disabled={busyId === item.id} onClick={() => handleConfirm(item.id)} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{busyId === item.id ? 'Aguarde...' : 'Confirmar'}</button>
                    <button type="button" disabled={busyId === item.id} onClick={() => handleReject(item.id)} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-50">Rejeitar</button>
                  </div>
                </div>
              </article>
            ))}
          </div>}
    </main>
  )
}

export default DisposalReview
