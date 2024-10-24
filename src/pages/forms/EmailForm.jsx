import React, { useContext, useEffect, useState } from 'react';
import service from '../../services/config';
import { AuthContext } from '../../context/auth.context';
import { useNavigate, useParams } from 'react-router-dom';

const EmailForm = () => {

    const params = useParams()
    const navigate = useNavigate()
    const [senderEmail, setSenderEmail] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const {contactEmail, isLoggedIn} = useContext(AuthContext)

    useEffect(()=>{
      if(isLoggedIn){
        setSenderEmail(contactEmail)
        fetchUserEmail(params.userid)
      }else{
        navigate("/login")
      }
      console.log("aqui", params.userid)
    },[contactEmail, isLoggedIn, navigate,params.userid])

    const fetchUserEmail = async (username) => {
      try {
        // Fa la crida per obtenir el perfil de l'usuari
        const response = await service.get(`/user/profile/${username}`);
        setRecipientEmail(response.data.contactEmail);
        console.log(response.data.contactEmail);
      } catch (error) {
        console.error("Error obtenint el correu de l'usuari:", error);
        alert('Error obtent el correu de l\'usuari');
      }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await service.post('/sendemail/', {
                senderEmail,
                recipientEmail,
                subject,
                message,
            });
        } catch (error) {
            alert('Error enviant l\'email');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Correu de l'emissor"
                value={senderEmail}
                readOnly
                required
            />
            <input
                type="email"
                placeholder="Correu del destinatari"
                value={recipientEmail}
                readOnly
                required
            />
            <input
                type="text"
                placeholder="Assumpte"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
            />
            <textarea
                placeholder="Missatge"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
            />
            <button type="submit">Enviar Email</button>
        </form>
    );
};

export default EmailForm;