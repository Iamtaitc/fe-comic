// src/contexts/search-modal-context.tsx
"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { SearchModal } from "@/components/common/SearchModal"

type SearchModalContextType = {
  isOpen: boolean
  openSearchModal: () => void
  closeSearchModal: () => void
}

const SearchModalContext = createContext<SearchModalContextType>({
  isOpen: false,
  openSearchModal: () => {},
  closeSearchModal: () => {},
})

export function SearchModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openSearchModal = () => setIsOpen(true)
  const closeSearchModal = () => setIsOpen(false)

  return (
    <SearchModalContext.Provider
      value={{ isOpen, openSearchModal, closeSearchModal }}
    >
      {children}
      <SearchModal open={isOpen} onOpenChange={setIsOpen} />
    </SearchModalContext.Provider>
  )
}

export const useSearchModal = () => useContext(SearchModalContext)