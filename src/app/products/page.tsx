'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { formatNumberWithCommas, formatNumberShort } from '@/lib/utils/number'
import { AppImage } from '@/components/Image'
import { Icon } from '@/components/Icon'
import { Rating } from '@/components/Rating'
import { Product } from '@/types/product'

interface ProductsResponse {
  success: boolean
  data: Product[]
  total: number
}

// 查詢函式
async function fetchProducts(search: string = '') {
  const params = new URLSearchParams()
  if (search) params.append('search', search)

  const res = await fetch(`/api/products?${params}`)
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json() as Promise<ProductsResponse>
}

export default function ProductListContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // 從 URL 讀取搜尋參數
  const initialSearch = searchParams.get('search') || ''
  const [search, setSearch] = useState(initialSearch)
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch)

  // React Query 快取查詢 - 遵循範例模式
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['products', debouncedSearch],
    queryFn: () => fetchProducts(debouncedSearch),
    staleTime: 1000 * 60, // 1 分鐘內不重新抓資料
  })

  const products = data?.data || []

  // 搜尋防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      // 更新 URL 搜尋參數
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      router.push(`/products?${params}`, { scroll: false })
    }, 500)

    return () => clearTimeout(timer)
  }, [search, router])

  // 資料載入完成後恢復滾動位置（僅限於返回操作）
  useEffect(() => {
    if (!isLoading && products.length > 0 && scrollContainerRef.current) {
      // 延遲恢復，確保 DOM 已更新
      const timer = setTimeout(() => {
        if (scrollContainerRef.current) {
          // 檢查是否是返回操作（而非重新整理）
          const isNavigatingBack = sessionStorage.getItem('isProductListNavigatingBack')
          const savedScroll = sessionStorage.getItem('productListScroll')

          if (isNavigatingBack === 'true' && savedScroll) {
            scrollContainerRef.current.scrollTop = parseInt(savedScroll, 10)
            console.log('恢復滾動位置:', savedScroll)
          }

          // 清除標記和位置
          sessionStorage.removeItem('isProductListNavigatingBack')
          sessionStorage.removeItem('productListScroll')
        }
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isLoading, products.length])

  const [scrollTop, setScrollTop] = useState(0)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // 即時更新滾動位置到 sessionStorage
    const scrollTop = e.currentTarget.scrollTop
    setScrollTop(scrollTop)
    sessionStorage.setItem('productListScroll', scrollTop.toString())
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 shadow-lg">
      {/* Header with Debug Info */}
      <div className="bg-blue-50 border-b border-blue-200 p-2 text-xs text-blue-700">
        <div className="flex justify-between items-center">
          <span>滾軸位置: {scrollTop}</span>
          <span>商品: {products.length}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white shadow-sm flex items-center space-x-2">
        <Icon name="search" size={24} className="text-gray-500" />
        <input
          type="text"
          placeholder="搜尋商品..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 text-gray-800 border-none focus:outline-none bg-transparent"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Product List */}
      <div
        ref={scrollContainerRef}
        className="flex-1 flex flex-col gap-1 overflow-y-auto p-4 space-y-4"
        onScroll={handleScroll}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-300 border-t-blue-600 rounded-full mx-auto mb-2"></div>
              <p className="text-gray-500">載入商品中...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">載入失敗，請重新嘗試</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">
              {search ? `找不到「${search}」相關商品` : '暫無商品'}
            </p>
          </div>
        ) : (
          products.map((product: Product) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
            >
              <div className="flex bg-white rounded-lg shadow-md overflow-hidden p-4 hover:shadow-lg transition-shadow">
                <div className="w-24 h-24 flex-shrink-0 relative mr-4">
                  <AppImage
                    src={product.image}
                    alt={product.name}
                    size={150}
                    rounded={8}
                    isSquare
                  />
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
          ))
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="flex justify-around items-center h-16 bg-white border-t border-gray-200">
        <Icon name="home" size={24} className="text-gray-500" />
        <Icon name="shopping-cart" size={24} className="text-gray-500" />
        <Icon name="heart" size={24} className="text-gray-500" />
        <Icon name="user" size={24} className="text-gray-500" />
      </div>
    </div>
  )
}
