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








  return (
    <>
      <Header />
    </>
  )
}

export default Register