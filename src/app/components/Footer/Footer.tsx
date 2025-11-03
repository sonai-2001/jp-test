import React from "react";
import cx from "./Footer.module.scss";
import Image from "next/image";
import Link from "next/link";
import { FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import footerIcon from "../../../../public/assets/img/footer-icon.png";
import experience from "../../../../public/assets/img/experience.png";
import { Typography } from "@mui/material";

function Footer() {
  const phoneNumber = "919830422190";
  const message =
    "I would like to make an enquiry for a product - <type product name here> ";
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <footer className={cx.footer_main}>
      <div className="container">
        <div className="row">
          {/* Logo + Company Description - Equal width */}
          <div className="col-lg col-md-6 col-sm-12">
            <div className={cx.footer_content}>
              <Image
                src={footerIcon}
                alt="logo"
                className="img-fluid mb-3"
                unoptimized
              />
              <p className="text-white mb-3">
                Jaypee Associates is a trusted provider of CNC workholding
                solutions and a reliable hardware material supplier for diverse
                industrial applications.
              </p>
            </div>
          </div>

          {/* Quick Links - Equal width */}
          <div className="col-lg col-md-6 col-sm-12">
            <div className={cx.footer_link}>
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li>
                  <Link href="/about-us">About Us</Link>
                </li>
                <li>
                  <Link href="/brands">Brands</Link>
                </li>
                <li>
                  <Link href="/categories">Categories</Link>
                </li>
                <li>
                  <Link href="/industries">Industries</Link>
                </li>
                <li>
                  <Link href="/catalogues">Catalogues</Link>
                </li>
                <li>
                  <Link href="/contactus">Contact Us</Link>
                </li>
                <li>
                  <Link href="/blogs">Blogs</Link>
                </li>
                <li>
                  <Link href="/faq">FAQs</Link>
                </li>
                <li>
                  <Link href="/sitemap">Sitemap</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Policies - Equal width */}
          <div className="col-lg col-md-6 col-sm-12">
            <div className={cx.footer_link}>
              <h5>Policies</h5>
              <ul className="list-unstyled">
                <li>
                  <Link href="/privacy-policy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms-condition">Terms & Condition</Link>
                </li>
                <li>
                  <Link href="/shipping-policy">
                    Shipping & Delivery Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Address & Contact - Equal width */}
          <div className="col-lg col-md-6 col-sm-12">
            <div className={cx.footer_content}>
              <Typography variant="h5" color="white">
                Address
              </Typography>
              <p className="text-white mb-4">
                Jaypee Associates, 3RD FLOOR, 31, Brabourne Rd, Murgighata,
                B.B.D. Bagh, Kolkata, West Bengal 700001
              </p>

              <Typography variant="h5" color="white">
                Contact-us / Get a Quick Quote
              </Typography>
              <p className="text-white mb-1">
                Phone:
                <a
                  href="tel:+919830422190"
                  className="text-white ms-1"
                  aria-label="Call +91 9830422190"
                >
                  (+91)9830422190
                </a>
                ,
                <a
                  href="tel:+919831648378"
                  className="text-white"
                  aria-label="Call +91 9831648378"
                >
                  (+91)9831648378
                </a>
                ,
                <a
                  href="tel:+919007220181"
                  className="text-white"
                  aria-label="Call +91 9007220181"
                >
                  (+91)9007220181
                </a>
              </p>
              <p className="text-white mb-3">
                Email:{" "}
                <a href="mailto:jp_ascal@yahoo.com" className="text-white">
                  jp_ascal@yahoo.com
                </a>
                ,
                <a
                  href="mailto:sales@jaypeeassociates.com"
                  className="text-white"
                >
                  {" "}
                  sales@jaypeeassociates.com
                </a>
              </p>

              {/* Social Icons */}
              <ul className="d-flex gap-3 mb-0">
                <li>
                  <Link
                    href="https://www.linkedin.com/company/jaypee-associates-the-cnc-workholding-specialists/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedinIn size={20} />
                  </Link>
                </li>
                <li>
                  <Link href={whatsappURL}>
                    <FaWhatsapp size={20} />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Trust Seal - Equal width */}
          <div className="col-lg d-none d-lg-block text-center">
            <Image
              src={experience}
              alt="experience"
              className="img-fluid mb-3"
              unoptimized
            />
            <a
              // href="https://secure.trust-provider.com/ttb_searcher/trustlogo?v_querytype=W&v_shortname=POSDV&v_search=https://jaypeeassociates.co.in/blogs/&x=6&y=5"
              href="https://www.positivessl.com/the-positivessl-trustlogo"
              target="_blank"
              rel="noopener noreferrer"
              className="d-block"
            >
              <img
                src="https://www.positivessl.com/images/seals/positivessl_trust_seal_sm_124x32.png"
                alt="PositiveSSL Trust Seal"
                className="img-fluid"
              />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className={`${cx.copy_right} text-center mt-4 pt-3`}>
          <p className="mb-0">
            The website and domain are the property of{" "}
            <b>JAYPEE ASSOCIATES KOLKATA</b>. All rights reserved &copy;{" "}
            <b>JAYPEE ASSOCIATES 2025</b>.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
