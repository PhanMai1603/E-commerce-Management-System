
import { Search } from 'lucide-react';
import { Input } from './ui/input';


interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  placeholder?: string;
  width?: number;
}

export default function SearchBar({
  query,
  setQuery,
  placeholder = "Search...",
  width,
}: SearchBarProps) {
  return (
    <div className="relative flex items-center" style={{ width }}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
      <Input
        className="pl-10 pr-5 py-2 w-full rounded-lg"
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ borderColor: "black" }}
      />
    </div>
  );
}
