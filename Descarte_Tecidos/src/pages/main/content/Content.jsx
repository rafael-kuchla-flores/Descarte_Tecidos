import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../../components/Header/Header'
import ContentCard from '../../../components/contentcard/ContentCard'
import { listAllPosts, listCategories } from '../../../services/contentService'

const Content = () => {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const loadContent = async () => {
      setLoading(true)
      setError('')
      try {
        const [categoryList, postPage] = await Promise.all([
          listCategories(),
          listAllPosts({ size: 100, sort: 'createdAt,desc' }),
        ])
        if (cancelled) return
        setCategories(categoryList)
        setPosts(postPage)
      } catch (requestError) {
        if (!cancelled) setError(requestError.message || 'Não foi possível carregar os conteúdos.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadContent()
    return () => { cancelled = true }
  }, [])

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = !selectedCategory || Number(post.category?.id) === Number(selectedCategory)
    const term = searchTerm.toLocaleLowerCase('pt-BR')
    const matchesSearch = !term || `${post.title} ${post.summary}`.toLocaleLowerCase('pt-BR').includes(term)
    return matchesCategory && matchesSearch
  })

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-4xl font-extrabold text-[#11271F]">Conteúdos</h1>
          <p className="mx-auto max-w-xl text-gray-500">
            Informação que transforma. Aprenda mais sobre consumo consciente e descarte correto de tecidos.
          </p>
        </div>

        <div className="mx-auto mb-6 max-w-xl">
          <input
            type="search"
            aria-label="Buscar conteúdos"
            placeholder="Buscar por título ou assunto..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:border-[#2B6054] focus:outline-none"
          />
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setSelectedCategory('')}
            aria-pressed={!selectedCategory}
            className={`rounded-full px-5 py-2 text-sm font-medium ${!selectedCategory ? 'bg-[#11271F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(String(category.id))}
              aria-pressed={String(category.id) === selectedCategory}
              className={`rounded-full px-5 py-2 text-sm font-medium ${String(category.id) === selectedCategory ? 'bg-[#11271F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {loading ? (
          <p role="status" className="py-10 text-center text-gray-600">Carregando conteúdos...</p>
        ) : error ? (
          <div role="alert" className="py-10 text-center text-sm text-red-700">
            <p>{error}</p>
            {error.toLowerCase().includes('token') && (
              <Link to="/login" className="mt-3 inline-block font-semibold underline">Entre para visualizar os conteúdos</Link>
            )}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <ContentCard
                key={post.id}
                id={post.id}
                image={post.coverImageUrl || undefined}
                category={post.category?.name}
                title={post.title}
                description={post.summary}
              />
            ))}
          </div>
        ) : (
          <p role="status" className="py-10 text-center text-sm text-gray-600">Nenhum conteúdo encontrado.</p>
        )}
      </main>
    </>
  )
}

export default Content
