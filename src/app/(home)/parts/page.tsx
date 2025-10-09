"use client";

import React from "react";

import ContactCard from "@/components/parts/ContactCard";
import SocialPost from "@/components/parts/SocialPost";
import Button from "@/components/parts/Button";

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
      <div className="border-2 border-red-500">
        <ContactCard
          name="링코"
          phone="010-1234-5678"
          imageUrl="https://image.utoimage.com/preview/cp872722/2022/12/202212008462_500.jpg"
        />
      </div>
    </div>
  );
};

export default PartsPage;
