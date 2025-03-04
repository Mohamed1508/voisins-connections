
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface CountrySearchProps {
  onSearch: (country: string) => void;
}

const CountrySearch = ({ onSearch }: CountrySearchProps) => {
  const [query, setQuery] = useState("");
  const { translations } = useLanguage();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };
  
  return (
    <div className="absolute top-4 left-4 w-1/2">
      <Card className="shadow-lg bg-background/90 backdrop-blur-sm">
        <CardContent className="p-2">
          <form onSubmit={handleSubmit} className="relative w-full">
            <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={translations.searchAddress}
              className="pl-8 pr-4 py-1 w-full rounded-md text-sm border border-border bg-background"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CountrySearch;
