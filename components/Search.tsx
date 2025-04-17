import { useEffect } from "react";
import { Search } from "lucide-react";
import { getTopSearchProduct } from "@/app/api/product"; // Import hàm API
import { Product } from "@/interface/product";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  placeholder?: string;
  width?: number;
  setProducts: (products: Product[]) => void;
  userId: string;
  accessToken: string;
  page: number;
  size: number;
}

export default function SearchBar({
  query,
  setQuery,
  placeholder = "Search",
  width,
  setProducts,
  userId,
  accessToken,
  page,
  size,
}: SearchBarProps) {

  useEffect(() => {
    const fetchSearch = async () => {
      if (query.trim()) { // Nếu query không phải chuỗi trống
        try {
          const result = await getTopSearchProduct(query, userId, accessToken, page, size);
          setProducts(result.products); // Cập nhật danh sách sản phẩm
        } catch (error) {
          console.error("Search failed:", error);
        }
      }
    };

    // Gọi API tìm kiếm khi query thay đổi
    const timeoutId = setTimeout(fetchSearch, 500); // debounce 500ms
    return () => clearTimeout(timeoutId); // Dọn dẹp khi component unmount hoặc query thay đổi
  }, [query, userId, accessToken, page, size, setProducts]);

  return (
    <div className="relative flex items-center" style={{ width }}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
      <input
        className="pl-10 pr-5 py-2 w-full rounded-lg border"
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)} // set query khi người dùng gõ
        style={{ borderColor: "black" }}
      />
    </div>
  );
}
