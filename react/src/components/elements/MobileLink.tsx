import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface MobileLinkProps {
  link?: string;
  icon: ReactNode;
  text: string;
}

const MobileLink: React.FC<MobileLinkProps> = ({ link, icon, text }) => {

  if (link) {
    return (
      <div className="px-4 hover:bg-black/10 hover:dark:bg-white/20">
        <NavLink
          to={link}
          style={({ isActive }) => {
            return isActive ? { fontWeight: "700", pointerEvents: "none" } : {};
          }}
          className="text-black dark:text-white text-xl py-4 flex group transition duration-300 hover:scale-105"
        >
          {icon} {text}
        </NavLink>
      </div>
    )
  } else {
    return (
      <div className="px-4 hover:bg-black/10 hover:dark:bg-white/20">
        <div className="text-black dark:text-white text-xl py-4 flex group transition duration-300 hover:scale-105"
        >
          {icon} {text}
        </div>
      </div>
    )
  }

};

export default MobileLink;
