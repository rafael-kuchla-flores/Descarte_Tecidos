import React from 'react'
import Header from '../../../components/header/Header'
import Footer from '../../../components/footer/Footer'
import { Link } from 'react-router-dom'
import Button from '../../../components/btns/Button'
import { RiMapPinLine } from 'react-icons/ri'
import heroFabrics from '../../../assets/images/hero-fabrics.jpg'


const Home = () => {
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

        </main>

        <Footer />
      </div>
    </>
  )
}

export default Home