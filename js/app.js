// =====================================================
// Resize-san - Main Application JavaScript
// =====================================================

(function() {
    'use strict';

    // =====================================================
    // Utility Functions
    // =====================================================

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }

    function generateId() {
        return 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // =====================================================
    // Toast Notifications
    // =====================================================

    const toastContainer = document.getElementById('toastContainer');

    function showToast(message, type = 'info', duration = 4000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
            <span class="toast-message">${message}</span>
        `;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // =====================================================
    // Theme Toggle
    // =====================================================

    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');

    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    }

    themeToggle.addEventListener('click', toggleTheme);
    initTheme();

    // =====================================================
    // Header Scroll Effect
    // =====================================================

    const header = document.getElementById('header');

    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // =====================================================
    // Back to Top Button
    // =====================================================

    const backToTop = document.getElementById('backToTop');

    function handleBackToTopScroll() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', handleBackToTopScroll, { passive: true });

    // =====================================================
    // Mobile Navigation
    // =====================================================

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('nav');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Close nav when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // =====================================================
    // Tool Tabs
    // =====================================================

    const tabBtns = document.querySelectorAll('.tab-btn');
    const toolPanels = document.querySelectorAll('.tool-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;

            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            toolPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `${tab}-panel`) {
                    panel.classList.add('active');
                }
            });
        });
    });

    // =====================================================
    // Resize Mode Toggle
    // =====================================================

    const modeBtns = document.querySelectorAll('.option-btn[data-mode]');
    const widthInput = document.getElementById('resize-width');
    const heightInput = document.getElementById('resize-height');
    const percentInput = document.getElementById('resize-percent');
    const percentageInput = document.querySelector('.percentage-input');
    const dimensionInputs = document.querySelector('.dimension-inputs');
    const lockAspect = document.getElementById('lock-aspect');

    let currentMode = 'width';
    let originalDimensions = { width: 0, height: 0 };
    let aspectRatio = 1;

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            currentMode = mode;

            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (mode === 'percentage') {
                dimensionInputs.classList.add('hidden');
                percentageInput.classList.remove('hidden');
                percentageInput.classList.add('visible');
            } else {
                dimensionInputs.classList.remove('hidden');
                percentageInput.classList.add('hidden');
                percentageInput.classList.remove('visible');
            }

            updateDimensionInputs();
        });
    });

    function updateDimensionInputs() {
        if (!lockAspect.checked || originalDimensions.width === 0) return;

        aspectRatio = originalDimensions.width / originalDimensions.height;

        if (currentMode === 'width') {
            const newWidth = parseInt(widthInput.value) || 800;
            heightInput.value = Math.round(newWidth / aspectRatio);
        } else if (currentMode === 'height') {
            const newHeight = parseInt(heightInput.value) || 600;
            widthInput.value = Math.round(newHeight * aspectRatio);
        } else if (currentMode === 'percentage') {
            const percent = parseInt(percentInput.value) || 50;
            widthInput.value = Math.round(originalDimensions.width * (percent / 100));
            heightInput.value = Math.round(originalDimensions.height * (percent / 100));
        }
    }

    widthInput.addEventListener('input', () => {
        if (currentMode === 'width' && lockAspect.checked) {
            const newWidth = parseInt(widthInput.value) || 800;
            heightInput.value = Math.round(newWidth / aspectRatio);
        }
    });

    heightInput.addEventListener('input', () => {
        if (currentMode === 'height' && lockAspect.checked) {
            const newHeight = parseInt(heightInput.value) || 600;
            widthInput.value = Math.round(newHeight * aspectRatio);
        }
    });

    percentInput.addEventListener('input', updateDimensionInputs);
    lockAspect.addEventListener('change', updateDimensionInputs);

    // =====================================================
    // Quality Sliders
    // =====================================================

    const resizeQuality = document.getElementById('resize-quality');
    const qualityValue = document.getElementById('quality-value');

    resizeQuality.addEventListener('input', () => {
        qualityValue.textContent = resizeQuality.value + '%';
    });

    const convertQuality = document.getElementById('convert-quality');
    const convertQualityValue = document.getElementById('convert-quality-value');

    convertQuality.addEventListener('input', () => {
        convertQualityValue.textContent = convertQuality.value + '%';
    });

    const compressLevel = document.getElementById('compress-level');
    const compressLevelValue = document.getElementById('compress-level-value');

    compressLevel.addEventListener('input', () => {
        compressLevelValue.textContent = compressLevel.value + '%';
    });

    // =====================================================
    // Social Media Presets
    // =====================================================

    const presetBtns = document.querySelectorAll('.preset-btn');
    const usePresetBtn = document.getElementById('use-preset-btn');

    let selectedPreset = null;

    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            presetBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedPreset = {
                width: parseInt(btn.dataset.width),
                height: parseInt(btn.dataset.height)
            };
        });
    });

    if (usePresetBtn) {
        usePresetBtn.addEventListener('click', () => {
            if (selectedPreset) {
                widthInput.value = selectedPreset.width;
                heightInput.value = selectedPreset.height;
                lockAspect.checked = true;

                // Switch to resizer tab
                tabBtns.forEach(b => b.classList.remove('active'));
                document.querySelector('[data-tab="resizer"]').classList.add('active');
                toolPanels.forEach(panel => panel.classList.remove('active'));
                document.getElementById('resizer-panel').classList.add('active');

                document.getElementById('tools').scrollIntoView({ behavior: 'smooth' });
                showToast(`Dimensions set to ${selectedPreset.width}×${selectedPreset.height}`, 'success');
            }
        });
    }

    // =====================================================
    // Newsletter Form
    // =====================================================

    const newsletterForm = document.getElementById('newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            if (email) {
                showToast('Thanks for subscribing!', 'success');
                newsletterForm.reset();
            }
        });
    }

    // =====================================================
    // Smooth Scroll for Anchor Links
    // =====================================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // =====================================================
    // Initialize Google AdSense (placeholder)
    // =====================================================

    function initAds() {
        try {
            (adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.log('AdSense not initialized - add your AdSense code');
        }
    }

    // Load AdSense script asynchronously
    const adsScript = document.createElement('script');
    adsScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    adsScript.async = true;
    adsScript.defer = true;
    document.head.appendChild(adsScript);

    // =====================================================
    // Keyboard Accessibility
    // =====================================================

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            mobileMenuBtn.classList.remove('active');
            nav.classList.remove('active');
        }
    });

    // =====================================================
    // Local Storage for Recently Used Presets
    // =====================================================

    function saveRecentlyUsed(preset) {
        let recent = JSON.parse(localStorage.getItem('recentPresets') || '[]');
        const presetKey = `${preset.width}x${preset.height}`;

        recent = recent.filter(p => p.key !== presetKey);
        recent.unshift({
            key: presetKey,
            width: preset.width,
            height: preset.height,
            timestamp: Date.now()
        });

        recent = recent.slice(0, 5);
        localStorage.setItem('recentPresets', JSON.stringify(recent));
    }

    // =====================================================
    // Export Functions for Other Modules
    // =====================================================

    window.ResizeSan = {
        showToast,
        formatFileSize,
        getFileExtension,
        generateId,
        saveRecentlyUsed
    };

})();