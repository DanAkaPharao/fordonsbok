/**
 * currencies.js — Fordonsbok valutahantering
 *
 * Valuta är HELT frikopplad från språk.
 * En svensk användare kan välja EUR eller USD; en engelsk användare kan välja SEK.
 *
 * Usage:
 *   import { getCurrency, setCurrency, ALL_CURRENCIES } from './currencies.js';
 *
 *   setCurrency('EUR');
 *   const { symbol, code, locale } = getCurrency();
 *   // → { symbol: '€', code: 'EUR', name: 'Euro', locale: 'sv-SE' }
 *
 *   // Formatera ett belopp:
 *   formatAmount(2500)   // → "2 500 €"  (beroende på aktiv valuta)
 */

// ─── Alla tillgängliga valutor ────────────────────────────────────────────────
export const ALL_CURRENCIES = [
    { code: 'SEK', symbol: 'kr',  name: 'Svensk krona',   flag: '🇸🇪', locale: 'sv-SE' },
    { code: 'EUR', symbol: '€',   name: 'Euro',           flag: '🇪🇺', locale: 'sv-SE' },
    { code: 'GBP', symbol: '£',   name: 'Brittiskt pund', flag: '🇬🇧', locale: 'en-GB' },
    { code: 'USD', symbol: '$',   name: 'US-dollar',      flag: '🇺🇸', locale: 'en-US' },
    { code: 'NOK', symbol: 'kr',  name: 'Norsk krone',    flag: '🇳🇴', locale: 'nb-NO' },
    { code: 'DKK', symbol: 'kr',  name: 'Dansk krone',    flag: '🇩🇰', locale: 'da-DK' },
    { code: 'CHF', symbol: 'CHF', name: 'Schweizerfranc', flag: '🇨🇭', locale: 'de-CH' },
    { code: 'PLN', symbol: 'zł',  name: 'Polsk zloty',    flag: '🇵🇱', locale: 'pl-PL' },
    { code: 'CZK', symbol: 'Kč',  name: 'Tjeckisk koruna',flag: '🇨🇿', locale: 'cs-CZ' },
];

// ─── Aktiv valuta (default: SEK) ─────────────────────────────────────────────
let _currencyCode = 'SEK';

/**
 * Byt aktiv valuta.
 * @param {string} code  – ISO 4217-kod, t.ex. 'EUR', 'GBP', 'SEK'
 */
export function setCurrency(code) {
    const found = ALL_CURRENCIES.find((c) => c.code === code);
    if (!found) {
        console.warn(`[currency] Unknown currency code "${code}". Keeping "${_currencyCode}".`);
        return;
    }
    _currencyCode = code;
}

/**
 * Hämta aktiv valuta som objekt.
 * @returns {{ code: string, symbol: string, name: string, flag: string, locale: string }}
 */
export function getCurrency() {
    return ALL_CURRENCIES.find((c) => c.code === _currencyCode);
}

/** Hämta enbart aktiv valutakod, t.ex. 'SEK'. */
export function getCurrencyCode() { return _currencyCode; }

/** Hämta enbart aktiv valutasymbol, t.ex. 'kr'. */
export function getCurrencySymbol() { return getCurrency().symbol; }

/**
 * Formatera ett tal med aktiv valuta.
 * Symbolen placeras enligt konvention för varje valuta.
 *
 * @param {number} amount
 * @param {object} [opts]
 * @param {boolean} [opts.showCode=false]  – visa ISO-kod istället för symbol
 * @returns {string}  t.ex. "2 500 kr", "€ 2.500", "£2,500"
 */
export function formatAmount(amount, { showCode = false } = {}) {
    if (amount == null || isNaN(amount)) return '—';
    const currency = getCurrency();
    try {
        return new Intl.NumberFormat(currency.locale, {
            style:    'currency',
            currency: currency.code,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    } catch {
        // Fallback ifall Intl inte stöder valutan
        const formatted = amount.toLocaleString(currency.locale);
        return showCode
            ? `${formatted}\u00a0${currency.code}`
            : `${formatted}\u00a0${currency.symbol}`;
    }
}

export default { ALL_CURRENCIES, setCurrency, getCurrency, getCurrencyCode, getCurrencySymbol, formatAmount };
