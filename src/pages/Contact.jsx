import { useState } from "react";
import AdBanner from "../components/AdBanner.jsx";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="page narrow-page">
      <AdBanner placement="top" />
      <section className="page-heading">
        <p className="eyebrow">Contacto</p>
        <h1>Cuéntanos algo</h1>
        <p>Ideas, colaboraciones, errores o propuestas para nuevos modos de juego.</p>
      </section>
      {sent ? (
        <div className="success-box">Mensaje preparado. Gracias por contactar con ¿Quién Soy? Fútbol.</div>
      ) : (
        <form
          className="contact-form"
          name="contact"
          method="POST"
          data-netlify="true"
          onSubmit={() => setSent(true)}
        >
          <input type="hidden" name="form-name" value="contact" />
          <label>
            Nombre
            <input type="text" name="name" required />
          </label>
          <label>
            Email
            <input type="email" name="email" required />
          </label>
          <label>
            Mensaje
            <textarea name="message" rows="5" required />
          </label>
          <button className="primary-button" type="submit">
            Enviar
          </button>
        </form>
      )}
      <AdBanner placement="bottom" />
    </div>
  );
}
