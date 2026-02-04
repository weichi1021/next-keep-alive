'use client'

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react'
import { usePathname } from 'next/navigation'

interface KeepAliveContextType {
  cache: Map<string, ReactNode>
  addCache: (name: string, children: ReactNode) => void
  isActivating: (name: string) => boolean
}

const KeepAliveContext = createContext<KeepAliveContextType>({
  cache: new Map(),
  addCache: () => {},
  isActivating: () => false,
})

export const useKeepAlive = () => useContext(KeepAliveContext)

// This maps route paths to the 'name' of the component to keep alive
const PATH_TO_KEEP_ALIVE_NAME: Record<string, string> = {
  '/products': 'ProductList',
}

export function KeepAliveProvider({ children }: { children: ReactNode }) {
  const [cache, setCache] = useState(new Map<string, ReactNode>())
  const pathname = usePathname()

  const activeKeepAliveName = PATH_TO_KEEP_ALIVE_NAME[pathname]

  const addCache = (name: string, children: ReactNode) => {
    if (!cache.has(name)) {
      setCache(prev => {
        const newCache = new Map(prev)
        newCache.set(name, children)
        return newCache
      })
    }
  }

  const isActivating = (name: string) => name === activeKeepAliveName

  const contextValue = useMemo(() => ({ cache, addCache, isActivating }), [cache, isActivating])

  return (
    <KeepAliveContext.Provider value={contextValue}>
      {/* Render the current page if it's NOT a keep-alive page */}
      {!activeKeepAliveName && children}

      {/* Render all cached components */}
      {Array.from(cache.entries()).map(([name, cachedChildren]) => (
        <div key={name} style={{ display: isActivating(name) ? 'block' : 'none' }}>
          {cachedChildren}
        </div>
      ))}

      {/* If the active page is a keep-alive page but is not cached yet, render it to cache it */}
      {activeKeepAliveName && !cache.has(activeKeepAliveName) && children}
    </KeepAliveContext.Provider>
  )
}
