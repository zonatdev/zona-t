export interface User {
  id: string
  name: string
  email: string
  password: string
  role: 'superadmin' | 'admin' | 'vendedor' | 'inventario' | 'contador'
  permissions: Permission[]
  isActive: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface Permission {
  module: string
  actions: string[]
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  reference: string
  description: string
  price: number
  cost: number
  stock: {
    warehouse: number
    store: number
    total: number
  }
  categoryId: string
  brand: string
  status: 'active' | 'inactive' | 'discontinued' | 'out_of_stock'
  createdAt: string
  updatedAt: string
}

export interface StockTransfer {
  id: string
  productId: string
  productName: string
  fromLocation: 'warehouse' | 'store'
  toLocation: 'warehouse' | 'store'
  quantity: number
  reason: string
  userId: string
  userName: string
  createdAt: string
}

export interface StockAdjustment {
  id: string
  productId: string
  productName: string
  location: 'warehouse' | 'store'
  type: 'add' | 'remove'
  quantity: number
  reason: string
  userId: string
  userName: string
  createdAt: string
}

export interface Category {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  document: string
  address: string
  city: string
  state: string
  type: 'minorista' | 'mayorista' | 'consumidor_final'
  creditLimit: number
  currentDebt: number
  status: 'active' | 'inactive'
  createdAt: string
}

export interface Sale {
  id: string
  clientId: string
  clientName: string
  total: number
  subtotal: number
  tax: number
  discount: number
  status: 'pending' | 'completed' | 'cancelled'
  paymentMethod: 'cash' | 'credit' | 'transfer' | 'warranty' | 'mixed'
  invoiceNumber?: string
  createdAt: string
  items: SaleItem[]
}

export interface SaleItem {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Payment {
  id: string
  saleId: string
  clientId: string
  clientName: string
  invoiceNumber: string
  totalAmount: number
  paidAmount: number
  pendingAmount: number
  lastPaymentAmount?: number
  lastPaymentDate?: string
  lastPaymentUser?: string
  status: 'pending' | 'partial' | 'completed' | 'overdue'
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface PaymentRecord {
  id: string
  paymentId: string
  amount: number
  paymentDate: string
  paymentMethod: 'cash' | 'transfer' | 'card'
  description?: string
  userId: string
  userName: string
  createdAt: string
}

export interface DashboardStats {
  totalSales: number
  totalInvestment: number
  totalProfit: number
  profitMargin: number
  totalProducts: number
  totalClients: number
  pendingPayments: number
  lowStockProducts: number
}
