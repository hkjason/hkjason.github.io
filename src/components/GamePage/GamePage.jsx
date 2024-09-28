import React from 'react';
import styles from './GamePage.module.css';

import { useParams } from 'react-router-dom';

import games from "../../data/games.json";
import { getImageUrl } from '../../utils';

import { NotFound } from '../NotFound/NotFound.jsx';

export const GamePage = () => {
    const { gameId } = useParams();
    const game = games.find((g)=> g.id === gameId);

    if (!game) {
        return < NotFound/>
    }

    return (
        <section id = "gamepage" className = {styles.gamepageBackground}>
            <div className = {styles.gamepage}>
                <h1>{game.title}</h1>
                <table>
                    <tbody>
                        <tr>
                            <td>software: </td>
                            <td>{game.software}</td>
                        </tr>
                        <tr>
                            <td>languages: </td>
                            <td>{game.languages}</td>
                        </tr>
                    </tbody>
                </table>
                <p>{game.description}</p>
                <div className={styles.gameImages}>
                    {game.images.map((image, index) => (
                        <img
                            key={index}
                            src={getImageUrl(image)}
                            alt={`${game.title} image ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};