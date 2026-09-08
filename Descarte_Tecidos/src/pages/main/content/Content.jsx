import React from 'react'
import Header from '../../../components/header/Header'
import ContentCard from '../../../components/contentcard/ContentCard'

const Content = () => {
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
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                category === 'Todos'
                  ? 'bg-[#11271F] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ContentCard
            id="1"
            image="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80"
            category="Sustentabilidade"
            title="O impacto da indústria têxtil no meio ambiente"
            description="Entenda por que o descarte correto de tecidos é tão importante."
          />
          
          <ContentCard
            id="2"
            image="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80"
            category="Dicas"
            title="5 dicas para reutilizar suas roupas"
            description="Pequenas atitudes que fazem grande diferença."
          />
          
          <ContentCard
            id="3"
            image="https://images.unsplash.com/photo-1611080031804-03fb31eec253?auto=format&fit=crop&q=80"
            category="Economia Circular"
            title="O que é economia circular?"
            description="Conheça o conceito que está transformando o futuro da moda."
          />
        </div>
      </main>
    </>
  )
}

export default Content