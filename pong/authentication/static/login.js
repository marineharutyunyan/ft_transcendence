var input1, input2;

function togglePasswordVisibility(inputId)
{
    var passwordInput = document.getElementById(inputId);
    var toggleButton = document.querySelector("#" + inputId + " + .toggle-password i");

    if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleButton.classList.remove("fa-eye");
    toggleButton.classList.add("fa-eye-slash");
    } else {
    passwordInput.type = "password";
    toggleButton.classList.remove("fa-eye-slash");
    toggleButton.classList.add("fa-eye");
    }
}

async function hashPassword(password) {
    //
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

function extractUserIdFromToken(token) {
    // Decode the JWT token to extract the user ID
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    const decodedToken = JSON.parse(jsonPayload);
    return decodedToken.user_id;
  }



document.getElementById("forSubmit").addEventListener("submit", async function(event)
{
    event.preventDefault();
    //Check if all fields are filled and 
    if (document.activeElement.id === "continue"){
        return;
    }
    const language = localStorage.getItem('selectedLanguage') || 'en';
    if (!validateForm()) {
        // event.preventDefault(); // Prevent the form from submitting
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
        const hashedPassword = await hashPassword(input2);
        const requestData = 
        {
            email: input1,
            password: hashedPassword
        };
        fetch('http://10.12.11.2:8000/signin/',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response =>
        {
            if (!response.ok)
            {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data =>
            {
                console.log(data);
                // if (data)//data.fa = true
                //     window.location.href = '/confirm/';
                if (data.status === "error")
                {
                    alert(data.message);
                }
                else
                {
                    localStorage.setItem('access', data.access);
                    localStorage.setItem('refresh', data.refresh);
                    localStorage.setItem('default_image', data.image);

                    const userId = extractUserIdFromToken(data.access);
                    if (!userId)
                    {
                        var texts = {
                            "en": "Invalid token. Please log in again.",
                            "hy": "Անվավեր նշան: Խնդրում ենք նորից մուտք գործել:",
                            "ru": "Неверный токен. Пожалуйста, войдите снова.",
                            "cn": "令牌無效。 請重新登入。"
                        };
                        alert(texts[language]);
                      window.location.href = '/';
                      return;
                    }
                    if (data.fa === true)
                    {
                        var randomNumber = Math.floor(Math.random() * 90000) + 10000;
                        var confirmation_code = randomNumber.toString();
                        localStorage.setItem('confirmation_code_fa', confirmation_code)

                    emailjs.init("JETvsnwoEELnExda4");
                    var templateParams = {
                            to_name: 'My_friend',
                            message: confirmation_code,
                            email: input1
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
                        window.location.href = '/fa_confirm/';
                        return;
                    }
                    const url = `http://10.12.11.2:8000/home/`;
                    window.location.href = url;
                }
            })
        .catch(error =>
        {
            var texts = {
                "en": "Invalid email or password!",
                "hy": "Սխալ էլ. հասցե կամ գաղտնաբառ!",
                "ru": "Неверный адрес электронной почты или пароль!",
                "cn": "無效的電子郵件或密碼！"
            };
            alert(texts[language]);            console.error('There has been a problem with your fetch operation:', error);
        });
        
    }
});
 
// Continue submition with "Continue with 42intra" button
document.getElementById("continue").addEventListener("click", function()
{
    window.location.href = '/intra/'       
}); 



function validateForm()
{
    input1 = document.getElementById("email").value;
    input2 = document.getElementById("password").value;
    return input1 !== "" && input2 !== "";
}

function redirectToHome()
{
    window.location.href = "/";
}

function applyLanguage() {
    const language = localStorage.getItem('selectedLanguage') || 'en';
    document.documentElement.lang = language;
  
    const translations = {
            "en": {
                "header":"Welcome back",
                "text": "Signin to your account",
                "buttonSignIn":"Sign in",
                "continue":"Continue with 42Intra",
                "email":"Email",
                "password":"Password"
            },
            "hy": {
                "header":"Բարի գալուստ",
                "text": "Մուտք գործեք ձեր հաշիվ",
                "buttonSignIn":"Մուտք գործել",
                "continue":"Շարունակեք 42Intra-ով",
                "email":"էլ հասցե",
                "password":"Գաղտնաբառ"
            },
            "ru": {
                "header":"Добро пожаловать",
                "text": "Войдите в свой аккаунт",
                "buttonSignIn":"Войти",
                "continue":"Продолжить с 42Intra",
                "email":"Электронная почта",
                "password":"Пароль"
            },
            "cn": {
                "header":"歡迎回來",
                "text": "登入您的帳戶",
                "buttonSignIn":"登入",
                "continue":"繼續 42Intra",
                "email":"電子郵件",
                "password":"密碼"
            },
    };
  
    document.getElementById('header').innerText = translations[language].header;
    document.getElementById('text').innerText = translations[language].text;
    document.getElementById('buttonSignIn').value = translations[language].buttonSignIn;
    document.getElementById('continue').value = translations[language].continue;
    document.getElementById('email').placeholder = translations[language].email;
    document.getElementById('password').placeholder = translations[language].password;
  }

  document.addEventListener('DOMContentLoaded', applyLanguage);
