import "../CSS/footer.css";
import logoImg from "../assets/images/logoImg.svg";
import githubIcon from "../assets/icons/githubIcon.svg";
import linkedinicon from "../assets/icons/linkedinIcon.svg";
import xIcon from "../assets/icons/xIcon.svg";
import tiktokIcon from "../assets/icons/tiktokIcon.svg";

function Footer() {
  return (
    <div className="footer">
      <div className="footer-content">
        <img src={logoImg} alt="Logo" />

        <div className="developers">
          <div className="dev">
            <p>Ana Badolato</p>
            <a
              href="https://github.com/ana-badolato"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={githubIcon} alt="github" style={{ width: "20px" }} />
            </a>
            <a
              href="https://www.linkedin.com/in/anabadolatomunuera/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={linkedinicon}
                alt="linkedin"
                style={{ width: "20px" }}
              />
            </a>
          </div>
<p>|</p>
          <div className="dev">
            <p>Núria Soley</p>
            <a
              href="https://github.com/NuriaSoley"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={githubIcon} alt="github" style={{ width: "20px" }} />
            </a>
            <a
              href="https://www.linkedin.com/in/n%C3%BAria-soley-arnau-905a67147/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={linkedinicon}
                alt="linkedin"
                style={{ width: "20px" }}
              />
            </a>
          </div>
          </div>
         {/* Redes Sociales Globales */}
        <div className="socialMedia">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <img src={xIcon} alt="X (Twitter)" style={{ width: "20px" }} />
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
            <img src={tiktokIcon} alt="TikTok" style={{ width: "20px" }} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <img src={linkedinicon} alt="LinkedIn" style={{ width: "20px" }} />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <img src={githubIcon} alt="GitHub" style={{ width: "20px" }} />
          </a>
        </div>
        </div>
      </div>
  
  );
}

export default Footer;
