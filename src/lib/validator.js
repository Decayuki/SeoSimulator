/**
 * Validateur de code HTML
 *
 * Système intelligent pour valider les modifications des élèves
 * Compare le code utilisateur avec le code attendu et détecte les corrections
 */

/**
 * Valide le code utilisateur et détecte les corrections
 *
 * @param {string} userCode - Code modifié par l'élève
 * @param {string} correctCode - Code corrigé de référence
 * @param {Array} detectedErrors - Liste des erreurs initialement détectées
 * @returns {Object} Résultat de validation avec détails
 */
export function validateCode(userCode, correctCode, detectedErrors) {
  const results = {
    fixedErrors: [],
    remainingErrors: [],
    partialFixes: [],
    score: 0,
    totalPossibleScore: 0,
    feedback: [],
    improvements: 0
  };

  // Calculer le score total possible
  results.totalPossibleScore = detectedErrors.reduce((sum, err) => sum + Math.abs(err.impact), 0);

  // Normaliser les codes (supprimer espaces superflus, uniformiser)
  const normalizedUser = normalizeHTML(userCode);
  const normalizedCorrect = normalizeHTML(correctCode);

  // Vérifier chaque erreur
  detectedErrors.forEach(error => {
    const isFixed = checkErrorFixed(error, normalizedUser, normalizedCorrect);

    if (isFixed.fixed) {
      results.fixedErrors.push({
        ...error,
        confidence: isFixed.confidence
      });
      results.score += Math.abs(error.impact);
      results.improvements++;

      // Feedback positif
      results.feedback.push({
        type: 'success',
        message: `${error.title} : Corrigé avec succès ! (+${Math.abs(error.impact)} points)`,
        errorId: error.id
      });
    } else if (isFixed.partial) {
      results.partialFixes.push({
        ...error,
        reason: isFixed.reason
      });
      // Score partiel (50%)
      const partialScore = Math.floor(Math.abs(error.impact) * 0.5);
      results.score += partialScore;

      results.feedback.push({
        type: 'warning',
        message: `${error.title} : Partiellement corrigé (+${partialScore} points). ${isFixed.reason}`,
        errorId: error.id
      });
    } else {
      results.remainingErrors.push(error);

      results.feedback.push({
        type: 'error',
        message: `${error.title} : Non corrigé. ${isFixed.reason || 'Vérifiez votre code.'}`,
        errorId: error.id
      });
    }
  });

  // Calculer le pourcentage
  results.percentage = Math.round((results.score / results.totalPossibleScore) * 100) || 0;

  // Message général
  if (results.percentage === 100) {
    results.generalMessage = '🎉 Parfait ! Toutes les erreurs ont été corrigées !';
  } else if (results.percentage >= 75) {
    results.generalMessage = '✅ Excellent travail ! Encore quelques détails à peaufiner.';
  } else if (results.percentage >= 50) {
    results.generalMessage = '👍 Bon début ! Continuez vos corrections.';
  } else if (results.percentage > 0) {
    results.generalMessage = '💪 Vous êtes sur la bonne voie. Plusieurs erreurs restent à corriger.';
  } else {
    results.generalMessage = '⚠️ Aucune correction détectée. Consultez les indices et modifiez le code.';
  }

  return results;
}

/**
 * Normalise le code HTML pour la comparaison
 */
function normalizeHTML(html) {
  return html
    .toLowerCase()
    .replace(/\s+/g, ' ') // Espaces multiples → 1 espace
    .replace(/>\s+</g, '><') // Espaces entre balises
    .replace(/\s+>/g, '>') // Espaces avant >
    .replace(/<\s+/g, '<') // Espaces après <
    .trim();
}

/**
 * Vérifie si une erreur spécifique a été corrigée
 */
function checkErrorFixed(error, userCode, correctCode) {
  const errorId = error.id;

  // Vérifications spécifiques par type d'erreur
  if (errorId.includes('title') || errorId === 'no-title') {
    return checkTitleTag(userCode, correctCode, error);
  }

  if (errorId.includes('meta')) {
    return checkMetaDescription(userCode, correctCode, error);
  }

  if (errorId.includes('h1')) {
    return checkH1Tag(userCode, correctCode, error);
  }

  if (errorId.includes('img') || errorId.includes('alt')) {
    return checkImageAlt(userCode, correctCode, error);
  }

  if (errorId.includes('content') || errorId.includes('text') || errorId.includes('thin')) {
    return checkContentLength(userCode, correctCode, error);
  }

  if (errorId.includes('semantic')) {
    return checkSemanticHTML(userCode, correctCode, error);
  }

  if (errorId.includes('schema')) {
    return checkSchemaMarkup(userCode, correctCode, error);
  }

  if (errorId.includes('breadcrumb')) {
    return checkBreadcrumb(userCode, correctCode, error);
  }

  if (errorId.includes('anchor')) {
    return checkAnchorText(userCode, correctCode, error);
  }

  if (errorId.includes('link') || errorId.includes('internal')) {
    return checkInternalLinks(userCode, correctCode, error);
  }

  if (errorId.includes('review') || errorId.includes('rating')) {
    return checkReviews(userCode, correctCode, error);
  }

  if (errorId.includes('time') || errorId.includes('datetime')) {
    return checkTimeTag(userCode, correctCode, error);
  }

  if (errorId.includes('form') || errorId.includes('label') || errorId.includes('accessibility')) {
    return checkFormLabels(userCode, correctCode, error);
  }

  // Vérification générique par défaut
  return checkGenericFix(userCode, correctCode, error);
}

/** Vérifications spécifiques */

function checkTitleTag(userCode, correctCode, error) {
  const titleRegex = /<title>(.*?)<\/title>/;
  const userMatch = userCode.match(titleRegex);
  const correctMatch = correctCode.match(titleRegex);

  if (!userMatch) {
    return { fixed: false, partial: false, reason: 'Balise <title> toujours manquante' };
  }

  const userTitle = userMatch[1].trim();

  // Vérifier si le titre est non vide et descriptif
  if (userTitle.length === 0) {
    return { fixed: false, partial: false, reason: 'La balise <title> est vide' };
  }

  if (userTitle.length < 30) {
    return { fixed: false, partial: true, reason: 'Le titre est trop court (minimum 30 caractères recommandés)' };
  }

  if (userTitle.length > 60) {
    return { fixed: false, partial: true, reason: 'Le titre est trop long (maximum 60 caractères recommandés)' };
  }

  return { fixed: true, partial: false, confidence: 1.0 };
}

function checkMetaDescription(userCode, correctCode, error) {
  const metaRegex = /<meta\s+name=["']description["']\s+content=["'](.*?)["']/;
  const userMatch = userCode.match(metaRegex);

  if (!userMatch) {
    return { fixed: false, partial: false, reason: 'Meta description toujours manquante' };
  }

  const userDesc = userMatch[1].trim();

  if (userDesc.length === 0) {
    return { fixed: false, partial: false, reason: 'La meta description est vide' };
  }

  if (userDesc.length < 50) {
    return { fixed: false, partial: true, reason: 'La meta description est trop courte (minimum 50 caractères)' };
  }

  if (userDesc.length > 160) {
    return { fixed: false, partial: true, reason: 'La meta description est trop longue (maximum 160 caractères)' };
  }

  return { fixed: true, partial: false, confidence: 1.0 };
}

function checkH1Tag(userCode, correctCode, error) {
  const h1Regex = /<h1[^>]*>(.*?)<\/h1>/;
  const userMatch = userCode.match(h1Regex);

  if (!userMatch) {
    return { fixed: false, partial: false, reason: 'Balise <h1> toujours manquante' };
  }

  const userH1 = userMatch[1].trim();

  if (userH1.length === 0) {
    return { fixed: false, partial: false, reason: 'Le <h1> est vide' };
  }

  if (userH1.length < 10) {
    return { fixed: false, partial: true, reason: 'Le <h1> est trop court' };
  }

  // Vérifier qu'il n'y a qu'un seul H1
  const h1Count = (userCode.match(/<h1[^>]*>/g) || []).length;
  if (h1Count > 1) {
    return { fixed: false, partial: true, reason: 'Il ne doit y avoir qu\'un seul <h1> par page' };
  }

  return { fixed: true, partial: false, confidence: 1.0 };
}

function checkImageAlt(userCode, correctCode, error) {
  const imgRegex = /<img[^>]*>/g;
  const userImages = userCode.match(imgRegex) || [];

  if (userImages.length === 0) {
    return { fixed: false, partial: false, reason: 'Aucune balise <img> trouvée' };
  }

  let imagesWithoutAlt = 0;
  let imagesWithEmptyAlt = 0;

  userImages.forEach(img => {
    if (!img.includes('alt=')) {
      imagesWithoutAlt++;
    } else {
      const altMatch = img.match(/alt=["'](.*?)["']/);
      if (altMatch && altMatch[1].trim().length === 0) {
        imagesWithEmptyAlt++;
      }
    }
  });

  if (imagesWithoutAlt > 0) {
    return {
      fixed: false,
      partial: imagesWithoutAlt < userImages.length,
      reason: `${imagesWithoutAlt} image(s) sans attribut alt`
    };
  }

  if (imagesWithEmptyAlt > 0) {
    return {
      fixed: false,
      partial: true,
      reason: `${imagesWithEmptyAlt} image(s) avec alt vide`
    };
  }

  return { fixed: true, partial: false, confidence: 1.0 };
}

function checkContentLength(userCode, correctCode, error) {
  // Extraire le contenu textuel (approximatif)
  const textContent = userCode
    .replace(/<script[^>]*>.*?<\/script>/g, '')
    .replace(/<style[^>]*>.*?<\/style>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const wordCount = textContent.split(' ').filter(w => w.length > 0).length;

  if (wordCount < 50) {
    return { fixed: false, partial: false, reason: `Contenu trop court : ${wordCount} mots (minimum 50)` };
  }

  if (wordCount < 100) {
    return { fixed: false, partial: true, reason: `Contenu un peu court : ${wordCount} mots (recommandé 100+)` };
  }

  return { fixed: true, partial: false, confidence: 1.0 };
}

function checkSemanticHTML(userCode, correctCode, error) {
  const semanticTags = ['header', 'nav', 'main', 'article', 'section', 'aside', 'footer'];
  const foundTags = semanticTags.filter(tag => userCode.includes(`<${tag}`));

  if (foundTags.length === 0) {
    return { fixed: false, partial: false, reason: 'Aucune balise sémantique HTML5 trouvée' };
  }

  if (foundTags.length < 3) {
    return { fixed: false, partial: true, reason: `Seulement ${foundTags.length} balise(s) sémantique(s) trouvée(s)` };
  }

  return { fixed: true, partial: false, confidence: 1.0 };
}

function checkSchemaMarkup(userCode, correctCode, error) {
  // Vérifier la présence de Schema.org (JSON-LD ou microdata)
  const hasJsonLd = userCode.includes('application/ld+json') || userCode.includes('@type');
  const hasMicrodata = userCode.includes('itemscope') || userCode.includes('itemtype');
  const hasSchemaOrg = userCode.includes('schema.org');

  if (!hasJsonLd && !hasMicrodata && !hasSchemaOrg) {
    return { fixed: false, partial: false, reason: 'Aucun Schema.org markup trouvé (JSON-LD ou microdata)' };
  }

  // Vérifier le type de schema selon l'erreur
  if (error.id.includes('product')) {
    const hasProduct = userCode.includes('"@type": "Product"') || 
                      userCode.includes('itemtype="Product"') ||
                      userCode.includes('schema.org/Product');
    if (!hasProduct) {
      return { fixed: false, partial: true, reason: 'Schema.org trouvé mais pas de type Product' };
    }
  } else if (error.id.includes('localbusiness') || error.id.includes('contact')) {
    const hasLocalBusiness = userCode.includes('"@type": "LocalBusiness"') ||
                            userCode.includes('itemtype="LocalBusiness"') ||
                            userCode.includes('schema.org/LocalBusiness');
    if (!hasLocalBusiness) {
      return { fixed: false, partial: true, reason: 'Schema.org trouvé mais pas de type LocalBusiness' };
    }
  } else if (error.id.includes('organization') || error.id.includes('about')) {
    const hasOrganization = userCode.includes('"@type": "Organization"') ||
                           userCode.includes('itemtype="Organization"') ||
                           userCode.includes('schema.org/Organization');
    if (!hasOrganization) {
      return { fixed: false, partial: true, reason: 'Schema.org trouvé mais pas de type Organization' };
    }
  }

  return { fixed: true, partial: false, confidence: 1.0 };
}

function checkBreadcrumb(userCode, correctCode, error) {
  // Vérifier la présence d'un breadcrumb sémantique
  const hasBreadcrumbNav = userCode.includes('aria-label="breadcrumb"') ||
                          userCode.includes('aria-label="Breadcrumb"') ||
                          (userCode.includes('<nav') && userCode.includes('breadcrumb'));
  
  // Vérifier la structure avec <ol> (liste ordonnée)
  const hasBreadcrumbList = userCode.includes('<ol') && userCode.includes('breadcrumb');
  
  // Vérifier la présence de liens dans le breadcrumb
  const hasBreadcrumbLinks = hasBreadcrumbNav && (userCode.match(/<a[^>]*>/g) || []).length >= 2;

  if (!hasBreadcrumbNav && !hasBreadcrumbList) {
    return { fixed: false, partial: false, reason: 'Fil d\'ariane (breadcrumb) non trouvé. Utilisez <nav aria-label="Breadcrumb">' };
  }

  if (!hasBreadcrumbLinks) {
    return { fixed: false, partial: true, reason: 'Breadcrumb trouvé mais manque de liens de navigation' };
  }

  return { fixed: true, partial: false, confidence: 1.0 };
}

function checkAnchorText(userCode, correctCode, error) {
  const linkRegex = /<a[^>]*>(.*?)<\/a>/g;
  const links = [...userCode.matchAll(linkRegex)];

  if (links.length === 0) {
    return { fixed: false, partial: false, reason: 'Aucun lien trouvé' };
  }

  const badAnchors = links.filter(link => {
    const text = link[1].trim().toLowerCase();
    return text === 'cliquez ici' || text === 'ici' || text === 'lire plus' || text.length < 3;
  });

  if (badAnchors.length > 0) {
    return {
      fixed: false,
      partial: badAnchors.length < links.length,
      reason: `${badAnchors.length} lien(s) avec ancre non descriptive`
    };
  }

  return { fixed: true, partial: false, confidence: 1.0 };
}

function checkInternalLinks(userCode, correctCode, error) {
  const linkRegex = /<a[^>]*href=["']([^"']*)["'][^>]*>/g;
  const links = [...userCode.matchAll(linkRegex)];

  const internalLinks = links.filter(link =>
    link[1].startsWith('/') || link[1].startsWith('#') || !link[1].startsWith('http')
  );

  if (internalLinks.length === 0) {
    return { fixed: false, partial: false, reason: 'Aucun lien interne trouvé' };
  }

  if (internalLinks.length < 2) {
    return { fixed: false, partial: true, reason: 'Pas assez de liens internes (minimum 2 recommandés)' };
  }

  return { fixed: true, partial: false, confidence: 1.0 };
}

function checkReviews(userCode, correctCode, error) {
  // Vérifier la présence d'avis clients
  const hasReviews = userCode.includes('avis') ||
                     userCode.includes('review') ||
                     userCode.includes('rating') ||
                     userCode.includes('note') ||
                     userCode.includes('étoile') ||
                     userCode.includes('star') ||
                     userCode.includes('AggregateRating') ||
                     userCode.includes('Review');

  if (!hasReviews) {
    return { fixed: false, partial: false, reason: 'Aucun avis client trouvé. Ajoutez des avis ou notes clients.' };
  }

  // Vérifier si c'est dans Schema.org (meilleure pratique)
  const hasSchemaReview = userCode.includes('AggregateRating') || userCode.includes('Review');
  if (hasSchemaReview) {
    return { fixed: true, partial: false, confidence: 1.0 };
  }

  // Sinon, vérifier qu'il y a au moins du texte d'avis
  const reviewText = userCode.match(/(\d+[.,]\d+|\d+)\s*\/\s*5|(\d+)\s*étoile|(\d+)\s*star/i);
  if (reviewText) {
    return { fixed: true, partial: false, confidence: 0.8 };
  }

  return { fixed: false, partial: true, reason: 'Avis trouvé mais format non optimal. Utilisez Schema.org AggregateRating.' };
}

function checkTimeTag(userCode, correctCode, error) {
  // Vérifier la présence de la balise <time>
  const timeRegex = /<time[^>]*>/i;
  const timeMatch = userCode.match(timeRegex);

  if (!timeMatch) {
    return { fixed: false, partial: false, reason: 'Balise <time> manquante' };
  }

  // Vérifier que l'attribut datetime est présent
  const datetimeRegex = /<time[^>]*datetime=["']([^"']+)["']/i;
  const datetimeMatch = userCode.match(datetimeRegex);

  if (!datetimeMatch) {
    return { fixed: false, partial: true, reason: 'Balise <time> trouvée mais attribut datetime manquant' };
  }

  // Vérifier que la date est valide (format ISO ou similaire)
  const datetimeValue = datetimeMatch[1];
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}/;
  if (!isoDateRegex.test(datetimeValue)) {
    return { fixed: false, partial: true, reason: 'Attribut datetime présent mais format non valide (utilisez YYYY-MM-DD)' };
  }

  return { fixed: true, partial: false, confidence: 1.0 };
}

function checkFormLabels(userCode, correctCode, error) {
  // Trouver tous les champs de formulaire
  const inputRegex = /<(input|textarea|select)[^>]*>/gi;
  const formFields = [...userCode.matchAll(inputRegex)];

  if (formFields.length === 0) {
    return { fixed: false, partial: false, reason: 'Aucun champ de formulaire trouvé' };
  }

  let fieldsWithLabels = 0;
  let fieldsWithAria = 0;

  formFields.forEach(field => {
    const fieldTag = field[0];
    const fieldId = fieldTag.match(/id=["']([^"']+)["']/i);
    const fieldName = fieldTag.match(/name=["']([^"']+)["']/i);

    // Vérifier si le champ a un label associé via for/id
    if (fieldId) {
      const labelRegex = new RegExp(`<label[^>]*for=["']${fieldId[1]}["']`, 'i');
      if (userCode.match(labelRegex)) {
        fieldsWithLabels++;
      }
    }

    // Vérifier si le champ est dans un <label>
    const fieldIndex = userCode.indexOf(fieldTag);
    const beforeField = userCode.substring(Math.max(0, fieldIndex - 200), fieldIndex);
    if (beforeField.includes('<label')) {
      fieldsWithLabels++;
    }

    // Vérifier les attributs aria-label ou aria-labelledby
    if (fieldTag.includes('aria-label') || fieldTag.includes('aria-labelledby')) {
      fieldsWithAria++;
    }
  });

  const totalFields = formFields.length;
  const labeledFields = fieldsWithLabels + fieldsWithAria;

  if (labeledFields === 0) {
    return { fixed: false, partial: false, reason: 'Aucun champ de formulaire n\'a de label associé. Ajoutez des <label> ou aria-label.' };
  }

  if (labeledFields < totalFields) {
    return { 
      fixed: false, 
      partial: true, 
      reason: `${labeledFields}/${totalFields} champ(s) ont un label. Tous les champs doivent avoir un label.` 
    };
  }

  return { fixed: true, partial: false, confidence: 1.0 };
}

function checkGenericFix(userCode, correctCode, error) {
  // Si la solution est fournie, vérifier si elle est présente dans le code utilisateur
  if (error.solution) {
    const normalizedSolution = normalizeHTML(error.solution);
    const contains = userCode.includes(normalizedSolution);

    if (contains) {
      return { fixed: true, partial: false, confidence: 0.9 };
    }
  }

  return { fixed: false, partial: false, reason: 'Correction non détectée' };
}

/**
 * Calcule l'amélioration du ranking basée sur les corrections
 *
 * @param {Object} validationResults - Résultats de validateCode()
 * @param {number} currentRanking - Position actuelle dans la SERP
 * @returns {number} Nouvelle position estimée
 */
export function calculateNewRanking(validationResults, currentRanking) {
  const { score, totalPossibleScore } = validationResults;

  // Calculer l'amélioration basée sur le score
  const improvementPercentage = score / totalPossibleScore;

  // Formule : Plus on corrige, plus on monte dans le ranking
  // Maximum d'amélioration : 30 positions par tour
  const maxImprovement = 30;
  const improvement = Math.floor(maxImprovement * improvementPercentage);

  // Nouvelle position (ne peut pas être inférieure à 1)
  const newRanking = Math.max(1, currentRanking - improvement);

  return newRanking;
}

/**
 * Génère un rapport détaillé pour l'élève
 */
export function generateReport(validationResults, oldRanking, newRanking) {
  const report = {
    summary: {
      fixed: validationResults.fixedErrors.length,
      partial: validationResults.partialFixes.length,
      remaining: validationResults.remainingErrors.length,
      score: validationResults.score,
      maxScore: validationResults.totalPossibleScore,
      percentage: validationResults.percentage
    },
    ranking: {
      old: oldRanking,
      new: newRanking,
      improvement: oldRanking - newRanking
    },
    feedback: validationResults.feedback,
    generalMessage: validationResults.generalMessage
  };

  return report;
}
