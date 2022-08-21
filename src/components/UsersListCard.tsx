import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { ReactState, User } from '../interfaces/interfaces';

interface Props {
    user: User,
    cards: ReactState<User[]>
}

function capitalize(text: string) {
    const words: string[] = text.split(' ');
    return [...words.map((word: string, idx: number) => (idx > 0 ? ' ' : '') + word.at(0)?.toUpperCase() + word.slice(1))];
}

function useFirstCheck() {
    const isMountRef = useRef<boolean>(false);

    useEffect(() => {
        isMountRef.current = true;
    }, []);

    return isMountRef.current;
}

interface NiceStateActionUpdater<T> {
    (change: T, previous?: boolean): () => T
}

type NiceStateType<T> = [T, NiceStateActionUpdater<T>]

function useNiceState<T>(val: T): NiceStateType<T> {
    const [value, setValue] = useState<T>(val);

    return [value, (change: T, previous?: boolean): () => T => {
        return () => {
            setValue(change);
            return previous ? value : change;
        }
    }];
}

enum compareUsersStatus {
    PATH = -1,
    NONE,
    PUT
}

function compareUsers(userA: User, userB: User): compareUsersStatus {
    const keys = Object.keys(userA);
    let diffs = 0;

    keys.forEach(key => {
        if (userA[key] !== userB[key])
            diffs++;
    });

    console.log('[53] diffs:', diffs);

    if (diffs === 2)
        return compareUsersStatus.PUT;
    else if (diffs === 0)
        return compareUsersStatus.NONE;
    else
        return compareUsersStatus.PATH;
}

const UsersListCard = (props: Props) => {
    const [editing, setEditing] = useState<boolean>(false);
    // const isFirstRender = useFirstCheck();
    const [user, setUser] = useState<User>(props.user);
    const [cards, setCards] = props.cards;
    const userRef = useRef(props.user);

    // useEffect(() => {
    //     if (isFirstRender)
    //         return;

    // }, [editing]);

    function inputChange(member: keyof User): (e: React.ChangeEvent<HTMLInputElement>) => void {
        return (e: React.ChangeEvent<HTMLInputElement>): void => setUser({ ...user, [member]: e.target.value });
    }

    function deleteCard() {
        axios.delete(import.meta.env.VITE_BASE_API + `/users/${user.id}/`)
            .then(() => setCards(cards.filter(card => card.id !== user.id)))
            .catch(console.error);
    }

    /*
    How this works?

    This compares the user data with a temp user data and uses the correct HTTP method for the API request
    */
    function editCard() {
        if (editing) {
            let pet;

            switch (compareUsers(userRef.current, user)) {
                case compareUsersStatus.PATH:
                    pet = axios.patch(import.meta.env.VITE_BASE_API + `/users/${user.id}/`, user)
                    break;
                case compareUsersStatus.NONE:
                    break;
                case compareUsersStatus.PUT:
                    pet = axios.put(import.meta.env.VITE_BASE_API + `/users/${user.id}/`, user)
                    break;
            }


            pet?.then(() => console.log('modificado ' + user.id))
                .catch(console.error);

            userRef.current = user;
        }

        setEditing(!editing);
    }

    return (
        <div className='cards'>
            <h2>{capitalize(user.first_name + ' ' + user.last_name)}</h2>
            <ul>
                {
                    !editing
                        ?
                        <>
                            <li>Email: {user.email}</li>
                            <li>Birthday: {user.birthday}</li>
                            {/* <li>Password: {user.password}</li> */}
                        </>
                        :
                        <>
                            <li>Email: <input type='text' onChange={inputChange('email')} value={user.email} name='email' /></li>
                            <li>Birthday: <input type='date' onChange={inputChange('birthday')} value={user.birthday} name='birthday' /></li>
                            {/* <li>Password: <input type='password' onChange={inputChange('password')} value={user.password} name='password' /></li> */}
                        </>
                }
            </ul>
            <button className='delete-button' onClick={deleteCard}><FontAwesomeIcon icon={faTrash} /></button>
            <button className='edit-button' onClick={editCard}><FontAwesomeIcon icon={faPen} /></button>
        </div>
    )
}

export default UsersListCard