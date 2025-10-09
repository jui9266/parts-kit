import React from "react";

type HeaderProps = {
  title: string;
  description?: string;
};

const Header = ({ title, description }: HeaderProps) => {
  return (
    <div className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        {description && <p className="text-sm text-slate-600">{description}</p>}
      </div>
    </div>
  );
};

export default Header;
