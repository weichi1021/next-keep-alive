'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

// utils
import { mockProducts } from '@/lib/mock-data'
import { formatNumberWithCommas, formatNumberShort } from '@/lib/utils/number'

// components
import { AppImage } from '@/components/Image'
import { Icon } from '@/components/Icon'
import { Rating } from '@/components/Rating'



export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = React.use(params)
  const product = mockProducts.find(p => p.id.toString() === id)

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-lg">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white shadow-sm z-10">
        <button onClick={() => router.back()} className="p-0 bg-none border-none">
          <Icon name="chevron-left" size={24} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold">商品詳情</h1>
        <Icon name="shopping-cart" size={24} className="text-gray-700" />
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4">
        {/* Product Image */}
        <div className="mb-4">
          <div className="relative w-full aspect-square">
            <AppImage src={product.image} alt={product.name} isSquare size={500} rounded={12} />
          </div>
        </div>

        {/* Product Info */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mt-1">{product.name}</h2>
          <div className="flex items-center mt-2">
            <Rating rating={product.rating} size={16} className="mr-2" />
            <span className="text-sm text-gray-600">{product.rating} ({formatNumberShort(product.reviewCount)} 評論)</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex justify-end items-baseline mb-4">
          <span className="text-3xl font-bold text-red-600">${formatNumberWithCommas(product.salePrice)}</span>
          <span className="ml-2 text-gray-400 line-through">${formatNumberWithCommas(product.originalPrice)}</span>
        </div>

        {/* Product Description */}
        <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">商品恰恰</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
        </div>

        <div className="flex justify-between items-start">
            {/* Color/Style */}
            <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-2">顏色/款式</h3>
                <div className="flex space-x-2">
                    <div className="w-8 h-8 rounded-full bg-black border-2 border-blue-500 cursor-pointer"></div>
                    <div className="w-8 h-8 rounded-full bg-white border-2 cursor-pointer"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-300 border-2 cursor-pointer"></div>
                    <div className="w-8 h-8 rounded-full bg-blue-900 border-2 cursor-pointer"></div>
                </div>
            </div>

            {/* Quantity */}
            <div className="flex-1 items-center">
                <h3 className="font-semibold text-gray-800 mb-2">數量</h3>
                <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                    <button className="px-4 py-2 text-lg text-gray-600">-</button>
                    <span className="px-4 py-2 text-lg font-semibold">1</span>
                    <button className="px-4 py-2 text-lg text-gray-600">+</button>
                </div>
            </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-between p-4 bg-white border-t border-gray-200">
        <button className="flex-1 bg-red-500 text-white font-bold py-3 px-6 rounded-lg mr-4">
          加入購物車
        </button>
        <button className="flex items-center text-gray-600">
          <Icon name="heart" size={24} className="mr-2" />
          加入收藏
        </button>
      </footer>
    </div>
  )
}