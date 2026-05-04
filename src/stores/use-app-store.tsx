import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Product } from '@/types/index'

interface AppState {
  isAdmin: boolean
  login: () => void
  logout: () => void
  products: Product[]
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
}

const AppContext = createContext<AppState | null>(null)

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Anel Solitário',
    price: 250,
    description: 'Lindo anel solitário em prata de lei.',
    category: 'Anéis',
    material: 'Prata 925',
    stock: 15,
  },
  {
    id: '2',
    name: 'Brinco Pérola',
    price: 120,
    description: 'Brinco clássico de pérola de água doce.',
    category: 'Brincos',
    material: 'Pérola',
    stock: 8,
  },
  {
    id: '3',
    name: 'Colar Ouro',
    price: 1500,
    description: 'Colar elegante com pingente.',
    category: 'Colares',
    material: 'Ouro 18k',
    stock: 3,
  },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [products, setProducts] = useState<Product[]>(initialProducts)

  const login = () => setIsAdmin(true)
  const logout = () => setIsAdmin(false)

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Math.random().toString(36).substr(2, 9) }
    setProducts((prev) => [newProduct, ...prev])
  }

  const updateProduct = (id: string, product: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...product } : p)))
  }

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return React.createElement(
    AppContext.Provider,
    {
      value: {
        isAdmin,
        login,
        logout,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
      },
    },
    children,
  )
}

export default function useAppStore() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider')
  }
  return context
}
