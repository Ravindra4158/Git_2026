import React, { createContext, createElement, useContext, useEffect, useMemo, useState } from "react";

const RouterContext = createContext(null);

export function Router({ children }) {
  const [pathname, setPathname] = useState(window.location.pathname);
  const navigate = (to) => {
    window.history.pushState({}, "", to);
    setPathname(window.location.pathname);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const value = useMemo(() => ({ pathname, navigate }), [pathname]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function Link({ to, onClick, children, ...props }) {
  const router = useContext(RouterContext);
  return <a href={to} {...props} onClick={(event) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!to.startsWith("/") || to.startsWith("//")) return;
    event.preventDefault();
    router.navigate(to);
  }}>{children}</a>;
}

export function useNavigate() {
  return useContext(RouterContext).navigate;
}

export function useParams() {
  const { pathname } = useContext(RouterContext);
  const match = pathname.match(/^\/reports\/([^/]+)/);
  return match ? { reportId: decodeURIComponent(match[1]) } : {};
}

function matchRoute(pattern, pathname) {
  const expected = pattern.split("/").filter(Boolean);
  const actual = pathname.split("/").filter(Boolean);
  if (expected.length !== actual.length) return false;
  return expected.every((part, index) => part.startsWith(":") || part === actual[index]);
}

export function RouteView({ routes }) {
  const { pathname } = useContext(RouterContext);
  const route = routes.find((item) => matchRoute(item.path, pathname));
  return route ? createElement(route.component) : createElement("main", { className: "flow-page" }, "Page not found.");
}
