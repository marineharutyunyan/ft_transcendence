//stex petq a miacnel confirm code-y

function moveFocus(current, next)
{
    var length = document.getElementById(current).value.length;
    var maxLength = document.getElementById(current).getAttribute("maxlength");

    if (length >= maxLength && next)
    {
        document.getElementById(next).focus();
    }
}

function confirmCode()
{
    const language = localStorage.getItem('selectedLanguage') || 'en';
    var code = "";
    for (var i = 1; i <= 5; i++)
    {
        code += document.getElementById("digit" + i).value;
    }
    var confirmation_code = localStorage.getItem("confirmation_code");

    if (code === confirmation_code)
    {
        var texts = {
            "en": "Confirmation successful!",
            "hy": "Հաստատումը հաջողվեց:",
            "ru": "Подтверждение успешно!",
            "cn": "確認成功！"
        };
        document.getElementById("message").innerText = texts[language];
        document.getElementById("message").classList.add("success");
        document.getElementById("message").style.display = "block";
        document.querySelector(".loading").style.display = "block";

        setTimeout(function()
        {
            var texts = {
                "en": "Confirmation successful!",
                "hy": "Հաստատումը հաջողվեց:",
                "ru": "Подтверждение успешно!",
                "cn": "確認成功！"
            };
            alert(texts[language]);
            window.location.href = "/home/";
        }, 2000);
    }
    else
    {
        var texts = {
            "en": "Invalid confirmation code. Please try again.",
            "hy": "Սխալ վավերացման կոդ. Խնդրում եմ կրկին փորձեք.",
            "ru": "Неверный код подтверждения. Пожалуйста, попробуйте еще раз.",
            "cn": "確認碼無效。 請再試一次。"
        };
        document.getElementById("message").innerText = texts[language];
        document.getElementById("message").classList.add("error");
        document.getElementById("message").style.display = "block";
        
        for (var i = 1; i <= 5; i++)
        {
            document.getElementById("digit" + i).value = "";
        }
        document.getElementById("digit1").focus();
    }
}

document.querySelectorAll('.confirmation-code input').forEach(function(input)
{
    input.addEventListener('keydown', function(event)
    {
        if (event.key === 'Enter')
        {
            confirmCode();
        }
    });
});

document.querySelector('button').addEventListener('keydown', function(event)
{
    if (event.key === 'Enter')
    {
        confirmCode();
    }
});

function applyLanguage() {
    const language = localStorage.getItem('selectedLanguage') || 'en';
    document.documentElement.lang = language;

    var translations = {
        "en": {
            "confirmEmail":"Confirm your Email",
            "enterConfirm":"Please enter the confirmation code sent to your email:",
            "confirmButton":"Confirm"
        },
        "hy": {
            "confirmEmail":"Հաստատեք ձեր էլ հասցեն",
            "enterConfirm":"Խնդրում ենք մուտքագրել հաստատման կոդը, որն ուղարկվել է ձեր էլ հասցեն",
            "confirmButton":"Հաստատել"
        },
        "ru": {
            "confirmEmail":"Подтвердите ваш адрес электронной почты",
            "enterConfirm":"Пожалуйста, введите код подтверждения, отправленный на вашу электронную почту:",
            "confirmButton":"Подтверждать"
        },
        "cn": {
            "confirmEmail":"確認您的電子郵件",
            "enterConfirm":"請輸入寄至您信箱的確認碼：",
            "confirmButton":"確認"
      }
    };

    document.getElementById('confirmEmail').textContent = translations[language].confirmEmail;
    document.getElementById('enterConfirm').textContent = translations[language].enterConfirm;
    document.getElementById('confirmButton').textContent = translations[language].confirmButton;
  }

  document.addEventListener('DOMContentLoaded', applyLanguage);
