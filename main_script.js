/*!
 * Pesona Kahuripan - Official Landing Page Interactive Script
 * Version: 3.5.4 (Production Interactive Bundle - Unified Marketing Sync & Robust Promo Parser)
 * Repository: https://github.com/pesonaku/landingpage
 */

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

    // 7. Sinkronkan SEMUA Tombol Direct WhatsApp di Seluruh Halaman
    document.querySelectorAll('a[href*="whatsapp.com"], a[href*="wa.me"], a.wa-dynamic-btn').forEach(function(link) {
      let href = link.getAttribute('href');
      if (href) {
        // Normalisasi & Update nomor telepon tujuan
        href = href.replace(/phone=[0-9]+/g, 'phone=' + cfg.phone);
        href = href.replace(/wa\.me\/[0-9]+/g, 'wa.me/' + cfg.phone);

        // Update sapaan nama di teks WhatsApp URL
        try {
          let urlObj = new URL(href);
          let textParam = urlObj.searchParams.get('text');
          if (textParam) {
            textParam = textParam.replace(/Halo\s+(Mas\s+)?(Ro['&#39;]*uf|[^,]+),/gi, 'Halo ' + cfg.name + ',');
            urlObj.searchParams.set('text', textParam);
            href = urlObj.toString();
          }
        } catch (err) {
          href = href.replace(/Halo(%20|\s+)(Mas(%20|\s+))?(Ro['&#39;%27]*uf|[^,%]+)(%2C|,)/gi, 'Halo%20' + encodeURIComponent(cfg.name) + '%2C');
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

      // E. Native Modal Popup Engine (Trigger: [target^="pop-"])
      document.addEventListener('click', function(e) {
        const btn = e.target.closest('[target^="pop-"]');
        if (!btn) return;
        e.preventDefault();

        const popId = btn.getAttribute('target') || '';
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
          const waText = `Halo ${cfg.name}, saya tertarik konsultasi Unit ${unitName} Pesona Kahuripan.\n\nReferensi: https://www.pesonakahuripan.biz.id/#service`;
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
        const waText = `Halo ${cfg.name}, saya ingin klaim ${promoTitle} Pesona Kahuripan.\n\nReferensi: https://www.pesonakahuripan.biz.id/#promo`;
        promoBtn.href = `https://api.whatsapp.com/send?phone=${cfg.phone}&text=${encodeURIComponent(waText)}`;
      }
    }

    // Helper: Parser Tipe Rumah (Kartu, Galeri Tampak & Detail Modal Popup) Full Edit Tanpa Kode
    function initUnitCardAndPopupParser() {
      // 1. PARSE & UPDATE KARTU DEPAN (TIPE RUMAH PILIHAN: 6 INFORMASI RESMI)
      document.querySelectorAll('.service-card').forEach(function(card) {
        const rawCaptionEl = card.querySelector('.unit-raw-caption');
        if (rawCaptionEl) {
          const rawText = (rawCaptionEl.textContent || rawCaptionEl.innerText || '').trim();
          if (rawText) {
            let badge = '';
            let price = '';
            let installment = '';
            let lb = '', lt = '', tamu = '', tidur = '', mandi = '', carport = '';

            let desc = '';
            const lines = rawText.split('\n');
            lines.forEach(function(line) {
              const trimmed = line.trim();
              if (!trimmed) return;
              const lower = trimmed.toLowerCase();

              if (lower.startsWith('badge:')) {
                badge = trimmed.substring(trimmed.indexOf(':') + 1).trim();
              } else if (lower.startsWith('harga:')) {
                price = trimmed.substring(trimmed.indexOf(':') + 1).trim();
              } else if (lower.startsWith('cicilan:') || lower.startsWith('angsuran:') || lower.startsWith('label:')) {
                installment = trimmed.substring(trimmed.indexOf(':') + 1).trim();
              } else if (lower.startsWith('deskripsi:') || lower.startsWith('desc:')) {
                desc = trimmed.substring(trimmed.indexOf(':') + 1).trim();
              } else if (lower.startsWith('lb:') || lower.startsWith('bangunan:')) {
                lb = trimmed.substring(trimmed.indexOf(':') + 1).trim();
              } else if (lower.startsWith('lt:') || lower.startsWith('tanah:')) {
                lt = trimmed.substring(trimmed.indexOf(':') + 1).trim();
              } else if (lower.startsWith('ruang tamu:') || lower.startsWith('tamu:')) {
                tamu = trimmed.substring(trimmed.indexOf(':') + 1).trim();
              } else if (lower.startsWith('kamar tidur:') || lower.startsWith('tidur:') || lower.startsWith('kamar:')) {
                tidur = trimmed.substring(trimmed.indexOf(':') + 1).trim();
              } else if (lower.startsWith('kamar mandi:') || lower.startsWith('mandi:') || lower.startsWith('toilet:')) {
                mandi = trimmed.substring(trimmed.indexOf(':') + 1).trim();
              } else if (lower.startsWith('carport:') || lower.startsWith('garasi:')) {
                carport = trimmed.substring(trimmed.indexOf(':') + 1).trim();
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
              if (lbEl) lbEl.textContent = lb;
            }
            if (lt) {
              const ltEl = card.querySelector('.spec-lt strong');
              if (ltEl) ltEl.textContent = lt;
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
          }
        }

        // Sinkronisasi WhatsApp Button pada Kartu Depan
        const cardTitle = (card.querySelector('h3') ? card.querySelector('h3').textContent.trim() : '') || 'Tipe Rumah';
        const cardWaBtn = card.querySelector('.btn-service-consult') || card.querySelector('.btn-service-wa');
        if (cardWaBtn) {
          const cfg = (typeof getMarketingConfig === 'function') ? getMarketingConfig() : (window.MARKETING_CONFIG || { name: "Mas Ro'uf", phone: "6287870988073" });
          const cardWaText = `Halo ${cfg.name}, saya tertarik konsultasi Unit ${cardTitle} Pesona Kahuripan.\n\nReferensi: https://www.pesonakahuripan.biz.id/#service`;
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

      // 2. PARSE & SINKRONKAN WIDGET DETAIL (POPUP GALERI & SPESIFIKASI)
      document.querySelectorAll('.unit-detail-source').forEach(function(detailSource) {
        const unitId = detailSource.getAttribute('data-unit-id') || '';
        // Cari kartu depan terkait
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
          const waText = `Halo ${cfg.name}, saya tertarik konsultasi Unit ${finalTitle} Pesona Kahuripan.\n\nReferensi: https://www.pesonakahuripan.biz.id/#service`;
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
          `🌐 Referensi: https://www.pesonakahuripan.biz.id/#offer`;
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
          `🌐 *Referensi Website:* https://www.pesonakahuripan.biz.id/#offer\n\n` +
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
// F. Dispatch Pesan ke WhatsApp API (Dinamis dari Master Marketing & Site Link Referensi)
    function sendWhatsAppMessage(event) {
      event.preventDefault();
      const name = document.getElementById('wa-name').value.trim();
      const phoneUser = document.getElementById('wa-phone-user').value.trim();
      const message = document.getElementById('wa-message').value.trim();

      // Ambil nama dan nomor dari Master Marketing Config jika ada
      const mConfig = window.MARKETING_CONFIG || { name: "Mas Ro'uf", phone: "6287870988073" };
      const marketingName = mConfig.name || "Mas Ro'uf";
      const phone = mConfig.phone || "6287870988073";

      if (!name || !phoneUser || !message) return;

      const fullText = `Halo ${marketingName}, saya ingin bertanya perihal perumahan Pesona Kahuripan.\n\n` +
        `👤 *Nama:* ${name}\n` +
        `📱 *No. WhatsApp:* ${phoneUser}\n` +
        `💬 *Pertanyaan:* ${message}\n\n` +
        `🌐 *Referensi Website:* https://www.pesonakahuripan.biz.id\n\n` +
        `Mohon informasi dan tindak lanjutnya. Terima kasih!`;

      window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(fullText)}`, '_blank');

      document.getElementById('wa-name').value = '';
      document.getElementById('wa-phone-user').value = '';
      document.getElementById('wa-message').value = '';
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
    const waText = encodeURIComponent(`Halo ${cfg.name}, saya tertarik survey langsung Unit Rumah Subsidi Pemerintah Pesona Kahuripan.\n\nBisa info jadwal survey lokasi terdekat?\n\nReferensi: https://www.pesonakahuripan.biz.id/#tampak-rumah`);
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
      const waText = encodeURIComponent("Halo " + mName + ", saya tertarik informasi unit & jadwal survey lokasi di " + pName + " (" + rName + "). Bisa dibantu jadwal surveinya?");
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


function bootPesonaLandingPage() {
  try { initLandingPage(); } catch (e) { console.error('initLandingPage error:', e); }
  try { initTampakRumahSubsidi(); } catch (e) { console.error('initTampakRumahSubsidi error:', e); }
  try { initLokasiProjects(); } catch (e) { console.error('initLokasiProjects error:', e); }
  try { initMitraMarquee(); } catch (e) { console.error('initMitraMarquee error:', e); }
  try { initFancyboxUI(); } catch (e) { console.error('initFancyboxUI error:', e); }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootPesonaLandingPage);
} else {
  bootPesonaLandingPage();
}
