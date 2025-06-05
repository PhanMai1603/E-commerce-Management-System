import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { debounce } from "lodash";

interface SearchBarProps {
  setQuery: (query: string) => void;
  placeholder?: string;
  width?: number | string;
}

export default function SearchBar({
  setQuery,
  placeholder = "Search...",
  width,
}: SearchBarProps) {
  const [localInput, setLocalInput] = useState("");

  const debouncedUpdateQuery = useMemo(
    () => debounce((value: string) => setQuery(value), 500),
    [setQuery]
  );

  useEffect(() => {
    debouncedUpdateQuery(localInput);
    return () => debouncedUpdateQuery.cancel(); // cleanup khi unmount
  }, [localInput, debouncedUpdateQuery]);

  return (
    <div className="relative flex items-center" style={{ width }}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
      <Input
        className="pl-10 pr-5 py-2 w-full rounded-lg"
        type="text"
        placeholder={placeholder}
        value={localInput}
        onChange={(e) => setLocalInput(e.target.value)}
      />
    </div>
  );
}

