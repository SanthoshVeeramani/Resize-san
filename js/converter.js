// =====================================================
// Resize-san - Image Converter Module
// =====================================================

(function() {
    'use strict';

    // =====================================================
    // DOM Elements
    // =====================================================

    const dropzone = document.getElementById('converter-dropzone');
    const input = document.getElementById('converter-input');
    const formatSelect = document.getElementById('convert-format');
    const qualitySlider = document.getElementById('convert-quality');
    const previewSection = document.getElementById('converter-preview');
    const downloadBtn = document.getElementById('convert-download');
    const zipBtn = document.getElementById('convert-zip');

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

    function convertImage(img, targetFormat, quality) {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0);

        let mimeType;
        switch (targetFormat) {
            case 'png':
                mimeType = 'image/png';
                break;
            case 'jpeg':
                mimeType = 'image/jpeg';
                break;
            case 'webp':
                mimeType = 'image/webp';
                break;
            default:
                mimeType = 'image/jpeg';
        }

        return new Promise((resolve) => {
            canvas.toBlob((blob) => resolve(blob), mimeType, quality / 100);
        });
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
                    originalFormat: window.ResizeSan.getFileExtension(file.name),
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
                            <div class="preview-size">${window.ResizeSan.formatFileSize(img.originalSize)} (${img.originalFormat.toUpperCase()})</div>
                        </div>
                        <button class="preview-download" data-id="${img.id}" title="Download">↓</button>
                    </div>
                `).join('')}
            </div>
        `;
        previewSection.classList.add('active');

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

        const targetFormat = formatSelect.value;
        const quality = parseInt(qualitySlider.value) || 90;

        downloadBtn.disabled = true;
        zipBtn.disabled = true;

        processedImages = [];

        for (const imgData of uploadedImages) {
            try {
                const ext = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
                const blob = await convertImage(imgData.originalImg, targetFormat, quality);
                processedImages.push({
                    id: imgData.id,
                    name: imgData.name.replace(/\.[^/.]+$/, `.${ext}`),
                    originalSize: imgData.originalSize,
                    originalFormat: imgData.originalFormat,
                    targetFormat,
                    width: imgData.width,
                    height: imgData.height,
                    size: blob.size,
                    blob,
                    dataUrl: URL.createObjectURL(blob)
                });
            } catch (e) {
                console.error('Failed to convert:', imgData.name);
            }
        }

        updatePreviewConversion();
        downloadBtn.disabled = false;
        zipBtn.disabled = false;
        window.ResizeSan.showToast('Images converted successfully!', 'success');
    }

    function updatePreviewConversion() {
        const previewGrid = previewSection.querySelector('.preview-grid');
        if (!previewGrid) return;

        processedImages.forEach(processed => {
            const item = previewGrid.querySelector(`[data-id="${processed.id}"]`);
            if (item) {
                const info = item.querySelector('.preview-info');
                const savings = Math.round((1 - processed.size / processed.originalSize) * 100);
                const sizeChange = savings > 0 ? ` (−${savings}%)` : savings < 0 ? ` (+${Math.abs(savings)}%)` : '';
                info.innerHTML = `
                    <div class="preview-name">${processed.name}</div>
                    <div class="preview-dimensions">${processed.width} × ${processed.height}</div>
                    <div class="preview-size">${window.ResizeSan.formatFileSize(processed.size)} ${processed.targetFormat.toUpperCase()}<span class="preview-original">${sizeChange}</span></div>
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
        a.download = processed.name;
        a.click();
        window.ResizeSan.showToast('Download started', 'success');
    }

    function downloadAllZip() {
        if (processedImages.length === 0) return;

        const zip = new JSZip();

        processedImages.forEach(img => {
            zip.file(img.name, img.blob);
        });

        zip.generateAsync({ type: 'blob' }).then(blob => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'converted_images.zip';
            a.click();
            URL.revokeObjectURL(a.href);
            window.ResizeSan.showToast('ZIP download started', 'success');
        });
    }

    // =====================================================
    // Event Listeners
    // =====================================================

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

    downloadBtn.addEventListener('click', async () => {
        if (processedImages.length === 0) {
            await processAllImages();
        }
        if (processedImages.length === 1) {
            downloadSingle(processedImages[0]);
        }
    });

    zipBtn.addEventListener('click', async () => {
        if (processedImages.length === 0) {
            await processAllImages();
        }
        if (processedImages.length > 0) {
            downloadAllZip();
        }
    });

})();