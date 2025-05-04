document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('upload-area');
    const uploadPlaceholder = document.querySelector('.upload-placeholder');
    const uploadButton = document.getElementById('upload-button');
    const hiddenFileInput = document.getElementById('image-upload-input');
    const fileNameDisplay = document.getElementById('file-name-display');
    const messageDiv = document.getElementById('upload-message');
    const cameraButton = document.getElementById('camera-button');
    const cameraPreview = document.getElementById('camera-preview');
    const cameraCanvas = document.getElementById('camera-canvas');
    const resultContainer = document.getElementById('result-container');
    let stream = null;

    // Gerekli elemanların varlığını kontrol et
    if (!uploadArea || !uploadPlaceholder || !uploadButton || !hiddenFileInput || !fileNameDisplay || !messageDiv || !cameraButton || !cameraPreview || !cameraCanvas || !resultContainer) {
        console.error("Yükleme sayfası için gerekli HTML elementlerinden biri veya birkaçı bulunamadı!");
        return;
    }

    // Yükleme Alanına Tıklama -> Gizli Input'u Tetikle
    uploadPlaceholder.addEventListener('click', () => {
        hiddenFileInput.click();
    });

    // Butona Tıklama -> Gizli Input'u Tetikle
    uploadButton.addEventListener('click', () => {
        hiddenFileInput.click();
    });

    // Kamera butonu işlevi
    cameraButton.addEventListener('click', async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            cameraPreview.srcObject = stream;
            cameraPreview.style.display = 'block';
            cameraButton.textContent = 'Fotoğraf Çek';
            cameraButton.onclick = capturePhoto;
        } catch (err) {
            console.error('Kamera erişimi hatası:', err);
            alert('Kameraya erişim izni verilmedi.');
        }
    });

    // Dosya Seçildiğinde Çalışacak Olay
    hiddenFileInput.addEventListener('change', (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const file = files[0];
            console.log('Dosya seçildi:', file.name);

            // Seçilen dosya adını göster
            fileNameDisplay.textContent = `Seçilen dosya: ${file.name}`;
            showMessage('', ''); // Önceki mesajları temizle

            // Yükleme Simülasyonunu Başlat
            simulateUpload(file);
        }
    });

    // Fotoğraf çekme işlevi
    function capturePhoto() {
        if (stream) {
            cameraCanvas.width = cameraPreview.videoWidth;
            cameraCanvas.height = cameraPreview.videoHeight;
            const context = cameraCanvas.getContext('2d');
            context.drawImage(cameraPreview, 0, 0);
            
            // Stream'i durdur
            stream.getTracks().forEach(track => track.stop());
            stream = null;
            
            // Kamera önizlemesini gizle
            cameraPreview.style.display = 'none';
            
            // Canvas'tan fotoğrafı al ve analiz et
            const imageData = cameraCanvas.toDataURL('image/jpeg');
            analyzeImage(imageData);
            
            // Butonu eski haline getir
            cameraButton.textContent = 'Kamera ile Çek';
            cameraButton.onclick = () => cameraButton.click();
        }
    }

    // Sürükle-Bırak İşlevselliği (İsteğe Bağlı Geliştirme)
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadPlaceholder.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false); // Sayfanın tamamında varsayılanı engelle
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadPlaceholder.addEventListener(eventName, () => uploadPlaceholder.classList.add('highlight'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadPlaceholder.addEventListener(eventName, () => uploadPlaceholder.classList.remove('highlight'), false);
    });

    uploadPlaceholder.addEventListener('drop', handleDrop, false);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0) {
             const file = files[0];
             // Sadece resim dosyalarına izin ver (isteğe bağlı)
             if (file.type.startsWith('image/')) {
                 console.log('Dosya sürüklendi:', file.name);
                 fileNameDisplay.textContent = `Seçilen dosya: ${file.name}`;
                 showMessage('', ''); // Önceki mesajları temizle
                 simulateUpload(file);
                 // Gizli input'a dosyayı atamak teknik olarak doğrudan mümkün değil
                 // ama yükleme işlemini başlatabiliriz.
             } else {
                 showMessage('Lütfen sadece bir resim dosyası sürükleyin.', 'error');
             }
        }
    }

    // Yükleme Simülasyonu Fonksiyonu
    function simulateUpload(file) {
        // Yükleniyor durumunu göster
        uploadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yükleniyor...';
        uploadButton.disabled = true;
        showMessage('Görsel yükleniyor...', 'loading');

        // Simülasyon: 2-3 saniye bekle
        setTimeout(() => {
            console.log("Yükleme tamamlandı (Simülasyon).", file.name);

            // Butonu ve mesajı sıfırla
            uploadButton.innerHTML = '<i class="fas fa-image"></i> Başka Görsel Seç';
            uploadButton.disabled = false;
            showMessage('Görsel başarıyla yüklendi! Analiz ediliyor...', 'success');
            // fileNameDisplay.textContent = ''; // İsteğe bağlı: Başarıdan sonra dosya adını temizle

            // Gizli input'un değerini sıfırla ki aynı dosya tekrar seçilebilsin
            hiddenFileInput.value = null;

            // --- GERÇEK UYGULAMA ---
            // Burada görseli sunucuya gönderme (FormData ve fetch kullanarak)
            // ve analiz sonucunu alma işlemleri yapılır.
            // Örneğin: uploadImageToServer(file);
            // ---------------------

            // Simülasyon: Analiz sonrası bir işlem (örn. detay sayfasına gitme)
             setTimeout(() => {
                 // alert(`"${file.name}" için ürün detayları getiriliyor...`);
                 // window.location.href = `/product-details-by-image?filename=${file.name}`;
             }, 1500);


        }, 2500); // 2.5 saniye yükleme simülasyonu
    }

    // Mesaj Gösterme Fonksiyonu
    function showMessage(msg, type) {
        messageDiv.textContent = msg;
        messageDiv.className = `message ${type}`; // type: error, success, loading veya boş
    }

    // Vertex AI için gerekli değişkenler
    const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID || 'YOUR_PROJECT_ID';
    const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
    const MODEL_ID = process.env.VERTEX_AI_MODEL_ID || 'YOUR_MODEL_ID';

    // Görüntü analizi fonksiyonu
    async function analyzeImage(imageData) {
        try {
            // Yükleme mesajını göster
            messageDiv.textContent = 'Görüntü analiz ediliyor...';
            messageDiv.className = 'message info';
            messageDiv.style.display = 'block';

            // Base64 formatındaki görüntüyü Blob'a çevir
            const base64Data = imageData.split(',')[1];
            
            // Görüntüyü optimize et (ücretsiz katman limitleri için)
            const optimizedImage = await optimizeImage(base64Data);

            // Vertex AI API'sine istek gönder
            const response = await fetch(`https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/endpoints/${MODEL_ID}:predict`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${await getAccessToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    instances: [{
                        image_bytes: {
                            b64: optimizedImage
                        }
                    }]
                })
            });

            if (!response.ok) {
                throw new Error('Vertex AI API hatası');
            }

            const result = await response.json();
            
            // Sonuçları işle
            const predictions = result.predictions[0];
            const materialType = predictions.material_type;
            const confidence = predictions.confidence;

            // Materyal tipine göre atık kategorisi ve geri dönüşüm bilgisi belirle
            const wasteInfo = getWasteInfo(materialType);
            
            // Sonuçları göster
            document.getElementById('material-type').textContent = `${materialType} (${(confidence * 100).toFixed(1)}% güven)`;
            document.getElementById('waste-category').textContent = wasteInfo.category;
            document.getElementById('recycling-details').textContent = wasteInfo.details;
            
            // Sonuç container'ını göster
            resultContainer.style.display = 'block';
            
            // Mesajı temizle
            messageDiv.style.display = 'none';

        } catch (error) {
            console.error('Analiz hatası:', error);
            messageDiv.textContent = 'Analiz sırasında bir hata oluştu.';
            messageDiv.className = 'message error';
            messageDiv.style.display = 'block';
        }
    }

    // Görüntüyü optimize et (ücretsiz katman limitleri için)
    async function optimizeImage(base64Data) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Görüntüyü küçült (maksimum 800x800)
                const maxSize = 800;
                let width = img.width;
                let height = img.height;
                
                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                
                // JPEG formatında ve %80 kalitede kaydet
                resolve(canvas.toDataURL('image/jpeg', 0.8).split(',')[1]);
            };
            img.src = `data:image/jpeg;base64,${base64Data}`;
        });
    }

    // Google Cloud kimlik doğrulama
    async function getAccessToken() {
        try {
            // Service account bilgilerini kullan
            const serviceAccount = {
                type: 'service_account',
                project_id: PROJECT_ID,
                private_key_id: process.env.GOOGLE_CLOUD_PRIVATE_KEY_ID,
                private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY,
                client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
                client_id: process.env.GOOGLE_CLOUD_CLIENT_ID,
                auth_uri: 'https://accounts.google.com/o/oauth2/auth',
                token_uri: 'https://oauth2.googleapis.com/token',
                auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
                client_x509_cert_url: process.env.GOOGLE_CLOUD_CERT_URL
            };

            // JWT token oluştur
            const jwt = require('jsonwebtoken');
            const now = Math.floor(Date.now() / 1000);
            
            const token = jwt.sign(
                {
                    iss: serviceAccount.client_email,
                    scope: 'https://www.googleapis.com/auth/cloud-platform',
                    aud: serviceAccount.token_uri,
                    exp: now + 3600,
                    iat: now
                },
                serviceAccount.private_key,
                { algorithm: 'RS256' }
            );

            // Access token al
            const response = await fetch(serviceAccount.token_uri, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                    assertion: token
                })
            });

            const data = await response.json();
            return data.access_token;
        } catch (error) {
            console.error('Token alma hatası:', error);
            throw error;
        }
    }

    // Materyal tipine göre atık bilgilerini döndür
    function getWasteInfo(materialType) {
        const wasteInfo = {
            'plastik': {
                category: 'Mavi Çöp Kutusu',
                details: 'Plastik atıklarınızı temizleyerek mavi çöp kutusuna atabilirsiniz. Plastik şişeleri sıkıştırarak yer kazanabilirsiniz.'
            },
            'kağıt': {
                category: 'Mavi Çöp Kutusu',
                details: 'Kağıt atıklarınızı düzleştirerek mavi çöp kutusuna atabilirsiniz. Yağlı veya ıslak kağıtları geri dönüşüme atmayın.'
            },
            'cam': {
                category: 'Yeşil Çöp Kutusu',
                details: 'Cam atıklarınızı yeşil çöp kutusuna atabilirsiniz. Kırık camları dikkatli bir şekilde atın.'
            },
            'metal': {
                category: 'Gri Çöp Kutusu',
                details: 'Metal atıklarınızı gri çöp kutusuna atabilirsiniz. Konserve kutularını yıkayarak atın.'
            },
            'organik': {
                category: 'Kahverengi Çöp Kutusu',
                details: 'Organik atıklarınızı kahverengi çöp kutusuna atabilirsiniz. Kompost yapılabilir atıkları ayrı toplayın.'
            }
        };

        return wasteInfo[materialType.toLowerCase()] || {
            category: 'Bilinmiyor',
            details: 'Bu materyal için geri dönüşüm bilgisi bulunamadı.'
        };
    }
});