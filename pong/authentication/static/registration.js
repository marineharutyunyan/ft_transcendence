//stex el email-y hanel commentic

var input1, input2, input3, input4, input5;

function togglePasswordVisibility(inputId)
{
    var passwordInput = document.getElementById(inputId);
    var toggleButton = document.querySelector("#" + inputId + " + .toggle-password i");

    if (passwordInput.type === "password")
    {
        passwordInput.type = "text";
        toggleButton.classList.remove("fa-eye");
        toggleButton.classList.add("fa-eye-slash");
    }
    else
    {
        passwordInput.type = "password";
        toggleButton.classList.remove("fa-eye-slash");
        toggleButton.classList.add("fa-eye");
    }
}

async function hashPassword(password) {
    if (window.crypto && window.crypto.subtle) {
        // Modern browsers with Web Crypto API support
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        try {
            const hash = await crypto.subtle.digest('SHA-256', data);
            return Array.from(new Uint8Array(hash))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
        } catch (error) {
            console.error('Error hashing password with Web Crypto API:', error);
            throw error;
        }
    } else {
        // Fallback for older browsers without Web Crypto API support
        try {
            const hash = CryptoJS.SHA256(password);
            return hash.toString(CryptoJS.enc.Hex);
        } catch (error) {
            console.error('Error hashing password with crypto-js:', error);
            throw error;
        }
    }
}

document.getElementById("forSubmit").addEventListener("submit", async function(event)
{
    const language = localStorage.getItem('selectedLanguage') || 'en';
    event.preventDefault();

    if (!validateForm()) {
        alert("Please, fill in all fields!");
    }
    else if (!validatePasswords())
    {
        var texts = {
            "en": "Please, fill in all fields!",
            "hy": "Խնդրում ենք լրացնել բոլոր դաշտերը:",
            "ru": "Пожалуйста, заполните все поля!",
            "cn": "請填寫所有欄位！"
        };
        alert(texts[language]);
    }
    else
    {
        event.preventDefault();
        var randomNumber = Math.floor(Math.random() * 90000) + 10000;
        var confirmation_code = randomNumber.toString();
        
        const hashedPassword = await hashPassword(input4);
        
        document.getElementById("password").value = hashedPassword;
        document.getElementById("repeat-password").value = hashedPassword;
        
        localStorage.setItem('confirmation_code', confirmation_code)
        localStorage.setItem("name", document.getElementById("name").value);
        localStorage.setItem("username", document.getElementById("username").value);
        localStorage.setItem("email", document.getElementById("email").value);
        localStorage.setItem("password", document.getElementById("password").value);

        document.getElementById("password").value = input4;
        document.getElementById("repeat-password").value = input5;

        emailjs.init("JETvsnwoEELnExda4");
        var templateParams = {
                to_name: input1,
                message: confirmation_code,
                email: input3
            };
            emailjs.send("service_95du3v2", "template_vlnwkba", templateParams)
            .then(function(response)
            {
                console.log("Email sent successfully:", response);
                window.location.href = "/confirm/";
            }, function(error)
            {
                console.error("Failed to send email:", error);
            });
    }
});

function validateForm()
{
    input1 = document.getElementById("name").value
    input2 = document.getElementById("username").value
    input3 = document.getElementById("email").value
    input4 = document.getElementById("password").value
    input5 = document.getElementById("repeat-password").value
    return input1 !== "" && input2 !== "" && input3 !== "" && input4 !== "" && input5 !== "";
}

function validatePasswords()
{
    var password1 = document.getElementById("password").value;
    var password2 = document.getElementById("repeat-password").value;
    
    return password1 === password2;
}

function applyLanguage() {
    const language = localStorage.getItem('selectedLanguage') || 'en';
    document.documentElement.lang = language;
  
    const translations = {
            "en": {
                "name":"Name",
                "username": "Username",
                "email":"Email",
                "password":"Password",
                "repeatPassword":"Repeat Password",
                "registr":"Registration",
                "text":"Fill in the fields below",
                "continue": "Continue"
            },
            "hy": {
                "name":"Անուն",
                "username": "Օգտանուն",
                "email":"էլ հասցե",
                "password":"Գաղտնաբառ",
                "repeatPassword":"Կրկնեք գաղտնաբառը",
                "registr":"Գրանցում",
                "text":"Լրացրե՛ք ստորև նշված դաշտերը",
                "continue": "Շարունակել"
            },
            "ru": {
                "name":"Имя",
                "username": "Имя пользователя",
                "email":"Электронная почта",
                "password":"Пароль",
                "repeatPassword":"Повторите пароль",
                "registr":"Регистрация",
                "text":"Заполните поля ниже",
                "continue": "Продолжать"
            },
            "cn": {
                "name":"姓名",
                "username": "使用者名稱",
                "email":"電子郵件",
                "password":"密碼",
                "repeatPassword":"重複輸入密碼",
                "registr":"登記",
                "text":"填寫下面的字段",
                "continue": "繼續"
            },
    };
  
    document.getElementById('name').placeholder = translations[language].name;
    document.getElementById('username').placeholder = translations[language].username;
    document.getElementById('email').placeholder = translations[language].email;
    document.getElementById('password').placeholder = translations[language].password;
    document.getElementById('repeat-password').placeholder = translations[language].repeatPassword;
    document.getElementById('registr').innerText = translations[language].registr;
    document.getElementById('text').innerText = translations[language].text;
    document.getElementById('continue').value = translations[language].continue;
  }

  document.addEventListener('DOMContentLoaded', applyLanguage);
