'use client'

import React from 'react'

import ContactCard from '@/components/parts/ContactCard'
import SocialPost from '@/components/parts/SocialPost'
import Button from '@/components/parts/Button'
import CardList from '@/components/parts/CardList'
import FormFieldStates from '@/components/parts/FormFieldStates'

const PartsPage = () => {
  return (
    <div>
      PartsPage
      <SocialPost />
      <Button variant="contained" fullWidth>
        Button
      </Button>
      <Button variant="outlined">Button</Button>
      <Button variant="disabled">Button</Button>
      {/* <div className="border-2 border-red-500">
        <ContactCard
          name="링코"
          phone="010-1234-5678"
          imageUrl="https://image.utoimage.com/preview/cp872722/2022/12/202212008462_500.jpg"
        />
      </div>
      <CardList
        items={[
          {
            image: 'https://image.utoimage.com/preview/cp872722/2022/12/202212008462_500.jpg',
            imageAlt: '링코',
            title: '링코',
            description: '설명설명설명',
            subtitle: '010-1234-5678',
            category: '카테고리',
          },
        ]}
      /> */}
      <FormFieldStates />
    </div>
  )
}

export default PartsPage
