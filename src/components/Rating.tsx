import React from 'react'
import { Icon } from './Icon'

interface RatingProps {
  rating: number
  totalStars?: number
  size?: number
  className?: string
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  totalStars = 5,
  size = 16,
  className = '',
}) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <Icon key={`full-${i}`} name="star" size={size} className="text-yellow-400" />
      ))}
      {hasHalfStar && (
        <div style={{ position: 'relative', width: size, height: size, overflow: 'hidden' }}>
          <Icon name="star" size={size} className="text-yellow-400 absolute left-0 top-0" />
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: '50%',
            height: '100%',
            overflow: 'hidden'
          }}>
            <Icon name="star" size={size} className="text-gray-300 absolute left-[-100%] top-0" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Icon key={`empty-${i}`} name="star" size={size} className="text-gray-300" />
      ))}
    </div>
  )
}
