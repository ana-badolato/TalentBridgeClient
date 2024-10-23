import "../CSS/footer.css"
import logoImg from "../assets/images/logoImg.svg";
import githubIcon from "../assets/icons/githubIcon.svg"
import linkedinicon from "../assets/icons/linkedinicon.svg"
import xIcon from "../assets/icons/xIcon.svg"
import tiktokIcon from "../assets/icons/tiktokIcon.svg"


function Footer() {
  return (
    <div className="footer">

        <img src={logoImg} alt="Logo" />

        <div>
          <p>Ana Badolato</p>
          <a href="https://github.com/ana-badolato" target="_blank" rel="noopener noreferrer">
            <img src={githubIcon} alt="github" style={{width: "20px"}} />
          </a>
          <a href="https://www.linkedin.com/in/anabadolatomunuera/" target="_blank" rel="noopener noreferrer">
            <img src={linkedinicon} alt="linkedin" style={{width: "20px"}}/>
          </a>
        </div>

        <div>
          <p>Núria Soley</p>
          <a href="https://github.com/NuriaSoley" target="_blank" rel="noopener noreferrer">
            <img src={githubIcon} alt="github" style={{width: "20px"}}/>
          </a>
          <a href="https://www.linkedin.com/in/n%C3%BAria-soley-arnau-905a67147/" target="_blank" rel="noopener noreferrer">
            <img src={linkedinicon} alt="linkedin" style={{width: "20px"}}/>
          </a>

        </div>

        <div>
        <img src={xIcon} alt="github" style={{width: "20px"}}/>
        <img src={tiktokIcon} alt="github" style={{width: "20px"}}/>
        <img src={linkedinicon} alt="github" style={{width: "20px"}}/>
        <img src={githubIcon} alt="github" style={{width: "20px"}}/>
        </div>
        

    </div>
  )
}

export default Footer

