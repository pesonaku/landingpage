/*!
 * Pesona Kahuripan - Official Landing Page Interactive Script
 * Repository: https://github.com/pesonaku/landingpage
 */

document.addEventListener('DOMContentLoaded', function() {

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

    });

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

    // Helper: Smart Parser Simulasi Angsuran KPR dari Widget Text Murni & Kalkulator Komersial
    function initPricingTextParser() {
      document.querySelectorAll('.pricing-card').forEach(function(card) {
        const rawDataEl = card.querySelector('.pricing-raw-data');
        const renderEl = card.querySelector('.pricing-card-render');
        if (!rawDataEl || !renderEl) return;

        const rawText = (rawDataEl.innerText || rawDataEl.textContent || '').trim();
        if (!rawText) return;

        const lines = rawText.split('\n');
        let badge = 'PROGRAM SUBSIDI FLPP';
        let title = card.getAttribute('data-title') || 'Type Rumah';
        let price = 'Rp. 185.000.000,-';
        let desc = 'Double Dinding Hebel • Suku Bunga Flat 5% Tetap Sampai Lunas';
        let tenors = [];
        let isKomersial = false;

        lines.forEach(function(line) {
          const trimmed = line.trim();
          if (!trimmed) return;
          const lower = trimmed.toLowerCase();
          if (lower.startsWith('badge:')) {
            badge = trimmed.split(':')[1].trim();
          } else if (lower.startsWith('harga:')) {
            price = trimmed.substring(trimmed.indexOf(':') + 1).trim();
          } else if (lower.startsWith('deskripsi:') || lower.startsWith('keterangan:')) {
            desc = trimmed.substring(trimmed.indexOf(':') + 1).trim();
          } else if (lower.startsWith('tenor')) {
            const parts = trimmed.split(':');
            if (parts.length >= 2) {
              tenors.push({ label: parts[0].trim(), val: parts.slice(1).join(':').trim() });
            }
          } else if (lower.startsWith('tipe:')) {
            if (lower.includes('komersial') || lower.includes('komersil')) isKomersial = true;
          }
        });

        // Jika tipe komersial, inisialisasi kalkulator simulasi KPR interaktif
        if (isKomersial || card.classList.contains('commercial-calculator-card')) {
          initCommercialKprCalculator(card, renderEl, { badge: badge, title: title, defaultPrice: price, desc: desc });
          return;
        }

        if (tenors.length === 0) return; // Gunakan default jika format tidak cocok

        let listHtml = '';
        tenors.forEach(function(t, idx) {
          const isFav = idx === 0 ? ' <span style="font-size:10px; background:var(--key); color:#fff; padding:2px 8px; border-radius:100px; margin-left:6px; font-weight:700;">TERPOPULER</span>' : '';
          listHtml += `<li><span>${t.label}:</span> <strong>${t.val}${isFav}</strong></li>`;
        });

        const marketingPhone = (window.MARKETING_CONFIG && window.MARKETING_CONFIG.phone) || '6287870988073';
        const marketingName = (window.MARKETING_CONFIG && window.MARKETING_CONFIG.name) || "Mas Ro'uf";
        const unitName = 'Subsidi Type 30/60';

        renderEl.innerHTML = `
          <div class="pricing-badge-wrap">
            <span class="pricing-card-badge badge-subsidi">
              <svg style="width:14px; height:14px; fill:currentColor;" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              ${badge}
            </span>
          </div>
          <h3 class="pricing-card-title">${title}</h3>
          <p class="pricing-card-desc">${desc}</p>
          
          <div class="pricing-card-price-wrap">
            <div class="pricing-card-price-label">Harga Patokan Resmi Pemerintah</div>
            <div class="pricing-card-price-val">${price}</div>
          </div>

          <ul class="pricing-list">
            ${listHtml}
          </ul>

          <ul class="pricing-features-list">
            <li>
              <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              <span>Suku Bunga Flat 5% (Tidak Naik s/d Lunas)</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              <span>Uang Muka (DP) Ringan Cukup 1%</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              <span>Bantuan Subsidi Uang Muka (SBUM) &amp; Bebas PPN</span>
            </li>
          </ul>

          <a class="btn-cta-kpr subsidi-btn wa-dynamic-btn" href="https://api.whatsapp.com/send?phone=${marketingPhone}&text=Halo%20${encodeURIComponent(marketingName)}%2C%20saya%20mau%20booking%20${encodeURIComponent(unitName)}%20Pesona%20Kahuripan.%0A%0AReferensi%3A%20https%3A%2F%2Fwww.pesonakahuripan.biz.id%2F%23offer" target="_blank">
            <svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
            <span>Booking Subsidi via WhatsApp</span>
          </a>
        `;
      });
    }

    // Kalkulator Simulasi KPR Komersil Interaktif
    function initCommercialKprCalculator(card, renderEl, config) {
      if (!card) return;

      function fmtRupiah(val) { return 'Rp ' + Number(val || 0).toLocaleString('id-ID'); }
      function fmtDots(val) { const n = String(val).replace(/[^0-9]/g, ''); return n ? Number(n).toLocaleString('id-ID') : ''; }
      function parseDots(str) { const n = String(str || '').replace(/[^0-9]/g, ''); return parseInt(n, 10) || 0; }
      function calcInstallment(plafon, annualRate, tenorYrs) {
        if (plafon <= 0) return 0;
        const n = tenorYrs * 12;
        if (!annualRate || annualRate <= 0) return Math.round(plafon / n);
        const r = (annualRate / 100) / 12;
        const factor = Math.pow(1 + r, n);
        return Math.round(plafon * (r * factor) / (factor - 1));
      }

      let typeSelect = card.querySelector('#kpr-type-select');
      if (!typeSelect && renderEl) {
        const badgeText = (config && config.badge) || 'KALKULATOR KPR KOMERSIL';
        const cardTitle = (config && config.title) || 'Simulasi KPR Komersil';
        const cardDesc = (config && config.desc) || 'Sesuaikan tipe unit, uang muka (DP), dan tenor pinjaman untuk melihat estimasi cicilan per bulan.';

        renderEl.innerHTML = `
          <div class="pricing-badge-wrap">
            <span class="pricing-card-badge badge-komersil">
              <svg style="width:14px; height:14px; fill:currentColor;" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
              ${badgeText}
            </span>
          </div>
          <h3 class="pricing-card-title">${cardTitle}</h3>
          <p class="pricing-card-desc">${cardDesc}</p>

          <div class="kpr-calc-body">
            <div class="kpr-field">
              <div class="kpr-field-head">
                <label class="kpr-field-label" for="kpr-type-select">Pilih Tipe Rumah Komersil</label>
              </div>
              <select class="kpr-select" id="kpr-type-select">
                <option value="435000000" data-name="Type 36/60 Minimalis" selected="selected">Type 36/60 - Minimalis Modern (Rp 435 Jt)</option>
                <option value="485000000" data-name="Type 42/60 Modern">Type 42/60 - Standar Komersial (Rp 485 Jt)</option>
                <option value="550000000" data-name="Type 50/78 Hook Premium">Type 50/78 - Hook Premium (Rp 550 Jt)</option>
                <option value="custom" data-name="Custom / Tipe Lainnya">Custom / Input Harga Sendiri</option>
              </select>
            </div>

            <div class="kpr-field">
              <div class="kpr-field-head">
                <label class="kpr-field-label" for="kpr-price-input">Harga Properti</label>
                <span class="kpr-field-val-hint" id="kpr-type-tag">Type 36/60</span>
              </div>
              <div class="kpr-input-wrap">
                <span class="kpr-input-prefix">Rp</span>
                <input class="kpr-input" id="kpr-price-input" type="text" value="435.000.000"/>
              </div>
            </div>

            <div class="kpr-field">
              <div class="kpr-field-head">
                <label class="kpr-field-label">Uang Muka (DP)</label>
                <span class="kpr-field-val-hint" id="kpr-dp-display">Rp 43.500.000 (10%)</span>
              </div>
              <div class="kpr-pills-grid" id="kpr-dp-pills">
                <button class="kpr-pill-btn" data-dp="0" type="button">DP 0%</button>
                <button class="kpr-pill-btn" data-dp="5" type="button">5%</button>
                <button class="kpr-pill-btn active" data-dp="10" type="button">10%</button>
                <button class="kpr-pill-btn" data-dp="20" type="button">20%</button>
              </div>
            </div>

            <div class="kpr-field">
              <div class="kpr-field-head">
                <label class="kpr-field-label">Jangka Waktu (Tenor)</label>
                <span class="kpr-field-val-hint" id="kpr-tenor-hint">20 Tahun</span>
              </div>
              <div class="kpr-pills-grid" id="kpr-tenor-pills">
                <button class="kpr-pill-btn" data-tenor="10" type="button">10 Thn</button>
                <button class="kpr-pill-btn" data-tenor="15" type="button">15 Thn</button>
                <button class="kpr-pill-btn active" data-tenor="20" type="button">20 Thn</button>
                <button class="kpr-pill-btn" data-tenor="25" type="button">25 Thn</button>
              </div>
            </div>

            <div class="kpr-rate-row">
              <div class="kpr-rate-info">
                <span class="kpr-rate-title">Suku Bunga KPR / Tahun</span>
                <span class="kpr-rate-desc">Promo Bank Rekanan (BTN/BSI/Mandiri)</span>
              </div>
              <div class="kpr-rate-input-wrap">
                <input class="kpr-rate-input" id="kpr-rate-input" max="15" min="1" step="0.1" type="number" value="5.5"/>
                <span class="kpr-rate-suffix">%</span>
              </div>
            </div>

            <div class="kpr-result-card">
              <div class="kpr-result-header">ESTIMASI ANGSURAN PER BULAN</div>
              <div class="kpr-result-amount">
                <span id="kpr-monthly-val">Rp 2.693.000</span>
                <small>/ bln*</small>
              </div>
              <div class="kpr-result-details">
                <span>Plafon: <strong id="kpr-plafon-val">Rp 391.500.000</strong></span>
                <span>Tenor: <strong id="kpr-tenor-val">20 Tahun</strong></span>
                <span>Bunga: <strong id="kpr-rate-val">5.5% p.a.</strong></span>
              </div>
            </div>

            <div class="kpr-matrix-section">
              <div class="kpr-matrix-title">Pilihan Tenor Lainnya:</div>
              <div class="kpr-matrix-grid" id="kpr-matrix-grid">
                <div class="kpr-matrix-item" data-tenor="10">
                  <span class="kpr-m-tenor">10 Tahun</span>
                  <span class="kpr-m-val" id="kpr-m-10">Rp 4.249.000</span>
                </div>
                <div class="kpr-matrix-item" data-tenor="15">
                  <span class="kpr-m-tenor">15 Tahun</span>
                  <span class="kpr-m-val" id="kpr-m-15">Rp 3.199.000</span>
                </div>
                <div class="kpr-matrix-item active" data-tenor="20">
                  <span class="kpr-m-tenor">20 Tahun</span>
                  <span class="kpr-m-val" id="kpr-m-20">Rp 2.693.000</span>
                </div>
                <div class="kpr-matrix-item" data-tenor="25">
                  <span class="kpr-m-tenor">25 Tahun</span>
                  <span class="kpr-m-val" id="kpr-m-25">Rp 2.404.000</span>
                </div>
              </div>
            </div>

            <a class="btn-cta-kpr komersil-btn wa-dynamic-btn" id="kpr-wa-cta-btn" href="https://api.whatsapp.com/send?phone=6287870988073&text=Halo%20Mas%20Ro%27uf%2C%20saya%20tertarik%20simulasi%20KPR%20Komersial%20Pesona%20Kahuripan" target="_blank">
              <svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
              <span>Konsultasi Simulasi KPR Ini via WhatsApp</span>
            </a>
          </div>
        `;
        typeSelect = card.querySelector('#kpr-type-select');
      }

      const priceInput = card.querySelector('#kpr-price-input');
      const typeTag = card.querySelector('#kpr-type-tag');
      const dpDisplay = card.querySelector('#kpr-dp-display');
      const dpPills = card.querySelectorAll('#kpr-dp-pills .kpr-pill-btn');
      const tenorPills = card.querySelectorAll('#kpr-tenor-pills .kpr-pill-btn');
      const tenorHint = card.querySelector('#kpr-tenor-hint');
      const rateInput = card.querySelector('#kpr-rate-input');
      const monthlyVal = card.querySelector('#kpr-monthly-val');
      const plafonVal = card.querySelector('#kpr-plafon-val');
      const tenorVal = card.querySelector('#kpr-tenor-val');
      const rateVal = card.querySelector('#kpr-rate-val');
      const matrixItems = card.querySelectorAll('#kpr-matrix-grid .kpr-matrix-item');
      const waBtn = card.querySelector('#kpr-wa-cta-btn');

      let currentDp = 10;
      let currentTenor = 20;
      let currentRate = 5.5;

      if (rateInput && rateInput.value) {
        currentRate = parseFloat(rateInput.value) || 5.5;
      }

      function updateCalculation() {
        const rawPrice = parseDots(priceInput ? priceInput.value : '435000000');
        const dpNominal = Math.round(rawPrice * (currentDp / 100));
        const plafon = Math.max(0, rawPrice - dpNominal);

        if (dpDisplay) {
          dpDisplay.textContent = fmtRupiah(dpNominal) + ' (' + currentDp + '%)';
        }

        if (typeTag && typeSelect) {
          const opt = typeSelect.options[typeSelect.selectedIndex];
          const optName = opt ? (opt.getAttribute('data-name') || opt.text) : 'Komersial';
          typeTag.textContent = optName.split('-')[0].trim();
        }

        const monthlyInstallment = calcInstallment(plafon, currentRate, currentTenor);

        if (monthlyVal) {
          monthlyVal.textContent = fmtRupiah(monthlyInstallment);
        }
        if (plafonVal) plafonVal.textContent = fmtRupiah(plafon);
        if (tenorVal) tenorVal.textContent = currentTenor + ' Tahun (' + (currentTenor * 12) + ' Bulan)';
        if (rateVal) rateVal.textContent = currentRate.toFixed(1) + '% p.a.';
        if (tenorHint) tenorHint.textContent = currentTenor + ' Tahun';

        [10, 15, 20, 25].forEach(function(t) {
          const mVal = calcInstallment(plafon, currentRate, t);
          const mEl = card.querySelector('#kpr-m-' + t);
          if (mEl) mEl.textContent = fmtRupiah(mVal);

          const mItem = card.querySelector('.kpr-matrix-item[data-tenor="' + t + '"]');
          if (mItem) {
            if (t === currentTenor) {
              mItem.classList.add('active');
            } else {
              mItem.classList.remove('active');
            }
          }
        });

        if (waBtn) {
          const marketingPhone = (window.MARKETING_CONFIG && window.MARKETING_CONFIG.phone) || '6287870988073';
          const marketingName = (window.MARKETING_CONFIG && window.MARKETING_CONFIG.name) || "Mas Ro'uf";
          const opt = typeSelect ? typeSelect.options[typeSelect.selectedIndex] : null;
          const unitName = opt ? (opt.getAttribute('data-name') || opt.text) : 'Unit Komersial';

          const waMsg = 'Halo ' + marketingName + ', saya ingin konsultasi simulasi KPR Komersil Pesona Kahuripan:\n' +
            '• Tipe Unit: ' + unitName + '\n' +
            '• Harga Rumah: ' + fmtRupiah(rawPrice) + '\n' +
            '• Uang Muka (DP): ' + fmtRupiah(dpNominal) + ' (' + currentDp + '%)\n' +
            '• Plafon KPR: ' + fmtRupiah(plafon) + '\n' +
            '• Tenor KPR: ' + currentTenor + ' Tahun (' + (currentTenor * 12) + ' Bulan)\n' +
            '• Suku Bunga: ' + currentRate.toFixed(1) + '% / tahun (Estimasi Bank)\n' +
            '• Estimasi Cicilan: ' + fmtRupiah(monthlyInstallment) + ' / bulan\n\n' +
            'Mohon info ketersediaan unit, promo perbankan, dan jadwal survei lokasi. Terima kasih.\n' +
            'Referensi: https://www.pesonakahuripan.biz.id/#offer';

          waBtn.href = 'https://api.whatsapp.com/send?phone=' + marketingPhone + '&text=' + encodeURIComponent(waMsg);
        }
      }

      if (typeSelect) {
        typeSelect.addEventListener('change', function() {
          const val = typeSelect.value;
          if (val !== 'custom') {
            const num = parseInt(val, 10);
            if (priceInput) priceInput.value = fmtDots(num);
          } else {
            if (priceInput) priceInput.focus();
          }
          updateCalculation();
        });
      }

      if (priceInput) {
        priceInput.addEventListener('input', function() {
          const parsed = parseDots(priceInput.value);
          priceInput.value = fmtDots(parsed);

          if (typeSelect) {
            let matched = false;
            for (let i = 0; i < typeSelect.options.length; i++) {
              if (parseInt(typeSelect.options[i].value, 10) === parsed) {
                typeSelect.selectedIndex = i;
                matched = true;
                break;
              }
            }
            if (!matched) {
              typeSelect.value = 'custom';
            }
          }
          updateCalculation();
        });
      }

      dpPills.forEach(function(btn) {
        btn.addEventListener('click', function() {
          dpPills.forEach(function(b) { b.classList.remove('active'); });
          btn.classList.add('active');
          currentDp = parseInt(btn.getAttribute('data-dp'), 10) || 0;
          updateCalculation();
        });
      });

      tenorPills.forEach(function(btn) {
        btn.addEventListener('click', function() {
          tenorPills.forEach(function(b) { b.classList.remove('active'); });
          btn.classList.add('active');
          currentTenor = parseInt(btn.getAttribute('data-tenor'), 10) || 20;
          updateCalculation();
        });
      });

      if (rateInput) {
        rateInput.addEventListener('input', function() {
          currentRate = parseFloat(rateInput.value) || 0;
          updateCalculation();
        });
      }

      matrixItems.forEach(function(item) {
        item.addEventListener('click', function() {
          const t = parseInt(item.getAttribute('data-tenor'), 10);
          if (t) {
            currentTenor = t;
            tenorPills.forEach(function(btn) {
              if (parseInt(btn.getAttribute('data-tenor'), 10) === t) {
                btn.classList.add('active');
              } else {
                btn.classList.remove('active');
              }
            });
            updateCalculation();
          }
        });
      });

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
