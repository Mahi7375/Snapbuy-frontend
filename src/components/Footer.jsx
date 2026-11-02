
import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="snapbuy-footer">
      <div className="footer-developer">
        <span>Designed & Developed by</span>
        <strong>Mahesh</strong>
        <span className="footer-separator">|</span>
        <span>Full Stack Developer</span>
        <span className="footer-separator">|</span>
        <span>Automation Tester</span>
      </div>

      <div className="footer-socials">
        <a href="https://github.com/Mahi7375"
           target="_blank" rel="noopener noreferrer"
           aria-label="GitHub">
          <i className="bi bi-github"></i>
        </a>

        <a href="https://www.linkedin.com/in/mahesh-babu-0aa981377"
           target="_blank" rel="noopener noreferrer"
           aria-label="LinkedIn">
          <i className="bi bi-linkedin"></i>
        </a>

        <a href="mailto:babumahesh3024@gmail.com"
           aria-label="Email">
          <i className="bi bi-envelope"></i>
        </a>
      </div>

      <div className="footer-copyright">
        © {new Date().getFullYear()} SnapBuy. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
