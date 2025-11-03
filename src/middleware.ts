// // import { NextRequest, NextResponse } from 'next/server';

// // // Add your prod origin or remove CORS block if you only do same-origin requests.
// // const allowedOrigins = [
// //   'http://localhost:3000',
// //   process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') || '',
// // ].filter(Boolean);

// // function isDynamicPath(pathname: string) {
// //   // Only check nested routes like /categories/foo, /brands/bar, /products/baz
// //   // If you also want to check the index pages (/brands etc), use startsWith checks instead.
// //   return /^\/(categories|brands|products|industries)(\/|$)/.test(pathname);
// // }

// // export async function middleware(request: NextRequest) {
// //   const { pathname, search } = request.nextUrl;

// //   // Optional: keep logs quieter by skipping HEAD prefetches
// //   if (request.method !== 'HEAD') {
// //     console.log(`[MW] ${request.method} ${pathname}${search}`);
// //   }

// //   // CORS for API routes (optional)
// //   if (pathname.startsWith('/api/')) {
// //     const origin = request.headers.get('origin') || '';
// //     const res = NextResponse.next();

// //     if (origin && allowedOrigins.includes(origin.replace(/\/$/, ''))) {
// //       res.headers.set('Access-Control-Allow-Origin', origin);
// //       res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
// //       res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
// //     }
// //     if (request.method === 'OPTIONS') {
// //       return new NextResponse(null, { headers: res.headers, status: 204 });
// //     }
// //     return res;
// //   }

// //   // Redirect lookup for categories/brands/products
// //   if (isDynamicPath(pathname)) {
// //     const base = request.nextUrl.origin;
// //     const slug = pathname.replace(/^\/+|\/+$/g, ''); // e.g. "categories/old"
// //     try {
// //       const res = await fetch(`${base}/api/redirect/${encodeURIComponent(slug)}`, {
// //         cache: 'no-store',
// //         headers: { 'x-from-middleware': '1' },
// //       });

// //       if (res.ok) {
// //         const data = await res.json().catch(() => null as any);
// //         const to = typeof data?.to === 'string' ? data.to : null;
// //         const code = Number.parseInt(String(data?.code ?? ''), 10) || 301;

// //         if (to && to !== pathname) {
// //           const target = new URL(to.startsWith('/') ? to : `/${to}`, request.url);
// //           target.search = search; // preserve original query
// //           return NextResponse.redirect(target, code);
// //         }
// //       }
// //     } catch (err) {
// //       // Never crash the Edge runtime because of a failed lookup
// //       console.error('[MW] redirect lookup failed:', err);
// //     }
// //   }

// //   return NextResponse.next();
// // }

// // export const config = {
// //   matcher: [
// //     '/((?!_next|.*\\..*).*)', // run middleware on all routes except _next and static files
// //   ],
// // };

// import { NextRequest, NextResponse } from "next/server";

// const allowedOrigins = [
//   "http://localhost:3000",
//   process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") || "",
// ].filter(Boolean);

// function isDynamicPath(pathname: string) {
//   return /^\/(categories|brands|products|industries)(\/|$)/.test(pathname);
// }

// export async function middleware(request: NextRequest) {
//   const { pathname, search } = request.nextUrl;

//   // if (pathname.startsWith("/admin")) {
//   //   const pathWithoutAdmin = pathname.replace(/^\/admin/, "");
//   //   return NextResponse.redirect(
//   //     `https://admin.jaypeeassociates.co.in${pathWithoutAdmin || "/"}`
//   //   );
//   // }

//   if (request.method !== "HEAD") {
//     console.log(`[MW] ${request.method} ${pathname}${search}`);
//   }

//   // --- CORS for API routes ---
//   if (pathname.startsWith("/api/")) {
//     const origin = request.headers.get("origin") || "";
//     const res = NextResponse.next();

//     if (origin && allowedOrigins.includes(origin.replace(/\/$/, ""))) {
//       res.headers.set("Access-Control-Allow-Origin", origin);
//       res.headers.set(
//         "Access-Control-Allow-Methods",
//         "GET,POST,PUT,DELETE,PATCH,OPTIONS"
//       );
//       res.headers.set(
//         "Access-Control-Allow-Headers",
//         "Content-Type, Authorization"
//       );
//     }
//     if (request.method === "OPTIONS") {
//       return new NextResponse(null, { headers: res.headers, status: 204 });
//     }
//     return res;
//   }

//   // --- Redirect lookup ---
//   if (isDynamicPath(pathname)) {
//     const slug = pathname.replace(/^\/+|\/+$/g, "");

//     // ✅ Use a hybrid approach that works in both local dev & prod
//     const base =
//       process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ||
//       (process.env.NODE_ENV === "development"
//         ? request.nextUrl.origin // dev: need explicit origin
//         : ""); // prod: relative works fine

//     const url =
//       base === ""
//         ? `/api/redirect/${encodeURIComponent(slug)}`
//         : `${base}/api/redirect/${encodeURIComponent(slug)}`;

//     try {
//       const res = await fetch(url, {
//         cache: "no-store",
//         headers: { "x-from-middleware": "1" },
//       });

//       if (res.ok) {
//         const data = await res.json().catch(() => null as any);
//         const to = typeof data?.to === "string" ? data.to : null;
//         const code = Number.parseInt(String(data?.code ?? ""), 10) || 301;

//         if (to && to !== pathname) {
//           const target = new URL(
//             to.startsWith("/") ? to : `/${to}`,
//             request.url
//           );
//           target.search = search;
//           return NextResponse.redirect(target, code);
//         }
//       } else {
//         console.warn(
//           `[MW] Redirect API returned status ${res.status} for slug "${slug}"`
//         );
//       }
//     } catch (err) {
//       console.error("[MW] redirect lookup failed:", err);
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!_next|.*\\..*).*)"],
// };

// ...existing code...
import { NextRequest, NextResponse } from "next/server";

/**
 * Host-based routing middleware:
 * - Requests to admin.<base> are rewritten to /admin/* internally.
 * - Requests to <base>/admin/* are redirected to admin.<base> (preserve path).
 * - CORS for API routes includes both base and admin origins.
 * - Dynamic slug redirect lookup uses the incoming request origin.
 */

const allowedOrigins = [
  "http://localhost:3000",
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") || "",
  process.env.NEXT_PUBLIC_ADMIN_BASE_URL?.replace(/\/$/, "") || "",
].filter(Boolean);

function isDynamicPath(pathname: string) {
  return /^\/(categories|brands|products|industries)(\/|$)/.test(pathname);
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (request.method !== "HEAD") {
    console.log(`[MW] ${request.method} ${pathname}${search}`);
  }

  // Parse host (strip port) and derive base domain + admin host
  const rawHost = (request.headers.get("host") || "")
    .split(":")[0]
    .toLowerCase();
  const hostParts = rawHost.split(".");
  const baseDomain =
    hostParts.length > 1 ? hostParts.slice(-2).join(".") : rawHost;
  const adminHost = `admin.${baseDomain}`;
  const isAdminHost = rawHost === adminHost || rawHost.startsWith("admin.");

  // --- Admin host handling ---
  // Behaviour:
  // - External admin host paths SHOULD NOT include "/admin". If someone visits admin.<base>/admin/...
  //   redirect to admin.<base>/... (strip the /admin prefix).
  // - For admin host requests that do NOT include "/admin", rewrite internally to /admin/* so the app
  //   (which serves admin pages under /admin) continues to work.
  if (isAdminHost) {
    if (pathname.startsWith("/admin")) {
      // Redirect external admin host that includes /admin -> strip the prefix
      const pathWithoutAdmin = pathname.replace(/^\/admin/, "") || "/";
      const target = new URL(request.url);
      target.pathname = pathWithoutAdmin;
      return NextResponse.redirect(target, 308);
    } else {
      // Internally rewrite admin host requests (e.g. /dashboard) to /admin/dashboard
      const rewriteUrl = new URL(request.url);
      rewriteUrl.pathname = `/admin${pathname}`; // internal route
      return NextResponse.rewrite(rewriteUrl);
    }
  } else {
    // If request comes for example.com/admin/* redirect to admin.<base>
    if (pathname.startsWith("/admin")) {
      const pathWithoutAdmin = pathname.replace(/^\/admin/, "") || "/";
      const target = new URL(request.url);
      target.hostname = adminHost;
      target.pathname = pathWithoutAdmin;
      // preserve search/query
      return NextResponse.redirect(target, 308);
    }
  }

  // --- CORS for API routes ---
  if (pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin") || "";
    const res = NextResponse.next();

    if (origin && allowedOrigins.includes(origin.replace(/\/$/, ""))) {
      res.headers.set("Access-Control-Allow-Origin", origin);
      res.headers.set(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,DELETE,PATCH,OPTIONS"
      );
      res.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
    }

    if (request.method === "OPTIONS") {
      return new NextResponse(null, { headers: res.headers, status: 204 });
    }
    return res;
  }

  // --- Redirect lookup for categories/brands/products/industries ---
  if (isDynamicPath(pathname)) {
    const slug = pathname.replace(/^\/+|\/+$/g, "");
    // Use the incoming request origin so middleware calls the correct host (admin vs main)
    const base = request.nextUrl.origin;
    const url = `${base}/api/redirect/${encodeURIComponent(slug)}`;

    try {
      const res = await fetch(url, {
        cache: "no-store",
        headers: { "x-from-middleware": "1" },
      });

      if (res.ok) {
        const data = await res.json().catch(() => null as any);
        const to = typeof data?.to === "string" ? data.to : null;
        const code = Number.parseInt(String(data?.code ?? ""), 10) || 301;

        if (to && to !== pathname) {
          const target = new URL(
            to.startsWith("/") ? to : `/${to}`,
            request.url
          );
          target.search = search;
          return NextResponse.redirect(target, code);
        }
      } else {
        console.warn(
          `[MW] Redirect API returned status ${res.status} for slug "${slug}"`
        );
      }
    } catch (err) {
      console.error("[MW] redirect lookup failed:", err);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
// ...existing code...
