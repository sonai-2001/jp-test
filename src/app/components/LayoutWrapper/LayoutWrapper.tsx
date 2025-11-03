// "use client";

// import { usePathname } from "next/navigation";
// import Header from "../Header/Header";
// import Footer from "../Footer/Footer";
// import AdminHeader from "../Header/AdminHeader";

// export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();
//   const isMobileFooterGroup =
//     pathname.startsWith("/pdf")  || pathname.startsWith("/coming-soon")
//   const isMobileHeaderGroup =
//     pathname.startsWith("/pdf")

//   return (
//     <>
//       {/* {!isMobileHeaderGroup && <Header />} */}
//       {pathname.includes("admin") ? <AdminHeader /> : !isMobileHeaderGroup && <Header />}
//       {children}
//       {!isMobileFooterGroup && <Footer />}
//     </>
//   );
// }

"use client";

import { usePathname } from "next/navigation";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/app/services/redux/features/userSlice";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // const isMobileFooterGroup =
  //   pathname.startsWith("/pdf") || pathname.startsWith("/coming-soon");
  // const isMobileHeaderGroup = pathname.startsWith("/pdf");

  const AUTO_LOGOUT_TIME = 60 * 60 * 1000; // 1 hour in ms
  const router = useRouter();
  const dispatch = useDispatch();
  const [isAdminHost, setIsAdminHost] = useState(false);

  // ✅ Detect if current host is admin.<something>
  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      setIsAdminHost(host.startsWith("admin."));
    }
  }, []);

  const logOut = () => {
    localStorage.removeItem("jtoken");
    localStorage.removeItem("jid");
    localStorage.removeItem("type");
    localStorage.removeItem("image");
    localStorage.removeItem("email");
    dispatch(setUser(null));
    router.push("/");
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        logOut();
      }, AUTO_LOGOUT_TIME);
    };
    const activityEvents = ["mousemove", "keydown", "scroll", "touchstart"];
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );
    resetTimer();
    return () => {
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
      clearTimeout(timer);
    };
  }, []);

  const isPdfPage = pathname.startsWith("/pdf");
  const isComingSoon = pathname.startsWith("/coming-soon");
  const isAdminRoute = pathname.startsWith("/admin") || isAdminHost;

  const hideHeader = isAdminRoute || isPdfPage;
  const hideFooter = isAdminRoute || isPdfPage || isComingSoon;

  return (
    <>
      {/* {!pathname.includes("admin") && !isMobileHeaderGroup && <Header />}
      {children}
      {!isMobileFooterGroup && !pathname.includes("admin") && <Footer />} */}

      <>
        {!hideHeader && <Header />}
        {children}
        {!hideFooter && <Footer />}
      </>
    </>
  );
}
