document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const dob = document.getElementById('dob').value;
    const terms = document.getElementById('terms').checked;

    // Validate age
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    if (age < 18 || age > 55) {
        alert('Age must be between 18 and 55.');
        return;
    }
    
    //Add entries to table
    const table = document.getElementById('entriesBody');
    const newRow = table.insertRow();
    newRow.insertCell(0).innertext = name;
    newRow.insertCell(1).innertext = email;
    newRow.insertCell(2).innertext = password;
    newRow.insertCell(3).innertext = dob;
    newRow.insertCell(4).innertext = terms ? 'true':'false' ;

    //store data in local storage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push({ name, email, password, dob, terms });
    localStorage.setItem('users', JSON.stringify(users));
});
