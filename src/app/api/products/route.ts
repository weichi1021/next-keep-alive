import { mockProducts } from '@/lib/mock-data'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    // 模擬 API 延遲
    await new Promise(resolve => setTimeout(resolve, 200))

    let filtered = mockProducts

    if (search) {
      filtered = mockProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    return NextResponse.json({
      success: true,
      data: filtered,
      total: filtered.length,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
