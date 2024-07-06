

// JavaScript for the profile menu
document.addEventListener("DOMContentLoaded", function()
{
  const base64Image = localStorage.getItem('default_image');
  const imgElement1 = document.getElementById('profileImage');
  const imgElement2 = document.getElementById('profileImageLarge');
  imgElement1.src = `data:image/jpg;base64,${base64Image}`;
  imgElement2.src = `data:image/jpg;base64,${base64Image}`;
  
  var menu = document.getElementById("menu");

  profileImage.addEventListener("click", function()
  {
    if (menu.style.display === "block") {
      menu.style.display = "none";
    } else {
      menu.style.display = "block";
    }
  });
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
          'Content-Type': 'application/json,',
          'Authorization': 'Bearer ' + token,
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // localStorage.setItem('profilePic', `data:image/jpg;base64,${data.image}`);
      // localStorage.setItem('profilePicLarge', `data:image/jpg;base64,${data.image}`);
      // localStorage.setItem('selectedLanguage', data.language);
      // applyLanguage();
      document.getElementById('guest').textContent = data.username;
      document.getElementById('wins').textContent = data.wins;
      document.getElementById('loses').textContent = data.loses;
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });


function applyLanguage() {
  var selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';

  const translations = {
          "en": {
              "homeheader":"HOME",
              "profile":"PROFILE",
              "settingsId": "SETTINGS",
              "logoutId":"LOG OUT",
              "prof":"Profile",
              "guest": "Username",
              "listHeader":"Friends List",
              "searchInput":"Search friends...",
              "friends":"Friends",
              "request": "Requests",
              "users":"Users",
              "removeButton":"Remove",
              "accept":"Accept",
              "decline":"Decline",
              "add":"Add",
              "matchHistory":"Match history",
              "turm":"Tournaments"
          },
          "hy": {
              "homeheader":"ԳԼԽԱՎՈՐ",
              "profile":"ԱՆՁՆԱԿԱՆ ԷՋ",
              "settingsId": "ԿԱՐԳԱՎՈՐՈՒՄՆԵՐ",
              "logoutId":"ԴՈՒՐՍ ԳԱԼ",
              "prof":"Անձնական էջ",
              "guest": "Օգտանունը",
              "listHeader":"Ընկերների ցանկ",
              "searchInput":"Փնտրել ընկերներին...",
              "friends":"Ընկերներ",
              "request": "Հարցումներ",
              "users":"Օգտատերեր",
              "removeButton":"Հեռացնել",
              "accept":"Ընդունել",
              "decline":"Մերժել",
              "add":"Ավելացնել",
              "matchHistory":"Խաղի պատմություն",
              "turm":"Մրցաշարեր"
          },
          "ru": {
              "homeheader":"ГЛАВНАЯ",
              "profile":"ПРОФИЛЬ",
              "settingsId": "НАСТРОЙКИ",
              "logoutId":"ВЫЙТИ",
              "prof":"Профиль",
              "guest": "Имя пользователя",
              "listHeader":"Список друзей",
              "searchInput":"Поиск друзей...",
              "friends":"Друзья",
              "request": "Запросы",
              "users":"Пользователи",
              "removeButton":"Удалять",
              "accept":"Принимать",
              "decline":"Отклонить",
              "add":"Добавлять",
              "matchHistory":"История матчей",
              "turm":"Турниры"
          },
          "cn": {
              "homeheader":"家",
              "profile":"档案",
              "settingsId": "設定",
              "logoutId":"登出",
              "prof":"輪廓",
              "guest": "使用者名稱",
              "listHeader":"好友列表",
              "searchInput":"搜尋好友...",
              "friends":"朋友們",
              "request": "要求",
              "users":"使用者",
              "removeButton":"消除",
              "accept":"接受",
              "decline":"衰退",
              "add":"添加",
              "matchHistory":"比賽歷史",
              "turm":"錦標賽"
          },
  };
  const elementsToTranslate = {
      'homeheader': 'homeheader',
      'profile': 'profile',
      'settingsId': 'settingsId',
      'logoutId': 'logoutId',
      'prof': 'prof',
      'guest': 'guest',
      'listHeader': 'listHeader',
      'friends': 'friends',
      'request': 'request',
      'matchHistory': 'matchHistory',
      'users':'users',
      'turm': 'turm'
  };
  
  Object.keys(elementsToTranslate).forEach(function(id) {
      var element = document.getElementById(id);
      if (element) {
          var translationKey = elementsToTranslate[id];
          element.textContent = translations[selectedLanguage][translationKey];
      }
  });
  document.getElementById('searchInput').placeholder = translations[selectedLanguage].searchInput;

  var detailsButtons = document.getElementsByClassName('details-button');
  for (var i = 0; i < detailsButtons.length; i++) {
      detailsButtons[i].innerText = translations[selectedLanguage].removeButton;
  }
  var declineButtons = document.getElementsByClassName('decline-button');
  var acceptButtons = document.getElementsByClassName('accept-button');
  for (var i = 0; i < declineButtons.length; i++) {
      declineButtons[i].innerText = translations[selectedLanguage].decline;
      acceptButtons[i].innerText = translations[selectedLanguage].accept;
  }
  var addButtons = document.getElementsByClassName('add-button');
  for (var i = 0; i < addButtons.length; i++) {
      addButtons[i].innerText = translations[selectedLanguage].add;
  }
}

applyLanguage()

// Close the menu when clicking outside of it
window.addEventListener("click", function(event) {
if (!event.target.matches("#profileImage") && !event.target.matches(".menu")) {
menu.style.display = "none";
  }
});

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

});

//All for profile page
document.getElementById('searchInput').addEventListener('input', function() {
let filter = this.value.toLowerCase();
let friends = document.querySelectorAll('.tab-content.active .friend, .tab-content.active .friend-request, .tab-content.active .friend-suggestion');
friends.forEach(friend => {
  let username = friend.querySelector('.friend-username').textContent.toLowerCase();
  if (username.includes(filter)) {
    friend.style.display = 'flex';
  } else {
    friend.style.display = 'none';
  }
});
});

const tabs = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

function openTab(event, tabName) {
  tabs.forEach(tab => tab.classList.remove('active'));
  tabContents.forEach(content => content.classList.remove('active'));

  event.currentTarget.classList.add('active');

  fetchData(tabName);
}

async function fetchData(tabName) {
  let endpoint = '';
  if (tabName === 'Friends') endpoint = 'friends';
  else if (tabName === 'Requests') endpoint = 'requests';
  else if (tabName === 'Users') endpoint = 'users_list';

  const tabContent = document.getElementById(tabName);
  tabContent.innerHTML = '<p>Loading...</p>'; // Show loading indicator

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
  const url = `http://10.12.11.2:8000/api/v1/${endpoint}/${userId}/`;

  try {
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
      },
    });
      const data = await response.json();
      tabContent.innerHTML = ''; // Clear previous content
      if (Array.isArray(data) && data.length > 0) {
        if (tabName === 'Friends') {
            data.forEach(item => {
                const div = document.createElement('div');
                const profile_src = `data:image/jpg;base64,${item.image}`;
                online_status = item.is_active ? 'Online' : 'Offline';
                div.className = 'friend';
              div.innerHTML = `
              <img src="${profile_src}" alt="${item.username}" class="friend-picture">
              <div class="friend-info">
              <span class="friend-username">${item.username}</span>
              <span class="friend-activity">${online_status}</span>
              </div>
              <button class="details-button" data-action="details" onclick="remove_friend(event, ${item.id})">Remove</button>
              `;
              tabContent.appendChild(div);
            });
        } else if (tabName === 'Requests') {
          data.forEach(item => {
            const div = document.createElement('div');
            const profile_pic = `data:image/jpg;base64,${item.image}`;
                div.className = 'friend-request';
                div.innerHTML = `
                    <img src="${profile_pic}" alt="${item.username}" class="friend-picture">
                    <div class="friend-info">
                        <span class="friend-username">${item.username}</span>
                        <button class="accept-button" data-action="accept" onclick="accept_request(event,${item.id})">Accept</button>
                        <button class="decline-button" data-action="decline" onclick="decline_request(event, ${item.id})">Decline</button>
                    </div>
                `;
                tabContent.appendChild(div);
            });
        } else if (tabName === 'Users') {
            data.forEach(item => {
                const div = document.createElement('div');
                const profile_picture = `data:image/jpg;base64,${item.image}`;
                div.className = 'friend-suggestion';
                div.innerHTML = `
                    <img src="${profile_picture}" alt="${item.username}" class="friend-picture">
                    <div class="friend-info">
                        <span class="friend-username">${item.username}</span>
                        <button class="add-button" data-action="add" onclick="add_friend(event, ${item.id})">Add</button>
                    </div>
                `;
                tabContent.appendChild(div);
            });
        }
      }

      tabContent.classList.add('active'); // Only show content after data is loaded
  } catch (error) {
      tabContent.innerHTML = '<p>Error loading data</p>';
      console.error('Error fetching data:', error);
  }
}



var dataFetched = false; // Boolean variable to check if data is fetched

document.getElementById('friends-tab').addEventListener('click', async function() {
  var friendsTab = document.getElementById('friends-tab');
  var friendsContent = document.getElementById('friends-content');
  var friendsList = document.getElementById('friends-list');

  // Check if data is already fetched
  if (dataFetched) {
      friendsTab.classList.add('active');
      friendsContent.classList.add('active');
      return;
  }

  // Fetch friends data from the server
  try {
      let response = await fetch('http://10.12.11.2:8000/api/friends');
      let data = await response.json();

      // Populate the friends list
      friendsList.innerHTML = '';
      data.forEach(friend => {
          let listItem = document.createElement('li');
          listItem.textContent = friend.name; // Adjust according to your data structure
          friendsList.appendChild(listItem);
      });

      // Set dataFetched to true and display the content
      dataFetched = true;
      friendsTab.classList.add('active');
      friendsContent.classList.add('active');
      } 
      catch (error) {
          console.error('Error fetching friends data:', error);
      }
});

// Initially hide all tab contents
tabContents.forEach(content => content.classList.remove('active'));


// Set default tab to be opened
document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('.tab-button').click();
});

  
// // document.addEventListener('DOMContentLoaded', (event) => {
// //   const activeTab = localStorage.getItem('activeTab'); // Default to 'Friends' if no tab is saved
// //   document.querySelector(`.tab-button[onclick="openTab(event, '${activeTab}')"]`).click();
// // });

// Set default tab to be opened
// document.addEventListener('DOMContentLoaded', function() {
//   document.querySelector('.tab-button').click();
// });

function goToMatchHistory() {
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

const url = `http://10.12.11.2:8000/match_history`;

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
  if (response.status === 200)
  {            
      window.location.href = url;
  }
  return response.json();
})
.catch(error => {
  console.error('There was a problem with the fetch operation:', error);
});
}

function goTournaments() {
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

const url = `http://10.12.11.2:8000/tournaments/`;

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
  if (response.status === 200)
  {            
      window.location.href = url;
  }
  return response.json();
})
.catch(error => {
  console.error('There was a problem with the fetch operation:', error);
});
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
      'Content-Type': 'application/json',

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
  alert('Invalid token. Please log in again.');
  window.location.href = '/';
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

//friends zone

function add_friend(event, id)
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
  const request_data = {
      "receiver_id": id
  }
  const url = `http://10.12.11.2:8000/api/v1/add_friend/${userId}/`;
  fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(request_data)
  })

  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
    })
}

function accept_request(event, id)
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
  const request_data = {
      "sender_id": id
  }
  const url = `http://10.12.11.2:8000/api/v1/accept/${userId}/`;
  fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(request_data)
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

}

function decline_request(event, id)
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
  const request_data = {
      "sender_id": id
  }
  const url = `http://10.12.11.2:8000/api/v1/decline/${userId}/`;
  fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(request_data)
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
}

function remove_friend(event, id)
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
  const request_data = {
      "receiver_id": id
  }
  const url = `http://10.12.11.2:8000/api/v1/remove/${userId}/`;
  fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(request_data)
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
}

// document.addEventListener('DOMContentLoaded', applyLanguage);
