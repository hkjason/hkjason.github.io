import React from 'react';
import styles from './MainPage.module.css';


import { About } from '../About/About.jsx'
import { Projectlist } from '../Projectlist/Projectlist'
import { Contact } from '../Contact/Contact'

export const MainPage = () => {
    return (
        <section id="mainpage" className = {styles.MainPage}>
            <About />
            <Projectlist />
            <Contact />
        </section>
    );
};