import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { User, ReactState } from '../interfaces/interfaces';
import UsersListCard from './UsersListCard';

interface Props {
    cardsState: ReactState<User[]>
}

const UserList = (props: Props) => {
    const [cards, setCards] = props.cardsState;

    useEffect(() => {
        axios.get(import.meta.env.VITE_BASE_API + '/users/')
            .then(res => setCards(res.data))
            .catch(console.error);
    }, []);

    function formatCard(card: User): JSX.Element {
        /* @ts-ignore */
        return <UsersListCard key={card.id} user={card} cards={props.cardsState} />
    }

    return (
        <div className='card-container'>
            {cards.map(formatCard)}
        </div>
    )
}

export default UserList