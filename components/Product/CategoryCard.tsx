import Image from "next/image";

export interface CategoryCardProps {
  id: number;
  name: string;
  description: string;
  image: string;
}

export default function CategoryCard({
  name,
  description,
  image,
}: CategoryCardProps) {
  return (
    <div className="group col-span-1 md:col-span-2 rounded-xl overflow-hidden bg-white shadow-[0_2px_3px_rgba(0,0,0,0.15),0_6px_10px_rgba(0,0,0,0.12)] hover:shadow-[0_4px_6px_rgba(0,0,0,0.18),0_12px_20px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300">
      <div className="p-2 pb-0">
        <div className="relative aspect-[4/3] md:aspect-[8/3] w-full overflow-hidden bg-neutral-100 rounded-lg">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, 66vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-lg" />

          <div className="absolute bottom-0 left-0 p-4">
            <p className="text-xs uppercase tracking-widest text-white/70 mb-0.5">
              Colección
            </p>
            <h3 className="text-lg font-semibold text-white">{name}</h3>
          </div>
        </div>
      </div>

      <div className="px-4 py-3.5">
        <p className="text-sm text-neutral-500">{description}</p>
      </div>
    </div>
  );
}
