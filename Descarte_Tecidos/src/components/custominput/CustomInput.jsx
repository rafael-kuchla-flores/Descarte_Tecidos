import React from 'react'

const CustomInput = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  rightIcon
}) => {
  return (
    <div className="flex flex-col mb-4">

      {label && (
        <label className="mb-2 text-[12px] text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="
            w-full
            h-[42px]
            px-3
            pr-10
            border
            border-[#CBD2D9]
            rounded-lg
            text-[13px]
            text-gray-700
            placeholder:text-gray-400
            focus:outline-none
            focus:border-[#153D2C]
          "
        />

        {rightIcon && (
          <div
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-gray-400
              cursor-pointer
            "
          >
            {rightIcon}
          </div>
        )}

      </div>

    </div>
  )
}

export default CustomInput