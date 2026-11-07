// Date-only campaign periods are compared in local calendar time.
export const parseCampaignDate = (value) => {
  if (!value) return null
  const text = String(value).slice(0, 10)
  const match = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  const year = Number(match ? match[3] : iso?.[1])
  const month = Number(match ? match[2] : iso?.[2])
  const day = Number(match ? match[1] : iso?.[3])
  if (!year || !month || !day) return null
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null
}
export const getCampaignStatus = (campaign, now = new Date()) => {
  const start = parseCampaignDate(campaign.startDate)
  const end = parseCampaignDate(campaign.endDate)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (end && end < today) return 'Encerrada'
  if (start && start > today) return 'Em breve'
  if (start && end) return 'Ativa'
  return 'Período a confirmar'
}
export const formatCampaignDate = (value) => {
  const date = parseCampaignDate(value)
  return date ? new Intl.DateTimeFormat('pt-BR').format(date) : 'A confirmar'
}
