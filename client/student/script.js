$(document).ready(function() {
    // Function to handle redirecting to home page
    $('#homeBtn').click(function() {
      window.location.href = 'index.html'; // Change 'index.html' to the actual starting page URL
    });
  
    // Function to toggle between dark and light mode
    $('#themeToggleBtn').click(function() {
      $('body').toggleClass('dark-mode');
    });
  
    // Event handler for the report button
    $('#reportsBtn').click(function() {
      $('#content').load('report.html'); // Load report.html content into the main content area
    });
  
    // Event handler for the quiz button
    $('#quizBtn').click(function() {
      window.location.href = 'quiz.html'; // Redirect to quiz.html
    });
  
    // Sample event handlers for other buttons
    $('#profileBtn').click(function() {
      // Handle profile button click
    });
  
    $('#logoutBtn').click(function() {
      // Handle logout button click
    });
  });
  