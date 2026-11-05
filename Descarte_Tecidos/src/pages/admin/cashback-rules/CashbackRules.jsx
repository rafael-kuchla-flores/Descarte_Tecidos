import { useEffect, useState } from 'react'
import cashbackService from '../../../services/cashbackService'

const CashbackRules = () => {
  const [pointsPerKg, setPointsPerKg] = useState('')
  const [updatedAt, setUpdatedAt] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    let active = true
    cashbackService.getCurrentRule()
      .then((rule) => {
        if (!active) return
        setPointsPerKg(String(rule.pointsPerKg))
        setUpdatedAt(rule.updatedAt)
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || 'Não foi possível carregar a regra de cashback.')
      })
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setFeedback('')
    try {
      const rule = await cashbackService.updatePointsPerKg(Number(pointsPerKg))
      setPointsPerKg(String(rule.pointsPerKg))
      setUpdatedAt(rule.updatedAt)
      setFeedback('Taxa de cashback atualizada. Ela será aplicada aos novos descartes registrados.')
    } catch (requestError) {
      setError(requestError.data?.fieldErrors?.map((item) => item.message).join(' ') || requestError.message || 'Não foi possível atualizar a regra.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="mx-auto max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Regra de cashback</h1>
        <p className="mt-1 text-sm text-gray-600">Configure quantos pontos são gerados por quilograma descartado.</p>
      </header>
      {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {feedback && <p role="status" className="mb-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">{feedback}</p>}
      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700">
          Pontos por kg
          <input required type="number" min="0.01" step="0.01" value={pointsPerKg} onChange={(event) => setPointsPerKg(event.target.value)} disabled={loading} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-normal disabled:bg-gray-50" />
        </label>
        {updatedAt && <p className="text-xs text-gray-500">Última atualização: {new Date(updatedAt).toLocaleString('pt-BR')}</p>}
        <p className="text-xs text-gray-500">A taxa é registrada no momento em que o descarte é criado e usada quando ele for confirmado.</p>
        <button type="submit" disabled={saving || loading} className="rounded-lg bg-[#123C2C] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
          {saving ? 'Salvando...' : 'Salvar taxa'}
        </button>
      </form>
    </main>
  )
}

export default CashbackRules
