// Keep navigation and public assets inside either a domain root or a Pages subdirectory.
export function sitePath(path = '', base = import.meta.env?.BASE_URL ?? '/') {
  return `${base.replace(/\/?$/, '/')}${path.replace(/^\/+/, '')}`;
}

export function routePath(pathname, base = import.meta.env?.BASE_URL ?? '/') {
  const prefix = base.replace(/\/$/, '');
  const path = prefix && (pathname === prefix || pathname.startsWith(`${prefix}/`))
    ? pathname.slice(prefix.length)
    : pathname;
  return path.replace(/\/$/, '');
}
