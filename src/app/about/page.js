import React from "react";
import Header from "../Components/Header/page";
import Footer from "../Components/Footer/page";
import "./about.css";

const About = () => {
  return (
    <div>
      <Header />

      <div className="about-container">
        <div className="about-content">
          <div className="about-content-first-row">
            <div className="about-content-first-row-left">
              <h1>About</h1>
            </div>
            <div className="about-content-first-row-right">
              <h2>Exceptional outcomes, on purpose.</h2>
              <p>
                Decibel Architecture delivers exceptional outcomes, on purpose.
              </p>
              <p>
                Our architecture is imagined with, formed for, and shaped by our
                clients' aspirations – by the challenge of the opportunity, and
                by our desire to make a better world.
              </p>
              <p>
                Be it to heal, entertain, educate, house or inspire, we advocate
                for deeper thinking and engagement in the process of design. We
                explore and challenge our clients' ambitions to ensure that
                their purpose is core to our shared outcomes. In doing this, we
                help people to imagine and believe in things that don't yet
                exist.
              </p>
              <span className="four-p">
                <a href="#">People</a>
                <a href="#">Place</a>
                <a href="#">Process</a>
                <a href="#">Practice</a>
              </span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
