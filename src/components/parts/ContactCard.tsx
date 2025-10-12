//해당 컴포넌트는 AI를 이용하여 만든 테스트 컴포넌트입니다.
import React from 'react'
import Image from 'next/image'
import DefaultImage from '@/assets/images/part-default-image.jpg'

interface ContactCardProps {
  name: string
  phone: string
  imageUrl: string
  imageAlt?: string
}

const ContactCard: React.FC<ContactCardProps> = ({ name, phone, imageUrl, imageAlt = 'Profile picture' }) => {
  return (
    <div className="">
      <div className="flex flex-col items-center space-y-4 sm:space-y-6 border-2 border-blue-500 p-4">
        {/* Profile Image */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
          <Image
            src={DefaultImage}
            alt={imageAlt}
            className="w-full h-full rounded-full object-cover shadow-lg"
            loading="lazy"
          />
        </div>

        {/* Contact Information */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{name}</h1>
          <a
            href={`tel:${phone.replace(/\D/g, '')}`}
            className="text-base sm:text-lg md:text-xl text-gray-700 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded px-2 py-1"
            aria-label={`Call ${name} at ${phone}`}
          >
            {phone}
          </a>
        </div>
      </div>
    </div>
  )
}

export default ContactCard
