import Link from 'next/link';
import Image from 'next/image';

interface SectorCardProps {
  id: string;
  name: string;
  image: string;
  description: string;
}

const SectorCard = ({ id, name, image, description }: SectorCardProps) => {
  return (
    <Link href={/sector/} className="block">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition group">
        <div className="relative h-40 w-full">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1">{name}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default SectorCard;
