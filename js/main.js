document.addEventListener("DOMContentLoaded", function () {
    var themeState = localStorage.getItem("site-theme");
    if (themeState) {
        document.documentElement.setAttribute("data-theme", themeState);
        updateThemeIcon(themeState);
    }
    var themeBtn = document.getElementById("themeSwitchBtn");
    if (themeBtn) {
        themeBtn.addEventListener("click", function () {
            var current = document.documentElement.getAttribute("data-theme");
            var next = (current === "dark") ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", next);
            localStorage.setItem("site-theme", next);
            updateThemeIcon(next);
        });
    }
    var loggedUser = sessionStorage.getItem("loggedInUser");
    var welcomeSpan = document.getElementById("userWelcome");
    if (loggedUser && welcomeSpan) {
        welcomeSpan.innerHTML = '<i class="fas fa-user-check"></i> أهلاً، ' + loggedUser.split('@')[0];
    }
});

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

function filterMenu() {
    var input = document.getElementById('menuSearch');
    var filter = input.value.toLowerCase();
    var cards = document.querySelectorAll('.food-card');
    var sections = document.querySelectorAll('.food-section');

    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var title = card.querySelector('.food-card-title').innerText.toLowerCase();
        var desc = card.querySelector('.food-card-desc').innerText.toLowerCase();
        if (title.indexOf(filter) > -1 || desc.indexOf(filter) > -1) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    }

    for (var j = 0; j < sections.length; j++) {
        var section = sections[j];
        var hasVisible = false;
        var sCards = section.querySelectorAll('.food-card');
        for (var k = 0; k < sCards.length; k++) {
            if (sCards[k].style.display !== "none") hasVisible = true;
        }
        section.style.display = hasVisible ? "" : "none";
    }
}

function scrollToSection(id) {
    var element = document.getElementById(id);
    if (element) {
        var offset = element.getBoundingClientRect().top + window.pageYOffset - 130;
        window.scrollTo({ top: offset, behavior: "smooth" });
        var btns = document.querySelectorAll('.shortcut-btn');
        for (var i = 0; i < btns.length; i++) btns[i].classList.remove('active');
        event.currentTarget.classList.add('active');
    }
}

function clearErrors() {
    var msgs = document.querySelectorAll('.error-msg');
    for (var i = 0; i < msgs.length; i++) {
        msgs[i].style.display = 'none';
        msgs[i].innerText = '';
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
    event.preventDefault();
    clearErrors();
    var form = document.getElementById(formId);
    var isValid = true;

    if (formId === 'reservationForm') {
        var name = document.getElementById('resName').value.trim();
        var date = document.getElementById('resDate').value.trim();
        var people = document.getElementById('resPeople').value.trim();
        if (name === '' || name.length < 3) {
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
            alert('تم تأكيد حجزك يا ' + name);
            form.reset();
        }
    } else if (formId === 'loginForm') {
        var email = document.getElementById('loginEmail').value.trim();
        var pass = document.getElementById('loginPass').value;
        if (email === '' || email.indexOf('@') === -1) {
            showError('loginEmail', 'يرجى إدخال بريد إلكتروني صحيح.');
            isValid = false;
        }
        if (pass.length < 6) {
            showError('loginPass', 'كلمة المرور قصيرة جداً.');
            isValid = false;
        }
        if (isValid) {
            sessionStorage.setItem('loggedInUser', email);
            alert('تم تسجيل الدخول!');
            window.location.href = 'index.html';
        }
    } else if (formId === 'contactForm') {
        var cName = document.getElementById('contName').value.trim();
        var cPhone = document.getElementById('contPhone').value.trim();
        var cMsg = document.getElementById('contMsg').value.trim();
        if (cName.length < 3 || cPhone.length < 8 || cMsg.length < 10) {
            alert('يرجى التأكد من ملء جميع الحقول بشكل صحيح.');
            isValid = false;
        }
        if (isValid) {
            alert('تم إرسال رسالتك بنجاح!');
            form.reset();
        }
    } else if (formId === 'registerForm') {
        var rName = document.getElementById('regName').value.trim();
        var rEmail = document.getElementById('regEmail').value.trim();
        var rPass = document.getElementById('regPass').value;
        var rConf = document.getElementById('regPassConfirm').value;
        if (rName.length < 3 || rEmail.indexOf('@') === -1 || rPass.length < 6 || rPass !== rConf) {
            alert('يرجى التأكد من البيانات وتطابق كلمة المرور.');
            isValid = false;
        }
        if (isValid) {
            sessionStorage.setItem('loggedInUser', rEmail);
            alert('تم إنشاء الحساب!');
            window.location.href = 'index.html';
        }
    }
}

function switchTab(btn) {
    var tabs = document.querySelectorAll('.search-tab');
    for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
    btn.classList.add('active');
}
