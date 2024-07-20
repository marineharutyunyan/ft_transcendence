document.addEventListener("DOMContentLoaded", function() {
    var profileImage = document.getElementById("profileImage");
    var menu = document.getElementById("menu");

    profileImage.addEventListener("click", function() {
        if (menu.style.display === "block") {
            menu.style.display = "none";
        } else {
            menu.style.display = "block";
        }
    });
    const base64Image = localStorage.getItem('default_image');
    const imgElement = document.getElementById('profileImage');
    imgElement.src = `data:image/jpg;base64,${base64Image}`;

    window.addEventListener("click", function(event) {
        if (!event.target.matches("#profileImage") && !event.target.matches(".menu")) {
            menu.style.display = "none";
        }
    });
    });

document.getElementById('Tournament').style.display = "block";

var profilePic = localStorage.getItem('profilePic');
document.getElementById('profileImage').src = profilePic || 'default_user.jpg';

function showJoinForm() {
    document.getElementById('joinFormModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('joinFormModal').style.display = 'none';
}

var joinedUsers = 0;

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

async function validateUser(username, password) {
    token = localStorage.getItem('access');
    if (!token)
    {
        alert('No token found. Please log in.');
        window.location.href = '/';
        return;
    }
    const userId = extractUserIdFromToken(token);
    if (!userId)
    {
        alert('Invalid token. Please log in again.');
        window.location.href = '/';
        return;
    }

    const url = `http://10.12.11.2:8000/api/v1/validate_user/${userId}/`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ username: username, password: password })
        });
        const result = await response.json();
        return true;
    } catch (error) {
        console.error('Error validating user:', error);
        return false;
    }
}



async function joinTournament() {
var isValidUser = true;
var usernameInput = document.getElementById('usernameInput').value;
var passwordInput = document.getElementById('passwordInput').value;
const hashedPassword = await hashPassword(passwordInput);
    const token = localStorage.getItem('access');
    if (!token)
    {
        alert('No token found. Please log in.');
        window.location.href = '/';
        return;
    }
    const userId = extractUserIdFromToken(token);
    if (!userId)
    {
        alert('Invalid token. Please log in again.');
        window.location.href = '/';
        return;
    }

    const url = `http://10.12.11.2:8000/api/v1/join_tournament/${userId}/`;
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({requested_data: {username: usernameInput, password: hashedPassword}})
    })
    .then(response => {
        debugger;
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        // localStorage.setItem('default_image', image);
    })
    .catch(error => {
        debugger;
        isValidUser = false;
        // event.preventDefault();
        console.error('There was a problem with the fetch operation:', error);
    });

if (usernameInput && passwordInput) {
// const isValidUser = await validateUser(usernameInput, passwordInput);
    if (isValidUser == true) {
    if (joinedUsers < 4) {
        var userList = document.getElementById("tournamentUserList");
        var user = document.createElement("div");
        user.className = "tournament-user";
        user.innerHTML = `
                        <span>${usernameInput}</span>
        `;
        userList.appendChild(user);
        joinedUsers++;

        if (joinedUsers === 4) {
            var newTournamentButton = document.getElementById("newTournamentButton");
            newTournamentButton.style.display = "block";
            startNewTournament();
        }
// Clear the input fields after submission
        document.getElementById('usernameInput').value = '';
        document.getElementById('passwordInput').value = '';

        // Close the modal after submission
        closeModal();
    }

}   else {
        isValidUser = true;
        alert("Invalid username or password. Please try again");
    }
 
}else {
        alert("Please fill in both fields.");

    }
}

async function startNewTournament() {
    const token = localStorage.getItem('access');
    if (!token)
    {
        alert('No token found. Please log in.');
        window.location.href = '/';
        return;
    }
    const userId = extractUserIdFromToken(token);
    if (!userId)
    {
        alert('Invalid token. Please log in again.');
        window.location.href = '/';
        return;
    }
    const url = `http://10.12.11.2:8000/api/v1/start_tournament/${userId}/`;

    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();

    })
    .then(data => {
        console.log(data);
    localStorage.setItem('users', data.users);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    window.location.href = 'http://10.12.11.2:8000/local_tournament/';

    var userList = document.getElementById("tournamentUserList");
    userList.innerHTML = '';
    joinedUsers = 0;
    document.getElementById("newTournamentButton").style.display = "none";
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
document.getElementById('logoutId').addEventListener('click', function(e)
{
  requested_data = {
    "token": localStorage.getItem('access'),
    "refresh": localStorage.getItem('refresh')
  }
  const token = localStorage.getItem('access');
  if (!token)
  {
    alert('No token found. Please log in.');
    window.location.href = '/';
    return;
  }
  const userId = extractUserIdFromToken(token);
  if (!userId)
  {
    alert('Invalid token. Please log in again.');
    window.location.href = '/';
    return;
  }
  const url = `http://10.12.11.2:8000/api/v1/logout/${userId}/`;
  fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(requested_data)
    
  })
  .then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
  })
  .then(data => {
    console.log(data);
  })
  localStorage.clear();
  window.history.pushState({}, "", '/');
  window.location.href = '/';
});
//settings page
document.getElementById('settingsId').addEventListener('click', function(e)
{
    e.preventDefault();
    const token = localStorage.getItem('access');
    if (!token)
    {
        alert('No token found. Please log in.');
        window.location.href = '/';
        return;
    }
    const userId = extractUserIdFromToken(token);
    if (!userId)
    {
        window.location.href = '/';
        alert('Invalid token. Please log in again.');
        return;
    }
    const url = `http://10.12.11.2:8000/api/v1/settings/${userId}/`;
    fetch(url, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    },
    })
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Assuming your Django view will return a JSON response with user data
        console.log(data);
        window.location.href = `http://10.12.11.2:8000/settings/`;
    })
//   .then(response => {
//     if (!response.ok) {
//         throw new Error('Network response was not ok');
//     }
//     // console.log(data);
//     if (response.status === 200) {
//       console.log("Settings page");
//         // return response.json();
//         // console.log(data.message);
//           window.location.href = url;
//       }
//     return response.json(); // Ensure response is converted to JSON here
// })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});
//profile page
document.getElementById('profileId').addEventListener('click', function(e)
{
  e.preventDefault();
  const token = localStorage.getItem('access');
  if (!token)
  {
    alert('No token found. Please log in.');
    window.location.href = '/';
    return;
  }
  const userId = extractUserIdFromToken(token);
  if (!userId)
  {
    alert('Invalid token. Please log in again.');
    window.location.href = '/';
    return;
  }
  
  const url = `http://10.12.11.2:8000/api/v1/profile_info/${userId}/`;
  fetch(url, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
      },
  })
  .then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    console.log(response.status);
    if (response.status === 200) {
          window.location.href = 'http://10.12.11.2:8000/profile/';
      }
    return response.json();
})
  .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
  });
});
//home page
document.getElementById('homeId').addEventListener('click', function(e)
{
    const token = localStorage.getItem('access');
    if (!token)
    {
        alert('No token found. Please log in.');
        window.location.href = '/';
        return;
    }
    const userId = extractUserIdFromToken(token);
    if (!userId)
    {
        alert('Invalid token. Please log in again.');
        window.location.href = '/';
        return;
}
    const url = `http://10.12.11.2:8000/home/`;
    fetch(url, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    },
    })
    .then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    if (response.status === 200)
    {            
        window.location.href = url;
    }
    return response.json();
    })
    .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
    });
});
function applyLanguage() {
    var selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    const translations = {
            "en": {
                "homeheader":"HOME",
                "profile":"PROFILE",
                "settingsId": "SETTINGS",
                "logoutId":"LOG OUT",
                "tourn":"Tournaments",
                "user":"Users",
                "resuest":"Requests",
                "tournament":"Tournament",
                "joinTourn":"Join Tournament",
                "joinFormHeader":"Join Tournament",
                "newTournamentButton": "Start New Tournament",
                "submitForm": "Submit",
                "h2Header":"Joined Users:",
                "accept-button":"Join",
                "decline-button":"Ignore",
                "invite-button":"Invite",
                "username": "Username",
                "password":"Password",
            },
            "hy": {
                "homeheader":"ԳԼԽԱՎՈՐ",
                "profile":"ՊՐՈՖԻԼ",
                "settingsId": "ԿԱՐԳԱՎՈՐՈՒՄՆԵՐ",
                "logoutId":"ԴՈՒՐՍ ԳԱԼ",
                "tourn":"Մրցաշարեր",
                "newTournamentButton": "Սկսեք նոր մրցաշար",
                "user":"Օգտատերեր",
                "resuest":"Հարցումներ",
                "tournament":"Մրցաշար",
                "joinTourn":"Միացեք մրցաշարին",
                "joinFormHeader":"Միացեք մրցաշարին",
                "submitForm": "Միանալ",
                "h2Header":"Միացած օգտատերեր:",
                "accept-button":"Միանալ",
                "decline-button":"Անտեսել",
                "invite-button":"Հրավիրել",
                "username": "Օգտանուն",
                "password":"Գաղտնաբառ",
            },
            "ru": {
                "homeheader":"ГЛАВНАЯ",
                "profile":"ПРОФИЛЬ",
                "settingsId": "НАСТРОЙКИ",
                "logoutId":"ВЫЙТИ",
                "tourn":"Турниры",
                "newTournamentButton": "Начать новый турнир",
                "user":"Пользователи",
                "resuest":"Запросы",
                "tournament":"Турнир",
                "joinTourn":"Присоединяйтесь к турниру",
                "joinFormHeader":"Присоединяйтесь к турниру",
                "submitForm": "Присоединятся",
                "h2Header":"Присоединившиеся пользователи:",
                "accept-button":"Присоединиться",
                "invite-button":"Приглашать",
                "decline-button":"Игнорировать",
                "username": "Имя пользователя",
                "password":"Пароль",
            },
            "cn": {
                "homeheader":"家",
                "profile":"档案",
                "settingsId": "設定",
                "logoutId":"登出",
                "tourn":"錦標賽",
                "user":"使用者",
                "resuest":"要求",
                "newTournamentButton": "开始新锦标赛",
                "tournament":"比賽",  
                "submitForm": "连接",  
                "joinTourn":"參加錦標賽",
                "joinFormHeader":"參加錦標賽",
                "h2Header":"已加入用戶:",
                "accept-button":"加入",
                "invite-button":"邀請",
                "decline-button":"忽略",
                "username": "使用者名稱",
                "password":"密碼",
            },
    };

    document.getElementById('usernameInput').placeholder = translations[selectedLanguage].username;
    document.getElementById('passwordInput').placeholder = translations[selectedLanguage].password;

    const elementsToTranslate = {
        'homeheader': 'homeheader',
        'profile': 'profile',
        'settingsId': 'settingsId',
        'logoutId': 'logoutId',
        'tourn': 'tourn',
        'user': 'user',
        'resuest': 'resuest',
        "newTournamentButton":"newTournamentButton",
        'tournament': 'tournament',
        'joinTourn': 'joinTourn',
        'submitForm': 'submitForm',
        'joinFormHeader': 'joinFormHeader',
        'h2Header': 'h2Header'
    };
    Object.keys(elementsToTranslate).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = translations[selectedLanguage][elementsToTranslate[id]];
        }
    });
    const classElementsToTranslate = {
        'accept-button': 'accept-button',
        'invite-button': 'invite-button',
        'decline-button': 'decline-button',
    };
    Object.keys(classElementsToTranslate).forEach(className => {
        const elements = document.getElementsByClassName(className);
        const translationKey = classElementsToTranslate[className];
        Array.from(elements).forEach(element => {
            element.innerText = translations[selectedLanguage][translationKey];
        });
    });
  }
applyLanguage()
 