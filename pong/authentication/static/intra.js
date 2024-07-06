let INTRA_API_URL="https://api.intra.42.fr/";
let INTRA_API_UID="u-s4t2ud-c3ecc221ef767f89922cbba38ec8a6fba55110f767f14e283c24b036b217d6f3";
let INTRA_REDIRECT_URI="http://10.12.11.2:8000/home/";

document.getElementById("for42Submit").addEventListener("submit", function(event) {
  const language = localStorage.getItem('selectedLanguage') || 'en';
    if (!validateForm()) {
      event.preventDefault(); // Prevent the form from submitting
      var texts = {
        "en": "Please, fill the field !",
        "hy": "Խնդրում ենք լրացնել դաշտը:",
        "ru": "Пожалуйста, заполните поле!",
        "cn": "請填寫該欄位！"
    };
    alert(texts[language]); // Show an alert message
    }
    else {
      event.preventDefault(); // Prevent the form from submitting
      const username = document.getElementById("username").value;
      localStorage.setItem('username', username);
      window.location.href = `${INTRA_API_URL}/oauth/authorize?client_id=${INTRA_API_UID}&redirect_uri=${INTRA_REDIRECT_URI}&response_type=code`
    }

    
});
  
function validateForm() {
    var input1 = document.getElementById("username").value;
    return input1 !== "";
}

function applyLanguage() {
  const language = localStorage.getItem('selectedLanguage') || 'en';
  document.documentElement.lang = language;

  const translations = {
          "en": {
              "continue":"Continue with 42Intra",
              "text": "Your 42Intra username",
              "username":"Username",
              "contButton":"Continue"
          },
          "hy": {
              "continue":"Շարունակեք 42Intra-ով",
              "text":"Ձեր 42Intra օգտանունը",
              "username": "Օգտանուն",
              "contButton": "Շարունակել"
          },
          "ru": {
              "contButton": "Продолжить",
              "continue":"Продолжить с 42Intra",
              "text":"Ваше имя пользователя 42Intra",
              "username": "Имя пользователя",
          },
          "cn": {
              "continue": "繼續 42Intra",
              "username": "使用者名稱",
              "contButton":"登記",
              "text":"您的 42Intra 用戶名",
          },
  };

  document.getElementById('contButton').value = translations[language].contButton;
  document.getElementById('username').placeholder = translations[language].username;
  document.getElementById('text').innerText = translations[language].text;
  document.getElementById('continue').innerText = translations[language].continue;
}

document.addEventListener('DOMContentLoaded', applyLanguage);
