import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`font-montserrat text-sm sm:text-base ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-1.5 text-cyberviolet/80">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-semibold text-cyberviolet"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="hover:text-cyberred transition-colors"
                >
                  {item.name}
                </Link>
              )}
              {!isLast && (
                <ChevronRight
                  className="w-3.5 h-3.5 text-cyberviolet/40"
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
