import React from 'react'
import Header from '../../../components/header/Header'
import Footer from '../../../components/footer/Footer'
import { Link } from 'react-router-dom'
import Button from '../../../components/btns/Button'
import { RiMapPinLine } from 'react-icons/ri'
import heroFabrics from '../../../assets/images/hero-fabrics.jpg'
import { RiRecycleLine } from 'react-icons/ri'
import { RiHeartFill } from 'react-icons/ri'
import { RiLeafLine } from 'react-icons/ri'
import { RiEarthLine } from 'react-icons/ri'


const Home = () => {
  const pillars = [
    {
      id: 1,
      icon: <RiRecycleLine className="text-4xl text-green-600" />,
      title: 'Reduz o impacto ambiental',
      description: 'Diminui o lixo têxtil e a poluição do planeta.',
    },
    {
      id: 2,
      icon: <RiHeartFill className="text-4xl text-red-500" />,
      title: 'Transforma vidas',
      description: 'Suas doações aquecem quem mais precisa.',
    },
    {
      id: 3,
      icon: <RiLeafLine className="text-4xl text-green-600" />,
      title: 'Fortalece a economia circular',
      description: 'Tecidos podem ser reutilizados e reciclados.',
    },
    {
      id: 4,
      icon: <RiEarthLine className="text-4xl text-blue-500" />,
      title: 'Construímos um futuro mais consciente',
      description: 'Pequenas atitudes, grandes mudanças.',
    },
  ]

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1">
          <section className="bg-[#0f382c] grid grid-cols-1 lg:grid-cols-2">

            {/* COLUNA 1 (Esquerda: Textos + Botões) */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <h1 className='text-3xl md:text-5xl font-bold text-white leading-tight'>
                Dê um novo destino para os seus tecidos.
              </h1>

              <p className='text-emerald-100 text-lg md:text-xl mt-4 mb-8'>
                Juntos por uma moda mais consciente e um planeta mais sustentável.
              </p>

              {/* Os botões entram AQUI, dentro da coluna 1 */}
              <div className="flex flex-wrap gap-4">
                <Link to="/pontos-de-coleta">
                  <Button className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-[#133e33] hover:bg-gray-100 transition">
                    <RiMapPinLine className="text-xl" />
                    <span>Encontrar pontos de coleta</span>
                  </Button>
                </Link>

                <Link to="/como-funciona">
                  <Button className="inline-flex items-center justify-center rounded-full border-2 border-white px-6 py-3 font-semibold text-white hover:bg-white/10 transition">
                    <span>Como funciona</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* COLUNA 2 (Direita: Imagem dos Tecidos) */}
            <div className="w-full h-full min-h-[300px] lg:min-h-[450px]">
              <img
                src={heroFabrics}
                alt="Amostras de tecidos coloridos"
                className="w-full h-full object-cover"
              />
            </div>
          </section>
          {/* SEÇÃO DOS 4 PILARES */}
          <section className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                {pillars.map((pillar) => (
                  <div key={pillar.id} className="flex flex-col items-center">
                    <div className="mb-4">
                      {pillar.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>


        </main>

        <Footer />
      </div>
    </>
  )
}

export default Home