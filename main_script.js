/*!
 * Pesona Kahuripan - Official Landing Page Interactive Script
 * Version: 3.6.2 (Production Interactive Bundle - Dynamic Domain & Subdomain Sitelink Engine)
 * Repository: https://github.com/pesonaku/landingpage
 */

// ================= ACTIVE DOMAIN & SITELINK RESOLVER =================
function getActiveSiteOrigin() {
  try {
    if (typeof window !== 'undefined' && window.location) {
      const origin = window.location.origin || (window.location.protocol + '//' + window.location.host);
      if (origin && !origin.startsWith('file:') && origin !== 'null') {
        return origin.replace(/\/+$/, '');
      }
    }
  } catch (e) {}
  return 'https://www.pesonakahuripan.biz.id';
}

function getActiveSiteLink(hashOrPath) {
  const origin = getActiveSiteOrigin();
  if (!hashOrPath) return origin;
  if (hashOrPath.startsWith('#')) {
    return origin + '/' + hashOrPath;
  }
  if (hashOrPath.startsWith('/')) {
    return origin + hashOrPath;
  }
  return origin + '/' + hashOrPath;
}

window.getActiveSiteOrigin = getActiveSiteOrigin;
window.getActiveSiteLink = getActiveSiteLink;

// KAMUS ICON HUGEICONS STROKE-ROUNDED RESMI UNTUK TIPE RUMAH PILIHAN
const SPEC_ICON_REGISTRY = {
  lb: '<i class="hgi-stroke hgi-ruler-dimension-line"></i>',
  lt: '<i class="hgi-stroke hgi-home-01"></i>',
  tamu: '<i class="hgi-stroke hgi-sofa-01"></i>',
  kamar: '<i class="hgi-stroke hgi-bed-double"></i>',
  mandi: '<i class="hgi-stroke hgi-bathtub-01"></i>',
  carport: '<i class="hgi-stroke hgi-car-01"></i>',
  hebel: '<i class="hgi-stroke hgi-brick-wall"></i>',
  dinding: '<i class="hgi-stroke hgi-brick-wall"></i>',
  taman: '<i class="hgi-stroke hgi-leaf-01"></i>',
  hook: '<i class="hgi-stroke hgi-leaf-01"></i>',
  listrik: '<i class="hgi-stroke hgi-bolt"></i>',
  air: '<i class="hgi-stroke hgi-tap-01"></i>',
  shm: '<i class="hgi-stroke hgi-certificate-01"></i>'
};

function initLandingPage() {
  if (window._pesonaLandingPageInitialized) return;
  window._pesonaLandingPageInitialized = true;
  // document.documentElement.classList.add('js-ready');

  // ================= MASTER MARKETING SYNC ENGINE =================
  function getMarketingConfig() {
    const masterData = document.getElementById('marketingMasterData');
    let rawName = "Mas Ro'uf";
    let rawPhone = "6287870988073";
    let rawPhoto = "https://blogger.googleusercontent.com/img/a/AVvXsEhYAwg4DAJhqn6ndZIAE2n5KdMonV9vOAnqoXxYV6vW3-LT_k6fpkjvxewI6YCIplv-vq3nAGWYA4pfxqleBp-fuNXj-aSn4H1zwq18PJWIdp7gskj-2TMkYDk5WKzEgrniImkt7uKfbVLV7kjudk-VfA8IFLTHlhPwm7K_bxAwICrNBDVlsvS6V9k_Vlg=s200";
    let rawRole = "Konsultan KPR Resmi Pesona Kahuripan";

    if (masterData) {
      if (masterData.getAttribute('data-name')) rawName = masterData.getAttribute('data-name').trim();
      if (masterData.getAttribute('data-phone')) rawPhone = masterData.getAttribute('data-phone').trim();
      if (masterData.getAttribute('data-photo')) rawPhoto = masterData.getAttribute('data-photo').trim();
      if (masterData.getAttribute('data-role')) rawRole = masterData.getAttribute('data-role').trim();
    } else if (window.MARKETING_CONFIG) {
      rawName = window.MARKETING_CONFIG.name || rawName;
      rawPhone = window.MARKETING_CONFIG.phone || rawPhone;
      rawPhoto = window.MARKETING_CONFIG.photo || rawPhoto;
      rawRole = window.MARKETING_CONFIG.role || rawRole;
    }

    let cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    if (!cleanPhone) cleanPhone = '6287870988073';

    let displayPhone = cleanPhone;
    if (cleanPhone.startsWith('62')) {
      displayPhone = '+62 ' + cleanPhone.slice(2, 5) + '-' + cleanPhone.slice(5, 9) + '-' + cleanPhone.slice(9);
    }

    return {
      name: rawName,
      phone: cleanPhone,
      displayPhone: displayPhone,
      photo: rawPhoto,
      role: rawRole
    };
  }

  function syncAllMarketingMentions(cfg) {
    if (!cfg) cfg = getMarketingConfig();

    // 1. Sinkronkan Foto Profil Marketing di Seluruh Halaman
    if (cfg.photo) {
      document.querySelectorAll('.marketing-avatar-target').forEach(function(img) {
        img.src = cfg.photo;
        img.alt = cfg.name;
      });
    }

    // 2. Sinkronkan Nama Marketing di Seluruh Elemen Target
    document.querySelectorAll('.marketing-name-target').forEach(function(el) {
      el.textContent = cfg.name;
    });

    // 3. Sinkronkan Role / Jabatan Marketing
    document.querySelectorAll('.marketing-role-target').forEach(function(el) {
      el.textContent = cfg.role;
    });

    // 4. Sinkronkan Nomor Telepon Format Display
    document.querySelectorAll('.marketing-phone-target').forEach(function(el) {
      el.textContent = cfg.displayPhone;
    });

    // 5. Sinkronkan Quick Chips Floating WhatsApp
    document.querySelectorAll('.chat-chip').forEach(function(chip) {
      let msg = chip.getAttribute('data-msg') || '';
      msg = msg.replace(/Halo\s+[^,]+,/gi, 'Halo ' + cfg.name + ',');
      chip.setAttribute('data-msg', msg);
    });

    // 6. Sinkronkan Nama Marketing di Ulasan Testimoni Konsumen
    document.querySelectorAll('.review-text').forEach(function(p) {
      if (!p.dataset.origHtml) {
        p.dataset.origHtml = p.innerHTML;
      }
      p.innerHTML = p.dataset.origHtml.replace(/Mas\s+Ro['&#39;]*uf/gi, cfg.name);
    });

    // 7. Sinkronkan SEMUA Tombol Direct WhatsApp & Sitelink Referensi di Seluruh Halaman
    const currentOrigin = getActiveSiteOrigin();

    document.querySelectorAll('a[href*="whatsapp.com"], a[href*="wa.me"], a.wa-dynamic-btn').forEach(function(link) {
      let href = link.getAttribute('href');
      if (href) {
        // Normalisasi & Update nomor telepon tujuan
        href = href.replace(/phone=[0-9]+/g, 'phone=' + cfg.phone);
        href = href.replace(/wa\.me\/[0-9]+/g, 'wa.me/' + cfg.phone);

        // Update sapaan nama di teks WhatsApp URL dan sesuaikan domain/subdomain referensi aktif
        try {
          let urlObj = new URL(href);
          let textParam = urlObj.searchParams.get('text');
          if (textParam) {
            textParam = textParam.replace(/Halo\s+(Mas\s+)?(Ro['&#39;]*uf|[^,]+),/gi, 'Halo ' + cfg.name + ',');
            // Ganti domain referensi website di dalam teks pesan dengan domain/subdomain aktif
            textParam = textParam.replace(/(Referensi(?:\s+Website)?:\s*)https?:\/\/[^\s\n#]+(\/#[^\s\n]+|#[^\s\n]+)?/gi, function(match, prefix, hash) {
              return prefix + currentOrigin + (hash ? (hash.startsWith('/') ? hash : '/' + hash) : '');
            });
            textParam = textParam.replace(/https?:\/\/(?:www\.)?pesonakahuripan\.biz\.id/gi, currentOrigin);
            urlObj.searchParams.set('text', textParam);
            href = urlObj.toString();
          }
        } catch (err) {
          href = href.replace(/Halo(%20|\s+)(Mas(%20|\s+))?(Ro['&#39;%27]*uf|[^,%]+)(%2C|,)/gi, 'Halo%20' + encodeURIComponent(cfg.name) + '%2C');
          href = href.replace(/https?:\/\/(?:www\.)?pesonakahuripan\.biz\.id/gi, currentOrigin);
          href = href.replace(/https%3A%2F%2F(?:www\.)?pesonakahuripan\.biz\.id/gi, encodeURIComponent(currentOrigin));
        }
        link.setAttribute('href', href);
      }
    });

    // Simpan ke konfigurasi global
    window.MARKETING_CONFIG = cfg;
  }

  // Jalankan sinkronisasi marketing awal
  const initialMarketingCfg = getMarketingConfig();
  syncAllMarketingMentions(initialMarketingCfg);

  // Observasi perubahan dinamis pada marketingMasterData
  const masterDataEl = document.getElementById('marketingMasterData');
  if (masterDataEl && window.MutationObserver) {
    const observer = new MutationObserver(function() {
      syncAllMarketingMentions(getMarketingConfig());
    });
    observer.observe(masterDataEl, { attributes: true });
  }

  window.getMarketingConfig = getMarketingConfig;
  window.syncAllMarketingMentions = syncAllMarketingMentions;

      // Inisialisasi parser Promo & Sinkronisasi WhatsApp
      try {
        if (typeof initPromoParser === 'function') initPromoParser();
      } catch (err) { console.warn('initPromoParser error:', err); }

      // Inisialisasi parser Footer & Sosial Media
      try {
        if (typeof initFooterParser === 'function') initFooterParser();
      } catch (err) { console.warn('initFooterParser error:', err); }

      // Inisialisasi parser Tipe Rumah & Detail Popup
      try {
        if (typeof initUnitCardAndPopupParser === 'function') initUnitCardAndPopupParser();
      } catch (err) { console.warn('initUnitCardAndPopupParser error:', err); }

      // Inisialisasi Icon Spesifikasi Dinamis
      try {
        if (typeof initDynamicSpecIcons === 'function') initDynamicSpecIcons();
      } catch (err) { console.warn('initDynamicSpecIcons error:', err); }

      // Inisialisasi parser harga bersih KPR
      try {
        if (typeof initPricingTextParser === 'function') initPricingTextParser();
      } catch (err) { console.warn('initPricingTextParser error:', err); }

      // A. Header OnScroll Effect
      const header = document.getElementById('header');
      window.addEventListener('scroll', function() {
        if (window.scrollY > 40) {
          header.classList.add('onScroll');
        } else {
          header.classList.remove('onScroll');
        }
      });

      // B. Mobile Menu Drawer Toggle & Auto-Close on Item Click
      const menuToggle = document.getElementById('menu-toggle');
      const mainMenu = document.getElementById('main-menu');
      if (menuToggle && mainMenu) {
        const ul = mainMenu.querySelector('ul');
        menuToggle.addEventListener('click', function(e) {
          e.stopPropagation();
          ul.classList.toggle('active');
        });

        // Menutup menu otomatis saat tautan apapun diklik (misal klik Galeri)
        mainMenu.querySelectorAll('a').forEach(function(link) {
          link.addEventListener('click', function(e) {
            ul.classList.remove('active');
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
              const target = document.querySelector(href);
              if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
                if (history.pushState) {
                  history.pushState(null, null, href);
                }
              }
            }
          });
        });

        // Menutup menu saat klik di luar area menu
        document.addEventListener('click', function(e) {
          if (!mainMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            ul.classList.remove('active');
          }
        });
      }

      // C. FAQ Accordion Toggle
      const faqItems = document.querySelectorAll('.faq-item');
      faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        if (question) {
          question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
          });
        }
      });

      // D. Floating WhatsApp Box Toggle
      const chatToggle = document.getElementById('chat-toggle');
      const chatBox = document.getElementById('chat-box');
      const chatClose = document.getElementById('chat-close');
      if (chatToggle && chatBox) {
        chatToggle.addEventListener('click', function(e) {
          e.stopPropagation();
          chatBox.classList.toggle('open');
        });
        if (chatClose) {
          chatClose.addEventListener('click', function(e) {
            e.stopPropagation();
            chatBox.classList.remove('open');
          });
        }
        document.addEventListener('click', function(e) {
          if (!chatBox.contains(e.target) && !chatToggle.contains(e.target)) {
            chatBox.classList.remove('open');
          }
        });
      }

      // D2. Quick Chips Click to fill WhatsApp message
      document.querySelectorAll('.chat-chip').forEach(function(chip) {
        chip.addEventListener('click', function(e) {
          e.stopPropagation();
          const msgArea = document.getElementById('wa-message');
          if (msgArea) {
            msgArea.value = this.getAttribute('data-msg') || this.innerText;
            msgArea.focus();
          }
        });
      });

      // D3. Real-time Phone Validation on Typing & Blur
      const phoneInput = document.getElementById('wa-phone-user');
      const phoneError = document.getElementById('wa-phone-error');
      if (phoneInput) {
        phoneInput.addEventListener('input', function() {
          // Hanya izinkan angka, spasi, +, dan -
          this.value = this.value.replace(/[^\d+\-\s]/g, '');
          if (phoneInput.classList.contains('is-invalid')) {
            const check = validateIndonesianPhone(this.value);
            if (check.isValid) {
              phoneInput.classList.remove('is-invalid');
              if (phoneError) phoneError.style.display = 'none';
            }
          }
        });

        phoneInput.addEventListener('blur', function() {
          if (this.value.trim().length > 0) {
            const check = validateIndonesianPhone(this.value);
            if (!check.isValid) {
              phoneInput.classList.add('is-invalid');
              if (phoneError) {
                phoneError.textContent = check.message;
                phoneError.style.display = 'block';
              }
            } else {
              phoneInput.classList.remove('is-invalid');
              if (phoneError) phoneError.style.display = 'none';
            }
          } else {
            phoneInput.classList.remove('is-invalid');
            if (phoneError) phoneError.style.display = 'none';
          }
        });
      }

      // E. Native Modal Popup Engine (Trigger: [target^="pop-"], .service-card-img, .btn-service-detail)
      document.addEventListener('click', function(e) {
        // Jangan buka modal jika yang diklik adalah tombol direct WhatsApp
        if (e.target.closest('a[href*="whatsapp"], a[href*="api.whatsapp.com"], .btn-service-consult, .wa-dynamic-btn')) return;

        const btn = e.target.closest('[target^="pop-"], .service-card-img, .btn-service-detail');
        if (!btn) return;
        e.preventDefault();

        let popId = btn.getAttribute('target') || '';
        if (!popId) {
          const parentCard = btn.closest('.service-card') || btn.closest('.widget');
          if (parentCard) {
            const uId = parentCard.getAttribute('data-id') || parentCard.id || parentCard.closest('.widget')?.id || '';
            if (uId) popId = `pop-service-${uId}`;
          }
        }
        let source = popId ? document.getElementById(popId) : null;
        if (!source && popId) {
          // Fallback 1: Strip instance suffix if present (e.g. pop-service-Image31_0 -> pop-service-Image31)
          const cleanId = popId.replace(/[_-][0-9]+$/, '');
          source = document.getElementById(cleanId);
        }
        if (!source) {
          // Fallback 2: Check inside closest card or parent widget
          const parentCard = btn.closest('.service-card') || btn.closest('.widget');
          if (parentCard) {
            source = parentCard.querySelector('.unit-detail-source') ||
                     (parentCard.nextElementSibling && parentCard.nextElementSibling.classList.contains('unit-detail-source') ? parentCard.nextElementSibling : null);
          }
        }
        if (!source && popId) {
          // Fallback 3: Match Image ID (e.g. Image31, Image32, etc.)
          const match = popId.match(/Image\d+/);
          if (match) {
            source = document.querySelector(`.unit-detail-source[data-unit-id="${match[0]}"]`);
          }
        }
        if (!source) return;

        const title = source.getAttribute('data-pop-title') || 'Detail Informasi';
        const modal = document.createElement('div');
        modal.className = 'pop open';
        modal.innerHTML = `
          <div class="pop-wrap">
            <div class="pop-header">
              <div class="pop-title"><h3>${title}</h3></div>
              <button aria-label="Tutup Detail" class="pop-close">&times;</button>
            </div>
            <div class="pop-content">${source.innerHTML}</div>
          </div>
        `;

        // Sinkronisasi WhatsApp link pada modal yang baru dibuka
        const ctaBtn = modal.querySelector('a.btn-cta') || modal.querySelector('.wa-dynamic-btn');
        if (ctaBtn) {
          const cfg = (typeof getMarketingConfig === 'function') ? getMarketingConfig() : (window.MARKETING_CONFIG || { name: "Mas Ro'uf", phone: "6287870988073" });
          const unitName = title.replace(/^Detail Unit:\s*/i, '');
          const waText = `Halo ${cfg.name}, saya tertarik konsultasi Unit ${unitName} Pesona Kahuripan.\n\nReferensi: ${getActiveSiteLink('#service')}`;
          ctaBtn.href = `https://api.whatsapp.com/send?phone=${cfg.phone}&text=${encodeURIComponent(waText)}`;
          const spanEl = ctaBtn.querySelector('span');
          if (spanEl) {
            spanEl.innerHTML = `Konsultasi dengan <span class="marketing-name-target">${cfg.name}</span>`;
          }
        }

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        const closeModal = function() {
          modal.classList.remove('open');
          document.removeEventListener('keydown', onKeyDown);
          setTimeout(() => { modal.remove(); document.body.style.overflow = ''; }, 200);
        };

        const onKeyDown = function(evt) {
          if (evt.key === 'Escape' || evt.keyCode === 27) {
            closeModal();
          }
        };
        document.addEventListener('keydown', onKeyDown);

        const closeBtn = modal.querySelector('.pop-close');
        if (closeBtn) {
          closeBtn.addEventListener('click', function(evt) {
            evt.preventDefault();
            closeModal();
          });
          closeBtn.addEventListener('pointerup', function(evt) {
            evt.preventDefault();
            closeModal();
          });
        }
        modal.addEventListener('click', function(evt) {
          if (evt.target === modal) closeModal();
        });
      });

      // F. Galeri Show More / Collapsible Engine (Default: 6 Foto)
      const gallerySection = document.getElementById('gallery-section') || document.querySelector('.gallery-section');
      const btnGalleryToggle = document.getElementById('btnGalleryToggle');

      if (gallerySection && btnGalleryToggle) {
        const galleryWidgets = gallerySection.querySelectorAll('.widget');
        if (galleryWidgets.length <= 6) {
          btnGalleryToggle.style.display = 'none';
        } else {
          gallerySection.classList.add('is-collapsed');
          btnGalleryToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const isCollapsed = gallerySection.classList.contains('is-collapsed');
            if (isCollapsed) {
              gallerySection.classList.remove('is-collapsed');
              btnGalleryToggle.classList.add('expanded');
              const textSpan = btnGalleryToggle.querySelector('.btn-text');
              if (textSpan) textSpan.textContent = 'Tampilkan Lebih Sedikit';
              const icon = btnGalleryToggle.querySelector('.toggle-arrow');
              if (icon) {
                icon.className = 'toggle-arrow hgi-stroke hgi-arrow-up-01';
              }
              gallerySection.querySelectorAll('.widget:nth-child(n+7) .reveal, .widget:nth-child(n+7) .gallery-item').forEach(function(el) {
                el.classList.add('active');
                el.style.opacity = '1';
                el.style.transform = 'none';
              });
            } else {
              gallerySection.classList.add('is-collapsed');
              btnGalleryToggle.classList.remove('expanded');
              const textSpan = btnGalleryToggle.querySelector('.btn-text');
              if (textSpan) textSpan.textContent = 'Lihat Lebih Banyak Dokumentasi (12 Foto)';
              const icon = btnGalleryToggle.querySelector('.toggle-arrow');
              if (icon) {
                icon.className = 'toggle-arrow hgi-stroke hgi-arrow-down-01';
              }
              const galAnchor = document.getElementById('gallery');
              if (galAnchor) {
                galAnchor.scrollIntoView({ behavior: 'smooth' });
              }
            }
          });
        }
      }

      // G. Testimoni Carousel Auto-Slide & Touch Swiping
      const reviewTrack = document.querySelector('.review-section');
      const reviewContainer = document.getElementById('reviewCarousel');
      const prevBtn = document.getElementById('reviewPrev');
      const nextBtn = document.getElementById('reviewNext');
      const dotsContainer = document.getElementById('reviewDots');

      if (reviewTrack && reviewContainer) {
        const slides = reviewTrack.querySelectorAll('.widget');
        const totalSlides = slides.length;
        let currentIndex = 0;
        let autoSlideTimer = null;

        // Render dot indikator
        if (dotsContainer) {
          dotsContainer.innerHTML = '';
          for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'review-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Slide ' + (i + 1));
            dot.setAttribute('type', 'button');
            dot.addEventListener('click', function(e) {
              e.preventDefault();
              goToSlide(i);
              resetAutoSlide();
            });
            dotsContainer.appendChild(dot);
          }
        }

        function updateSlider() {
          reviewTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
          if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.review-dot');
            dots.forEach((dot, idx) => {
              dot.classList.toggle('active', idx === currentIndex);
            });
          }
        }

        function goToSlide(index) {
          currentIndex = (index + totalSlides) % totalSlides;
          updateSlider();
        }

        function nextSlide() {
          goToSlide(currentIndex + 1);
        }

        function prevSlide() {
          goToSlide(currentIndex - 1);
        }

        if (nextBtn) {
          nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            nextSlide();
            resetAutoSlide();
          });
        }
        if (prevBtn) {
          prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            prevSlide();
            resetAutoSlide();
          });
        }

        function startAutoSlide() {
          stopAutoSlide();
          autoSlideTimer = setInterval(nextSlide, 4500);
        }

        function stopAutoSlide() {
          if (autoSlideTimer) clearInterval(autoSlideTimer);
        }

        function resetAutoSlide() {
          stopAutoSlide();
          startAutoSlide();
        }

        // Pause on hover
        reviewContainer.addEventListener('mouseenter', stopAutoSlide);
        reviewContainer.addEventListener('mouseleave', startAutoSlide);

        // Touch swiping pada layar sentuh
        let touchStartX = 0;
        let touchEndX = 0;
        reviewContainer.addEventListener('touchstart', function(e) {
          touchStartX = e.changedTouches[0].screenX;
          stopAutoSlide();
        }, { passive: true });

        reviewContainer.addEventListener('touchend', function(e) {
          touchEndX = e.changedTouches[0].screenX;
          const diff = touchStartX - touchEndX;
          if (Math.abs(diff) > 40) {
            if (diff > 0) nextSlide();
            else prevSlide();
          }
          startAutoSlide();
        }, { passive: true });

        startAutoSlide();
      }

      // F. Smooth Scroll Reveal Effect via IntersectionObserver (Responsif & Alami)
      if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(function(entries, observer) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.08,
          rootMargin: '0px 0px -20px 0px'
        });

        document.querySelectorAll('.reveal').forEach(function(el) {
          revealObserver.observe(el);
        });
      } else {
        document.querySelectorAll('.reveal').forEach(function(el) {
          el.classList.add('revealed');
        });
      }

      // Safety Fallback cadangan khusus elemen di dalam viewport saat load
      window.addEventListener('load', function() {
        document.querySelectorAll('.reveal:not(.revealed)').forEach(function(el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight) {
            el.classList.add('revealed');
          }
        });
      });

    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initLandingPage);
    } else {
      initLandingPage();
    }

    // Helper: Ganti Foto Utama di Popup Galeri Tampak Rumah
    window.switchPopImage = function(thumbEl, fullUrl) {
      const modalWrap = thumbEl.closest('.pop-wrap') || thumbEl.closest('.popup-unit-grid');
      if (!modalWrap) return;
      const mainImg = modalWrap.querySelector('.pop-main-img');
      if (mainImg) {
        mainImg.style.opacity = '0.35';
        setTimeout(function() {
          mainImg.src = fullUrl;
          mainImg.style.opacity = '1';
        }, 120);
      }
      modalWrap.querySelectorAll('.pop-thumb-item').forEach(function(t) {
        t.classList.remove('active');
      });
      thumbEl.classList.add('active');
    };

    // (SPEC_ICON_REGISTRY is defined at top-level scope)

    // Helper: Inisialisasi Icon Spesifikasi Dinamis (Auto-Detect Kata Kunci / Atribut data-icon)
    function initDynamicSpecIcons() {
      if (typeof SPEC_ICON_REGISTRY === 'undefined' || !SPEC_ICON_REGISTRY) return;
      document.querySelectorAll('.spec-item, .service-spec-item').forEach(function(item) {
        let iconKey = (item.getAttribute('data-icon') || '').toLowerCase().trim();
        const text = (item.textContent || '').toLowerCase();
        
        // Auto-detect jika belum dispesifikasikan secara eksplisit
        if (!iconKey) {
          if (text.includes('lb') || text.includes('bangunan')) iconKey = 'lb';
          else if (text.includes('lt') || text.includes('tanah')) iconKey = 'lt';
          else if (text.includes('tamu') || text.includes('sofa') || text.includes('living')) iconKey = 'tamu';
          else if (text.includes('kamar') || text.includes('tidur')) iconKey = 'kamar';
          else if (text.includes('mandi') || text.includes('wc') || text.includes('toilet')) iconKey = 'mandi';
          else if (text.includes('carport') || text.includes('garasi') || text.includes('mobil')) iconKey = 'carport';
          else if (text.includes('hebel') || text.includes('dinding') || text.includes('bata')) iconKey = 'hebel';
          else if (text.includes('taman') || text.includes('hook') || text.includes('sudut')) iconKey = 'taman';
          else if (text.includes('listrik') || text.includes('watt') || text.includes('pln')) iconKey = 'listrik';
          else if (text.includes('air') || text.includes('sumur') || text.includes('pdam')) iconKey = 'air';
          else if (text.includes('shm') || text.includes('sertifikat')) iconKey = 'shm';
        }

        if (iconKey && SPEC_ICON_REGISTRY[iconKey]) {
          const existingIcon = item.querySelector('svg, i.hgi-stroke, .icon');
          if (existingIcon) {
            existingIcon.outerHTML = SPEC_ICON_REGISTRY[iconKey];
          } else {
            item.insertAdjacentHTML('afterbegin', SPEC_ICON_REGISTRY[iconKey]);
          }
        }
      });
    }

    // Helper: Parser Section Promo Dinamis & Sinkronisasi Direct WhatsApp
    function initPromoParser() {
      const promoCard = document.querySelector('.promo-card');
      if (!promoCard) return;
      const rawCaptionEl = promoCard.querySelector('.promo-raw-caption');
      if (!rawCaptionEl) return;

      const rawText = (rawCaptionEl.innerText || rawCaptionEl.textContent || '').trim();
      if (!rawText) return;

      let badge = '';
      let tag = '';
      let desc = '';
      let btnLabel = '';
      let benefits = [];

      // Normalisasi baris jika key berdempetan atau memakai tag <br>
      let normalizedText = rawText.replace(/<br\s*[\/]?>/gi, '\n');
      normalizedText = normalizedText.replace(/(Badge:|Tag:|Deskripsi:|Keterangan:|Benefit\s*\d*:|Tombol:|CTA:)/gi, '\n$1');
      const lines = normalizedText.split('\n');
      lines.forEach(function(line) {
        const trimmed = line.trim();
        if (!trimmed) return;
        const lower = trimmed.toLowerCase();

        if (lower.startsWith('badge:')) {
          badge = trimmed.substring(trimmed.indexOf(':') + 1).trim();
        } else if (lower.startsWith('tag:')) {
          tag = trimmed.substring(trimmed.indexOf(':') + 1).trim();
        } else if (lower.startsWith('deskripsi:') || lower.startsWith('keterangan:')) {
          desc = trimmed.substring(trimmed.indexOf(':') + 1).trim();
        } else if (lower.startsWith('tombol:') || lower.startsWith('cta:')) {
          btnLabel = trimmed.substring(trimmed.indexOf(':') + 1).trim();
        } else if (lower.startsWith('benefit') || trimmed.startsWith('*') || trimmed.startsWith('-') || trimmed.startsWith('•')) {
          let bText = trimmed;
          if (bText.includes(':')) bText = bText.substring(bText.indexOf(':') + 1).trim();
          bText = bText.replace(/^[\*\-•]\s*/, '').trim();
          const parts = bText.split('|');
          const bTitle = parts[0].trim();
          const bSub = parts.length > 1 ? parts.slice(1).join('|').trim() : '';
          if (bTitle) benefits.push({ title: bTitle, sub: bSub });
        } else if (!badge && !tag && !desc && !benefits.length) {
          desc = (desc ? desc + ' ' : '') + trimmed;
        }
      });

      if (badge) {
        const badgeSpan = promoCard.querySelector('.promo-badge-pulse span:last-child');
        if (badgeSpan) badgeSpan.textContent = badge;
      }
      if (tag) {
        const tagSpan = promoCard.querySelector('.promo-tag-float span');
        if (tagSpan) tagSpan.textContent = tag;
      }
      if (desc) {
        const descP = promoCard.querySelector('.promo-desc');
        if (descP) descP.textContent = desc;
      }
      if (btnLabel) {
        const btnSpan = promoCard.querySelector('.btn-promo-claim span');
        if (btnSpan) btnSpan.textContent = btnLabel;
      }
      if (benefits.length > 0) {
        const benContainer = promoCard.querySelector('.promo-benefits');
        if (benContainer) {
          let bHtml = '';
          benefits.forEach(function(b) {
            bHtml += `
              <div class='benefit-item'>
                <div class='benefit-icon'>
                  <i class='hgi-stroke hgi-checkmark-circle-01'></i>
                </div>
                <div>
                  <strong>${b.title}</strong>
                  ${b.sub ? '<small>' + b.sub + '</small>' : ''}
                </div>
              </div>
            `;
          });
          benContainer.innerHTML = bHtml;
        }
      }

      // Sinkronkan Tombol WhatsApp Promo secara Dinamis dengan Master Marketing
      const promoBtn = promoCard.querySelector('.btn-promo-claim');
      if (promoBtn) {
        const promoH2 = promoCard.querySelector('h2');
        const promoTitle = promoH2 ? promoH2.textContent.trim() : 'Promo Spesial';
        const cfg = (typeof getMarketingConfig === 'function') ? getMarketingConfig() : (window.MARKETING_CONFIG || { name: "Mas Ro'uf", phone: "6287870988073" });
        const waText = `Halo ${cfg.name}, saya ingin klaim ${promoTitle} Pesona Kahuripan.\n\nReferensi: ${getActiveSiteLink('#promo')}`;
        promoBtn.href = `https://api.whatsapp.com/send?phone=${cfg.phone}&text=${encodeURIComponent(waText)}`;
      }
    }

    // Helper: Parser Tipe Rumah (Kartu, Galeri Tampak & Detail Modal Popup) Full Edit Tanpa Kode
    function initUnitCardAndPopupParser() {
      // 1. PARSE & UPDATE KARTU DEPAN (TIPE RUMAH PILIHAN: 6 INFORMASI RESMI)
      document.querySelectorAll('.service-card').forEach(function(card) {
        const rawCaptionEl = card.querySelector('.unit-raw-caption');
        if (rawCaptionEl) {
          // Ekstrak teks bersih: konversi <br> dan tag block jadi newline sebelum strip tag
          let rawHtml = rawCaptionEl.innerHTML || rawCaptionEl.textContent || '';
          let cleanText = rawHtml
            .replace(/<br\s*[\/]?>/gi, '\n')
            .replace(/<\/(p|div|li|tr|h\d)>/gi, '\n')
            .replace(/<[^>]+>/g, ' ')
            .replace(/&nbsp;/gi, ' ')
            .replace(/&amp;/gi, '&')
            .replace(/&#178;|&sup2;/gi, '²')
            .replace(/&#39;/gi, "'")
            .replace(/&quot;/gi, '"');

          // Normalisasi jika baris tergabung tanpa newline (misal export / paste Blogger dashboard)
          cleanText = cleanText.replace(/([^\n])\s*(Badge:|Tag:|Kategori:|Harga:|Price:|Cicilan:|Angsuran:|KPR:|Label:|Deskripsi:|Desc:|Keterangan:|Luas Bangunan:|LB:|Bangunan:|Luas Tanah:|LT:|Tanah:|Ruang Tamu:|R\.?\s*Tamu:|Tamu:|Living:|Kamar Tidur:|K\.?\s*Tidur:|Tidur:|Kamar:|KT:|Bed:|Kamar Mandi:|K\.?\s*Mandi:|Mandi:|Toilet:|WC:|KM:|Carport:|Garasi:|Mobil:|Parkir:|Dinding:|Struktur:|Hebel:|Listrik:|PLN:|Watt:|Air:|Sumur:|PDAM:|Sertifikat:|Legalitas:|SHM:)/gi, '$1\n$2');

          let badge = '';
          let price = '';
          let installment = '';
          let desc = '';
          let lb = '', lt = '', tamu = '', tidur = '', mandi = '', carport = '';
          let dinding = '', listrik = '', air = '', shm = '';

          const lines = cleanText.split('\n');
          lines.forEach(function(line) {
            const trimmed = line.trim();
            if (!trimmed) return;
            let sepIdx = trimmed.indexOf(':');
            if (sepIdx === -1) sepIdx = trimmed.indexOf('=');
            if (sepIdx === -1) return;

            const key = trimmed.substring(0, sepIdx).trim().toLowerCase();
            const val = trimmed.substring(sepIdx + 1).trim();
            if (!val) return;

            if (key === 'badge' || key === 'tag' || key === 'kategori' || key === 'status') {
              badge = val;
            } else if (key === 'harga' || key === 'price' || key === 'mulai' || key === 'harga mulai') {
              price = val;
            } else if (key === 'cicilan' || key === 'angsuran' || key === 'kpr' || key === 'label' || key === 'angsuran mulai' || key === 'cicilan mulai') {
              installment = val;
            } else if (key === 'deskripsi' || key === 'desc' || key === 'keterangan' || key === 'tentang') {
              desc = val;
            } else if (key === 'lb' || key === 'luas bangunan' || key === 'bangunan') {
              lb = val;
            } else if (key === 'lt' || key === 'luas tanah' || key === 'tanah') {
              lt = val;
            } else if (key === 'ruang tamu' || key === 'r. tamu' || key === 'r.tamu' || key === 'tamu' || key === 'living') {
              tamu = val;
            } else if (key === 'kamar tidur' || key === 'k. tidur' || key === 'k.tidur' || key === 'tidur' || key === 'kamar' || key === 'kt' || key === 'bed') {
              tidur = val;
            } else if (key === 'kamar mandi' || key === 'k. mandi' || key === 'k.mandi' || key === 'mandi' || key === 'toilet' || key === 'wc' || key === 'km' || key === 'bath') {
              mandi = val;
            } else if (key === 'carport' || key === 'garasi' || key === 'mobil' || key === 'parkir') {
              carport = val;
            } else if (key === 'dinding' || key === 'struktur' || key === 'hebel' || key === 'bata') {
              dinding = val;
            } else if (key === 'listrik' || key === 'pln' || key === 'watt') {
              listrik = val;
            } else if (key === 'air' || key === 'sumur' || key === 'pdam') {
              air = val;
            } else if (key === 'sertifikat' || key === 'legalitas' || key === 'shm') {
              shm = val;
            }
          });

          // Update Elemen Kartu Depan
          if (badge) {
            const badgeEl = card.querySelector('.service-badge');
            if (badgeEl) badgeEl.textContent = badge;
          }
          if (desc) {
            const descEl = card.querySelector('.service-card-desc');
            if (descEl) descEl.textContent = desc;
          }
          if (price) {
            const priceValEl = card.querySelector('.price-amount') || card.querySelector('.service-price-tag strong');
            if (priceValEl) priceValEl.textContent = price;
          }
          if (installment) {
            const instEl = card.querySelector('.price-installment') || card.querySelector('.service-price-tag small');
            if (instEl) instEl.textContent = installment;
          }
          if (lb) {
            const lbEl = card.querySelector('.spec-lb strong');
            if (lbEl) lbEl.innerHTML = lb.replace(/&#178;|&sup2;/g, '²');
          }
          if (lt) {
            const ltEl = card.querySelector('.spec-lt strong');
            if (ltEl) ltEl.innerHTML = lt.replace(/&#178;|&sup2;/g, '²');
          }
          if (tamu) {
            const tamuEl = card.querySelector('.spec-tamu strong');
            if (tamuEl) tamuEl.textContent = tamu;
          }
          if (tidur) {
            const tidurEl = card.querySelector('.spec-tidur strong');
            if (tidurEl) tidurEl.textContent = tidur;
          }
          if (mandi) {
            const mandiEl = card.querySelector('.spec-mandi strong');
            if (mandiEl) mandiEl.textContent = mandi;
          }
          if (carport) {
            const carportEl = card.querySelector('.spec-carport strong');
            if (carportEl) carportEl.textContent = carport;
          }

          // Sinkronkan ke POPUP DETAIL MODAL terkait jika ada
          const unitId = card.getAttribute('data-id') || card.closest('.widget')?.id || '';
          const detailSource = unitId ? (document.getElementById(`pop-service-${unitId}`) || document.querySelector(`.unit-detail-source[data-unit-id="${unitId}"]`)) : card.closest('.widget')?.querySelector('.unit-detail-source');
          if (detailSource) {
            const unitTitle = (card.querySelector('h3') ? card.querySelector('h3').textContent.trim() : '') || 'Tipe Rumah';
            if (unitTitle) {
              detailSource.setAttribute('data-pop-title', 'Detail Unit: ' + unitTitle + (badge ? ` (${badge})` : ''));
              const modalH4 = detailSource.querySelector('h4');
              if (modalH4) modalH4.textContent = unitTitle + (badge ? ` - ${badge}` : '');
            }
            if (desc) {
              const modalDesc = detailSource.querySelector('.pop-unit-desc');
              if (modalDesc) modalDesc.textContent = desc;
            }
            // Update baris tabel spesifikasi di modal
            const tableEl = detailSource.querySelector('.popup-specs-table');
            if (tableEl) {
              tableEl.querySelectorAll('tr').forEach(function(tr) {
                const th = tr.querySelector('th');
                const td = tr.querySelector('td');
                if (!th || !td) return;
                const label = th.textContent.toLowerCase();

                if (label.includes('kategori') && badge) {
                  td.textContent = badge;
                } else if ((label.includes('luas') || label.includes('bangunan') || label.includes('tanah')) && (lb || lt)) {
                  const currentLb = lb ? lb.replace(/&#178;|&sup2;/g, '²') : '';
                  const currentLt = lt ? lt.replace(/&#178;|&sup2;/g, '²') : '';
                  if (currentLb && currentLt) td.textContent = `${currentLb} / ${currentLt}`;
                  else if (currentLb) td.textContent = currentLb;
                  else if (currentLt) td.textContent = currentLt;
                } else if (label.includes('tamu') && tamu) {
                  td.textContent = tamu;
                } else if ((label.includes('kamar') || label.includes('tidur') || label.includes('mandi')) && (tidur || mandi)) {
                  if (tidur && mandi) td.textContent = `${tidur} / ${mandi}`;
                  else if (tidur) td.textContent = tidur;
                  else if (mandi) td.textContent = mandi;
                } else if (label.includes('carport') && carport) {
                  td.textContent = carport;
                } else if (label.includes('dinding') && dinding) {
                  td.textContent = dinding;
                } else if ((label.includes('listrik') || label.includes('air')) && (listrik || air)) {
                  if (listrik && air) td.textContent = `${listrik} / ${air}`;
                  else if (listrik) td.textContent = listrik;
                  else if (air) td.textContent = air;
                } else if ((label.includes('cicilan') || label.includes('angsuran') || label.includes('skema')) && installment) {
                  td.textContent = installment;
                } else if (label.includes('legalitas') || label.includes('sertifikat')) {
                  if (shm) td.textContent = shm;
                }
              });
            }
          }
        }

        // Sinkronisasi WhatsApp Button pada Kartu Depan
        const cardTitle = (card.querySelector('h3') ? card.querySelector('h3').textContent.trim() : '') || 'Tipe Rumah';
        const cardWaBtn = card.querySelector('.btn-service-consult') || card.querySelector('.btn-service-wa');
        if (cardWaBtn) {
          const cfg = (typeof getMarketingConfig === 'function') ? getMarketingConfig() : (window.MARKETING_CONFIG || { name: "Mas Ro'uf", phone: "6287870988073" });
          const cardWaText = `Halo ${cfg.name}, saya tertarik konsultasi Unit ${cardTitle} Pesona Kahuripan.\n\nReferensi: ${getActiveSiteLink('#service')}`;
          cardWaBtn.href = `https://api.whatsapp.com/send?phone=${cfg.phone}&text=${encodeURIComponent(cardWaText)}`;
        }
      });

      // Bersihkan widget warisan lama (Image35 & Image36) jika masih dirender Blogger
      ['Image35', 'Image36'].forEach(function(legacyId) {
        const legacyEl = document.getElementById(legacyId);
        if (legacyEl) {
          const hasCard = legacyEl.querySelector('.service-card');
          if (!hasCard || legacyEl.children.length === 0 || (legacyEl.textContent || '').trim() === '') {
            legacyEl.remove();
          }
        }
      });

      // 2. PARSE & SINKRONKAN WIDGET DETAIL CUSTOM JIKA MEMILIKI UNIT-RAW-DETAIL-CONTENT
      document.querySelectorAll('.unit-detail-source').forEach(function(detailSource) {
        const unitId = detailSource.getAttribute('data-unit-id') || '';
        const matchingCard = unitId ? (document.querySelector(`.service-card[data-id="${unitId}"]`) || detailSource.closest('.widget')?.querySelector('.service-card')) : detailSource.closest('.widget')?.querySelector('.service-card');
        const unitTitle = matchingCard ? (matchingCard.querySelector('h3') ? matchingCard.querySelector('h3').textContent.trim() : '') : '';

        const rawDetailEl = detailSource.querySelector('.unit-raw-detail-content');
        if (rawDetailEl) {
          const rawContent = (rawDetailEl.textContent || rawDetailEl.innerText || '').trim();
          if (rawContent) {
            let desc = '';
            let photos = [];
            let tableRows = [];
            let currentMode = 'DESC'; // DESC, PHOTOS, SPECS

            const lines = rawContent.split('\n');
            lines.forEach(function(line) {
              const trimmed = line.trim();
              if (!trimmed) return;
              const lower = trimmed.toLowerCase();

              // Deteksi Section Header
              if (lower.includes('[galeri') || lower.includes('galeri tampak') || lower.includes('foto tampak')) {
                currentMode = 'PHOTOS';
                return;
              } else if (lower.includes('[spesifikasi') || lower.includes('[detail') || lower.startsWith('tabel:')) {
                currentMode = 'SPECS';
                return;
              } else if (lower.startsWith('deskripsi:') || lower.startsWith('keterangan:')) {
                currentMode = 'DESC';
                desc = trimmed.substring(trimmed.indexOf(':') + 1).trim();
                return;
              }

              if (currentMode === 'DESC') {
                if (!desc && !trimmed.startsWith('[')) {
                  desc = trimmed;
                } else if (desc && !trimmed.startsWith('[')) {
                  desc += ' ' + trimmed;
                }
              } else if (currentMode === 'PHOTOS') {
                let pText = trimmed;
                if (pText.includes(':') && !pText.toLowerCase().startsWith('http')) {
                  pText = pText.substring(pText.indexOf(':') + 1).trim();
                }
                if (pText.includes('=') && !pText.includes('|')) {
                  const eqParts = pText.split('=');
                  const pLabel = eqParts[0].trim();
                  const pUrl = eqParts.slice(1).join('=').trim();
                  if (pUrl.toLowerCase().startsWith('http')) {
                    photos.push({ url: pUrl, label: pLabel });
                    return;
                  }
                }
                const parts = pText.split('|');
                const url = parts[0].trim();
                const label = parts.length > 1 ? parts.slice(1).join('|').trim() : ('Tampak ' + (photos.length + 1));
                if (url.toLowerCase().startsWith('http')) {
                  photos.push({ url: url, label: label });
                }
              } else if (currentMode === 'SPECS') {
                let sep = trimmed.includes('=') ? '=' : ':';
                const parts = trimmed.split(sep);
                if (parts.length >= 2) {
                  const k = parts[0].trim();
                  const v = parts.slice(1).join(sep).trim();
                  if (k && v) tableRows.push({ key: k, val: v });
                }
              }
            });

            // Sinkronisasi Judul Popup
            if (unitTitle) {
              detailSource.setAttribute('data-pop-title', 'Detail Unit: ' + unitTitle);
              const modalH4 = detailSource.querySelector('h4');
              if (modalH4) modalH4.textContent = unitTitle;
            }

            // Update Deskripsi Detail Popup
            if (desc) {
              const popDescEl = detailSource.querySelector('.pop-unit-desc') || detailSource.querySelector('p');
              if (popDescEl) popDescEl.textContent = desc;
            }

            // Update Galeri Tampak (Thumbnail Buttons & Foto Utama)
            if (photos.length > 0) {
              const thumbsContainer = detailSource.querySelector('.pop-gallery-thumbs');
              if (thumbsContainer) {
                let thumbsHtml = '';
                photos.forEach(function(p, idx) {
                  const activeClass = idx === 0 ? ' active' : '';
                  thumbsHtml += `
                    <div class="pop-thumb-item${activeClass}" onclick="switchPopImage(this, '${p.url}')">
                      <img alt="${p.label}" src="${p.url}"/>
                      <span>${p.label}</span>
                    </div>
                  `;
                });
                thumbsContainer.innerHTML = thumbsHtml;

                const mainImg = detailSource.querySelector('.pop-main-img');
                if (mainImg) mainImg.src = photos[0].url;
              }
            }

            // Update Tabel Spesifikasi Teknis
            if (tableRows.length > 0) {
              const tableEl = detailSource.querySelector('.popup-specs-table');
              if (tableEl) {
                let rowsHtml = '';
                tableRows.forEach(function(row) {
                  rowsHtml += '<tr><th>' + row.key + '</th><td>' + row.val + '</td></tr>';
                });
                tableEl.innerHTML = rowsHtml;
              }
            }
          }
        }

        // Sinkronisasi Direct WhatsApp Button di Modal
        const ctaBtn = detailSource.querySelector('a.btn-cta') || detailSource.querySelector('.wa-dynamic-btn');
        if (ctaBtn) {
          const cfg = (typeof getMarketingConfig === 'function') ? getMarketingConfig() : (window.MARKETING_CONFIG || { name: "Mas Ro'uf", phone: "6287870988073" });
          const modalH4 = detailSource.querySelector('h4');
          const finalTitle = (modalH4 ? modalH4.textContent.trim() : '') || unitTitle || 'Tipe Rumah';
          const waText = `Halo ${cfg.name}, saya tertarik konsultasi Unit ${finalTitle} Pesona Kahuripan.\n\nReferensi: ${getActiveSiteLink('#service')}`;
          ctaBtn.href = `https://api.whatsapp.com/send?phone=${cfg.phone}&text=${encodeURIComponent(waText)}`;
          const spanEl = ctaBtn.querySelector('span');
          if (spanEl) {
            spanEl.innerHTML = `Konsultasi dengan <span class="marketing-name-target">${cfg.name}</span>`;
          }
        }
      });
    }

    // Helper: Parser Konfigurasi Footer & Sosial Media
    function initFooterParser() {
      const footerWrap = document.querySelector('.footer-wrap');
      if (!footerWrap) return;
      const rawDataEl = footerWrap.querySelector('.footer-raw-content');
      if (!rawDataEl) return;

      const rawText = (rawDataEl.innerText || rawDataEl.textContent || '').trim();
      if (!rawText) return;

      let copyright = '';
      let socmed = {};

      const lines = rawText.split('\n');
      lines.forEach(function(line) {
        const trimmed = line.trim();
        if (!trimmed) return;
        const lower = trimmed.toLowerCase();

        if (lower.startsWith('copyright:') || lower.startsWith('hak cipta:')) {
          copyright = trimmed.substring(trimmed.indexOf(':') + 1).trim();
        } else if (lower.startsWith('instagram:') || lower.startsWith('ig:')) {
          socmed.ig = trimmed.substring(trimmed.indexOf(':') + 1).trim();
        } else if (lower.startsWith('tiktok:')) {
          socmed.tiktok = trimmed.substring(trimmed.indexOf(':') + 1).trim();
        } else if (lower.startsWith('youtube:') || lower.startsWith('yt:')) {
          socmed.yt = trimmed.substring(trimmed.indexOf(':') + 1).trim();
        } else if (lower.startsWith('facebook:') || lower.startsWith('fb:')) {
          socmed.fb = trimmed.substring(trimmed.indexOf(':') + 1).trim();
        } else if (lower.startsWith('whatsapp:') || lower.startsWith('wa:')) {
          socmed.wa = trimmed.substring(trimmed.indexOf(':') + 1).trim();
        } else if (lower.startsWith('blog:') || lower.startsWith('artikel:')) {
          socmed.blog = trimmed.substring(trimmed.indexOf(':') + 1).trim();
        } else if (!copyright && !lower.includes('http')) {
          copyright = trimmed;
        }
      });

      if (copyright) {
        const copyP = footerWrap.querySelector('.footer-copy p');
        if (copyP) copyP.innerHTML = copyright;
      }

      if (socmed.ig) {
        const igLink = footerWrap.querySelector('.socmed-ig');
        if (igLink) igLink.href = socmed.ig;
      }
      if (socmed.tiktok) {
        const ttLink = footerWrap.querySelector('.socmed-tiktok');
        if (ttLink) ttLink.href = socmed.tiktok;
      }
      if (socmed.yt) {
        const ytLink = footerWrap.querySelector('.socmed-yt');
        if (ytLink) ytLink.href = socmed.yt;
      }
      if (socmed.blog) {
        const blogLink = footerWrap.querySelector('.socmed-blog');
        if (blogLink) blogLink.href = socmed.blog;
      }
      if (socmed.fb) {
        let fbLink = footerWrap.querySelector('.socmed-fb');
        if (!fbLink) {
          const container = footerWrap.querySelector('.footer-socmed');
          if (container) {
            fbLink = document.createElement('a');
            fbLink.className = 'socmed-fb';
            fbLink.target = '_blank';
            fbLink.rel = 'noopener';
            fbLink.innerHTML = `<i class="hgi-stroke hgi-facebook-01"></i><span>Facebook</span>`;
            container.appendChild(fbLink);
          }
        }
        if (fbLink) fbLink.href = socmed.fb;
      }
    }

        // Helper: Smart Parser Simulasi Angsuran KPR — Tab Switcher & Dynamic Calculator
    function initPricingTextParser() {
      // 1. Inisialisasi Navigasi Tab KPR (Subsidi vs Komersial)
      const tabNav = document.getElementById('kprTabNav');
      const tabBtns = document.querySelectorAll('.kpr-tab-btn');
      const panels = document.querySelectorAll('.pricing-card.kpr-panel');

      function switchKprTab(targetTab) {
        tabBtns.forEach(function(b) {
          b.classList.toggle('active', b.getAttribute('data-kpr-tab') === targetTab);
        });
        panels.forEach(function(panel) {
          const panelType = panel.getAttribute('data-kpr-panel');
          const isActive = (panelType === targetTab);
          panel.classList.toggle('active', isActive);
          const parentWidget = panel.closest('.widget');
          if (parentWidget) {
            parentWidget.style.setProperty('display', isActive ? 'block' : 'none', 'important');
          }
        });

        // Direct ID fallback for Blogger widget containers
        const wSubsidi = document.getElementById('Text51');
        const wKomersial = document.getElementById('Text52');
        if (wSubsidi) {
          wSubsidi.style.setProperty('display', targetTab === 'subsidi' ? 'block' : 'none', 'important');
        }
        if (wKomersial) {
          wKomersial.style.setProperty('display', targetTab === 'komersial' ? 'block' : 'none', 'important');
        }
      }

      if (tabNav && tabBtns.length > 0) {
        tabBtns.forEach(function(btn) {
          btn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = this.getAttribute('data-kpr-tab');
            switchKprTab(targetTab);
          });
        });
        // Pastikan kondisi tab awal aktif (default: subsidi)
        switchKprTab('subsidi');
      }

      // 2. Parser Kartu Subsidi & Kartu Komersial
      document.querySelectorAll('.pricing-card').forEach(function(card) {
        const rawDataEl = card.querySelector('.pricing-raw-data');
        const renderEl = card.querySelector('.pricing-card-render');
        if (!rawDataEl || !renderEl) return;

        const rawText = (rawDataEl.innerText || rawDataEl.textContent || '').trim();
        const lines = rawText ? rawText.split('\n') : [];
        let isKomersial = card.getAttribute('data-kpr-panel') === 'komersial';
        let defaultPrice = 'Rp. 435.000.000,-';
        let defaultTitle = card.getAttribute('data-title') || 'Type Rumah';

        lines.forEach(function(line) {
          const lower = line.toLowerCase().trim();
          if (lower.startsWith('tipe:') && (lower.includes('komersial') || lower.includes('komersil'))) {
            isKomersial = true;
          } else if (lower.startsWith('harga:')) {
            defaultPrice = line.substring(line.indexOf(':') + 1).trim();
          } else if (lower.startsWith('badge:')) {
            // badge info
          }
        });

        if (isKomersial) {
          initCommercialKprCalculator(card, renderEl, { defaultPrice: defaultPrice, title: defaultTitle });
        } else {
          initSubsidizedTenorInteraction(card, renderEl);
        }
      });
    }

    // Helper: Interaksi Pilihan Tenor Tab Subsidi
    function initSubsidizedTenorInteraction(card, renderEl) {
      if (!card || !renderEl) return;
      const tenorCards = renderEl.querySelectorAll('.tenor-option-card');
      const ctaBtn = renderEl.querySelector('.btn-subsidi-cta');
      if (!ctaBtn || tenorCards.length === 0) return;

      const mConfig = window.MARKETING_CONFIG || { name: "Mas Ro'uf", phone: "6287870988073" };
      const marketingName = mConfig.name || "Mas Ro'uf";
      const phone = mConfig.phone || "6287870988073";

      function updateCta(tenorYrs, installmentStr) {
        const cfg = (typeof getMarketingConfig === 'function') ? getMarketingConfig() : (window.MARKETING_CONFIG || { name: "Mas Ro'uf", phone: "6287870988073" });
        const fullMsg = `Halo ${cfg.name}, saya tertarik KPR Subsidi Type 30/60 Pesona Kahuripan dengan Tenor ${tenorYrs} Tahun (${installmentStr}/bln).\n\n` +
          `Mohon informasi ketersediaan unit dan kelengkapan berkas KPR-nya. Terima kasih!\n\n` +
          `🌐 Referensi: ${getActiveSiteLink('#offer')}`;
        ctaBtn.href = `https://api.whatsapp.com/send?phone=${cfg.phone}&text=${encodeURIComponent(fullMsg)}`;
        const spanEl = ctaBtn.querySelector('span');
        if (spanEl) {
          spanEl.innerHTML = `Konsultasi KPR Subsidi dengan <span class="marketing-name-target">${cfg.name}</span>`;
        }
      }

      tenorCards.forEach(function(opt) {
        opt.addEventListener('click', function() {
          tenorCards.forEach(function(c) { c.classList.remove('active'); });
          opt.classList.add('active');
          const tenor = opt.getAttribute('data-tenor') || '20';
          const angsuran = opt.getAttribute('data-angsuran') || 'Rp 1.192.574';
          updateCta(tenor, angsuran);
        });
      });

      // Default tenor 20 tahun
      updateCta('20', 'Rp 1.192.574');
    }

    // Helper: Kalkulator Simulasi KPR Komersil Interaktif Mandiri
    function initCommercialKprCalculator(card, renderEl, config) {
      if (!card || !renderEl) return;

      function fmtRupiah(val) { return 'Rp ' + Number(val || 0).toLocaleString('id-ID'); }
      function fmtDots(val) { const n = String(val).replace(/[^0-9]/g, ''); return n ? Number(n).toLocaleString('id-ID') : ''; }
      function parseDots(str) { const n = String(str || '').replace(/[^0-9]/g, ''); return parseInt(n, 10) || 0; }
      function calcInstallment(plafon, annualRate, tenorYrs) {
        if (plafon <= 0) return 0;
        const n = tenorYrs * 12;
        const r = (annualRate / 100) / 12;
        if (r === 0) return Math.round(plafon / n);
        return Math.round(plafon * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
      }

      const mConfig = window.MARKETING_CONFIG || { name: "Mas Ro'uf", phone: "6287870988073" };
      const marketingName = mConfig.name || "Mas Ro'uf";
      const phone = mConfig.phone || "6287870988073";

      // Hanya render template kalkulator jika belum tersedia di DOM
      if (!renderEl.querySelector('#commPriceInput')) {
        renderEl.innerHTML = `
        <div class="kpr-panel-header">
          <div class="kpr-panel-badge-row">
            <span class="kpr-status-badge badge-comm-header">SIMULASI ANGSURAN KOMERSIAL</span>
            <span class="kpr-popular-badge badge-comm-sub">DESAIN MODERN MINIMALIS</span>
          </div>
          <h3>Kalkulator Simulasi KPR Komersial</h3>
          <p class="kpr-panel-sub">Sesuaikan harga properti, uang muka (DP), tenor pinjaman, dan suku bunga bank rekanan untuk menghitung estimasi angsuran bulanan Anda.</p>
        </div>

        <div class="kpr-calc-layout">
          <div class="kpr-calc-inputs">
            <!-- Harga Properti -->
            <div class="calc-field">
              <label for="commPriceInput"><strong>Harga Properti (Rp):</strong></label>
              <div class="calc-input-wrap">
                <span class="calc-prefix">Rp</span>
                <input class="calc-input" id="commPriceInput" type="text" value="435.000.000"/>
              </div>
            </div>

            <!-- Uang Muka / DP -->
            <div class="calc-field">
              <div class="calc-field-head">
                <label><strong>Uang Muka (Down Payment):</strong></label>
                <span class="dp-percent-label" id="dpPercentLabel">10%</span>
              </div>
              <div class="calc-chip-row" id="dpChipsRow">
                <button class="calc-chip active" type="button" data-dp="10">10%</button>
                <button class="calc-chip" type="button" data-dp="15">15%</button>
                <button class="calc-chip" type="button" data-dp="20">20%</button>
                <button class="calc-chip" type="button" data-dp="30">30%</button>
              </div>
              <div class="calc-input-wrap" style="margin-top: 8px;">
                <span class="calc-prefix">Rp</span>
                <input class="calc-input" id="commDpNominal" type="text" value="43.500.000"/>
              </div>
            </div>

            <!-- Jangka Waktu (Tenor) -->
            <div class="calc-field">
              <div class="calc-field-head">
                <label><strong>Jangka Waktu Pinjaman (Tenor):</strong></label>
                <span class="tenor-val-label" id="tenorValLabel">20 Tahun</span>
              </div>
              <div class="calc-chip-row" id="tenorChipsRow">
                <button class="calc-chip" type="button" data-tenor="10">10 Thn</button>
                <button class="calc-chip" type="button" data-tenor="15">15 Thn</button>
                <button class="calc-chip active" type="button" data-tenor="20">20 Thn</button>
                <button class="calc-chip" type="button" data-tenor="25">25 Thn</button>
              </div>
              <input class="calc-range" id="commTenorRange" type="range" min="5" max="30" step="1" value="20"/>
            </div>

            <!-- Suku Bunga Bank Rekanan -->
            <div class="calc-field">
              <div class="calc-field-head">
                <label for="commBankSelect"><strong>Estimasi Suku Bunga Bank Rekanan:</strong></label>
                <span class="rate-val-label" id="rateValLabel">5.50% / thn</span>
              </div>
              <select class="calc-select" id="commBankSelect">
                <option value="5.5" selected="selected">Bank Mandiri KPR (Promo Fixed 5.50%)</option>
                <option value="3.99">Bank BTN KPR (Promo Fixed 3.99%)</option>
                <option value="6.25">Bank BSI Griya Hasanah (Syariah Fixed 6.25%)</option>
                <option value="7.50">Standard Fixed Promo (7.50%)</option>
                <option value="8.50">Standard Floating Rate (8.50%)</option>
              </select>
            </div>
          </div>

          <!-- HASIL KALKULASI (LIVE RESULT CARD) -->
          <div class="kpr-calc-result-col">
            <div class="calc-result-card">
              <span class="result-badge">ESTIMASI HASIL PERHITUNGAN</span>
              <div class="result-label">Angsuran KPR Bulanan:</div>
              <div class="result-amount" id="resultInstallment">Rp 2.688.400</div>
              <div class="result-period">per bulan (estimasi anuitas)</div>

              <div class="result-details-list">
                <div class="detail-row">
                  <span>Plafon Pinjaman Bank:</span>
                  <strong id="resultPlafon">Rp 391.500.000</strong>
                </div>
                <div class="detail-row">
                  <span>Total Uang Muka (DP):</span>
                  <strong id="resultDp">Rp 43.500.000</strong>
                </div>
                <div class="detail-row">
                  <span>Estimasi Penghasilan Min.:</span>
                  <strong id="resultMinIncome" style="color:#ffffff;">Rp 7.681.000 / bln</strong>
                </div>
              </div>

              <div class="result-disclaimer">
                *Perhitungan bersifat simulasi estimasi. Suku bunga dan persetujuan plafon kredit mengikuti analisis bank rekanan (BTN, Mandiri, BSI).
              </div>

              <a class="btn-kpr-action btn-comm-cta wa-dynamic-btn" id="ctaCommWa" href="#" target="_blank">
                <i class="hgi-stroke hgi-whatsapp"></i>
                <span>Konsultasikan Simulasi Ini via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      `;
      }

      const priceInput = renderEl.querySelector('#commPriceInput');
      const dpNominalInput = renderEl.querySelector('#commDpNominal');
      const dpPercentLabel = renderEl.querySelector('#dpPercentLabel');
      const dpChips = renderEl.querySelectorAll('#dpChipsRow .calc-chip');
      const tenorRange = renderEl.querySelector('#commTenorRange');
      const tenorChips = renderEl.querySelectorAll('#tenorChipsRow .calc-chip');
      const tenorValLabel = renderEl.querySelector('#tenorValLabel');
      const bankSelect = renderEl.querySelector('#commBankSelect');
      const rateValLabel = renderEl.querySelector('#rateValLabel');

      const resultInstallment = renderEl.querySelector('#resultInstallment');
      const resultPlafon = renderEl.querySelector('#resultPlafon');
      const resultDp = renderEl.querySelector('#resultDp');
      const resultMinIncome = renderEl.querySelector('#resultMinIncome');
      const ctaCommWa = renderEl.querySelector('#ctaCommWa');

      let currentPrice = 435000000;
      let currentDpPercent = 10;
      let currentDpNominal = 43500000;
      let currentTenor = 20;
      let currentRate = 5.5;

      function updateCalculation() {
        currentPrice = parseDots(priceInput.value);
        if (currentPrice < 0) currentPrice = 0;

        currentDpNominal = parseDots(dpNominalInput.value);
        if (currentDpNominal > currentPrice) currentDpNominal = currentPrice;

        const plafon = Math.max(0, currentPrice - currentDpNominal);
        const installment = calcInstallment(plafon, currentRate, currentTenor);
        const minIncome = installment > 0 ? Math.round(installment / 0.35) : 0;

        if (resultInstallment) {
          resultInstallment.textContent = fmtRupiah(installment);
          resultInstallment.classList.remove('calc-pulse');
          void resultInstallment.offsetWidth;
          resultInstallment.classList.add('calc-pulse');
        }
        if (resultPlafon) resultPlafon.textContent = fmtRupiah(plafon);
        if (resultDp) resultDp.textContent = fmtRupiah(currentDpNominal);
        if (resultMinIncome) resultMinIncome.textContent = fmtRupiah(minIncome) + ' / bln';

        const unitText = 'Unit Komersial Pesona Kahuripan';
        const bankText = bankSelect ? bankSelect.options[bankSelect.selectedIndex].text : 'Bank Rekanan';

        const waMsg = `Halo ${marketingName}, saya ingin konsultasi simulasi KPR Komersial Pesona Kahuripan:\n\n` +
          `🏠 *Unit:* ${unitText}\n` +
          `💰 *Harga Properti:* ${fmtRupiah(currentPrice)}\n` +
          `💵 *Uang Muka (DP):* ${fmtRupiah(currentDpNominal)} (${currentDpPercent}%)\n` +
          `🏦 *Plafon KPR:* ${fmtRupiah(plafon)}\n` +
          `⏱️ *Tenor:* ${currentTenor} Tahun\n` +
          `📈 *Suku Bunga Bank:* ${currentRate.toFixed(2)}% (${bankText})\n` +
          `📊 *Estimasi Cicilan:* ${fmtRupiah(installment)} / bln\n` +
          `👥 *Estimasi Gaji Min.:* ${fmtRupiah(minIncome)} / bln\n\n` +
          `🌐 *Referensi Website:* ${getActiveSiteLink('#offer')}\n\n` +
          `Mohon dibantu info ketersediaan unit dan pengajuan berkasnya. Terima kasih!`;

        if (ctaCommWa) {
          ctaCommWa.href = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(waMsg)}`;
        }
      }

      if (priceInput) {
        priceInput.addEventListener('input', function() {
          const p = parseDots(this.value);
          this.value = p ? fmtDots(p) : '';
          currentPrice = p;
          currentDpNominal = Math.round(currentPrice * (currentDpPercent / 100));
          dpNominalInput.value = currentDpNominal ? fmtDots(currentDpNominal) : '';
          updateCalculation();
        });
      }

      dpChips.forEach(function(chip) {
        chip.addEventListener('click', function(e) {
          e.preventDefault();
          dpChips.forEach(function(c) { c.classList.remove('active'); });
          this.classList.add('active');
          currentDpPercent = parseInt(this.getAttribute('data-dp'), 10);
          if (dpPercentLabel) dpPercentLabel.textContent = currentDpPercent + '%';
          currentDpNominal = Math.round(currentPrice * (currentDpPercent / 100));
          if (dpNominalInput) dpNominalInput.value = fmtDots(currentDpNominal);
          updateCalculation();
        });
      });

      if (dpNominalInput) {
        dpNominalInput.addEventListener('input', function() {
          const dp = parseDots(this.value);
          this.value = dp ? fmtDots(dp) : '';
          currentDpNominal = dp;
          if (currentPrice > 0) {
            currentDpPercent = Math.round((currentDpNominal / currentPrice) * 100);
            if (dpPercentLabel) dpPercentLabel.textContent = currentDpPercent + '%';
            dpChips.forEach(function(c) {
              c.classList.toggle('active', parseInt(c.getAttribute('data-dp'), 10) === currentDpPercent);
            });
          }
          updateCalculation();
        });
      }

      tenorChips.forEach(function(chip) {
        chip.addEventListener('click', function(e) {
          e.preventDefault();
          tenorChips.forEach(function(c) { c.classList.remove('active'); });
          this.classList.add('active');
          currentTenor = parseInt(this.getAttribute('data-tenor'), 10);
          if (tenorRange) tenorRange.value = currentTenor;
          if (tenorValLabel) tenorValLabel.textContent = currentTenor + ' Tahun';
          updateCalculation();
        });
      });

      if (tenorRange) {
        tenorRange.addEventListener('input', function() {
          currentTenor = parseInt(this.value, 10);
          if (tenorValLabel) tenorValLabel.textContent = currentTenor + ' Tahun';
          tenorChips.forEach(function(c) {
            c.classList.toggle('active', parseInt(c.getAttribute('data-tenor'), 10) === currentTenor);
          });
          updateCalculation();
        });
      }

      if (bankSelect) {
        bankSelect.addEventListener('change', function() {
          currentRate = parseFloat(this.value) || 5.5;
          if (rateValLabel) rateValLabel.textContent = currentRate.toFixed(2) + '% / thn';
          updateCalculation();
        });
      }

      updateCalculation();
    }
// Validasi Nomor Handphone Indonesia (Operator Seluler: Telkomsel, Indosat, XL, Axis, Smartfren, Tri)
function validateIndonesianPhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, message: 'Nomor WhatsApp wajib diisi.' };
  }

  let cleaned = phone.trim().replace(/[\s\-\.\(\)]/g, '');

  if (cleaned.startsWith('+62')) {
    cleaned = '0' + cleaned.slice(3);
  } else if (cleaned.startsWith('62')) {
    cleaned = '0' + cleaned.slice(2);
  } else if (cleaned.startsWith('8')) {
    cleaned = '08' + cleaned.slice(1);
  }

  if (!/^\d+$/.test(cleaned)) {
    return { isValid: false, message: 'Nomor handphone hanya boleh berisi angka.' };
  }

  if (cleaned.length < 10) {
    return { isValid: false, message: 'Nomor HP terlalu pendek (minimal 10 digit, contoh: 081234567890).' };
  }
  if (cleaned.length > 14) {
    return { isValid: false, message: 'Nomor HP terlalu panjang (maksimal 14 digit).' };
  }

  // Operator seluler Indonesia valid diawali 08[1235789]
  if (!/^08[1235789]\d{7,11}$/.test(cleaned)) {
    return { isValid: false, message: 'Format nomor tidak valid. Nomor HP Indonesia diawali 08 dengan 10-14 digit (contoh: 081234567890).' };
  }

  // Cek nomor dummy berulang jika semua digit setelah 08 sama persis (contoh: 08111111111 atau 0800000000)
  const after08 = cleaned.slice(2);
  const distinctAfter08 = new Set(after08.split('')).size;
  if (distinctAfter08 <= 1) {
    return { isValid: false, message: 'Nomor handphone tidak valid (digit berulang). Mohon masukkan nomor aktif Anda.' };
  }

  return { isValid: true, normalized: cleaned };
}
window.validateIndonesianPhone = validateIndonesianPhone;

// F. Dispatch Pesan ke WhatsApp API (Dinamis dari Master Marketing & Site Link Referensi)
    function sendWhatsAppMessage(event) {
      event.preventDefault();
      const nameInput = document.getElementById('wa-name');
      const phoneInput = document.getElementById('wa-phone-user');
      const messageInput = document.getElementById('wa-message');
      const phoneError = document.getElementById('wa-phone-error');

      const name = nameInput ? nameInput.value.trim() : '';
      const phoneRaw = phoneInput ? phoneInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name) {
        if (nameInput) nameInput.focus();
        return;
      }

      // Validasi nomor handphone agar debitur tidak asal memasukkan nomor
      const check = validateIndonesianPhone(phoneRaw);
      if (!check.isValid) {
        if (phoneInput) {
          phoneInput.classList.add('is-invalid');
          phoneInput.focus();
        }
        if (phoneError) {
          phoneError.textContent = check.message;
          phoneError.style.display = 'block';
        }
        return;
      }

      if (phoneInput) phoneInput.classList.remove('is-invalid');
      if (phoneError) phoneError.style.display = 'none';

      if (!message) {
        if (messageInput) messageInput.focus();
        return;
      }

      const phoneUser = check.normalized;

      // Ambil nama dan nomor dari Master Marketing Config jika ada
      const mConfig = window.MARKETING_CONFIG || { name: "Mas Ro'uf", phone: "6287870988073" };
      const marketingName = mConfig.name || "Mas Ro'uf";
      const phone = mConfig.phone || "6287870988073";

      // PENTING: Rekam data leads & nomor handphone ke CTA Analytics SEBELUM membuka tab WhatsApp
      const ctaNameWithPhone = 'Formulir Chat: ' + name + (phoneUser ? ' (' + phoneUser + ')' : '');
      const leadPayload = {
        phone: phoneUser,
        message: message,
        userName: name
      };

      if (typeof window.trackCtaEvent === 'function') {
        window.trackCtaEvent('cta_chat_submit', ctaNameWithPhone, 'Floating Chat', 'WhatsApp API', leadPayload);
      } else {
        window._ctaQueue = window._ctaQueue || [];
        window._ctaQueue.push(['cta_chat_submit', ctaNameWithPhone, 'Floating Chat', 'WhatsApp API', leadPayload]);
      }

      const fullText = `Halo ${marketingName}, saya ingin bertanya perihal perumahan Pesona Kahuripan.\n\n` +
        `👤 *Nama:* ${name}\n` +
        `📱 *No. WhatsApp:* ${phoneUser}\n` +
        `💬 *Pertanyaan:* ${message}\n\n` +
        `🌐 *Referensi Website:* ${getActiveSiteOrigin()}\n\n` +
        `Mohon informasi dan tindak lanjutnya. Terima kasih!`;

      // Buka API WhatsApp di jendela baru
      window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(fullText)}`, '_blank');

      if (nameInput) nameInput.value = '';
      if (phoneInput) phoneInput.value = '';
      if (messageInput) messageInput.value = '';
      const box = document.getElementById('chat-box');
      if (box) box.classList.remove('open');
    }

// Make sendWhatsAppMessage accessible globally for inline onsubmit handler
window.sendWhatsAppMessage = sendWhatsAppMessage;

// ================= TAMPAK RUMAH SUBSIDI FILTER & SYNC =================
function initTampakRumahSubsidi() {
  const filterTabs = document.querySelectorAll('.tampak-tab-btn');
  const tampakWidgets = document.querySelectorAll('#tampak-section > .widget.Image, .tampak-section > .widget[id*="Image5"]');
  const tampakSection = document.getElementById('tampak-section') || document.querySelector('.tampak-section');

  if (filterTabs.length) {
    filterTabs.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        if (e) e.preventDefault();
        const filter = this.getAttribute('data-filter') || 'all';

        filterTabs.forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');

        if (tampakSection) {
          tampakSection.classList.toggle('is-filtered', filter !== 'all');
        }

        tampakWidgets.forEach(function(widget) {
          const card = widget.querySelector('.tampak-card');
          const cat = card ? card.getAttribute('data-category') : '';

          if (filter === 'all' || cat === filter) {
            widget.classList.remove('is-hidden');
            widget.style.display = '';
            if (card) {
              card.style.opacity = '0';
              card.style.transform = 'translateY(10px) scale(0.98)';
              requestAnimationFrame(function() {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
              });
            }
          } else {
            widget.classList.add('is-hidden');
            widget.style.setProperty('display', 'none', 'important');
          }
        });
      });
    });
  }

  // Image path adapter: online CDN vs local file preview
  const isOnlineHost = !['localhost', '127.0.0.1', ''].includes(window.location.hostname) && window.location.protocol !== 'file:';
  if (isOnlineHost) {
    document.querySelectorAll('.tampak-card img[data-cdn], .tampak-lightbox-link[data-cdn]').forEach(function(el) {
      const cdnUrl = el.getAttribute('data-cdn');
      if (cdnUrl) {
        if (el.tagName.toLowerCase() === 'img') {
          el.src = cdnUrl;
        } else if (el.tagName.toLowerCase() === 'a') {
          el.href = cdnUrl;
        }
      }
    });
  }

  // Sync WhatsApp marketing on CTA survey button
  const tampakSurveyBtn = document.querySelector('.btn-tampak-survey');
  if (tampakSurveyBtn) {
    const cfg = (typeof getMarketingConfig === 'function') ? getMarketingConfig() : (window.MARKETING_CONFIG || { name: "Mas Ro'uf", phone: "6287870988073" });
    const waText = encodeURIComponent(`Halo ${cfg.name}, saya tertarik survey langsung Unit Rumah Subsidi Pemerintah Pesona Kahuripan.\n\nBisa info jadwal survey lokasi terdekat?\n\nReferensi: ${getActiveSiteLink('#tampak-rumah')}`);
    tampakSurveyBtn.href = `https://api.whatsapp.com/send?phone=${cfg.phone}&text=${waText}`;
  }
}


// ================= LOKASI PROJECT 1 - 18 (FILTER, SEARCH & SHOW MORE) =================
function initLokasiProjects() {
  const searchInput = document.getElementById('lokasiSearchInput');
  const clearBtn = document.getElementById('lokasiSearchClear');
  const tabBtns = document.querySelectorAll('.lokasi-tab-btn');
  const cards = document.querySelectorAll('.lokasi-card');
  const emptyState = document.getElementById('lokasiEmptyState');
  const totalCountEl = document.getElementById('lokasiTotalCount');
  const toggleBtn = document.getElementById('btnLokasiToggle');
  const actionsWrap = document.getElementById('lokasiActions');
  const grid = document.getElementById('lokasiProjectsGrid');

  if (!cards.length) return;

  let currentFilter = 'all';
  let currentSearch = '';
  let isCollapsed = true; // Default: hanya tampilkan 3 proyek pada "Semua Proyek"

  function applyFilter() {
    let matchCount = 0;
    const query = currentSearch.trim().toLowerCase();
    const isDefaultAll = (currentFilter === 'all' && !query);

    cards.forEach(function(card) {
      const wilayah = card.getAttribute('data-wilayah');
      const searchData = (card.getAttribute('data-search') || '').toLowerCase();

      const matchFilter = (currentFilter === 'all') || (wilayah === currentFilter);
      const matchSearch = !query || searchData.includes(query);
      const isMatch = matchFilter && matchSearch;

      if (isMatch) {
        matchCount++;
        // Jika mode default "Semua Proyek" dan masih collapsed, batasi hanya 3 kartu pertama
        if (isDefaultAll && isCollapsed && matchCount > 3) {
          card.classList.add('is-hidden');
        } else {
          card.classList.remove('is-hidden');
          card.classList.add('active');
        }
      } else {
        card.classList.add('is-hidden');
      }
    });

    if (emptyState) {
      emptyState.classList.toggle('is-visible', matchCount === 0);
    }

    if (totalCountEl && currentFilter === 'all' && !query) {
      totalCountEl.textContent = cards.length;
    }

    // Perbarui status & visibilitas tombol Show More
    if (actionsWrap && toggleBtn) {
      if (isDefaultAll && matchCount > 3) {
        actionsWrap.style.display = 'flex';
        const textSpan = toggleBtn.querySelector('.btn-text');
        const arrowIcon = toggleBtn.querySelector('.toggle-arrow');
        if (isCollapsed) {
          if (textSpan) textSpan.textContent = "Lihat Semua " + cards.length + " Lokasi Proyek";
          if (arrowIcon) arrowIcon.className = "toggle-arrow hgi-stroke hgi-arrow-down-01";
          toggleBtn.classList.remove('expanded');
        } else {
          if (textSpan) textSpan.textContent = "Tampilkan Lebih Sedikit (3 Proyek)";
          if (arrowIcon) arrowIcon.className = "toggle-arrow hgi-stroke hgi-arrow-up-01";
          toggleBtn.classList.add('expanded');
        }
      } else {
        // Sembunyikan tombol jika sedang memfilter wilayah spesifik atau mencari kata kunci
        actionsWrap.style.display = 'none';
      }
    }
  }

  // Event listener tombol Show More Lokasi
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function(e) {
      e.preventDefault();
      isCollapsed = !isCollapsed;
      applyFilter();
      if (isCollapsed) {
        const sec = document.getElementById('lokasi-project');
        if (sec) sec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  tabBtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      if (e) e.preventDefault();
      tabBtns.forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');
      currentFilter = this.getAttribute('data-filter') || 'all';
      // Saat berpindah tab, jika kembali ke 'all' tetap collapsed default 3
      applyFilter();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', function() {
      currentSearch = this.value;
      if (clearBtn) {
        clearBtn.style.display = this.value ? 'inline-flex' : 'none';
      }
      applyFilter();
    });
  }

  if (clearBtn && searchInput) {
    clearBtn.addEventListener('click', function() {
      searchInput.value = '';
      currentSearch = '';
      clearBtn.style.display = 'none';
      searchInput.focus();
      applyFilter();
    });
  }

  // Terapkan filter awal (default 3 proyek)
  applyFilter();

  // Dynamic WhatsApp sync on survey buttons
  const mConfig = window.MARKETING_CONFIG || { name: "Mas Ro'uf", phone: "6287870988073" };
  const mPhone = mConfig.phone || "6287870988073";
  const mName = mConfig.name || "Mas Ro'uf";

  document.querySelectorAll('#lokasi-project .wa-dynamic-btn').forEach(function(btn) {
    const card = btn.closest('.lokasi-card');
    if (card) {
      const pName = card.querySelector('.lokasi-card-title') ? card.querySelector('.lokasi-card-title').textContent.trim() : 'Pesona Kahuripan';
      const rName = card.querySelector('.lokasi-card-region span') ? card.querySelector('.lokasi-card-region span').textContent.trim() : '';
      const waText = encodeURIComponent("Halo " + mName + ", saya tertarik informasi unit & jadwal survey lokasi di " + pName + " (" + rName + "). Bisa dibantu jadwal surveinya?\n\nReferensi: " + getActiveSiteLink('#lokasi-project'));
      btn.href = "https://api.whatsapp.com/send?phone=" + mPhone + "&text=" + waText;
    }
  });
}

// ================= MITRA KAMI (ANIMATED MARQUEE & CDN RESOLVER) =================
function initMitraMarquee() {
  const track = document.getElementById('mitraMarqueeTrack');
  const pauseBtn = document.getElementById('btnMitraPause');
  const imgs = document.querySelectorAll('.mitra-logo-img');

  if (pauseBtn && track) {
    let isPaused = false;
    pauseBtn.addEventListener('click', function() {
      isPaused = !isPaused;
      if (isPaused) {
        track.classList.add('is-paused');
        this.innerHTML = "<i class='hgi-stroke hgi-play'></i><span>Lanjutkan Animasi</span>";
      } else {
        track.classList.remove('is-paused');
        this.innerHTML = "<i class='hgi-stroke hgi-pause'></i><span>Jeda Animasi</span>";
      }
    });
  }

  const isLocal = window.location.protocol === 'file:' || 
                  window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1';

  imgs.forEach(function(img) {
    const rawSrc = img.getAttribute('data-local-src') || img.getAttribute('src') || '';
    if (!rawSrc) return;

    // Jika sudah berupa URL lengkap (http/https), langsung gunakan tanpa modifikasi
    if (rawSrc.startsWith('http://') || rawSrc.startsWith('https://')) {
      img.src = rawSrc;
      return;
    }

    // Jika path relatif lokal (misal: "foto mitra/..."), resolve sesuai host
    if (isLocal) {
      img.src = rawSrc;
    } else {
      img.src = 'https://cdn.jsdelivr.net/gh/pesonaku/landingpage@v3.5.2/' + encodeURI(rawSrc);
    }
  });
}


// ================= FANCYBOX LIGHTBOX INITIALIZATION =================
function initFancyboxUI() {
  if (typeof Fancybox !== 'undefined') {
    try {
      Fancybox.destroy();
    } catch(e) {}

    Fancybox.bind('[data-fancybox="proyek-album"], [data-fancybox="tampak-subsidi"]', {
      Hash: false,
      groupAll: false,
      closeButton: false,
      dragToClose: false,
      backdropClick: "close",
      autoFocus: false,
      placeFocusBack: false,
      animated: true,
      Toolbar: {
        display: {
          left: ["infobar"],
          middle: [],
          right: ["close"]
        }
      }
    });

    const instantCloseFancybox = function(e) {
      const btn = e.target.closest('[data-fancybox-close]');
      if (btn || (e.target && e.target.classList && e.target.classList.contains('fancybox__backdrop'))) {
        e.preventDefault();
        e.stopPropagation();
        Fancybox.close();
      }
    };
    document.addEventListener('pointerup', instantCloseFancybox, { passive: false });
    document.addEventListener('click', instantCloseFancybox);
  }
}


// ======================================================================
// 6. CTA ANALYTICS, MONITORING & CONSUMER INSIGHT ENGINE (v3.5.7)
// Integrated with Google Analytics 4 (AW-11372301881) & LocalStorage
// ======================================================================
function initCtaAnalyticsTracker() {
  const STORAGE_KEY = 'pesonaku_cta_analytics';
  const SYNC_CHANNEL_NAME = 'pesonaku_cta_sync_channel';

  // 1. Cross-Tab Communication via BroadcastChannel
  let syncChannel = null;
  try {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      syncChannel = new BroadcastChannel(SYNC_CHANNEL_NAME);
    }
  } catch(e) {}

  function broadcastDataChange(actionType) {
    if (syncChannel) {
      try {
        syncChannel.postMessage({
          type: actionType || 'CTA_UPDATED',
          timestamp: Date.now()
        });
      } catch(e) {}
    }
  }

  let currentTimelineFilter = 'all';

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getAnalyticsData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          parsed.bySection = parsed.bySection || {};
          parsed.byCta = parsed.byCta || {};
          parsed.daily = parsed.daily || {};
          parsed.logs = Array.isArray(parsed.logs) ? parsed.logs : [];
          parsed.leads = Array.isArray(parsed.leads) ? parsed.leads : [];
          parsed.totalClicks = typeof parsed.totalClicks === 'number' ? parsed.totalClicks : 0;

          // Backfill leads dari logs jika data.leads kosong tapi ada log form chat / phone
          if (parsed.leads.length === 0 && parsed.logs.length > 0) {
            parsed.logs.forEach(function(l) {
              if (l.phone || (l.id === 'cta_chat_submit' && l.name)) {
                let extractedPhone = l.phone || '';
                if (!extractedPhone && l.name) {
                  const m = l.name.match(/\((08\d{7,12})\)/);
                  if (m) extractedPhone = m[1];
                }
                const leadName = l.userName || l.name.replace(/^Formulir Chat:\s*/i, '').replace(/\s*\([^)]*\)$/, '');
                parsed.leads.push({
                  name: leadName,
                  phone: extractedPhone || '-',
                  message: l.message || '',
                  timestamp: l.timestamp || new Date().toISOString(),
                  timeFormatted: l.timeFormatted || ''
                });
              }
            });
          }

          return parsed;
        }
      }
    } catch(e) {
      console.warn('Gagal membaca data analytics:', e);
    }
    return {
      version: '1.0',
      firstTracked: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      totalClicks: 0,
      daily: {},
      bySection: {},
      byCta: {},
      logs: [],
      leads: []
    };
  }

  function saveAnalyticsData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      broadcastDataChange('CTA_UPDATED');
    } catch(e) {
      console.warn('Gagal menyimpan data analytics:', e);
    }
  }

  function recordCtaEvent(ctaId, ctaName, ctaSection, ctaTarget, leadData) {
    if (!ctaId || !ctaName) return;
    const data = getAnalyticsData();
    const now = new Date();
    const dateKey = now.toISOString().slice(0, 10);
    const timeFormatted = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' +
                          now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    data.totalClicks = (data.totalClicks || 0) + 1;
    data.lastUpdated = now.toISOString();

    data.daily[dateKey] = (data.daily[dateKey] || 0) + 1;
    data.bySection[ctaSection] = (data.bySection[ctaSection] || 0) + 1;

    if (!data.byCta[ctaId]) {
      data.byCta[ctaId] = {
        id: ctaId,
        name: ctaName,
        section: ctaSection,
        target: ctaTarget || 'Action',
        count: 0,
        lastClicked: ''
      };
    }
    data.byCta[ctaId].count++;
    data.byCta[ctaId].lastClicked = timeFormatted;

    // Jika ini adalah form chat debitur, selalu update nama dengan data debitur terbaru & simpan nomor HP
    if (leadData && leadData.phone) {
      data.byCta[ctaId].name = ctaName;
      data.byCta[ctaId].lastPhone = leadData.phone;
      data.byCta[ctaId].lastMessage = leadData.message || '';
      data.byCta[ctaId].lastUserName = leadData.userName || '';
    }

    const logEntry = {
      id: ctaId,
      name: ctaName,
      section: ctaSection,
      target: ctaTarget || 'Action',
      timestamp: now.toISOString(),
      timeFormatted: timeFormatted,
      phone: (leadData && leadData.phone) ? leadData.phone : null,
      message: (leadData && leadData.message) ? leadData.message : null,
      userName: (leadData && leadData.userName) ? leadData.userName : null
    };

    data.logs.unshift(logEntry);
    if (data.logs.length > 50) {
      data.logs = data.logs.slice(0, 50);
    }

    if (leadData && leadData.phone) {
      data.leads = data.leads || [];
      data.leads.unshift({
        name: leadData.userName || ctaName.replace(/^Formulir Chat:\s*/i, '').replace(/\s*\([^)]*\)$/, ''),
        phone: leadData.phone,
        message: leadData.message || '',
        timestamp: now.toISOString(),
        timeFormatted: timeFormatted
      });
      if (data.leads.length > 100) data.leads = data.leads.slice(0, 100);
    }

    saveAnalyticsData(data);

    // Google Tag Manager / GA4 dispatch
    if (typeof window.gtag === 'function') {
      try {
        window.gtag('event', 'cta_click', {
          event_category: 'CTA Conversion',
          event_label: ctaName,
          cta_section: ctaSection,
          cta_target: ctaTarget || 'Action',
          send_to: 'AW-11372301881',
          value: 1
        });
      } catch (err) {}
    }

    // Meta Pixel dispatch
    if (typeof window.fbq === 'function') {
      try {
        window.fbq('trackCustom', 'Lead_CTA', {
          content_name: ctaName,
          content_category: ctaSection
        });
      } catch (err) {}
    }

    // Live update UI immediately in current tab if dashboard or fullpage view is present
    renderDashboardUI();
  }

  // Global helper for manual dispatch
  window.trackCtaEvent = recordCtaEvent;
  if (window._ctaQueue && window._ctaQueue.length) {
    window._ctaQueue.forEach(function(args) { recordCtaEvent.apply(null, args); });
    window._ctaQueue = [];
  }

  // 2. Listen to BroadcastChannel messages from other tabs/windows
  if (syncChannel) {
    syncChannel.onmessage = function(event) {
      if (event && event.data && (event.data.type === 'CTA_UPDATED' || event.data.type === 'CTA_RESET')) {
        renderDashboardUI();
      }
    };
  }

  // 3. Listen to window 'storage' event (Cross-tab fallback)
  window.addEventListener('storage', function(e) {
    if (e.key === STORAGE_KEY) {
      renderDashboardUI();
    }
  });

  // 4. Active heartbeat poller (guarantees update every 1s if data changes)
  let lastKnownRawJson = '';
  try {
    lastKnownRawJson = localStorage.getItem(STORAGE_KEY) || '';
  } catch(e) {}

  setInterval(function() {
    const hasView = document.getElementById('statsFullPageView') ||
      (document.getElementById('pesonaCtaModalOverlay') && document.getElementById('pesonaCtaModalOverlay').classList.contains('active'));
    if (hasView) {
      try {
        const currentRaw = localStorage.getItem(STORAGE_KEY) || '';
        if (currentRaw !== lastKnownRawJson) {
          lastKnownRawJson = currentRaw;
          renderDashboardUI();
        }
      } catch(e) {}
    }
  }, 1000);

  // Intercept all CTA clicks
  document.addEventListener('click', function(e) {
    // Abaikan klik yang terjadi di dalam modal dashboard analytics sendiri atau fullpage stats view
    if (e.target.closest('#pesonaCtaModalOverlay') || e.target.closest('#statsFullPageView')) return;

    // Cek target CTA terdekat
    const target = e.target.closest(
      '.btn-promo-claim, .btn-promo-main, .btn-service-consult, .btn-service-detail, ' +
      '.btn-popup-wa, .btn-tampak-survey, .btn-cta-lokasi-wa, .btn-cta-lokasi-map, ' +
      '.btn-callout-wa, .btn-kpr-action, .btn-subsidi-cta, .btn-comm-cta, ' +
      '.btn-article-wa, .chat-chip, #wa-toggle, #chat-toggle, .chat-btn, .chat-toggle-btn, .float-wa, ' +
      '.btn-cta, .wa-dynamic-btn, [data-pop-title], ' +
      '.socmed-ig, .socmed-tiktok, .socmed-yt, .socmed-blog, [data-cta], ' +
      'a[href*="api.whatsapp.com"], a[href*="wa.me"], a[href^="tel:"]'
    );

    if (!target) return;

    let ctaId = '';
    let ctaName = '';
    let ctaSection = 'Umum';
    let ctaTarget = 'Action';

    // 1. Promo Section
    if (target.classList.contains('btn-promo-claim') || target.classList.contains('btn-promo-main') || target.closest('#promo, .promo-section')) {
      ctaId = 'cta_promo_claim';
      ctaName = 'Klaim Promo Spesial';
      ctaSection = 'Promo Spesial';
      ctaTarget = 'WhatsApp';
    }
    // 2. Unit Popup Detail WA (inside .pop modal or .unit-detail-source)
    else if (target.closest('.pop') || target.closest('.unit-detail-source') || target.classList.contains('btn-popup-wa')) {
      const popModal = target.closest('.pop');
      const titleEl = popModal ? popModal.querySelector('.pop-title h3, h3') : document.getElementById('popupUnitTitle');
      const unitName = titleEl ? titleEl.textContent.replace(/^Detail Unit:\s*/i, '').trim() : 'Unit';
      ctaId = 'cta_popup_wa_' + unitName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      ctaName = 'Konsultasi Popup ' + unitName;
      ctaSection = 'Detail Unit Popup';
      ctaTarget = 'WhatsApp';
    }
    // 3. Tipe Rumah Buka Detail Popup
    else if (target.classList.contains('btn-service-detail') || target.classList.contains('service-card-img')) {
      const card = target.closest('.service-card') || target.closest('.widget.Image');
      const h3 = card ? card.querySelector('h3, .service-card-title, .service-title') : null;
      const unitName = h3 ? h3.textContent.trim() : 'Unit Rumah';
      ctaId = 'cta_unit_detail_' + unitName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      ctaName = 'Lihat Detail ' + unitName;
      ctaSection = 'Tipe Rumah';
      ctaTarget = 'Modal Popup';
    }
    // 4. Tipe Rumah Konsultasi WhatsApp
    else if (target.classList.contains('btn-service-consult') || (target.closest('#service, .service-section') && (target.classList.contains('btn-cta') || target.classList.contains('wa-dynamic-btn')))) {
      const card = target.closest('.service-card') || target.closest('.widget.Image');
      const h3 = card ? card.querySelector('h3, .service-card-title, .service-title') : null;
      const unitName = h3 ? h3.textContent.trim() : 'Unit Rumah';
      ctaId = 'cta_unit_wa_' + unitName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      ctaName = 'Konsultasi ' + unitName;
      ctaSection = 'Tipe Rumah';
      ctaTarget = 'WhatsApp';
    }
    // 5. Tampak Rumah Subsidi
    else if (target.classList.contains('btn-tampak-survey') || target.closest('#tampak-section, .tampak-section')) {
      ctaId = 'cta_tampak_survey';
      ctaName = 'Jadwal Survey Rumah Subsidi';
      ctaSection = 'Tampak Rumah Subsidi';
      ctaTarget = 'WhatsApp';
    }
    // 6. Lokasi Proyek WhatsApp
    else if (target.classList.contains('btn-cta-lokasi-wa')) {
      const card = target.closest('.lokasi-card');
      const h3 = card ? card.querySelector('h3, .lokasi-card-title') : null;
      const projName = h3 ? h3.textContent.trim() : 'Proyek';
      ctaId = 'cta_lokasi_wa_' + projName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      ctaName = 'Survey WA - ' + projName;
      ctaSection = 'Lokasi Proyek';
      ctaTarget = 'WhatsApp';
    }
    // 7. Lokasi Proyek Google Maps
    else if (target.classList.contains('btn-cta-lokasi-map')) {
      const card = target.closest('.lokasi-card');
      const h3 = card ? card.querySelector('h3, .lokasi-card-title') : null;
      const projName = h3 ? h3.textContent.trim() : 'Proyek';
      ctaId = 'cta_lokasi_map_' + projName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      ctaName = 'Google Maps - ' + projName;
      ctaSection = 'Lokasi Proyek';
      ctaTarget = 'Google Maps';
    }
    // 8. Lokasi Callout
    else if (target.classList.contains('btn-callout-wa')) {
      ctaId = 'cta_lokasi_callout';
      ctaName = 'Konsultasi Lokasi Terdekat';
      ctaSection = 'Lokasi Proyek';
      ctaTarget = 'WhatsApp';
    }
    // 9. Simulasi KPR
    else if (target.classList.contains('btn-kpr-action') || target.classList.contains('btn-subsidi-cta') || target.classList.contains('btn-comm-cta') || target.closest('#kpr, .kpr-section')) {
      const isSubsidi = target.classList.contains('btn-subsidi-cta') || (target.getAttribute('href') || '').includes('subsidi');
      ctaId = isSubsidi ? 'cta_kpr_subsidi' : 'cta_kpr_komersial';
      ctaName = isSubsidi ? 'Konsultasi KPR Subsidi Flat' : 'Konsultasi KPR Komersial';
      ctaSection = 'Simulasi KPR';
      ctaTarget = 'WhatsApp';
    }
    // 10. Floating Chat Quick Chips
    else if (target.classList.contains('chat-chip')) {
      const chipTxt = target.textContent.trim();
      ctaId = 'cta_chip_' + chipTxt.toLowerCase().replace(/[^a-z0-9]/g, '_');
      ctaName = 'Pilihan Topik: ' + chipTxt;
      ctaSection = 'Floating Chat';
      ctaTarget = 'Chat Form';
    }
    // 11. Floating Chat Toggle
    else if (target.id === 'wa-toggle' || target.id === 'chat-toggle' || target.classList.contains('chat-btn') || target.classList.contains('chat-toggle-btn') || target.classList.contains('float-wa') || target.closest('#floating-chat-toggle') || target.closest('.chat-btn-wrap')) {
      ctaId = 'cta_floating_toggle';
      ctaName = 'Buka Widget Chat WhatsApp';
      ctaSection = 'Floating Chat';
      ctaTarget = 'Widget Toggle';
    }
    // 12. Kontak Langsung (Kantor Pemasaran & Profil Marketing)
    else if (target.closest('#contact, .contact-section')) {
      if (target.closest('.marketing-profile-card')) {
        const nameEl = target.closest('.marketing-profile-card').querySelector('.marketing-name-target');
        const mktName = nameEl ? nameEl.textContent.trim() : "Mas Ro'uf";
        ctaId = 'cta_contact_marketing_wa';
        ctaName = 'Konsultasi Marketing ' + mktName;
        ctaSection = 'Kontak Langsung';
        ctaTarget = 'WhatsApp';
      } else {
        ctaId = 'cta_contact_office_survey';
        ctaName = 'Jadwalkan Survei Kantor Pemasaran';
        ctaSection = 'Kontak Langsung';
        ctaTarget = 'WhatsApp';
      }
    }
    // 13. Artikel WhatsApp
    else if (target.classList.contains('btn-article-wa') || target.closest('#blog-single, .article-section')) {
      ctaId = 'cta_article_wa';
      ctaName = 'Konsultasi via Pembaca Artikel';
      ctaSection = 'Artikel & Berita';
      ctaTarget = 'WhatsApp';
    }
    // 14. Media Sosial
    else if (target.classList.contains('socmed-ig')) {
      ctaId = 'cta_socmed_instagram';
      ctaName = 'Kunjungi Instagram Resmi';
      ctaSection = 'Media Sosial';
      ctaTarget = 'Instagram';
    }
    else if (target.classList.contains('socmed-tiktok')) {
      ctaId = 'cta_socmed_tiktok';
      ctaName = 'Kunjungi TikTok Resmi';
      ctaSection = 'Media Sosial';
      ctaTarget = 'TikTok';
    }
    else if (target.classList.contains('socmed-yt')) {
      ctaId = 'cta_socmed_youtube';
      ctaName = 'Kunjungi YouTube Resmi';
      ctaSection = 'Media Sosial';
      ctaTarget = 'YouTube';
    }
    else if (target.classList.contains('socmed-blog')) {
      ctaId = 'cta_socmed_blog';
      ctaName = 'Kunjungi Halaman Blog';
      ctaSection = 'Artikel & Berita';
      ctaTarget = 'Blog';
    }
    // 15. Telephone link
    else if (target.tagName.toLowerCase() === 'a' && (target.getAttribute('href') || '').startsWith('tel:')) {
      ctaId = 'cta_tel_call';
      ctaName = 'Panggilan Telepon';
      ctaSection = 'Kontak Langsung';
      ctaTarget = 'Telepon';
    }
    // 16. Generic WhatsApp fallback
    else if (target.tagName.toLowerCase() === 'a' && ((target.getAttribute('href') || '').includes('whatsapp.com') || (target.getAttribute('href') || '').includes('wa.me'))) {
      const label = target.textContent.trim().slice(0, 40) || 'Tombol WhatsApp';
      ctaId = 'cta_wa_generic_' + label.toLowerCase().replace(/[^a-z0-9]/g, '_');
      ctaName = label;
      ctaSection = 'Kontak WhatsApp';
      ctaTarget = 'WhatsApp';
    }

    if (ctaId) {
      recordCtaEvent(ctaId, ctaName, ctaSection, ctaTarget);
    }
  });

  // Render Dashboard HTML Structure if not present
  function ensureDashboardDOM() {
    if (document.getElementById('pesonaCtaModalOverlay')) return;

    const modalHTML = `
<div id="pesonaCtaModalOverlay" class="pesona-cta-overlay" style="display:none;" aria-hidden="true">
  <div id="pesonaCtaModal" class="pesona-cta-modal" role="dialog" aria-modal="true" aria-labelledby="ctaModalTitle">
    
    <div class="cta-modal-header">
      <div class="cta-header-title-wrap">
        <div class="cta-header-icon">
          <i class="hgi-stroke hgi-chart-line-data-02"></i>
        </div>
        <div>
          <h2 id="ctaModalTitle" class="cta-header-title">Monitoring &amp; Analisa CTA Konsumen</h2>
          <p class="cta-header-subtitle">Real-time Conversion Tracking, Lead Intent &amp; Google Analytics 4</p>
        </div>
      </div>
      <div class="cta-header-actions">
        <span class="cta-live-badge"><span class="cta-live-dot"></span> LIVE MONITORING</span>
        <button type="button" class="cta-modal-close" id="btnCloseCtaDashboard" aria-label="Tutup Dashboard">
          <i class="hgi-stroke hgi-cancel-01"></i>
        </button>
      </div>
    </div>

    <div class="cta-kpi-grid">
      <div class="cta-kpi-card kpi-total">
        <div class="cta-kpi-icon"><i class="hgi-stroke hgi-cursor-click-02"></i></div>
        <div class="cta-kpi-content">
          <span class="cta-kpi-label">Total Interaksi CTA</span>
          <h3 class="cta-kpi-val" id="ctaKpiTotal">0</h3>
          <span class="cta-kpi-sub">Semua klik &amp; lead intent</span>
        </div>
      </div>
      <div class="cta-kpi-card kpi-today">
        <div class="cta-kpi-icon"><i class="hgi-stroke hgi-calendar-03"></i></div>
        <div class="cta-kpi-content">
          <span class="cta-kpi-label">Aktivitas Hari Ini</span>
          <h3 class="cta-kpi-val" id="ctaKpiToday">0</h3>
          <span class="cta-kpi-sub" id="ctaKpiTodayDate">Hari ini</span>
        </div>
      </div>
      <div class="cta-kpi-card kpi-top">
        <div class="cta-kpi-icon"><i class="hgi-stroke hgi-award-01"></i></div>
        <div class="cta-kpi-content">
          <span class="cta-kpi-label">CTA Paling Diminati</span>
          <h4 class="cta-kpi-text-val" id="ctaKpiTopName">-</h4>
          <span class="cta-kpi-sub" id="ctaKpiTopCount">0 klik</span>
        </div>
      </div>
      <div class="cta-kpi-card kpi-loc">
        <div class="cta-kpi-icon"><i class="hgi-stroke hgi-location-01"></i></div>
        <div class="cta-kpi-content">
          <span class="cta-kpi-label">Lokasi / Proyek Terfavorit</span>
          <h4 class="cta-kpi-text-val" id="ctaKpiTopLoc">-</h4>
          <span class="cta-kpi-sub" id="ctaKpiTopLocCount">0 klik</span>
        </div>
      </div>
    </div>

    <div class="cta-modal-tabs">
      <button type="button" class="cta-tab-btn active" data-cta-tab="summary">
        <i class="hgi-stroke hgi-chart-breakout-square"></i>
        <span>Ringkasan Kategori</span>
      </button>
      <button type="button" class="cta-tab-btn" data-cta-tab="detail">
        <i class="hgi-stroke hgi-task-daily-01"></i>
        <span>Rincian Semua Tombol CTA</span>
      </button>
      <button type="button" class="cta-tab-btn" data-cta-tab="leads">
        <i class="hgi-stroke hgi-user-sharing"></i>
        <span>Data Debitur &amp; Leads</span>
        <span class="badge-tab-lead-count" id="ctaLeadTabBadge">0</span>
      </button>
      <button type="button" class="cta-tab-btn" data-cta-tab="timeline">
        <i class="hgi-stroke hgi-clock-01"></i>
        <span>Log Aktivitas Terkini</span>
      </button>
      <button type="button" class="cta-tab-btn" data-cta-tab="ga4">
        <i class="hgi-stroke hgi-google"></i>
        <span>Status GA4 &amp; Panduan</span>
      </button>
    </div>

    <div class="cta-tab-body">
      <div class="cta-tab-pane active" id="ctaPaneSummary">
        <div class="cta-summary-grid">
          <div class="cta-progress-section" id="ctaCategoryProgressList"></div>
          <div class="cta-insight-card">
            <div class="cta-insight-header">
              <i class="hgi-stroke hgi-sparkles"></i>
              <h4>Analisa Minat Konsumen</h4>
            </div>
            <p id="ctaInsightText">Memuat ringkasan data minat konsumen...</p>
            <div class="cta-shortcut-hint">
              <i class="hgi-stroke hgi-information-circle"></i>
              <span>Tekan <strong>Ctrl + Shift + S</strong> di keyboard kapan saja untuk membuka dashboard ini.</span>
            </div>
          </div>
        </div>
      </div>

      <div class="cta-tab-pane" id="ctaPaneDetail">
        <div class="cta-table-toolbar">
          <div class="cta-search-wrap">
            <i class="hgi-stroke hgi-search-01"></i>
            <input type="text" id="ctaTableSearchInput" placeholder="Cari tombol CTA, tipe rumah, atau lokasi..." />
          </div>
          <span class="cta-table-count" id="ctaTableCountText">0 tombol tercatat</span>
        </div>
        <div class="cta-table-container">
          <table class="cta-table" id="ctaDetailsTable">
            <thead>
              <tr>
                <th>Nama Tombol / Aksi</th>
                <th>Kategori</th>
                <th>Target</th>
                <th style="text-align:center;">Total Klik</th>
                <th style="text-align:center;">Share (%)</th>
                <th>Terakhir Diklik</th>
              </tr>
            </thead>
            <tbody id="ctaTableBody"></tbody>
          </table>
        </div>
      </div>

      <div class="cta-tab-pane" id="ctaPaneLeads">
        <div class="cta-table-toolbar">
          <div class="cta-search-wrap">
            <i class="hgi-stroke hgi-search-01"></i>
            <input type="text" id="ctaLeadSearchInput" placeholder="Cari nama, nomor WhatsApp, atau pesan debitur..." />
          </div>
          <span class="cta-table-count" id="ctaLeadCountText">0 formulir tercatat</span>
        </div>
        <div class="cta-table-container">
          <table class="cta-table" id="ctaLeadsTable">
            <thead>
              <tr>
                <th style="width:40px;text-align:center;">No</th>
                <th style="width:145px;">Waktu Masuk</th>
                <th style="width:170px;">Nama Calon Debitur</th>
                <th style="width:170px;">Nomor WhatsApp</th>
                <th>Pesan / Minat Unit</th>
                <th style="width:130px;text-align:center;">Aksi Hubungi</th>
              </tr>
            </thead>
            <tbody id="ctaLeadTableBody"></tbody>
          </table>
        </div>
      </div>

      <div class="cta-tab-pane" id="ctaPaneTimeline">
        <div class="cta-timeline-wrap">
          <div class="cta-timeline-header">
            <div class="cta-timeline-title-wrap">
              <h4>Riwayat 50 Aktivitas Terakhir Konsumen</h4>
              <div class="cta-timeline-filters">
                <button type="button" class="cta-timeline-filter-btn active" data-filter="all">Semua Aktivitas</button>
                <button type="button" class="cta-timeline-filter-btn" data-filter="leads">
                  <span class="cta-filter-dot"></span> Khusus Form CTA &amp; Leads
                </button>
              </div>
            </div>
            <span class="cta-timeline-badge" id="ctaTimelineTotalBadge">0 tercatat</span>
          </div>
          <div class="cta-timeline-list" id="ctaTimelineList"></div>
        </div>
      </div>

      <div class="cta-tab-pane" id="ctaPaneGA4">
        <div class="cta-ga4-wrap">
          <div class="cta-ga4-status-card">
            <div class="cta-ga4-icon">
              <i class="hgi-stroke hgi-google"></i>
            </div>
            <div class="cta-ga4-info">
              <h4>Google Analytics 4 &amp; Google Tag Manager Terhubung</h4>
              <p>ID Konfigurasi: <code>AW-11372301881</code> &bull; Status: <span class="badge-status-online">● Terkoneksi Aktif</span></p>
            </div>
          </div>

          <div class="cta-ga4-grid">
            <div class="cta-ga4-card">
              <h5><i class="hgi-stroke hgi-arrow-right-double"></i> Event Otomatis yang Terkirim</h5>
              <ul>
                <li><strong>Event Name:</strong> <code>cta_click</code></li>
                <li><strong>Parameter 1:</strong> <code>event_category: 'CTA Conversion'</code></li>
                <li><strong>Parameter 2:</strong> <code>event_label: [Nama Tombol]</code> (Contoh: "Konsultasi Type 30/60")</li>
                <li><strong>Parameter 3:</strong> <code>cta_section: [Bagian Web]</code> (Contoh: "Tipe Rumah", "Lokasi Proyek")</li>
                <li><strong>Parameter 4:</strong> <code>cta_target: [Tujuan]</code> (Contoh: "WhatsApp", "Google Maps")</li>
              </ul>
            </div>
            <div class="cta-ga4-card">
              <h5><i class="hgi-stroke hgi-book-open-01"></i> Cara Memantau di Google Analytics</h5>
              <ol>
                <li>Buka dashboard <strong>Google Analytics 4</strong> akun Anda.</li>
                <li>Masuk ke menu <strong>Laporan (Reports) &gt; Keterlibatan (Engagement) &gt; Peristiwa (Events)</strong>.</li>
                <li>Cari peristiwa dengan nama <code>cta_click</code> untuk melihat grafik real-time konsumen dari seluruh Indonesia.</li>
                <li>Dapat dihubungkan ke <strong>Google Looker Studio</strong> untuk dashboard eksekutif manajemen.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="cta-modal-footer">
      <div class="cta-footer-left">
        <button type="button" class="cta-btn-action cta-btn-wa-copy" id="btnCopyWaReport" title="Salin laporan WhatsApp">
          <i class="hgi-stroke hgi-copy-01"></i>
          <span>Salin Laporan WhatsApp</span>
        </button>
        <button type="button" class="cta-btn-action cta-btn-export" id="btnExportCsv" title="Download data dalam format Excel CSV">
          <i class="hgi-stroke hgi-download-04"></i>
          <span>Download CSV (Excel)</span>
        </button>
        <button type="button" class="cta-btn-action cta-btn-reset" id="btnResetStats" title="Reset data statistik">
          <i class="hgi-stroke hgi-refresh"></i>
          <span>Reset Data</span>
        </button>
      </div>
      <button type="button" class="cta-btn-action cta-btn-close-bottom" id="btnCloseCtaBottom">
        <span>Tutup</span>
      </button>
    </div>

    <div id="ctaToastAlert" class="cta-toast-alert" style="display:none;">
      <i class="hgi-stroke hgi-checkmark-circle-01"></i>
      <span id="ctaToastText">Laporan berhasil disalin!</span>
    </div>

  </div>
</div>
`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    bindDashboardEvents();
  }

  function showToast(msg) {
    const toast = document.getElementById('ctaToastAlert');
    const toastText = document.getElementById('ctaToastText');
    if (!toast) return;
    if (toastText) toastText.textContent = msg;
    toast.style.display = 'flex';
    setTimeout(function() {
      toast.style.display = 'none';
    }, 2800);
  }

  function renderDashboardUI() {
    const data = getAnalyticsData();
    const total = data.totalClicks || 0;
    const todayKey = new Date().toISOString().slice(0, 10);
    const todayCount = data.daily[todayKey] || 0;

    // Helper to safely update text with bump animation
    function setKpiValue(id, value) {
      const strVal = String(value);
      document.querySelectorAll('#' + id).forEach(function(el) {
        if (el.textContent !== strVal) {
          el.textContent = strVal;
          el.classList.remove('cta-val-bump');
          void el.offsetWidth;
          el.classList.add('cta-val-bump');
        }
      });
    }

    // 1. KPI Top Row
    setKpiValue('ctaKpiTotal', total.toLocaleString('id-ID'));
    setKpiValue('ctaKpiToday', todayCount.toLocaleString('id-ID'));

    // Live Sync Indicator & Timestamp
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.querySelectorAll('#statsFpLastSync').forEach(function(el) {
      el.innerHTML = '<span class="live-sync-indicator"></span> Live: ' + timeFormatted + ' WIB (Tersinkron Otomatis)';
      el.classList.add('live-active');
    });

    const ctaList = Object.values(data.byCta || {}).sort((a,b) => b.count - a.count);
    if (ctaList.length > 0) {
      const topName = ctaList[0].name;
      const topCount = ctaList[0].count + ' klik (' + ((ctaList[0].count / total) * 100).toFixed(1) + '%)';
      document.querySelectorAll('#ctaKpiTopName').forEach(function(el) { el.textContent = topName; });
      document.querySelectorAll('#ctaKpiTopCount').forEach(function(el) { el.textContent = topCount; });
    } else {
      document.querySelectorAll('#ctaKpiTopName').forEach(function(el) { el.textContent = 'Belum Ada'; });
      document.querySelectorAll('#ctaKpiTopCount').forEach(function(el) { el.textContent = '0 klik'; });
    }

    // Top Location
    const locCtas = ctaList.filter(c => c.section === 'Lokasi Proyek');
    if (locCtas.length > 0) {
      const cleanLocName = locCtas[0].name.replace('Survey WA - ', '').replace('Google Maps - ', '');
      document.querySelectorAll('#ctaKpiTopLoc').forEach(function(el) { el.textContent = cleanLocName; });
      document.querySelectorAll('#ctaKpiTopLocCount').forEach(function(el) { el.textContent = locCtas[0].count + ' klik'; });
    } else {
      document.querySelectorAll('#ctaKpiTopLoc').forEach(function(el) { el.textContent = 'Belum Ada'; });
      document.querySelectorAll('#ctaKpiTopLocCount').forEach(function(el) { el.textContent = '0 klik'; });
    }

    // 2. Tab 1: Category Progress Bars & Insight
    const progressWraps = document.querySelectorAll('#ctaCategoryProgressList');
    if (progressWraps.length) {
      const sections = Object.keys(data.bySection || {}).sort((a,b) => data.bySection[b] - data.bySection[a]);
      let progHtml = '';
      if (sections.length === 0) {
        progHtml = '<p style="color:#94a3b8;font-size:0.86rem;">Belum ada interaksi CTA yang tercatat. Silakan coba klik tombol WhatsApp, survey lokasi, atau promo di halaman web.</p>';
      } else {
        sections.forEach(function(sec) {
          const count = data.bySection[sec];
          const pct = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
          progHtml += `
            <div class="cta-prog-item">
              <div class="cta-prog-info">
                <span class="cta-prog-title">${sec}</span>
                <span class="cta-prog-num">${count} klik (${pct}%)</span>
              </div>
              <div class="cta-prog-bar-bg">
                <div class="cta-prog-fill" style="width: ${pct}%;"></div>
              </div>
            </div>
          `;
        });
      }
      progressWraps.forEach(function(el) { el.innerHTML = progHtml; });
    }

    const insightEls = document.querySelectorAll('#ctaInsightText');
    if (insightEls.length) {
      let insightText = '';
      if (total === 0) {
        insightText = 'Sistem tracking aktif secara real-time. Setiap klik konsumen pada tombol WhatsApp, promo, simulasi KPR, dan lokasi proyek akan langsung dianalisa di sini.';
      } else {
        const topSec = Object.keys(data.bySection || {}).sort((a,b) => data.bySection[b] - data.bySection[a])[0];
        const topCtaItem = ctaList[0];
        insightText = `Konsumen paling aktif berinteraksi pada kategori <strong>${topSec}</strong> (${data.bySection[topSec]} interaksi).`;
        if (topCtaItem) {
          insightText += ` Tombol yang paling diminati calon pembeli adalah <strong>${topCtaItem.name}</strong> dengan kontribusi ${((topCtaItem.count / total) * 100).toFixed(1)}% dari total konversi.`;
        }
        if (locCtas.length > 0) {
          const cleanLoc = locCtas[0].name.replace('Survey WA - ', '').replace('Google Maps - ', '');
          insightText += ` Minat survei proyek tertinggi berada di <strong>${cleanLoc}</strong>.`;
        }
      }
      insightEls.forEach(function(el) { el.innerHTML = insightText; });
    }

    // Update badge jumlah lead form debitur
    const leadsTotal = (data.leads || []).length;
    document.querySelectorAll('#ctaLeadTabBadge').forEach(function(el) {
      el.textContent = leadsTotal;
    });

    // 3. Tab 2: Detail Table
    renderTableRows(ctaList, total);

    // 4. Tab 3: Data Debitur & Leads Table
    renderLeadsTable(data.leads || []);

    // 5. Tab 4: Timeline
    const timelineWraps = document.querySelectorAll('#ctaTimelineList');
    let logsToShow = data.logs || [];
    if (currentTimelineFilter === 'leads') {
      logsToShow = logsToShow.filter(function(item) {
        return !!(item.phone || item.message || item.id === 'cta_chat_submit');
      });
    }

    document.querySelectorAll('#ctaTimelineTotalBadge').forEach(function(el) {
      el.textContent = logsToShow.length + ' tercatat';
    });

    if (timelineWraps.length) {
      let listHtml = '';
      if (logsToShow.length === 0) {
        if (currentTimelineFilter === 'leads') {
          listHtml = '<p style="color:#94a3b8;font-size:0.86rem;text-align:center;padding:24px 0;"><i class="hgi-stroke hgi-information-circle" style="font-size:1.2rem;vertical-align:middle;margin-right:6px;"></i>Belum ada data formulir CTA dari debitur.</p>';
        } else {
          listHtml = '<p style="color:#94a3b8;font-size:0.86rem;text-align:center;padding:20px 0;">Belum ada log klik aktivitas.</p>';
        }
      } else {
        logsToShow.forEach(function(item) {
          const isLead = !!(item.phone || item.message || item.id === 'cta_chat_submit');
          let leadHtml = '';
          if (isLead) {
            const rawPhone = item.phone || '';
            const cleanDigits = rawPhone.replace(/\D/g, '');
            const waPhoneNum = cleanDigits.startsWith('0') ? ('62' + cleanDigits.slice(1)) : cleanDigits.startsWith('62') ? cleanDigits : ('62' + cleanDigits);
            const waChatLink = cleanDigits ? `https://wa.me/${waPhoneNum}` : '#';

            leadHtml = `
              <div class="cta-lead-box">
                <div class="cta-lead-info-row">
                  <span class="cta-lead-label"><i class="hgi-stroke hgi-smart-phone-01"></i> No. HP:</span>
                  <strong class="cta-lead-phone-text">${item.phone || 'Nomor tidak dicatat'}</strong>
                  ${cleanDigits ? `
                    <a href="${waChatLink}" target="_blank" rel="noopener" class="cta-lead-wa-btn" title="Kirim Pesan WhatsApp ke Debitur">
                      <i class="hgi-stroke hgi-whatsapp"></i> Chat Debitur
                    </a>
                  ` : ''}
                </div>
                ${item.message ? `
                  <div class="cta-lead-info-row cta-lead-msg-row">
                    <span class="cta-lead-label"><i class="hgi-stroke hgi-bubble-chat"></i> Pesan:</span>
                    <div class="cta-lead-msg-quote">&ldquo;${escapeHtml(item.message)}&rdquo;</div>
                  </div>
                ` : ''}
              </div>
            `;
          }

          listHtml += `
            <div class="cta-timeline-item ${isLead ? 'is-lead' : ''}">
              <div class="cta-time-left">
                <div class="cta-time-icon ${isLead ? 'icon-lead' : ''}">
                  <i class="hgi-stroke ${isLead ? 'hgi-user-sharing' : 'hgi-cursor-click-02'}"></i>
                </div>
                <div class="cta-time-content">
                  <div class="cta-time-name">
                    ${item.name}
                    ${isLead ? '<span class="badge-lead-tag"><i class="hgi-stroke hgi-task-daily-01"></i> Lead Form CTA</span>' : ''}
                  </div>
                  <div class="cta-time-meta">
                    <span class="badge-sec">${item.section}</span> &bull; 
                    <span class="badge-target">${item.target}</span>
                  </div>
                  ${leadHtml}
                </div>
              </div>
              <div class="cta-time-right">${item.timeFormatted || ''}</div>
            </div>
          `;
        });
      }
      timelineWraps.forEach(function(el) { el.innerHTML = listHtml; });
    }
  }

  function renderTableRows(ctaList, total) {
    const tbody = document.getElementById('ctaTableBody');
    const countEl = document.getElementById('ctaTableCountText');
    const searchInput = document.getElementById('ctaTableSearchInput');
    const searchVal = (searchInput ? searchInput.value : '').toLowerCase().trim();

    if (countEl) countEl.textContent = ctaList.length + ' tombol tercatat';
    if (!tbody) return;

    const filtered = searchVal ? ctaList.filter(c => c.name.toLowerCase().includes(searchVal) || c.section.toLowerCase().includes(searchVal)) : ctaList;

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#94a3b8;padding:24px;">Tidak ada data CTA yang sesuai filter.</td></tr>';
      return;
    }

    let rowsHtml = '';
    filtered.forEach(function(c) {
      const pct = total > 0 ? ((c.count / total) * 100).toFixed(1) : 0;
      const isLeadCta = c.id === 'cta_chat_submit' || !!c.lastPhone;
      let phoneBadgeHtml = '';
      if (isLeadCta && c.lastPhone) {
        const cleanDigits = c.lastPhone.replace(/\D/g, '');
        const waNum = cleanDigits.startsWith('0') ? ('62' + cleanDigits.slice(1)) : cleanDigits.startsWith('62') ? cleanDigits : ('62' + cleanDigits);
        phoneBadgeHtml = `
          <div class="cta-row-phone-badge">
            <i class="hgi-stroke hgi-smart-phone-01"></i> No. HP Terkini: <strong>${escapeHtml(c.lastPhone)}</strong>
            <a href="https://wa.me/${waNum}" target="_blank" rel="noopener" class="cta-mini-wa-btn" title="Chat WhatsApp Calon Debitur">
              <i class="hgi-stroke hgi-whatsapp"></i> Chat
            </a>
          </div>
        `;
      }
      rowsHtml += `
        <tr>
          <td>
            <strong style="color:#ffffff;">${escapeHtml(c.name)}</strong>
            ${phoneBadgeHtml}
          </td>
          <td><span class="badge-sec">${escapeHtml(c.section)}</span></td>
          <td><span class="badge-target">${escapeHtml(c.target)}</span></td>
          <td style="text-align:center;font-weight:700;color:#10b981;">${c.count}</td>
          <td style="text-align:center;color:#94a3b8;">${pct}%</td>
          <td style="color:#64748b;font-size:0.78rem;">${c.lastClicked || '-'}</td>
        </tr>
      `;
    });
    tbody.innerHTML = rowsHtml;
  }

  function renderLeadsTable(leadsList) {
    const tbody = document.getElementById('ctaLeadTableBody');
    const countEl = document.getElementById('ctaLeadCountText');
    const searchInput = document.getElementById('ctaLeadSearchInput');
    const searchVal = (searchInput ? searchInput.value : '').toLowerCase().trim();

    if (countEl) countEl.textContent = (leadsList.length) + ' formulir tercatat';
    if (!tbody) return;

    const filtered = searchVal ? leadsList.filter(l => 
      (l.name && l.name.toLowerCase().includes(searchVal)) ||
      (l.phone && l.phone.toLowerCase().includes(searchVal)) ||
      (l.message && l.message.toLowerCase().includes(searchVal))
    ) : leadsList;

    if (filtered.length === 0) {
      if (searchVal) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#94a3b8;padding:28px 14px;"><i class="hgi-stroke hgi-search-01" style="font-size:1.3rem;vertical-align:middle;margin-right:6px;"></i>Tidak ada data debitur yang sesuai pencarian "<strong>' + escapeHtml(searchVal) + '</strong>".</td></tr>';
      } else {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align:center;color:#94a3b8;padding:36px 16px;">
              <div style="max-width:420px;margin:0 auto;">
                <div style="width:48px;height:48px;border-radius:12px;background:rgba(16,185,129,0.12);color:#10b981;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:24px;">
                  <i class="hgi-stroke hgi-user-sharing"></i>
                </div>
                <h4 style="color:#f8fafc;font-size:0.96rem;margin:0 0 6px;">Belum Ada Data Formulir Debitur</h4>
                <p style="font-size:0.82rem;color:#64748b;line-height:1.5;margin:0;">Setiap calon debitur yang mengisi form floating WhatsApp akan otomatis tercatat nama, nomor handphone, dan pertanyaannya di sini secara real-time.</p>
              </div>
            </td>
          </tr>
        `;
      }
      return;
    }

    let rowsHtml = '';
    filtered.forEach(function(lead, idx) {
      const rawPhone = lead.phone || '-';
      const cleanDigits = rawPhone.replace(/\D/g, '');
      const waPhoneNum = cleanDigits.startsWith('0') ? ('62' + cleanDigits.slice(1)) : cleanDigits.startsWith('62') ? cleanDigits : ('62' + cleanDigits);
      const greetingMsg = `Halo ${lead.name || 'Bapak/Ibu'}, terima kasih sudah mengisi formulir di website Pesona Kahuripan. Ada yang bisa kami bantu perihal unit rumah idaman Anda?`;
      const waChatLink = cleanDigits ? `https://wa.me/${waPhoneNum}?text=${encodeURIComponent(greetingMsg)}` : '#';

      rowsHtml += `
        <tr>
          <td style="text-align:center;color:#64748b;font-weight:600;">${idx + 1}</td>
          <td style="color:#94a3b8;font-size:0.78rem;white-space:nowrap;">
            <i class="hgi-stroke hgi-clock-01" style="font-size:12px;vertical-align:middle;margin-right:3px;"></i>${lead.timeFormatted || lead.timestamp || '-'}
          </td>
          <td>
            <div style="font-weight:700;color:#ffffff;display:flex;align-items:center;gap:6px;">
              <i class="hgi-stroke hgi-user" style="color:#10b981;font-size:14px;"></i>
              <span>${escapeHtml(lead.name || 'Calon Debitur')}</span>
            </div>
          </td>
          <td>
            <div class="lead-phone-cell">
              <strong class="lead-phone-number">${escapeHtml(lead.phone || '-')}</strong>
              ${cleanDigits ? `
                <button type="button" class="btn-copy-lead-phone" data-phone="${escapeHtml(lead.phone)}" title="Salin nomor WhatsApp">
                  <i class="hgi-stroke hgi-copy-01"></i>
                </button>
              ` : ''}
            </div>
          </td>
          <td>
            <div class="lead-msg-cell" title="${escapeHtml(lead.message || '')}">
              ${lead.message ? ('&ldquo;' + escapeHtml(lead.message) + '&rdquo;') : '<span style="color:#64748b;font-style:italic;">Tidak ada pesan</span>'}
            </div>
          </td>
          <td style="text-align:center;white-space:nowrap;">
            ${cleanDigits ? `
              <a href="${waChatLink}" target="_blank" rel="noopener" class="cta-lead-action-wa" title="Hubungi Debitur via WhatsApp">
                <i class="hgi-stroke hgi-whatsapp"></i>
                <span>Chat WA</span>
              </a>
            ` : '<span style="color:#64748b;font-size:0.75rem;">-</span>'}
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = rowsHtml;

    // Bind tombol salin nomor telepon
    tbody.querySelectorAll('.btn-copy-lead-phone').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const p = this.getAttribute('data-phone');
        if (p && navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(p).then(function() {
            showToast('Nomor ' + p + ' berhasil disalin!');
          });
        }
      });
    });
  }

  function generateWhatsAppReportText() {
    const data = getAnalyticsData();
    const dateNow = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const todayKey = new Date().toISOString().slice(0, 10);
    const todayClicks = data.daily[todayKey] || 0;
    
    const sortedCtas = Object.values(data.byCta || {}).sort((a,b) => b.count - a.count);
    const topCta = sortedCtas[0] ? `${sortedCtas[0].name} (${sortedCtas[0].count} klik)` : '-';
    
    const locationCtas = sortedCtas.filter(c => c.section === 'Lokasi Proyek');
    const topLoc = locationCtas[0] ? `${locationCtas[0].name.replace('Survey WA - ', '').replace('Google Maps - ', '')} (${locationCtas[0].count} klik)` : '-';

    let secList = '';
    Object.keys(data.bySection || {}).sort((a,b) => data.bySection[b] - data.bySection[a]).forEach(sec => {
      const cnt = data.bySection[sec];
      const pct = data.totalClicks ? ((cnt / data.totalClicks) * 100).toFixed(1) : 0;
      secList += `• ${sec}: *${cnt}* klik (${pct}%)\n`;
    });

    const allLeads = (data.leads && data.leads.length > 0) ? data.leads : (data.logs || []).filter(function(l) {
      return !!(l.phone || l.message || l.id === 'cta_chat_submit');
    });

    let leadsSummary = '';
    if (allLeads.length > 0) {
      leadsSummary = '\n📥 *Lead Form Debitur Terkini:*\n';
      allLeads.slice(0, 10).forEach(function(ld) {
        const leadName = ld.userName || ld.name.replace(/^Formulir Chat:\s*/i, '').replace(/\s*\([^)]*\)$/, '');
        const msgSnippet = (ld.message || '').slice(0, 35) + ((ld.message || '').length > 35 ? '...' : '');
        leadsSummary += `• *${leadName}* (${ld.phone || '-'}): "${msgSnippet}"\n`;
      });
    }

    return `📊 *LAPORAN MONITORING CTA KONSUMEN*\n` +
           `🌐 *Website:* ${getActiveSiteOrigin()}\n` +
           `📅 *Update:* ${dateNow} WIB\n` +
           `----------------------------------------\n` +
           `📈 *Total Klik CTA:* ${data.totalClicks || 0} interaksi\n` +
           `⚡ *Aktivitas Hari Ini:* ${todayClicks} interaksi\n` +
           `🏆 *CTA Terfavorit:* ${topCta}\n` +
           `📍 *Lokasi Terbanyak:* ${topLoc}\n\n` +
           `*Rincian Per Kategori:*\n${secList || '• Belum ada data interaksi\n'}` +
           leadsSummary + '\n' +
           `_Data dihasilkan otomatis dari Dashboard CTA Analytics._`;
  }

  function exportCsvFile() {
    const data = getAnalyticsData();
    const sortedCtas = Object.values(data.byCta || {}).sort((a,b) => b.count - a.count);
    const total = data.totalClicks || 0;
    const escape = (str) => '"' + String(str || '').replace(/"/g, '""') + '"';

    let csvContent = '\uFEFF'; // UTF-8 BOM
    csvContent += '=== RINGKASAN TOMBOL CTA ===\n';
    csvContent += 'ID,Nama Tombol / Aksi,Kategori,Target,Total Klik,Persentase,Terakhir Diklik\n';

    sortedCtas.forEach(function(c) {
      const pct = total > 0 ? ((c.count / total) * 100).toFixed(1) + '%' : '0%';
      csvContent += [
        escape(c.id),
        escape(c.name),
        escape(c.section),
        escape(c.target),
        c.count,
        escape(pct),
        escape(c.lastClicked)
      ].join(',') + '\n';
    });

    const allLeads = (data.leads && data.leads.length > 0) ? data.leads : (data.logs || []).filter(function(l) {
      return !!(l.phone || l.message || l.id === 'cta_chat_submit');
    });

    csvContent += '\n=== DAFTAR LEAD FORMULIR CTA DEBITUR ===\n';
    csvContent += 'No,Tanggal & Waktu,Nama Debitur,Nomor WhatsApp,Pesan / Minat Unit\n';

    if (allLeads.length === 0) {
      csvContent += 'Belum ada lead formulir CTA yang masuk\n';
    } else {
      allLeads.forEach(function(item, idx) {
        csvContent += [
          idx + 1,
          escape(item.timeFormatted || item.timestamp),
          escape(item.userName || item.name.replace(/^Formulir Chat:\s*/i, '').replace(/\s*\([^)]*\)$/, '')),
          escape(item.phone || '-'),
          escape(item.message || '-')
        ].join(',') + '\n';
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', 'pesonaku-cta-leads-' + dateStr + '.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('File CSV berhasil di-download!');
  }

  let dashboardEventsBound = false;
  function bindDashboardEvents() {
    if (dashboardEventsBound) return;
    dashboardEventsBound = true;

    const overlay = document.getElementById('pesonaCtaModalOverlay');
    const btnClose = document.getElementById('btnCloseCtaDashboard');
    const btnCloseBottom = document.getElementById('btnCloseCtaBottom');
    const tabs = document.querySelectorAll('.cta-tab-btn');
    const searchInput = document.getElementById('ctaTableSearchInput');
    const btnCopyWa = document.getElementById('btnCopyWaReport');
    const btnExport = document.getElementById('btnExportCsv');
    const btnReset = document.getElementById('btnResetStats');

    function closeModal() {
      if (overlay) {
        overlay.classList.remove('active');
        setTimeout(function() {
          overlay.style.display = 'none';
        }, 300);
      }
    }

    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnCloseBottom) btnCloseBottom.addEventListener('click', closeModal);

    if (overlay) {
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeModal();
      });
    }

    // Tabs
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const targetTab = tab.getAttribute('data-cta-tab');
        document.querySelectorAll('.cta-tab-pane').forEach(function(pane) {
          pane.classList.remove('active');
        });
        const activePane = document.getElementById('ctaPane' + targetTab.charAt(0).toUpperCase() + targetTab.slice(1));
        if (activePane) activePane.classList.add('active');
      });
    });

    // Search CTA table
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        const data = getAnalyticsData();
        const ctaList = Object.values(data.byCta || {}).sort((a,b) => b.count - a.count);
        renderTableRows(ctaList, data.totalClicks || 0);
      });
    }

    // Search Lead table
    const leadSearchInput = document.getElementById('ctaLeadSearchInput');
    if (leadSearchInput) {
      leadSearchInput.addEventListener('input', function() {
        const data = getAnalyticsData();
        renderLeadsTable(data.leads || []);
      });
    }

    // Timeline filter buttons (All vs Form CTA Leads)
    document.querySelectorAll('.cta-timeline-filter-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter') || 'all';
        currentTimelineFilter = filter;
        document.querySelectorAll('.cta-timeline-filter-btn').forEach(function(b) {
          b.classList.toggle('active', b.getAttribute('data-filter') === filter);
        });
        renderDashboardUI();
      });
    });

    // Copy WA Report
    if (btnCopyWa) {
      btnCopyWa.addEventListener('click', function() {
        const report = generateWhatsAppReportText();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(report).then(function() {
            showToast('Laporan WhatsApp berhasil disalin ke clipboard!');
          }).catch(function() {
            promptCopy(report);
          });
        } else {
          promptCopy(report);
        }
      });
    }

    function promptCopy(text) {
      window.prompt('Salin teks laporan berikut:', text);
      showToast('Laporan WhatsApp siap dikirim!');
    }

    // Export CSV
    if (btnExport) {
      btnExport.addEventListener('click', exportCsvFile);
    }

    // Reset Data
    if (btnReset) {
      btnReset.addEventListener('click', function() {
        if (confirm('Apakah Anda yakin ingin mereset seluruh data statistik CTA konsumen? Data yang sudah dihapus tidak dapat dikembalikan.')) {
          localStorage.removeItem(STORAGE_KEY);
          renderDashboardUI();
          broadcastDataChange('CTA_RESET');
          showToast('Data statistik berhasil direset!');
        }
      });
    }
  }

  function isStatistikRoute() {
    try {
      const path = (window.location.pathname || '').toLowerCase().replace(/\/+$/, '');
      const search = (window.location.search || '').toLowerCase();
      const hash = (window.location.hash || '').toLowerCase();
      return (
        path === '/statistik' ||
        path.endsWith('/statistik') ||
        path.includes('/p/statistik') ||
        path.endsWith('/statistik.html') ||
        search.includes('route=statistik') ||
        search.includes('page=statistik') ||
        hash === '#statistik' ||
        hash === '#/statistik' ||
        document.body.classList.contains('is-statistik-page') ||
        !!document.getElementById('statsFullPageView')
      );
    } catch(e) {
      return false;
    }
  }

  function mountFullPageStatsView() {
    try {
      document.title = 'Monitoring & Analisa CTA Konsumen | Pesona Kahuripan';
    } catch(e) {}

    // Sembunyikan elemen beranda / artikel biasa jika ada di DOM
    document.querySelectorAll('#header, #hero, #about, #service, #tampak-section, #lokasi-section, #promo, #gallery, #kpr, #faq, #contact, #footer, #floating-chat, #blog-single').forEach(function(el) {
      el.style.setProperty('display', 'none', 'important');
    });

    let container = document.getElementById('statsFullPageView');
    if (!container) {
      const fullPageHTML = `
<div id="statsFullPageView" class="stats-fullpage-layout">
  <header class="stats-fp-navbar">
    <div class="stats-fp-nav-inner">
      <a href="/" class="stats-fp-logo-wrap" title="Kembali ke Beranda Pesona Kahuripan">
        <img src="https://blogger.googleusercontent.com/img/a/AVvXsEgqB2QhrvsCgDSNo4roXgoDSo7oZV9mkCZY9kHDb2I7KC3FI4SCLuyWaBXShDGHDLHLEMsHpagl_CWKf-FI37FAR6GK_0dHZwHP-oJ_n3W3WKJQznbe3MC2tsXLbXZJG_iuohb17uim3-D974PuRgXDh8sCTfppDaP7yagLsthRMrIKieG4acIPb3VAiJU=s256" alt="Pesona Kahuripan" class="stats-fp-logo" />
        <div class="stats-fp-brand-text">
          <span class="stats-fp-brand-title">Pesona Kahuripan</span>
          <span class="stats-fp-brand-sub">Marketing Intelligence</span>
        </div>
      </a>
      <div class="stats-fp-nav-actions">
        <span class="cta-live-badge"><span class="cta-live-dot"></span> LIVE MONITORING CTA</span>
        <a href="/" class="stats-btn-back-home">
          <i class="hgi-stroke hgi-arrow-left-01"></i>
          <span>Kembali ke Beranda</span>
        </a>
      </div>
    </div>
  </header>

  <main class="stats-fp-main">
    <div class="stats-fp-container">
      <div class="stats-fp-hero">
        <div class="stats-fp-hero-content">
          <span class="stats-fp-badge-top">ADMIN &amp; MARKETING DASHBOARD</span>
          <h1 class="stats-fp-title">Monitoring &amp; Analisa CTA Konsumen</h1>
          <p class="stats-fp-desc">Kontrol aktivitas calon pembeli, analisa konversi perumahan, dan lacak leads secara real-time di seluruh saluran Call-to-Action.</p>
        </div>
        <div class="stats-fp-hero-meta">
          <span class="stats-fp-last-sync" id="statsFpLastSync">Update Real-time</span>
        </div>
      </div>

      <div class="cta-kpi-grid">
        <div class="cta-kpi-card kpi-total">
          <div class="cta-kpi-icon"><i class="hgi-stroke hgi-cursor-click-02"></i></div>
          <div class="cta-kpi-content">
            <span class="cta-kpi-label">Total Interaksi CTA</span>
            <h3 class="cta-kpi-val" id="ctaKpiTotal">0</h3>
            <span class="cta-kpi-sub">Semua klik &amp; lead intent</span>
          </div>
        </div>
        <div class="cta-kpi-card kpi-today">
          <div class="cta-kpi-icon"><i class="hgi-stroke hgi-calendar-03"></i></div>
          <div class="cta-kpi-content">
            <span class="cta-kpi-label">Aktivitas Hari Ini</span>
            <h3 class="cta-kpi-val" id="ctaKpiToday">0</h3>
            <span class="cta-kpi-sub" id="ctaKpiTodayDate">Hari ini</span>
          </div>
        </div>
        <div class="cta-kpi-card kpi-top">
          <div class="cta-kpi-icon"><i class="hgi-stroke hgi-award-01"></i></div>
          <div class="cta-kpi-content">
            <span class="cta-kpi-label">CTA Paling Diminati</span>
            <h4 class="cta-kpi-text-val" id="ctaKpiTopName">-</h4>
            <span class="cta-kpi-sub" id="ctaKpiTopCount">0 klik</span>
          </div>
        </div>
        <div class="cta-kpi-card kpi-loc">
          <div class="cta-kpi-icon"><i class="hgi-stroke hgi-location-01"></i></div>
          <div class="cta-kpi-content">
            <span class="cta-kpi-label">Lokasi / Proyek Terfavorit</span>
            <h4 class="cta-kpi-text-val" id="ctaKpiTopLoc">-</h4>
            <span class="cta-kpi-sub" id="ctaKpiTopLocCount">0 klik</span>
          </div>
        </div>
      </div>

      <div class="cta-modal-tabs">
        <button type="button" class="cta-tab-btn active" data-cta-tab="summary">
          <i class="hgi-stroke hgi-chart-breakout-square"></i>
          <span>Ringkasan Kategori</span>
        </button>
        <button type="button" class="cta-tab-btn" data-cta-tab="detail">
          <i class="hgi-stroke hgi-task-daily-01"></i>
          <span>Rincian Semua Tombol CTA</span>
        </button>
        <button type="button" class="cta-tab-btn" data-cta-tab="leads">
          <i class="hgi-stroke hgi-user-sharing"></i>
          <span>Data Debitur &amp; Leads</span>
          <span class="badge-tab-lead-count" id="ctaLeadTabBadge">0</span>
        </button>
        <button type="button" class="cta-tab-btn" data-cta-tab="timeline">
          <i class="hgi-stroke hgi-clock-01"></i>
          <span>Log Aktivitas Terkini</span>
        </button>
        <button type="button" class="cta-tab-btn" data-cta-tab="ga4">
          <i class="hgi-stroke hgi-google"></i>
          <span>Status GA4 &amp; Panduan</span>
        </button>
      </div>

      <div class="cta-tab-body">
        <div class="cta-tab-pane active" id="ctaPaneSummary">
          <div class="cta-summary-grid">
            <div class="cta-progress-section" id="ctaCategoryProgressList"></div>
            <div class="cta-insight-card">
              <div class="cta-insight-header">
                <i class="hgi-stroke hgi-sparkles"></i>
                <h4>Analisa Minat Konsumen</h4>
              </div>
              <p id="ctaInsightText">Memuat ringkasan data minat konsumen...</p>
              <div class="cta-shortcut-hint">
                <i class="hgi-stroke hgi-information-circle"></i>
                <span>Halaman ini dapat diakses langsung via <strong>domain.com/statistik</strong> kapan saja.</span>
              </div>
            </div>
          </div>
        </div>

        <div class="cta-tab-pane" id="ctaPaneDetail">
          <div class="cta-table-toolbar">
            <div class="cta-search-wrap">
              <i class="hgi-stroke hgi-search-01"></i>
              <input type="text" id="ctaTableSearchInput" placeholder="Cari tombol CTA, tipe rumah, atau lokasi..." />
            </div>
            <span class="cta-table-count" id="ctaTableCountText">0 tombol tercatat</span>
          </div>
          <div class="cta-table-container">
            <table class="cta-table" id="ctaDetailsTable">
              <thead>
                <tr>
                  <th>Nama Tombol / Aksi</th>
                  <th>Kategori</th>
                  <th>Target</th>
                  <th style="text-align:center;">Total Klik</th>
                  <th style="text-align:center;">Share (%)</th>
                  <th>Terakhir Diklik</th>
                </tr>
              </thead>
              <tbody id="ctaTableBody"></tbody>
            </table>
          </div>
        </div>

        <div class="cta-tab-pane" id="ctaPaneLeads">
          <div class="cta-table-toolbar">
            <div class="cta-search-wrap">
              <i class="hgi-stroke hgi-search-01"></i>
              <input type="text" id="ctaLeadSearchInput" placeholder="Cari nama, nomor WhatsApp, atau pesan debitur..." />
            </div>
            <span class="cta-table-count" id="ctaLeadCountText">0 formulir tercatat</span>
          </div>
          <div class="cta-table-container">
            <table class="cta-table" id="ctaLeadsTable">
              <thead>
                <tr>
                  <th style="width:40px;text-align:center;">No</th>
                  <th style="width:145px;">Waktu Masuk</th>
                  <th style="width:170px;">Nama Calon Debitur</th>
                  <th style="width:170px;">Nomor WhatsApp</th>
                  <th>Pesan / Minat Unit</th>
                  <th style="width:130px;text-align:center;">Aksi Hubungi</th>
                </tr>
              </thead>
              <tbody id="ctaLeadTableBody"></tbody>
            </table>
          </div>
        </div>

        <div class="cta-tab-pane" id="ctaPaneTimeline">
          <div class="cta-timeline-wrap">
            <div class="cta-timeline-header">
              <div class="cta-timeline-title-wrap">
                <h4>Riwayat 50 Aktivitas Terakhir Konsumen</h4>
                <div class="cta-timeline-filters">
                  <button type="button" class="cta-timeline-filter-btn active" data-filter="all">Semua Aktivitas</button>
                  <button type="button" class="cta-timeline-filter-btn" data-filter="leads">
                    <span class="cta-filter-dot"></span> Khusus Form CTA &amp; Leads
                  </button>
                </div>
              </div>
              <span class="cta-timeline-badge" id="ctaTimelineTotalBadge">0 tercatat</span>
            </div>
            <div class="cta-timeline-list" id="ctaTimelineList"></div>
          </div>
        </div>

        <div class="cta-tab-pane" id="ctaPaneGA4">
          <div class="cta-ga4-wrap">
            <div class="cta-ga4-status-card">
              <div class="cta-ga4-icon">
                <i class="hgi-stroke hgi-google"></i>
              </div>
              <div class="cta-ga4-info">
                <h4>Google Analytics 4 &amp; Google Tag Manager Terhubung</h4>
                <p>ID Konfigurasi: <code>AW-11372301881</code> &bull; Status: <span class="badge-status-online">● Terkoneksi Aktif</span></p>
              </div>
            </div>

            <div class="cta-ga4-grid">
              <div class="cta-ga4-card">
                <h5><i class="hgi-stroke hgi-arrow-right-double"></i> Event Otomatis yang Terkirim</h5>
                <ul>
                  <li><strong>Event Name:</strong> <code>cta_click</code></li>
                  <li><strong>Parameter 1:</strong> <code>event_category: 'CTA Conversion'</code></li>
                  <li><strong>Parameter 2:</strong> <code>event_label: [Nama Tombol]</code></li>
                  <li><strong>Parameter 3:</strong> <code>cta_section: [Bagian Web]</code></li>
                  <li><strong>Parameter 4:</strong> <code>cta_target: [Tujuan]</code></li>
                </ul>
              </div>
              <div class="cta-ga4-card">
                <h5><i class="hgi-stroke hgi-book-open-01"></i> Cara Memantau di Google Analytics</h5>
                <ol>
                  <li>Buka dashboard <strong>Google Analytics 4</strong> akun Anda.</li>
                  <li>Masuk ke menu <strong>Laporan (Reports) &gt; Keterlibatan (Engagement) &gt; Peristiwa (Events)</strong>.</li>
                  <li>Cari peristiwa dengan nama <code>cta_click</code> untuk melihat grafik real-time konsumen dari seluruh Indonesia.</li>
                  <li>Dapat dihubungkan ke <strong>Google Looker Studio</strong> untuk dashboard eksekutif manajemen.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="cta-modal-footer">
        <div class="cta-footer-left">
          <button type="button" class="cta-btn-action cta-btn-wa-copy" id="btnCopyWaReport" title="Salin laporan WhatsApp">
            <i class="hgi-stroke hgi-copy-01"></i>
            <span>Salin Laporan WhatsApp</span>
          </button>
          <button type="button" class="cta-btn-action cta-btn-export" id="btnExportCsv" title="Download data dalam format Excel CSV">
            <i class="hgi-stroke hgi-download-04"></i>
            <span>Download CSV (Excel)</span>
          </button>
          <button type="button" class="cta-btn-action cta-btn-reset" id="btnResetStats" title="Reset data statistik">
            <i class="hgi-stroke hgi-refresh"></i>
            <span>Reset Data</span>
          </button>
        </div>
        <a href="/" class="cta-btn-action cta-btn-close-bottom" style="text-decoration:none;">
          <span>&larr; Kembali ke Beranda</span>
        </a>
      </div>

      <div id="ctaToastAlert" class="cta-toast-alert" style="display:none;">
        <i class="hgi-stroke hgi-checkmark-circle-01"></i>
        <span id="ctaToastText">Laporan berhasil disalin!</span>
      </div>
    </div>
  </main>
</div>
`;
      document.body.insertAdjacentHTML('afterbegin', fullPageHTML);
    } else {
      container.style.display = 'flex';
    }

    bindDashboardEvents();
    renderDashboardUI();
  }

  function openDashboard() {
    if (isStatistikRoute()) {
      mountFullPageStatsView();
      return;
    }
    try {
      history.pushState(null, '', '/statistik');
      mountFullPageStatsView();
      window.scrollTo(0, 0);
    } catch(err) {
      ensureDashboardDOM();
      renderDashboardUI();
      const overlay = document.getElementById('pesonaCtaModalOverlay');
      if (overlay) {
        overlay.style.display = 'flex';
        setTimeout(function() { overlay.classList.add('active'); }, 10);
      }
    }
  }

  function closeDashboard() {
    const overlay = document.getElementById('pesonaCtaModalOverlay');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(function() { overlay.style.display = 'none'; }, 300);
    }
  }

  window.openCtaDashboard = openDashboard;
  window.closeCtaDashboard = closeDashboard;

  // Global Keyboard Shortcut: Ctrl + Shift + S
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'S' || e.key === 's')) {
      e.preventDefault();
      openDashboard();
    } else if (e.key === 'Escape') {
      closeDashboard();
    }
  });

  // Handle browser Back / Forward navigation (PopState)
  window.addEventListener('popstate', function() {
    if (isStatistikRoute()) {
      mountFullPageStatsView();
    } else {
      window.location.reload();
    }
  });

  // Intercept click on footer stats button -> direct route /statistik
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('#btnOpenStatsDashboard, .footer-stats-btn');
    if (btn) {
      e.preventDefault();
      if (!isStatistikRoute()) {
        try {
          history.pushState(null, '', '/statistik');
          mountFullPageStatsView();
          window.scrollTo(0, 0);
        } catch(err) {
          window.location.href = '/statistik';
        }
      }
    }
  });

  // Check on initial page load if route is /statistik
  if (isStatistikRoute()) {
    mountFullPageStatsView();
  }
}


function bootPesonaLandingPage() {
  try { initLandingPage(); } catch (e) { console.error('initLandingPage error:', e); }
  try { initTampakRumahSubsidi(); } catch (e) { console.error('initTampakRumahSubsidi error:', e); }
  try { initLokasiProjects(); } catch (e) { console.error('initLokasiProjects error:', e); }
  try { initMitraMarquee(); } catch (e) { console.error('initMitraMarquee error:', e); }
  try { initFancyboxUI(); } catch (e) { console.error('initFancyboxUI error:', e); }
  try { initCtaAnalyticsTracker(); } catch (e) { console.error('initCtaAnalyticsTracker error:', e); }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootPesonaLandingPage);
} else {
  bootPesonaLandingPage();
}

