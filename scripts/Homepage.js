// Session Handling
document.addEventListener('DOMContentLoaded', function () {
  // Check if the user is logged in
  const loginData = localStorage.getItem('loginData');

  if (loginData) {
    try {
      const data = JSON.parse(loginData);

      // Update profile card with user data
      const displayNameElement = document.querySelector('.display-name');
      const usernameElement = document.querySelector('.username');

      if (displayNameElement) {
        displayNameElement.textContent = data.displayName || data.username;
      }
      if (usernameElement) {
        usernameElement.textContent = `@${data.username}`;
      }
    } catch (error) {
      console.error('Error parsing loginData:', error);
      localStorage.removeItem('loginData'); // Clear invalid login data
      window.location.href = 'login.html'; // Redirect to login page
    }
  } else {
    // Redirect to login if no session data is found
    window.location.href = 'login.html';
  }

  // Logout Handling
  const logoutButton = document.getElementById('logoutButton');
  const logoutModal = document.getElementById('logoutModal');
  const confirmLogoutButton = document.getElementById('confirmLogout');
  const cancelLogoutButton = document.getElementById('cancelLogout');

  if (logoutButton) {
    logoutButton.addEventListener('click', function () {
      // Show the custom modal
      logoutModal.style.display = 'flex';
    });
  }

  if (confirmLogoutButton) {
    confirmLogoutButton.addEventListener('click', function () {
      // Perform logout
      fetch('php-scripts/logout.php', {
        method: 'POST',
        credentials: 'include',
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          localStorage.removeItem('loginData');
          window.location.href = 'login.html';
        } else {
          console.error('Logout failed:', data.error);
          alert('Logout failed: ' + data.error);
        }
      })
      .catch(error => {
        console.error('Error during logout:', error);
        alert('An error occurred during logout. Please try again.');
      });

      // Hide the modal
      logoutModal.style.display = 'none';
    });
  }

  if (cancelLogoutButton) {
    cancelLogoutButton.addEventListener('click', function () {
      // Hide the modal
      logoutModal.style.display = 'none';
    });
  }

  // Close the modal if the user clicks outside of it
  window.addEventListener('click', function (event) {
    if (event.target === logoutModal) {
      logoutModal.style.display = 'none';
    }
  });

  // Dropdown Handling
  const profileOptions = document.getElementById('profileOptions');
  const dropdownContent = document.getElementById('dropdownContent');

  if (profileOptions && dropdownContent) {
    profileOptions.addEventListener('click', function (event) {
      event.stopPropagation(); // Prevent the click from closing the dropdown immediately
      dropdownContent.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    window.addEventListener('click', function () {
      if (dropdownContent.classList.contains('show')) {
        dropdownContent.classList.remove('show');
      }
    });
  }
});

// For the search button
document.getElementById('search-query').addEventListener('input', function () {
  const query = this.value.trim().toLowerCase(); // Convert input to lowercase for case-insensitive search

  // Get all the posts
  const posts = document.querySelectorAll('.actualPost');

  posts.forEach(post => {
      const title = post.querySelector('.postTitle').textContent.toLowerCase();

      // Check if the title includes the search query
      if (title.includes(query)) {
          post.style.display = ''; // Show post if it matches the query
      } else {
          post.style.display = 'none'; // Hide post if it doesn't match
      }
  });
});

// Funtion for Likes
function toggleLike(postId) {
  const likeCountElement = document.getElementById('like-count-' + postId);
  const likeButton = document.querySelector(`#like-count-${postId}`).previousElementSibling; // The like button image

  fetch('./php-scripts/toggle_like.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          postId: postId,
      }),
  })
      .then((response) => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json(); // Parse JSON
      })
      .then((data) => {
          if (data.success) {
              // Update the like count dynamically
              likeCountElement.textContent = data.newLikeCount;

              // Toggle like button image
              if (likeButton.src.includes('heart-nolike.png')) {
                likeButton.src = './assets/heart-withlike.png'; // Change to filled heart
                likeButton.style.filter = 'none'; // Remove the filter (if any)
              } else {
                likeButton.src = './assets/heart-nolike.png'; // Change back to empty heart
                likeButton.style.filter = ''; // Reset to the default filter state (or specify a filter you want)
              }

          } else {
              console.error('Error from server:', data.message);
              alert('Error: ' + data.message); // Display an alert with the error
          }
      })
      .catch((error) => {
          console.error('Network or parsing error:', error.message);
          alert('An error occurred. Please try again later.');
      });
}

