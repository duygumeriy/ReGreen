document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const messageDiv = document.getElementById('message');

    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Formun normal gönderimini engelle

            // Alanları al
            const fullname = document.getElementById('fullname').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            // Mesajı temizle
            messageDiv.textContent = '';
            messageDiv.className = 'message'; // Sınıfları sıfırla

            // --- Basit Doğrulama ---
            if (!fullname || !email || !password || !confirmPassword) {
                showMessage('Lütfen tüm alanları doldurun.', 'error');
                return; // Fonksiyondan çık
            }

            if (password.length < 6) {
                 showMessage('Şifre en az 6 karakter olmalıdır.', 'error');
                 return;
            }


            if (password !== confirmPassword) {
                showMessage('Şifreler eşleşmiyor!', 'error');
                // Şifre alanlarını vurgulayabiliriz (isteğe bağlı)
                passwordInput.style.borderColor = '#ef4444'; // Kırmızı çerçeve
                confirmPasswordInput.style.borderColor = '#ef4444';
                return; // Fonksiyondan çık
            } else {
                 // Eşleşiyorsa çerçeveleri normale döndür
                 passwordInput.style.borderColor = '#bbf7d0';
                 confirmPasswordInput.style.borderColor = '#bbf7d0';
            }

            // --- Doğrulama Başarılı ---
            // Burada normalde sunucuya veri gönderme işlemi yapılır (AJAX vb.)
            // Şimdilik sadece başarılı mesajı gösterelim
            showMessage('Kayıt başarılı! Yönlendiriliyorsunuz...', 'success');
            console.log('Form verileri:', { fullname, email, password });

            // Formu temizle (isteğe bağlı)
            // signupForm.reset();

            // Örneğin 2 saniye sonra başka sayfaya yönlendirme
             setTimeout(() => {
                 // window.location.href = '/dashboard'; // Gerçek yönlendirme
                 console.log("Yönlendirme simülasyonu...");
             }, 2000);

        });
    }

     // Şifre alanlarındaki girdi değiştiğinde hata rengini kaldır
     if(passwordInput) passwordInput.addEventListener('input', resetInputBorder);
     if(confirmPasswordInput) confirmPasswordInput.addEventListener('input', resetInputBorder);
});

// Şifre görünürlüğünü değiştirme fonksiyonu
function togglePasswordVisibility(inputId, iconElement) {
    const input = document.getElementById(inputId);
    const icon = iconElement.querySelector('i');
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


// Hata/Başarı mesajını gösterme fonksiyonu
function showMessage(msg, type) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = msg;
        messageDiv.className = `message ${type}`; // 'message error' veya 'message success'
    }
}

// Input kenarlık rengini sıfırlama
function resetInputBorder(event){
    event.target.style.borderColor = '#bbf7d0';
}