// =====================================================
// Resize-san - Image Resizer Module
// =====================================================

(function() {
    'use strict';

    // =====================================================
    // DOM Elements
    // =====================================================

    const dropzone = document.getElementById('resizer-dropzone');
    const input = document.getElementById('resizer-input');
    const previewSection = document.getElementById('resizer-preview');
    const downloadBtn = document.getElementById('resize-download');
    const zipBtn = document.getElementById('resize-zip');

    // =====================================================
    // State
    // =====================================================

    let uploadedImages = [];
    let processedImages = [];

    // =====================================================
    // Image Processing Functions
    // =====================================================

    function loadImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function resizeImage(img, targetWidth, targetHeight, quality, format = 'image/jpeg') {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        return new Promise((resolve) => {
            canvas.toBlob((blob) => resolve(blob), format, quality / 100);
        });
    }

    function getResizedDimensions(img, mode, width, height, percentage) {
        const originalWidth = img.width;
        const originalHeight = img.height;

        let newWidth, newHeight;

        switch (mode) {
            case 'width':
                newWidth = width;
                newHeight = Math.round((width / originalWidth) * originalHeight);
                break;
            case 'height':
                newHeight = height;
                newWidth = Math.round((height / originalHeight) * originalWidth);
                break;
            case 'percentage':
                newWidth = Math.round((percentage / 100) * originalWidth);
                newHeight = Math.round((percentage / 100) * originalHeight);
                break;
            default:
                newWidth = width;
                newHeight = height;
        }

        return { width: newWidth, height: newHeight };
    }

    // =====================================================
    // Upload Handling
    // =====================================================

    function handleFiles(files) {
        const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));

        if (imageFiles.length === 0) {
            window.ResizeSan.showToast('Please upload valid image files', 'error');
            return;
        }

        const totalSize = imageFiles.reduce((sum, f) => sum + f.size, 0);
        if (totalSize > 50 * 1024 * 1024) {
            window.ResizeSan.showToast('Total file size exceeds 50MB limit', 'error');
            return;
        }

        Promise.all(imageFiles.map(async (file) => {
            try {
                const img = await loadImage(file);
                return {
                    id: window.ResizeSan.generateId(),
                    file,
                    originalImg: img,
                    name: file.name,
                    originalSize: file.size,
                    width: img.width,
                    height: img.height
                };
            } catch (e) {
                console.error('Failed to load image:', file.name);
                return null;
            }
        })).then(results => {
            uploadedImages = results.filter(r => r !== null);
            if (uploadedImages.length > 0) {
                showPreview();
                downloadBtn.disabled = false;
                zipBtn.disabled = false;
                window.ResizeSan.showToast(`${uploadedImages.length} image(s) loaded`, 'success');

                // Set first image dimensions as reference
                if (uploadedImages.length > 0) {
                    const first = uploadedImages[0];
                    document.getElementById('resize-width').value = first.width;
                    document.getElementById('resize-height').value = first.height;
                }
            }
        });
    }

    function showPreview() {
        previewSection.innerHTML = `
            <div class="preview-grid">
                ${uploadedImages.map(img => `
                    <div class="preview-item" data-id="${img.id}">
                        <img class="preview-image" src="${img.originalImg.src}" alt="${img.name}">
                        <div class="preview-info">
                            <div class="preview-name">${img.name}</div>
                            <div class="preview-dimensions">${img.width} × ${img.height}</div>
                            <div class="preview-size">${window.ResizeSan.formatFileSize(img.originalSize)}</div>
                        </div>
                        <button class="preview-download" data-id="${img.id}" title="Download">↓</button>
                    </div>
                `).join('')}
            </div>
        `;
        previewSection.classList.add('active');

        // Add download handlers
        previewSection.querySelectorAll('.preview-download').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const processed = processedImages.find(p => p.id === id);
                if (processed) {
                    downloadSingle(processed);
                }
            });
        });
    }

    // =====================================================
    // Process Images
    // =====================================================

    async function processAllImages() {
        if (uploadedImages.length === 0) return;

        const width = parseInt(document.getElementById('resize-width').value) || 800;
        const height = parseInt(document.getElementById('resize-height').value) || 600;
        const percentage = parseInt(document.getElementById('resize-percent').value) || 50;
        const quality = parseInt(document.getElementById('resize-quality').value) || 90;
        const mode = document.querySelector('.option-btn[data-mode].active')?.dataset.mode || 'width';

        const modeBtns = document.querySelectorAll('.option-btn[data-mode]');
        let currentMode = 'width';
        modeBtns.forEach(btn => {
            if (btn.classList.contains('active')) {
                currentMode = btn.dataset.mode;
            }
        });

        downloadBtn.disabled = true;
        zipBtn.disabled = true;

        processedImages = [];

        for (const imgData of uploadedImages) {
            const dims = getResizedDimensions(imgData.originalImg, currentMode, width, height, percentage);

            try {
                const blob = await resizeImage(imgData.originalImg, dims.width, dims.height, quality);
                processedImages.push({
                    id: imgData.id,
                    name: imgData.name,
                    originalSize: imgData.originalSize,
                    originalWidth: imgData.width,
                    originalHeight: imgData.height,
                    width: dims.width,
                    height: dims.height,
                    size: blob.size,
                    blob,
                    dataUrl: URL.createObjectURL(blob)
                });
            } catch (e) {
                console.error('Failed to resize:', imgData.name);
            }
        }

        updatePreviewSizes();
        downloadBtn.disabled = false;
        zipBtn.disabled = false;
        window.ResizeSan.showToast('Images resized successfully!', 'success');
    }

    function updatePreviewSizes() {
        const previewGrid = previewSection.querySelector('.preview-grid');
        if (!previewGrid) return;

        processedImages.forEach(processed => {
            const item = previewGrid.querySelector(`[data-id="${processed.id}"]`);
            if (item) {
                const info = item.querySelector('.preview-info');
                const savings = Math.round((1 - processed.size / processed.originalSize) * 100);
                const savingsText = savings > 0 ? ` (−${savings}%)` : '';
                info.innerHTML = `
                    <div class="preview-name">${processed.name}</div>
                    <div class="preview-dimensions">${processed.width} × ${processed.height}</div>
                    <div class="preview-size">${window.ResizeSan.formatFileSize(processed.size)}<span class="preview-original">${savingsText}</span></div>
                `;
            }
        });
    }

    // =====================================================
    // Download Functions
    // =====================================================

    function downloadSingle(processed) {
        const a = document.createElement('a');
        a.href = processed.dataUrl;
        a.download = `resized_${processed.name.replace(/\.[^/.]+$/, '')}.jpg`;
        a.click();
        window.ResizeSan.showToast('Download started', 'success');
    }

    function downloadAllZip() {
        if (processedImages.length === 0) return;

        const zip = new JSZip();

        processedImages.forEach(img => {
            zip.file(`resized_${img.name.replace(/\.[^/.]+$/, '')}.jpg`, img.blob);
        });

        zip.generateAsync({ type: 'blob' }).then(blob => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'resized_images.zip';
            a.click();
            URL.revokeObjectURL(a.href);
            window.ResizeSan.showToast('ZIP download started', 'success');
        });
    }

    // =====================================================
    // Event Listeners
    // =====================================================

    // Drag and drop
    dropzone.addEventListener('click', () => input.click());

    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    input.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Download buttons
    downloadBtn.addEventListener('click', processAllImages);
    zipBtn.addEventListener('click', processAllImages);

    // Auto-update dimensions when values change
    ['resize-width', 'resize-height', 'resize-percent'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', () => {
                if (uploadedImages.length > 0) {
                    // Store original dimensions for aspect ratio
                    const first = uploadedImages[0];
                    window.appOriginalDimensions = { width: first.width, height: first.height };
                }
            });
        }
    });

})();