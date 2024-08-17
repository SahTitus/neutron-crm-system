import React from 'react'

export const Button = ({ type, className, ariaLabel, label, onClick, disabled }) => {
    return (
        <button
            type={type}
            aria-label={ariaLabel}
            className={className}
            disabled={disabled}
            onClick={onClick}
        >
            {label}
        </button>
    )
}
