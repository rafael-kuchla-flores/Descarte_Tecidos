import React from 'react'
import { NavLink } from 'react-router-dom'
import Header from '../../../components/Header/Header'
import imgresetpassword from '../../../assets/images/imgreset.jpg'
import Footer from '../../../components/footer/Footer'

const PasswordReset = () => {
  return (
    <>
      <Header />

      <main className="min-h-[calc(100vh-70px)] flex items-center justify-center px-6 py-10 bg-white">

        <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">

          <section className="w-full md:w-1/2 flex flex-col items-center md:items-start">

            <div className="w-full max-w-md">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Esqueceu sua senha?
              </h1>

              <p className="text-gray-700 text-base leading-relaxed mb-6">
                Informe seu e-mail e enviaremos
                <br className="hidden md:block" />
                um link para você redefinir sua senha.
              </p>

              <img
                src={imgresetpassword}
                alt="Ilustração de recuperação de senha"
                className="w-full max-w-sm mx-auto md:mx-0 object-contain"
              />
            </div>

          </section>


          <section className="w-full md:w-1/2 flex justify-center">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg px-8 py-10">

              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Recuperar senha
              </h2>

              <form className="flex flex-col">

                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-800 mb-2"
                >
                  E-mail
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="
                    w-full
                    border border-gray-300
                    rounded-md
                    px-4 py-3
                    text-sm
                    outline-none
                    focus:border-green-700
                    focus:ring-1
                    focus:ring-green-700
                    transition
                  "
                />

                <button
                  type="submit"
                  className="
                    w-full
                    mt-5
                    bg-green-700
                    hover:bg-green-800
                    text-white
                    font-medium
                    rounded-md
                    py-3
                    transition
                    cursor-pointer
                  "
                >
                  Enviar link de recuperação
                </button>

              </form>

              <div className="mt-16 text-center text-sm text-gray-600">

                <span>
                  Lembrou sua senha?{' '}
                </span>

                <NavLink
                  to="/login"
                  className="text-green-700 font-medium hover:underline"
                >
                  Voltar para o login
                </NavLink>

              </div>

            </div>

          </section>

        </div>

      </main>
      <Footer />
    </>
  )
}

export default PasswordReset