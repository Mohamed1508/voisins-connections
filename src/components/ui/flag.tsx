
import { LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FlagProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | string;
  country: string;
}

const Flag = ({
  className,
  size = 16,
  country,
  ...props
}: FlagProps) => {
  // Simple function to get emoji flag from country code
  // Uses the fact that flag emojis are made of 2 regional indicator symbols
  // Each uppercase letter's regional indicator symbol is 127397 points after its ASCII code
  const getCountryFlag = (countryCode: string): string => {
    if (!countryCode || countryCode.length !== 2) return "🏳️";
    
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
      
    return String.fromCodePoint(...codePoints);
  };

  return (
    <div
      className={cn("inline-block", className)}
      style={{ fontSize: size }}
      {...props}
    >
      {getCountryFlag(country)}
    </div>
  );
};

export { Flag };
