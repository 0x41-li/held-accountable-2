import { Icon } from '@iconify/react'
import React from 'react'

export default function Label({
  text,
  icon,
  className,
  onClick
}) {
  return (
    <div className={`flex items-center rounded-full px-2.5 py-1 text-white gap-1 ${className}`} onClick={onClick}>
      {icon && (
        <Icon icon={icon} width={16} height={16}/>
      )}
      <p className='font-medium text-[12px]'>{text}</p>
    </div>
  )
}
