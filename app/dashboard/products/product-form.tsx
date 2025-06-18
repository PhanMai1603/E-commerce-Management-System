/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Star, EllipsisVertical, Plus, ScanQrCode } from "lucide-react";
import {
  deleteProduct,
  getAllProduct,
  getShopProducts,
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
import CategoryFilterSheet from "@/components/filter/category";
import { syncQdrant } from "@/app/api/chat";
import SortSelected from "@/components/filter/ProductFilterPage";

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
  const [filters, setFilters] = useState({}); // 🟦 Thêm state filter
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [sort, setSort] = useState(""); // Thêm state sort
  const [filterVisible, setFilterVisible] = useState(false);

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

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     if (!userId || !accessToken) return;

  //     setLoading(true);
  //     try {
  //       const response = query.trim()
  //         ? await getTopSearchProduct(query, userId, accessToken, page, size)
  //         : await getAllProduct(userId, accessToken, page, size);

  //       setProducts(response.items);
  //       setTotalPages(response.totalPages);
  //     } catch (err) {
  //       toast.error("Lấy danh sách sản phẩm thất bại");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProducts();
  // }, [query, page, size, userId, accessToken]);
  useEffect(() => {
    const fetchProducts = async () => {
      if (!userId || !accessToken) return;
      setLoading(true);
      try {
        let response;
        // Gộp sort vào filters
        const queryFilters = { ...filters, sort };
        if (Object.keys(filters).length > 0 || sort) {
          response = await getShopProducts(queryFilters, page, size, userId, accessToken);
        } else if (query.trim()) {
          response = await getTopSearchProduct(query, userId, accessToken, page, size);
        } else {
          response = await getAllProduct(userId, accessToken, page, size);
        }
        setProducts(response.items);
        setTotalPages(response.totalPages);
      } catch (err) {
        toast.error("Lấy danh sách sản phẩm thất bại");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, sort, query, page, size, userId, accessToken]);


  // Khi filter đổi, reset page về 1
  const handleFilter = (newFilters: any) => {
    setPage(1);
    setFilters(newFilters);
  }
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
        <CardHeader className="p-4">
          {/* Container chia 2 vùng - desktop ngang, mobile dọc */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between w-full">
            {/* Trái: Hiển thị & Tìm kiếm */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-2 w-full md:w-auto">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <label className="text-sm text-muted-foreground whitespace-nowrap">Hiển thị:</label>
                <Select
                  value={size.toString()}
                  onValueChange={(val) => {
                    setSize(Number(val));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-10 rounded-md px-3 py-2 text-sm w-full md:w-auto">
                    <SelectValue placeholder="Chọn số dòng mỗi trang" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 25, 50, 100].map((option) => (
                      <SelectItem key={option} value={option.toString()}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-60">
                <SearchBar setQuery={debouncedSetQuery} />
              </div>
            </div>
            {/* Phải: Các nút - mobile xuống dưới, full width từng nút */}
            <div className="flex flex-col gap-2 w-full md:w-auto md:flex-row md:items-center md:justify-end">
              <SortSelected setSort={setSort} />
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    await syncQdrant(userId, accessToken);
                    toast.success("Đồng bộ dữ liệu AI thành công!");
                  } catch (err) {
                    toast.error("Đồng bộ thất bại.");
                    console.error(err);
                  }
                }}
                className="text-sm w-full md:w-auto"
              >
                Cập nhật dữ liệu AI
              </Button>
              <div className="w-full md:w-auto">
                <CategoryFilterSheet
                  userId={userId}
                  accessToken={accessToken}
                  onFilter={(products) => {
                    setProducts(products.items);
                    setTotalPages(1);
                    setPage(1);
                  }}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/qr-import")}
                className="flex items-center gap-2 w-full md:w-auto"
              >
                <ScanQrCode className="w-4 h-4" />
                <span className="hidden md:inline">Quét QR</span>
              </Button>
              <Button
                onClick={() => router.push("/dashboard/products/create")}
                className="flex items-center gap-2 w-full md:w-auto"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden md:inline">Thêm sản phẩm</span>
              </Button>
            </div>
          </div>
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
              <Table className="product-table-mobile">
                {/* Chỉ hiện header ở desktop */}
                <TableHeader className="hidden md:table-header-group">
                  <TableRow>
                    <TableHead>QR</TableHead>
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
                    <TableRow
                      key={product.id}
                      className="md:table-row product-table-mobile-row"
                    >
                      {/* QR code */}
                      <TableCell className="product-table-mobile-cell">
                        <span className="product-table-mobile-label md:hidden">QR:</span>
                        {product.qrCode && (
                          <img
                            src={product.qrCode}
                            alt={`QR ${product.code}`}
                            className="w-14 h-14 object-contain border rounded-md"
                          />
                        )}
                      </TableCell>

                      {/* Hình ảnh */}
                      <TableCell className="product-table-mobile-cell">
                        <span className="product-table-mobile-label md:hidden">Hình ảnh:</span>
                        {product.mainImage && (
                          <img
                            src={product.mainImage}
                            alt={product.name}
                            className="w-14 h-14 rounded-xl border object-cover shadow-sm"
                          />
                        )}
                      </TableCell>

                      {/* Tên */}
                      <TableCell className="product-table-mobile-cell">
                        <span className="product-table-mobile-label md:hidden">Tên:</span>
                        <span className="font-medium">{product.name}</span>
                      </TableCell>

                      {/* Giá */}
                      <TableCell className="product-table-mobile-cell">
                        <span className="product-table-mobile-label md:hidden">Giá:</span>
                        <span className="text-gray-500 font-medium">{product.minPrice}đ</span>
                      </TableCell>

                      {/* Tồn kho (ẩn trên mobile) */}
                      <TableCell className="product-table-mobile-cell hide-on-mobile md:table-cell">
                        <span className="product-table-mobile-label md:hidden">Tồn kho:</span>
                        <div>
                          <div className="text-gray-700 font-medium">
                            {product.quantity} sản phẩm còn lại
                          </div>
                          <div className="text-gray-500 text-sm">
                            {product.sold} đã bán
                          </div>
                        </div>
                      </TableCell>

                      {/* Đánh giá (ẩn trên mobile) */}
                      <TableCell className="product-table-mobile-cell hide-on-mobile md:table-cell">
                        <span className="product-table-mobile-label md:hidden">Đánh giá:</span>
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

                      {/* Trạng thái */}
                      <TableCell className="product-table-mobile-cell">
                        <span className="product-table-mobile-label md:hidden">Trạng thái:</span>
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
                          {getStatusLabel(product.status)}
                        </span>
                      </TableCell>

                      {/* Hành động */}
                      <TableCell className="product-table-mobile-cell text-right">
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
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((prev) => Math.max(prev - 1, 1));
                  }}
                >
                  Trước
                </PaginationLink>
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
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((prev) => Math.min(prev + 1, totalPages));
                  }}
                >
                  Sau
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </div>
  );
}
