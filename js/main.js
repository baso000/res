// Load theme immediately
(function() {
    var savedTheme = localStorage.getItem("fw-theme");
    if (savedTheme) {
        document.documentElement.setAttribute("data-theme", savedTheme);
    }
})();

// js/main.js - Theme Switching (LocalStorage) + Welcome message (SessionStorage)

// Helper functions for cookies (kept for compatibility if needed elsewhere)
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

document.addEventListener("DOMContentLoaded", function () {

    // ---- 1. Load saved theme from LocalStorage ----
    var savedTheme = localStorage.getItem("fw-theme");
    if (savedTheme) {
        document.documentElement.setAttribute("data-theme", savedTheme);
        updateThemeIcon(savedTheme);
    }

    // ---- 2. Theme toggle button ----
    var themeBtn = document.getElementById("themeSwitchBtn");
    if (themeBtn) {
        themeBtn.addEventListener("click", function () {
            var current = document.documentElement.getAttribute("data-theme");
            var next = (current === "dark") ? "light" : "dark";

            document.documentElement.setAttribute("data-theme", next);
            localStorage.setItem("fw-theme", next); 
            updateThemeIcon(next);
        });
    }

    // ---- 3. Show welcome message from SessionStorage ----
    var loggedUser = sessionStorage.getItem("loggedInUser");
    var welcomeSpan = document.getElementById("userWelcome");
    if (loggedUser && welcomeSpan) {
        welcomeSpan.innerHTML = '<i class="fas fa-user-check" style="color:var(--primary)"></i> أهلاً، ' + loggedUser.split('@')[0];
    }
});

// Helper: update the moon/sun icon based on theme
function updateThemeIcon(theme) {
    var btn = document.getElementById("themeSwitchBtn");
    if (!btn) return;
    var icon = btn.querySelector("i");
    if (!icon) return;
    if (theme === "dark") {
        icon.className = "fas fa-sun";
        btn.title = "الوضع الفاتح";
    } else {
        icon.className = "fas fa-moon";
        btn.title = "الوضع الداكن";
    }
}
// ---- Menu Search & Navigation ----
function filterMenu() {
    var input = document.getElementById('menuSearch');
    var filter = input.value.toLowerCase();
    var cards = document.querySelectorAll('.food-card');
    var sections = document.querySelectorAll('.food-section');

    cards.forEach(function(card) {
        var title = card.querySelector('.food-card-title').innerText.toLowerCase();
        var desc = card.querySelector('.food-card-desc').innerText.toLowerCase();
        if (title.indexOf(filter) > -1 || desc.indexOf(filter) > -1) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });

    // Hide empty sections during search
    sections.forEach(function(section) {
        var visibleCards = section.querySelectorAll('.food-card[style="display: (empty)"], .food-card:not([style*="display: none"])');
        // Simple check: if all cards in section are hidden
        var hasVisible = false;
        section.querySelectorAll('.food-card').forEach(function(c) {
            if (c.style.display !== "none") hasVisible = true;
        });
        section.style.display = hasVisible ? "" : "none";
    });
}

function scrollToSection(id) {
    var element = document.getElementById(id);
    if (element) {
        var headerOffset = 130; // Account for sticky header + category bar
        var elementPosition = element.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });

        // Update active button
        document.querySelectorAll('.shortcut-btn').forEach(btn => btn.classList.remove('active'));
        event.currentTarget.classList.add('active');
    }
}


// js/validation.js
// Custom form validation — NO HTML5 required/built-in validation used.
// All checks are done manually via JavaScript.

function clearErrors() {
    var errors = document.querySelectorAll('.error-msg');
    for (var i = 0; i < errors.length; i++) {
        errors[i].style.display = 'none';
        errors[i].innerText = '';
    }
}

function showError(fieldId, message) {
    var el = document.getElementById(fieldId + '-error');
    if (el) {
        el.innerText = '⚠ ' + message;
        el.style.display = 'block';
    }
}

function validateForm(event, formId) {
    // Always prevent default browser submission
    event.preventDefault();
    clearErrors();

    var form = document.getElementById(formId);
    var isValid = true;

    // ---- Reservation Form ----
    if (formId === 'reservationForm') {
        var name   = document.getElementById('resName').value.trim();
        var date   = document.getElementById('resDate').value.trim();
        var people = document.getElementById('resPeople').value.trim();

        if (name === '') {
            showError('resName', 'يرجى إدخال اسمك الكريم.');
            isValid = false;
        } else if (name.length < 3) {
            showError('resName', 'الاسم يجب أن يكون 3 أحرف على الأقل.');
            isValid = false;
        }

        if (date === '') {
            showError('resDate', 'يرجى اختيار تاريخ الحجز.');
            isValid = false;
        }

        if (people === '' || isNaN(people) || parseInt(people) < 1 || parseInt(people) > 20) {
            showError('resPeople', 'يرجى إدخال عدد أشخاص صحيح (1 إلى 20).');
            isValid = false;
        }

        if (isValid) {
            // Save reservation to LocalStorage
            var reservation = {
                name: name,
                date: date,
                people: people,
                savedAt: new Date().toLocaleString('ar-EG')
            };
            localStorage.setItem('lastReservation', JSON.stringify(reservation));
            alert('✅ تم تأكيد حجزك بنجاح!\nاسم: ' + name + '\nتاريخ: ' + date + '\nعدد الأشخاص: ' + people);
            form.reset();
        }
    }

    // ---- Login Form ----
    else if (formId === 'loginForm') {
        var email = document.getElementById('loginEmail').value.trim();
        var pass  = document.getElementById('loginPass').value;

        // Check email format manually (no HTML5)
        var hasAt  = email.indexOf('@') !== -1;
        var hasDot = email.lastIndexOf('.') > email.indexOf('@');

        if (email === '') {
            showError('loginEmail', 'يرجى إدخال البريد الإلكتروني.');
            isValid = false;
        } else if (!hasAt || !hasDot) {
            showError('loginEmail', 'يرجى إدخال بريد إلكتروني صحيح (مثال: name@email.com).');
            isValid = false;
        }

        if (pass.length < 6) {
            showError('loginPass', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
            isValid = false;
        }

        if (isValid) {
            // Save user to SessionStorage (clears when browser closes)
            sessionStorage.setItem('loggedInUser', email);
            alert('✅ تم تسجيل الدخول بنجاح! مرحباً بك.');
            window.location.href = 'index.html';
        }
    }

    // ---- Support / Contact Form ----
    else if (formId === 'contactForm') {
        var contName  = document.getElementById('contName').value.trim();
        var contPhone = document.getElementById('contPhone').value.trim();
        var contMsg   = document.getElementById('contMsg').value.trim();

        if (contName === '' || contName.length < 3) {
            showError('contName', 'يرجى إدخال اسمك بالكامل.');
            isValid = false;
        }
        
        if (contPhone === '' || contPhone.length < 8) {
            showError('contPhone', 'يرجى إدخال رقم موبايل صحيح.');
            isValid = false;
        }

        if (contMsg === '' || contMsg.length < 10) {
            showError('contMsg', 'يرجى كتابة تفاصيل الشكوى بوضوح (10 أحرف على الأقل).');
            isValid = false;
        }

        if (isValid) {
            // Save message to SessionStorage temporarily
            sessionStorage.setItem('lastMessage', contMsg);
            alert('✅ تم إرسال الشكوى بنجاح! فريق الدعم الفني سيتواصل معك على الرقم ' + contPhone + ' في أقرب وقت.');
            form.reset();
        }
    }

    // ---- Register Form ----
    else if (formId === 'registerForm') {
        var regName  = document.getElementById('regName').value.trim();
        var regEmail = document.getElementById('regEmail').value.trim();
        var regPass  = document.getElementById('regPass').value;
        var regPassConfirm = document.getElementById('regPassConfirm').value;

        if (regName === '' || regName.length < 3) {
            showError('regName', 'يرجى إدخال اسمك بالكامل (3 أحرف على الأقل).');
            isValid = false;
        }

        var hasAt  = regEmail.indexOf('@') !== -1;
        var hasDot = regEmail.lastIndexOf('.') > regEmail.indexOf('@');
        if (regEmail === '' || !hasAt || !hasDot) {
            showError('regEmail', 'يرجى إدخال بريد إلكتروني صحيح.');
            isValid = false;
        }

        if (regPass.length < 6) {
            showError('regPass', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
            isValid = false;
        }

        if (regPassConfirm !== regPass || regPassConfirm === '') {
            showError('regPassConfirm', 'كلمتا المرور غير متطابقتين.');
            isValid = false;
        }

        if (isValid) {
            // Save user to SessionStorage
            sessionStorage.setItem('loggedInUser', regEmail);
            alert('✅ تم إنشاء الحساب بنجاح! مرحباً بك يا ' + regName);
            window.location.href = 'index.html';
        }
    }
}
