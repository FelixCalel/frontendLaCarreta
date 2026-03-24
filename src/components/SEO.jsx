import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import logoLaCarreta from '../assets/images/LogoLaCarreta.png';

const SEO = ({
  title = "Inicio",
  description = "Portal administrativo para La Carreta.",
  name = "La Carreta",
  type = "website",
}) => {
  const logoUrl = `${window.location.origin}${logoLaCarreta}`;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title} | Portal La Carreta</title>
      <meta name='description' content={description} />
      <link rel="canonical" href={window.location.href} />
      
      {/* Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={window.location.href} />
      
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "La Carreta",
          "url": "https://app.lacarreta.com.gt",
          "logo": logoUrl,
          "sameAs": [
            "https://www.facebook.com/lacarretagt",
            "https://www.instagram.com/lacarretagt"
          ]
        })}
      </script>
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
};

export default SEO;
