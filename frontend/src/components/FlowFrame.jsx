import React from "react";
import { Link } from "../router.jsx";

const steps = ["Report", "Describe", "Analysis", "Summary", "Authority", "Draft", "Review", "Save", "Dashboard"];

export default function FlowFrame({ step, title, description, children }) {
  return (
    <main className="flow-page">
      <div className="flow-back"><Link to="/">← AWAAZ home</Link><span>YOUR REPORT · LOCAL SESSION</span></div>
      <ol className="flow-progress" aria-label="Report progress">
        {steps.map((name, index) => <li className={index <= step ? "active" : ""} key={name}><span>{String(index + 1).padStart(2, "0")}</span>{name}</li>)}
      </ol>
      <header className="flow-heading">
        <p className="eyebrow">STEP {String(step + 1).padStart(2, "0")} <span>OF {String(steps.length).padStart(2, "0")}</span></p>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      {children}
    </main>
  );
}
