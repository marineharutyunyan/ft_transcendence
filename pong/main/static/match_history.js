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

    var translations = {
        "en": {
            "header": "Match History",
            "profile":"PROFILE",
            "homeheader": "HOME",
            "settingsId":"SETTINGS",
            "logoutId":"LOG OUT",   
            "players_list": "Players",
            "points": "Points",
            "date": "Date",
            "result": "Result"
        },
        "hy": {
            "header": "Խաղի պատմություն",
            "profile": "ԱՆՁՆԱԿԱՆ ԷՋ",
            "homeheader": "ԳԼԽԱՎՈՐ",
            "settingsId": "ԿԱՐԳԱՎՈՐՈւՄՆԵՐ",
            "logoutId": "ԴՈւՐՍ ԳԱԼ",
            "players_list": "Խաղացողներ",
            "points": "Միավորներ",
            "date": "Ամսաթիվ",
            "result": "Արդյունք"
        },
        "ru": {
            "header": "История матчей",
            "profile": "ПРОФИЛЬ",
            "homeheader": "ДОМОЙ",
            "settingsId": "НАСТРОЙКИ",
            "logoutId": "ВЫЙТИ",
            "players_list": "Игроки",
            "points": "Очки",
            "date": "Дата",
            "result": "Результат"
        },
        "cn": {
            "header": "比赛历史",
            "profile": "个人资料",
            "homeheader": "首页",
            "settingsId": "设置",
            "logoutId": "登出",
            "players_list": "玩家",
            "points": "得分",
            "date": "日期",
            "result": "结果"
        }
    };
    var language = localStorage.getItem('selectedLanguage') || 'en';  

    document.documentElement.lang = language;

    for (const property in translations[language]) {
        document.getElementById(property).innerHTML = translations[language][property];
    }
    
    // Close the menu when clicking outside of it
    window.addEventListener("click", function(event) {
        if (!event.target.matches("#profileImage") && !event.target.matches(".menu")) {
            menu.style.display = "none";
        }
    });

    const base64Image = localStorage.getItem('default_image');
    const imgElement1 = document.getElementById('profileImage');
    imgElement1.src = `data:image/jpg;base64,${base64Image}`;

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

    const token = localStorage.getItem('access');
    if (!token) {
        alert('No token found. Please log in.');
        window.location.href = '/';
        return;
    }
    const userId = extractUserIdFromToken(token);
    if (!userId) {
        alert('Invalid token. Please log in again.');
        window.location.href = '/';
        return;
    }
    const url = `http://10.12.11.2:8000/api/v1/history/${userId}/`;
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Fetched data:', data);
        if (Array.isArray(data)) {
            populateTable(data);
        } else {
            // If the response is a single object, convert it to an array
            populateTable([data]);
        }
    })
    .catch(error => console.error('Error fetching match history:', error));
});

function populateTable(data) {
    const table = document.getElementById('matchHistoryTable');

    if(data && data.length === 0)
        table.style.display = 'none'; 
    else {
        table.style.display = 'table';
        var translations = {
        "en": {
            "no_point": "N/A",
            "lose": "lose",
            "win": "win"
        },
        "hy": {
            "no_point": "-",
            "lose": "պարտություն",
            "win": "հաղթանակ"
        },
        "ru": {
            "no_point": "-",
            "lose": "проигрыш",
            "win": "победа"
        },
        "cn": {
            "no_point": "-",
            "lose": "失利",
            "win": "胜利"
        }
    };
    var selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';  

    const tableBody = document.querySelector('#matchHistoryTable tbody');
    tableBody.innerHTML = '';
        data.forEach(match => {
            const row = document.createElement('tr');

            const playerCell = document.createElement('td');
            const playerImage = document.createElement('img');
            playerImage.src = `data:image/jpg;base64,${match.image}`; // URL to the player's profile picture
            const playerName = document.createTextNode(' ' + match.username); // Add a space between the image and name
            playerCell.appendChild(playerImage);
            playerCell.appendChild(playerName);
            playerCell.setAttribute('data-label', 'Player List');

            const pointsCell = document.createElement('td');
            pointsCell.textContent = match.points ||  translations[selectedLanguage].no_point ; // Ensure points field exists or use default
            pointsCell.setAttribute('data-label', 'Points');

            const dateCell = document.createElement('td');
            dateCell.textContent = new Date(match.date).toLocaleDateString();
            dateCell.setAttribute('data-label', 'Date');

            const resultCell = document.createElement('td');
            resultCell.textContent = match.result.toLowerCase() === 'win' ? translations[selectedLanguage].win :  translations[selectedLanguage].lose;
            resultCell.classList.add(match.result.toLowerCase() === 'win' ? 'result-win' : 'result-lose');
            resultCell.setAttribute('data-label', 'Result');

            row.appendChild(playerCell);
            row.appendChild(pointsCell);
            row.appendChild(dateCell);
            row.appendChild(resultCell);

            tableBody.appendChild(row);
        });   
    }
}

