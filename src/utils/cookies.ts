export const GUEST_COOKIE_KEY = 'wedding-guest-id';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export const setCookie = (name: string, value: string, maxAgeSeconds: number = COOKIE_MAX_AGE) => {
    document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
};

export const deleteCookie = (name: string) => {
    document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
};

export const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const matches = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return matches ? decodeURIComponent(matches[1]) : null;
};
