import { useState } from 'react'
import Header from '../../../components/Header/Header'
import ContentCard from '../../../components/contentcard/ContentCard'

const Content = () => {
  const contents = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80',
      category: 'Sustentabilidade',
      title: 'O impacto da indústria têxtil no meio ambiente',
      description: 'Entenda por que o descarte correto de tecidos é tão importante.'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80',
      category: 'Dicas',
      title: '5 dicas para reutilizar suas roupas',
      description: 'Pequenas atitudes que fazem grande diferença.'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1611080031804-03fb31eec253?auto=format&fit=crop&q=80',
      category: 'Economia Circular',
      title: 'O que é economia circular?',
      description: 'Conheça o conceito que está transformando o futuro da moda.'
    }
  ]
  const [visibleContents] = useState(() => {
    const deletedContentIds = JSON.parse(localStorage.getItem('deletedContentIds') || '[]')
    const storedContents = JSON.parse(localStorage.getItem('adminContents') || '[]')
    const storedById = new Map(storedContents.map((content) => [String(content.id), content]))
    const baseIds = new Set(contents.map((content) => String(content.id)))
    const mergedContents = contents.map((content) => {
      const storedContent = storedById.get(String(content.id))
      return storedContent
        ? {
          ...content,
          image: storedContent.imagem || content.image,
          category: storedContent.categoria || content.category,
          title: storedContent.titulo || content.title,
          description: storedContent.conteudo || content.description
        }
        : content
    })
    const additionalContents = storedContents
      .filter((content) => !baseIds.has(String(content.id)) && content.status !== 'Rascunho')
      .map((content) => ({
        id: String(content.id),
        image: content.imagem || undefined,
        category: content.categoria,
        title: content.titulo,
        description: content.conteudo || 'Conteúdo educativo sobre reaproveitamento têxtil.'
      }))

    return [...mergedContents, ...additionalContents]
      .filter((content) => !deletedContentIds.includes(String(content.id)))
  })
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const categorizedContents = selectedCategory === 'Todos'
    ? visibleContents
    : visibleContents.filter((content) => content.category === selectedCategory)
  const categories = [
    'Todos', 
    'Sustentabilidade', 
    'Dicas', 
    'Economia Circular', 
    'Moda Consciente'
  ];

  return (
    <>
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-[#11271F] mb-4">
            Conteúdos
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Informação que transforma. Aprenda mais sobre consumo consciente e descarte correto de tecidos.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedCategory(category)}
              aria-pressed={selectedCategory === category}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#11271F] focus-visible:ring-offset-2 ${
                selectedCategory === category
                  ? 'bg-[#11271F] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorizedContents.length > 0 ? categorizedContents.map((content) => (
              <ContentCard key={content.id} {...content} />
            )) : (
              <p role="status" className="md:col-span-2 lg:col-span-3 py-10 text-center text-sm text-gray-600">
                Nenhum conteúdo encontrado nesta categoria.
              </p>
            )}
        </div>
      </main>
    </>
  )
}

export default Content