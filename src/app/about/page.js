import React from "react";
import Header from "../Components/Header/page";
import Footer from "../Components/Footer/page";
import "./about.css";
import Image from "next/image";

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
                <a href="#about-content-third-row">Place</a>
                <a href="#">Process</a>
                <a href="#">Practice</a>
              </span>
            </div>
          </div>

          <div className="about-content-second-row">
            <div className="people-content">
              <h1>People</h1>
              <p>
                Our people come from far and wide and form the backbone of
                Decibel Architecture – we are storytellers, technicians,
                facilitators, and creatives with diverse backgrounds, and
                interesting stories. We are inherently curious, deep thinkers
                who challenge the status quo, and as skilled communicators, we
                guide our partners and collaborators to do the same. We
                recognise and develop this boundless potential in our practice
                and beyond, and bring fresh perspectives to every project and
                relationship.
              </p>
            </div>
            <div className="people-img">
              <Image
                src={"/project-img4.jpg"}
                alt="people-img"
                unoptimized
                width={0}
                height={0}
                priority
              ></Image>
            </div>
          </div>

          <div className="about-content-third-row">
            <div className="people-content" id="place-content">
              <h1>Place</h1>
              <p>
                Exploration of (and connection to) place and Country is
                foundational to exceptional design outcomes. Deep listening
                enables us to discover the stories and history of the places we
                live and work. We work around the world, with myriad histories
                and cultures. Everywhere we are invited, we listen and discover
                the core human, ecological and economic challenges that can be
                harnessed and woven into innovative and extraordinary design
                solutions.
              </p>
            </div>
            <div className="people-img">
              <Image
                src={"/project-img4.jpg"}
                alt="people-img"
                unoptimized
                width={0}
                height={0}
                priority
              ></Image>
            </div>
          </div>

          <div className="about-content-four-row">
            <div className="people-content" id="process-content">
              <h1>Process</h1>
              <p>
                Our research and strategic thinking intensifies connections and
                invigorates design possibilities beyond the brief. This is where
                the important work happens – where we drill down to seek meaning
                and context. Contributing as architects, design thinkers and
                strategists, we are shaping positive change in the world. We
                work across scales, typologies and the human sphere to design
                exceptional, ecological and ethical architectures, experiences
                and transformations.
              </p>
            </div>
            <div className="people-img">
              <Image
                src={"/project-img4.jpg"}
                alt="people-img"
                unoptimized
                width={0}
                height={0}
                priority
              ></Image>
            </div>
          </div>

          <div className="about-content-five-row">
            <div className="people-content" id="practice-content">
              <h1>Practice</h1>
              <p>
                We support our people and our clients to be focused, effective,
                curious and kind. Together we embark on creative journeys to
                extraordinary destinations. As a Tri-Certified ISO company, our
                robust systems are built on industry best practice principles.
                From this foundation of compliance and clarity, we are committed
                to learning, teaching, and exploring our work with courage,
                curiosity and creative vision.
              </p>
            </div>
            <div className="people-img">
              <Image
                src={"/project-img4.jpg"}
                alt="people-img"
                unoptimized
                width={0}
                height={0}
                priority
              ></Image>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
