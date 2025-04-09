/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, EllipsisVertical, Plus, Search } from "lucide-react";
import { deleteProduct, getAllProduct } from "@/app/api/product";
import { Product } from "@/interface/product";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Import ô nhập liệu từ UI
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Thêm state để lưu giá trị tìm kiếm
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        let allProducts: Product[] = [];
        let currentPage = 1;
        let totalPages = 1;

        while (currentPage <= totalPages) {
          const response = await getAllProduct(userId, accessToken, currentPage, 100);
          allProducts = [...allProducts, ...response.products];
          totalPages = response.totalPages;
          currentPage++;
        }

        setProducts(allProducts);
      } catch {
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Lọc sản phẩm theo từ khóa tìm kiếm
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle view product
  const handleView = (product: Product) => {
    // Redirect to the product details page
    router.push(`/dashboard/products/${product.id}`);
  };

  // Handle edit product
  const handleEdit = (productId: string) => {
    // Redirect to the product edit page
    router.push(`/dashboard/products/${productId}/edit`);
  };


  const handleDelete = async (productId: string) => {
    try {
      // Call the API to delete the product
      await deleteProduct(userId, accessToken, productId);
      toast.success("Product deleted successfully!");
      // Refresh the list or remove the product from state
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      toast.error("Failed to delete the product.");
    }
  };

  return (
    <Card>
      {/* Header chứa tiêu đề, thanh tìm kiếm và nút thêm sản phẩm */}
      <CardHeader className="flex items-center justify-between p-4">
        <CardTitle>All Product List</CardTitle>

        <div className="flex items-center gap-3">
          {/* Thanh tìm kiếm */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-64 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Nút thêm sản phẩm */}
          <Button onClick={() => router.push("/dashboard/products/create")} className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Product
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.mainImage && (
                        <img src={product.mainImage} className="w-12 h-12 rounded-lg" />
                      )}

                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-gray-500 font-medium">{product.originalPrice}đ</TableCell>
                  <TableCell>
                    <div className="text-gray-700 font-medium">{product.quantity} Item Left</div>
                    <div className="text-gray-500 text-sm">{product.sold} Sold</div>
                  </TableCell>

                  <TableCell className="flex items-center gap-1">
                    <div className="flex items-center bg-gray-100 rounded-md px-2 py-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{product.rating}</span>
                    </div>
                    <span className="text-gray-500 text-sm">{product.views} Review</span>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`inline-block py-1 px-3 rounded-2xl text-sm font-semibold ${product.status === "PUBLISHED"
                        ? "bg-[#00B8D929] text-[#006C9C]"
                        : product.status === "DRAFT"
                          ? "bg-[#919EAB29] text-[#637381]"
                          : product.status === "DISCONTINUED"
                            ? "bg-[#FF563029] text-[#B71D18]"
                            : product.status === "OUT_OF_STOCK"
                              ? "bg-[#FFAB0029] text-[#B76E00]"
                              : "bg-gray-200 text-gray-600"
                        }`}
                    >
                      {product.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <EllipsisVertical className="cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(product)}>
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(product.id)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(product.id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <CardFooter className="border-t pt-3 flex justify-end">
        <span className="text-sm text-gray-500">Total Products: {filteredProducts.length}</span>
      </CardFooter>
    </Card>
  );
}
