/*!
 * Pesona Kahuripan - Official Landing Page Interactive Script
 * Repository: https://github.com/pesonaku/landingpage
 */

function initLandingPage() {

      // ================= MASTER MARKETING SYNC ENGINE =================
      const masterData = document.getElementById('marketingMasterData');
      if (masterData) {
        const rawName = (masterData.getAttribute('data-name') || "Mas Ro'uf").trim();
        const rawPhone = (masterData.getAttribute('data-phone') || '6287870988073').trim();
        const rawPhoto = (masterData.getAttribute('data-photo') || '').trim();
        const rawRole = (masterData.getAttribute('data-role') || 'Konsultan KPR Resmi Pesona Kahuripan').trim();

        // Normalisasi nomor telepon: hapus spasi/simbol, ubah 08xx jadi 628xx
        let cleanPhone = rawPhone.replace(/[^0-9]/g, '');
        if (cleanPhone.startsWith('0')) {
          cleanPhone = '62' + cleanPhone.slice(1);
        }
        if (!cleanPhone) cleanPhone = '6287870988073';

        // 1. Sinkronkan Foto Profil Marketing di Seluruh Halaman (Termasuk Floating WA Header)
        if (rawPhoto) {
          document.querySelectorAll('.marketing-avatar-target').forEach(function(img) {
            img.src = rawPhoto;
            img.alt = rawName;
          });
        }

        // 2. Sinkronkan Nama Marketing di Seluruh Halaman
        document.querySelectorAll('.marketing-name-target').forEach(function(el) {
          el.innerText = rawName;
        });

        // 3. Sinkronkan Role / Jabatan Marketing
        document.querySelectorAll('.marketing-role-target').forEach(function(el) {
          el.innerText = rawRole;
        });

        // 4. Sinkronkan Quick Chips Floating WhatsApp
        document.querySelectorAll('.chat-chip').forEach(function(chip) {
          let msg = chip.getAttribute('data-msg') || '';
          msg = msg.replace(/Halo\s+[^,]+,/gi, 'Halo ' + rawName + ',');
          chip.setAttribute('data-msg', msg);
        });

        // 5. Sinkronkan SEMUA Tombol Direct WhatsApp di Seluruh Halaman
        document.querySelectorAll('a[href*="whatsapp.com"]').forEach(function(link) {
          let href = link.getAttribute('href');
          if (href) {
            // Update nomor telepon tujuan
            href = href.replace(/phone=[0-9]+/g, 'phone=' + cleanPhone);

            // Update sapaan nama di teks WhatsApp URL
            try {
              let urlObj = new URL(href);
              let textParam = urlObj.searchParams.get('text');
              if (textParam) {
                textParam = textParam.replace(/Halo\s+[^,]+,/gi, 'Halo ' + rawName + ',');
                urlObj.searchParams.set('text', textParam);
                href = urlObj.toString();
              }
            } catch (err) {
              href = href.replace(/Halo%20[^%]+%2C/gi, 'Halo%20' + encodeURIComponent(rawName) + '%2C');
            }
            link.setAttribute('href', href);
          }
        });

        // Simpan ke konfigurasi global untuk fungsi sendWhatsAppMessage
        window.MARKETING_CONFIG = {
          name: rawName,
          phone: cleanPhone,
          photo: rawPhoto
        };
      }

      // Inisialisasi parser Promo & Sinkronisasi WhatsApp
      if (typeof initPromoParser === 'function') {
        initPromoParser();
      }

      // Inisialisasi parser Footer & Sosial Media
      if (typeof initFooterParser === 'function') {
        initFooterParser();
      }

      // Inisialisasi parser Tipe Rumah & Detail Popup
      if (typeof initUnitCardAndPopupParser === 'function') {
        initUnitCardAndPopupParser();
      }

      // Inisialisasi Icon Spesifikasi Dinamis
      if (typeof initDynamicSpecIcons === 'function') {
        initDynamicSpecIcons();
      }

      // Inisialisasi parser harga bersih KPR
      if (typeof initPricingTextParser === 'function') {
        initPricingTextParser();
      }

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
      document.querySelectorAll('[target^="pop-"]').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          const popId = this.getAttribute('target');
          const source = document.getElementById(popId);
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

          document.body.appendChild(modal);
          document.body.style.overflow = 'hidden';

          const closeModal = function() {
            modal.classList.remove('open');
            setTimeout(() => { modal.remove(); document.body.style.overflow = ''; }, 200);
          };

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
      });

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

      // F. Smooth Scroll Reveal Effect via IntersectionObserver (Responsif & Anti-Macet)
      if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(function(entries, observer) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.05,
          rootMargin: '0px 0px 60px 0px'
        });

        document.querySelectorAll('.reveal').forEach(function(el) {
          revealObserver.observe(el);
        });
      } else {
        document.querySelectorAll('.reveal').forEach(function(el) {
          el.classList.add('revealed');
        });
      }

      // Safety Fallback: Pastikan seluruh section yang memiliki .reveal tetap terlihat jika observer terhambat
      setTimeout(function() {
        document.querySelectorAll('.reveal:not(.revealed)').forEach(function(el) {
          el.classList.add('revealed');
        });
      }, 1000);

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

    // KAMUS SVG ICON DINAMIS & MUDAH DIEDIT UNTUK TIPE RUMAH PILIHAN
    const SPEC_ICON_REGISTRY = {
      lb: '<svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 16H5v-6h7v6zm0-8H5V5h7v6zm7 8h-5v-6h5v6zm0-8h-5V5h5v6z"/></svg>',
      lt: '<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
      kamar: '<svg viewBox="0 0 24 24"><path d="M19 7h-8v8H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4zm-9 6H5v-4h5v4zM7 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>',
      mandi: '<svg viewBox="0 0 24 24"><path d="M20 13V4.83C20 3.27 18.73 2 17.17 2c-.75 0-1.47.3-2 .83l-1.25 1.25c-.16-.05-.33-.08-.51-.08-.88 0-1.6.72-1.6 1.6 0 .42.17.81.44 1.1l-1.44 1.44C10.53 8.05 10.19 8 9.83 8H6c-2.21 0-4 1.79-4 4v1h18zm-2 2H4v3c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4v-3z"/></svg>',
      carport: '<svg viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"/></svg>',
      hebel: '<svg viewBox="0 0 24 24"><path d="M19 4H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-9 2h4v3h-4V6zM5 6h3v3H5V6zm0 5h5v3H5v-3zm7 0h7v3h-7v-3zm7 5v2h-3v-2h3zm-5 2h-4v-2h4v2zm-6 0H5v-2h3v2zm11-7v-2h-3v-3h3v5z"/></svg>',
      dinding: '<svg viewBox="0 0 24 24"><path d="M19 4H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-9 2h4v3h-4V6zM5 6h3v3H5V6zm0 5h5v3H5v-3zm7 0h7v3h-7v-3zm7 5v2h-3v-2h3zm-5 2h-4v-2h4v2zm-6 0H5v-2h3v2zm11-7v-2h-3v-3h3v5z"/></svg>',
      taman: '<svg viewBox="0 0 24 24"><path d="M17 12c0-2.76-2.24-5-5-5s-5 2.24-5 5c0 2.05 1.23 3.81 3 4.58V20h4v-3.42c1.77-.77 3-2.53 3-4.58zm-5-3c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3z"/></svg>',
      hook: '<svg viewBox="0 0 24 24"><path d="M17 12c0-2.76-2.24-5-5-5s-5 2.24-5 5c0 2.05 1.23 3.81 3 4.58V20h4v-3.42c1.77-.77 3-2.53 3-4.58zm-5-3c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3z"/></svg>',
      listrik: '<svg viewBox="0 0 24 24"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>',
      air: '<svg viewBox="0 0 24 24"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
      shm: '<svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>'
    };

    // Helper: Inisialisasi Icon Spesifikasi Dinamis (Auto-Detect Kata Kunci / Atribut data-icon)
    function initDynamicSpecIcons() {
      document.querySelectorAll('.service-spec-item').forEach(function(item) {
        let iconKey = (item.getAttribute('data-icon') || '').toLowerCase().trim();
        const text = (item.textContent || '').toLowerCase();
        
        // Auto-detect jika belum dispesifikasikan secara eksplisit
        if (!iconKey) {
          if (text.includes('lb') || text.includes('bangunan')) iconKey = 'lb';
          else if (text.includes('lt') || text.includes('tanah')) iconKey = 'lt';
          else if (text.includes('kamar') || text.includes('tidur')) iconKey = 'kamar';
          else if (text.includes('mandi') || text.includes('wc')) iconKey = 'mandi';
          else if (text.includes('carport') || text.includes('garasi') || text.includes('mobil')) iconKey = 'carport';
          else if (text.includes('hebel') || text.includes('dinding') || text.includes('bata')) iconKey = 'hebel';
          else if (text.includes('taman') || text.includes('hook') || text.includes('sudut')) iconKey = 'taman';
          else if (text.includes('listrik') || text.includes('watt') || text.includes('pln')) iconKey = 'listrik';
          else if (text.includes('air') || text.includes('sumur') || text.includes('pdam')) iconKey = 'air';
          else if (text.includes('shm') || text.includes('sertifikat')) iconKey = 'shm';
        }

        if (iconKey && SPEC_ICON_REGISTRY[iconKey]) {
          const existingSvg = item.querySelector('svg');
          if (existingSvg) {
            existingSvg.outerHTML = SPEC_ICON_REGISTRY[iconKey];
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

      const lines = rawText.split('\n');
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
        } else if (!badge && !tag && !desc) {
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
                  <svg viewBox='0 0 24 24'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/></svg>
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
        const mConfig = window.MARKETING_CONFIG || { name: "Mas Ro'uf", phone: "6287870988073" };
        const mName = mConfig.name || "Mas Ro'uf";
        const mPhone = mConfig.phone || "6287870988073";
        const waText = `Halo ${mName}, saya ingin klaim ${promoTitle} Pesona Kahuripan.\n\nReferensi: https://www.pesonakahuripan.biz.id/#promo`;
        promoBtn.href = `https://api.whatsapp.com/send?phone=${mPhone}&text=${encodeURIComponent(waText)}`;
      }
    }

    // Helper: Parser Tipe Rumah (Kartu, Galeri Tampak & Detail Modal Popup) Full Edit Tanpa Kode
    function initUnitCardAndPopupParser() {
      // 1. PARSE & UPDATE KARTU DEPAN (TIPE RUMAH PILIHAN DENGAN BADGE TAGS)
      document.querySelectorAll('.service-card').forEach(function(card) {
        const rawCaptionEl = card.querySelector('.unit-raw-caption');
        if (!rawCaptionEl) return;
        const rawText = (rawCaptionEl.innerText || rawCaptionEl.textContent || '').trim();
        if (!rawText) return;

        let badge = '';
        let price = '';
        let priceLabel = '';
        let desc = '';
        let tags = [];
        let lb = '', lt = '', kamar = '', fitur = '';

        const lines = rawText.split('\n');
        lines.forEach(function(line) {
          const trimmed = line.trim();
          if (!trimmed) return;
          const lower = trimmed.toLowerCase();

          if (lower.startsWith('badge:')) {
            badge = trimmed.substring(trimmed.indexOf(':') + 1).trim();
          } else if (lower.startsWith('harga:')) {
            price = trimmed.substring(trimmed.indexOf(':') + 1).trim();
          } else if (lower.startsWith('cicilan:') || lower.startsWith('label:')) {
            priceLabel = trimmed.substring(trimmed.indexOf(':') + 1).trim();
          } else if (lower.startsWith('tags:') || lower.startsWith('tag:')) {
            const tagStr = trimmed.substring(trimmed.indexOf(':') + 1).trim();
            const sep = tagStr.includes('|') ? '|' : ',';
            tags = tagStr.split(sep).map(function(t) { return t.trim(); }).filter(Boolean);
          } else if (lower.startsWith('lb:')) {
            lb = trimmed.substring(trimmed.indexOf(':') + 1).trim();
          } else if (lower.startsWith('lt:')) {
            lt = trimmed.substring(trimmed.indexOf(':') + 1).trim();
          } else if (lower.startsWith('kamar:')) {
            kamar = trimmed.substring(trimmed.indexOf(':') + 1).trim();
          } else if (lower.startsWith('fitur:') || lower.startsWith('spesial:')) {
            fitur = trimmed.substring(trimmed.indexOf(':') + 1).trim();
          } else if (lower.startsWith('deskripsi:') || lower.startsWith('keterangan:')) {
            desc = trimmed.substring(trimmed.indexOf(':') + 1).trim();
          } else if (!badge && !price && !desc && !trimmed.startsWith('[')) {
            desc = (desc ? desc + ' ' : '') + trimmed;
          }
        });

        // Jika tags belum diisi langsung lewat Tags:, kumpulkan dari LB, LT, Kamar, Fitur
        if (tags.length === 0) {
          if (lb) tags.push('LB: ' + lb);
          if (lt) tags.push('LT: ' + lt);
          if (kamar) tags.push(kamar.toLowerCase().includes('kamar') ? kamar : (kamar + ' Kamar'));
          if (fitur) tags.push(fitur);
        }

        // Update Elemen Kartu Depan
        if (badge) {
          const badgeEl = card.querySelector('.service-badge');
          if (badgeEl) badgeEl.textContent = badge;
        }
        if (price) {
          const priceValEl = card.querySelector('.service-price-tag strong');
          if (priceValEl) priceValEl.textContent = price;
        }
        if (priceLabel) {
          const priceLabelEl = card.querySelector('.service-price-tag small');
          if (priceLabelEl) priceLabelEl.textContent = priceLabel;
        }
        if (desc) {
          const cardDescEl = card.querySelector('.unit-desc-text') || card.querySelector('.service-card-content > p');
          if (cardDescEl) cardDescEl.textContent = desc;
        }

        // Render Badge Tags (Pill / Label Modern Tanpa Icon)
        if (tags.length > 0) {
          let tagsList = card.querySelector('.service-tags-list');
          if (!tagsList) {
            const oldSpecGrid = card.querySelector('.service-spec-grid');
            if (oldSpecGrid) {
              tagsList = document.createElement('div');
              tagsList.className = 'service-tags-list';
              oldSpecGrid.parentNode.replaceChild(tagsList, oldSpecGrid);
            }
          }
          if (tagsList) {
            let tagsHtml = '';
            tags.forEach(function(t) {
              tagsHtml += '<span class="service-tag">' + t + '</span>';
            });
            tagsList.innerHTML = tagsHtml;
          }
        }
      });

      // 2. PARSE & SINKRONKAN WIDGET DETAIL TERPISAH (POPUP GALERI & SPESIFIKASI)
      document.querySelectorAll('.unit-detail-source').forEach(function(detailSource) {
        const rawDetailEl = detailSource.querySelector('.unit-raw-detail-content');
        if (!rawDetailEl) return;
        const rawContent = (rawDetailEl.innerText || rawDetailEl.textContent || '').trim();
        if (!rawContent) return;

        const unitId = detailSource.getAttribute('data-unit-id') || '';
        // Cari kartu depan terkait
        const matchingCard = unitId ? document.querySelector(`.service-card[data-id="${unitId}"]`) : null;
        const unitTitle = matchingCard ? (matchingCard.querySelector('h3') ? matchingCard.querySelector('h3').textContent.trim() : '') : '';

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

        // Sinkronisasi Direct WhatsApp Button di Modal
        const ctaBtn = detailSource.querySelector('a.btn-cta');
        if (ctaBtn) {
          const mConfig = window.MARKETING_CONFIG || { name: "Mas Ro'uf", phone: "6287870988073" };
          const mName = mConfig.name || "Mas Ro'uf";
          const mPhone = mConfig.phone || "6287870988073";
          const finalTitle = unitTitle || 'Tipe Rumah';
          const waText = `Halo ${mName}, saya tertarik konsultasi Unit ${finalTitle} Pesona Kahuripan.\n\nReferensi: https://www.pesonakahuripan.biz.id/#service`;
          ctaBtn.href = `https://api.whatsapp.com/send?phone=${mPhone}&text=${encodeURIComponent(waText)}`;
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
      if (socmed.fb) {
        let fbLink = footerWrap.querySelector('.socmed-fb');
        if (!fbLink) {
          const container = footerWrap.querySelector('.footer-socmed');
          if (container) {
            fbLink = document.createElement('a');
            fbLink.className = 'socmed-fb';
            fbLink.target = '_blank';
            fbLink.rel = 'noopener';
            fbLink.innerHTML = `<svg viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg><span>Facebook</span>`;
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
            parentWidget.style.display = isActive ? 'block' : 'none';
          }
        });
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
        const fullMsg = `Halo ${marketingName}, saya tertarik KPR Subsidi Type 30/60 Pesona Kahuripan dengan Tenor ${tenorYrs} Tahun (${installmentStr}/bln).\n\n` +
          `Mohon informasi ketersediaan unit dan kelengkapan berkas KPR-nya. Terima kasih!\n\n` +
          `🌐 Referensi: https://www.pesonakahuripan.biz.id/#offer`;
        ctaBtn.href = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(fullMsg)}`;
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

      renderEl.innerHTML = `
        <div class="kpr-panel-header">
          <div class="kpr-panel-badge-row">
            <span class="kpr-status-badge badge-comm-header">SIMULASI ANGSURAN KOMERSIAL</span>
            <span class="kpr-popular-badge badge-comm-sub">DESAIN MODERN MINIMALIS</span>
          </div>
          <h3>Kalkulator Simulasi KPR Komersial</h3>
          <p class="kpr-panel-sub">Sesuaikan tipe rumah, uang muka (DP), tenor pinjaman, dan suku bunga bank rekanan untuk menghitung estimasi angsuran bulanan Anda.</p>
        </div>

        <div class="kpr-calc-layout">
          <div class="kpr-calc-inputs">
            <!-- Pilihan Tipe Rumah -->
            <div class="calc-field">
              <label for="commUnitSelect"><strong>Pilih Tipe Rumah Komersil:</strong></label>
              <select class="calc-select" id="commUnitSelect">
                <option value="435000000" selected="selected">Pesona Kahuripan Type 36/60 — Rp 435.000.000</option>
                <option value="495000000">Pesona Kahuripan Type 40/72 — Rp 495.000.000</option>
                <option value="custom">Input Harga Kustom Sendiri</option>
              </select>
            </div>

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
                <svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
                <span>Konsultasikan Simulasi Ini via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      `;

      const unitSelect = renderEl.querySelector('#commUnitSelect');
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

        if (resultInstallment) resultInstallment.textContent = fmtRupiah(installment);
        if (resultPlafon) resultPlafon.textContent = fmtRupiah(plafon);
        if (resultDp) resultDp.textContent = fmtRupiah(currentDpNominal);
        if (resultMinIncome) resultMinIncome.textContent = fmtRupiah(minIncome) + ' / bln';

        const unitText = unitSelect && unitSelect.value !== 'custom' ? unitSelect.options[unitSelect.selectedIndex].text.split('—')[0].trim() : 'Unit Komersial';
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

      if (unitSelect) {
        unitSelect.addEventListener('change', function() {
          if (this.value !== 'custom') {
            const val = parseInt(this.value, 10);
            priceInput.value = fmtDots(val);
            currentPrice = val;
            currentDpNominal = Math.round(currentPrice * (currentDpPercent / 100));
            dpNominalInput.value = fmtDots(currentDpNominal);
          }
          updateCalculation();
        });
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
