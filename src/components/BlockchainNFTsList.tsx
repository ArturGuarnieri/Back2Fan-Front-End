
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BlockchainNFT } from '@/services/AuthService';
import { useLanguage } from '@/contexts/LanguageContext';
import { ExternalLink, Info, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface BlockchainNFTsListProps {
  nfts: BlockchainNFT[];
}

const BlockchainNFTsList: React.FC<BlockchainNFTsListProps> = ({ nfts }) => {
  const { t } = useLanguage();
  
  if (!nfts || nfts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">{t('blockchainNFTs')}</h2>
          <div className="text-center py-6 text-gray-500">
            {t('noBlockchainNFTs')}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">{t('blockchainNFTs')}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {nfts.map((nft) => (
            <NFTCard key={`${nft.contract}-${nft.tokenId}`} nft={nft} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface NFTCardProps {
  nft: BlockchainNFT;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  const { t } = useLanguage();
  const hasMetadata = !!nft.metadata;
  const hasImage = hasMetadata && !!nft.metadata.image;
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-square bg-gray-200">
        {hasImage ? (
          <img 
            src={nft.metadata.image} 
            alt={nft.metadata?.name || `NFT #${nft.tokenId}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Image+Not+Available';
            }}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            <span>{t('noImage')}</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-medium truncate">
          {hasMetadata && nft.metadata.name ? nft.metadata.name : `${nft.name} #${nft.tokenId}`}
        </h3>
        
        <div className="flex items-center justify-between mt-3">
          <HoverCard>
            <HoverCardTrigger asChild>
              <span className="text-xs font-mono text-gray-500 truncate">
                {nft.contract.substring(0, 6)}...
              </span>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto p-2 text-xs">
              {nft.contract}
            </HoverCardContent>
          </HoverCard>
          
          <div className="flex space-x-2">
            {hasMetadata && (
              <NFTDetailsDialog nft={nft} />
            )}
            
            <Button 
              size="sm" 
              variant="outline" 
              className="px-2"
              asChild
            >
              <a 
                href={`https://spicy-explorer.chiliz.com/tx/${nft.txHash}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface NFTDetailsDialogProps {
  nft: BlockchainNFT;
}

const NFTDetailsDialog: React.FC<NFTDetailsDialogProps> = ({ nft }) => {
  const { t } = useLanguage();
  
  if (!nft.metadata) return null;
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="px-2">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{nft.metadata.name || `NFT #${nft.tokenId}`}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {nft.metadata.image && (
            <div className="flex justify-center items-center">
              <img 
                src={nft.metadata.image} 
                alt={nft.metadata.name || `NFT #${nft.tokenId}`}
                className="max-w-full max-h-64 rounded-lg shadow-md object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Image+Not+Available';
                }}
                loading="lazy"
              />
            </div>
          )}
          
          <div>
            {nft.metadata.description && (
              <div className="mb-4">
                <h3 className="text-md font-medium mb-1">{t('description')}</h3>
                <p className="text-sm text-gray-600">{nft.metadata.description}</p>
              </div>
            )}
            
            <div className="mb-4">
              <h3 className="text-md font-medium mb-1">{t('details')}</h3>
              <div className="text-sm">
                <p><span className="font-medium">{t('collection')}:</span> {nft.name}</p>
                <p><span className="font-medium">{t('symbol')}:</span> {nft.symbol}</p>
                <p><span className="font-medium">{t('tokenId')}:</span> {nft.tokenId}</p>
                <p className="truncate">
                  <span className="font-medium">{t('contract')}:</span> {nft.contract}
                </p>
              </div>
            </div>
            
            {nft.metadata.attributes && nft.metadata.attributes.length > 0 && (
              <div>
                <h3 className="text-md font-medium mb-2">{t('attributes')}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {nft.metadata.attributes.map((attr, index) => (
                    <div key={index} className="bg-gray-50 p-2 rounded-md">
                      <div className="text-xs text-gray-500">{attr.trait_type}</div>
                      <div className="font-medium text-sm">{attr.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full"
                asChild
              >
                <a 
                  href={`https://spicy-explorer.chiliz.com/tx/${nft.txHash}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {t('viewOnExplorer')}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlockchainNFTsList;
