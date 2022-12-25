import { defaultIconProps, IconProps } from '@/types/IconProps'
import React from 'react'

const ChevronIcon = (props: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...defaultIconProps} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>

  )
}

export default ChevronIcon