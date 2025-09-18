import { Icon } from '@iconify/react'
import React from 'react'

export default function Btn({
  icon,
  title,
  onClick,
  className
}) {
  return (
    <button className={`${className} rounded-md py-2 px-3 flex items-center gap-2 text-nowrap`} onClick={onClick}>
      {icon && (
        <Icon icon={icon} width={20} height={20}/>
      )}
      {title}
    </button>
  )
}
