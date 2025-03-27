import { useTranslation } from "react-i18next";
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Lingoix</h3>
            <p className="text-muted-foreground">
              {t(
                "footer.about",
                "Your trusted platform for language learning. Master new languages with interactive lessons and personalized learning paths."
              )}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">
              {t("footer.quickLinks", "Quick Links")}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("footer.home", "Home")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("footer.courses", "Courses")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("footer.resources", "Resources")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("footer.contact", "Contact")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">
              {t("footer.contactUs", "Contact Us")}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground">
                <MdEmail className="h-5 w-5" />
                <span>contact@lingoix.com</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MdPhone className="h-5 w-5" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MdLocationOn className="h-5 w-5" />
                <span>
                  {t("footer.address", "123 Language Street, Education City")}
                </span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">
              {t("footer.followUs", "Follow Us")}
            </h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <FaGithub className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Lingoix.{" "}
              {t("footer.rights", "All rights reserved.")}
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t("footer.privacy", "Privacy Policy")}
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t("footer.terms", "Terms of Service")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
