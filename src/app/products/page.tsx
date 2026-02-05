import { Suspense } from 'react'
import { ProductListContent } from '@/components/ProductList'

export const metadata = {
  title: '商品列表 - Next Keep Alive',
  description: '查看我們的貓咪商品列表',
}

export default function ProductsPage() {
  return (
    // <Suspense fallback={<div className="flex items-center justify-center h-screen">載入中...</div>}>
      <ProductListContent />
    // </Suspense>
  )
}
