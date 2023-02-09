import React from 'react';
import { BrowserRouter, Route, Switch  } from 'react-router-dom';
import Home from './Home';
import Shop from './Shop';
import About from './About';
import Contact from './Contact';

const Navbar: React.FC = () => (
  <nav>
    <ul>
      <li>
        <BrowserRouter> 
        <Switch> 
        <Route path="/components/Home.tsx">
          <Home /> 
        </Route>
      <li>
        <Route path="/components/Shop.tsx">
          <Shop /> 
        </Route>
      </li>
      <li>
        <Route path='/components/About.tsx'>
          <About /> 
        </Route>
      </li>
      <li>
        <Route path='/components/Contact.tsx'>
          <Contact /> 
          </Route>
                    </li>
              </Switch>
        </BrowserRouter>
      </li>
    </ul>
  </nav>
);

export default Navbar;
