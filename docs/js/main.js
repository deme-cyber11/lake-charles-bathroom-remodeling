/* ===== Sticky Header Shadow on Scroll ===== */
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
})();

/* ===== Mobile Nav Toggle ===== */
(function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav-links');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', function () {
    nav.classList.toggle('open');
    var expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
  });
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ===== Before / After Slider ===== */
(function () {
  document.querySelectorAll('.ba-slider').forEach(function (slider) {
    var before = slider.querySelector('.ba-before');
    var handle = slider.querySelector('.ba-handle');
    if (!before || !handle) return;
    var dragging = false;

    function move(x) {
      var rect = slider.getBoundingClientRect();
      var pct = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
      before.style.clipPath = 'inset(0 ' + ((1 - pct) * 100) + '% 0 0)';
      handle.style.left = (pct * 100) + '%';
    }

    slider.addEventListener('mousedown', function (e) { dragging = true; move(e.clientX); });
    window.addEventListener('mousemove', function (e) { if (dragging) move(e.clientX); });
    window.addEventListener('mouseup', function () { dragging = false; });

    slider.addEventListener('touchstart', function (e) { dragging = true; move(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchmove', function (e) { if (dragging) move(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchend', function () { dragging = false; });
  });
})();

/* ===== FAQ Accordion ===== */
(function () {
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var answer = item.querySelector('.faq-answer');
      var isOpen = item.classList.contains('open');

      item.closest('.faq-list').querySelectorAll('.faq-item.open').forEach(function (openItem) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
})();

/* ===== Contact Form via Web3Forms ===== */
(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    var origText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    fetch('https://lead-manager-api.irontigerdigital.workers.dev/ingest', {
      method: 'POST',
      body: new FormData(form)
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.success) {
        window.location.href = form.dataset.redirect || '/thank-you.html';
      } else {
        btn.textContent = 'Error — Try Again';
        btn.disabled = false;
        setTimeout(function () { btn.textContent = origText; }, 3000);
      }
    })
    .catch(function () {
      btn.textContent = 'Error — Try Again';
      btn.disabled = false;
      setTimeout(function () { btn.textContent = origText; }, 3000);
    });
  });
})();
