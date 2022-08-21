import React, { useState } from 'react';
import UsersForm from '../components/UsersForm';
import UserList from '../components/UsersList';
import { User } from '../interfaces/interfaces';

type Props = {};

const Body = (props: Props) => {
    const cardsState = useState<User[]>([]);
    
    return (
        <div className='Body' >
            {/* @ts-ignore */ }
            <UsersForm cardsState={cardsState} />
            <UserList cardsState={cardsState}/>
        </div>
    );
}

export default Body;