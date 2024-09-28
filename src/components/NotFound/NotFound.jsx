import React from 'react';
import styles from './NotFound.module.css';

export const NotFound = () => {
    return (
        <section id="notfound" className = {styles.NotFound}>
            <h1 className= {styles.title} >404</h1>
            <p className= {styles.text}>Opps! Page is not found at this address.</p>
        </section>
    );
};