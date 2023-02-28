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

        <div className='Home-services'>
            <div className="Home-services-shaping">
                <img src="../public/Images/free-shaping.png" alt="free shaping">
                </img>
                <h4>Free Shaping</h4>
                <p>No charge for each delivery</p>
            </div>
            <div className="Home-services-payment">
                <img src='../public/Images/quick-payment-icon.png' alt='wallet icon'></img>
                <h4>Quick Payment</h4>
                <p>100% secure payment</p>
            </div>
            <div className='Home-services-support'>
                <img src='../public/Images/support-icon.png' alt='Headphone Icon'></img>
                <h4>24/7 Support</h4>
                <p>Quick Support</p>
            </div>
        </div>
      <div className='Home-products'>
      <p className='large-text'>Best Seller Product</p>
      <p className='small-text'>See all collection -</p>
      <div className='Home-products-pots'>
      <div className='Home-products-pots-pot1'>
      <img src='../public/Images/ist-pot.png' alt='first pot'></img>
      <h4>Cammile</h4>
      <h5>$65.00</h5>
      </div>
       <div className='Home-products-pots-pot2'>
       <img src='../public/Images/2nd-pot.png' alt = 'second pot'></img>
       <h4>Cammile</h4>
       <h5>$65.00</h5>
       </div>
       <div className='Home-products-pots-pot3'>
        <img src='../public/Images/3rd-pot.png' alt='third pot'></img>
        <h4>Cammile</h4>
        <h5>$65.00</h5>
       </div>
      </div>
      </div>
      <div className='Home-plants'>
        <div className='plant-ref'>
          <h3>Interior Plant Reference</h3>
          <p>make your home comfortable with refreshing plants </p>
        </div>
          <div className='Home-plants-images'>
            <img src='../public/Images/3merged.png' alt='i wish i knew'></img>
          </div>
      </div>
      <div className='Home-care'>
<h4>How to care for plants</h4>
<p>Take care of plants with all your heart</p>
<div className='Home-care-plist'>
<div className='Home-care-plist-1'>
<h3>Adjust Lighting </h3>
<p>When caring for indoor plants, make
sure the room temparature is neither too cold not too hot</p>
<img  src='../public/Images/lighting-icon.png' alt='lighting-icon'>
</img>
</div>
<div className='Home-care-plist-2'>
<h3>Don't water too often</h3>
<p>Watering ornamental plants indoors does not have to be every day</p>
<img className='Home-care-plist-img-2' src='../public/Images/water-icon.png'></img>
</div>
<div className='Home-care-plist-2'>
<h3>Don't water too often</h3>
<p>Watering ornamental plants does not have to be everyday</p>
<img src='../public/Images/plant-icon.png'></img>
</div>
<div className='Home-care-plist-3'>
<h3>Don't water too much</h3>
<p>Watering ornamental plants does not have to be everyday</p>
<img src='../public/Images/water-icon.png'></img>
</div>
<div className='Home-care-plist-4'>
   <h3>Fertilize regularly</h3>
   <p>The nutrients most indoor houseplants need are nitrogen for balance and potassium for stem strength</p>
<img src='../public/Images/fertilize-icon.png'></img>
</div>
      </div>
     </div>

        </div>
    );
}
