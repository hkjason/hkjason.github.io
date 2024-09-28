import React, {useState, useRef, useEffect} from 'react';
import styles from './MainNavbar.module.css';

import { GiHamburgerMenu } from "react-icons/gi";

export const MainNavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
          if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuOpen(false);
          }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [menuRef]);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className = {styles.navbar}>
            <header>
                <a href="#" className = {styles.title}>
                    Jason Yeung
                </a>
            </header>
            <nav className = {styles.menu} ref={menuRef}>
                <GiHamburgerMenu className = {styles.menuBtn} size={24} onClick={toggleMenu}></GiHamburgerMenu>
                <ul className={`${styles.menuItems} ${menuOpen ? styles.active : ''}`} onClick={toggleMenu}>
                    <li>
                        <a href="#about">About</a>
                    </li>
                    <li>
                        <a href="#projects">Projects</a>
                    </li>
                    {/* 
                    <li>
                        <a href="#experience">Experience</a>
                    </li>
                    */}
                </ul>
            </nav>
        </div>
    );
};