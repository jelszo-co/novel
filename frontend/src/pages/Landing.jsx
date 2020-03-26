import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => (
  <div>
    <h1>Üdvözöllek.</h1>
    <p>
      Martyn Nóri vagyok. Lorem ipsum dolor sit amet, consectetur adipiscing
      elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. A
      scelerisque purus semper eget duis at tellus. Ipsum faucibus vitae aliquet
      nec ullamcorper sit amet risus. In nisl nisi scelerisque eu ultrices vitae
      auctor. Donec adipiscing tristique risus nec feugiat in fermentum posuere
      urna.
    </p>
    <Link to='/list'>Írásaim</Link>
  </div>
);

export default Landing;
