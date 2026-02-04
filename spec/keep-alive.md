# Next.js Keep Alive 實作流程和用法指南

## 核心概念

Keep Alive 是一種技術機制，允許組件在頁面導航時保持其狀態和生命週期，而不是被完全卸載和重新掛載。

## 專案結構

```
src/
├── components/
│   ├── KeepAliveProvider.tsx      # Keep Alive 提供者
│   ├── CustomKeepAlive.tsx        # 自訂 Keep Alive 包裝器
│   ├── KeepAliveProductList.tsx   # 商品列表頁
│   └── ...其他組件
├── app/
│   ├── layout.tsx                 # 根層級配置
│   ├── page.tsx                   # 首頁
│   └── products/                  # 商品相關頁面
└── lib/
    └── mock-data.ts               # 模擬數據
```

## 實作流程

### 1. 建立 KeepAliveProvider 上下文

[`KeepAliveProvider.tsx`](/src/components/KeepAliveProvider.tsx) 是整個系統的核心，定義了 Keep Alive 的上下文和狀態管理。

**主要功能：**
- 定義 Keep Alive 上下文接口
- 管理組件緩存
- 追蹤當前激活的 Keep Alive 組件
- 根據路由決定顯示緩存還是新組件

**實作要點：**

```typescript
interface KeepAliveContextType {
  cache: Map<string, ReactNode>
  addCache: (name: string, children: ReactNode) => void
  isActivating: (name: string) => boolean
}

const PATH_TO_KEEP_ALIVE_NAME: Record<string, string> = {
  '/products': 'ProductList',  // 將路由對應到 Keep Alive 名稱
}
```

### 2. 建立 CustomKeepAlive 包裝器

[`CustomKeepAlive.tsx`](/src/components/CustomKeepAlive.tsx) 提供一個簡單的 API，用於包裝需要 Keep Alive 的組件。

**核心職責：**
- 在組件掛載時將其加入快取
- 向 KeepAliveProvider 通知組件的狀態
- 不直接渲染，由 Provider 統一管理渲染

**使用方式：**

```typescript
export function CustomKeepAlive({ name, children }: CustomKeepAliveProps) {
  const { cache, addCache, isActivating } = useKeepAlive()

  useEffect(() => {
    if (!cache.has(name)) {
      addCache(name, children)
    }
  }, [name, children, cache, addCache])

  // 返回 null，由 Provider 負責渲染
  return null
}
```

### 3. 整合 KeepAliveProvider 到應用根層

在 [layout.tsx](/src/app/layout.tsx) 中包裹應用：

```typescript
import { KeepAliveProvider } from "@/components/KeepAliveProvider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-Tw">
      <body>
        <KeepAliveProvider>{children}</KeepAliveProvider>
      </body>
    </html>
  )
}
```

### 4. 在具體頁面使用 CustomKeepAlive

[`KeepAliveProductList.tsx`](/src/components/KeepAliveProductList.tsx) 展示如何應用 Keep Alive：

```typescript
function ProductListContent() {
  const [scrollPosition, setScrollPosition] = useState(0)

  // Keep Alive 生命週期
  useEffect(() => {
    console.log('✅ ProductList 組件已掛載')
    return () => {
      console.log('⏸️ ProductList 組件已卸載')
    }
  }, [])

  // 組件內容...
  return (
    <div className="flex flex-col h-screen">
      {/* 頁面內容 */}
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
```

## 工作流程圖

```
用戶導航
   ↓
KeepAliveProvider 檢查路由
   ↓
是否為 Keep Alive 頁面？
   ├─ 是 → 檢查快取
   │       ├─ 有快取 → 顯示快取組件
   │       └─ 無快取 → 渲染新組件 → CustomKeepAlive 添加到快取
   │
   └─ 否 → 直接顯示組件，不做快取
```

## 使用場景

### 場景 1：保持列表滾動位置

當用戶在列表頁面滾動，點擊進入詳情頁面，然後返回時：

1. 第一次訪問 `/products` → 組件掛載，狀態初始化，加入快取
2. 點擊商品進入 `/products/[id]` → ProductList 不卸載（使用 Keep Alive）
3. 返回 `/products` → ProductList 從快取恢復，保持滾動位置和狀態

### 場景 2：保持表單輸入

- 用戶在表單頁面輸入數據
- 臨時跳轉到其他頁面
- 返回表單頁面時，輸入數據保持不變

## 核心 API

### `useKeepAlive()` Hook

```typescript
const { cache, addCache, isActivating } = useKeepAlive()

// cache: Map<string, ReactNode>
//   - 存儲所有保活組件
// addCache: (name: string, children: ReactNode) => void
//   - 手動添加組件到快取
// isActivating: (name: string) => boolean
//   - 檢查指定名稱的組件是否當前激活
```

### `CustomKeepAlive` 組件

```typescript
<CustomKeepAlive name="UniqueComponentName">
  <YourComponent />
</CustomKeepAlive>

// Props:
// - name: string (必填) - 組件的唯一標識符
// - children: ReactNode (必填) - 需要保活的組件
```

## 配置管理

### 設定 Keep Alive 的路由

在 [`KeepAliveProvider.tsx`](src/components/KeepAliveProvider.tsx) 中配置：

```typescript
const PATH_TO_KEEP_ALIVE_NAME: Record<string, string> = {
  '/products': 'ProductList',
  '/settings': 'Settings',      // 添加新路由
  '/dashboard': 'Dashboard',    // 添加新路由
}
```

## 生命週期

### Keep Alive 組件的生命週期

```
掛載 (Mount)
  ↓
激活 (Activate) ← Keep Alive 激活時
  ↓
非激活 (Deactivate) ← 導航離開時
  ↓
重新激活 (Reactivate) ← 導航回來時
  ↓
卸載 (Unmount) ← 組件從快取中移除時
```

### 監聽 Keep Alive 事件

使用 `useKeepAliveEffect` Hook（來自 `react-keep-alive` 庫）：

```typescript
useKeepAliveEffect(() => {
  console.log('組件激活了')

  return () => {
    console.log('組件暫停了')
  }
})
```

## 最佳實踐

### ✅ 應該做的事

1. **為每個 Keep Alive 組件提供唯一的 name**
   ```typescript
   <CustomKeepAlive name="ProductList">
     <ProductListContent />
   </CustomKeepAlive>
   ```

2. **在路由配置中記錄所有 Keep Alive 頁面**
   ```typescript
   const PATH_TO_KEEP_ALIVE_NAME = {
     '/products': 'ProductList',
   }
   ```

3. **使用 useState 保存可變狀態**
   ```typescript
   const [scrollPosition, setScrollPosition] = useState(0)
   ```

4. **清理副作用和事件監聽**
   ```typescript
   useEffect(() => {
     const handler = () => { /* ... */ }
     window.addEventListener('scroll', handler)
     return () => window.removeEventListener('scroll', handler)
   }, [])
   ```

### ❌ 應避免的事

1. **不要在 Keep Alive 組件外使用 CustomKeepAlive**
   - 必須在 KeepAliveProvider 的子樹中

2. **不要重複使用相同的 name**
   ```typescript
   // ❌ 錯誤
   <CustomKeepAlive name="Component">
     <Component1 />
   </CustomKeepAlive>
   <CustomKeepAlive name="Component">
     <Component2 />
   </CustomKeepAlive>
   ```

3. **不要在快取中存儲大量數據**
   - 會增加內存使用

4. **不要假設在 Keep Alive 時組件會卸載**
   - useEffect cleanup 可能不會立即執行

## 調試技巧

### 觀察快取狀態

在 KeepAliveProvider 中添加日誌：

```typescript
useEffect(() => {
  console.log('當前快取:', Array.from(cache.keys()))
}, [cache])
```

### 追蹤組件生命週期

```typescript
useEffect(() => {
  console.log('✅ 組件掛載')
  return () => console.log('❌ 組件卸載')
}, [])

useKeepAliveEffect(() => {
  console.log('🎯 Keep Alive 激活')
  return () => console.log('⏸️ Keep Alive 暫停')
})
```

## 性能考慮

1. **快取大小管理**
   - 考慮設置最大快取數量
   - 定期清理不使用的快取

2. **內存使用**
   - 監控大型組件的快取

3. **初始加載時間**
   - Keep Alive 可能增加初始 HTML 大小

## 常見問題

**Q: 為什麼返回時組件狀態未保持？**
A: 確保：
- 組件被 `CustomKeepAlive` 包裹
- name 配置在 `PATH_TO_KEEP_ALIVE_NAME` 中
- 組件內使用 `useState` 而非全局變量

**Q: 如何手動清除快取？**
A: 在 KeepAliveProvider 中添加方法：
```typescript
const clearCache = () => setCache(new Map())
```

**Q: Keep Alive 對 SEO 有影響嗎？**
A: 否，Keep Alive 是客戶端功能，不影響 SSR 渲染。

## 總結

Keep Alive 通過以下機制工作：

1. ✅ **Provider 管理** - KeepAliveProvider 監聽路由變化
2. ✅ **組件緩存** - CustomKeepAlive 將組件添加到快取
3. ✅ **智能渲染** - Provider 根據路由決定顯示緩存或新組件
4. ✅ **狀態保持** - 組件保持其 React 狀態和 DOM

這提供了與原生應用相似的流暢導航體驗。
