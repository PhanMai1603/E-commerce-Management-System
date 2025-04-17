/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star, EllipsisVertical, Plus } from "lucide-react";
import { deleteProduct, getAllProduct } from "@/app/api/product";
import { Product, ProductResponse } from "@/interface/product";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationLink,
} from "@/components/ui/pagination";
import SearchBar from "@/components/Search";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const router = useRouter();

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getAllProduct(userId, accessToken, page, size);
        setProducts(response.products);
        setTotalPages(response.totalPages);
      } catch {
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    // Nếu không có query, lấy tất cả sản phẩm
    if (!query.trim()) {
      fetchProducts();
    }
  }, [query, page, size, userId, accessToken]);



  const handleView = (product: Product) => {
    router.push(`/dashboard/products/${product.id}`);
  };

  const handleEdit = (productId: string) => {
    router.push(`/dashboard/products/${productId}/edit`);
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId, userId, accessToken);
      toast.success("Product deleted successfully!");
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      toast.error("Failed to delete the product.");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-wrap gap-3 items-center justify-between p-4">
        <CardTitle>All Product List</CardTitle>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Select Show per page */}
          <div className="w-full md:w-auto flex items-center gap-2">
            <label className="text-sm text-muted-foreground whitespace-nowrap">
              Show:
            </label>
            <Select
              value={size.toString()}
              onValueChange={(val) => {
                setSize(Number(val));
                setPage(1);
              }}
            >
              <SelectTrigger className="h-10 rounded-md px-3 py-2 text-sm">
                <SelectValue placeholder="Select page size" />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 25, 50, 100].map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search bar */}
          <SearchBar
            query={query}
            setQuery={setQuery}
            setProducts={setProducts}
            userId={userId}
            accessToken={accessToken}
            page={page}
            size={size}
          />

          {/* Add button */}
          <Button
            onClick={() => router.push("/dashboard/products/create")}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </Button>
        </div>
      </CardHeader>


      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.mainImage && (
                        <img
                          src={product.mainImage}
                          className="w-12 h-12 rounded-lg"
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-gray-500 font-medium">
                    {product.originalPrice}đ
                  </TableCell>
                  <TableCell>
                    <div className="text-gray-700 font-medium">
                      {product.quantity} Item Left
                    </div>
                    <div className="text-gray-500 text-sm">
                      {product.sold} Sold
                    </div>
                  </TableCell>
                  <TableCell className="flex items-center gap-1">
                    <div className="flex items-center bg-gray-100 rounded-md px-2 py-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{product.rating}</span>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {product.views} View
                    </span>
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
                        <DropdownMenuItem
                          onClick={() => handleEdit(product.id)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(product.id)}
                        >
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

      <CardFooter className="border-t pt-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Size selector */}

        {/* Pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((prev) => Math.max(prev - 1, 1));
                }}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNumber = i + 1;
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    isActive={pageNumber === page}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {totalPages > 5 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((prev) => Math.min(prev + 1, totalPages));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}
