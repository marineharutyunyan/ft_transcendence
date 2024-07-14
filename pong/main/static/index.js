var languageSelect = document.getElementById("languageSelect");
var selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';

languageSelect.value = selectedLanguage;
languageSelect.addEventListener("change", function() {
    var selectedLanguage = languageSelect.value;
    localStorage.setItem('selectedLanguage', selectedLanguage);
    applyLanguage();
});

function applyLanguage() {
    const language = localStorage.getItem('selectedLanguage') || 'en';
    document.documentElement.lang = language;

    var translations = {
        "en": {
            "header":"Welcome to Pong Game! Let's Play and Connect!",
            "text":"Play the classic Pong game, chat with friends, and compete in real-time matches.",
            "buttonSignIn":"Sign In",
            "buttonSignUp": "Sign Up",
            "or": "OR",
        },
        "hy": {
            "header":"Բարի գալուստ Pong Game: Եկեք խաղանք և միացնենք:",
            "text":"Խաղացեք դասական Pong խաղը, զրուցեք ընկերների հետ և մրցեք իրական ժամանակի խաղերում:",
            "buttonSignIn":"Մուտք",
            "buttonSignUp": "Գրանցվել",
            "or": "ԿԱՄ"
        },
        "ru": {
            "header":"Добро пожаловать в игру Pong! Играйте и общайтесь!",
            "text":"Играйте в классическую игру Pong, общайтесь с друзьями и соревнуйтесь в реальном времени.",
            "buttonSignIn":"Войти",
            "buttonSignUp": "Зарегистрироваться",
            "or": "ИЛИ"
        },
        "cn": {
            "header":"欢迎来到乒乓游戏！让我们一起玩耍和连接！",
            "text":"玩经典的乒乓游戏，与朋友聊天，参加实时比赛。",
            "buttonSignIn":"登录",
            "buttonSignUp": "注册",
            "or": "或者"
        }
    };


    debugger;
    for (const property in translations[language]) {
        document.getElementById(property).innerHTML = translations[language][property];
        // console.log(`${property}: ${object[property]}`);
    }
    // document.getElementById('confirmEmail').textContent = translations[language].confirmEmail;
    // document.getElementById('enterConfirm').textContent = translations[language].enterConfirm;
    // document.getElementById('confirmButton').textContent = translations[language].confirmButton;
}

document.addEventListener('DOMContentLoaded', applyLanguage);
