// src/components/common/SearchResultItem.tsx
import Image from "next/image";
import Link from "next/link";
import { StoryObject } from "@/lib/api/comic/types";

interface SearchResultItemProps {
  story: StoryObject;
  onClick?: () => void;
  asLink?: boolean;
}

export function SearchResultItem({ story, onClick, asLink = true }: SearchResultItemProps) {
  const content = (
    <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent">
      <div className="relative h-12 w-8 overflow-hidden rounded shadow-sm">
        <Image
          src={story.thumb_url || "/fallback-image.png"}
          alt={story.name}
          fill
          className="object-cover"
          sizes="32px"
          onError={(e) => (e.currentTarget.src = "/fallback-image.png")}
        />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-foreground">{story.name}</h4>
        <p className="text-xs text-muted-foreground">
          {(story.views || 0).toLocaleString()} lượt đọc
        </p>
      </div>
    </div>
  );

  return asLink ? (
    <Link href={`/comic/${story.slug}`} onClick={onClick}>
      {content}
    </Link>
  ) : (
    content
  );
}