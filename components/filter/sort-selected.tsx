'use client';

import * as React from "react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";

interface SortSelectedProps {
  setSort: (sort: string) => void;
}

const groupedOptions = [
  {
    label: "💰 Giá",
    options: [
      { value: "-MIN_PRICE", label: "Cao tới Thấp" },
      { value: "MIN_PRICE", label: "Thấp tới Cao" },
    ],
  },
  {
    label: "👀 Lượt xem",
    options: [
      { value: "-VIEWS", label: "Nhiều nhất" },
      { value: "VIEWS", label: "Ít nhất" },
    ],
  },
  {
    label: "🛒 Bán chạy",
    options: [
      { value: "-SOLD", label: "Nhiều nhất" },
      { value: "SOLD", label: "Ít nhất" },
    ],
  },
  {
    label: "📦 Tồn kho",
    options: [
      { value: "-QUANTITY", label: "Nhiều nhất" },
      { value: "QUANTITY", label: "Ít nhất" },
    ],
  },
  {
    label: "⭐ Đánh giá",
    options: [
      { value: "-RATING", label: "Cao nhất" },
      { value: "RATING", label: "Thấp nhất" },
    ],
  },
  {
    label: "🕒 Thời gian",
    options: [
      { value: "-CREATED_AT", label: "Mới nhất" },
      { value: "CREATED_AT", label: "Cũ nhất" },
    ],
  },
];

const defaultOption = { value: '', label: 'Sắp xếp' };

export default function SortSelected({ setSort }: SortSelectedProps) {
  const [selected, setSelected] = useState(defaultOption);

  const handleSelect = (option: { value: string, label: string }) => {
    setSelected(option);
    setSort(option.value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-48 justify-between"
        >
          <span>{selected.label}</span>
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52 p-0">
        <DropdownMenuItem
          onClick={() => handleSelect(defaultOption)}
          className={selected.value === '' ? "font-semibold" : ""}
        >
          <span className="flex items-center gap-2">
            {selected.value === '' && <Check className="w-4 h-4 text-indigo-500" />}
            {defaultOption.label}
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {groupedOptions.map((group, i) => (
          <React.Fragment key={group.label}>
            <DropdownMenuLabel className="py-1 text-xs text-gray-400 font-semibold pl-3">
              {group.label}
            </DropdownMenuLabel>
            {group.options.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleSelect(option)}
                className={selected.value === option.value ? "font-semibold" : ""}
              >
                <span className="flex items-center gap-2">
                  {selected.value === option.value && <Check className="w-4 h-4 text-indigo-500" />}
                  {option.label}
                </span>
              </DropdownMenuItem>
            ))}
            {i < groupedOptions.length - 1 && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
