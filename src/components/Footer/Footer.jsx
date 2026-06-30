import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Github, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="app-footer">
      <div className="app-container app-footer__inner">
        <div className="app-footer__grid">
          <section className="app-footer__section" aria-label="Lingoix">
            <h3 className="app-footer__title">Lingoix</h3>
            <p className="app-footer__text">
              {t(
                "footer.about",
                "Your trusted platform for language learning. Master new languages with interactive lessons and personalized learning paths."
              )}
            </p>
          </section>

          <nav className="app-footer__section" aria-label={t("footer.quickLinks", "Quick Links")}>
            <h3 className="app-footer__title">
              {t("footer.quickLinks", "Quick Links")}
            </h3>
            <ul className="app-footer__list">
              <li>
                <Link
                  to="/"
                  className="app-footer__link"
                >
                  {t("footer.home", "Home")}
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="app-footer__link"
                >
                  {t("footer.courses", "Courses")}
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className="app-footer__link"
                >
                  {t("footer.resources", "Resources")}
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="app-footer__link"
                >
                  {t("footer.contact", "Admin")}
                </Link>
              </li>
            </ul>
          </nav>

          <section className="app-footer__section" aria-label={t("footer.contactUs", "Contact Us")}>
            <h3 className="app-footer__title">
              {t("footer.contactUs", "Contact Us")}
            </h3>
            <ul className="app-footer__list">
              <li className="app-footer__contact-item">
                <Mail size={18} aria-hidden="true" />
                <span>contact@lingoix.com</span>
              </li>
              <li className="app-footer__contact-item">
                <Phone size={18} aria-hidden="true" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="app-footer__contact-item">
                <MapPin size={18} aria-hidden="true" />
                <span>
                  {t("footer.address", "123 Language Street, Education City")}
                </span>
              </li>
            </ul>
          </section>

          <section className="app-footer__section" aria-label={t("footer.followUs", "Follow Us")}>
            <h3 className="app-footer__title">
              {t("footer.followUs", "Follow Us")}
            </h3>
            <div className="app-footer__social">
              <button
                type="button"
                aria-label="GitHub"
                className="app-social-button"
              >
                <Github size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Twitter"
                className="app-social-button"
              >
                <Twitter size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="LinkedIn"
                className="app-social-button"
              >
                <Linkedin size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Instagram"
                className="app-social-button"
              >
                <Instagram size={18} aria-hidden="true" />
              </button>
            </div>
          </section>
        </div>

        <div className="app-footer__bottom">
          <p className="app-footer__meta">
            © {new Date().getFullYear()} Lingoix.{" "}
            {t("footer.rights", "All rights reserved.")}
          </p>
          <div className="app-footer__legal">
            <button type="button" className="app-footer__link">
              {t("footer.privacy", "Privacy Policy")}
            </button>
            <button type="button" className="app-footer__link">
              {t("footer.terms", "Terms of Service")}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
