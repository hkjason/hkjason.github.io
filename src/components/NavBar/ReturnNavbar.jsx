import React, {useState, useRef, useEffect} from 'react';
import styles from './ReturnNavBar.module.css';

import { useNavigate } from 'react-router-dom';

import { IoMdArrowRoundBack } from "react-icons/io";

export const ReturnNavBar = () => {
    const navigate = useNavigate();
    const backClick = () => {
        navigate("/");
    };

    return (
        <div className = {styles.navbar}>
            <header>
                <div className = {styles.title} onClick={backClick}>
                    <IoMdArrowRoundBack />
                    <p>Jason Yeung</p>
                </div>
            </header>
        </div>
    );
};