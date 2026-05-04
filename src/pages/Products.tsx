import { useEffect, useState } from 'react'
import { CircleX, Package, Pencil, Plus, Search, Trash } from 'lucide-react'
import useAppStore from '@/stores/use-app-store'
import { formatCurrency } from '@/lib/format'
import { Product } from '@/types/index'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ProductForm } from '@/components/ProductForm'

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useAppStore()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [search, setSearch] = useState('')

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState<Product | null>(null)

  const [productToDelete, setProductToDelete] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API load
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  )

  const handleOpenCreate = () => {
    setProductToEdit(null)
    setIsSheetOpen(true)
  }

  const handleOpenEdit = (product: Product) => {
    setProductToEdit(product)
    setIsSheetOpen(true)
  }

  const handleFormSubmit = (data: Omit<Product, 'id'>) => {
    if (productToEdit) {
      updateProduct(productToEdit.id, data)
      toast({
        title: 'Sucesso',
        description: 'Produto atualizado com sucesso',
      })
    } else {
      addProduct(data)
      toast({
        title: 'Sucesso',
        description: 'Produto adicionado com sucesso',
      })
    }
    setIsSheetOpen(false)
  }

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete)
      toast({
        title: 'Sucesso',
        description: 'Produto deletado com sucesso',
      })
      setProductToDelete(null)
    }
  }

  const handleRetry = () => {
    setIsLoading(true)
    setHasError(false)
    setTimeout(() => setIsLoading(false), 800)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar produtos..."
            className="pl-8 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={handleOpenCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      <div className="rounded-md border bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-6 w-[200px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[60px]" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : hasError ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <CircleX className="h-10 w-10 text-destructive" />
                    <p className="text-muted-foreground">
                      Erro ao carregar produtos. Tente novamente.
                    </p>
                    <Button variant="outline" onClick={handleRetry}>
                      Tentar Novamente
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">Nenhum produto cadastrado</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      Você ainda não possui produtos ou a busca não encontrou resultados.
                    </p>
                    <Button onClick={handleOpenCreate} className="mt-4">
                      <Plus className="mr-2 h-4 w-4" /> Cadastrar Produto
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="animate-fade-in-up group">
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{product.name}</span>
                      <span className="text-xs text-muted-foreground font-normal">
                        {product.material}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={product.stock === 0 ? 'destructive' : 'outline'}
                      className={
                        product.stock > 0 && product.stock <= 5
                          ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300'
                          : ''
                      }
                    >
                      {product.stock} unid.
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(product)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setProductToDelete(product.id)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Deletar</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>{productToEdit ? 'Editar Produto' : 'Novo Produto'}</SheetTitle>
            <SheetDescription>
              {productToEdit
                ? 'Atualize as informações da joia no catálogo.'
                : 'Preencha as informações para adicionar uma nova joia ao catálogo.'}
            </SheetDescription>
          </SheetHeader>
          <ProductForm defaultValues={productToEdit || undefined} onSubmit={handleFormSubmit} />
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O produto será removido permanentemente do catálogo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirmar Exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
