import Link from 'next/link'

export default function Home() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">首頁</h1>
      <Link href="/products" className="text-blue-600 underline">
        前往商品列表頁面
      </Link>
    </main>
  )
}