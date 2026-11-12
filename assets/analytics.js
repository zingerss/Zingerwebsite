/* Zinger Software Solutions: Google Analytics 4 with Consent Mode v2.
   Loaded in <head> of each page, before anything else runs.
   - Consent defaults are set before gtag.js loads.
   - EU/EEA, UK and Switzerland: everything denied until the visitor accepts.
   - Elsewhere: analytics allowed; ad storage and ad signals denied everywhere.
   - No ads features and no Google Signals.
   UTM tags (utm_source, utm_medium, utm_campaign) are read by GA4 automatically. */
(function () {
    var GA_ID = 'G-XJ4CVWHWRX';
    var KEY = 'zss-analytics-consent'; // 'granted' | 'denied'
    var CONSENT_REGIONS = [
        'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU',
        'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', // EU
        'IS', 'LI', 'NO', // EEA
        'GB', 'CH'
    ];

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('consent', 'default', {
        analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
        region: CONSENT_REGIONS, wait_for_update: 500
    });
    gtag('consent', 'default', {
        analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'
    });
    gtag('set', 'ads_data_redaction', true);

    function stored() {
        try { return localStorage.getItem(KEY); } catch (e) { return null; }
    }
    function remember(v) {
        try { localStorage.setItem(KEY, v); } catch (e) { /* storage blocked: ask again next visit */ }
    }
    var choice = stored();
    if (choice === 'granted' || choice === 'denied') {
        gtag('consent', 'update', { analytics_storage: choice });
    }

    gtag('js', new Date());
    gtag('config', GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);

    // The notice is shown only where consent is required. A static site can't see the
    // visitor's country, so the browser's time zone stands in for it; Google applies the
    // regional defaults above by location either way.
    function inConsentRegion() {
        var tz = '';
        try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { return true; }
        if (!tz) return true;
        if (/^Europe\//.test(tz)) return true;
        return [
            'Atlantic/Azores', 'Atlantic/Madeira', 'Atlantic/Canary', 'Atlantic/Faroe', 'Atlantic/Reykjavik',
            'Arctic/Longyearbyen', 'Africa/Ceuta', 'Asia/Nicosia', 'Asia/Famagusta', 'Indian/Reunion', 'Indian/Mayotte',
            'America/Guadeloupe', 'America/Martinique', 'America/Cayenne', 'America/St_Barthelemy', 'America/Marigot'
        ].indexOf(tz) !== -1;
    }

    function showNotice() {
        var old = document.querySelector('[data-zss-notice]');
        if (old) old.parentNode.removeChild(old);
        var box = document.createElement('div');
        box.setAttribute('data-zss-notice', '');
        box.setAttribute('role', 'region');
        box.setAttribute('aria-label', 'Cookie notice');
        box.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;z-index:500;max-width:560px;margin:0 auto;' +
            'background:#0f1a30;color:#fff;border:1px solid rgba(255,255,255,.16);border-radius:12px;padding:14px 16px;' +
            'box-shadow:0 10px 30px rgba(0,0,0,.35);font:14px/1.5 Inter,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;' +
            'display:flex;flex-wrap:wrap;gap:10px 14px;align-items:center';
        var p = document.createElement('p');
        p.style.cssText = 'margin:0;flex:1 1 260px;color:#d6dde9';
        p.innerHTML = 'We use Google Analytics cookies to count visits and see which pages bring people in. ' +
            'No ads, and we don’t sell personal data. <a href="/privacy.html" style="color:#4ecdc4">Privacy</a>';
        var row = document.createElement('div');
        row.style.cssText = 'display:flex;gap:8px';
        function btn(label, value) {
            var b = document.createElement('button');
            b.type = 'button';
            b.textContent = label;
            b.style.cssText = 'font:inherit;font-weight:600;border-radius:8px;padding:7px 14px;cursor:pointer;' +
                'background:#4ecdc4;color:#0a1020;border:1px solid #4ecdc4'; // same weight for both choices
            b.addEventListener('click', function () {
                gtag('consent', 'update', { analytics_storage: value });
                remember(value);
                box.parentNode && box.parentNode.removeChild(box);
            });
            return b;
        }
        row.appendChild(btn('Decline', 'denied'));
        row.appendChild(btn('Accept', 'granted'));
        box.appendChild(p);
        box.appendChild(row);
        document.body.appendChild(box);
    }

    if (!choice && inConsentRegion()) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showNotice);
        else showNotice();
    }

    // Lets the privacy page offer a "change my choice" link.
    window.zssAnalyticsReset = function () {
        try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
        showNotice(); // consent stays as it is until the visitor picks Accept or Decline
    };
})();
