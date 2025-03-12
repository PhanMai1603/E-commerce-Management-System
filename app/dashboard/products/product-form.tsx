/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, EllipsisVertical, Plus, Search } from "lucide-react";
import { getAllProduct } from "@/app/api/product";
import { Product } from "@/interface/product";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Import ô nhập liệu từ UI

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
      } catch{
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
                        <img src={product.mainImage} alt={product.name} className="w-12 h-12 rounded" />
                      )}
                      <div>
                        <div className="font-semibold">{product.name}</div>
                        <div className="text-sm text-gray-500">
                          Size: {product.variants
                            .filter(v => v.name.toLowerCase() === "size")
                            .map(v => v.options.join(", "))
                            .join(" | ")}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-blue-500 font-semibold">${product.minPrice}</TableCell>
                  <TableCell>
                    <div className="text-green-600 font-semibold">{product.quantity} Item Left</div>
                    <div className="text-gray-500 text-sm">{product.sold} Sold</div>
                  </TableCell>
                  <TableCell className="flex items-center gap-1">
                    <Star className="text-yellow-500 w-4 h-4" />
                    <span className="font-semibold">{product.rating}</span>
                    <span className="text-gray-500 text-sm">({product.views} Review)</span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-block py-1 px-3 rounded-2xl text-sm font-semibold ${
                        product.status === "PUBLISHED"
                          ? "bg-[#00B8D929] text-[#006C9C]"
                          : product.status === "DRAFT"
                          ? "bg-[#919EAB29] text-[#637381]"
                          : product.status === "DELETED"
                          ? "bg-[#FF563029] text-[#B71D18]"
                          : product.status === "OUT_OF_STOCK"
                          ? "bg-[#FFAB0029] text-[#B76E00]"
                          : product.status === "DISCONTINUED"
                          ? "bg-[#6D28D929] text-[#4A148C]"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {product.status}
                    </span>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <EllipsisVertical />
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
