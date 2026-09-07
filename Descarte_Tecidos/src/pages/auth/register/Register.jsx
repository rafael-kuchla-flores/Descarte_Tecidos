import React, { useState } from 'react'
import Header from '../../../components/header/Header'
import { NavLink, useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import plantalogin from '../../../assets/icons/plantalogin.png'
import CustomInput from '../../../components/custominput/CustomInput'
import authService from '../../../services/authService'
import { RiRecycleFill } from 'react-icons/ri'

const Register = () => {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [telefone, setTelefone] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!name || !email || !cpf || !telefone || !senha || !confirmarSenha) {
      setError('Por favor, preencha todos os campos.')
      return
    }

    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem.')
      return
    }

    if (senha.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.')
      return
    }

    // Limpa pontuações do CPF e garante formato internacional no telefone
    const cleanCpf = cpf.replace(/\D/g, '')
    const cleanPhone = telefone.startsWith('+') ? telefone : `+55${telefone.replace(/\D/g, '')}`

    try {
      setLoading(true)

      await authService.register({
        name,
        email,
        password: senha,
        phone: cleanPhone,
        document: cleanCpf,
      })

      setSuccess('Conta criada com sucesso! Redirecionando para o login...')

      setTimeout(() => {
        navigate('/login')
      }, 2000)

    } catch (err) {
      console.error(err)
      setError(
        err.data?.message ||
        'Ocorreu um erro ao criar a conta. Verifique os dados e tente novamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-screen w-full flex flex-col lg:flex-row">

        {/* COLUNA ESQUERDA (Banner Verde) */}
        <section className="hidden lg:flex lg:w-1/2 bg-[#153D2C] text-white relative overflow-hidden flex-col justify-between p-12">

          {/* Logo no topo da coluna */}
          <div className="flex items-center gap-2">
            <RiRecycleFill className="h-8 w-8 text-white" />
            <span className="font-bold text-lg leading-tight">
              Tecidos<br />Conscientes
            </span>
          </div>

          {/* Textos Centrais */}
          <div className="my-auto max-w-sm">
            <h1 className="text-3xl font-bold leading-tight mb-4">
              Crie sua conta
            </h1>
            <p className="text-gray-200 text-base leading-relaxed">
              Junte-se a uma rede de pessoas que acredita em um futuro mais sustentável.
            </p>
          </div>

          {/* Ícone de fundo / marca d'água */}
          <img
            src={plantalogin}
            alt="Ícone de fundo"
            className="absolute bottom-4 left-6 w-48 opacity-10 pointer-events-none"
          />
        </section>

        {/* COLUNA DIREITA (Formulário Branco) */}
        <section className="w-full lg:w-1/2 min-h-screen bg-white flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-[400px]">

            <h2 className="text-2xl font-bold text-[#123C2C] mb-8">
              Cadastrar
            </h2>

            <form onSubmit={handleRegister} className="flex flex-col gap-4">

              <CustomInput
                label="Nome"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <CustomInput
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <CustomInput
                label="CPF"
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />

              <CustomInput
                label="Telefone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />

              <CustomInput
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo de 6 caracteres"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                rightIcon={
                  showPassword
                    ? <FiEyeOff className="cursor-pointer" onClick={() => setShowPassword(false)} />
                    : <FiEye className="cursor-pointer" onClick={() => setShowPassword(true)} />
                }
              />

              <CustomInput
                label="Confirmar senha"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Repita sua senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                rightIcon={
                  showConfirmPassword
                    ? <FiEyeOff className="cursor-pointer" onClick={() => setShowConfirmPassword(false)} />
                    : <FiEye className="cursor-pointer" onClick={() => setShowConfirmPassword(true)} />
                }
              />

              {/* Mensagens de Feedback */}
              {error && (
                <p className="text-red-600 text-xs font-medium">{error}</p>
              )}
              {success && (
                <p className="text-green-600 text-xs font-medium">{success}</p>
              )}

              {/* Botão de Criação de Conta */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-lg bg-[#153D2C] text-white font-bold text-sm hover:bg-[#0f3023] transition disabled:opacity-60 mt-2 shadow-sm cursor-pointer"
              >
                {loading ? 'Criando conta...' : 'Criar conta'}
              </button>
            </form>

            {/* Link para quem já possui conta */}
            <p className="text-center text-xs text-gray-500 mt-6">
              Já possui uma conta?{' '}
              <NavLink
                to="/login"
                className="text-[#155A43] font-bold hover:underline"
              >
                Entrar
              </NavLink>
            </p>

          </div>
        </section>

      </main>
    </>
  )
}

export default Register