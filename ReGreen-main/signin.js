// script-signin.js

document.addEventListener('DOMContentLoaded', () => {
    const signinForm = document.getElementById('signin-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const messageDiv = document.getElementById('message');

    if (signinForm) {
        signinForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Formun varsayılan gönderimini engelle

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            // Önceki mesajları temizle
            messageDiv.textContent = '';
            messageDiv.className = 'message';

            // Basit istemci tarafı kontrolü
            if (!email || !password) {
                showMessage('Lütfen e-posta ve şifrenizi girin.', 'error');
                return;
            }

            // -------- GERÇEK UYGULAMA --------
            // Burada normalde sunucuya bir istek gönderilir (fetch veya XMLHttpRequest ile).
            // Sunucu e-posta ve şifreyi kontrol eder ve bir cevap döner.
            // Şimdilik sadece başarılı bir giriş simülasyonu yapalım.
            // ---------------------------------

            console.log('Giriş denemesi:', { email, password });
            showMessage('Giriş yapılıyor, lütfen bekleyin...', 'success');

            // Başarılı giriş simülasyonu (2 saniye sonra)
            setTimeout(() => {
                 // Gerçek uygulamada burada sunucudan gelen cevaba göre işlem yapılır.
                 // Örneğin: Başarılıysa ana sayfaya yönlendirilir.
                 console.log('Giriş başarılı kabul edildi.');
                 // window.location.href = 'index.html'; // Ana sayfaya yönlendir
                 alert('Giriş başarılı! (Simülasyon)'); // Şimdilik alert
                 messageDiv.textContent = 'Giriş başarılı!'; // Mesajı güncelle
                 messageDiv.className = 'message success';
            }, 2000);

            // Örnek: Hatalı giriş simülasyonu (Eğer sunucudan hata dönerse)
            /*
            setTimeout(() => {
                console.log('Giriş başarısız kabul edildi.');
                showMessage('E-posta veya şifre hatalı.', 'error');
            }, 1500);
            */

        });
    }
});

// === Şifre Görünürlüğü Fonksiyonu (signup.js ile aynı) ===
function togglePasswordVisibility(inputId, iconElement) {
    const input = document.getElementById(inputId);
    const icon = iconElement.querySelector('i');
    if (!input || !icon) return;

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}

// === Mesaj Gösterme Fonksiyonu (signup.js ile aynı) ===
function showMessage(msg, type) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = msg;
        messageDiv.className = `message ${type}`;
    }
}