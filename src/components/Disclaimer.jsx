import { useI18n } from "../i18n/useI18n.js";

export default function Disclaimer() {
  const { language } = useI18n();
  return (
    <p className="disclaimer">
      {language === "es"
        ? "Quien Soy? Futbol es un juego de entretenimiento no oficial. No utiliza escudos oficiales ni imagenes protegidas."
        : "Who Am I? Football is an unofficial entertainment game. It does not use official crests or protected images."}
    </p>
  );
}
