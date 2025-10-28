import React from "react";

const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <div className="mb-5">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-sm text-gray-500 mt-1 font-medium">{subtitle}</p>
    </div>
  );
};

export default Header;
