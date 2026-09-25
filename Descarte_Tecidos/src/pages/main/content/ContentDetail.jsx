import { Link, useParams } from 'react-router-dom'
import Header from '../../../components/header/Header'
import defaultImage from '../../../assets/images/image.png'

const DEFAULT_CONTENTS = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80',
    category: 'Sustentabilidade',
    title: 'O impacto da indústria têxtil no meio ambiente',
    description: 'Entenda por que o descarte correto de tecidos é tão importante.',
    content: 'A indústria têxtil é uma das mais poluentes do mundo. A produção excessiva e o descarte inadequado de roupas geram toneladas de resíduos que acabam em aterros sanitários. O descarte correto começa com a separação em casa.',
    date: '16/05/2026',
    tags: ['sustentabilidade', 'meio ambiente']
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80',
    category: 'Dicas',
    title: '5 dicas para reutilizar suas roupas',
    description: 'Pequenas atitudes que fazem grande diferença.',
    content: 'Reutilizar roupas prolonga a vida útil dos tecidos e reduz o descarte. Doe peças em bom estado, transforme roupas antigas e encaminhe tecidos sem uso para um ponto de coleta.',
    date: '10/05/2026',
    tags: ['reutilização', 'dicas']
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1611080031804-03fb31eec253?auto=format&fit=crop&q=80',
    category: 'Economia Circular',
    title: 'O que é economia circular?',
    description: 'Conheça o conceito que está transformando o futuro da moda.',
    content: 'A economia circular busca manter produtos e materiais em uso pelo maior tempo possível. No setor têxtil, isso significa reduzir desperdícios, reutilizar peças e reciclar fibras.',
    date: '14/05/2026',
    tags: ['economia circular']
  }
]

const ContentDetail = () => {
  const { id } = useParams()
  const savedContents = JSON.parse(localStorage.getItem('adminContents') || '[]')
  const deletedContentIds = JSON.parse(localStorage.getItem('deletedContentIds') || '[]')
  const savedContent = savedContents.find((content) => String(content.id) === String(id))
  const defaultContent = DEFAULT_CONTENTS.find((content) => content.id === String(id))
  const content = savedContent
    ? {
      id: String(savedContent.id),
      image: savedContent.imagem || defaultContent?.image || defaultImage,
      category: savedContent.categoria || defaultContent?.category || 'Conteúdo',
      title: savedContent.titulo || defaultContent?.title || 'Conteúdo educativo',
      description: savedContent.conteudo || defaultContent?.description || '',
      content: savedContent.conteudo || defaultContent?.content || '',
      date: savedContent.data || '',
      tags: savedContent.tags || defaultContent?.tags || []
    }
    : defaultContent

  if (!content || deletedContentIds.includes(String(id))) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-[#11271F]">Conteúdo não encontrado</h1>
          <Link to="/conteudos" className="mt-4 inline-flex rounded text-sm font-semibold text-[#2B6054] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B6054]">
            Voltar para conteúdos
          </Link>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <Link to="/conteudos" className="inline-flex rounded text-sm font-medium text-[#2B6054] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B6054]">
          &larr; Voltar para conteúdos
        </Link>

        <article className="mt-8">
          <span className="inline-flex rounded-full bg-[#E5F1EE] px-3 py-1 text-xs font-semibold text-[#2B6054]">
            {content.category}
          </span>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-[#11271F] sm:text-4xl">
            {content.title}
          </h1>
          {content.description && (
            <p className="mt-3 text-base leading-relaxed text-gray-600">{content.description}</p>
          )}

          <img
            src={content.image || defaultImage}
            alt={`Imagem de destaque: ${content.title}`}
            className="mt-7 h-56 w-full rounded-xl object-cover sm:h-80"
          />

          <div className="mt-7 space-y-4 text-base leading-7 text-gray-700">
            {content.content.split('\n').filter(Boolean).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {content.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2" aria-label="Tags do conteúdo">
              {content.tags.map((tag, index) => (
                <span key={`${tag}-${index}`} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {content.date && <p className="mt-8 text-xs text-gray-500">Publicado em {content.date}</p>}
        </article>
      </main>
    </>
  )
}

export default ContentDetail
