document.addEventListener('DOMContentLoaded', function() {
  // Sidebar navigation
  const sidebarItems = document.querySelectorAll('.sidebar nav ul li');
  const sections = document.querySelectorAll('main section');

  sidebarItems.forEach(item => {
    item.addEventListener('click', function() {
      // Remove active class from all items and sections
      sidebarItems.forEach(i => i.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));

      // Add active class to clicked item and corresponding section
      this.classList.add('active');
      const sectionId = this.dataset.section + '-section';
      document.getElementById(sectionId).classList.add('active');
    });
  });

  // Populate user profile from localStorage or server
  function populateUserProfile() {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      document.getElementById('student-name').textContent = userData.username;
      document.getElementById('full-name').value = userData.username;
      document.getElementById('email').value = userData.email;
      document.getElementById('phone').value = userData.phone;
    }
  }

  populateUserProfile();
});
