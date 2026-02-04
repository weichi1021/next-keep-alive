'use client'

import { useEffect, ReactNode } from 'react'
import { useKeepAlive } from './KeepAliveProvider'

interface CustomKeepAliveProps {
  name: string
  children: ReactNode
}

export function CustomKeepAlive({ name, children }: CustomKeepAliveProps) {
  const { cache, addCache, isActivating } = useKeepAlive()

  useEffect(() => {
    // When this component mounts, we add its children to the cache if not present
    if (!cache.has(name)) {
      addCache(name, children)
    }
  }, [name, children, cache, addCache])

  // The rendering is now controlled by the Provider.
  // This component's purpose is to get its children into the cache.
  // When the provider renders the page, this component will be part of the tree.
  // If the page is active and in the cache, the Provider shows the cached version
  // and the currently rendered page (the children of layout) is ignored.
  // If the page is active but not in cache, the Provider renders it via `children`
  // which causes this CustomKeepAlive to mount and cache its content.
  
  // This component itself does not need to render anything because the provider handles it.
  return null
}
