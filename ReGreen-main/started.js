// started.js

document.addEventListener('DOMContentLoaded', () => {
    // --- HTML Elementlerini Seçme ---
    // Bu ID'lerin started.html dosyasındaki elementlerle eşleştiğinden emin olun!
    const uploadArea = document.getElementById('upload-area');
    const uploadPlaceholder = document.querySelector('.upload-placeholder');
    const uploadButton = document.getElementById('upload-button'); // "Görsel Seç" butonu
    const hiddenFileInput = document.getElementById('image-upload-input');
    const fileNameDisplay = document.getElementById('file-name-display');
    const messageDiv = document.getElementById('upload-message'); // Yükleme alanı içindeki genel mesaj div'i
    const imagePreview = document.getElementById('imagePreview');
    const analyzeButton = document.getElementById('analyzeButton');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsArea = document.getElementById('resultsArea');
    const objectName = document.getElementById('objectName');
    const carbonFootprint = document.getElementById('carbonFootprint');
    const recyclingInfo = document.getElementById('recyclingInfo');
    const errorMessage = document.getElementById('errorMessage'); // Sonuç alanı içindeki hata div'i

    // Gerekli tüm elemanların varlığını kontrol edelim (hata ayıklama için önemli)
    const requiredElements = {
        uploadArea, uploadPlaceholder, uploadButton, hiddenFileInput, fileNameDisplay,
        messageDiv, imagePreview, analyzeButton, loadingIndicator, resultsArea,
        objectName, carbonFootprint, recyclingInfo, errorMessage
    };

    for (const key in requiredElements) {
        if (!requiredElements[key]) {
            console.error(`HATA: HTML elementi bulunamadı! ID/Seçici: "${getHtmlId(key)}" (started.html dosyasını kontrol edin)`);
            if (messageDiv) showUploadMessage('Sayfa yüklenirken bir sorun oluştu. Lütfen yenileyin.', 'error');
            return; // Script'in geri kalanının çalışmasını engelle
        }
    }
    // ID/Seçiciyi almak için basit bir yardımcı (opsiyonel)
    function getHtmlId(elementKey) {
        const ids = {
             uploadArea: 'upload-area', uploadPlaceholder: '.upload-placeholder',
             uploadButton: 'upload-button', hiddenFileInput: 'image-upload-input',
             fileNameDisplay: 'file-name-display', messageDiv: 'upload-message',
             imagePreview: 'imagePreview', analyzeButton: 'analyzeButton',
             loadingIndicator: 'loadingIndicator', resultsArea: 'resultsArea',
             objectName: 'objectName', carbonFootprint: 'carbonFootprint',
             recyclingInfo: 'recyclingInfo', errorMessage: 'errorMessage'
         };
         return ids[elementKey] || elementKey;
    }


    let selectedImageData = null; // Seçilen resmin Base64 verisini saklamak için

    // --- Olay Dinleyicileri (Event Listeners) ---

    // 1. Placeholder'a veya "Görsel Seç" Butonuna Tıklama -> Gizli Dosya Input'unu Tetikle
    [uploadPlaceholder, uploadButton].forEach(element => {
        element.addEventListener('click', () => {
            hiddenFileInput.click();
        });
    });

    // 2. Dosya Seçildiğinde (Gizli Input Değiştiğinde)
    hiddenFileInput.addEventListener('change', handleFileSelect);

    // 3. Sürükle-Bırak İşlevselliği Kurulumu
    setupDragAndDrop();

    // 4. "Analiz Et" Butonuna Tıklama
    analyzeButton.addEventListener('click', startAnalysis);

    // --- Ana Fonksiyonlar ---

    // Dosya seçme veya bırakma işlemini yönetir
    function handleFileSelect(event) {
        const files = event.target.files || (event.dataTransfer && event.dataTransfer.files);

        if (files && files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                processSelectedFile(file);
            } else {
                showUploadMessage('Lütfen sadece bir resim dosyası seçin.', 'error');
                resetUIBeforeUpload();
            }
        }
        if (event.target) {
             hiddenFileInput.value = null;
        }
    }

    // Seçilen geçerli resim dosyasını işler (okuma, önizleme, veri saklama)
    function processSelectedFile(file) {
        console.log('Geçerli resim dosyası işleniyor:', file.name);
        fileNameDisplay.textContent = `Seçilen: ${file.name}`;
        showUploadMessage('', '');
        resetAnalysisResults();

        const reader = new FileReader();
        reader.onload = (e) => {
            selectedImageData = e.target.result;
            imagePreview.src = selectedImageData;
            imagePreview.style.display = 'block';
            analyzeButton.style.display = 'inline-block';
        };
        reader.onerror = () => {
            console.error('Dosya okuma hatası!');
            showUploadMessage('Resim dosyası okunurken bir hata oluştu.', 'error');
            resetUIBeforeUpload();
        };
        reader.readAsDataURL(file);
    }

    // Yeni bir yükleme öncesinde UI'ı sıfırlar
    function resetUIBeforeUpload() {
        fileNameDisplay.textContent = '';
        imagePreview.style.display = 'none';
        imagePreview.src = '#';
        analyzeButton.style.display = 'none';
        selectedImageData = null;
        resetAnalysisResults();
        showUploadMessage('', '');
    }

    // Analiz sonuçlarını ve ilgili UI elementlerini sıfırlar
    function resetAnalysisResults() {
         resultsArea.style.display = 'none';
         errorMessage.style.display = 'none';
         loadingIndicator.style.display = 'none';
         objectName.textContent = '-';
         carbonFootprint.textContent = '-';
         recyclingInfo.textContent = '-';
    }

    // Asenkron: "Analiz Et" butonuna basıldığında ana analiz akışını başlatır
    async function startAnalysis() {
        if (!selectedImageData) {
            showUploadMessage('Lütfen önce analiz edilecek bir görsel seçin.', 'error');
            return;
        }

        loadingIndicator.style.display = 'block';
        resultsArea.style.display = 'none';
        errorMessage.style.display = 'none';
        analyzeButton.disabled = true;
        uploadButton.disabled = true;

        console.log("--- Analiz Başladı ---"); // 1. Adım - Konsol Takibi
        showUploadMessage('Analiz yapılıyor...', 'loading');

        try {
            console.log("Adım 2: simulateAIAnalysis çağrılıyor..."); // Konsol Takibi
            const detectedObjectLabel = await simulateAIAnalysis(selectedImageData);
            console.log("Adım 3: simulateAIAnalysis döndü. Etiket:", detectedObjectLabel); // Konsol Takibi

            if (!detectedObjectLabel) {
                 console.log("Adım 4a: Etiket bulunamadı, hata fırlatılıyor."); // Konsol Takibi
                throw new Error("Nesne tanımlanamadı.");
            }

            console.log("Adım 4b: getObjectData çağrılıyor, etiket:", detectedObjectLabel); // Konsol Takibi
            const objectData = getObjectData(detectedObjectLabel);
            console.log("Adım 5: getObjectData döndü. Veri:", objectData); // Konsol Takibi

            if (objectData) {
                console.log("Adım 6a: displayResults çağrılıyor..."); // Konsol Takibi
                displayResults(objectData);
                console.log("Adım 7a: displayResults bitti."); // Konsol Takibi
                showUploadMessage('Analiz tamamlandı.', 'success');
            } else {
                console.log("Adım 6b: Veri bulunamadı, showAnalysisError çağrılıyor..."); // Konsol Takibi
                 showUploadMessage('Analiz tamamlandı ancak detay bulunamadı.', 'error');
                showAnalysisError(`Üzgünüz, tanımlanan nesne ('${detectedObjectLabel}') için henüz detaylı bilgi veritabanımızda bulunmuyor.`);
                 console.log("Adım 7b: showAnalysisError bitti."); // Konsol Takibi
            }

        } catch (error) {
            console.error("--- HATA Yakalandı ---:", error); // 8. Adım - Konsol Takibi (Hata olursa)
            showUploadMessage('Analiz sırasında bir hata oluştu.', 'error');
            showAnalysisError(`Analiz işlemi başarısız oldu. (${error.message})`);
        } finally {
            console.log("--- FINALLY Bloğu Çalışıyor ---"); // 9. Adım - Konsol Takibi (Her zaman çalışmalı)
            loadingIndicator.style.display = 'none';
            analyzeButton.disabled = false;
            uploadButton.disabled = false;
            console.log("--- FINALLY Bloğu Bitti, UI güncellenmeli ---"); // 10. Adım - Konsol Takibi
        }
    } // startAnalysis sonu


    // ----- AI ve Veri Alma Fonksiyonları (YER TUTUCULAR - ÖNEMLİ!) -----

    // Asenkron: AI analizini SİMÜLE eder. Gerçek API çağrısı veya model ile DEĞİŞTİRİLMELİ!
    async function simulateAIAnalysis(imageDataBase64) {
        console.log("Yapay zeka analizi simüle ediliyor (1.5 saniye bekle)...");
        await new Promise(resolve => setTimeout(resolve, 1500));

        // *** BURASI GERÇEKLEŞTİRİLECEK ANA KISIM ***
        // Gerçek AI entegrasyonu (Bulut API veya TensorFlow.js) buraya gelecek.
        // Şimdilik sadece simülasyon yapıyoruz.

        // --- Simülasyon ---
        const possibleLabels = ["keyboard", "pencil", "plastic bottle", "laptop", "mug", "book", "smartphone", "glass bottle", "aluminum can", "t-shirt", "unknown"];
        const randomIndex = Math.floor(Math.random() * possibleLabels.length);
        const simulatedLabel = possibleLabels[randomIndex];
        console.log("(Simülasyon) Rastgele seçilen etiket:", simulatedLabel);

        if (simulatedLabel === "unknown") {
             return null;
        }
        return simulatedLabel;
    }

    // Veri kaynağından (veri.js'deki 'carbonData' objesi) bilgi alır
    function getObjectData(label) {
        const normalizedLabel = label.toLowerCase().trim();
        console.log(`Veri kaynağında normalleştirilmiş etiket aranıyor: '${normalizedLabel}'`);

        // ÖNEMLİ: veri.js'nin yüklendiğinden ve carbonData objesinin var olduğundan emin olmalıyız.
        if (typeof carbonData === 'undefined') {
            console.error("HATA: 'carbonData' objesi bulunamadı! (veri.js dosyası yüklendi mi ve doğru tanımlandı mı?)");
            // Hata durumunda null döndürmek analizin sonraki adımlarını kontrol etmemizi sağlar.
            return null;
        }

        const data = carbonData[normalizedLabel];

        if (data) {
            console.log(`'${normalizedLabel}' için veri bulundu:`, data);
            return data;
        } else {
            console.log(`'${normalizedLabel}' için veri bulunamadı.`);
            return null;
        }
    }

    // --- Yardımcı UI Fonksiyonları ---

    // Analiz sonuçlarını ilgili HTML elementlerine yazar ve gösterir
    function displayResults(data) {
        objectName.textContent = data.nameTR || 'Bilinmiyor';
        carbonFootprint.textContent = data.co2 !== undefined ? `${data.co2}` : 'Veri yok';
        let infoText = "";
        if (data.recycle) infoText += `Geri Dönüşüm/Bertaraf:\n${data.recycle}\n\n`;
        if (data.tips) infoText += `Azaltım İpuçları:\n${data.tips}`;
        recyclingInfo.textContent = infoText.trim() || 'Detaylı bilgi bulunamadı.';

        resultsArea.style.display = 'block';
        errorMessage.style.display = 'none';
    }

    // Sonuç alanı içindeki hata mesajını gösterir
    function showAnalysisError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        resultsArea.style.display = 'none';
    }

    // Yükleme alanı içindeki genel mesajları gösterir
    function showUploadMessage(msg, type) {
        messageDiv.textContent = msg;
        messageDiv.className = `message ${type}`;
        if (msg) {
            messageDiv.style.display = 'block';
        } else {
             messageDiv.style.display = 'none';
        }
    }

    // Sürükle-Bırak olay dinleyicilerini ayarlar
    function setupDragAndDrop() {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.classList.add('highlight'), false);
        });
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('highlight'), false);
        });
        uploadArea.addEventListener('drop', handleFileSelect, false);
    }

    // Varsayılan olayları engelleme yardımcısı
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

}); // DOMContentLoaded Sonu