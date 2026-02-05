
# Next.js 商品列表 SSR + 快取 + 狀態保留 Demo

這是一個使用 [Next.js](https://nextjs.org) 開發的商品列表快取與狀態保留 demo 專案。



## 專案說明

本專案展示如何在 Next.js 中，利用 **React Query 快取** + **sessionStorage 滾動位置保存**，實現商品列表 SSR、快取與狀態保留。

如需完整技術細節、流程與範例程式碼，請參考：

- [React Query + SSR 實現總結](spec/REACT_QUERY_IMPLEMENTATION.md)

---

### 架構重點簡述

- 商品列表頁 SSR，SEO 友善
- React Query 快取，返回不重抓 API
- sessionStorage 保存滾動位置，返回自動恢復
- 搜尋條件寫入 URL，狀態可還原
- API 路由支援搜尋與詳情

### 為什麼不用 react-keep-alive？

react-keep-alive 會在記憶體中保留所有已訪問的組件實例，容易導致：
- ❌ 記憶體洩漏
- ❌ 性能下降
- ❌ 不適合生產環境

### 更優的方案：React Query + sessionStorage

- ✅ **React Query 快取**：自動快取 API 資料，1 分鐘內無需重新請求
- ✅ **sessionStorage**：輕量級儲存滾動位置，頁面重整時自動清空
- ✅ **記憶體安全**：React Query 自動清理過期資料
- ✅ **SEO 友善**：Next.js SSR 完全支援

### 應用功能

項目包含兩個主要頁面：

- **商品列表頁** (`/products`): 展示商品列表
- **商品內容頁** (`/products/[id]`): 顯示單個商品詳細資訊


通過 React Query 快取與 sessionStorage 滾動位置保存，實現瀏覽器原生返回功能：從商品內容頁返回列表時，列表資料不重抓、滾動位置自動恢復，提供流暢的瀏覽體驗。


### 實現方式

1. **React Query**：商品列表資料快取 1 分鐘，返回時不重抓 API。
2. **sessionStorage**：進入詳情頁時記錄滾動位置，返回列表自動恢復，重新整理則歸零。
3. **Next.js SSR**：商品列表支援伺服器端渲染，SEO 友善。


### 效果對比

- **無快取/狀態保留**：返回列表會重新初始化，滾動位置歸零。
  ![without-keep-alive](/demo/without-keep-alive.gif)
- **有快取/狀態保留**：返回列表自動恢復滾動與資料。
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
    api/
      products/
        route.ts            # GET /api/products (支援搜尋)
        [id]/
          route.ts          # GET /api/products/[id] (詳情)
    products/
      page.tsx              # 商品列表頁（SSR + React Query 快取 + 滾動恢復）
      [id]/
        page.tsx            # 商品內容頁
    layout.tsx              # 主要佈局，整合 ReactQueryProvider
    globals.css             # 全域樣式
  components/
    ReactQueryProvider.tsx  # React Query 全域 Provider
    ProductList.tsx         # 商品列表組件（useQuery + sessionStorage）
    Icon.tsx                # 圖示組件
    Image.tsx               # 圖片組件
    Rating.tsx              # 評分組件
  lib/
    mock-data.ts            # 模擬數據
    utils/
      image.ts              # 圖片工具
      number.ts             # 數字工具
  types/
    product.ts              # 商品類型定義
spec/
  REACT_QUERY_IMPLEMENTATION.md # React Query + SSR 詳細解說
```


## 開發指南

1. 頁面檔案位於 `src/app/` 目錄下，修改後會自動重新載入。
2. 商品列表頁（`/products`）已整合 SSR、React Query 快取、滾動狀態保存。
3. 詳情頁返回時自動恢復列表滾動與快取資料。
