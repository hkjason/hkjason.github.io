import React from 'react';
import styles from './Projectlist.module.css';

import projects from "../../data/projects.json";
import { getImageUrl } from '../../utils';

export const Projectlist = () => {
    return (
        <section id = "projects" className = {styles.projectList}>
            <h2>Projects</h2>
            <div>
                {projects.map((project, id) => {
                    const isEven = id % 2 === 0;
                    return (
                        <div key={id} className={`${styles.project} ${isEven ? styles.even : styles.odd}`}>
                            <div className={styles.projectContent}>
                                <h3>{project.title}</h3>
                                <p>{project.description}</p>
                            </div>
                            <div className={styles.projectImage}>  
                                <img src={getImageUrl(project.image)} alt={project.title}></img>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};