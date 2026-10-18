import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../../../components/header/Header'
import defaultImage from '../../../assets/images/image.png'
import { getPost } from '../../../services/contentService'

const ContentDetail = () => {
  const { id } = useParams()
  const [result, setResult] = useState({ id: null, post: null, error: '' })

  useEffect(() => {
    let cancelled = false
    getPost(id)
      .then((data) => {
        if (!cancelled) setResult({ id, post: data, error: '' })
      })
      .catch((requestError) => {
        if (!cancelled) setResult({ id, post: null, error: requestError.message || 'Não foi possível carregar o post.' })
      })
    return () => { cancelled = true }
  }, [id])

  const loading = result.id !== id
  const post = loading ? null : result.post
  const error = loading ? '' : result.error

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <Link to="/conteudos" className="inline-flex rounded text-sm font-medium text-[#2B6054] underline underline-offset-4">
          &larr; Voltar para conteúdos
        </Link>

        {loading ? (
          <p role="status" className="py-16 text-center text-gray-600">Carregando post...</p>
        ) : error ? (
          <div role="alert" className="py-16 text-center">
            <h1 className="text-2xl font-bold text-[#11271F]">Conteúdo indisponível</h1>
            <p className="mt-3 text-sm text-gray-600">{error}</p>
            {error.toLowerCase().includes('token') && (
              <Link to="/login" className="mt-3 inline-block font-semibold text-[#2B6054] underline">Entre para continuar</Link>
            )}
          </div>
        ) : post ? (
          <article className="mt-8">
            <span className="inline-flex rounded-full bg-[#E5F1EE] px-3 py-1 text-xs font-semibold text-[#2B6054]">
              {post.category?.name}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight text-[#11271F] sm:text-4xl">{post.title}</h1>
            {post.summary && <p className="mt-3 text-base leading-relaxed text-gray-600">{post.summary}</p>}
            <img
              src={post.coverImageUrl || defaultImage}
              alt={post.coverImageAlt || post.title}
              className="mt-7 h-56 w-full rounded-xl object-cover sm:h-80"
            />
            <div className="mt-7 space-y-4 text-base leading-7 text-gray-700">
              {String(post.body || '').split('\n').filter(Boolean).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            {post.clothTypes?.length > 0 && (
              <p className="mt-6 text-sm text-gray-600">
                Tipos de tecido: {post.clothTypes.map((clothType) => clothType.name).join(', ')}
              </p>
            )}
            {post.tags?.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2" aria-label="Tags do conteúdo">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            <p className="mt-8 text-xs text-gray-500">
              Publicado em {new Date(post.createdAt).toLocaleDateString('pt-BR')}
              {post.createdByName ? ` · por ${post.createdByName}` : ''}
            </p>
          </article>
        ) : (
          <div className="py-16 text-center">
            <h1 className="text-2xl font-bold text-[#11271F]">Conteúdo não encontrado</h1>
          </div>
        )}
      </main>
    </>
  )
}

export default ContentDetail
