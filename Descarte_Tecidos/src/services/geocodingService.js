const buscarNominatim = async (endereco) => {
  const params = new URLSearchParams({
    q: endereco,
    format: 'json',
    limit: '1',
    countrycodes: 'br',
    addressdetails: '1',
  })

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
    {
      headers: {
        Accept: 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error('Erro ao buscar a localização do endereço.')
  }

  return response.json()
}

const geocodificarEndereco = async ({
  street,
  number,
  neighborhood,
  city,
  state,
  country = 'Brasil',
}) => {
  const enderecoCompleto = [
    `${street}, ${number}`,
    neighborhood,
    city,
    state,
    country,
  ]
    .filter(Boolean)
    .join(', ')

  let data = await buscarNominatim(enderecoCompleto)

  if (data.length > 0) {
    return {
      latitude: Number(data[0].lat),
      longitude: Number(data[0].lon),
    }
  }


  const enderecoRua = [
    street,
    city,
    state,
    country,
  ]
    .filter(Boolean)
    .join(', ')

  data = await buscarNominatim(enderecoRua)

  if (data.length > 0) {
    return {
      latitude: Number(data[0].lat),
      longitude: Number(data[0].lon),
    }
  }


  const enderecoBairro = [
    neighborhood,
    city,
    state,
    country,
  ]
    .filter(Boolean)
    .join(', ')

  data = await buscarNominatim(enderecoBairro)

  if (data.length > 0) {
    return {
      latitude: Number(data[0].lat),
      longitude: Number(data[0].lon),
    }
  }

  throw new Error(
    'Não foi possível encontrar a localização desse endereço.'
  )
}

export default {
  geocodificarEndereco,
}