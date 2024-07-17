
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
const imgElement1 = document.getElementById('profileImage');
const imgElement2 = document.getElementById('profileImageLarge');
imgElement1.src = `data:image/jpg;base64,${base64Image}`;
imgElement2.src = `data:image/jpg;base64,${base64Image}`;
// Close the menu when clicking outside of it
window.addEventListener("click", function(event) {
    if (!event.target.matches("#profileImage") && !event.target.matches(".menu")) {
        menu.style.display = "none";
    }
      });
});     

// console.log(imgElement1.src);

// Edit profile picture

document.getElementById('editProfileBtn').addEventListener('click', async function() {
    document.getElementById('profilePicInput').click();
});

// Handle profile picture change
document.getElementById('profilePicInput').addEventListener('change', async function(e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function() {
        var base64Image = reader.result;
        localStorage.setItem('profilePic', base64Image);
        document.getElementById('profileImage').src = base64Image;
        document.getElementById('profileImageLarge').src = base64Image;

        // Upload the new profile picture to the backend
        uploadProfilePicture(base64Image);
    };
    reader.readAsDataURL(file);
});

async function uploadProfilePicture(base64Image) {
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

    const url = `http://10.12.11.2:8000/api/v1/set_profile_pic/${userId}/`;
    
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ image: base64Image })
        });

        if (response.ok) {
            const data = await response.json();
            alert('Profile picture uploaded successfully!');
            base64EncodedImage  = base64Image.slice(22);
            if (base64EncodedImage[0] == ",")
              base64EncodedImage  = base64EncodedImage.slice(1);
            localStorage.setItem('default_image', base64EncodedImage); // Store the new default image
        } else {
            const errorData = await response.json();
            alert('Error uploading profile picture: ' + errorData.message);
        }
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('Error uploading profile picture. Please try again later.');
    }
}
    
// document.getElementById('profilePicInput').addEventListener('change', function(e) {
//     var file = e.target.files[0];
//     var reader = new FileReader();
//     reader.onload = function() {
//         var base64Image = reader.result;
//         localStorage.setItem('profilePic', base64Image);
//         document.getElementById('profileImage').src = base64Image;
//         document.getElementById('profileImageLarge').src = base64Image;
//     };
//     reader.readAsDataURL(file);
// });


// Remove profile picture
document.getElementById('removeProfileBtn').addEventListener('click', function()
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
    const url = `http://10.12.11.2:8000/api/v1/remove_profile_pic/${userId}/`;
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
            
        }
        return response.json();
    })
    .then(data => {
        console.log(data.image);
        localStorage.setItem('default_image', data.image);
        alert('Profile picture removed successfully!');
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});
    
    var profileName = localStorage.getItem('profileName');
    var userName = localStorage.getItem('userName');
    var userEmail = localStorage.getItem('userEmail');
    var userPassword = localStorage.getItem('userPassword');
      
// Populate form with existing values
    document.getElementById('profileName1').value = localStorage.getItem('profileName') || '';
    document.getElementById('userName1').value = localStorage.getItem('userName') || '';
    document.getElementById('userEmail1').value = localStorage.getItem('userEmail') || '';
    document.getElementById('userPassword1').value = localStorage.getItem('userPassword') || '';

// Edit username
document.getElementById('editBtn1').addEventListener('click', function() {
    document.getElementById('profileName').style.display = 'none';
    document.getElementById('profileName1').style.display = 'inline-block';
    document.getElementById('profileName1').focus();
});

document.getElementById('editBtn2').addEventListener('click', function() {
    document.getElementById('userName').style.display = 'none';
    document.getElementById('userName1').style.display = 'inline-block';
    document.getElementById('userName1').focus();
});

document.getElementById('editBtn3').addEventListener('click', function() {
    document.getElementById('userEmail').style.display = 'none';
    document.getElementById('userEmail1').style.display = 'inline-block';
    document.getElementById('userEmail1').focus();
});

document.getElementById('editBtn4').addEventListener('click', function() {
    document.getElementById('userPassword').style.display = 'none';
    document.getElementById('userPassword1').style.display = 'inline-block';
    document.getElementById('userPassword1').focus();
});

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



// Save changes
document.getElementById('saveChangesBtn').addEventListener('click', async function(e) {
    e.preventDefault();
    var profileName = document.getElementById('profileName1').value;
    var userName = document.getElementById('userName1').value;
    var userEmail = document.getElementById('userEmail1').value;
    var userPassword = document.getElementById('userPassword1').value;
    const hashedPassword = await hashPassword(userPassword);
    
    var requestData = {};
    if (profileName.trim() !== "") {
        requestData.name = profileName;
    }

    if (userName.trim() !== "") {
        requestData.username = userName;
    }

    if (userEmail.trim() !== "") {
        requestData.email = userEmail;
    }

    if (userPassword.trim() !== "") {
        requestData.password = hashedPassword;
    }

    console.log(requestData);
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

    const url = `http://10.12.11.2:8000/api/v1/change_settings/${userId}/`;

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        if (response.status === 200)
        {
            alert('Changes saved successfully!');
            window.location.href = `http://10.12.11.2:8000/settings/`;
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});

//Listen for Enter key press to save changes
document.getElementById('profileName1').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('saveChangesBtn').click();
    }
});

document.getElementById('userName1').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('saveChangesBtn').click();
    }
});

document.getElementById('userEmail1').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('saveChangesBtn').click();
    }
});

document.getElementById('userPassword1').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('saveChangesBtn').click();
    }
});

function togglePasswordVisibility(inputId) {
    var passwordInput = document.getElementById(inputId);
    var icon = passwordInput.nextElementSibling.querySelector('i');
    
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = "password";
        icon.className = 'fas fa-eye';
    }
}

document.getElementById('editBtn4').addEventListener('click', function() {
    var passwordContainer = document.getElementById('passwordContainer');
    passwordContainer.style.display = 'inline-block';
          
    var passwordInput = document.getElementById('userPassword1');
    passwordInput.focus();
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

// Delete account
document.getElementById('deleteAccountBtn').addEventListener('click', function(e) {
    e.preventDefault();

    var question = confirm('Are you sure you want to delete your account?');
    if (!question) {
        return;
    }

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

    const url = `http://10.12.11.2:8000/api/v1/delete_account/${userId}/`;

    fetch(url, {
        method: 'DELETE',
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
        if (response.status === 200)
        {            
            alert('Account deleted successfully!');
            window.history.pushState({}, "", '/');
            localStorage.clear();
            window.location.href = '/';
        }
        return response.json();
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});

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

document.getElementById('profileId').addEventListener('click', function(e)
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
        if (response.status === 200)
        {
            window.location.href = 'http://10.12.11.2:8000/profile/';
        }
        return response.json();
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
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

function applyLanguage() {
    var selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    // var selectedLanguage = 'hy';

    const translations = {
            "en": {
                "homeheader":"HOME",
                "profile":"PROFILE",
                "settingsId": "SETTINGS",
                "logoutId":"LOG OUT",
                "h1Header":"Settings",
                "profileName":"Edit Profile Name",
                "userName":"Edit Profile Username",
                "userEmail":"Edit Profile Email",
                "userPassword":"Change Password",
                "deleteAccountBtn":"Delete Account",
                "saveChangesBtn":"Save Changes"
            },
            "hy": {
                "homeheader":"ԳԼԽԱՎՈՐ",
                "profile":"ԱՆՁՆԱԿԱՆ ԷՋ",
                "settingsId": "ԿԱՐԳԱՎՈՐՈՒՄՆԵՐ",
                "logoutId":"ԴՈՒՐՍ ԳԱԼ",
                "h1Header":"Կարգավորումներ",
                "profileName":"Խմբագրել պրոֆիլի անունը",
                "userName":"Խմբագրել պրոֆիլի օգտանունը",
                "userEmail":"Խմբագրել պրոֆիլի էլ հասցեն",
                "userPassword":"Փոխել գաղտնաբառը",
                "deleteAccountBtn":"Հաշիվը ջնջել",
                "saveChangesBtn":"Պահպանել փոփոխությունները"
            },
            "ru": {
                "homeheader":"ГЛАВНАЯ",
                "profile":"ПРОФИЛЬ",
                "settingsId": "НАСТРОЙКИ",
                "logoutId":"ВЫЙТИ",
                "h1Header":"Настройки",
                "profileName":"Изменить имя профиля",
                "userName":"Изменить имя пользователя профиля",
                "userEmail":"Изменить адрес эл. почты профиля",
                "userPassword":"Изменить пароль",
                "deleteAccountBtn":"Удалить аккаунт",
                "saveChangesBtn":"Сохранить изменения"
            },
            "cn": {
                "homeheader":"家",
                "profile":"档案",
                "settingsId": "設定",
                "logoutId":"登出",
                "h1Header":"設定",
                "profileName":"編輯個人資料名稱",
                "userName":"編輯個人資料用戶名",
                "userEmail":"編輯個人資料電子郵件",
                "userPassword":"更改密碼",
                "deleteAccountBtn":"刪除帳戶",
                "saveChangesBtn":"儲存變更"
            },
    };

    const elementsToTranslate = {
        'homeheader':'homeheader',
        'profile':'profile',
        'settingsId':'settingsId',
        'logoutId':'logoutId',
        'h1Header':'h1Header',
        'profileName':'profileName',
        'userName':'userName',
        'userEmail':'userEmail',
        'userPassword':'userPassword',
        'deleteAccountBtn':'deleteAccountBtn',
        'saveChangesBtn':'saveChangesBtn'
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

document.addEventListener("DOMContentLoaded", function()
{
    var check;
    const toggleSwitch = document.getElementById("2fa-toggle");

    toggleSwitch.addEventListener("change", function() {
        const isChecked = toggleSwitch.checked;
        check = updateBackend(isChecked);
        console.log(check);
    });

        function updateBackend(isEnabled)
        {
            const data = { twoFactorEnabled: isEnabled };
            if (isEnabled){
                check = "True";
            }
            else{
                check = "False";
            }

            const requested_data = {
                "check": check
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
        
            const url = `http://10.12.11.2:8000/api/v1/two_fa/${userId}/`;
        
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(requested_data)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch((error) => {
                console.error('Error updating 2FA status:', error);
            });
            return data;
        }

    applyLanguage();
});
