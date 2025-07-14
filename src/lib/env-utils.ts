/**
 * Utilitaires pour gérer les fonctionnalités de développement
 */

export const isDevEnvironment = () => {
  return process.env.NODE_ENV === 'development' || 
         process.env.NEXT_PUBLIC_SHOW_DEV_FEATURES === 'true';
};

export const shouldShowDevFeatures = () => {
  // En développement ou si explicitement activé
  return isDevEnvironment();
};

export const isProduction = () => {
  return process.env.NODE_ENV === 'production' && 
         process.env.NEXT_PUBLIC_SHOW_DEV_FEATURES !== 'true';
};
