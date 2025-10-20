'use client'

import { useState } from 'react'
import { ProductTable } from '@/components/products/product-table'
import { ProductModal } from '@/components/products/product-modal'
import { CategoryModal } from '@/components/categories/category-modal'
import { StockTransferModal } from '@/components/products/stock-transfer-modal'
import { StockAdjustmentModal } from '@/components/products/stock-adjustment-modal'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { useProducts } from '@/contexts/products-context'
import { useCategories } from '@/contexts/categories-context'
import { Product, Category, StockTransfer } from '@/types'
import { toast } from 'sonner'

export default function ProductsPage() {
  const { products, loading, createProduct, updateProduct, deleteProduct, transferStock, adjustStock } = useProducts()
  const { categories, createCategory, toggleCategoryStatus, deleteCategory } = useCategories()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [productToTransfer, setProductToTransfer] = useState<Product | null>(null)
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false)
  const [productToAdjust, setProductToAdjust] = useState<Product | null>(null)

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleDelete = (product: Product) => {
    setProductToDelete(product)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (productToDelete) {
      const success = await deleteProduct(productToDelete.id)
      if (success) {
        toast.success('Producto eliminado exitosamente')
        setIsDeleteModalOpen(false)
        setProductToDelete(null)
      } else {
        toast.error('Error eliminando producto')
      }
    }
  }


  const handleStockAdjustment = (product: Product) => {
    setProductToAdjust(product)
    setIsAdjustmentModalOpen(true)
  }

  const handleAdjustStock = async (productId: string, location: 'warehouse' | 'store', newQuantity: number, reason: string) => {
    const success = await adjustStock(productId, location, newQuantity, reason)
    
    if (success) {
      toast.success('Stock ajustado exitosamente')
      setIsAdjustmentModalOpen(false)
      setProductToAdjust(null)
    } else {
      toast.error('Error ajustando stock')
    }
  }

  const handleStockTransfer = (product: Product) => {
    setProductToTransfer(product)
    setIsTransferModalOpen(true)
  }

  const handleTransferStock = async (transferData: Omit<StockTransfer, 'id' | 'createdAt' | 'userId' | 'userName'>) => {
    const success = await transferStock(
      transferData.productId,
      transferData.fromLocation,
      transferData.toLocation,
      transferData.quantity
    )
    
    if (success) {
      toast.success('Stock transferido exitosamente')
      setIsTransferModalOpen(false)
      setProductToTransfer(null)
    } else {
      toast.error('Error transfiriendo stock')
    }
  }

  const handleManageCategories = () => {
    setSelectedCategory(null)
    setIsCategoryModalOpen(true)
  }

  const handleSaveCategory = async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    const success = await createCategory(categoryData)
    if (success) {
      toast.success('Categoría creada exitosamente')
      // No cerrar el modal para que el usuario pueda ver la categoría creada
      // setIsCategoryModalOpen(false)
      // setSelectedCategory(null)
    } else {
      toast.error('Error creando categoría')
    }
  }


  const handleToggleCategoryStatus = async (categoryId: string, newStatus: 'active' | 'inactive') => {
    const success = await toggleCategoryStatus(categoryId, newStatus)
    if (success) {
      const statusText = newStatus === 'active' ? 'habilitada' : 'deshabilitada'
      toast.success(`Categoría ${statusText} exitosamente`)
    } else {
      toast.error('Error cambiando estado de categoría')
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    const success = await deleteCategory(categoryId)
    if (success) {
      toast.success('Categoría eliminada exitosamente')
    } else {
      toast.error('Error eliminando categoría')
    }
  }

  const handleCreate = () => {
    setSelectedProduct(null)
    setIsModalOpen(true)
  }

  const handleSaveProduct = async (productData: Omit<Product, 'id'>) => {
    if (selectedProduct) {
      // Edit existing product
      const success = await updateProduct(selectedProduct.id, productData)
      if (success) {
        toast.success('Producto actualizado exitosamente')
        setIsModalOpen(false)
        setSelectedProduct(null)
      } else {
        toast.error('Error actualizando producto')
      }
    } else {
      // Create new product
      const success = await createProduct(productData)
      if (success) {
        toast.success('Producto creado exitosamente')
        setIsModalOpen(false)
      } else {
        toast.error('Error creando producto')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="xl:ml-0 ml-20">
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
        onToggleStatus={handleToggleCategoryStatus}
        onDelete={handleDeleteCategory}
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

              <StockAdjustmentModal
                isOpen={isAdjustmentModalOpen}
                onClose={() => {
                  setIsAdjustmentModalOpen(false)
                  setProductToAdjust(null)
                }}
                onAdjust={handleAdjustStock}
                product={productToAdjust}
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
