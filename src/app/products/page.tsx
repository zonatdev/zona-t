'use client'

import { useState } from 'react'
import { ProductTable } from '@/components/products/product-table'
import { ProductModal } from '@/components/products/product-modal'
import { CategoryModal } from '@/components/categories/category-modal'
import { StockTransferModal } from '@/components/products/stock-transfer-modal'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { mockProducts, mockCategories } from '@/data/mockProducts'
import { Product, Category, StockTransfer } from '@/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [productToTransfer, setProductToTransfer] = useState<Product | null>(null)

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleDelete = (product: Product) => {
    setProductToDelete(product)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete.id))
      setIsDeleteModalOpen(false)
      setProductToDelete(null)
    }
  }


  const handleStockAdjustment = (product: Product) => {
    console.log('Stock adjustment for:', product)
    // TODO: Implement stock adjustment modal
  }

  const handleStockTransfer = (product: Product) => {
    setProductToTransfer(product)
    setIsTransferModalOpen(true)
  }

  const handleTransferStock = (transferData: Omit<StockTransfer, 'id' | 'createdAt' | 'userId' | 'userName'>) => {
    setProducts(prev => 
      prev.map(product => {
        if (product.id === transferData.productId) {
          const stockBefore = {
            warehouse: product.stock.warehouse,
            store: product.stock.store,
            total: product.stock.total
          }

          const newWarehouseStock = transferData.fromLocation === 'warehouse' 
            ? product.stock.warehouse - transferData.quantity
            : product.stock.warehouse + (transferData.toLocation === 'warehouse' ? transferData.quantity : 0)
          
          const newStoreStock = transferData.fromLocation === 'store'
            ? product.stock.store - transferData.quantity
            : product.stock.store + (transferData.toLocation === 'store' ? transferData.quantity : 0)

          const stockAfter = {
            warehouse: newWarehouseStock,
            store: newStoreStock,
            total: newWarehouseStock + newStoreStock
          }

          // Crear log de transferencia
          const transferLog = {
            id: Date.now().toString(),
            type: 'transfer' as const,
            action: 'Transferencia de Stock',
            description: `Transferencia de ${transferData.quantity} unidades de ${transferData.productName} desde ${transferData.fromLocation === 'warehouse' ? 'Bodega' : 'Local'} hacia ${transferData.toLocation === 'warehouse' ? 'Bodega' : 'Local'}`,
            details: {
              productId: transferData.productId,
              productName: transferData.productName,
              fromLocation: transferData.fromLocation,
              toLocation: transferData.toLocation,
              quantity: transferData.quantity,
              reason: transferData.reason,
              stockBefore,
              stockAfter
            },
            userId: '1',
            userName: 'Diego Admin',
            timestamp: new Date().toISOString()
          }

          // Aquí podrías guardar el log en una base de datos
          console.log('Transfer log created:', transferLog)

          return {
            ...product,
            stock: stockAfter
          }
        }
        return product
      })
    )
  }

  const handleManageCategories = () => {
    setSelectedCategory(null)
    setIsCategoryModalOpen(true)
  }

  const handleSaveCategory = (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: (categories.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setCategories(prev => [newCategory, ...prev])
  }

  const handleUpdateCategory = (category: Category) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === category.id ? category : cat
      )
    )
  }

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId))
  }

  const handleCreate = () => {
    setSelectedProduct(null)
    setIsModalOpen(true)
  }

  const handleSaveProduct = (productData: Omit<Product, 'id'>) => {
    if (selectedProduct) {
      // Edit existing product
      setProducts(prev =>
        prev.map(product =>
          product.id === selectedProduct.id
            ? { ...productData, id: selectedProduct.id }
            : product
        )
      )
    } else {
      // Create new product
      const newProduct: Product = {
        ...productData,
        id: (products.length + 1).toString()
      }
      setProducts(prev => [newProduct, ...prev])
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Productos</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Administra tu inventario de productos
        </p>
      </div>

              <ProductTable
                products={products}
                categories={categories}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCreate={handleCreate}
                onManageCategories={handleManageCategories}
                onStockAdjustment={handleStockAdjustment}
                onStockTransfer={handleStockTransfer}
              />

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProduct(null)
        }}
        onSave={handleSaveProduct}
        product={selectedProduct}
        categories={categories}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false)
          setSelectedCategory(null)
        }}
        onSave={handleSaveCategory}
        onUpdate={handleUpdateCategory}
        onDelete={handleDeleteCategory}
        category={selectedCategory}
        categories={categories}
      />

              <StockTransferModal
                isOpen={isTransferModalOpen}
                onClose={() => {
                  setIsTransferModalOpen(false)
                  setProductToTransfer(null)
                }}
                onTransfer={handleTransferStock}
                product={productToTransfer}
              />

              <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                  setIsDeleteModalOpen(false)
                  setProductToDelete(null)
                }}
                onConfirm={confirmDelete}
                title="Eliminar Producto"
                message={`¿Estás seguro de que quieres eliminar el producto "${productToDelete?.name}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                type="danger"
              />
            </div>
          )
        }
