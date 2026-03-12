import React from 'react'
import logoImage from '../../assets/Screenshot_1.png'

export default function Logo({ width = 60, height = 60 }) {
    return (
        <img
            src={logoImage}
            alt="Shiv Enterprises logo"
            className="logo"
            style={{ width: `${width}px`, height: `${height}px` }}
        />
    )
}

