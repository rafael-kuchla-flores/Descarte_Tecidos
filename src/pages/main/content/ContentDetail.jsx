import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { RiHeartFill, RiHeartLine } from 'react-icons/ri'
import Header from '../../../components/Header/Header'
import editorialCover from '../../../assets/images/hero-fabrics.jpg'
import { PostCoverImage } from '../../../components/contentcard/ContentCard'
import { POST_FAVORITES_KEY, useFavorites } from '../../../hooks/useFavorites'
import { getPost } from '../../../services/contentService'
import { editorialArticles, isMeaningfulPost } from '../../../services/editorialContent'

const ContentDetail = () => {
  const { id } = useParams()
  const [result, setResult] = useState({ id: null, post: null, error: '' })
  const [feedback, setFeedback] = useState('')
  const [retryKey, setRetryKey] = useState(0)
  const { isFavorite, toggleFavorite, favoriteError, loadingFavorites, favoritesReady, savingFavorite, usingAccount } = useFavorites(POST_FAVORITES_KEY)

  useEffect(() => {
    let cancelled = false
    const editorialPost = editorialArticles.find((item) => item.id === id)
    if (editorialPost) {
      queueMicrotask(() => { if (!cancelled) setResult({ id, post: editorialPost, error: '' }) })
      return () => { cancelled = true }
    }
    getPost(id)
      .then((data) => {
        if (!cancelled) setResult(isMeaningfulPost(data)
          ? { id, post: data, error: '' }
          : { id, post: null, error: 'Este artigo está em revisão porque seu conteúdo está incompleto. Explore os guias educativos disponíveis.' })
      })
      .catch((requestError) => {
        if (!cancelled) setResult({ id, post: null, error: requestError.message || 'Não foi possível carregar o conteúdo.' })
      })
    return () => { cancelled = true }
  }, [id, retryKey])

  const loading = result.id !== id
  const post = loading ? null : result.post
  const error = loading ? '' : result.error
  const saved = isFavorite(id)
  const publishedAt = post?.createdAt ? new Date(post.createdAt) : null
  const publicationDate = publishedAt && !Number.isNaN(publishedAt.getTime())
    ? publishedAt.toLocaleDateString('pt-BR')
    : null

  const handleFavorite = async () => {
    const nowFavorite = await toggleFavorite(id)
    if (nowFavorite !== null) {
      setFeedback(nowFavorite ? 'Conteúdo adicionado aos favoritos.' : 'Conteúdo removido dos favoritos.')
    } else {
      setFeedback('')
    }
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <Link to="/conteudos" className="inline-flex rounded text-sm font-semibold text-[#245747] underline underline-offset-4">
          &larr; Voltar para conteúdos
        </Link>

        {loading ? (
          <p role="status" className="py-16 text-center text-gray-600">Carregando conteúdo...</p>
        ) : error ? (
          <div role="alert" className="py-16 text-center">
            <h1 className="text-2xl font-bold text-[#11271F]">Conteúdo indisponível</h1>
            <p className="mt-3 text-sm text-gray-600">{error}</p>
            <button type="button" onClick={() => { setResult({ id: null, post: null, error: '' }); setRetryKey((key) => key + 1) }} className="mt-5 rounded-lg border border-[#245747] px-4 py-2 text-sm font-semibold text-[#245747]">Tentar novamente</button>
          </div>
        ) : post ? (
          <article className="mt-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex rounded-full bg-[#E5F1EE] px-3 py-1 text-xs font-semibold text-[#245747]">{post.category?.name || post.categoryName || 'Educação ambiental'}</span>
              {typeof post.id !== 'string' && <button
                type="button"
                onClick={handleFavorite}
                aria-pressed={saved}
                disabled={loadingFavorites || !favoritesReady || savingFavorite}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#245747] px-4 py-2 text-sm font-semibold text-[#245747] hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#245747]"
              >
                {saved ? <RiHeartFill aria-hidden="true" /> : <RiHeartLine aria-hidden="true" />}
                {saved ? 'Salvo nos favoritos' : 'Salvar nos favoritos'}
              </button>}
            </div>
            {feedback && <p role="status" className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{feedback}</p>}
            {favoriteError && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{favoriteError}</p>}
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-[#11271F] sm:text-4xl">{post.title}</h1>
            {post.summary && <p className="mt-3 text-base leading-relaxed text-gray-600">{post.summary}</p>}
            {typeof post.id === 'string' ? <img src={editorialCover} alt="Tecidos e reaproveitamento têxtil" className="mt-7 h-56 w-full rounded-xl object-cover sm:h-80" /> : <PostCoverImage postId={post.id} alt={post.coverImageAlt || post.title} className="mt-7 h-56 w-full rounded-xl object-cover sm:h-80" />}
            <div className="mt-7 space-y-4 text-base leading-7 text-gray-700">
              {String(post.body || '').split('\n').filter(Boolean).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            {post.clothTypes?.length > 0 && (
              <p className="mt-6 text-sm text-gray-600">Tipos de tecido: {post.clothTypes.map((clothType) => clothType.name).join(', ')}</p>
            )}
            {post.tags?.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2" aria-label="Tags do conteúdo">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">#{tag}</span>
                ))}
              </div>
            )}
            {typeof post.id === 'string' && <p className="mt-7 text-xs text-gray-600">Guia educativo do ECOTECIDOS · conteúdo informativo da plataforma</p>}
            {publicationDate && <p className="mt-8 text-xs text-gray-600">Publicado em {publicationDate}{post.createdByName ? ` · por ${post.createdByName}` : ''}</p>}
            <p className="mt-3 text-xs text-gray-600">{usingAccount ? (favoritesReady ? 'Favoritos vinculados à sua conta.' : 'A sincronização de favoritos está indisponível no momento.') : 'Entre para sincronizar favoritos com sua conta. Sem login, ficam somente neste navegador.'}</p>
            <Link to="/conteudos?favoritos=1" className="mt-4 inline-flex text-sm font-semibold text-[#245747] underline">Ver meus favoritos</Link>
          </article>
        ) : (
          <div className="py-16 text-center"><h1 className="text-2xl font-bold text-[#11271F]">Conteúdo não encontrado</h1></div>
        )}
      </main>
    </>
  )
}

export default ContentDetail
