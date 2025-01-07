import Image from 'next/image'

interface AvatarProps {
  src: string
  alt: string
  className?: string
}

export function Avatar({ src, alt, className = '' }: AvatarProps) {
  return (
    <div className={`relative rounded-full overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={64}
        height={64}
        className="object-cover"
      />
    </div>
  )
}
