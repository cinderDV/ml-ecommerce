// components/CategoryHeader.tsx
import Image from 'next/image';
import Link from 'next/link';

interface CategoryHeaderProps {
  title: string;
  description: string;
  backgroundImage: string;
  topBannerText?: string;
  topBannerLink?: string;
}

export default function CategoryHeader({
  title,
  description,
  backgroundImage,
}: CategoryHeaderProps) {
  return (
    <div className="relative">

      {/* Hero Section */}
      <div className="relative h-[500px] w-full overflow-hidden">
        {/* Background Image */}
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              {title}
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}