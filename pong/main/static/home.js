 // JavaScript for the profile menu
document.addEventListener("DOMContentLoaded", function() {
  var profileImage = document.getElementById("profileImage");
  var menu = document.getElementById("menu");
  var languageSelect = document.getElementById("languageSelect");
  var selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';

  const base64Image = localStorage.getItem('default_image');
  const imgElement = document.getElementById('profileImage');
  imgElement.src = `data:image/jpg;base64,${base64Image}`;
      
  languageSelect.value = selectedLanguage;
  languageSelect.addEventListener("change", function() {
     var selectedLanguage = languageSelect.value;
     switchLanguage(selectedLanguage);
     localStorage.setItem('selectedLanguage', selectedLanguage);
  });
  
      function switchLanguage(language) {
        var translations = {
            "en": {
                "profileLink":"PROFILE",
                "home": "HOME",
                "playButton": "Play",
                "howToPlayHeader": "HOW TO PLAY ?",
                "howToPlayText": "A small ball moves across the screen, bouncing off the top and bottom ledges, and the two players each control a pad, sliding it vertically between the ends of the screen using the controls. If the ball hits the pad, it bounces back to the other player. If it misses the pad, the other player scores a point. The ball bounces in different ways depending on how it hits the pad.",
                "settingsId":"SETTINGS",
                "logoutId":"LOG OUT"
            },
            "hy": {
                "profileLink":"ԱՆՁՆԱԿԱՆ ԷՋ",
                "home": "ԳԼԽԱՎՈՐ",
                "playButton": "Խաղալ",
                "howToPlayHeader": "ԻՆՉՊԵՍ ԽԱՂԱԼ?",
                "howToPlayText": "Մի փոքրիկ գնդակը շարժվում է էկրանով, ցատկելով վերևի և ներքևի եզրերից, և երկու խաղացողներից յուրաքանչյուրը կառավարում է մի պահոց՝ այն ուղղահայաց սահեցնելով էկրանի ծայրերի միջև՝ օգտագործելով կառավարները: Եթե գնդակը դիպչում է խաղադաշտին, այն ետ է վերադառնում դեպի մյուս խաղացողը: Եթե այն բաց է թողնում պահոցը, մյուս խաղացողը միավոր է վաստակում: Գնդակը ցատկում է տարբեր ձևերով՝ կախված նրանից, թե ինչպես է այն հարվածում բարձիկին:",
                "settingsId":"ԿԱՐԳԱՎՈՐՈւՄՆԵՐ",
                "logoutId":"ԴՈւՐՍ ԳԱԼ"
            },
            "ru": {
                "profileLink":"ПРОФИЛЬ",
                "home": "ГЛАВНАЯ",
                "playButton": "Играть",
                "howToPlayHeader": "КАК ИГРАТЬ ?",
                "howToPlayText": "Маленький шарик движется по экрану, отскакивая от верхних и нижних выступов, и каждый из двух игроков управляет панелью, перемещая ее вертикально между концами экрана с помощью элементов управления. Если мяч попадает на площадку, он отскакивает обратно к другому игроку. Если он не попадает в площадку, другой игрок получает очко. Мяч отскакивает по-разному в зависимости от того, как он попадает на площадку.",
                "settingsId":"НАСТРОЙКИ",
                "logoutId":"ВЫЙТИ"
            },
            "cn": {
              "profileLink":"档案",
              "home": "家",
              "playButton":"玩",
              "howToPlayHeader": "怎麼玩？",
              "howToPlayText": "一個小球在螢幕上移動，從頂部和底部的壁架上彈起，兩個玩家各自控制一個墊子，使用控制在螢幕兩端之間垂直滑動它。 如果球擊中墊子，它會彈回給其他玩家。 如果它錯過了墊子，則其他玩家得分。 球以不同的方式彈跳，這取決於它擊中墊的方式。",
              "settingsId":"設定",
              "logoutId":"登出"
          }
        };
  
        document.getElementById("homeLink").textContent = translations[language]["home"];
        document.getElementById("howToPlayHeader").textContent = translations[language]["howToPlayHeader"];
        document.getElementById("howToPlayText").textContent = translations[language]["howToPlayText"];  
        document.getElementById("profileLink").textContent = translations[language]["profileLink"];
        document.getElementById("playButton").textContent = translations[language]["playButton"];
        document.getElementById("settingsId").textContent = translations[language]["settingsId"];
        document.getElementById("logoutId").textContent = translations[language]["logoutId"];
      }
  
      
      const url_code = window.location.search?.slice(6)
      if (url_code)
      {
      const username = localStorage.getItem('username');

      requestData = {
          "code": url_code,
          "username": username
      }
  
      const url = `http://10.12.11.2:8000/api/v1/login/`
      fetch(url, {
            method: 'POST',
            headers:
            {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
      })
      .then(response =>
      {
        if (!response.ok)
        {
          //throw new Error('Network response was not ok');
          console.log(response);
        }
        return response.json();
      })
      .then(data =>
      {
          console.log(data);
          if (data.error)
          {
            alert(data.error);
          }
          else
          {
            localStorage.setItem('access', data.access);
            localStorage.setItem('refresh', data.refresh);
            localStorage.setItem('default_image', data.image);
            const imgElement = document.getElementById('profileImage');
            imgElement.src = `data:image/jpg;base64,${data.image}`;
            const userId = extractUserIdFromToken(data.access);
            if (!userId)
            {
                alert('Invalid token. Please log in again.');
                window.location.href = '/';
                return;
            }
          }
        })
      .catch(error =>
      {
          alert("Invalid username");
          console.error('There has been a problem with your fetch operation:', error);
          window.location.href = '/';
      });
    }
  });
    
    
    profileImage.addEventListener("click", function() {
      if (menu.style.display === "block") {
        menu.style.display = "none";
      } else {
        menu.style.display = "block";
      }
});
// switchLanguage(languageSelect.value);

// Close the menu when clicking outside of it
window.addEventListener("click", function(event) {
  if (!event.target.matches("#profileImage") && !event.target.matches(".menu")) {
      menu.style.display = "none";
      }
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

document.getElementById('logoutId').addEventListener('click', function(e)
{
  const token = localStorage.getItem('access');
  const refresh = localStorage.getItem('refresh');
  requested_data = {
    "token": token,
    "refresh": refresh
  }
 
  console.log(token);
  console.log(requested_data);
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
    console.log(userId);
    console.log(token);
    console.log(requested_data);
    console.log(data);
  })

  localStorage.clear();
  window.history.pushState({}, "", '/');
  window.location.href = '/';
});

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
    if (response.status === 200) {
          window.location.href = 'http://10.12.11.2:8000/profile/';
      }
    return response.json();
})
  .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
  });

});

document.getElementById('dropdownContent').addEventListener('click', function(e)
{
  requested_data = {
    "language": localStorage.getItem('selectedLanguage')
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

  const url = `http://10.12.11.2:8000/api/v1/language/${userId}/`;
  fetch(url, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application.json',
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
    localStorage.setItem('selectedLanguage', data.language);
    switchLanguage(data.language);
  
  })
  .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
  });
})
