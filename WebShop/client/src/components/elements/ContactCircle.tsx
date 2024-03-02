import React, { useContext, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';

interface ContactCircleProps {
  icon: React.ReactNode;
  mainText: string;
  text: React.ReactNode;
  text2: React.ReactNode;
}

const ContactCircle: React.FC<ContactCircleProps> = (props) => {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const contactCircleBackgrounds = document.querySelectorAll('.contactCircle-background');

    contactCircleBackgrounds.forEach((background) => {
      const element = background as HTMLElement;
      if (theme === 'dark') {
        element.style.backgroundColor = 'white';
      } else {
        element.style.backgroundColor = 'rgb(0, 0, 0, 0.9)';
      }
    });
  }, [theme]);

  return (
    <div className='flex items-center  space-x-4 '>
      <div className='flex justify-center items-center w-20 h-20 contactCircle-background rounded-full shadow-button'>
        {props.icon}
      </div>
      <div className='space-y-2'>
        <p className='text-2xl font-bold text-[#2bbcff]'>{props.mainText}</p>
        <p className='text-xl dark:text-white  text-black/80 font-lato'>{props.text}</p>
        <p className='text-xl  text-black/80 dark:text-white font-lato  w-auto'>{props.text2}</p>
      </div>
    </div>
  );
}

export default ContactCircle;