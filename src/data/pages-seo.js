/**
 * PAGES HTML AVEC ERREURS SEO
 *
 * Collection de pages web réalistes contenant des erreurs SEO
 * à détecter et corriger par les joueurs
 */

export const SEO_PAGES = {
  homepage: {
    id: 'homepage',
    name: "Homepage TechShop.fr",
    type: "homepage",
    difficulty: 3,
    html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- ERREUR: Pas de balise title -->
  <!-- ERREUR: Meta description manquante -->
</head>
<body>
  <!-- ERREUR: Pas de H1 -->
  <h2>Bienvenue sur TechShop</h2>

  <div class="hero">
    <!-- ERREUR: Image sans alt -->
    <img src="/images/hero-banner.jpg" width="1200" height="400" />
    <p>Découvrez nos produits high-tech au meilleur prix !</p>
  </div>

  <div class="content">
    <!-- ERREUR: Contenu trop court (< 300 mots) -->
    <p>Nous vendons des produits tech de qualité.</p>
    <p>Livraison rapide et SAV réactif.</p>

    <!-- ERREUR: Lien sans texte descriptif -->
    <a href="/products">Cliquez ici</a>
  </div>

  <div class="categories">
    <h2>Nos catégories</h2>
    <!-- ERREUR: Images sans alt -->
    <img src="/cat1.jpg" />
    <img src="/cat2.jpg" />
    <img src="/cat3.jpg" />
  </div>

  <!-- ERREUR: Pas de structure sémantique (header, nav, main, footer) -->
</body>
</html>`,

    correctHTML: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TechShop.fr - Boutique High-Tech & Électronique | Livraison Rapide</title>
  <meta name="description" content="Découvrez notre sélection de produits high-tech : smartphones, ordinateurs, accessoires. Livraison rapide en 24h et SAV réactif. Prix compétitifs garantis.">
</head>
<body>
  <header>
    <nav>
      <a href="/">Accueil</a>
      <a href="/products">Produits</a>
      <a href="/contact">Contact</a>
    </nav>
  </header>

  <main>
    <h1>Votre Boutique High-Tech de Confiance</h1>

    <div class="hero">
      <img src="/images/hero-banner.jpg" alt="Sélection de produits high-tech : smartphone, laptop et écouteurs sans fil" width="1200" height="400" />
      <p>Découvrez nos produits high-tech au meilleur prix !</p>
    </div>

    <div class="content">
      <h2>Pourquoi choisir TechShop ?</h2>
      <p>TechShop est votre partenaire high-tech depuis 2015. Nous sélectionnons pour vous les meilleurs produits électroniques du marché : smartphones dernière génération, ordinateurs portables performants, accessoires connectés et bien plus encore.</p>

      <p>Notre engagement : vous offrir des prix compétitifs, une livraison rapide en 24h partout en France, et un service après-vente réactif disponible 7j/7. Plus de 50 000 clients nous font déjà confiance.</p>

      <p>Que vous soyez un professionnel à la recherche d'équipements fiables ou un particulier passionné de nouvelles technologies, vous trouverez chez TechShop les produits qui correspondent à vos besoins et à votre budget.</p>

      <a href="/products" title="Découvrir tous nos produits high-tech">Découvrir notre catalogue de produits</a>
    </div>

    <div class="categories">
      <h2>Nos catégories</h2>
      <img src="/cat1.jpg" alt="Catégorie Smartphones et téléphones" />
      <img src="/cat2.jpg" alt="Catégorie Ordinateurs et laptops" />
      <img src="/cat3.jpg" alt="Catégorie Accessoires connectés" />
    </div>
  </main>

  <footer>
    <p>&copy; 2024 TechShop.fr - Tous droits réservés</p>
  </footer>
</body>
</html>`,

    idealScore: 85,
    errors: [
      {
        id: 'no-title',
        severity: 'critical',
        title: 'Balise <title> manquante',
        description: 'La balise title est essentielle. Elle apparaît dans les résultats de recherche et dans l\'onglet du navigateur.',
        impact: -10,
        fixCost: 5,
        line: 19,
        solution: '<title>TechShop.fr - Boutique High-Tech & Électronique | Livraison Rapide</title>'
      },
      {
        id: 'no-meta-description',
        severity: 'critical',
        title: 'Meta description manquante',
        description: 'Sans meta description, Google génère un snippet aléatoire depuis votre contenu.',
        impact: -8,
        fixCost: 5,
        line: 20,
        solution: '<meta name="description" content="...">'
      },
      {
        id: 'no-h1',
        severity: 'critical',
        title: 'Pas de balise H1',
        description: 'Le H1 est crucial pour indiquer le sujet principal de la page à Google.',
        impact: -7,
        fixCost: 5,
        line: 23,
        solution: '<h1>Votre Boutique High-Tech de Confiance</h1>'
      },
      {
        id: 'images-without-alt',
        severity: 'important',
        title: '4 images sans attribut alt',
        description: 'Les attributs alt aident Google à comprendre vos images et améliorent l\'accessibilité.',
        impact: -6,
        fixCost: 4,
        line: 28,
        solution: 'Ajouter des attributs alt descriptifs à toutes les images'
      },
      {
        id: 'thin-content',
        severity: 'important',
        title: 'Contenu trop court',
        description: 'Environ 30 mots seulement. Recommandé : 300+ mots pour un bon référencement.',
        impact: -5,
        fixCost: 7,
        line: 33,
        solution: 'Enrichir le contenu avec plus d\'informations utiles'
      },
      {
        id: 'bad-anchor-text',
        severity: 'minor',
        title: 'Lien avec texte "Cliquez ici"',
        description: 'Utilisez des textes de liens descriptifs pour améliorer le SEO.',
        impact: -2,
        fixCost: 2,
        line: 38,
        solution: '<a href="/products">Découvrir notre catalogue de produits</a>'
      },
      {
        id: 'no-semantic-html',
        severity: 'minor',
        title: 'Pas de structure HTML5 sémantique',
        description: 'Les balises <header>, <main>, <footer> améliorent la structure.',
        impact: -3,
        fixCost: 3,
        line: 49,
        solution: 'Utiliser les balises sémantiques HTML5'
      }
    ]
  },

  product: {
    id: 'product',
    name: "Fiche Produit - iPhone 15",
    type: "product",
    difficulty: 4,
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>iPhone</title>
  <!-- ERREUR: Title trop court et pas optimisé -->
  <meta name="description" content="iPhone à vendre">
  <!-- ERREUR: Meta description trop courte -->
</head>
<body>
  <h1>iPhone 15 Pro</h1>

  <div class="product-images">
    <!-- ERREUR: Images produit sans alt -->
    <img src="/iphone-1.jpg">
    <img src="/iphone-2.jpg">
    <img src="/iphone-3.jpg">
  </div>

  <div class="product-info">
    <!-- ERREUR: Pas de schema.org markup -->
    <p class="price">999€</p>
    <p class="availability">En stock</p>

    <!-- ERREUR: Description produit trop courte -->
    <h2>Description</h2>
    <p>Nouveau iPhone 15 Pro avec puce A17.</p>

    <!-- ERREUR: Pas de reviews/ratings -->
    <!-- ERREUR: Pas de breadcrumb -->

    <button>Acheter</button>
  </div>
</body>
</html>`,

    correctHTML: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>iPhone 15 Pro 256GB Titane Noir - Prix 999€ | TechShop.fr</title>
  <meta name="description" content="Achetez l'iPhone 15 Pro 256GB Titane Noir au prix de 999€. Puce A17 Pro, appareil photo 48MP, écran 120Hz. Livraison gratuite et garantie 2 ans.">

  <!-- Schema.org Product Markup -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "iPhone 15 Pro",
    "image": "https://techshop.fr/iphone-15-pro.jpg",
    "description": "iPhone 15 Pro avec puce A17 Pro",
    "brand": {
      "@type": "Brand",
      "name": "Apple"
    },
    "offers": {
      "@type": "Offer",
      "price": "999",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  }
  </script>
</head>
<body>
  <nav aria-label="Breadcrumb">
    <a href="/">Accueil</a> >
    <a href="/smartphones">Smartphones</a> >
    <span>iPhone 15 Pro</span>
  </nav>

  <main>
    <h1>iPhone 15 Pro 256GB Titane Noir</h1>

    <div class="product-images">
      <img src="/iphone-1.jpg" alt="iPhone 15 Pro vue de face - Écran Super Retina XDR">
      <img src="/iphone-2.jpg" alt="iPhone 15 Pro vue arrière - Triple caméra 48MP">
      <img src="/iphone-3.jpg" alt="iPhone 15 Pro couleur Titane Noir - Design premium">
    </div>

    <div class="product-info">
      <p class="price" itemProp="price">999€</p>
      <p class="availability">✓ En stock - Livraison gratuite</p>

      <h2>Description</h2>
      <div class="description">
        <p>Découvrez l'iPhone 15 Pro, le smartphone le plus avancé d'Apple. Équipé de la puce A17 Pro révolutionnaire, il offre des performances exceptionnelles pour la photo, les jeux et le multitâche.</p>

        <h3>Caractéristiques principales :</h3>
        <ul>
          <li>Puce A17 Pro gravée en 3nm pour des performances ultimes</li>
          <li>Écran Super Retina XDR 6.1" ProMotion 120Hz</li>
          <li>Système photo pro : 48MP principal + ultra grand-angle + téléobjectif</li>
          <li>Capacité 256GB pour stocker toutes vos photos et apps</li>
          <li>Autonomie toute la journée avec charge rapide</li>
          <li>Design en titane ultra-résistant</li>
        </ul>

        <p>Profitez d'une expérience utilisateur premium avec iOS 17, la 5G ultra-rapide et Face ID pour une sécurité maximale.</p>
      </div>

      <div class="ratings">
        <p>★★★★★ 4.8/5 (127 avis clients)</p>
      </div>

      <button aria-label="Ajouter l'iPhone 15 Pro au panier">Ajouter au panier</button>
    </div>
  </main>
</body>
</html>`,

    idealScore: 90,
    errors: [
      {
        id: 'title-not-optimized',
        severity: 'critical',
        title: 'Title trop court et pas optimisé',
        description: 'Le title "iPhone" est trop générique. Il devrait contenir le modèle, la capacité et le prix.',
        impact: -8,
        fixCost: 5,
        line: 5,
        solution: '<title>iPhone 15 Pro 256GB Titane Noir - Prix 999€ | TechShop.fr</title>'
      },
      {
        id: 'meta-desc-too-short',
        severity: 'important',
        title: 'Meta description trop courte',
        description: 'Seulement 18 caractères. Idéal : 120-155 caractères.',
        impact: -6,
        fixCost: 4,
        line: 6,
        solution: 'Rédiger une description détaillée avec caractéristiques clés'
      },
      {
        id: 'no-schema-markup',
        severity: 'critical',
        title: 'Pas de balisage Schema.org Product',
        description: 'Le Schema.org permet d\'afficher le prix, la dispo et les avis dans Google.',
        impact: -10,
        fixCost: 8,
        line: 10,
        solution: 'Ajouter le JSON-LD Schema.org Product'
      },
      {
        id: 'images-no-alt-product',
        severity: 'important',
        title: '3 images produit sans alt',
        description: 'Les alt des images produit sont cruciaux pour le SEO image.',
        impact: -5,
        fixCost: 4,
        line: 13,
        solution: 'Décrire précisément chaque vue du produit'
      },
      {
        id: 'thin-product-description',
        severity: 'important',
        title: 'Description produit insuffisante',
        description: 'Description trop courte. Détaillez les caractéristiques pour améliorer le SEO.',
        impact: -7,
        fixCost: 7,
        line: 15,
        solution: 'Rédiger 200-300 mots avec caractéristiques détaillées'
      },
      {
        id: 'no-breadcrumb',
        severity: 'minor',
        title: 'Pas de fil d\'Ariane (breadcrumb)',
        description: 'Le breadcrumb aide Google à comprendre la structure du site.',
        impact: -3,
        fixCost: 3,
        line: 12,
        solution: 'Ajouter navigation: Accueil > Smartphones > iPhone 15 Pro'
      },
      {
        id: 'no-reviews',
        severity: 'minor',
        title: 'Pas d\'avis clients',
        description: 'Les avis clients améliorent la confiance et le SEO.',
        impact: -4,
        fixCost: 3,
        line: 15,
        solution: 'Afficher les notes et avis clients'
      }
    ]
  },

  blog: {
    id: 'blog',
    name: "Article Blog - Guide Smartphone",
    type: "blog",
    difficulty: 3,
    html: `<!DOCTYPE html>
<html>
<head>
  <!-- ERREUR: Title trop générique -->
  <title>Comment choisir son smartphone</title>
  <!-- ERREUR: Meta description trop courte -->
  <meta name="description" content="Guide pour bien choisir son smartphone">
</head>
<body>
  <h1>Comment choisir son smartphone</h1>

  <!-- ERREUR: Pas de balise <time> pour la date -->
  <p>Publié le 15 mars 2024</p>

  <!-- ERREUR: Pas de balise <article> -->
  <div class="content">
    <!-- ERREUR: Contenu trop court (< 300 mots) -->
    <p>Choisir un smartphone peut être difficile.</p>
    <p>Voici quelques conseils.</p>

    <!-- ERREUR: Pas de sous-titres H2 -->
    <!-- ERREUR: Pas d'image -->
    <!-- ERREUR: Pas de liens internes -->
  </div>
</body>
</html>`,
    correctHTML: `<!DOCTYPE html>
<html lang="fr">
<head>
  <title>Comment Choisir son Smartphone en 2024 - Guide Complet | TechShop</title>
  <meta name="description" content="Découvrez notre guide complet pour choisir le meilleur smartphone en 2024 : budget, performances, appareil photo. Conseils d'experts TechShop.">
</head>
<body>
  <article>
    <h1>Comment Choisir son Smartphone en 2024</h1>

    <time datetime="2024-03-15">Publié le 15 mars 2024</time>

    <div class="content">
      <p>Choisir un smartphone adapté à vos besoins n'est pas toujours évident face à l'offre pléthorique. Entre les différentes marques, systèmes d'exploitation et gammes de prix, il est facile de s'y perdre. Ce guide vous aidera à faire le bon choix.</p>

      <h2>1. Définissez votre budget</h2>
      <p>Les smartphones sont disponibles de 150€ à plus de 1500€. Définissez d'abord votre budget pour cibler les modèles adaptés. Les smartphones milieu de gamme (300-600€) offrent aujourd'hui un excellent rapport qualité-prix.</p>

      <h2>2. Choisissez votre système d'exploitation</h2>
      <p>iOS pour iPhone ou Android pour les autres marques. iOS offre une intégration parfaite avec l'écosystème Apple, Android propose plus de choix et de personnalisation.</p>

      <h2>3. Les critères essentiels</h2>
      <p>Taille d'écran, qualité photo, autonomie, puissance : nos experts ont testé plus de 50 modèles pour vous aider.</p>

      <p>Découvrez notre <a href="/smartphones">sélection de smartphones</a> testés par nos soins.</p>
    </div>
  </article>
</body>
</html>`,
    idealScore: 75,
    errors: [
      {
        id: 'blog-title-generic',
        severity: 'important',
        title: 'Title trop générique',
        description: 'Le title manque de mots-clés et de contexte (année, marque du site).',
        impact: -5,
        fixCost: 4,
        line: 5,
        solution: '<title>Comment Choisir son Smartphone en 2024 - Guide Complet | TechShop</title>'
      },
      {
        id: 'blog-meta-short',
        severity: 'important',
        title: 'Meta description trop courte',
        description: '40 caractères seulement. Idéal : 120-155 caractères.',
        impact: -4,
        fixCost: 4,
        line: 6,
        solution: 'Rédiger description détaillée avec mots-clés'
      },
      {
        id: 'blog-no-article-tag',
        severity: 'minor',
        title: 'Pas de balise <article>',
        description: 'Un article de blog devrait utiliser la balise sémantique <article>.',
        impact: -2,
        fixCost: 2,
        line: 14,
        solution: 'Encadrer le contenu avec <article></article>'
      },
      {
        id: 'blog-thin-content',
        severity: 'critical',
        title: 'Contenu trop court',
        description: 'Environ 15 mots. Un article de blog doit faire 500+ mots minimum.',
        impact: -8,
        fixCost: 8,
        line: 15,
        solution: 'Rédiger un contenu complet avec plusieurs sections'
      },
      {
        id: 'blog-no-h2',
        severity: 'important',
        title: 'Pas de sous-titres H2',
        description: 'Structurez votre contenu avec des H2 pour le SEO et la lisibilité.',
        impact: -5,
        fixCost: 4,
        line: 15,
        solution: 'Ajouter des H2 pour chaque section'
      },
      {
        id: 'blog-no-internal-links',
        severity: 'minor',
        title: 'Pas de liens internes',
        description: 'Les liens internes renforcent votre maillage SEO.',
        impact: -3,
        fixCost: 2,
        line: 15,
        solution: 'Ajouter des liens vers d\'autres pages du site'
      }
    ]
  },

  contact: {
    id: 'contact',
    name: "Page Contact",
    type: "contact",
    difficulty: 2,
    html: `<!DOCTYPE html>
<html>
<head>
  <!-- ERREUR: Title trop court -->
  <title>Contact</title>
  <!-- ERREUR: Meta description manquante -->
</head>
<body>
  <h1>Contactez-nous</h1>

  <!-- ERREUR: Pas d'informations de contact structurées -->
  <p>Email : contact@example.com</p>
  <p>Téléphone : 01 23 45 67 89</p>

  <!-- ERREUR: Pas de Schema LocalBusiness -->

  <form>
    <!-- ERREUR: Formulaire sans labels accessibles -->
    <input type="text" placeholder="Nom">
    <input type="email" placeholder="Email">
    <textarea placeholder="Message"></textarea>
    <button>Envoyer</button>
  </form>
</body>
</html>`,

    correctHTML: `<!DOCTYPE html>
<html lang="fr">
<head>
  <title>Nous Contacter - TechShop.fr | Support Client 7j/7</title>
  <meta name="description" content="Contactez TechShop : support client disponible 7j/7, email, téléphone, chat en ligne. Réponse sous 24h. Adresse : 123 rue du Commerce, Paris.">

  <!-- Schema.org LocalBusiness -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "TechShop",
    "telephone": "+33-1-23-45-67-89",
    "email": "contact@techshop.fr",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 rue du Commerce",
      "addressLocality": "Paris",
      "postalCode": "75001",
      "addressCountry": "FR"
    },
    "openingHours": "Mo-Fr 09:00-18:00"
  }
  </script>
</head>
<body>
  <main>
    <h1>Contactez-nous</h1>

    <p>Notre équipe est à votre écoute pour répondre à toutes vos questions sur nos produits, commandes ou service après-vente.</p>

    <div class="contact-info" itemscope itemtype="https://schema.org/LocalBusiness">
      <h2>Nos coordonnées</h2>

      <div>
        <h3>Email</h3>
        <p itemprop="email">
          <a href="mailto:contact@techshop.fr">contact@techshop.fr</a>
        </p>
        <p>Réponse sous 24h</p>
      </div>

      <div>
        <h3>Téléphone</h3>
        <p itemprop="telephone">
          <a href="tel:+33123456789">01 23 45 67 89</a>
        </p>
        <p>Du lundi au vendredi, 9h-18h</p>
      </div>

      <div itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
        <h3>Adresse</h3>
        <p>
          <span itemprop="streetAddress">123 rue du Commerce</span><br>
          <span itemprop="postalCode">75001</span> <span itemprop="addressLocality">Paris</span><br>
          <span itemprop="addressCountry">France</span>
        </p>
      </div>
    </div>

    <form>
      <h2>Formulaire de contact</h2>

      <div>
        <label for="name">Nom complet</label>
        <input type="text" id="name" name="name" required>
      </div>

      <div>
        <label for="email">Adresse email</label>
        <input type="email" id="email" name="email" required>
      </div>

      <div>
        <label for="message">Votre message</label>
        <textarea id="message" name="message" rows="5" required></textarea>
      </div>

      <button type="submit">Envoyer votre message</button>
    </form>
  </main>
</body>
</html>`,

    idealScore: 60,
    errors: [
      {
        id: 'contact-title-short',
        severity: 'important',
        title: 'Title trop court',
        description: 'Le title "Contact" est trop générique. Ajoutez le nom de votre entreprise et des mots-clés.',
        impact: -5,
        fixCost: 4,
        line: 5,
        solution: '<title>Nous Contacter - TechShop.fr | Support Client 7j/7</title>'
      },
      {
        id: 'contact-no-meta',
        severity: 'important',
        title: 'Meta description manquante',
        description: 'Ajoutez une meta description mentionnant vos coordonnées et horaires.',
        impact: -4,
        fixCost: 4,
        line: 6,
        solution: '<meta name="description" content="Contactez TechShop : support client disponible 7j/7...">'
      },
      {
        id: 'contact-no-schema',
        severity: 'critical',
        title: 'Pas de Schema LocalBusiness',
        description: 'Le Schema LocalBusiness aide Google à afficher vos coordonnées dans les résultats.',
        impact: -8,
        fixCost: 8,
        line: 7,
        solution: 'Ajouter JSON-LD Schema LocalBusiness avec adresse et contact'
      },
      {
        id: 'contact-poor-structure',
        severity: 'minor',
        title: 'Informations de contact non structurées',
        description: 'Utilisez des balises sémantiques et microdata pour structurer vos coordonnées.',
        impact: -3,
        fixCost: 3,
        line: 10,
        solution: 'Utiliser itemscope/itemprop pour structurer les données'
      },
      {
        id: 'contact-form-accessibility',
        severity: 'minor',
        title: 'Formulaire sans labels',
        description: 'Les champs de formulaire doivent avoir des <label> pour l\'accessibilité et le SEO.',
        impact: -2,
        fixCost: 2,
        line: 16,
        solution: 'Ajouter <label for="..."> pour chaque champ'
      }
    ]
  },

  category: {
    id: 'category',
    name: "Page Catégorie - Smartphones",
    type: "category",
    difficulty: 3,
    html: `<!DOCTYPE html>
<html>
<head>
  <!-- ERREUR: Title trop court et pas optimisé -->
  <title>Smartphones</title>
  <!-- ERREUR: Meta description manquante -->
</head>
<body>
  <!-- ERREUR: H2 au lieu de H1 -->
  <h2>Smartphones</h2>

  <!-- ERREUR: Contenu trop court -->
  <p>Découvrez nos smartphones.</p>

  <!-- ERREUR: Pas de breadcrumb -->

  <div class="products">
    <!-- ERREUR: Images produits sans alt -->
    <div class="product">
      <img src="/iphone.jpg">
      <h3>iPhone 15 Pro</h3>
      <p>999€</p>
    </div>
    <div class="product">
      <img src="/samsung.jpg">
      <h3>Samsung S24</h3>
      <p>849€</p>
    </div>
  </div>

  <!-- ERREUR: Pas de filtres/options de tri -->
  <!-- ERREUR: Pas de pagination -->
</body>
</html>`,

    correctHTML: `<!DOCTYPE html>
<html lang="fr">
<head>
  <title>Smartphones - Plus de 50 Modèles Android & iPhone | TechShop.fr</title>
  <meta name="description" content="Achetez votre smartphone parmi notre sélection de 50+ modèles : iPhone, Samsung, Google Pixel. Prix de 299€ à 1499€. Livraison gratuite dès 50€.">
</head>
<body>
  <nav aria-label="Breadcrumb">
    <a href="/">Accueil</a> >
    <span>Smartphones</span>
  </nav>

  <main>
    <h1>Smartphones</h1>

    <div class="category-intro">
      <p>Découvrez notre sélection complète de smartphones pour tous les budgets. Des modèles d'entrée de gamme aux flagships premium, trouvez le téléphone qui correspond à vos besoins.</p>

      <p>Notre catalogue comprend les derniers modèles iPhone d'Apple, les smartphones Samsung Galaxy, les Google Pixel, ainsi que des marques comme Xiaomi, OnePlus et Oppo. Tous nos smartphones sont neufs, garantis constructeur, et livrés rapidement.</p>
    </div>

    <div class="filters">
      <h2>Filtrer par</h2>
      <select aria-label="Filtrer par marque">
        <option>Toutes les marques</option>
        <option>Apple</option>
        <option>Samsung</option>
        <option>Google</option>
      </select>
      <select aria-label="Filtrer par prix">
        <option>Tous les prix</option>
        <option>Moins de 300€</option>
        <option>300€ - 600€</option>
        <option>Plus de 600€</option>
      </select>
    </div>

    <div class="products">
      <div class="product">
        <img src="/iphone.jpg" alt="iPhone 15 Pro - Smartphone Apple 256GB Titane">
        <h3>iPhone 15 Pro</h3>
        <p>999€</p>
        <a href="/product/iphone-15-pro">Voir le produit</a>
      </div>
      <div class="product">
        <img src="/samsung.jpg" alt="Samsung Galaxy S24 - Smartphone Android 128GB">
        <h3>Samsung Galaxy S24</h3>
        <p>849€</p>
        <a href="/product/samsung-s24">Voir le produit</a>
      </div>
    </div>

    <div class="pagination">
      <a href="?page=1" aria-label="Page 1">1</a>
      <a href="?page=2" aria-label="Page 2">2</a>
      <a href="?page=3" aria-label="Page 3">3</a>
    </div>
  </main>
</body>
</html>`,

    idealScore: 75,
    errors: [
      {
        id: 'category-title-short',
        severity: 'critical',
        title: 'Title trop court et générique',
        description: 'Le title "Smartphones" manque de contexte. Ajoutez le nombre de produits, les marques et le nom du site.',
        impact: -7,
        fixCost: 5,
        line: 5,
        solution: '<title>Smartphones - Plus de 50 Modèles Android & iPhone | TechShop.fr</title>'
      },
      {
        id: 'category-no-meta',
        severity: 'critical',
        title: 'Meta description manquante',
        description: 'Une page catégorie doit avoir une description attrayante mentionnant les marques et prix.',
        impact: -6,
        fixCost: 5,
        line: 6,
        solution: 'Ajouter meta description avec marques, gamme de prix et USP'
      },
      {
        id: 'category-h2-instead-h1',
        severity: 'important',
        title: 'H2 utilisé au lieu de H1',
        description: 'Chaque page doit avoir un H1 unique. Remplacez le H2 par un H1.',
        impact: -5,
        fixCost: 4,
        line: 9,
        solution: '<h1>Smartphones</h1>'
      },
      {
        id: 'category-thin-content',
        severity: 'important',
        title: 'Contenu de catégorie insuffisant',
        description: 'Les pages catégories doivent avoir du contenu descriptif (100+ mots) pour le SEO.',
        impact: -6,
        fixCost: 7,
        line: 12,
        solution: 'Ajouter paragraphes descriptifs sur la catégorie'
      },
      {
        id: 'category-no-breadcrumb',
        severity: 'minor',
        title: 'Pas de fil d\'Ariane',
        description: 'Un breadcrumb aide les utilisateurs et Google à comprendre la structure du site.',
        impact: -3,
        fixCost: 3,
        line: 8,
        solution: 'Ajouter breadcrumb : Accueil > Smartphones'
      },
      {
        id: 'category-images-no-alt',
        severity: 'important',
        title: 'Images produits sans alt',
        description: 'Les vignettes produits doivent avoir des alt descriptifs incluant la marque et le modèle.',
        impact: -4,
        fixCost: 4,
        line: 18,
        solution: 'Ajouter alt="Marque Modèle - Description" à chaque image'
      },
      {
        id: 'category-no-filters',
        severity: 'minor',
        title: 'Pas de système de filtres',
        description: 'Les filtres améliorent l\'UX et peuvent créer des URLs indexables.',
        impact: -2,
        fixCost: 2,
        line: 14,
        solution: 'Ajouter filtres par marque, prix, caractéristiques'
      }
    ]
  },

  about: {
    id: 'about',
    name: "Page À Propos",
    type: "about",
    difficulty: 1,
    html: `<!DOCTYPE html>
<html>
<head>
  <!-- ERREUR: Title avec faute d'orthographe et pas optimisé -->
  <title>A propos</title>
  <!-- ERREUR: Meta description manquante -->
</head>
<body>
  <h1>À propos de TechShop</h1>

  <!-- ERREUR: Contenu très insuffisant -->
  <p>TechShop existe depuis 2015.</p>

  <!-- ERREUR: Pas de Schema Organization -->
  <!-- ERREUR: Pas de contenu trust (équipe, mission, valeurs) -->
</body>
</html>`,

    correctHTML: `<!DOCTYPE html>
<html lang="fr">
<head>
  <title>À Propos de TechShop - Notre Histoire & Engagement | Depuis 2015</title>
  <meta name="description" content="Découvrez l'histoire de TechShop, boutique high-tech de confiance depuis 2015. Notre mission : rendre la technologie accessible avec expertise et service client d'excellence.">

  <!-- Schema.org Organization -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TechShop",
    "url": "https://techshop.fr",
    "logo": "https://techshop.fr/logo.png",
    "foundingDate": "2015",
    "description": "Boutique en ligne spécialisée en produits high-tech et électronique grand public",
    "sameAs": [
      "https://facebook.com/techshop",
      "https://twitter.com/techshop",
      "https://instagram.com/techshop"
    ]
  }
  </script>
</head>
<body>
  <main>
    <h1>À propos de TechShop</h1>

    <article>
      <section>
        <h2>Notre Histoire</h2>
        <p>TechShop a été fondé en 2015 par une équipe de passionnés de nouvelles technologies, avec une mission simple : rendre les produits high-tech de qualité accessibles à tous, accompagnés d'un service client exceptionnel.</p>

        <p>Depuis nos débuts, nous avons accompagné plus de 50 000 clients dans le choix de leurs équipements technologiques. Notre expertise et notre écoute nous ont permis de devenir une référence dans la vente en ligne de produits high-tech en France.</p>
      </section>

      <section>
        <h2>Notre Mission</h2>
        <p>Nous croyons que la technologie doit simplifier la vie, pas la compliquer. C'est pourquoi nous sélectionnons rigoureusement chaque produit de notre catalogue, offrons des conseils d'experts gratuits, et assurons un service après-vente réactif disponible 7 jours sur 7.</p>
      </section>

      <section>
        <h2>Nos Valeurs</h2>
        <ul>
          <li><strong>Expertise :</strong> Notre équipe teste personnellement les produits avant de les proposer</li>
          <li><strong>Transparence :</strong> Prix clairs, avis clients authentiques, pas de frais cachés</li>
          <li><strong>Service :</strong> Support client disponible, livraison rapide, garanties étendues</li>
          <li><strong>Confiance :</strong> Plus de 50 000 clients satisfaits, note moyenne de 4.8/5</li>
        </ul>
      </section>

      <section>
        <h2>Notre Équipe</h2>
        <p>TechShop, c'est une équipe de 25 personnes passionnées basée à Paris, incluant des conseillers techniques, experts en logistique et spécialistes du service client, tous dédiés à votre satisfaction.</p>
      </section>
    </article>
  </main>
</body>
</html>`,

    idealScore: 65,
    errors: [
      {
        id: 'about-title-typo',
        severity: 'important',
        title: 'Title avec faute et pas optimisé',
        description: 'Faute : "A propos" au lieu de "À propos". Le title manque aussi de contexte et mots-clés.',
        impact: -5,
        fixCost: 4,
        line: 5,
        solution: '<title>À Propos de TechShop - Notre Histoire & Engagement | Depuis 2015</title>'
      },
      {
        id: 'about-no-meta',
        severity: 'important',
        title: 'Meta description manquante',
        description: 'La page "À propos" doit avoir une meta description présentant l\'histoire et les valeurs.',
        impact: -4,
        fixCost: 4,
        line: 6,
        solution: 'Ajouter meta description avec histoire, mission et année de création'
      },
      {
        id: 'about-no-schema-org',
        severity: 'critical',
        title: 'Pas de Schema Organization',
        description: 'Le Schema Organization aide Google à comprendre votre entreprise (date création, réseaux sociaux, etc.).',
        impact: -7,
        fixCost: 8,
        line: 7,
        solution: 'Ajouter JSON-LD Schema Organization'
      },
      {
        id: 'about-thin-content',
        severity: 'critical',
        title: 'Contenu très insuffisant',
        description: 'Une page "À propos" doit détailler l\'histoire, la mission, les valeurs et l\'équipe (200+ mots).',
        impact: -8,
        fixCost: 8,
        line: 11,
        solution: 'Développer : histoire, mission, valeurs, équipe, chiffres clés'
      }
    ]
  }
};

export default SEO_PAGES;
