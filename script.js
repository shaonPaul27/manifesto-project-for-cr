(function () {
  "use strict";

  var intro = document.getElementById("intro");
  var site = document.getElementById("site");
  var enterBtn = document.getElementById("enterBtn");
  var theme = document.getElementById("theme");
  var musicToggle = document.getElementById("musicToggle");

  /* ---------- Split headline words for the reveal-on-scroll effect ---------- */
  document.querySelectorAll("[data-split='words']").forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    words.forEach(function (word, i) {
      var clip = document.createElement("span");
      clip.className = "split-word";
      var inner = document.createElement("span");
      inner.textContent = word;
      inner.style.setProperty("--i", i);
      clip.appendChild(inner);
      el.appendChild(clip);
      el.appendChild(document.createTextNode(" "));
    });
  });

  /* ---------- Enter experience ---------- */
  function enterSite() {
    if (theme) {
      theme.volume = 0.85;
      var playPromise = theme.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {});
      }
    }

    intro.classList.add("is-leaving");
    site.removeAttribute("aria-hidden");

    if (musicToggle) {
      musicToggle.hidden = false;
      musicToggle.classList.remove("is-paused");
    }

    window.setTimeout(function () {
      intro.style.display = "none";
      document.body.style.overflow = "";
    }, 1150);

    enterBtn.removeEventListener("click", enterSite);
  }

  if (enterBtn) {
    enterBtn.addEventListener("click", enterSite);
  }

  /* ---------- "Join the comeback" / vote CTA also opens the intro gate if still visible ---------- */
  document.querySelectorAll("a[href='#vote'], a[href='#intro']").forEach(function (a) {
    a.addEventListener("click", function (e) {
      var targetId = a.getAttribute("href").slice(1);
      var targetEl = document.getElementById(targetId);
      if (targetEl && targetEl !== intro) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* ---------- Floating music control ---------- */
  if (musicToggle && theme) {
    musicToggle.addEventListener("click", function () {
      if (theme.paused) {
        theme.play().catch(function () {});
        musicToggle.classList.remove("is-paused");
        musicToggle.setAttribute("aria-label", "Pause music");
      } else {
        theme.pause();
        musicToggle.classList.add("is-paused");
        musicToggle.setAttribute("aria-label", "Play music");
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal-up, .reveal-in, [data-split]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  window.setTimeout(function () {
    document.querySelectorAll("#intro .reveal-in, #intro [data-split]").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }, 60);

  /* ---------- Stat counters ---------- */
  var statEls = document.querySelectorAll(".stats__num[data-count]");
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
  if (statEls.length && "IntersectionObserver" in window) {
    var statIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    statEls.forEach(function (el) {
      statIo.observe(el);
    });
  }

  /* ---------- Custom cursor glow + magnetic buttons (fine pointers only) ---------- */
  var isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (isFinePointer) {
    document.body.classList.add("has-fine-pointer");
    var glow = document.getElementById("cursorGlow");
    var mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

    document.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function raf() {
      glowX += (mouseX - glowX) * 0.18;
      glowY += (mouseY - glowY) * 0.18;
      if (glow) glow.style.transform = "translate(" + glowX + "px," + glowY + "px) translate(-50%,-50%)";
      window.requestAnimationFrame(raf);
    }
    window.requestAnimationFrame(raf);

    document.querySelectorAll(".magnetic").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var rect = btn.getBoundingClientRect();
        var relX = e.clientX - rect.left - rect.width / 2;
        var relY = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = "translate(" + relX * 0.28 + "px," + relY * 0.35 + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "translate(0,0)";
      });
    });

    document.querySelectorAll(".tilt").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = "perspective(700px) rotateY(" + (px * 8) + "deg) rotateX(" + (py * -8) + "deg)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "perspective(700px) rotateY(0deg) rotateX(0deg)";
      });
    });
  }

  /* ---------- Scroll progress bar ---------- */
  var progressBar = document.getElementById("progressBar");
  function updateProgress() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* ---------- Graceful placeholders for images not added yet ---------- */
  document.querySelectorAll("img").forEach(function (img) {
    img.addEventListener("error", function () {
      img.classList.add("img-missing");
      var wrap = img.closest(".photo, .portrait-frame, .intro__bg");
      if (wrap) {
        wrap.classList.add("has-missing");
        wrap.setAttribute("data-filename", img.getAttribute("src"));
      }
    });
  });
})();
