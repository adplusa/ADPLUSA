import Image from "next/image";
import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <div>
      <div className="footer">
        <div className="footer-logo">
          <Image
            src={"/red-logo.png"}
            alt="Footer-logo"
            id="footer-logo"
            width={0}
            height={0}
            unoptimized
          ></Image>
          <p>
            ADPL CONSULTING LLC works as a leading Architectural and Engineering
            <br />
            outsource fraternity across India and the United States of America.
          </p>
        </div>
        <div className="footer-nav">
          <ul>
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">About us</a>
            </li>
            <li>
              <a href="#">Portfolio</a>
            </li>
            <li>
              <a href="#">Get a Quote</a>
            </li>
            <li>
              <a href="#">Competition: Contact-Less Restroom</a>
            </li>
          </ul>
        </div>

        <div className="social-media">
          <span className="blue-back">Dr</span>
          <span className="blue-back">Be</span>
          <span className="blue-back">Ig</span>
          <span className="blue-back">Tw</span>
        </div>

        <span id="blue-border-div">
          <hr className="blue-border" />
        </span>

        <span className="copy-designed">
          <p id="copyright">Copyright Adplusa</p>
          <p>Designed By Quite Good</p>
        </span>
      </div>
    </div>
  );
};

export default Footer;
