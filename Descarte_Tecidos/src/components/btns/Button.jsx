import React from 'react'

const Button = ({ children, className, onClick, type = "button" }) => {
  return (
    <button 
      type={type}
      onClick={onClick}
      className={`m-1 rounded-3xl border px-4 py-2 text-sm transition-colors sm:px-5 sm:text-base ${className || ''}`}
    >
      {children}
    </button>
  )
}

export default Button