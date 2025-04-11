/* eslint-disable prefer-const */
'use client';

import { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronDown, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { getAllCategories } from '@/app/api/category';
import { CategoryDataResponse } from '@/interface/category';
import { ProductDetail } from '@/interface/product';

interface CategorySelectionProps {
  product: ProductDetail;
  setProduct: React.Dispatch<React.SetStateAction<ProductDetail>>;
}

interface SelectedCategories {
  id: string;
  name: string;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({ product, setProduct }) => {
  const [allCategories, setAllCategories] = useState<CategoryDataResponse[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<SelectedCategories[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setCategoriesLoading(true);
      try {
        const response = await getAllCategories();
        setAllCategories(response);
  
        const flattenCategories = (categories: CategoryDataResponse[]): CategoryDataResponse[] => {
          return categories.reduce<CategoryDataResponse[]>((acc, category) => {
            return acc.concat(category, flattenCategories(category.children));
          }, []);
        };
  
        const flatList = flattenCategories(response);
  
        const selected = flatList
          .filter((cat) =>
            product.category.some((c) =>
              typeof c === 'string' ? c === cat.id : c.id === cat.id
            )
          )
          .map((cat) => ({ id: cat.id, name: cat.name }));
  
        setSelectedCategories(selected);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };
  
    fetchData();
  }, [product.category]);
  

  const handleOpenPopover = async () => {
    if (!isPopoverOpen && allCategories.length === 0) {
      setCategoriesLoading(true);
      try {
        const response = await getAllCategories();
        setAllCategories(response);
      } catch (err) {
        console.error('Error loading categories', err);
      } finally {
        setCategoriesLoading(false);
      }
    }

    setIsPopoverOpen((prev) => !prev);
  };

  const findParentCategories = (categoryId: string, categories: CategoryDataResponse[]): SelectedCategories[] => {
    const parents: SelectedCategories[] = [];

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

  const toggleCategory = (id: string, name: string) => {
    setSelectedCategories((prev) => {
      const exists = prev.some((cat) => cat.id === id);
      let updated = exists ? prev.filter((cat) => cat.id !== id) : [...prev, { id, name }];

      if (!exists) {
        const parents = findParentCategories(id, allCategories);
        parents.forEach((parent) => {
          if (!updated.find((cat) => cat.id === parent.id)) {
            updated.push(parent);
          }
        });
      }

      // Cập nhật category trong product luôn
      setProduct((prevProduct) => ({
        ...prevProduct,
        category: updated.map((cat) => ({ id: cat.id, name: cat.name })),
      }));

      return updated;
    });
  };

  const isSelected = (id: string) => selectedCategories.some((cat) => cat.id === id);

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    setSelectedCategories((prev) => {
      const updated = prev.filter((cat) => cat.id !== id);
      setProduct((prevProduct) => ({
        ...prevProduct,
        category: updated.map((cat) => ({ id: cat.id, name: cat.name })),
      }));
      return updated;
    });
  };

  const renderCategoryTree = (categories: CategoryDataResponse[], level = 0) => {
    return categories.map((category) => (
      <div key={category.id} className="ml-2">
        <div className="flex items-center space-x-2 pl-2" style={{ marginLeft: `${level * 10}px` }}>
          <Checkbox
            id={category.id}
            checked={isSelected(category.id)}
            onCheckedChange={() => toggleCategory(category.id, category.name)}
          />
          <Label htmlFor={category.id} className="text-sm">{category.name}</Label>
        </div>
        {category.children && category.children.length > 0 &&
          renderCategoryTree(category.children, level + 1)}
      </div>
    ));
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          onClick={handleOpenPopover}
          className="w-full justify-between"
        >
          {selectedCategories.length > 0
            ? `${selectedCategories.length} selected`
            : 'Select categories'}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[350px] max-h-[400px] overflow-auto" align="start">
        <div className="mb-2">
          {selectedCategories.map((cat) => (
            <div key={cat.id} className="inline-flex items-center bg-gray-100 text-sm px-2 py-1 rounded mr-1 mb-1">
              {cat.name}
              <button onClick={(e) => handleDelete(e, cat.id)}>
                <X className="ml-1 h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-1">
          {categoriesLoading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : (
            renderCategoryTree(allCategories)
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CategorySelection;
