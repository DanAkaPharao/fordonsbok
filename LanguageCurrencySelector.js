/**
 * LanguageCurrencySelector.js — Flaggbaserad språk- och valutaväljare
 *
 * Renderar en liten widget med:
 *   • Flagg-knappar för att byta språk (sv / en-GB)
 *   • En dropdown för att byta valuta (helt oberoende av språk)
 *
 * Sparar valet i localStorage så det överlever sidladdningar.
 *
 * Usage i index.html:
 *   <div id="i18nSelector"></div>
 *   <script type="module" src="LanguageCurrencySelector.js"></script>
 *
 * Eller manuellt i script.js:
 *   import { mountSelector } from './LanguageCurrencySelector.js';
 *   mountSelector('#i18nSelector');
 */

import { setLocale, getLocale, t } from './translations.js';
import { setCurrency, getCurrencyCode, ALL_CURRENCIES } from './currencies.js';

// ─── Tillgängliga språk ───────────────────────────────────────────────────────
const LANGUAGES = [
    { code: 'sv',    flag: '🇸🇪', label: 'Svenska' },
    { code: 'en-GB', flag: '🇬🇧', label: 'English (GB)' },
];

// ─── localStorage-nycklar ─────────────────────────────────────────────────────
const LS_LOCALE   = 'fordonsbok_locale';
const LS_CURRENCY = 'fordonsbok_currency';

// ─── Återställ sparade inställningar vid sidladdning ──────────────────────────
(function restorePreferences() {
    const savedLocale   = localStorage.getItem(LS_LOCALE);
    const savedCurrency = localStorage.getItem(LS_CURRENCY);
    if (savedLocale)   setLocale(savedLocale);
    if (savedCurrency) setCurrency(savedCurrency);
})();

// ─── Injecta CSS (en gång) ────────────────────────────────────────────────────
function injectStyles() {
    if (document.getElementById('i18n-selector-styles')) return;
    const style = document.createElement('style');
    style.id = 'i18n-selector-styles';
    style.textContent = `
        .i18n-selector {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 8px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.12);
            border-radius: 8px;
            user-select: none;
        }
        .i18n-selector__divider {
            width: 1px;
            height: 20px;
            background: rgba(255,255,255,0.15);
            margin: 0 2px;
        }
        .i18n-lang-btn {
            all: unset;
            cursor: pointer;
            font-size: 1.45rem;
            line-height: 1;
            border-radius: 4px;
            padding: 2px 4px;
            transition: transform 0.15s, opacity 0.15s;
            opacity: 0.45;
            position: relative;
        }
        .i18n-lang-btn:hover {
            opacity: 0.85;
            transform: scale(1.12);
        }
        .i18n-lang-btn.active {
            opacity: 1;
            transform: scale(1.18);
            /* glödeffekt matchar appens accent */
            filter: drop-shadow(0 0 5px rgba(255,165,0,0.7));
        }
        .i18n-lang-btn:focus-visible {
            outline: 2px solid rgba(255,165,0,0.8);
            outline-offset: 2px;
        }
        /* Tooltip */
        .i18n-lang-btn::after {
            content: attr(data-label);
            position: absolute;
            bottom: calc(100% + 6px);
            left: 50%;
            transform: translateX(-50%);
            background: rgba(20,20,20,0.92);
            color: #eee;
            font-size: 0.72rem;
            white-space: nowrap;
            padding: 3px 7px;
            border-radius: 4px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.15s;
            font-family: 'Space Mono', monospace;
        }
        .i18n-lang-btn:hover::after { opacity: 1; }

        /* Valutadropdown */
        .i18n-currency-select {
            all: unset;
            cursor: pointer;
            font-size: 0.78rem;
            font-family: 'Space Mono', monospace;
            color: rgba(255,255,255,0.75);
            background: transparent;
            border: none;
            padding: 2px 2px 2px 4px;
            /* Pil */
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(255,255,255,0.4)'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 2px center;
            padding-right: 16px;
            appearance: none;
            -webkit-appearance: none;
        }
        .i18n-currency-select:hover { color: rgba(255,165,0,0.9); }
        .i18n-currency-select:focus-visible {
            outline: 2px solid rgba(255,165,0,0.8);
            border-radius: 4px;
        }
        .i18n-currency-select option {
            background: #1a1a1a;
            color: #eee;
        }
    `;
    document.head.appendChild(style);
}

// ─── Bygg widget-HTML ─────────────────────────────────────────────────────────
function buildWidget(container) {
    const currentLocale   = getLocale();
    const currentCurrency = getCurrencyCode();

    // Språkflaggor
    const flagBtns = LANGUAGES.map(({ code, flag, label }) => `
        <button
            class="i18n-lang-btn ${code === currentLocale ? 'active' : ''}"
            data-locale="${code}"
            data-label="${label}"
            aria-label="${label}"
            aria-pressed="${code === currentLocale}"
            title="${label}"
        >${flag}</button>
    `).join('');

    // Valutadropdown – alla valutor, oavsett aktivt språk
    const currencyOptions = ALL_CURRENCIES.map(({ code, symbol, name, flag }) =>
        `<option value="${code}" ${code === currentCurrency ? 'selected' : ''}>
            ${flag} ${code} ${symbol}
        </option>`
    ).join('');

    container.innerHTML = `
        <div class="i18n-selector" role="group" aria-label="Language and currency">
            ${flagBtns}
            <span class="i18n-selector__divider" aria-hidden="true"></span>
            <select class="i18n-currency-select" aria-label="Currency / Valuta">
                ${currencyOptions}
            </select>
        </div>
    `;

    // ── Händelselyssnare ──────────────────────────────────────────────────────

    // Språkbyte
    container.querySelectorAll('.i18n-lang-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const newLocale = btn.dataset.locale;
            if (newLocale === getLocale()) return;
            setLocale(newLocale);
            localStorage.setItem(LS_LOCALE, newLocale);
            // Rita om widgeten och meddela resten av appen
            buildWidget(container);
            document.dispatchEvent(new CustomEvent('localeChanged', { detail: { locale: newLocale } }));
        });
    });

    // Valutabyte
    container.querySelector('.i18n-currency-select').addEventListener('change', (e) => {
        const newCode = e.target.value;
        setCurrency(newCode);
        localStorage.setItem(LS_CURRENCY, newCode);
        document.dispatchEvent(new CustomEvent('currencyChanged', { detail: { currency: newCode } }));
    });
}

// ─── Public: montera widgeten ─────────────────────────────────────────────────
/**
 * Montera språk- och valutaväljaren i ett element.
 *
 * @param {string|HTMLElement} target  – CSS-selektor eller DOM-element
 *
 * Lyssna på ändringar i resten av din kod:
 *   document.addEventListener('localeChanged',   (e) => { ... e.detail.locale   });
 *   document.addEventListener('currencyChanged', (e) => { ... e.detail.currency });
 */
export function mountSelector(target) {
    injectStyles();
    const container = typeof target === 'string'
        ? document.querySelector(target)
        : target;

    if (!container) {
        console.warn(`[i18n-selector] Could not find mount target: "${target}"`);
        return;
    }
    buildWidget(container);
}

// ─── Auto-mount om data-attribut finns ───────────────────────────────────────
// Lägg till  data-i18n-selector  på valfritt element i HTML så monteras
// widgeten automatiskt utan att behöva anropa mountSelector() manuellt.
//
//   <div data-i18n-selector></div>
//
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-i18n-selector]').forEach(mountSelector);
});

export default { mountSelector };
