'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAllProduct } from '@/app/api/product';

interface ProductSelectionProps {
  userId: string;
  accessToken: string;
  selectedProducts: string[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ProductSelection: React.FC<ProductSelectionProps> = ({
  userId,
  accessToken,
  selectedProducts,
  setSelectedProducts,
}) => {
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    if (isPopoverOpen && products.length === 0) {
      (async () => {
        setLoading(true);
        try {
          const response = await getAllProduct(userId, accessToken, 1, 100);
          setProducts(response.items ?? []);
        } catch {
          setProducts([]);
        } finally {
          setLoading(false);
        }
      })();
    }
    // eslint-disable-next-line
  }, [isPopoverOpen]);

  const handleProductChange = (id: string) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    productId: string
  ) => {
    event.preventDefault();
    setSelectedProducts(prev => prev.filter(pid => pid !== productId));
  };

  return (
    <div className="w-full border rounded-md">
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <div className="flex justify-between items-center w-full" onClick={() => setIsPopoverOpen(true)}>
            <div className={`${selectedProducts.length > 0 ? 'flex' : 'hidden'} flex-wrap items-center my-2 gap-y-2 w-full`}>
              {selectedProducts.map((id) => {
                const product = products.find((p) => p.id === id);
                return product ? (
                  <div key={id} className="relative">
                    <span className="text-sm font-medium px-3 py-1 ml-2 bg-gray-600/10 rounded-full">
                      {product.name}
                    </span>
                    <Button
                      onClick={(e) => handleDelete(e, id)}
                      className="absolute h-auto -top-1 -right-1 p-1 bg-red-300 hover:bg-red-500 [&_svg]:size-2"
                      type="button"
                    >
                      <X />
                    </Button>
                  </div>
                ) : null;
              })}
            </div>
            <Button
              className={`flex justify-between items-center px-3 bg-transparent font-normal text-gray-600 hover:bg-transparent ${selectedProducts.length > 0 ? 'w-auto' : 'w-full'}`}
              type="button"
            >
              Chọn sản phẩm áp dụng
              <ChevronDown />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full min-w-[var(--radix-popper-anchor-width)] max-h-96 overflow-y-auto">
          {loading ? (
            <p>Đang tải sản phẩm...</p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500">Không có sản phẩm nào.</p>
          ) : (
            <div className="space-y-2">
              {products.map(product => (
                <div key={product.id} className="flex justify-between items-center">
                  <span className="text-sm">{product.name}</span>
                  <Checkbox
                    id={product.id}
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={() => handleProductChange(product.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ProductSelection;
