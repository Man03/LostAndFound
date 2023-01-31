import React from "react";
import style from "./Home.module.css";

export default function Home() {
  return (
    <div className="homepage">
      <div className={`lefttext ${style.lefttext}`}>
        <h2 className={`title ${style.title}`}>LOST AND FOUND</h2>
        <h6 className="subtitle">LOST IT.LIST IT.FOUND IT</h6>
      </div>
      <img src="lf.png" alt="Girl in a jacket" width="500" height="500" />
    </div>
  );
}
