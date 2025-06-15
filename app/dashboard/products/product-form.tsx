/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
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
} from "@/components/ui/card";
import { Star, EllipsisVertical, Plus } from "lucide-react";
import {
  deleteProduct,
  getAllProduct,
  getTopSearchProduct,
} from "@/app/api/product";
import { Product } from "@/interface/product";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchBar from "@/components/Search";
import { debounce } from "lodash";
import ConfirmDialog from "@/components/category/confirm";

// ✅ Hàm dịch trạng thái
const getStatusLabel = (status: string): string => {
  switch (status) {
    case "PUBLISHED":
      return "Đang bán";
    case "DRAFT":
      return "Nháp";
    case "DISCONTINUED":
      return "Ngừng bán";
    case "OUT_OF_STOCK":
      return "Hết hàng";
    default:
      return "Không xác định";
  }
};

export function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";

  const debouncedSetQuery = useMemo(
    () =>
      debounce((val: string) => {
        setQuery(val);
        setPage(1);
      }, 500),
    []
  );

  useEffect(() => {
    const fetchProducts = async () => {
      if (!userId || !accessToken) return;

      setLoading(true);
      try {
        const response = query.trim()
          ? await getTopSearchProduct(query, userId, accessToken, page, size)
          : await getAllProduct(userId, accessToken, page, size);

        setProducts(response.items);
        setTotalPages(response.totalPages);
      } catch (err) {
        toast.error("Lấy danh sách sản phẩm thất bại");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, page, size, userId, accessToken]);

  const handleView = (product: Product) => {
    router.push(`/dashboard/products/${product.id}`);
  };

  const handleEdit = (productId: string) => {
    router.push(`/dashboard/products/${productId}/edit`);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;

    try {
      await deleteProduct(pendingDeleteId, userId, accessToken);
      toast.success("Xoá sản phẩm thành công!");
      setProducts((prev) => prev.filter((p) => p.id !== pendingDeleteId));
    } catch (error) {
      toast.error("Xoá sản phẩm thất bại.");
    } finally {
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };

  const askDelete = (productId: string) => {
    setPendingDeleteId(productId);
    setConfirmOpen(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Danh sách sản phẩm</h1>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground whitespace-nowrap">
                Hiển thị:
              </label>
              <Select
                value={size.toString()}
                onValueChange={(val) => {
                  setSize(Number(val));
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-10 rounded-md px-3 py-2 text-sm">
                  <SelectValue placeholder="Chọn số dòng mỗi trang" />
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

            <SearchBar setQuery={debouncedSetQuery} />
          </div>

          <Button
            onClick={() => router.push("/dashboard/products/create")}
            className="flex items-center gap-2 self-start md:self-auto"
          >
            <Plus className="w-5 h-5" />
            Thêm sản phẩm
          </Button>
        </CardHeader>

        <CardContent className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-60 z-10 flex items-center justify-center">
              <p className="text-gray-600 font-medium">Đang tải...</p>
            </div>
          )}

          <div className={loading ? "opacity-50 pointer-events-none" : ""}>
            {products.length === 0 ? (
              <p className="text-center text-gray-500">Không tìm thấy sản phẩm nào.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hình ảnh</TableHead>
                    <TableHead>Tên</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Tồn kho</TableHead>
                    <TableHead>Đánh giá</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
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
                              alt={product.name}
                              className="w-14 h-14 rounded-xl border object-cover shadow-sm"
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-gray-500 font-medium">
                        {product.minPrice}đ
                      </TableCell>
                      <TableCell>
                        <div className="text-gray-700 font-medium">
                          {product.quantity} sản phẩm còn lại
                        </div>
                        <div className="text-gray-500 text-sm">
                          {product.sold} đã bán
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-gray-100 rounded-md px-2 py-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-medium ml-1">{product.rating}</span>
                          </div>
                          <span className="text-gray-500 text-sm">
                            {product.views} lượt xem
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-block py-1 px-3 rounded-2xl text-sm font-semibold ${
                            product.status === "PUBLISHED"
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
                          {getStatusLabel(product.status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <EllipsisVertical className="cursor-pointer" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(product)}>
                              Xem
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(product.id)}>
                              Sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => askDelete(product.id)}>
                              Xoá
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <ConfirmDialog
              open={confirmOpen}
              onCancel={() => {
                setConfirmOpen(false);
                setPendingDeleteId(null);
              }}
              onConfirm={confirmDelete}
              title="Xác nhận xoá sản phẩm"
              description="Thao tác này sẽ xoá vĩnh viễn sản phẩm. Bạn có chắc chắn?"
            />
          </div>
        </CardContent>

        <CardFooter className="border-t pt-3 flex flex-col md:flex-row items-center justify-between gap-4">
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
    </div>
  );
}
