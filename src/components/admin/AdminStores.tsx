
import React, { useState, useEffect } from 'react';
import { StoreService, Store, Cashback } from '@/services/StoreService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';

const AdminStores: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedCashback, setSelectedCashback] = useState<Cashback | null>(null);
  const [storeCashbacks, setStoreCashbacks] = useState<Cashback[]>([]);
  const [isAddingStore, setIsAddingStore] = useState(false);
  const [isEditingStore, setIsEditingStore] = useState(false);
  const [isAddingCashback, setIsAddingCashback] = useState(false);
  const [isEditingCashback, setIsEditingCashback] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteCashbackDialogOpen, setDeleteCashbackDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all-stores");
  
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    club: '',
    description: '',
    category: '',
  });
  
  const [cashbackForm, setCashbackForm] = useState({
    category: '',
    cashback_percent: '',
  });

  useEffect(() => {
    fetchStores();
  }, []);
  
  useEffect(() => {
    if (selectedStore) {
      fetchStoreCashbacks(selectedStore.id);
    }
  }, [selectedStore]);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const storesData = await StoreService.getStores();
      setStores(storesData);
    } catch (error) {
      toast("Erro", {
        description: "Não foi possível carregar as lojas.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreCashbacks = async (storeId: string) => {
    try {
      const cashbacks = await StoreService.getStoreCashbacks(storeId);
      setStoreCashbacks(cashbacks);
    } catch (error) {
      toast("Erro", {
        description: "Não foi possível carregar os cashbacks da loja.",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCashbackInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCashbackForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddStore = async () => {
    try {
      const { name, country, club, category, description } = formData;
      
      if (!name || !country) {
        toast("Campos obrigatórios", {
          description: "Nome e país são campos obrigatórios.",
        });
        return;
      }
      
      const result = await StoreService.createStore({
        name,
        country,
        club: club || undefined,
        category: category || undefined,
        description: description || undefined
      });
      
      if (result.success) {
        toast("Sucesso", {
          description: "Loja criada com sucesso!",
        });
        setIsAddingStore(false);
        resetForm();
        fetchStores();
      } else {
        toast("Erro", {
          description: result.message || "Erro ao criar loja.",
        });
      }
    } catch (error: any) {
      toast("Erro", {
        description: error.message || "Erro ao criar loja.",
      });
    }
  };

  const handleEditStore = async () => {
    if (!selectedStore) return;
    
    try {
      const { name, country, club, category, description } = formData;
      
      const result = await StoreService.updateStore(selectedStore.id, {
        name: name || undefined,
        country: country || undefined,
        club: club || undefined,
        category: category || undefined,
        description: description || undefined
      });
      
      if (result.success) {
        toast("Sucesso", {
          description: "Loja atualizada com sucesso!",
        });
        setIsEditingStore(false);
        resetForm();
        fetchStores();
      } else {
        toast("Erro", {
          description: result.message || "Erro ao atualizar loja.",
        });
      }
    } catch (error: any) {
      toast("Erro", {
        description: error.message || "Erro ao atualizar loja.",
      });
    }
  };

  const handleDeleteStore = async () => {
    if (!selectedStore) return;
    
    try {
      const result = await StoreService.deleteStore(selectedStore.id);
      
      if (result.success) {
        toast("Sucesso", {
          description: "Loja excluída com sucesso!",
        });
        setDeleteDialogOpen(false);
        setSelectedStore(null);
        fetchStores();
      } else {
        toast("Erro", {
          description: result.message || "Erro ao excluir loja.",
        });
      }
    } catch (error: any) {
      toast("Erro", {
        description: error.message || "Erro ao excluir loja.",
      });
    }
  };

  const handleAddCashback = async () => {
    if (!selectedStore) return;
    
    try {
      const { category, cashback_percent } = cashbackForm;
      
      if (!category || !cashback_percent) {
        toast("Campos obrigatórios", {
          description: "Categoria e percentual são obrigatórios.",
        });
        return;
      }
      
      const result = await StoreService.addCashback(selectedStore.id, {
        category,
        cashback_percent
      });
      
      if (result.success) {
        toast("Sucesso", {
          description: "Cashback adicionado com sucesso!",
        });
        setIsAddingCashback(false);
        resetCashbackForm();
        fetchStoreCashbacks(selectedStore.id);
      } else {
        toast("Erro", {
          description: result.message || "Erro ao adicionar cashback.",
        });
      }
    } catch (error: any) {
      toast("Erro", {
        description: error.message || "Erro ao adicionar cashback.",
      });
    }
  };

  const handleEditCashback = async () => {
    if (!selectedStore || !selectedCashback) return;
    
    try {
      const { category, cashback_percent } = cashbackForm;
      
      const result = await StoreService.updateCashback(
        selectedStore.id,
        selectedCashback.id,
        {
          category: category || undefined,
          cashback_percent: cashback_percent || undefined
        }
      );
      
      if (result.success) {
        toast("Sucesso", {
          description: "Cashback atualizado com sucesso!",
        });
        setIsEditingCashback(false);
        resetCashbackForm();
        fetchStoreCashbacks(selectedStore.id);
      } else {
        toast("Erro", {
          description: result.message || "Erro ao atualizar cashback.",
        });
      }
    } catch (error: any) {
      toast("Erro", {
        description: error.message || "Erro ao atualizar cashback.",
      });
    }
  };

  const handleDeleteCashback = async () => {
    if (!selectedStore || !selectedCashback) return;
    
    try {
      const result = await StoreService.deleteCashback(
        selectedStore.id,
        selectedCashback.id
      );
      
      if (result.success) {
        toast("Sucesso", {
          description: "Cashback excluído com sucesso!",
        });
        setDeleteCashbackDialogOpen(false);
        setSelectedCashback(null);
        fetchStoreCashbacks(selectedStore.id);
      } else {
        toast("Erro", {
          description: result.message || "Erro ao excluir cashback.",
        });
      }
    } catch (error: any) {
      toast("Erro", {
        description: error.message || "Erro ao excluir cashback.",
      });
    }
  };

  const prepareEditStore = (store: Store) => {
    setSelectedStore(store);
    setFormData({
      name: store.name,
      country: store.country,
      club: store.club || '',
      description: store.description || '',
      category: store.category || '',
    });
    setIsEditingStore(true);
  };

  const prepareDeleteStore = (store: Store) => {
    setSelectedStore(store);
    setDeleteDialogOpen(true);
  };

  const prepareEditCashback = (cashback: Cashback) => {
    setSelectedCashback(cashback);
    setCashbackForm({
      category: cashback.category,
      cashback_percent: cashback.cashback_percent,
    });
    setIsEditingCashback(true);
  };

  const prepareDeleteCashback = (cashback: Cashback) => {
    setSelectedCashback(cashback);
    setDeleteCashbackDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      country: '',
      club: '',
      description: '',
      category: '',
    });
  };

  const resetCashbackForm = () => {
    setCashbackForm({
      category: '',
      cashback_percent: '',
    });
    setSelectedCashback(null);
  };

  const viewStoreDetails = (store: Store) => {
    setSelectedStore(store);
    setActiveTab("store-details");
  };

  return (
    <div className="space-y-6">
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => {
          setActiveTab(value);
          if (value === "all-stores") {
            setSelectedStore(null);
          }
        }}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="all-stores">Todas as Lojas</TabsTrigger>
          {selectedStore && (
            <TabsTrigger value="store-details">Detalhes da Loja</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="all-stores">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Gerenciar Lojas</h2>
            <Button onClick={() => {
              resetForm();
              setIsAddingStore(true);
            }} className="bg-red-900 hover:bg-red-800">
              <Plus className="h-4 w-4 mr-2" />
              Nova Loja
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Lojas Cadastradas</CardTitle>
                <CardDescription>
                  Gerencie todas as lojas parceiras da plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Nome</TableHead>
                      <TableHead>País</TableHead>
                      <TableHead>Clube</TableHead>
                      <TableHead>Cashback</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stores.length > 0 ? (
                      stores.map((store) => (
                        <TableRow key={store.id}>
                          <TableCell className="font-medium">{store.name}</TableCell>
                          <TableCell>{store.country}</TableCell>
                          <TableCell>{store.club || '-'}</TableCell>
                          <TableCell>{store.cashback || '0%'}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewStoreDetails(store)}
                              className="mr-2"
                            >
                              Detalhes
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => prepareEditStore(store)}
                              className="mr-2"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => prepareDeleteStore(store)}
                            >
                              <Trash2 className="h-4 w-4 text-red-700" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                          Nenhuma loja encontrada
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="store-details">
          {selectedStore && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">{selectedStore.name}</h2>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => prepareEditStore(selectedStore)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Loja
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => prepareDeleteStore(selectedStore)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir Loja
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Detalhes da Loja</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Nome</dt>
                        <dd>{selectedStore.name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">País</dt>
                        <dd>{selectedStore.country}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Clube</dt>
                        <dd>{selectedStore.club || '-'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Categoria</dt>
                        <dd>{selectedStore.category || '-'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Descrição</dt>
                        <dd>{selectedStore.description || '-'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Cashback Range</dt>
                        <dd>{selectedStore.cashback || '0%'}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Categorias de Cashback</CardTitle>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        resetCashbackForm();
                        setIsAddingCashback(true);
                      }}
                      className="bg-red-900 hover:bg-red-800"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Categoria</TableHead>
                          <TableHead>Cashback</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {storeCashbacks.length > 0 ? (
                          storeCashbacks.map((cashback) => (
                            <TableRow key={cashback.id}>
                              <TableCell>{cashback.category}</TableCell>
                              <TableCell>{cashback.cashback_percent}%</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="mr-2"
                                  onClick={() => prepareEditCashback(cashback)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => prepareDeleteCashback(cashback)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-700" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                              Nenhuma categoria de cashback encontrada
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={isAddingStore} onOpenChange={setIsAddingStore}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Loja</DialogTitle>
            <DialogDescription>
              Preencha os dados para adicionar uma nova loja parceira.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Loja*</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Nike"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">País*</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Ex: Brasil"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="club">Clube Relacionado</Label>
                <Input
                  id="club"
                  name="club"
                  value={formData.club}
                  onChange={handleInputChange}
                  placeholder="Ex: Manchester United"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Ex: Esportes"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descrição da loja..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingStore(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddStore} className="bg-red-900 hover:bg-red-800">
              Adicionar Loja
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditingStore} onOpenChange={setIsEditingStore}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Editar Loja</DialogTitle>
            <DialogDescription>
              Atualize os dados da loja selecionada.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Loja*</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Nike"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">País*</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Ex: Brasil"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="club">Clube Relacionado</Label>
                <Input
                  id="club"
                  name="club"
                  value={formData.club}
                  onChange={handleInputChange}
                  placeholder="Ex: Manchester United"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Ex: Esportes"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descrição da loja..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingStore(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditStore} className="bg-red-900 hover:bg-red-800">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Store Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a loja "{selectedStore?.name}"? Esta ação não poderá ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteStore}>
              Excluir Loja
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isAddingCashback} onOpenChange={setIsAddingCashback}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Adicionar Cashback</DialogTitle>
            <DialogDescription>
              Adicione uma nova categoria de cashback para a loja {selectedStore?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria*</Label>
              <Input
                id="category"
                name="category"
                value={cashbackForm.category}
                onChange={handleCashbackInputChange}
                placeholder="Ex: Roupas Masculinas"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cashback_percent">Percentual de Cashback*</Label>
              <Input
                id="cashback_percent"
                name="cashback_percent"
                type="text"
                value={cashbackForm.cashback_percent}
                onChange={handleCashbackInputChange}
                placeholder="Ex: 5.00"
              />
              <p className="text-xs text-gray-500">
                Use ponto como separador decimal. Ex: 5.75 para 5,75%
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingCashback(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddCashback} className="bg-red-900 hover:bg-red-800">
              Adicionar Cashback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditingCashback} onOpenChange={setIsEditingCashback}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Editar Cashback</DialogTitle>
            <DialogDescription>
              Atualize os detalhes da categoria de cashback.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria*</Label>
              <Input
                id="category"
                name="category"
                value={cashbackForm.category}
                onChange={handleCashbackInputChange}
                placeholder="Ex: Roupas Masculinas"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cashback_percent">Percentual de Cashback*</Label>
              <Input
                id="cashback_percent"
                name="cashback_percent"
                type="text"
                value={cashbackForm.cashback_percent}
                onChange={handleCashbackInputChange}
                placeholder="Ex: 5.00"
              />
              <p className="text-xs text-gray-500">
                Use ponto como separador decimal. Ex: 5.75 para 5,75%
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingCashback(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditCashback} className="bg-red-900 hover:bg-red-800">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={deleteCashbackDialogOpen} onOpenChange={setDeleteCashbackDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a categoria de cashback "{selectedCashback?.category}"? Esta ação não poderá ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setDeleteCashbackDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteCashback}>
              Excluir Cashback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminStores;
