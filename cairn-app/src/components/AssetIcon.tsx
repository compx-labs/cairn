// app/components/AssetIcon.tsx
import { useState } from "react";
import { useAsa } from "../contexts/AsaContext";

interface AssetIconProps {
  assetId: number | string;
  symbol: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AssetIcon({
  assetId,
  symbol,
  size = "md",
  className = "",
}: AssetIconProps) {
  const { getAsaLogo } = useAsa();
  const [imageError, setImageError] = useState(false);

  const logo = getAsaLogo(assetId.toString());

  // If we have a logo and no image error, try to display the image
  if (logo?.png && !imageError) {
    return (
      <img
        src={logo.png}
        alt={symbol}
        className={`rounded-full object-cover ${getSizeClasses(size)} ${className}`}
        onError={() => setImageError(true)}
      />
    );
  }

  // Fallback to text representation
  return (
    <div
      className={`flex items-center justify-center bg-ink-100 dark:bg-dark-border rounded-full text-ink-600 dark:text-dark-text-muted font-medium ${getSizeClasses(size)} ${className}`}
    >
      {getSymbolInitials(symbol)}
    </div>
  );
}

function getSizeClasses(size: "sm" | "md" | "lg"): string {
  switch (size) {
    case "sm":
      return "w-4 h-4 text-xs";
    case "md":
      return "w-6 h-6 text-sm";
    case "lg":
      return "w-8 h-8 text-base";
    default:
      return "w-6 h-6 text-sm";
  }
}

function getSymbolInitials(symbol: string): string {
  if (symbol === "ALGO") return "A";
  if (symbol.length <= 2) return symbol;

  // For longer symbols, take first 2 characters
  return symbol.slice(0, 2);
}