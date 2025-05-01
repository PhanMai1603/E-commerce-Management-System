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

interface CategorySelectionProps {
  setProduct: React.Dispatch<React.SetStateAction<ProductData>>;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({ setProduct }) => {
  const [allCategories, setAllCategories] = useState<CategoryDataResponse[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  useEffect(() => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      category: selectedCategories.map((category) => category.id),
    }));
  }, [selectedCategories, setProduct]);

  const handleOpenCategories = async () => {
    if (!isPopoverOpen) {
      try {
        setCategoriesLoading(true);

        const response = await getAllCategories();
        setAllCategories(response);
      } catch (error) {
        console.error("Error fetching categories:", error);
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

          // Tiếp tục tìm cha của cha (duyệt toàn bộ danh sách)
          findParent(category.id, categories);
        }

        // Kiểm tra con của con (đệ quy xuống các cấp thấp hơn)
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
      let updatedCategories: Category[] = [...prev];

      if (prev.some((category) => category.id === categoryId)) {
        // Nếu đã chọn → Xóa khỏi danh sách
        updatedCategories = updatedCategories.filter((category) => category.id !== categoryId);

      } else {
        // Nếu chưa chọn → Thêm vào danh sách
        updatedCategories.push({ id: categoryId, name: categoryName });

        // Thêm tất cả category cha vào danh sách
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


  const handleDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, categoryId: string) => {
    event.preventDefault();

    setSelectedCategories((prev) => prev.filter((category) => category.id !== categoryId));
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
            <div className={`${selectedCategories.length > 0 ? 'flex': 'hidden'} flex-wrap items-center my-2 gap-y-2 w-full`}>
              {selectedCategories.map((selected) => (
                <div
                  key={selected.id}
                  className='relative'
                >
                  <span className='text-sm text-nowrap font-medium px-3 py-1 ml-2 bg-gray-600/10 rounded-full'>{selected.name}</span>
                  <Button
                    onClick={(event) => handleDelete(event, selected.id)}
                    className='absolute h-auto -top-1 -right-1 p-1 bg-red-300 hover:bg-red-500 [&_svg]:size-2'
                  >
                    <X />
                  </Button>
                </div>
              ))}
            </div>
            <Button className={`flex justify-between items-center px-3 bg-transparent font-normal text-gray-600 hover:bg-transparent ${selectedCategories.length > 0 ? 'w-auto' : 'w-full'}`}>
              Select product categories
              <ChevronDown />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className='w-full min-w-[var(--radix-popper-anchor-width)]'>
          {categoriesLoading ? (
            <p> Loading...</p>
          ) : allCategories.length === 0 ? (
            <p className="text-center text-gray-500">No categories found.</p>
          ) : (
            <div className='grid grid-cols-3 gap-6 items-start'>
              {allCategories.map((categories) => (
                categories.children.length === 0 ? (
                  <div
                    key={categories.id}
                    className='flex justify-between items-center'
                  >
                    <Label htmlFor={categories.id}>{categories.name}</Label>
                    <Checkbox
                      id={categories.id}
                      checked={selectedCategories.some((c) => c.id === categories.id)}
                      onCheckedChange={() => handleCategoryChange(categories.id, categories.name)}
                    />
                  </div>
                ) : (
                  <div key={categories.id}>
                    <Label htmlFor={categories.id}>{categories.name}</Label>
                    <div className='ml-3'>
                      {categories.children.map((category) => (
                        category.children.length === 0 ? (
                          <div
                            key={category.id}
                            className='flex justify-between items-center'
                          >
                            <Label htmlFor={category.id}>{category.name}</Label>
                            <Checkbox
                              id={category.id}
                              checked={selectedCategories.some((c) => c.id === category.id)}
                              onCheckedChange={() => handleCategoryChange(category.id, category.name)}
                            />
                          </div>
                        ) : (
                          <div key={category.id}>
                            <Label>{category.name}</Label>
                            {category.children.map((childCategory) => (
                              <div
                                key={childCategory.id}
                                className={`flex justify-between items-center ml-3 my-1`}
                              >
                                <Label htmlFor={childCategory.id}>{childCategory.name}</Label>
                                <Checkbox
                                  id={childCategory.id}
                                  checked={selectedCategories.some((c) => c.id === childCategory.id)}
                                  onCheckedChange={() => handleCategoryChange(childCategory.id, childCategory.name)}
                                />
                              </div>
                            ))}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default CategorySelection;