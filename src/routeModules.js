export const routeModules = {
  home: () => import('./components/HomePage'),
  archive: () => import('./components/OrientationArchivePage'),
  team: () => import('./components/FullTeamPage'),
  karma: () => import('./components/KarmaWar/KarmaWarPage'),
  notFound: () => import('./components/NotFoundPage'),
}

export function routeKeyForPath(pathname) {
  if (pathname === '/') return 'home'
  if (pathname === '/orientation-2026') return 'archive'
  if (pathname === '/team') return 'team'
  if (pathname === '/karma-war') return 'karma'
  return 'notFound'
}
