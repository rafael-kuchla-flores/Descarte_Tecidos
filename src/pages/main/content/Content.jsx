import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Header from '../../../components/Header/Header'
import ContentCard from '../../../components/contentcard/ContentCard'
import { POST_FAVORITES_KEY, useFavorites } from '../../../hooks/useFavorites'
import { listAllPosts, listCategories } from '../../../services/contentService'
import { editorialArticles, isMeaningfulPost } from '../../../services/editorialContent'

const Content = () => {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [categoryWarning, setCategoryWarning] = useState('')
  const [feedback, setFeedback] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [searchParams, setSearchParams] = useSearchParams()
  const { favorites, isFavorite, toggleFavorite, favoriteError, loadingFavorites, favoritesReady, savingFavorite, usingAccount } = useFavorites(POST_FAVORITES_KEY)
  const showFavorites = searchParams.get('favoritos') === '1'

  useEffect(() => {
    let cancelled = false
    const loadContent = async () => {
      setLoading(true)
      setError('')
      setCategoryWarning('')
      const [categoriesResult, postsResult] = await Promise.allSettled([
        listCategories(),
        listAllPosts({ size: 100, sort: 'createdAt,desc' }),
      ])

      if (cancelled) return

      if (postsResult.status === 'fulfilled') {
        setPosts(Array.isArray(postsResult.value) ? postsResult.value.filter(isMeaningfulPost) : [])
      } else {
        setPosts([])
        setError(postsResult.reason?.message || 'Não foi possível carregar os conteúdos.')
      }

      if (categoriesResult.status === 'fulfilled') {
        setCategories(Array.isArray(categoriesResult.value) ? categoriesResult.value : [])
      } else {
        setCategories([])
        setCategoryWarning('Categorias do servidor indisponíveis. Você ainda pode filtrar os guias educativos.')
      }
      setLoading(false)
    }
    loadContent()
    return () => { cancelled = true }
  }, [reloadKey])

  const chooseFavoriteFilter = (enabled) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      if (enabled) next.set('favoritos', '1')
      else next.delete('favoritos')
      return next
    })
    setFeedback('')
  }

  const handleFavorite = async (post) => {
    const nowFavorite = await toggleFavorite(post.id)
    if (nowFavorite !== null) {
      setFeedback(nowFavorite ? `“${post.title}” salvo nos favoritos.` : `“${post.title}” removido dos favoritos.`)
    } else {
      setFeedback('')
    }
  }

  const normalizedTerm = searchTerm.trim().toLocaleLowerCase('pt-BR')
  const editorialCategories = [...new Set(editorialArticles.map((post) => post.categoryName))]
  const selectedCategoryName = selectedCategory.startsWith('local:') ? selectedCategory.slice(6) : categories.find((category) => String(category.id) === selectedCategory)?.name
  // Show curated guides when the API has no publishable articles.
  const visiblePosts = [...editorialArticles, ...posts]
  const filteredPosts = visiblePosts.filter((post) => {
    const matchesCategory = !selectedCategory || String(post.category?.id) === selectedCategory
      || (selectedCategoryName && (post.categoryName === selectedCategoryName || post.category?.name === selectedCategoryName))
    const matchesSearch = !normalizedTerm || `${post.title || ''} ${post.summary || ''}`.toLocaleLowerCase('pt-BR').includes(normalizedTerm)
    return matchesCategory && matchesSearch && (!showFavorites || (typeof post.id === 'number' && isFavorite(post.id)))
  })

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        <header className="mb-8 text-center">
          <h1 className="mb-3 text-3xl font-extrabold text-[#11271F] sm:text-4xl">Conteúdos educativos</h1>
          <p className="mx-auto max-w-xl text-gray-600">
            Informação que transforma. Aprenda sobre consumo consciente e descarte correto de tecidos.
          </p>
        </header>

        <section aria-label="Guia rápido de descarte têxtil" className="mb-10 grid gap-4 md:grid-cols-3">
          {[
            { title: 'Antes de doar', body: 'Separe roupas limpas e em condições de uso. Verifique se o ponto de coleta recebe o tipo de tecido que você pretende entregar.' },
            { title: 'Reutilize e conserte', body: 'Pequenos reparos, ajustes e customizações prolongam a vida útil das peças e reduzem a necessidade de novas compras.' },
            { title: 'Recicle com responsabilidade', body: 'Retalhos e tecidos sem condições de uso precisam de destinação adequada. Consulte os materiais aceitos em cada ponto.' },
          ].map((item) => (
            <article key={item.title} className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
              <h2 className="mb-2 text-lg font-bold text-[#153D2C]">{item.title}</h2>
              <p className="text-sm leading-relaxed text-gray-700">{item.body}</p>
            </article>
          ))}
        </section>

        <div className="mx-auto mb-6 max-w-2xl space-y-5">
          <label className="block text-sm font-semibold text-[#11271F]" htmlFor="content-search">
            Pesquisar conteúdos
          </label>
          <input
            id="content-search"
            type="search"
            placeholder="Buscar por título ou assunto..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-full border border-gray-300 px-5 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#245747]"
          />
        </div>

        <div className="mb-7 flex flex-wrap justify-center gap-3" role="group" aria-label="Filtrar conteúdos favoritos">
          <button
            type="button"
            onClick={() => chooseFavoriteFilter(false)}
            aria-pressed={!showFavorites}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#245747] ${!showFavorites ? 'bg-[#11271F] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Todos os conteúdos
          </button>
          <button
            type="button"
            onClick={() => chooseFavoriteFilter(true)}
            aria-pressed={showFavorites}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#245747] ${showFavorites ? 'bg-[#11271F] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Meus favoritos ({loadingFavorites ? '...' : favorites.length})
          </button>
        </div>

        {(categories.length > 0 || editorialCategories.length > 0) && (
          <div className="mb-8 flex flex-wrap justify-center gap-2" role="group" aria-label="Filtrar por categoria">
            <button
              type="button"
              onClick={() => setSelectedCategory('')}
              aria-pressed={!selectedCategory}
              className={`rounded-full px-4 py-2 text-sm font-medium ${!selectedCategory ? 'bg-[#245747] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Todas as categorias
            </button>
            {editorialCategories.map((categoryName) => (
              <button key={`local:${categoryName}`} type="button" onClick={() => setSelectedCategory(`local:${categoryName}`)} aria-pressed={selectedCategory === `local:${categoryName}`} className={`rounded-full px-4 py-2 text-sm font-medium ${selectedCategory === `local:${categoryName}` ? 'bg-[#245747] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{categoryName}</button>
            ))}
            {categories.filter((category) => !editorialCategories.includes(category.name)).map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(String(category.id))}
                aria-pressed={String(category.id) === selectedCategory}
                className={`rounded-full px-4 py-2 text-sm font-medium ${String(category.id) === selectedCategory ? 'bg-[#245747] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        <div aria-live="polite" className="mb-5 space-y-2 text-sm">
          {feedback && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-emerald-800">{feedback}</p>}
          {favoriteError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">{favoriteError}</p>}
          {error && <p className="rounded-lg bg-amber-50 p-3 text-amber-800">Os artigos publicados não puderam ser consultados. Os guias educativos continuam disponíveis.</p>}
          {categoryWarning && <p className="rounded-lg bg-amber-50 p-3 text-amber-800">{categoryWarning}</p>}
          <p className="text-gray-600">{usingAccount ? (favoritesReady ? 'Favoritos vinculados à sua conta.' : 'Os favoritos da conta estão indisponíveis no momento. Os guias continuam acessíveis.') : 'Entre na sua conta para sincronizar favoritos entre dispositivos. Sem login, eles ficam somente neste navegador.'}</p>
        </div>

        {loading || (showFavorites && loadingFavorites) ? (
          <p role="status" className="py-10 text-center text-gray-600">Carregando conteúdos...</p>
        ) : error && !editorialArticles.length ? (
          <div role="alert" className="py-10 text-center text-sm text-red-700">
            <p>{error}</p>
            {error.toLowerCase().includes('token') && <Link to="/login" className="mt-3 inline-block font-semibold underline">Entrar para visualizar os conteúdos</Link>}
            <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="mx-auto mt-4 block rounded-lg border border-red-300 px-4 py-2 font-semibold hover:bg-red-50">Tentar novamente</button>
          </div>
        ) : filteredPosts.length > 0 ? (
          <>
            <p role="status" className="mb-4 text-sm text-gray-600">{filteredPosts.length} {filteredPosts.length === 1 ? 'conteúdo encontrado' : 'conteúdos encontrados'}</p>
            <p className="mb-4 text-sm text-gray-600">Guias educativos da plataforma{posts.length ? ' e artigos publicados' : ''}</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <ContentCard
                  key={post.id}
                  id={post.id}
                  category={post.category?.name || post.categoryName}
                  title={post.title}
                  description={post.summary}
                  linkTo={typeof post.id === 'string' ? `/conteudos/${post.id}` : undefined}
                  isFavorite={typeof post.id === 'number' && isFavorite(post.id)}
                  favoriteDisabled={loadingFavorites || !favoritesReady || savingFavorite}
                  onToggleFavorite={typeof post.id === 'number' ? () => handleFavorite(post) : undefined}
                />
              ))}
            </div>
          </>
        ) : (
          <div role="status" className="py-10 text-center text-sm text-gray-600">
            <p>{showFavorites && !favoritesReady ? 'Não foi possível consultar seus favoritos. Verifique a mensagem acima e tente novamente.' : showFavorites && favoritesReady && favorites.length === 0 ? 'Você ainda não salvou conteúdos favoritos.' : 'Nenhum conteúdo corresponde aos filtros selecionados.'}</p>
            <button type="button" onClick={() => { setSearchTerm(''); setSelectedCategory(''); chooseFavoriteFilter(false) }} className="mt-4 rounded-lg border border-[#245747] px-4 py-2 font-semibold text-[#245747] hover:bg-emerald-50">Ver todos os conteúdos</button>
          </div>
        )}
      </main>
    </>
  )
}

export default Content
