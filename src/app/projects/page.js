import React from "react";
import Header from "../Components/Header/page";
import "./project.css";
import Image from "next/image";
import Footer from "../Components/Footer/page";

const page = () => {
  return (
    <>
      <Header />
      <div className="project-container">
        <div className="project-content">
          <h1>Projects</h1>

          <hr id="project-hr" />

          <div className="project-img">
            <div className="project-img-row-one">
              <a href="/projects/project-internal-one">
                <div className="project-images">
                  <span className="project-relative">
                    <Image
                      className="pr-img"
                      src={"/project-img4.jpg"}
                      alt="project-img"
                      width={430}
                      height={600}
                      unoptimized
                      priority
                    ></Image>
                    <span className="project-overlay"></span>
                  </span>
                  <h1>The Iconic Arrival</h1>
                </div>
              </a>

              <a href="/projects/project-internal-two">
                <div className="project-images">
                  <span className="project-relative">
                    <Image
                      className="pr-img"
                      src={"/project-img2.jpg"}
                      alt="project-img"
                      width={890}
                      height={600}
                      unoptimized
                      priority
                    ></Image>
                    <span className="project-overlay">
                      <h1>PICAC Brunswick</h1>
                    </span>
                  </span>
                </div>
              </a>
            </div>

            <div className="project-img-row-two">
              <a href="#">
                <div className="project-images">
                  <span className="project-relative">
                    <Image
                      className="pr-img"
                      src={"/project-img1.jpg"}
                      alt="project-img"
                      width={0}
                      height={0}
                      unoptimized
                      priority
                    ></Image>
                    <span className="project-overlay">
                      <h1>Image Text</h1>
                    </span>
                  </span>
                </div>
              </a>

              <a href="#">
                <div className="project-images">
                  <span className="project-relative">
                    <Image
                      className="pr-img"
                      src={"/project-img1.jpg"}
                      alt="project-img"
                      width={0}
                      height={0}
                      unoptimized
                      priority
                    ></Image>
                    <span className="project-overlay">
                      <h1>Image Text</h1>
                    </span>
                  </span>
                </div>
              </a>

              <a href="#">
                <div className="project-images">
                  <span className="project-relative">
                    <Image
                      className="pr-img"
                      src={"/project-img1.jpg"}
                      alt="project-img"
                      width={0}
                      height={0}
                      unoptimized
                      priority
                    ></Image>
                    <span className="project-overlay">
                      <h1>Image Text</h1>
                    </span>
                  </span>
                </div>
              </a>
            </div>

            <div className="project-img-row-three">
              <a href="#">
                <div className="project-images">
                  <span className="project-relative">
                    <Image
                      className="pr-img"
                      src={"/project-img3.jpg"}
                      alt="project-img"
                      width={0}
                      height={0}
                      unoptimized
                      priority
                    ></Image>
                    <span className="project-overlay">
                      <h1>Image Text</h1>
                    </span>
                  </span>
                </div>
              </a>

              <a href="#">
                <div className="project-images">
                  <span className="project-relative">
                    <Image
                      className="pr-img"
                      src={"/project-img3.jpg"}
                      alt="project-img"
                      width={0}
                      height={0}
                      unoptimized
                      priority
                    ></Image>
                    <span className="project-overlay">
                      <h1>Image Text</h1>
                    </span>
                  </span>
                </div>
              </a>

              <a href="#">
                <div className="project-images">
                  <span className="project-relative">
                    <Image
                      className="pr-img"
                      src={"/project-img3.jpg"}
                      alt="project-img"
                      width={0}
                      height={0}
                      unoptimized
                      priority
                    ></Image>
                    <span className="project-overlay">
                      <h1>Image Text</h1>
                    </span>
                  </span>
                </div>
              </a>
            </div>

            <div className="project-img-row-four">
              <a href="#">
                <div className="project-images">
                  <span className="project-relative">
                    <Image
                      className="pr-img"
                      src={"/project-img4.jpg"}
                      alt="project-img"
                      width={0}
                      height={0}
                      unoptimized
                      priority
                    ></Image>
                    <span className="project-overlay">
                      <h1>Image Text</h1>
                    </span>
                  </span>
                </div>
              </a>

              <a href="#">
                <div className="project-images">
                  <span className="project-relative">
                    <Image
                      className="pr-img"
                      src={"/project-img4.jpg"}
                      alt="project-img"
                      width={0}
                      height={0}
                      unoptimized
                      priority
                    ></Image>
                    <span className="project-overlay">
                      <h1>Image Text</h1>
                    </span>
                  </span>
                </div>
              </a>

              <a href="#">
                <div className="project-images">
                  <span className="project-relative">
                    <Image
                      className="pr-img"
                      src={"/project-img4.jpg"}
                      alt="project-img"
                      width={0}
                      height={0}
                      unoptimized
                      priority
                    ></Image>
                    <span className="project-overlay">
                      <h1>Image Text</h1>
                    </span>
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default page;
