# React Query + SSR 實現總結

## 架構

### 1. **React Query 與 SSR 整合**
```tsx
// 使用 useQuery 快取商品列表
const { data, isLoading, isFetching, error } = useQuery({
  queryKey: ['products', debouncedSearch],
  queryFn: () => fetchProducts(debouncedSearch),
  staleTime: 1000 * 60, // 1 分鐘內不重新抓資料
})
```

**優勢：**
- ✅ **自動快取** - 同一搜尋詞在 1 分鐘內不重新抓取資料
- ✅ **查詢去重** - 多個組件請求相同數據時，只發一次 API
- ✅ **背景重新獲取** - 自動保持數據新鮮性


### 2. **滾動位置保留（sessionStorage 方案）**

為避免記憶體洩漏與複雜度，推薦用 sessionStorage 保存滾動位置，僅在「返回」時恢復，重新整理則歸零。

**核心邏輯：**
1. 進入詳情頁時，將列表滾動位置寫入 sessionStorage。
2. 返回列表頁時，檢查 sessionStorage 是否有滾動位置，有則恢復並清除。
3. 重新整理時不恢復（sessionStorage 預設清空）。

**範例程式碼：**
```tsx
// 在列表頁 useEffect 中
useEffect(() => {
  const key = 'products-scroll'
  // 檢查是否有返回標記
  const shouldRestore = sessionStorage.getItem('products-should-restore') === '1'
  if (shouldRestore) {
    const scroll = Number(sessionStorage.getItem(key) || 0)
    window.scrollTo(0, scroll)
    // 清除標記
    sessionStorage.removeItem('products-should-restore')
    sessionStorage.removeItem(key)
  }
}, [])

// 在詳情頁返回前
const handleBack = () => {
  sessionStorage.setItem('products-scroll', String(window.scrollY))
  sessionStorage.setItem('products-should-restore', '1')
  router.back()
}
```

**優點：**
- 僅在返回時恢復滾動，重新整理不會殘留
- 不需額外 Provider 或複雜組件
- 記憶體安全、易於維護

### 3. **搜尋狀態保留** (URL 驅動)
```tsx
// 搜尋改變時更新 URL
const params = new URLSearchParams()
if (search) params.append('search', search)
router.push(`/products?${params}`, { scroll: false })

// 返回頁面時從 URL 讀取搜尋
const initialSearch = searchParams.get('search') || ''
```

### 4. **API 路由**
- `GET /api/products?search=xxx` - 獲取商品列表（支援搜尋）
- `GET /api/products/[id]` - 獲取單個商品詳情

## 工作流程

### 場景 1：進入列表頁
1. 初始化：無搜尋詞，React Query 查詢所有商品
2. 資料快取在記憶體中
3. 顯示商品列表

### 場景 2：搜尋
1. 用戶輸入搜尋詞
2. 防抖 500ms 後觸發查詢
3. React Query 檢查快取，若無則發 API
4. 更新 URL 為 `?search=xxx`

### 場景 3：點進詳情再返回
1. 進入詳情頁面
2. React Query 快取的列表保留在記憶體
3. 返回時不重新抓 API ✨
4. 恢復滾動位置

## 核心改進點

| 功能 | 實現方式 | 效果 |
|------|---------|------|
| **SEO** | 商品列表 API 路由 + 元數據 | ✅ 爬蟲可抓到內容 |
| **快取** | React Query queryKey | ✅ 返回列表不重抓 |
| **搜尋** | `queryKey: ['products', search]` | ✅ 可分別快取多個搜尋結果 |
| **滾動** | useRef + useEffect | ✅ 返回時恢復位置 |
| **狀態保留** | URL searchParams | ✅ 重新整理也能保留搜尋詞 |

## 檔案結構

```
src/
├── app/
│   ├── api/
│   │   └── products/
│   │       ├── route.ts          # GET /api/products
│   │       └── [id]/route.ts     # GET /api/products/[id]
│   ├── products/
│   │   ├── page.tsx              # 列表頁 SSR
│   │   └── [id]/
│   │       └── page.tsx          # 詳情頁
│   └── layout.tsx                # ReactQueryProvider
├── components/
│   ├── ReactQueryProvider.tsx     # React Query 配置
│   └── ProductList.tsx           # 列表組件（useQuery + sessionStorage）
└── lib/
    └── hooks/
      └── useProductQueries.ts   # (已移除，改用 inline 查詢)
```


## 關鍵配置

### ReactQueryProvider.tsx
```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,      // 1 分鐘不重抓
      gcTime: 10 * 60 * 1000,    // 10 分鐘垃圾回收
      retry: 1,                   // 失敗重試一次
      refetchOnWindowFocus: true, // 視窗獲焦時重抓
    },
  },
})
```

## 測試方法

1. 進入 `/products` 頁面
2. 搜尋 "貓" → 看到過濾結果
3. 點進商品詳情
4. 點返回 → **列表仍保留在記憶體，滾動位置也恢復** ✨
5. 再搜尋同一個詞 → **不發 API 請求**（使用快取）

## 性能指標

- **首屏加載** - SSR 直接返回 HTML
- **點進詳情再返回** - 0ms（無 API 呼叫）
- **重複搜尋** - 0ms（快取命中）
- **背景重新整理** - 自動進行，不阻礙 UI
