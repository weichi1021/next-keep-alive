'use client'

import { useEffect, useState } from 'react'
import { CustomKeepAlive } from '@/components/CustomKeepAlive'
import { mockProducts } from '@/lib/mock-data'
import { formatNumberWithCommas, formatNumberShort } from '@/lib/utils/number'
import { AppImage } from '@/components/Image'
import { Icon } from '@/components/Icon'
import { Rating } from '@/components/Rating'
import Link from 'next/link'

function ProductListContent() {
  const [scrollPosition, setScrollPosition] = useState(0)

  // Keep-Alive 生命週期效果
  useEffect(() => {
    console.log('✅ ProductList 組件已掛載')
    return () => {
      console.log('⏸️ ProductList 組件已卸載')
    }
  }, [])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop
    setScrollPosition(scrollTop)
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 shadow-lg">
      {/* Header with Debug Info */}
      <div className="bg-blue-50 border-b border-blue-200 p-2 text-xs text-blue-700">
        <div>✅ Keep-Alive 已啟用 | 滾動位置: {Math.round(scrollPosition)}px</div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white shadow-sm flex items-center space-x-2">
        <Icon name="search" size={24} className="text-gray-500" />
        <input
          type="text"
          placeholder="搜尋商品..."
          className="flex-1 p-2 text-gray-800 border-none focus:outline-none bg-transparent"
        />
      </div>

      {/* Product List */}
      <div
        className="flex-1 flex flex-col gap-1 overflow-y-auto p-4 space-y-4"
        onScroll={handleScroll}
      >
        {mockProducts.map((product) => (
          <Link href={`/products/${product.id}`} key={product.id}>
            <div className="flex bg-white rounded-lg shadow-md overflow-hidden p-4">
              <div className="w-24 h-24 flex-shrink-0 relative mr-4">
                <AppImage src={product.image} alt={product.name} size={150} rounded={8} isSquare />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-gray-900 font-semibold text-base mb-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center mb-2">
                    <Rating rating={product.rating} size={16} className="mr-1" />
                    <span className="text-gray-600 text-sm">
                      {product.rating} ({formatNumberShort(product.reviewCount)} 評論)
                    </span>
                  </div>
                </div>
                <div className="flex items-baseline justify-end">
                  <span className="text-red-500 font-bold text-lg mr-2">
                    ${formatNumberWithCommas(product.salePrice)}
                  </span>
                  <span className="text-gray-400 line-through text-sm">
                    ${formatNumberWithCommas(product.originalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Navigation Bar Placeholder */}
      <div className="flex justify-around items-center h-16 bg-white border-t border-gray-200">
        <Icon name="home" size={24} className="text-gray-500" />
        <Icon name="shopping-cart" size={24} className="text-gray-500" />
        <Icon name="heart" size={24} className="text-gray-500" />
        <Icon name="user" size={24} className="text-gray-500" />
      </div>
    </div>
  )
}

export function KeepAliveProductList() {
  return (
    <CustomKeepAlive name="ProductList">
      <ProductListContent />
    </CustomKeepAlive>
  )
}
