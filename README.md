# Next 如何使用 Keep Alive

這是一個使用 [Next.js](https://nextjs.org) 開發的 Keep Alive demo 專案。

## 專案說明

本專案實作 Keep Alive 並應用於實際場景，使用 Next.js 框架進行開發。通過 Keep Alive 機制，在頁面導航時保持組件狀態，提升用戶體驗。

### 應用功能

項目包含兩個主要頁面：

- **商品列表頁** (`/products`): 展示商品列表
- **商品內容頁** (`/products/[id]`): 顯示單個商品詳細資訊

通過 Keep Alive 實現瀏覽器原生返回功能，從商品內容頁返回到列表頁時，列表組件保持其狀態和滾動位置，不會重新渲染，提供更流暢的瀏覽體驗。

### Keep Alive 實現

Keep Alive 機制通過特殊的路由配置和組件狀態管理，確保：

1. 列表頁組件在導航到詳細頁後保留在 DOM 中
2. 返回列表頁時，組件不會重新初始化或重新渲染
3. 滾動位置和用戶交互狀態被保持

詳細的實作流程、API 說明和最佳實踐請參考 [Keep Alive 實作指南](./spec/keep-alive.md)。

### 無 Keep Alive（列表重新渲染）
列表頁返回時會重新初始化，滾動位置歸零，組件重新渲染。

![without-keep-alive](/demo/without-keep-alive.gif)

### 有 Keep Alive（列表狀態保持）
列表頁返回時保持原有狀態，滾動位置和組件狀態完整保留。

![with-keep-alive](/demo/with-keep-alive.gif)

## 開始使用

首先，安裝相依套件：

```bash
npm install
```

然後啟動開發伺服器：

```bash
npm run dev
```

在瀏覽器中開啟 [http://localhost:3000](http://localhost:3000) 即可看到結果。

## 專案結構

```
src/
  app/
    layout.tsx                    # 主要佈局，整合 KeepAliveProvider
    page.tsx                      # 首頁
    globals.css                   # 全域樣式
    products/
      page.tsx                    # 商品列表頁
      [id]/
        page.tsx                  # 商品內容頁
  components/
    KeepAliveProvider.tsx         # Keep Alive 提供者，管理組件緩存
    CustomKeepAlive.tsx           # Keep Alive 包裝器，用於包裹需要保活的組件
    KeepAliveProductList.tsx      # 商品列表頁組件（應用 Keep Alive）
    ProductDetail.tsx             # 商品詳細組件
    Icon.tsx                      # 圖示組件
  lib/
    mock-data.ts                  # 模擬數據
  types/
    product.ts                    # 商品類型定義
spec/
  keep-alive.md                   # Keep Alive 實作流程和用法指南
```

## 開發指南

頁面檔案位於 `src/app/` 目錄下，修改後會自動重新載入。
