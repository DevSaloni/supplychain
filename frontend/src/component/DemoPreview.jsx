import React from "react";
import "./DemoPreview.css";

const DemoPreview = () => {
  const demos = [
    {
      title: "Product Records",
      desc: "Track product details, current stage, and verification status.",
      img: "/demo6.PNG",
    },
    {
      title: "Product Overview",
      desc: "Get complete details about a specific product in the supply chain.",
      img: "/demo4.PNG",
    },
    {
      title: "Supply Chain Timeline",
      desc: "See the full pricing breakdown and movement history.",
      img: "/demo5.PNG",
    },
  ];

  return (
    <section className="demo-section">
      <div className="demo-container">
        <h2 className="demo-title">Platform Demo</h2>
        <p className="demo-subtitle">
          Explore how our decentralized supply chain platform works with real examples.
        </p>

        {demos.map((demo, index) => (
          <div key={index} className="demo-preview">
            <div className="demo-info">
              <h3>{demo.title}</h3>
              <p>{demo.desc}</p>
            </div>
            <div className="demo-image-wrapper">
              <img src={demo.img} alt={demo.title} className="demo-image" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DemoPreview;
