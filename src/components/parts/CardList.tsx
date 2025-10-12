//해당 컴포넌트는 AI를 이용하여 만든 테스트 컴포넌트입니다.
import React from 'react'
import S3Image from '@/components/common/S3Image'

interface CardListItemProps {
  image: string
  imageAlt: string
  title: string
  description?: string
  subtitle?: string
  category?: string
  className?: string
  onClick?: () => void
}

interface CardListProps {
  items: CardListItemProps[]
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

const CardListItem: React.FC<CardListItemProps> = ({
  image,
  imageAlt,
  title,
  description,
  subtitle,
  category,
  className = '',
  onClick,
}) => {
  return (
    <article
      className={`flex items-start gap-4 p-4 md:p-6 border border-gray-300 rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.()
        }
      }}
      aria-label={`${title} 카드`}
    >
      <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-28 relative border border-gray-300 rounded-md overflow-hidden bg-gray-50">
        <S3Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 144px"
        />
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        {category && <span className="text-xs sm:text-sm text-gray-500 font-medium">{category}</span>}
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 truncate">{title}</h3>
        {subtitle && <p className="text-sm sm:text-base text-gray-700 truncate">{subtitle}</p>}
        {description && <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{description}</p>}
      </div>
    </article>
  )
}

const CardList: React.FC<CardListProps> = ({ items, className = '', orientation = 'vertical' }) => {
  const gridClass =
    orientation === 'horizontal'
      ? 'grid grid-cols-1 gap-4 md:gap-6'
      : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'

  return (
    <section className={`w-full ${className}`} aria-label="카드 리스트">
      <div className={gridClass}>
        {items.map((item, index) => (
          <CardListItem key={index} {...item} />
        ))}
      </div>
    </section>
  )
}

export default CardList
export { CardListItem }
export type { CardListProps, CardListItemProps }
