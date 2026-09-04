import React, { useState } from 'react'
import { FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi'

import CustomInput from '../../../components/custominput/CustomInput'
import Button from '../../../components/btns/Button'
import Header from '../../../components/Header/Header'
import Footer from '../../../components/footer/Footer'

const NewPassword = () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const hasMinLength = password.length >= 8
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumber = /\d/.test(password)

    const passwordsMatch =
        password.length > 0 &&
        confirmPassword.length > 0 &&
        password === confirmPassword

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!hasMinLength || !hasUppercase || !hasNumber) {
            return
        }

        if (!passwordsMatch) {
            return
        }

        console.log('Nova senha:', password)

    }

    return (

        <>
        <Header />
            <div className="min-h-screen bg-white flex items-center justify-center px-4">

                <div className="relative w-full max-w-[315px]">

                    
                    <div
                        className="
          absolute
          left-1/2
          -translate-x-1/2
          -top-[28px]
          z-10
          w-[58px]
          h-[58px]
          rounded-full
          bg-[#3B9B50]
          flex
          items-center
          justify-center
          "
                    >
                        <FiLock
                            size={27}
                            className="text-white"
                            strokeWidth={2}
                        />
                    </div>

                    {/* Card */}
                    <div
                        className="
          w-full
          bg-white
          border
          border-gray-100
          rounded-xl
          shadow-[0_2px_12px_rgba(0,0,0,0.08)]
          px-6
          pt-9
          pb-6
          "
                    >

                        {/* Título */}
                        <h1 className="text-center text-[18px] font-semibold text-gray-900">
                            Definir nova senha
                        </h1>

                        <p className="text-center text-[11px] text-gray-500 mt-2 mb-5">
                            Informe sua nova senha abaixo.
                        </p>

                        <form onSubmit={handleSubmit}>

                            {/* Nova senha */}
                            <CustomInput
                                label="Nova senha"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                rightIcon={
                                    showPassword
                                        ? <FiEyeOff size={15} />
                                        : <FiEye size={15} />
                                }
                            />

                            {/* Confirmar senha */}
                            <CustomInput
                                label="Confirmar nova senha"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                rightIcon={
                                    showConfirmPassword
                                        ? <FiEyeOff size={15} />
                                        : <FiEye size={15} />
                                }
                            />

                            {/* Regras da senha */}
                            <div className="mt-[-2px] mb-4">

                                <p className="text-[10px] text-gray-700 mb-2">
                                    Sua senha deve conter:
                                </p>

                                <div className="flex items-center gap-2 mb-1">
                                    <FiCheck
                                        size={11}
                                        className={
                                            hasMinLength
                                                ? 'text-[#3B9B50]'
                                                : 'text-gray-400'
                                        }
                                    />

                                    <span className="text-[10px] text-gray-500">
                                        Mínimo de 8 caracteres
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 mb-1">
                                    <FiCheck
                                        size={11}
                                        className={
                                            hasUppercase
                                                ? 'text-[#3B9B50]'
                                                : 'text-gray-400'
                                        }
                                    />

                                    <span className="text-[10px] text-gray-500">
                                        Pelo menos uma letra maiúscula
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <FiCheck
                                        size={11}
                                        className={
                                            hasNumber
                                                ? 'text-[#3B9B50]'
                                                : 'text-gray-400'
                                        }
                                    />

                                    <span className="text-[10px] text-gray-500">
                                        Pelo menos um número
                                    </span>
                                </div>

                            </div>

                            {/* Botão */}
                            <Button
                                type="submit"
                                className="
              !m-0
              w-full
              h-[38px]
              !rounded-md
              border-0
              bg-[#3B9B50]
              text-white
              text-[13px]
              font-semibold
              hover:bg-[#328544]
              "
                            >
                                Redefinir senha
                            </Button>

                        </form>

                    </div>
                </div>

            </div>
            <Footer/>
        </>
    )
}

export default NewPassword