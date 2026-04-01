"use client";

import type { User } from "@supabase/supabase-js";
import { useEffect, useEffectEvent, useId, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { getPortalUserDisplayName, getPortalUserInitials } from "@/lib/portal-user";
import { navItems } from "@/lib/site-data";
import { createClient } from "@/lib/supabase/client";

type HeaderAccount = {
  email: string;
  initials: string;
  name: string;
};

type HeaderAuthStatus = {
  adminUser: HeaderAccount | null;
  portalUser: HeaderAccount | null;
};

type AccountMenuItem = {
  description: string;
  href?: string;
  icon: "admin" | "dashboard" | "logout" | "settings";
  id: string;
  label: string;
  onSelect?: () => void;
  tone?: "default" | "danger";
};

const EMPTY_AUTH_STATUS: HeaderAuthStatus = {
  adminUser: null,
  portalUser: null,
};

function buildPortalAccount(user: Pick<User, "email" | "user_metadata"> | null): HeaderAccount | null {
  if (!user) {
    return null;
  }

  return {
    email: user.email ?? "",
    initials: getPortalUserInitials(user),
    name: getPortalUserDisplayName(user),
  };
}

function buildCompactAccountName(name: string): string {
  const trimmed = name.trim();

  if (!trimmed) {
    return "Account";
  }

  const [firstWord] = trimmed.split(/\s+/);
  if (firstWord.length <= 12) {
    return firstWord;
  }

  return `${firstWord.slice(0, 11)}…`;
}

function AccountIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4 20c1.7-4.3 5-6 8-6s6.3 1.7 8 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDown({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="m5 7.5 5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DashboardGlyph() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M4 4.5h5.5v5.5H4zM10.5 4.5H16v3.5h-5.5zM10.5 9H16v6.5h-5.5zM4 11h5.5v4.5H4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AdminGlyph() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M10 2.75 4.5 5v4.35c0 3.63 2.13 6.97 5.5 8.4 3.37-1.43 5.5-4.77 5.5-8.4V5L10 2.75Zm0 4.15a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2Zm0 8.05a5.4 5.4 0 0 1-3.08-.96c.25-1.14 1.3-1.94 3.08-1.94 1.78 0 2.83.8 3.08 1.94A5.4 5.4 0 0 1 10 14.95Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SettingsGlyph() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M10 5.25a4.75 4.75 0 1 0 0 9.5 4.75 4.75 0 0 0 0-9.5ZM16 10a6.1 6.1 0 0 0-.1-1.06l1.43-1.11-1.42-2.46-1.73.7a6.38 6.38 0 0 0-1.84-1.06L12.1 3H7.9l-.24 2.01c-.66.24-1.27.6-1.84 1.06l-1.73-.7-1.42 2.46 1.43 1.11A6.1 6.1 0 0 0 4 10c0 .36.03.72.1 1.06l-1.43 1.11 1.42 2.46 1.73-.7c.57.46 1.18.82 1.84 1.06L7.9 17h4.2l.24-2.01c.66-.24 1.27-.6 1.84-1.06l1.73.7 1.42-2.46-1.43-1.11c.07-.34.1-.7.1-1.06Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LogoutGlyph() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M8 4.5H5.5A1.5 1.5 0 0 0 4 6v8a1.5 1.5 0 0 0 1.5 1.5H8M11 6.5 14.5 10 11 13.5M7.5 10H14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function isNavItemActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  if (pathname === href || pathname.startsWith(`${href}/`)) {
    return true;
  }

  if (href === "/lean-training-uk") {
    return pathname === "/book-lean-training";
  }

  return false;
}

export function SiteHeader() {
  const [supabase] = useState(() => createClient());
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [authStatus, setAuthStatus] = useState<HeaderAuthStatus>(EMPTY_AUTH_STATUS);
  const [isAuthResolved, setIsAuthResolved] = useState(false);
  const [isLoggingOut, startLogoutTransition] = useTransition();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuItemRefs = useRef<Array<HTMLAnchorElement | HTMLButtonElement | null>>([]);
  const router = useRouter();
  const pathname = usePathname();
  const menuId = useId();
  const triggerId = `${menuId}-trigger`;
  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";
  const isSolidHeader = isScrolled || isAuthPage || isMobileMenuOpen;
  const portalAccount = authStatus.portalUser;
  const adminAccount = authStatus.adminUser;
  const showPortalAccount = Boolean(portalAccount);
  const showAdminAccount = Boolean(adminAccount);
  const showAuthenticatedAccount = showPortalAccount || showAdminAccount;
  const primaryAccount = portalAccount ?? adminAccount;
  const primaryAccountName = primaryAccount?.name ?? "";
  const primaryAccountCompactName = buildCompactAccountName(primaryAccountName);
  const primaryAccountEmail = primaryAccount?.email ?? "";
  const primaryAccountInitials = primaryAccount?.initials ?? "TC";
  const accountEyebrowLabel = showAdminAccount && !showPortalAccount ? "Admin account" : "Account";

  const focusMenuItem = useEffectEvent((index: number) => {
    menuItemRefs.current[index]?.focus();
  });

  const closeAccountMenu = useEffectEvent((restoreFocus = false) => {
    setIsAccountMenuOpen(false);

    if (restoreFocus) {
      requestAnimationFrame(() => {
        triggerRef.current?.focus();
      });
    }
  });

  const syncPortalUser = useEffectEvent((user: User | null) => {
    setAuthStatus((current) => ({
      ...current,
      portalUser: buildPortalAccount(user),
    }));
    setIsAuthResolved(true);
  });

  const refreshAuthStatus = useEffectEvent(async () => {
    try {
      const [response, browserAuth] = await Promise.all([
        fetch("/api/auth/status", {
          cache: "no-store",
          credentials: "same-origin",
        }),
        supabase.auth.getUser(),
      ]);
      const browserPortalAccount = buildPortalAccount(browserAuth.data.user ?? null);

      if (!response.ok) {
        setAuthStatus({
          adminUser: null,
          portalUser: browserPortalAccount,
        });
        setIsAuthResolved(true);
        return;
      }

      const data = (await response.json()) as HeaderAuthStatus;
      setAuthStatus({
        adminUser: data.adminUser,
        portalUser: data.portalUser ?? browserPortalAccount,
      });
      setIsAuthResolved(true);
    } catch {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setAuthStatus({
        adminUser: null,
        portalUser: buildPortalAccount(user),
      });
      setIsAuthResolved(true);
    }
  });

  const handleAccountLogout = useEffectEvent(() => {
    startLogoutTransition(async () => {
      setIsAccountMenuOpen(false);
      setIsMobileMenuOpen(false);

      await Promise.allSettled([
        showPortalAccount ? supabase.auth.signOut() : Promise.resolve(),
        showAdminAccount
          ? fetch("/api/admin/session", {
              credentials: "same-origin",
              method: "DELETE",
            })
          : Promise.resolve(),
      ]);

      setAuthStatus(EMPTY_AUTH_STATUS);
      setIsAuthResolved(true);
      router.replace("/sign-in");
      router.refresh();
    });
  });

  const accountMenuItems: AccountMenuItem[] = [
    ...(showPortalAccount
      ? [
          {
            description: "Open your workspace",
            href: "/client-hub",
            icon: "dashboard" as const,
            id: "client-dashboard",
            label: "User dashboard",
          },
          {
            description: "Manage your account",
            href: "/client-hub/profile",
            icon: "settings" as const,
            id: "client-profile",
            label: "Profile settings",
          },
        ]
      : []),
    ...(showAdminAccount
      ? [
          {
            description: "Open the admin workspace",
            href: "/admin",
            icon: "admin" as const,
            id: "admin-panel",
            label: "Admin panel",
          },
          {
            description: "Manage admin details",
            href: "/admin/profile",
            icon: "settings" as const,
            id: "admin-profile",
            label: "Admin profile",
          },
        ]
      : []),
    ...(showAuthenticatedAccount
      ? [
          {
            description: "End this session manually",
            icon: "logout" as const,
            id: "logout",
            label: isLoggingOut ? "Logging out..." : "Log out",
            onSelect: handleAccountLogout,
            tone: "danger" as const,
          },
        ]
      : []),
  ];

  const openAccountMenu = useEffectEvent((target: "first" | "last" = "first") => {
    const lastIndex = accountMenuItems.length - 1;

    if (lastIndex < 0) {
      return;
    }

    setIsAccountMenuOpen(true);
    requestAnimationFrame(() => {
      focusMenuItem(target === "first" ? 0 : lastIndex);
    });
  });

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    void refreshAuthStatus();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isActive) {
        return;
      }

      syncPortalUser(session?.user ?? null);
      void refreshAuthStatus();
    });

    const handleWindowFocus = () => {
      if (isActive) {
        void refreshAuthStatus();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isActive) {
        void refreshAuthStatus();
      }
    };

    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isActive = false;
      subscription.unsubscribe();
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [supabase]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAccountMenuOpen(false);
    void refreshAuthStatus();
  }, [pathname]);

  useEffect(() => {
    if (!showAuthenticatedAccount) {
      setIsAccountMenuOpen(false);
    }
  }, [showAuthenticatedAccount]);

  useEffect(() => {
    if (!isAccountMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) {
        return;
      }

      closeAccountMenu();
    };

    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeAccountMenu(true);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleDocumentKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, [closeAccountMenu, isAccountMenuOpen]);

  const desktopAccountTriggerClassName = isSolidHeader
    ? "border-white/35 bg-white/10 text-white hover:bg-white/14"
    : "border-[#8a0917]/15 bg-white text-slate-900 hover:border-[#8a0917]/30 hover:bg-[#fff6f7]";
  const desktopAccountLabelClassName = isSolidHeader ? "text-white/65" : "text-slate-400";
  const desktopAccountMetaClassName = isSolidHeader ? "bg-white/14 text-white" : "bg-[#8a0917] text-white";
  const mobileCircleClassName = isSolidHeader
    ? "border-white/40 bg-white/10 text-white"
    : "border-[#8a0917]/15 bg-white text-[#8a0917]";

  function handleAccountTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsMobileMenuOpen(false);
      openAccountMenu("first");
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsMobileMenuOpen(false);
      openAccountMenu("last");
      return;
    }

    if (event.key === "Escape" && isAccountMenuOpen) {
      event.preventDefault();
      closeAccountMenu(true);
    }
  }

  function handleMenuKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const itemCount = accountMenuItems.length;

    if (!itemCount) {
      return;
    }

    const currentIndex = menuItemRefs.current.findIndex((item) => item === document.activeElement);

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % itemCount;
      focusMenuItem(nextIndex);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex = currentIndex < 0 ? itemCount - 1 : (currentIndex - 1 + itemCount) % itemCount;
      focusMenuItem(nextIndex);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusMenuItem(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      focusMenuItem(itemCount - 1);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeAccountMenu(true);
      return;
    }

    if (event.key === "Tab") {
      setIsAccountMenuOpen(false);
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isSolidHeader
          ? "border-white/20 bg-[rgba(138,9,23,0.92)] shadow-sm backdrop-blur-xl"
          : "border-white/0 bg-transparent backdrop-blur-0"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1 sm:px-6 lg:grid lg:grid-cols-[minmax(12rem,1fr)_auto_minmax(12rem,1fr)] lg:items-center lg:gap-6 lg:px-8">
        <Link
          href="/"
          className={`flex items-center rounded-xl text-white no-underline transition-all duration-300 lg:justify-self-start ${
            isSolidHeader
              ? "px-0"
              : "rounded-[1.35rem] border border-[#fff1f3]/30 bg-[rgba(138,9,23,0.72)] px-2 shadow-[0_14px_34px_rgba(69,7,14,0.28)] backdrop-blur-md"
          }`}
        >
          <Image
            src="/media/TCG%20Logo.png"
            alt="Tacklers Consulting Group logo"
            width={112}
            height={112}
            className={`h-20 w-32 object-contain ${
              isSolidHeader
                ? "[filter:drop-shadow(0_4px_16px_rgba(0,0,0,0.7))]"
                : "[filter:drop-shadow(0_4px_14px_rgba(0,0,0,0.42))]"
            }`}
            priority
          />
        </Link>

        <nav className="hidden min-w-0 items-center justify-center gap-6 lg:flex lg:justify-self-center">
          {navItems.map((item) => {
            const isActive = isNavItemActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`text-sm font-bold transition ${
                  isActive
                    ? isSolidHeader
                      ? "rounded-full bg-white px-3 py-2 text-[#8a0917]"
                      : "text-[#8a0917]"
                    : isSolidHeader
                      ? "text-white/85 hover:text-white"
                      : "text-slate-950 hover:text-slate-700"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex lg:justify-self-end">
          {showAuthenticatedAccount ? (
            <button
              ref={triggerRef}
              id={triggerId}
              type="button"
              aria-haspopup="menu"
              aria-expanded={isAccountMenuOpen}
              aria-controls={menuId}
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (isAccountMenuOpen) {
                  closeAccountMenu();
                } else {
                  openAccountMenu("first");
                }
              }}
              onKeyDown={handleAccountTriggerKeyDown}
              className={`inline-flex min-w-[3rem] items-center gap-3 rounded-full border px-3 py-2 text-left transition ${desktopAccountTriggerClassName}`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold uppercase tracking-[0.14em] ${desktopAccountMetaClassName}`}
              >
                {primaryAccountInitials}
              </span>
              <span className="min-w-0 hidden 2xl:block">
                <span className={`block text-[10px] font-bold uppercase tracking-[0.18em] ${desktopAccountLabelClassName}`}>
                  {accountEyebrowLabel}
                </span>
                <span className="mt-0.5 block max-w-[7.5rem] truncate text-sm font-semibold">
                  {primaryAccountCompactName}
                </span>
              </span>
              <ChevronDown className={`h-4 w-4 transition ${isAccountMenuOpen ? "rotate-180" : ""}`} />
            </button>
          ) : isAuthResolved ? (
            <Link
              href="/sign-in"
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
                isSolidHeader
                  ? "border-white/35 text-white/85 hover:bg-white/10"
                  : "border-[#8a0917]/30 text-[#8a0917] hover:bg-[#8a0917]/8"
              }`}
            >
              <AccountIcon className="h-4 w-4" />
              Sign in
            </Link>
          ) : (
            <div aria-hidden="true" className="invisible h-11 w-[7.25rem]" />
          )}

          <Link href="/discovery-call" className="button-light shrink-0 whitespace-nowrap">
            Book now
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {showAuthenticatedAccount ? (
            <button
              ref={triggerRef}
              id={triggerId}
              type="button"
              aria-haspopup="menu"
              aria-expanded={isAccountMenuOpen}
              aria-controls={menuId}
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (isAccountMenuOpen) {
                  closeAccountMenu();
                } else {
                  openAccountMenu("first");
                }
              }}
              onKeyDown={handleAccountTriggerKeyDown}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold uppercase tracking-[0.14em] transition ${mobileCircleClassName}`}
              aria-label={primaryAccountName ? `Open account menu for ${primaryAccountName}` : "Open account menu"}
            >
              {primaryAccountInitials}
            </button>
          ) : isAuthResolved ? (
            <Link
              href="/sign-in"
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-sm ${mobileCircleClassName}`}
              aria-label="Sign in"
            >
              <AccountIcon />
            </Link>
          ) : (
            <div aria-hidden="true" className="invisible h-10 w-10" />
          )}

          <button
            type="button"
            onClick={() => {
              setIsAccountMenuOpen(false);
              setIsMobileMenuOpen((prev) => !prev);
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-sm"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              {isMobileMenuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {showAuthenticatedAccount && isAccountMenuOpen ? (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-labelledby={triggerId}
          onKeyDown={handleMenuKeyDown}
          className="absolute right-4 top-[calc(100%+0.75rem)] z-[60] w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-[1.5rem] border border-black/5 bg-white p-2 shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:right-6 lg:right-8"
        >
          <div className="rounded-[1.2rem] bg-[#f6f2ee] px-4 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">{accountEyebrowLabel}</p>
            <p className="mt-2 text-base font-semibold text-slate-950">{primaryAccountName}</p>
            <p className="mt-1 break-all text-sm text-slate-500">{primaryAccountEmail}</p>
            {showPortalAccount && showAdminAccount ? (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a0917]">
                  User active
                </span>
                <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-700">
                  Admin active
                </span>
              </div>
            ) : null}
          </div>

          <div className="mt-2 grid gap-1 p-1">
            {accountMenuItems.map((item, index) => {
              const itemClassName =
                item.tone === "danger"
                  ? "hover:bg-[#fff5f5] focus:bg-[#fff5f5]"
                  : "hover:bg-[#f8f3f2] focus:bg-[#f8f3f2]";
              const iconClassName =
                item.tone === "danger"
                  ? "bg-[#fff4f6] text-[#8a0917]"
                  : item.icon === "admin"
                    ? "bg-slate-100 text-slate-800"
                    : "bg-[#fff4f6] text-[#8a0917]";
              const itemBody = (
                <span className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full ${iconClassName}`}>
                    {item.icon === "dashboard" ? <DashboardGlyph /> : null}
                    {item.icon === "admin" ? <AdminGlyph /> : null}
                    {item.icon === "settings" ? <SettingsGlyph /> : null}
                    {item.icon === "logout" ? <LogoutGlyph /> : null}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-slate-950">{item.label}</span>
                    <span className="mt-0.5 block text-xs text-slate-500">{item.description}</span>
                  </span>
                </span>
              );

              if (item.href) {
                return (
                  <Link
                    key={item.id}
                    ref={(element) => {
                      menuItemRefs.current[index] = element;
                    }}
                    href={item.href}
                    role="menuitem"
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                    }}
                    className={`flex items-center justify-between rounded-[1rem] px-3 py-3 text-left transition focus:outline-none ${itemClassName}`}
                  >
                    {itemBody}
                  </Link>
                );
              }

              return (
                <button
                  key={item.id}
                  ref={(element) => {
                    menuItemRefs.current[index] = element;
                  }}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    item.onSelect?.();
                  }}
                  className={`flex items-center justify-between rounded-[1rem] px-3 py-3 text-left transition focus:outline-none ${itemClassName}`}
                >
                  {itemBody}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {isMobileMenuOpen ? (
        <div className="border-t border-white/20 bg-[rgba(138,9,23,0.92)] px-4 py-4 backdrop-blur-md lg:hidden sm:px-6">
          {showAuthenticatedAccount ? (
            <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/60">{accountEyebrowLabel}</p>
              <p className="mt-2 text-base font-semibold">{primaryAccountName}</p>
              <p className="mt-1 break-all text-sm text-white/75">{primaryAccountEmail}</p>
              {showPortalAccount && showAdminAccount ? (
                <p className="mt-2 text-xs text-white/70">Both client and admin sessions are active on this browser.</p>
              ) : null}
              <div className="mt-4 grid gap-2">
                {showPortalAccount ? (
                  <>
                    <Link
                      href="/client-hub"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="button-light justify-center"
                    >
                      User dashboard
                    </Link>
                    <Link
                      href="/client-hub/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="button-light justify-center"
                    >
                      Profile settings
                    </Link>
                  </>
                ) : null}
                {showAdminAccount ? (
                  <>
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="button-light justify-center"
                    >
                      Admin panel
                    </Link>
                    <Link
                      href="/admin/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="button-light justify-center"
                    >
                      Admin profile
                    </Link>
                  </>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    handleAccountLogout();
                  }}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 bg-transparent px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-white/10"
                >
                  {isLoggingOut ? "Logging out..." : "Log out"}
                </button>
              </div>
            </div>
          ) : null}

          <nav className={`grid gap-2 ${showAuthenticatedAccount ? "mt-4" : ""}`}>
            {navItems.map((item) => {
              const isActive = isNavItemActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
                    isActive
                      ? "bg-white text-[#8a0917]"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 grid gap-2">
            {!showAuthenticatedAccount && isAuthResolved ? (
              <Link
                href="/sign-in"
                onClick={() => setIsMobileMenuOpen(false)}
                className="button-light justify-center"
              >
                Sign in
              </Link>
            ) : null}
            <Link
              href="/discovery-call"
              onClick={() => setIsMobileMenuOpen(false)}
              className="button-light justify-center whitespace-nowrap"
            >
              Book now
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
