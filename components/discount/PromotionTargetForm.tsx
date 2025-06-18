'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronDown, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CategoryDataResponse } from '@/interface/category';
import { useEffect, useState } from 'react';
import { getAllCategories } from '@/app/api/category';

interface PromotionCategoryPopoverProps {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

const PromotionCategoryPopover: React.FC<PromotionCategoryPopoverProps> = ({
  selectedCategories,
  setSelectedCategories,
}) => {
  const [allCategories, setAllCategories] = useState<CategoryDataResponse[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Load category tree
  useEffect(() => {
    if (!isPopoverOpen || allCategories.length) return;
    setCategoriesLoading(true);
    getAllCategories()
      .then(setAllCategories)
      .catch(() => setAllCategories([]))
      .finally(() => setCategoriesLoading(false));
  }, [isPopoverOpen, allCategories.length]);

  // Utility: Tìm tên từ id trong tree (đệ quy)
  const getNameById = (id: string, cats: CategoryDataResponse[]): string | undefined => {
    for (const cat of cats) {
      if (cat.id === id) return cat.name;
      if (cat.children?.length) {
        const n = getNameById(id, cat.children);
        if (n) return n;
      }
    }
    return undefined;
  };

  // Xử lý chọn/xoá
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    categoryId: string
  ) => {
    event.preventDefault();
    setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
  };

  // Đệ quy render tất cả cấp
  function renderCategoryNode(category: CategoryDataResponse) {
    return (
      <div key={category.id} className="mb-1">
        <div className="flex items-center gap-2">
          <Checkbox
            id={category.id}
            checked={selectedCategories.includes(category.id)}
            onCheckedChange={() => handleCategoryChange(category.id)}
          />
          <Label htmlFor={category.id}>{category.name}</Label>
        </div>
        {category.children && category.children.length > 0 && (
          <div className="ml-4 border-l border-gray-100 pl-2">
            {category.children.map((child) => renderCategoryNode(child))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full border rounded-md">
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <div className="flex justify-between items-center w-full">
            {/* Badge các category đã chọn */}
            <div className={`${selectedCategories.length > 0 ? 'flex' : 'hidden'} flex-wrap items-center my-2 gap-y-2 w-full`}>
              {selectedCategories.map((cid) => (
                <div key={cid} className="relative">
                  <span className="text-sm font-medium px-3 py-1 ml-2 bg-gray-600/10 rounded-full">
                    {getNameById(cid, allCategories) || cid}
                  </span>
                  <Button
                    onClick={e => handleDelete(e, cid)}
                    className="absolute h-auto -top-1 -right-1 p-1 bg-red-300 hover:bg-red-500 [&_svg]:size-2"
                  >
                    <X />
                  </Button>
                </div>
              ))}
            </div>
            <Button className={`flex justify-between items-center px-3 bg-transparent font-normal text-gray-600 hover:bg-transparent ${selectedCategories.length > 0 ? 'w-auto' : 'w-full'}`}>
              Chọn danh mục sản phẩm
              <ChevronDown />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full min-w-[var(--radix-popper-anchor-width)] max-h-96 overflow-y-auto">
          {categoriesLoading ? (
            <p>Đang tải danh mục...</p>
          ) : allCategories.length === 0 ? (
            <p className="text-center text-gray-500">Không tìm thấy danh mục nào.</p>
          ) : (
            <div className="py-2">
              {allCategories.map((cat) => renderCategoryNode(cat))}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PromotionCategoryPopover;
