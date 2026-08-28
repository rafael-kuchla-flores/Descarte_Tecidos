import React from 'react'

const Button = ({ props, className }) => {
  return (
    <>
      <button className={`
    m-1
    rounded-3xl
    border
    px-4
    py-2
    text-sm
    transition-colors
    sm:px-5
    sm:text-base
    ${className || ''}
  `}>{props}</button>
    </>
  )
}

export default Button