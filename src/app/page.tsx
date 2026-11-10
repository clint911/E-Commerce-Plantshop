"use client";

import { FormEvent, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";

const asset = (name: string) => `/assets/${name}`;

const products = [
  { name: "Cammile", price: "$65.00", image: "0a873.png", imageClass: "plant-camille" },
  { name: "Cammile", price: "$65.00", image: "1b1eb.png", imageClass: "plant-lily" },
  { name: "Cammile", price: "$65.00", image: "a054a.png", imageClass: "plant-snake" },
];

const services = [
  { title: "Free Shapping", detail: "No charge for each delivery", icon: "97c5e.svg" },
  { title: "Quick Payment", detail: "100% secure payment", icon: "cd371.svg" },
  { title: "24/7 Support", detail: "Quick support", icon: "e0028.svg" },
];

const careTips = [
  {
    title: "Adjust Lighting",
    text: "When caring for indoor plants, make sure the room temperature is neither too cold nor too hot",
    icon: "a58a1.svg",
  },
  {
    title: "Don't water too often",
    text: "Watering ornamental plants indoors does not have to be done every day.",
    icon: "26575.svg",
  },
  {
    title: "Don't water too often",
    text: "Watering ornamental plants indoors does not have to be done every day.",
    icon: "fa31e.svg",
  },
  {
    title: "Fertilize regularly",
    text: "The nutrients most indoor houseplants need are nitrogen for balance and potassium for stem strength",
    icon: "86d52.svg",
  },
];

export default function App() {
  const [query, setQuery] = useState("");
  const [cartCount, setCartCount] = useState(1);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const visibleProducts = useMemo(
    () =>
      products.filter((product) => product.name.toLowerCase().includes(query.trim().toLowerCase())),
    [query],
  );

  function submitNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email.trim()) setSubscribed(true);
  }

  return (
    <main>
      <section className="hero" id="home">
        <Navbar cartCount={cartCount} />

        <div className="hero-copy">
          <h1>
            Bring Serenity to Your Place
            <br />
            With Interior Plants
          </h1>
          <p>find your dream plant for you home decoration with us, and we will make it happen.</p>
          <form className="search" onSubmit={(event) => event.preventDefault()} role="search">
            <input
              aria-label="Search plant"
              placeholder="Search plant"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="submit" aria-label="Search">
              <img src={asset("a0f1a.svg")} alt="" />
            </button>
          </form>
        </div>

        <img className="product-point point-left" src={asset("47413.svg")} alt="" />
        <img className="product-point point-middle" src={asset("47413.svg")} alt="" />
        <div className="plant-price">
          <img src={asset("21a3e.svg")} alt="" />
          <div>
            <strong>$65.00</strong>
            <span>Dracena Fragnas</span>
          </div>
        </div>
        <img className="product-point point-right" src={asset("47413.svg")} alt="" />
      </section>

      <section className="services page-width" aria-label="Our services">
        {services.map((service) => (
          <article className="service" key={service.title}>
            <img src={asset(service.icon)} alt="" />
            <div>
              <h2>{service.title}</h2>
              <p>{service.detail}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="best-seller page-width" id="shop">
        <header className="section-side-heading">
          <h2>
            Best Seller
            <br />
            Product
          </h2>
          <a href="#reference">
            See all collection <img src={asset("7392a.svg")} alt="" />
          </a>
        </header>

        <div className="product-grid">
          {visibleProducts.map((product, index) => (
            <article className="product-card" key={`${product.image}-${index}`}>
              <div className="product-image">
                <img className="plant-shadow" src={asset("14dd0.svg")} alt="" />
                <img
                  className={product.imageClass}
                  src={asset(product.image)}
                  alt={`${product.name} plant`}
                />
              </div>
              <div className="product-details">
                <div>
                  <h3>{product.name}</h3>
                  <div className="stars" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, star) => (
                      <img src={asset("48c54.svg")} alt="" key={star} />
                    ))}
                  </div>
                </div>
                <div className="product-price">
                  <strong>{product.price}</strong>
                  <button
                    onClick={() => setCartCount((count) => count + 1)}
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <img src={asset("ff36b.svg")} alt="" />
                  </button>
                </div>
              </div>
            </article>
          ))}
          {visibleProducts.length === 0 && <p className="no-products">No plants found.</p>}
        </div>
      </section>

      <section className="reference page-width" id="reference">
        <header className="section-heading">
          <h2>Interior Plant Reference</h2>
          <p>make your home so comfortable with refreshing plants</p>
        </header>
        <div className="reference-grid">
          <figure className="living-room">
            <img src={asset("0c3a9.png")} alt="Plant-filled living room" />
            <figcaption>living room</figcaption>
          </figure>
          <figure className="desk">
            <img src={asset("fa926.png")} alt="Home desk decorated with plants" />
          </figure>
          <figure className="tall-plant">
            <img src={asset("4b319.png")} alt="Tall indoor snake plant" />
          </figure>
        </div>
      </section>

      <section className="care page-width" id="about">
        <div className="care-content">
          <header>
            <h2>How to care for plants</h2>
            <p>Take care of plants with all your heart</p>
          </header>
          <div className="care-list">
            {careTips.map((tip, index) => (
              <article key={`${tip.title}-${index}`}>
                <img src={asset(tip.icon)} alt="" />
                <div>
                  <h3>{tip.title}</h3>
                  <p>{tip.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <img
          className="care-photo"
          src={asset("032c8.png")}
          alt="Hands holding four young plants"
        />
      </section>

      <footer id="contact">
        <div className="footer-inner page-width">
          <section className="newsletter">
            <h2>Newslatter</h2>
            <form onSubmit={submitNewsletter}>
              <input
                type="email"
                required
                aria-label="Email address"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setSubscribed(false);
                }}
              />
              <button type="submit">{subscribed ? "Subscribed" : "Subscribe"}</button>
            </form>
          </section>

          <div className="footer-links">
            <section>
              <h3>Support</h3>
              <a href="#about">About Us</a>
              <a href="#contact">Careers</a>
              <a href="#reference">Blog</a>
            </section>
            <section>
              <h3>Useful Link</h3>
              <a href="#shop">Payment &amp; Tax</a>
              <a href="#contact">Team of service</a>
              <a href="#contact">Privaci Policy</a>
            </section>
            <section>
              <h3>Our Menu</h3>
              <a href="#shop">Best Product</a>
              <a href="#reference">Category</a>
            </section>
            <section>
              <h3>Address</h3>
              <p>JL. Setiabudhi No. 193 Sukasari, Bandung</p>
              <p>West Java, Indonesia</p>
              <a href="mailto:hallo@daunku.com">hallo@daunku.com</a>
            </section>
          </div>
          <div className="footer-rule">
            <img src={asset("5450d.svg")} alt="" />
          </div>
          <p className="copyright">© 2023 davixq - All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

