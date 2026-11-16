
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import Header from '../../../components/Header/Header'
import ContentCard from '../../../components/contentcard/ContentCard'

import {
  POST_FAVORITES_KEY,
  useFavorites,
} from '../../../hooks/useFavorites'

import {
  listAllPosts,
  listCategories,
} from '../../../services/contentService'

// Conteúdos educativos locais, independentes da API
import { educationalPosts } from '../../../data/educationalPosts'

const Content = () => {
  // Dados provenientes do backend
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])

  // Filtros e pesquisa
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Estados da API
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [categoryWarning, setCategoryWarning] = useState('')
  const [feedback, setFeedback] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [searchParams, setSearchParams] = useSearchParams()

  // Favoritos dos artigos cadastrados no backend
  const {
    favorites,
    isFavorite,
    toggleFavorite,
    favoriteError,
    loadingFavorites,
    favoritesReady,
    savingFavorite,
    usingAccount,
  } = useFavorites(POST_FAVORITES_KEY)

  const showFavorites = searchParams.get('favoritos') === '1'

  // --------------------------------------------------
  // CARREGAMENTO DOS CONTEÚDOS DO BACKEND
  // --------------------------------------------------

  useEffect(() => {
    let cancelled = false

    const loadContent = async () => {
      setLoading(true)
      setError('')
      setCategoryWarning('')

      const [categoriesResult, postsResult] =
        await Promise.allSettled([
          listCategories(),
          listAllPosts({
            size: 100,
            sort: 'createdAt,desc',
          }),
        ])

      if (cancelled) return

      if (postsResult.status === 'fulfilled') {
        setPosts(
          Array.isArray(postsResult.value)
            ? postsResult.value
            : []
        )
      } else {
        setPosts([])
        setError(
          postsResult.reason?.message ||
          'Não foi possível carregar os conteúdos.'
        )
      }

      if (categoriesResult.status === 'fulfilled') {
        setCategories(
          Array.isArray(categoriesResult.value)
            ? categoriesResult.value
            : []
        )
      } else {
        setCategories([])
        setCategoryWarning(
          'As categorias do sistema não puderam ser carregadas.'
        )
      }

      setLoading(false)
    }

    loadContent()

    return () => {
      cancelled = true
    }
  }, [reloadKey])

  // --------------------------------------------------
  // FILTRO DE FAVORITOS
  // --------------------------------------------------

  const chooseFavoriteFilter = (enabled) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)

      if (enabled) {
        next.set('favoritos', '1')
      } else {
        next.delete('favoritos')
      }

      return next
    })

    setFeedback('')
  }

  // --------------------------------------------------
  // FAVORITAR ARTIGOS DO BACKEND
  // --------------------------------------------------

  const handleFavorite = async (post) => {
    const nowFavorite = await toggleFavorite(post.id)

    if (nowFavorite !== null) {
      setFeedback(
        nowFavorite
          ? `“${post.title}” salvo nos favoritos.`
          : `“${post.title}” removido dos favoritos.`
      )
    } else {
      setFeedback('')
    }
  }

  // --------------------------------------------------
  // PESQUISA GERAL
  // --------------------------------------------------

  const normalizedTerm = searchTerm
    .trim()
    .toLocaleLowerCase('pt-BR')

  // --------------------------------------------------
  // CONTEÚDOS EDUCATIVOS LOCAIS
  // Funcionam mesmo quando a API está indisponível.
  // --------------------------------------------------

  const localFilteredPosts = educationalPosts.filter((post) => {
    const searchableText = `
      ${post.title}
      ${post.summary}
      ${post.category}
      ${(post.paragraphs || []).join(' ')}
    `.toLocaleLowerCase('pt-BR')

    return searchableText.includes(normalizedTerm)
  })

  // --------------------------------------------------
  // CONTEÚDOS DO BACKEND
  // --------------------------------------------------

  const filteredPosts = posts.filter((post) => {
    const selectedCategoryName = categories.find(
      (category) =>
        String(category.id) === selectedCategory
    )?.name

    const matchesCategory =
      !selectedCategory ||
      String(post.category?.id) === selectedCategory ||
      (
        selectedCategoryName &&
        post.categoryName === selectedCategoryName
      )

    const matchesSearch =
      !normalizedTerm ||
      `
        ${post.title || ''}
        ${post.summary || ''}
      `
        .toLocaleLowerCase('pt-BR')
        .includes(normalizedTerm)

    const matchesFavorites =
      !showFavorites || isFavorite(post.id)

    return (
      matchesCategory &&
      matchesSearch &&
      matchesFavorites
    )
  })

  // --------------------------------------------------
  // INTERFACE
  // --------------------------------------------------

  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-12">

        {/* CABEÇALHO */}
        <header className="mb-8 text-center">

          <h1
            className="mb-3 text-3xl font-extrabold
                       text-[#11271F] sm:text-4xl"
          >
            Conteúdos educativos
          </h1>

          <p className="mx-auto max-w-xl text-gray-600">
            Informação que transforma.
            Aprenda sobre consumo consciente,
            sustentabilidade, economia circular
            e descarte responsável de tecidos.
          </p>

        </header>

        {/* CAMPO DE PESQUISA */}
        <div className="mx-auto mb-10 max-w-2xl space-y-5">

          <label
            className="block text-sm font-semibold
                       text-[#11271F]"
            htmlFor="content-search"
          >
            Pesquisar conteúdos
          </label>

          <input
            id="content-search"
            type="search"
            placeholder="Buscar por título ou assunto..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            className="w-full rounded-full
                       border border-gray-300
                       px-5 py-3 text-sm
                       focus-visible:outline-2
                       focus-visible:outline-offset-2
                       focus-visible:outline-[#245747]"
          />

        </div>

        {/* ---------------------------------------- */}
        {/* NOVA SEÇÃO: GUIAS EDUCATIVOS LOCAIS     */}
        {/* ---------------------------------------- */}

        <section
          className="mx-auto mb-14 max-w-6xl"
          aria-labelledby="educational-guides-title"
        >

          <div className="mb-7 text-center">

            <span
              className="mb-3 inline-block rounded-full
                         bg-emerald-100 px-4 py-2
                         text-xs font-bold uppercase
                         tracking-wider text-emerald-800"
            >
              Aprenda com o EcoTecidos
            </span>

            <h2
              id="educational-guides-title"
              className="text-2xl font-extrabold
                         text-[#11271F] sm:text-3xl"
            >
              Guias para um futuro mais sustentável
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              Descubra atitudes simples para reduzir
              o desperdício, reutilizar materiais
              e contribuir com a economia circular.
            </p>

          </div>

          {/* CARDS EDUCATIVOS */}

          {localFilteredPosts.length > 0 ? (

            <div
              className="grid grid-cols-1 gap-6
                         md:grid-cols-2 lg:grid-cols-3"
            >

              {localFilteredPosts.map((post) => (

                <details
                  key={post.id}
                  className="group flex flex-col
                             overflow-hidden rounded-2xl
                             border border-emerald-100
                             bg-white shadow-sm
                             transition-shadow
                             hover:shadow-md"
                >

                  <summary
                    className="cursor-pointer list-none
                               p-6
                               focus-visible:outline-2
                               focus-visible:outline-emerald-700"
                  >

                    {/* ÍCONE */}
                    <div
                      className="mb-4 flex h-14 w-14
                                 items-center justify-center
                                 rounded-xl bg-emerald-100
                                 text-3xl"
                      aria-hidden="true"
                    >
                      🌱
                    </div>

                    {/* CATEGORIA */}
                    <span
                      className="inline-block rounded-full
                                 bg-[#E5F1EE] px-3 py-1
                                 text-xs font-semibold
                                 text-[#2B6054]"
                    >
                      {post.category}
                    </span>

                    {/* TÍTULO */}
                    <h3
                      className="mt-4 text-xl font-bold
                                 leading-tight text-[#11271F]"
                    >
                      {post.title}
                    </h3>

                    {/* RESUMO */}
                    <p
                      className="mt-3 text-sm
                                 leading-6 text-gray-600"
                    >
                      {post.summary}
                    </p>

                    {/* BOTÃO VISUAL */}
                    <span
                      className="mt-5 inline-block
                                 text-sm font-semibold
                                 text-emerald-800
                                 group-open:hidden"
                    >
                      Ler conteúdo completo +
                    </span>

                    <span
                      className="mt-5 hidden
                                 text-sm font-semibold
                                 text-emerald-800
                                 group-open:inline-block"
                    >
                      Recolher conteúdo −
                    </span>

                  </summary>

                  {/* CONTEÚDO COMPLETO */}
                  <div
                    className="space-y-4 border-t
                               border-emerald-100
                               px-6 pb-6 pt-5"
                  >

                    {(post.paragraphs || []).map(
                      (paragraph, index) => (

                        <p
                          key={index}
                          className="text-sm leading-7
                                     text-gray-700"
                        >
                          {paragraph}
                        </p>

                      )
                    )}

                  </div>

                </details>

              ))}

            </div>

          ) : (

            <p
              role="status"
              className="py-8 text-center text-gray-600"
            >
              Nenhum guia educativo corresponde
              à sua pesquisa.
            </p>

          )}

        </section>

        {/* ---------------------------------------- */}
        {/* ARTIGOS CADASTRADOS NO BACKEND          */}
        {/* ---------------------------------------- */}

        <section aria-labelledby="backend-posts-title">

          <div className="mb-7">

            <h2
              id="backend-posts-title"
              className="text-2xl font-bold text-[#11271F]"
            >
              Mais conteúdos e publicações
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Explore artigos cadastrados na plataforma
              e salve seus favoritos.
            </p>

          </div>

          {/* FILTRO DE FAVORITOS */}
          <div
            className="mb-7 flex flex-wrap
                       justify-center gap-3"
            role="group"
            aria-label="Filtrar conteúdos favoritos"
          >

            <button
              type="button"
              onClick={() => chooseFavoriteFilter(false)}
              aria-pressed={!showFavorites}
              className={`rounded-full px-5 py-2.5
                          text-sm font-semibold
                          focus-visible:outline-2
                          focus-visible:outline-offset-2
                          focus-visible:outline-[#245747]
                ${
                  !showFavorites
                    ? 'bg-[#11271F] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Todos os conteúdos
            </button>

            <button
              type="button"
              onClick={() => chooseFavoriteFilter(true)}
              aria-pressed={showFavorites}
              className={`rounded-full px-5 py-2.5
                          text-sm font-semibold
                          focus-visible:outline-2
                          focus-visible:outline-offset-2
                          focus-visible:outline-[#245747]
                ${
                  showFavorites
                    ? 'bg-[#11271F] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Meus favoritos (
              {loadingFavorites ? '...' : favorites.length}
              )
            </button>

          </div>

          {/* FILTRO DE CATEGORIAS DO BACKEND */}

          {categories.length > 0 && (

            <div
              className="mb-8 flex flex-wrap
                         justify-center gap-2"
              role="group"
              aria-label="Filtrar por categoria"
            >

              <button
                type="button"
                onClick={() => setSelectedCategory('')}
                aria-pressed={!selectedCategory}
                className={`rounded-full px-4 py-2
                            text-sm font-medium
                  ${
                    !selectedCategory
                      ? 'bg-[#245747] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Todas as categorias
              </button>

              {categories.map((category) => (

                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(String(category.id))
                  }
                  aria-pressed={
                    String(category.id) === selectedCategory
                  }
                  className={`rounded-full px-4 py-2
                              text-sm font-medium
                    ${
                      String(category.id) === selectedCategory
                        ? 'bg-[#245747] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {category.name}
                </button>

              ))}

            </div>

          )}

          {/* MENSAGENS DO SISTEMA */}

          <div
            aria-live="polite"
            className="mb-5 space-y-2 text-sm"
          >

            {feedback && (
              <p
                role="status"
                className="rounded-lg
                           bg-emerald-50 p-3
                           text-emerald-800"
              >
                {feedback}
              </p>
            )}

            {favoriteError && (
              <p
                role="alert"
                className="rounded-lg bg-red-50
                           p-3 text-red-700"
              >
                {favoriteError}
              </p>
            )}

            {categoryWarning && !error && (
              <p
                className="rounded-lg bg-amber-50
                           p-3 text-amber-800"
              >
                {categoryWarning}
              </p>
            )}

            <p className="text-gray-600">
              {usingAccount
                ? 'Os favoritos dos artigos cadastrados ficam vinculados à sua conta.'
                : 'Entre na sua conta para sincronizar favoritos dos artigos cadastrados entre dispositivos.'}
            </p>

          </div>

          {/* LISTA DE ARTIGOS DA API */}

          {loading || (showFavorites && loadingFavorites) ? (

            <p
              role="status"
              className="py-10 text-center text-gray-600"
            >
              Carregando publicações...
            </p>

          ) : error ? (

            <div
              role="status"
              className="rounded-xl border
                         border-amber-200 bg-amber-50
                         px-6 py-8 text-center"
            >

              <h3
                className="mb-2 text-lg
                           font-bold text-amber-900"
              >
                Publicações do sistema indisponíveis
              </h3>

              <p className="text-sm text-amber-900">
                Não foi possível carregar os artigos
                cadastrados no servidor.
                Os guias educativos acima continuam disponíveis.
              </p>

              {error.toLowerCase().includes('token') && (

                <Link
                  to="/login"
                  className="mt-4 inline-block
                             font-semibold text-amber-900
                             underline"
                >
                  Entrar para visualizar publicações
                </Link>

              )}

              <button
                type="button"
                onClick={() =>
                  setReloadKey((key) => key + 1)
                }
                className="mx-auto mt-4 block
                           rounded-lg border
                           border-amber-400 px-4 py-2
                           font-semibold text-amber-900
                           hover:bg-amber-100"
              >
                Tentar novamente
              </button>

            </div>

          ) : filteredPosts.length > 0 ? (

            <>

              <p
                role="status"
                className="mb-4 text-sm text-gray-600"
              >
                {filteredPosts.length}{' '}
                {filteredPosts.length === 1
                  ? 'publicação encontrada'
                  : 'publicações encontradas'}
              </p>

              <div
                className="grid grid-cols-1 gap-6
                           sm:grid-cols-2 lg:grid-cols-3"
              >

                {filteredPosts.map((post) => (

                  <ContentCard
                    key={post.id}
                    id={post.id}
                    category={
                      post.category?.name ||
                      post.categoryName
                    }
                    title={post.title}
                    description={post.summary}
                    isFavorite={isFavorite(post.id)}
                    favoriteDisabled={
                      loadingFavorites ||
                      !favoritesReady ||
                      savingFavorite
                    }
                    onToggleFavorite={() =>
                      handleFavorite(post)
                    }
                  />

                ))}

              </div>

            </>

          ) : (

            <div
              role="status"
              className="py-10 text-center text-sm
                         text-gray-600"
            >

              <p>
                {showFavorites && !favoritesReady
                  ? 'Não foi possível consultar seus favoritos.'
                  : showFavorites &&
                    favoritesReady &&
                    favorites.length === 0
                    ? 'Você ainda não salvou publicações favoritas.'
                    : 'Nenhuma publicação corresponde aos filtros selecionados.'}
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('')
                  chooseFavoriteFilter(false)
                }}
                className="mt-4 rounded-lg border
                           border-[#245747] px-4 py-2
                           font-semibold text-[#245747]
                           hover:bg-emerald-50"
              >
                Ver todos os conteúdos
              </button>

            </div>

          )}

        </section>

      </main>
    </>
  )
}

export default Content
