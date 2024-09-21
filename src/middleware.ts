import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isPublicPage = createRouteMatcher(["/auth"]);

export default convexAuthNextjsMiddleware((req) => {
  if (!isPublicPage(req) && !isAuthenticatedNextjs()) {
    return nextjsMiddlewareRedirect(req, "/auth");
  }
  if (isPublicPage(req) && isAuthenticatedNextjs()) {
    return nextjsMiddlewareRedirect(req, "/");
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
