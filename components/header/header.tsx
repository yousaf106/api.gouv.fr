import React, { useEffect, useRef, Fragment } from 'react';
import Link from 'next/link';
import { throttle } from 'lodash';

import { ButtonLink } from '../../uiComponents/button';
import { logCTA } from '../../service/analytics';
import { apiLogo, republiqueFrLogo } from './logos';

const SIGNUP_URL =
  process.env.NEXT_PUBLIC_SIGNUP_URL || 'https://signup.api.gouv.fr';

export const HEADER_PAGE = {
  APIS: 'apis',
  FROM_SIGNUP: 'requests',
  SERVICES: 'services',
  ABOUT: 'about',
};

const HEADER = [
  {
    href: '/rechercher-api',
    txt: 'Rechercher une API du service public',
    key: HEADER_PAGE.APIS,
  },
  {
    href: '/services',
    txt: 'Voir les réalisations',
    key: HEADER_PAGE.SERVICES,
  },
  { href: '/apropos', txt: 'À propos', key: HEADER_PAGE.ABOUT },
];

const Header = ({ headerKey = 'home', useMenu = true }) => {
  const header = useRef(null);

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (!header || !header.current) {
        return;
      }
      //@ts-ignore
      const headerClasses = header.current.classList;
      const hasScrolledClass = headerClasses.contains('scrolled');
      if (
        (window.scrollY !== 0 && !hasScrolledClass) ||
        (window.scrollY === 0 && hasScrolledClass)
      ) {
        headerClasses.toggle('scrolled');
      }
    }, 100);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header role="navigation" ref={header}>
      <nav className="nav">
        <input
          className="menu-btn"
          type="checkbox"
          id="menu-btn"
          aria-label="ouverture-menu"
        />
        <label className="hamburger-menu" htmlFor="menu-btn">
          <span />
          <span />
          <span />
        </label>
        <div className="nav__container">
          <Link href="/">
            <a
              className="nav__logo-wrapper"
              title="Retourner à l’accueil de api.gouv.fr"
            >
              <span className="nav__logo marianne">{republiqueFrLogo}</span>
              <span className="nav__logo apigouv">{apiLogo}</span>
            </a>
          </Link>
          <ul className="nav__links">
            {headerKey !== HEADER_PAGE.FROM_SIGNUP ? (
              <>
                {HEADER.map(item => (
                  <Fragment key={item.href}>
                    <li
                      className={`${headerKey === item.key ? 'current' : ''}`}
                    >
                      <a
                        className="dont-apply-link-style"
                        href={`${item.href}`}
                      >
                        {item.txt}
                      </a>
                    </li>
                  </Fragment>
                ))}
                <li className="external">
                  <ButtonLink
                    href="/parcours-client?source=header"
                    onClick={() => logCTA('CTA header')}
                  >
                    Une question ?
                  </ButtonLink>
                </li>
              </>
            ) : (
              <li>
                <a className="dont-apply-link-style" href={`${SIGNUP_URL}`}>
                  Mes demandes
                </a>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
