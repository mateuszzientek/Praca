import React, { useContext } from "react";
import { ThemeContext } from './ThemeContext';

function BackgroundMain({ children }) {

    const { theme, setTheme } = useContext(ThemeContext);

    return (
        <div className={
            theme === "dark" ? "main-background-black" : "main-background"
        } >
            {children}
        </div>

    );
}

export default BackgroundMain;