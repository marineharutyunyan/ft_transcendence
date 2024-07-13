// // JavaScript for the profile menu

// document.addEventListener("DOMContentLoaded", function() {
//     var profileImage = document.getElementById("profileImage");
//     var menu = document.getElementById("menu");

//     profileImage.addEventListener("click", function() {
//         if (menu.style.display === "block") {
//             menu.style.display = "none";
//         } else {
//             menu.style.display = "block";
//         }
//     });

//     // Close the menu when clicking outside of it
//     window.addEventListener("click", function(event) {
//         if (!event.target.matches("#profileImage") && !event.target.matches(".menu")) {
//             menu.style.display = "none";
//         }
//     });

//     const base64Image = localStorage.getItem('default_image');
//     const imgElement = document.getElementById('profileImage');
//     imgElement.src = `data:image/jpg;base64,${base64Image}`;
// });

// var profilePic = localStorage.getItem('profilePic');
// document.getElementById('profileImage').src = profilePic || 'static/images/guest.png';

// const tabs = document.querySelectorAll('.tab-button');
// const tabContents = document.querySelectorAll('.tab-content');

// // function openTab(event, tabName) {
// //     tabs.forEach(tab => tab.classList.remove('active'));
// //     tabContents.forEach(content => content.classList.remove('active'));

// //     event.currentTarget.classList.add('active');

// //     fetchData(tabName);
// // }

// function openTab(evt, tabName) {
//     // Get all elements with class="tab-content" and hide them
//     var tabContent = document.getElementsByClassName("tab-content");
//     for (var i = 0; i < tabContent.length; i++) {
//         tabContent[i].style.display = "none";
//     }

//     // Get all elements with class="tab-button" and remove the class "active"
//     var tabButtons = document.getElementsByClassName("tab-button");
//     for (var i = 0; i < tabButtons.length; i++) {
//         tabButtons[i].className = tabButtons[i].className.replace(" active", "");
//     }

//     // Show the current tab, and add an "active" class to the button that opened the tab
//     document.getElementById(tabName).style.display = "block";
//     evt.currentTarget.className+= " active";
// }

// function showJoinForm() {
//     document.getElementById('joinFormModal').style.display = 'block';
//     }
    
//     function closeModal() {
//     document.getElementById('joinFormModal').style.display = 'none';
//     }

// // handle joining the tournament

// async function fetchData(tabName) {
//     let endpoint = '';
//     if (tabName === 'Users') endpoint = 'game_users';
//     else if (tabName === 'Requests') endpoint = 'game_requests';
//     // else if (tabName === 'Tournament') endpoint = 'tournament';

//     const tabContent = document.getElementById(tabName);
//     // tabContent.innerHTML = '<p>Loading...</p>'; // Show loading indicator
    
//     const token = localStorage.getItem('access');
//     if (!token)
//     {
//       alert('No token found. Please log in.');
//       window.location.href = '/';
//       return;
//     }
//     const userId = extractUserIdFromToken(token);
//     if (!userId)
//     {
//       alert('Invalid token. Please log in again.');
//       window.location.href = '/';
//       return;
//     }

//     const url = `http://10.12.11.2:8000/api/v1/${endpoint}/${userId}/`
//     console.log(url);
//     try {
//         const response = await fetch(url, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': 'Bearer ' + token
//             }
//         });
//         const data = await response.json();

//         tabContent.innerHTML = ''; // Clear previous content

//         if (tabName === 'Users') {
//             data.forEach(item => {
//                 const div = document.createElement('div');
//                 const profile_picture = `data:image/jpg;base64,${item.image}`;
//                 div.className = 'friend';
//                 div.innerHTML = `
//                     <img src="${item.profile_picture}" alt="${item.username}" class="friend-picture">
//                     <div class="friend-info">
//                         <span class="friend-username">${item.username}</span>
//                         <span class="friend-points">${item.points_status}</span>
//                     </div>
//                     <button class="invite-button" data-action="details">Invite</button>
//                 `;
//                 tabContent.appendChild(div);
//             });
//         } else if (tabName === 'Requests') {
//             data.forEach(item => {
//                 const div = document.createElement('div');
//                 const profile_pic = `data:image/jpg;base64,${item.image}`;
//                 div.className = 'friend-request';
//                 div.innerHTML = `
//                     <img src="${item.profile_pic}" alt="${item.username}" class="friend-picture">
//                     <div class="friend-info">
//                         <span class="friend-username">${item.username}</span>
//                         <button class="accept-button" data-action="accept">Join</button>
//                         <button class="decline-button" data-action="decline">Ignore</button>
//                     </div>
//                 `;
//                 tabContent.appendChild(div);
//             });
//         }
//         tabContent.classList.add('active'); // Only show content after data is loaded
//     } catch (error) {
//         tabContent.innerHTML = '<p>Error loading data</p>';
//         console.error('Error fetching data:', error);
//     }
// }

// var dataFetched = false; // Boolean variable to check if data is fetched

// document.getElementById('friends-tab').addEventListener('click', async function() {
//     var friendsTab = document.getElementById('friends-tab');
//     var friendsContent = document.getElementById('friends-content');
//     var friendsList = document.getElementById('users-list');

//     // Check if data is already fetched
//     if (dataFetched) {
//         friendsTab.classList.add('active');
//         friendsContent.classList.add('active');
//         return;
//     }

//     // Fetch friends data from the server
//     try {
//         let response = await fetch('http://10.12.11.2:8000/api/friends');
//         let data = await response.json();

//         // Populate the friends list
//         friendsList.innerHTML = '';
//         data.forEach(friend => {
//             let listItem = document.createElement('li');
//             listItem.textContent = friend.name; // Adjust according to your data structure
//             friendsList.appendChild(listItem);
//         });

//         // Set dataFetched to true and display the content
//         dataFetched = true;
//         friendsTab.classList.add('active');
//         friendsContent.classList.add('active');
//         } 
//         catch (error) {
//             console.error('Error fetching friends data:', error);
//         }
// });


// var joinedUsers = 0;

// function joinTournament() {
// var usernameInput = document.getElementById('usernameInput').value;
// var passwordInput = document.getElementById('passwordInput').value;
// if (usernameInput && passwordInput) {
//     if (joinedUsers < 4) {
//         var userList = document.getElementById("tournamentUserList");
//         var user = document.createElement("div");
//         user.className = "tournament-user";
//         user.innerHTML = `
//             <img src="./public/guest.png" alt="User">
//             <span>${usernameInput}</span>
//         `;
//         userList.appendChild(user);
//         joinedUsers++;

//         if (joinedUsers === 4) {
//             var newTournamentButton = document.getElementById("newTournamentButton");
//             newTournamentButton.style.display = "block";
//         }

//         // Clear the input fields after submission
//         document.getElementById('usernameInput').value = '';
//         document.getElementById('passwordInput').value = '';

//         // Close the modal after submission
//         closeModal();
//     }
// } 
//     else {
//         alert("Please fill in both fields.");
//     }
// }

// // Start new tournament

// function startNewTournament(event) {
//     // Your logic for starting a new tournament
//     alert("Starting a new tournament!");
//     // Reset the tournament for new users
//     var userList = document.getElementById("tournamentUserList");
//     userList.innerHTML = '';
//     joinedUsers = 0;
//     document.getElementById("newTournamentButton").style.display = "none";
// }

//     // Initially hide all tab contents
//     tabContents.forEach(content => content.classList.remove('active'));

// // Set default tab to be opened
// document.addEventListener('DOMContentLoaded', function() {
//     document.querySelector('.tab-button').click();
// });

// // function goToMatchHistory() {
// //     window.location.href = 'match_history.html';
// // }

// function goTournaments() {
//     window.location.href = 'tournaments.html';
// }

// function extractUserIdFromToken(token) {
//     // Decode the JWT token to extract the user ID
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
//         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//     }).join(''));
  
//     const decodedToken = JSON.parse(jsonPayload);
//     return decodedToken.user_id;
//   }

// document.getElementById('logoutId').addEventListener('click', function(e)
// {
//   requested_data = {
//     "token": localStorage.getItem('access'),
//     "refresh": localStorage.getItem('refresh')
//   }
//   const token = localStorage.getItem('access');
//   if (!token)
//   {
//     alert('No token found. Please log in.');
//     window.location.href = '/';
//     return;
//   }
//   const userId = extractUserIdFromToken(token);
//   if (!userId)
//   {
//     alert('Invalid token. Please log in again.');
//     window.location.href = '/';
//     return;
//   }
//   const url = `http://10.12.11.2:8000/api/v1/logout/${userId}/`;
//   fetch(url, {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer ' + token
//     },
//     body: JSON.stringify(requested_data)
    
//   })
//   .then(response => {
//   if (!response.ok) {
//     throw new Error('Network response was not ok');
//   }
//   return response.json();
//   })
//   .then(data => {
//     console.log(data);
//   })

//   localStorage.clear();
//   window.history.pushState({}, "", '/');
//   window.location.href = '/';
// });

// //settings page
// document.getElementById('settingsId').addEventListener('click', function(e)
// {
//     e.preventDefault();
//     const token = localStorage.getItem('access');
//     if (!token)
//     {
//         alert('No token found. Please log in.');
//         window.location.href = '/';
//         return;
//     }
//     const userId = extractUserIdFromToken(token);
//     if (!userId)
//     {
//         window.location.href = '/';
//         alert('Invalid token. Please log in again.');
//         return;
//     }

// const url = `http://10.12.11.2:8000/api/v1/settings/${userId}/`;
// fetch(url, {
//   method: 'GET',
//   headers: {
//       'Content-Type': 'application/json',
//       'Authorization': 'Bearer ' + token
//   },
// })
// .then(response => {
// if (!response.ok) {
//   throw new Error('Network response was not ok');
// }
// return response.json();
// })
// .then(data => {
// // Assuming your Django view will return a JSON response with user data

// console.log(data);
// window.location.href = `http://10.12.11.2:8000/settings/`;
// })
// //   .then(response => {
// //     if (!response.ok) {
// //         throw new Error('Network response was not ok');
// //     }
// //     // console.log(data);
// //     if (response.status === 200) {
// //       console.log("Settings page");
// //         // return response.json();
// //         // console.log(data.message);
// //           window.location.href = url;
// //       }
// //     return response.json(); // Ensure response is converted to JSON here
// // })
// .catch(error => {
//   console.error('There was a problem with the fetch operation:', error);
// });
// });

// //profile page

// document.getElementById('profileId').addEventListener('click', function(e)
// {
//   e.preventDefault();
//   const token = localStorage.getItem('access');
//   if (!token)
//   {
//     alert('No token found. Please log in.');
//     window.location.href = '/';
//     return;
//   }
//   const userId = extractUserIdFromToken(token);
//   if (!userId)
//   {
//     alert('Invalid token. Please log in again.');
//     window.location.href = '/';
//     return;
//   }
  
//   const url = `http://10.12.11.2:8000/api/v1/profile_info/${userId}/`;
//   fetch(url, {
//       method: 'GET',
//       headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer ' + token
//       },
//   })
//   .then(response => {
//     if (!response.ok) {
//         throw new Error('Network response was not ok');
//     }
//     console.log(response.status);
//     if (response.status === 200) {
//           window.location.href = 'http://10.12.11.2:8000/profile/';
//       }
//     return response.json();
// })
//   .catch(error => {
//       console.error('There was a problem with the fetch operation:', error);
//   });
// });

// //home page
// document.getElementById('homeId').addEventListener('click', function(e)
// {
//     const token = localStorage.getItem('access');
//     if (!token)
//     {
//         alert('No token found. Please log in.');
//         window.location.href = '/';
//         return;
//     }
//     const userId = extractUserIdFromToken(token);
//     if (!userId)
//     {
//         alert('Invalid token. Please log in again.');
//         window.location.href = '/';
//         return;
// }

//     const url = `http://10.12.11.2:8000/home/`;

//     fetch(url, {
//     method: 'GET',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     })
//     .then(response => {
//     if (!response.ok) {
//         throw new Error('Network response was not ok');
//     }
//     if (response.status === 200)
//     {            
//         window.location.href = url;
//     }
//     return response.json();
//     })
//     .catch(error => {
//     console.error('There was a problem with the fetch operation:', error);
//     });
// });











// function applyLanguage() {
//     var selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';

//     const translations = {
//             "en": {
//                 "homeheader":"HOME",
//                 "profile":"PROFILE",
//                 "settingsId": "SETTINGS",
//                 "logoutId":"LOG OUT",
//                 "tourn":"Tournaments",
//                 "user":"Users",
//                 "resuest":"Requests",
//                 "tournament":"Tournament",
//                 "joinTourn":"Join Tournament",
//                 "h2Header":"Joined Users:",
//                 "accept-button":"Join",
//                 "decline-button":"Ignore",
//                 "invite-button":"Invite"
//             },
//             "hy": {
//                 "homeheader":"ԳԼԽԱՎՈՐ",
//                 "profile":"ՊՐՈՖԻԼ",
//                 "settingsId": "ԿԱՐԳԱՎՈՐՈՒՄՆԵՐ",
//                 "logout":"ԴՈՒՐՍ ԳԱԼ",
//                 "tourn":"Մրցաշարեր",
//                 "user":"Օգտատերեր",
//                 "resuest":"Հարցումներ",
//                 "tournament":"Մրցաշար",
//                 "joinTourn":"Միացեք մրցաշարին",
//                 "h2Header":"Միացած օգտատերեր:",
//                 "accept-button":"Միանալ",
//                 "decline-button":"Անտեսել",
//                 "invite-button":"Հրավիրել"
//             },
//             "ru": {
//                 "homeheader":"ГЛАВНАЯ",
//                 "profile":"ПРОФИЛЬ",
//                 "settingsId": "НАСТРОЙКИ",
//                 "logoutId":"ВЫЙТИ",
//                 "tourn":"Турниры",
//                 "user":"Пользователи",
//                 "resuest":"Запросы",
//                 "tournament":"Турнир",
//                 "joinTourn":"Присоединяйтесь к турниру",
//                 "h2Header":"Присоединившиеся пользователи:",
//                 "accept-button":"Присоединиться",
//                 "invite-button":"Приглашать",
//                 "decline-button":"Игнорировать"
//             },
//             "cn": {
//                 "homeheader":"家",
//                 "profile":"档案",
//                 "settingsId": "設定",
//                 "logoutId":"登出",
//                 "tourn":"錦標賽",
//                 "user":"使用者",
//                 "resuest":"要求",
//                 "tournament":"比賽",
//                 "joinTourn":"參加錦標賽",
//                 "h2Header":"已加入用戶:",
//                 "accept-button":"加入",
//                 "invite-button":"邀請",
//                 "decline-button":"忽略"
//             },
//     };

//     const elementsToTranslate = {
//         'homeheader': 'homeheader',
//         'profile': 'profile',
//         'settingsId': 'settingsId',
//         'logoutId': 'logoutId',
//         'tourn': 'tourn',
//         'user': 'user',
//         'resuest': 'resuest',
//         'tournament': 'tournament',
//         'joinTourn': 'joinTourn',
//         'h2Header': 'h2Header'
//     };

//     Object.keys(elementsToTranslate).forEach(id => {
//         const element = document.getElementById(id);
//         if (element) {
//             element.textContent = translations[selectedLanguage][elementsToTranslate[id]];
//         }
//     });

//     const classElementsToTranslate = {
//         'accept-button': 'accept-button',
//         'invite-button': 'invite-button',
//         'decline-button': 'decline-button',
//     };

//     Object.keys(classElementsToTranslate).forEach(className => {
//         const elements = document.getElementsByClassName(className);
//         const translationKey = classElementsToTranslate[className];
//         Array.from(elements).forEach(element => {
//             element.innerText = translations[selectedLanguage][translationKey];
//         });
//     });
//   }

// applyLanguage()



// JavaScript for the profile menu
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

    // Close the menu when clicking outside of it
    window.addEventListener("click", function(event) {
        if (!event.target.matches("#profileImage") && !event.target.matches(".menu")) {
            menu.style.display = "none";
        }
    });
    });


var profilePic = localStorage.getItem('profilePic');
document.getElementById('profileImage').src = profilePic || 'profile.jpg';

function openTab(evt, tabName) {
    // Get all elements with class="tab-content" and hide them
    var tabContent = document.getElementsByClassName("tab-content");
    for (var i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    // Get all elements with class="tab-button" and remove the class "active"
    var tabButtons = document.getElementsByClassName("tab-button");
    for (var i = 0; i < tabButtons.length; i++) {
        tabButtons[i].className = tabButtons[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className+= " active";
}

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

    const url = `http://10.12.17.4:8000/api/v1/validate_user/${userId}/`;
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

    const url = `http://10.12.17.4:8000/api/v1/join_tournament/${userId}/`;
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

async function startNewTournament(event) {
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
debugger
    const url = `http://10.12.17.4:8000/api/v1/start_tournament/${userId}/`;

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
// const parsedData = JSON.parse(data);
        // console.log(parsedData)
        localStorage.setItem('users', data.users);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
        // Your logic for starting a new tournament
alert("Havala");
    console.log(url);
    // url = 'http://10.12.17.4:8000/local_tournament/';
    debugger
    // console.log(url);
    window.location.href = 'http://10.12.17.4:8000/local_tournament/';
    // console.log(url);
// Reset the tournament for new users
var userList = document.getElementById("tournamentUserList");
userList.innerHTML = '';
joinedUsers = 0;
document.getElementById("newTournamentButton").style.display = "none";
}


tabContents.forEach(content => content.classList.remove('active'));

// Set default tab to be opened
document.addEventListener('DOMContentLoaded', function() {
document.querySelector('.tab-button').click();
});

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
                "h2Header":"Joined Users:",
                "accept-button":"Join",
                "decline-button":"Ignore",
                "invite-button":"Invite"
            },
            "hy": {
                "homeheader":"ԳԼԽԱՎՈՐ",
                "profile":"ՊՐՈՖԻԼ",
                "settingsId": "ԿԱՐԳԱՎՈՐՈՒՄՆԵՐ",
                "logout":"ԴՈՒՐՍ ԳԱԼ",
                "tourn":"Մրցաշարեր",
                "user":"Օգտատերեր",
                "resuest":"Հարցումներ",
                "tournament":"Մրցաշար",
                "joinTourn":"Միացեք մրցաշարին",
                "h2Header":"Միացած օգտատերեր:",
                "accept-button":"Միանալ",
                "decline-button":"Անտեսել",
                "invite-button":"Հրավիրել"
            },
            "ru": {
                "homeheader":"ГЛАВНАЯ",
                "profile":"ПРОФИЛЬ",
                "settingsId": "НАСТРОЙКИ",
                "logoutId":"ВЫЙТИ",
                "tourn":"Турниры",
                "user":"Пользователи",
                "resuest":"Запросы",
                "tournament":"Турнир",
                "joinTourn":"Присоединяйтесь к турниру",
                "h2Header":"Присоединившиеся пользователи:",
                "accept-button":"Присоединиться",
                "invite-button":"Приглашать",
                "decline-button":"Игнорировать"
            },
            "cn": {
                "homeheader":"家",
                "profile":"档案",
                "settingsId": "設定",
                "logoutId":"登出",
                "tourn":"錦標賽",
                "user":"使用者",
                "resuest":"要求",
                "tournament":"比賽",
                "joinTourn":"參加錦標賽",
                "h2Header":"已加入用戶:",
                "accept-button":"加入",
                "invite-button":"邀請",
                "decline-button":"忽略"
            },
    };
    const elementsToTranslate = {
        'homeheader': 'homeheader',
        'profile': 'profile',
        'settingsId': 'settingsId',
        'logoutId': 'logoutId',
        'tourn': 'tourn',
        'user': 'user',
        'resuest': 'resuest',
        'tournament': 'tournament',
        'joinTourn': 'joinTourn',
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
 