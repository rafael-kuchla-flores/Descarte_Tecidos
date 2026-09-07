import React, { useState } from 'react'
import Header from '../../../components/Header/Header'
import { NavLink, useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import plantalogin from '../../../assets/icons/plantalogin.png'
import CustomInput from '../../../components/custominput/CustomInput'
import authService from '../../../services/authService'
import { RiRecycleFill } from 'react-icons/ri'
const Register = () => {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')


  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!name || !email || !senha || !confirmarSenha) {
      setError('Por favor, preencha todos os campos.')
      return
    }

    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem')
      return
    }

    if (senha.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.')
      return
    }

    try {
      setLoading(true)

      await authService.register({
        name,
        email,
        password: senha,
      })
      setSuccess('Conta criada com sucesso! Redirecionando para o login...')

      setTimeout(() => {
        navigate('/login')
      }, 2000)

    } catch (err) {
      console.error(err)
      setError(
        err.data?.message ||
        'Ocorreu um erro ao criar a conta. Tente novamente.'
      )
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <Header />
    </>
  )
}

export default Register