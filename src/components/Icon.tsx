import React from 'react'

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string
  size?: number
}

const icons: Record<string, (props: React.SVGProps<SVGSVGElement> & { size?: number }) => React.ReactNode> = {
  heart: (props) => (
    <svg aria-label="讚" xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} fill="currentColor" viewBox="0 0 256 256" {...props}><path d="M178,40c-20.65,0-38.73,8.88-50,23.89C116.73,48.88,98.65,40,78,40a62.07,62.07,0,0,0-62,62c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,228.66,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.8C109.74,204.16,32,155.69,32,102A46.06,46.06,0,0,1,78,56c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,155.61,146.24,204.15,128,214.8Z"></path></svg>
  ),
  search: (props) => (
    <svg aria-label="搜尋" xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  ),
  star: (props) => (
    <svg aria-label="星星" xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} {...props}>
      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
    </svg>
  ),
  home: (props) => (
    <svg aria-label="首頁" xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  'shopping-cart': (props) => (
    <svg aria-label="購物車" xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="8" cy="21" r="1"/>
      <circle cx="19" cy="21" r="1"/>
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
    </svg>
  ),
  user: (props) => (
    <svg aria-label="使用者" xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  'chevron-left': (props) => (
    <svg aria-label="返回" xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m15 18-6-6 6-6"/>
    </svg>
  )
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, ...props }) => {
  const IconComponent = icons[name]
  if (!IconComponent) return null
  return IconComponent({ size, ...props })
}
