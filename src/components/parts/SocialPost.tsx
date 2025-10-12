//해당 컴포넌트는 AI를 이용하여 만든 테스트 컴포넌트입니다.
import React, { useState } from 'react'
import Image from 'next/image'
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react'
import DefaultImage from '@/assets/images/part-default-image.jpg'

const SocialPost = () => {
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likes, setLikes] = useState(124)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Image src={DefaultImage} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <h3 className="font-semibold text-sm">username</h3>
            <p className="text-xs text-gray-500">Location</p>
          </div>
        </div>
        <button className="text-gray-600 hover:text-gray-800">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Image */}
      <div className="w-full aspect-square bg-gray-100">
        <Image src={DefaultImage} alt="Post" className="w-full h-full object-cover" />
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className="transition-colors hover:text-gray-500">
              <Heart size={24} className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-800'} />
            </button>
            <button className="text-gray-800 hover:text-gray-500 transition-colors">
              <MessageCircle size={24} />
            </button>
            <button className="text-gray-800 hover:text-gray-500 transition-colors">
              <Share2 size={24} />
            </button>
          </div>
          <button onClick={() => setIsSaved(!isSaved)} className="text-gray-800 hover:text-gray-500 transition-colors">
            <Bookmark size={24} className={isSaved ? 'fill-gray-800' : ''} />
          </button>
        </div>

        {/* Likes */}
        <p className="font-semibold text-sm mb-2">{likes.toLocaleString()} likes</p>

        {/* Caption */}
        <div className="text-sm">
          <span className="font-semibold mr-2">username</span>
          <span className="text-gray-800">
            This is a sample caption for the post. It can be longer with multiple lines...
          </span>
          <button className="text-gray-500 ml-1">more</button>
        </div>

        {/* Comments */}
        <button className="text-gray-500 text-sm mt-2 block">View all 48 comments</button>

        {/* Time */}
        <p className="text-xs text-gray-400 mt-2 uppercase">2 hours ago</p>
      </div>
    </div>
  )
}

export default SocialPost
