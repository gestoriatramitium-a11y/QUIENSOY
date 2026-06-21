import { useState } from "react";
import AdBanner from "../components/AdBanner.jsx";
import { useI18n } from "../i18n/useI18n.js";

const COPY = {
  es: {
    eyebrow: "Contacto",
    title: "Cuentanos algo",
    description: "Ideas, errores o propuestas para nuevos modos de juego.",
    success: "Mensaje preparado. Gracias por contactar con Quien Soy? Futbol.",
    name: "Nombre",
    email: "Email",
    message: "Mensaje",
    send: "Enviar"
  },
  en: {
    eyebrow: "Contact",
    title: "Tell us something",
    description: "Ideas, bugs or proposals for new game modes.",
    success: "Message prepared. Thanks for contacting Who Am I? Football.",
    name: "Name",
    email: "Email",
    message: "Message",
    send: "Send"
  }
};

export default function Contact() {
  const { language } = useI18n();
  const copy = COPY[language] || COPY.en;
  const [sent, setSent] = useState(false);

  return (
    <div className="page narrow-page">
      <AdBanner placement="top" />
      <section className="page-heading">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
      </section>
      {sent ? (
        <div className="success-box">{copy.success}</div>
      ) : (
        <form className="contact-form" name="contact" method="POST" data-netlify="true" onSubmit={() => setSent(true)}>
          <input type="hidden" name="form-name" value="contact" />
          <label>
            {copy.name}
            <input type="text" name="name" required />
          </label>
          <label>
            {copy.email}
            <input type="email" name="email" required />
          </label>
          <label>
            {copy.message}
            <textarea name="message" rows="5" required />
          </label>
          <button className="primary-button" type="submit">
            {copy.send}
          </button>
        </form>
      )}
      <AdBanner placement="bottom" />
    </div>
  );
}
