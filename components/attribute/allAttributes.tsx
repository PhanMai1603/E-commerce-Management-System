"use client";
import { AttributeItem } from "@/interface/attribute";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  attributes: AttributeItem[];
  loading: boolean;
  onEdit: (id: string) => void;
  onView: (attribute: AttributeItem) => void;
  page: number;
  setPage: (page: number) => void;
  size: number;
  setSize: (size: number) => void;
  totalPages: number;
}

export default function AttributeTable({
  attributes,
  loading,
  onEdit,
  page,
  setPage,
  size,
  setSize,
  totalPages,
}: Props) {
  return (
    <div className="col-span-2">
      <h1 className="text-2xl font-bold mb-6">Danh sách thuộc tính</h1>
      <Card>
        <CardHeader>
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
                  <SelectValue placeholder="Chọn số dòng" />
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
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Tên thuộc tính</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Giá trị</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : attributes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    Không có thuộc tính nào.
                  </TableCell>
                </TableRow>
              ) : (
                attributes.map((attr) => (
                  <TableRow key={attr.id}>
                    <TableCell className="font-medium">{attr.name}</TableCell>
                    <TableCell>{attr.type}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto pr-2 custom-scrollbar">
                        {attr.values.map((val, i) => (
                          <div
                            key={`${val.valueId}-${i}`}
                            className="flex items-center gap-1 border border-gray-300 px-2 py-1 rounded text-sm break-all"
                          >
                            {attr.type === "COLOR" ? (
                              <HoverCard>
                                <HoverCardTrigger asChild>
                                  <div className="flex items-center gap-1 cursor-pointer">
                                    <span>{val.value}</span>
                                    <span
                                      className="inline-block w-4 h-4 rounded-full border"
                                      style={{
                                        backgroundColor: val.descriptionUrl,
                                      }}
                                    />
                                  </div>
                                </HoverCardTrigger>
                              </HoverCard>
                            ) : attr.type === "TEXT" &&
                              val.descriptionUrl ? (
                              <HoverCard>
                                <HoverCardTrigger asChild>
                                  <span className="cursor-pointer">
                                    {val.value}
                                  </span>
                                </HoverCardTrigger>
                                <HoverCardContent className="text-sm break-words p-2 max-w-xs">
                                  {val.descriptionUrl}
                                </HoverCardContent>
                              </HoverCard>
                            ) : (
                              <span>{val.value}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <EllipsisVertical className="cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(attr.id)}>
                            Chỉnh sửa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>

<CardFooter className="border-t pt-3 flex flex-col md:flex-row items-center justify-between gap-4">
  <Pagination className="mt-4">
    <PaginationContent>
      <PaginationItem>
        <PaginationLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (page > 1) setPage(page - 1);
          }}
        >
          Trước
        </PaginationLink>
      </PaginationItem>

      {Array.from({ length: totalPages }).map((_, index) => {
        const pageNumber = index + 1;
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

      <PaginationItem>
        <PaginationLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (page < totalPages) setPage(page + 1);
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
