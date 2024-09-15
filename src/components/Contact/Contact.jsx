import React from 'react';
import styles from './Contact.module.css'
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { MdMail } from "react-icons/md";

export const Contact = () => {
    return (
        <section className = {styles.contact}>
            <div>
                <p className = {styles.title}>
                    Developed by Jason Yeung, using Vite, React, JSX and CSS 
                </p>
            </div>
            <div className = {styles.menu}>
                <ul className = {styles.menuItems}>
                    <li>
                        <a href="mailto:jasonyeunghk99@gmail.com" target="_blank">
                            <MdMail />
                            <span className= {styles.contactText}>Email</span>    
                        </a>
                    </li>
                    <li>
                        <a href="https://github.com/hkjason" target="_blank">
                            <FaGithub />
                            <span className= {styles.contactText}>Github</span> 
                        </a>
                    </li>
                    <li>
                        <a href="https://www.linkedin.com/in/yue-hei-yeung/" target="_blank">
                            <FaLinkedin />
                            <span className= {styles.contactText}>Linkedin</span>
                        </a>
                    </li>
                </ul>
            </div>
        </section>
    );
};