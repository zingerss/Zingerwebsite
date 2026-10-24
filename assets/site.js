// Zinger site: mobile nav toggle and Products dropdown. No tracking, no external calls.
(function () {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var toggle = header.querySelector('.nav-toggle');
    var ddBtn = header.querySelector('.dd-btn');
    var dd = header.querySelector('.dropdown');

    function closeDropdown() {
        if (!ddBtn) return;
        ddBtn.setAttribute('aria-expanded', 'false');
        dd.classList.remove('open');
    }

    if (toggle) {
        toggle.addEventListener('click', function () {
            var open = header.classList.toggle('nav-open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        });
    }

    if (ddBtn && dd) {
        ddBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            var open = ddBtn.getAttribute('aria-expanded') !== 'true';
            ddBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
            dd.classList.toggle('open', open);
        });
        document.addEventListener('click', function (e) {
            if (!dd.contains(e.target)) closeDropdown();
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        if (ddBtn && ddBtn.getAttribute('aria-expanded') === 'true') { closeDropdown(); ddBtn.focus(); return; }
        if (header.classList.contains('nav-open')) {
            header.classList.remove('nav-open');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.focus();
        }
    });
})();
