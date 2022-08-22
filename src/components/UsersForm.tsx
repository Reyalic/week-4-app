import axios from 'axios';;
import React, { useRef } from 'react';
import { ReactState, User } from '../interfaces/interfaces';

interface Props {
    cardsState: ReactState<User[]>
}

const UsersForm = (props: Props) => {
    const [cards, setCards] = props.cardsState;
    let refFirstName = useRef<HTMLInputElement>(null);
    let refLastName = useRef<HTMLInputElement>(null);
    let refEmail = useRef<HTMLInputElement>(null);
    let refPassword = useRef<HTMLInputElement>(null);
    let refBirthday = useRef<HTMLInputElement>(null);
    const allInputRefs = [refFirstName, refLastName, refEmail, refPassword, refBirthday];
    let refIsValid = useRef<boolean>(true);

    function submit(e: React.SyntheticEvent) {
        e.preventDefault();

        if (allInputRefs.some(ref => ref.current?.validity.valid === false))
            return;

        const data = {
            first_name: refFirstName.current?.value,
            last_name: refLastName.current?.value,
            email: refEmail.current?.value,
            password: refPassword.current?.value,
            birthday: refBirthday.current?.value,
        };

        axios.post(import.meta.env.VITE_BASE_API + '/users/', data)
            .then(res => setCards([res.data, ...cards]))
            .catch(console.error);
    }

    return (
        <form className='form-container'>
            <input ref={refFirstName} type='text' placeholder='Name' name='name' id='name' required pattern='[a-zA-ZáéíóúÁÉÍÓÚñÑ]+' />
            <input ref={refLastName} type='text' placeholder='Last Name' name='last-name' id='last-name' required pattern='[a-zA-ZáéíóúÁÉÍÓÚñÑ]+' />
            <input ref={refEmail} type='email' placeholder='Email' name='email' id='email' required />
            <input ref={refPassword} type='text' placeholder='Password' name='password' id='password' required pattern='\w+' />
            <input ref={refBirthday} type='date' name='birthday' id='birthday' required />
            <input className='submit-button' type='submit' onClick={submit} value='Submit' />
        </form>
    );
}

export default UsersForm