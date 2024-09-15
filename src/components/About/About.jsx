import React from 'react';
import styles from './About.module.css';

export const About = () => {
    return (
        <section id="about" className = {styles.aboutSection}>
            <h2>About</h2>
            <div>
                <p>
                    Hello! I'm <b>Jason Yeung</b>, a passionate game developer based in London, UK. 
                    I'm currently completing my <b>Master's in Computer Science</b> at <b>Queen Mary University of London</b>, 
                    where I expect to graduate with <b>distinction</b>. 
                    Specialising in <b>Unity</b> and <b>C#</b>, I've worked on several projects that have allowed me to 
                    hone my game programming skills. With each new development, my confidence in crafting 
                    engaging and dynamic experiences continues to grow.
                </p>
                <p>
                    One of my proudest accomplishments is my MSc project, <b>Cave Diver</b>—a procedurally generated cave exploration game. 
                    I implemented advanced generation algorithms using agents, cellular automata, simplex noise, and marching cubes 
                    to create dynamic cave systems. I've also worked on various other projects, especially in the roguelike and procedural 
                    generation genres, areas I'm deeply passionate about.
                    Additionally, I had the opportunity to work with <b>Binary Tree Studio</b> as a game tester for <b>Siege of Dungeon</b>, 
                    where I identified bugs and provided game design improvement suggestions.
                </p>
                <p>
                    I'm always excited by new challenges and thrive on solving complex programming problems. 
                    My passion for gaming drives me to constantly learn, improve, and push the boundaries of what's possible in game development. 
                    If you're looking for a creative and dedicated game developer, feel free to reach out—I'd love to connect!
                </p>
                <div className = {styles.contact}>
                    <a href="mailto:jasonyeunghk99@gmail.com" target="_blank">
                        Contact email: <b>jasonyeunghk99@gmail.com</b>
                    </a>
                </div>
            </div>
        </section>
    );
};