import { useState } from 'react';
import './styles/Home.css';

export default function Home() {
    //code for searchbar 
    
    return (
        <div className='Home'>
        <ul className='Home-nav'> 
            <li>Home</li>
            <li>Shop</li>
            <li>About us</li>
            <li>Contact</li>
        </ul>
        <h1 className="Home-header">Bring Serenity to Your Place with Interior Plants </h1>
        <p className='Home-paragraph'>Fnd your dream plant for your home decoration with us, and we will make it happen</p>
        </div>
    );
}
