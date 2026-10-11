import React, { useState } from 'react'
import Header from '../../../components/Header/Header'
import { NavLink, useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import plantalogin from '../../../assets/icons/plantalogin.png'
import CustomInput from '../../../components/custominput/CustomInput'
import { useAuth } from '../../../hooks/useAuth'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !senha) {
      setError('Preencha todos os campos.')
      return
    }

    try {
      setLoading(true)

      const data = await login(email, senha)

      if (data.user.role === 'ADMIN') {
        navigate('/admin')
      } else {
        navigate('/')
      }

    } catch (error) {
      console.error(error)

      setError(
        error.data?.message ||
        'E-mail ou senha inválidos.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-screen w-full flex flex-col lg:flex-row">


        <section className="hidden lg:flex lg:w-1/2 bg-[#153D2C] text-white relative overflow-hidden">

          <div className="w-full p-11">



            <div className="mt-48">
              <h1 className="text-[25px] font-bold leading-tight">
                Bem-vindo(a) de volta!
              </h1>

              <p className="mt-4 text-[15px] leading-6 text-gray-200 max-w-[330px]">
                Entre na sua conta para continuar
                <br />
                fazendo parte dessa mudança.
              </p>
            </div>


            <img src={plantalogin} alt="Ícone" className="absolute bottom-1 left-15 w-[210px] h-55 opacity-20">

            </img>

          </div>
        </section>



        <section className="w-full lg:w-1/2 min-h-screen bg-white flex items-center justify-center">

          <div className="w-full max-w-[384px] px-6 py-10">


            <h2 className="text-[25px] font-bold text-[#123C2C] mb-7">
              Entrar
            </h2>


            <form onSubmit={handleLogin}>


              <CustomInput
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />


              <CustomInput
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                rightIcon={
                  showPassword
                    ? <FiEyeOff onClick={() => setShowPassword(false)} />
                    : <FiEye onClick={() => setShowPassword(true)} />
                }
              />


              {/* Esqueci senha */}
              <div className="flex justify-end mt-2 mb-5">

                <NavLink
                  to="/redefinir-senha"
                  className="text-[12px] text-[#155A43] hover:underline"
                >
                  Esqueceu sua senha?
                </NavLink>

              </div>


              {error && (
                <p className="text-red-600 text-xs mb-3">
                  {error}
                </p>
              )}


              <button
                type="submit"
                disabled={loading}
                className="w-full h-[40px] rounded-lg bg-[#153D2C] text-white font-bold text-sm hover:bg-[#0f3023] transition disabled:opacity-60"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>

            </form>

            <p className="text-center text-[12px] text-gray-500 mt-5">
              Não possui uma conta?{' '}

              <NavLink
                to="/register"
                className="text-[#155A43] font-medium hover:underline"
              >
                Cadastre-se
              </NavLink>
            </p>

          </div>

        </section>

      </main>
    </>
  )
}

export default Login