
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { FanToken, FanTokenService } from '@/services/FanTokenService';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const AdminFanTokens = () => {
  const { t } = useLanguage();
  const [fanTokens, setFanTokens] = useState<FanToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<FanToken | null>(null);
  
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [formErrors, setFormErrors] = useState({
    name: false,
    slug: false,
    image: false
  });
  const [submitting, setSubmitting] = useState(false);
  
  const fetchFanTokens = async () => {
    setLoading(true);
    try {
      const tokens = await FanTokenService.getFanTokens();
      setFanTokens(tokens);
    } catch (error) {
      console.error('Error fetching fan tokens:', error);
      toast(t('error'), {
        description: t('errorFetchingFanTokens'),
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchFanTokens();
  }, []);
  
  const resetForm = () => {
    setName('');
    setSlug('');
    setImage('');
    setFormErrors({
      name: false,
      slug: false,
      image: false
    });
    setSelectedToken(null);
  };
  
  const openCreateForm = () => {
    resetForm();
    setFormOpen(true);
  };
  
  const openEditForm = (token: FanToken) => {
    setSelectedToken(token);
    setName(token.name);
    setSlug(token.slug);
    setImage(token.image);
    setFormOpen(true);
  };
  
  const openDeleteDialog = (token: FanToken) => {
    setSelectedToken(token);
    setDeleteDialogOpen(true);
  };
  
  const validateForm = () => {
    const errors = {
      name: !name.trim(),
      slug: !slug.trim() || !/^[a-z0-9-]+$/.test(slug),
      image: !image.trim()
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };
  
  const handleCreateOrUpdate = async () => {
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      const response = await FanTokenService.createOrUpdateFanToken({
        id: selectedToken?.id,
        name,
        slug,
        image
      });
      
      if (response.success) {
        toast(t('success'), {
          description: response.message || t('fanTokenSaved'),
        });
        setFormOpen(false);
        await fetchFanTokens();
      } else {
        toast(t('error'), {
          description: response.error || t('errorSavingFanToken'),
        });
      }
    } catch (error) {
      console.error('Error creating/updating fan token:', error);
      toast(t('error'), {
        description: t('errorSavingFanToken'),
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    if (!selectedToken) return;
    
    try {
      const response = await FanTokenService.deleteFanToken(selectedToken.id);
      
      if (response.success) {
        toast(t('success'), {
          description: response.message || t('fanTokenDeleted'),
        });
        setDeleteDialogOpen(false);
        await fetchFanTokens();
      } else {
        toast(t('error'), {
          description: response.error || t('errorDeletingFanToken'),
        });
      }
    } catch (error) {
      console.error('Error deleting fan token:', error);
      toast(t('error'), {
        description: t('errorDeletingFanToken'),
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('fanTokens')}</h2>
        <Button onClick={openCreateForm}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('createFanToken')}
        </Button>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <Table>
          <TableCaption>{t('fanTokensDescription')}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>{t('name')}</TableHead>
              <TableHead>{t('slug')}</TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fanTokens.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  {t('noFanTokens')}
                </TableCell>
              </TableRow>
            ) : (
              fanTokens.map(token => (
                <TableRow key={token.id}>
                  <TableCell className="p-2">
                    <div className="w-10 h-10 rounded overflow-hidden bg-gray-100">
                      {token.image ? (
                        <img 
                          src={token.image} 
                          alt={token.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-gray-500">
                          {token.slug.toUpperCase().substring(0, 2)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{token.name}</TableCell>
                  <TableCell>{token.slug}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openEditForm(token)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openDeleteDialog(token)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
      

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedToken ? t('editFanToken') : t('createFanToken')}
            </DialogTitle>
            <DialogDescription>
              {t('fanTokenFormDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t('name')}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('fanTokenNamePlaceholder')}
                className={formErrors.name ? 'border-red-500' : ''}
              />
              {formErrors.name && (
                <p className="text-xs text-red-500">{t('fanTokenRequired')}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="slug">{t('slug')}</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                placeholder={t('fanTokenSlugPlaceholder')}
                className={formErrors.slug ? 'border-red-500' : ''}
              />
              {formErrors.slug && (
                <p className="text-xs text-red-500">{t('fanTokenSlugHelp')}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="image">{t('imageUrl')}</Label>
              <Input
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.png"
                className={formErrors.image ? 'border-red-500' : ''}
              />
              {formErrors.image && (
                <p className="text-xs text-red-500">{t('fanTokenRequired')}</p>
              )}
            </div>
            
            {image && (
              <div className="py-2">
                <p className="text-sm mb-1">{t('imagePreview')}:</p>
                <div className="w-16 h-16 rounded overflow-hidden border bg-gray-50">
                  <img 
                    src={image} 
                    alt={t('preview')} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://placehold.co/64x64?text=Error';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setFormOpen(false)}
            >
              {t('cancel')}
            </Button>
            <Button 
              onClick={handleCreateOrUpdate}
              disabled={submitting}
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {selectedToken ? t('updateFanToken') : t('createFanToken')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteFanToken')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteFanTokenConfirmation')}
              {selectedToken && (
                <span className="font-medium"> "{selectedToken.name}"</span>
              )}
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminFanTokens;
