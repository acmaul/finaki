import { defaultIconProps, IconProps } from '@/types/IconProps'
import React from 'react'

const XmarkIcon = (props: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...defaultIconProps} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>

  )
}

export default XmarkIcon