
import { useEffect, useState } from 'react'
import cashbackService from '../../../services/cashbackService'

const formatPoints = (value) => {
  const number = Number(value)

  if (!Number.isFinite(number)) return 'Não disponível'

  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 2,
  }).format(number)
}

const formatDate = (value) => {
  if (!value) return 'Não informada'

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? 'Não informada'
    : date.toLocaleString('pt-BR')
}

const CashbackRules = () => {
  const [pointsPerKg, setPointsPerKg] = useState('')
  const [currentPointsPerKg, setCurrentPointsPerKg] = useState(null)
  const [updatedAt, setUpdatedAt] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    let active = true

    const loadCurrentRule = async () => {
      setLoading(true)
      setError('')

      try {
        const rule = await cashbackService.getCurrentRule()

        if (!active) return

        const currentValue = Number(rule.pointsPerKg)

        if (
          !Number.isFinite(currentValue) ||
          currentValue <= 0
        ) {
          throw new Error(
            'A regra de cashback retornou uma taxa inválida.'
          )
        }

        setPointsPerKg(String(currentValue))
        setCurrentPointsPerKg(currentValue)
        setUpdatedAt(rule.updatedAt || '')
      } catch (requestError) {
        if (!active) return

        setError(
          requestError.message ||
            'Não foi possível carregar a regra de cashback.'
        )
      } finally {
        if (active) setLoading(false)
      }
    }

    loadCurrentRule()

    return () => {
      active = false
    }
  }, [])

  const parsedPointsPerKg = Number(pointsPerKg)

  const isValidRate =
    pointsPerKg.trim() !== '' &&
    Number.isFinite(parsedPointsPerKg) &&
    parsedPointsPerKg > 0

  const hasChanges =
    currentPointsPerKg !== null &&
    isValidRate &&
    parsedPointsPerKg !== currentPointsPerKg

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (saving || loading) return

    setError('')
    setFeedback('')

    if (!isValidRate) {
      setError('Informe uma taxa válida maior que zero.')
      return
    }

    if (!hasChanges) {
      setFeedback('Nenhuma alteração foi realizada na taxa.')
      return
    }

    setSaving(true)

    try {
      const rule = await cashbackService.updatePointsPerKg(
        parsedPointsPerKg
      )

      const savedValue = Number(rule.pointsPerKg)

      if (
        !Number.isFinite(savedValue) ||
        savedValue <= 0
      ) {
        throw new Error(
          'A API não retornou uma taxa de cashback válida.'
        )
      }

      setPointsPerKg(String(savedValue))
      setCurrentPointsPerKg(savedValue)
      setUpdatedAt(rule.updatedAt || '')

      setFeedback(
        'Taxa de cashback atualizada com sucesso. ' +
          'Ela será aplicada aos novos descartes registrados.'
      )
    } catch (requestError) {
      const fieldErrors = requestError.data?.fieldErrors
        ?.map((item) => item.message)
        .filter(Boolean)
        .join(' ')

      setError(
        fieldErrors ||
          requestError.message ||
          'Não foi possível atualizar a regra de cashback.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">
          Regra de cashback
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          Configure quantos pontos são gerados por
          quilograma de tecido descartado.
        </p>
      </header>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {feedback && (
        <p
          role="status"
          className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          {feedback}
        </p>
      )}

      <section
        aria-labelledby="current-rule-title"
        className="rounded-2xl bg-[#123C2C] p-6 text-white shadow-sm"
      >
        <h2
          id="current-rule-title"
          className="text-sm font-medium text-emerald-100"
        >
          Taxa atual de cashback
        </h2>

        <p className="mt-3 text-3xl font-bold">
          {loading
            ? 'Carregando...'
            : currentPointsPerKg !== null
              ? formatPoints(currentPointsPerKg)
              : 'Não disponível'}

          {!loading && currentPointsPerKg !== null && (
            <span className="ml-2 text-base font-normal">
              pontos/kg
            </span>
          )}
        </p>

        <p className="mt-3 text-xs text-emerald-100">
          Última atualização: {formatDate(updatedAt)}
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Configurar taxa
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Defina a quantidade de pontos que o usuário
            receberá por quilograma descartado.
          </p>
        </div>

        <label
          htmlFor="points-per-kg"
          className="block text-sm font-semibold text-gray-700"
        >
          Pontos por kg
        </label>

        <input
          id="points-per-kg"
          name="pointsPerKg"
          required
          type="number"
          min="0.01"
          step="0.01"
          value={pointsPerKg}
          onChange={(event) => {
            setPointsPerKg(event.target.value)
            setFeedback('')
          }}
          disabled={
            loading ||
            saving ||
            currentPointsPerKg === null
          }
          aria-describedby="cashback-rule-help"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm disabled:cursor-not-allowed disabled:bg-gray-50"
        />

        <p
          id="cashback-rule-help"
          className="text-xs text-gray-500"
        >
          Informe um valor maior que zero, com até duas
          casas decimais.
        </p>

        <div className="rounded-xl bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-800">
            Como funciona o cashback?
          </h3>

          <p className="mt-2 text-sm text-gray-600">
            A taxa é registrada quando o descarte é
            criado. Os pontos são creditados somente
            após a confirmação pelo ponto de coleta.
          </p>

          {isValidRate && (
            <p className="mt-3 text-sm font-medium text-gray-700">
              Exemplo: 2 kg de tecido correspondem a{' '}
              {formatPoints(parsedPointsPerKg * 2)} pontos.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={
            saving ||
            loading ||
            !isValidRate ||
            !hasChanges
          }
          className="rounded-lg bg-[#123C2C] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Salvar taxa'}
        </button>

        {!loading && isValidRate && !hasChanges && (
          <p className="text-xs text-gray-500">
            A taxa informada é igual à taxa atual.
          </p>
        )}
      </form>
    </main>
  )
}

export default CashbackRules
