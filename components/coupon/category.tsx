'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { ChevronDown, X } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { CategoryDataResponse } from '@/interface/category'
import { useEffect, useState } from 'react'
import { getAllCategories } from '@/app/api/category'
import { Category, ProductData } from '@/interface/product'
import { CouponData } from '@/interface/coupon'

interface CategorySelectionProps {
  setCoupon: React.Dispatch<React.SetStateAction<CouponData>>;
  setProduct: React.Dispatch<React.SetStateAction<ProductData>>;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({ setCoupon, setProduct }) => {
  const [allCategories, setAllCategories] = useState<CategoryDataResponse[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  useEffect(() => {
    const selectedIds = selectedCategories.map((category) => category.id);

    setProduct((prevProduct) => ({
      ...prevProduct,
      category: selectedIds,
    }));

    setCoupon((prevCoupon) => ({
      ...prevCoupon,
      targetIds: selectedIds,
    }));
  }, [selectedCategories, setProduct, setCoupon]);

  const handleOpenCategories = async () => {
    if (!isPopoverOpen) {
      try {
        setCategoriesLoading(true);
        const response = await getAllCategories();
        setAllCategories(response);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      } finally {
        setCategoriesLoading(false);
      }
    }
  };

  const findParentCategories = (categoryId: string, categories: CategoryDataResponse[]): Category[] => {
    const parents: Category[] = [];

    const findParent = (id: string, list: CategoryDataResponse[]) => {
      for (const category of list) {
        if (category.children.some((child) => child.id === id)) {
          parents.push({ id: category.id, name: category.name });
          findParent(category.id, categories);
        }

        if (category.children.length > 0) {
          findParent(id, category.children);
        }
      }
    };

    findParent(categoryId, categories);
    return parents;
  };

  const handleCategoryChange = (categoryId: string, categoryName: string) => {
    setSelectedCategories((prev) => {
      let updatedCategories = [...prev];
      const exists = prev.some((cat) => cat.id === categoryId);

      if (exists) {
        updatedCategories = updatedCategories.filter((cat) => cat.id !== categoryId);
      } else {
        updatedCategories.push({ id: categoryId, name: categoryName });

        const parents = findParentCategories(categoryId, allCategories);
        parents.forEach((parent) => {
          if (!updatedCategories.some((cat) => cat.id === parent.id)) {
            updatedCategories.push(parent);
          }
        });
      }

      return updatedCategories;
    });
  };

  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    categoryId: string
  ) => {
    event.preventDefault();
    setSelectedCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
  };

  return (
    <div className='w-full border rounded-md'>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger
          asChild
          onClick={handleOpenCategories}
          className='w-full'
        >
          <div className='flex justify-between items-center w-full'>
            <div className={`${selectedCategories.length > 0 ? 'flex' : 'hidden'} flex-wrap items-center my-2 gap-y-2 w-full`}>
              {selectedCategories.map((selected) => (
                <div key={selected.id} className='relative'>
                  <span className='text-sm font-medium px-3 py-1 ml-2 bg-gray-600/10 rounded-full'>
                    {selected.name}
                  </span>
                  <Button
                    onClick={(e) => handleDelete(e, selected.id)}
                    className='absolute h-auto -top-1 -right-1 p-1 bg-red-300 hover:bg-red-500 [&_svg]:size-2'
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
        <PopoverContent className='w-full min-w-[var(--radix-popper-anchor-width)] max-h-96 overflow-y-auto'>
          {categoriesLoading ? (
            <p>Đang tải danh mục...</p>
          ) : allCategories.length === 0 ? (
            <p className="text-center text-gray-500">Không tìm thấy danh mục nào.</p>
          ) : (
            <div className='grid grid-cols-3 gap-6 items-start'>
              {allCategories.map((category) =>
                category.children.length === 0 ? (
                  <div key={category.id} className='flex justify-between items-center'>
                    <Label htmlFor={category.id}>{category.name}</Label>
                    <Checkbox
                      id={category.id}
                      checked={selectedCategories.some((c) => c.id === category.id)}
                      onCheckedChange={() => handleCategoryChange(category.id, category.name)}
                    />
                  </div>
                ) : (
                  <div key={category.id}>
                    <Label htmlFor={category.id}>{category.name}</Label>
                    <div className='ml-3'>
                      {category.children.map((child) =>
                        child.children.length === 0 ? (
                          <div key={child.id} className='flex justify-between items-center'>
                            <Label htmlFor={child.id}>{child.name}</Label>
                            <Checkbox
                              id={child.id}
                              checked={selectedCategories.some((c) => c.id === child.id)}
                              onCheckedChange={() => handleCategoryChange(child.id, child.name)}
                            />
                          </div>
                        ) : (
                          <div key={child.id}>
                            <Label>{child.name}</Label>
                            <div className='ml-3'>
                              {child.children.map((subChild) => (
                                <div key={subChild.id} className='flex justify-between items-center ml-3 my-1'>
                                  <Label htmlFor={subChild.id}>{subChild.name}</Label>
                                  <Checkbox
                                    id={subChild.id}
                                    checked={selectedCategories.some((c) => c.id === subChild.id)}
                                    onCheckedChange={() => handleCategoryChange(subChild.id, subChild.name)}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CategorySelection;
