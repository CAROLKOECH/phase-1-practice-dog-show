document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('dog-form');
    const tableBody = document.getElementById('table-body');
  
    // Fetch and render the list of already registered dogs
    fetch('http://localhost:3000/dogs')
      .then(response => response.json())
      .then(dogs => {
        dogs.forEach(dog => renderDogRow(dog));
      });
  
    // Function to render a dog as a table row
    function renderDogRow(dog) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${dog.name}</td>
        <td>${dog.breed}</td>
        <td>${dog.sex}</td>
        <td><button data-id="${dog.id}" class="edit-button">Edit</button></td>
      `;
      tableBody.appendChild(row);
      console.log(dog);
    }
  
    // Function to populate the form with dog's current information
    function populateForm(dog) {
      form.elements.name.value = dog.name;
      form.elements.breed.value = dog.breed;
      form.elements.sex.value = dog.sex;
      form.dataset.id = dog.id;
    }
  
    // Event listener for the Edit button
    tableBody.addEventListener('click', event => {
      if (event.target.classList.contains('edit-button')) {
        const dogId = event.target.dataset.id;
  
        // Fetch the selected dog's information and populate the form
        fetch(`http://localhost:3000/dogs/${dogId}`)
          .then(response => response.json())
          .then(dog => {
            populateForm(dog);
          });
      }
    });
  
    // Event listener for the form submission
    form.addEventListener('submit', event => {
      event.preventDefault();
      const dogId = form.dataset.id;
  
      // Prepare the updated dog data from the form
      const updatedDog = {
        name: form.elements.name.value,
        breed: form.elements.breed.value,
        sex: form.elements.sex.value
      };
  
      // Send a PATCH request to update the dog's information
      fetch(`http://localhost:3000/dogs/${dogId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedDog)
      })
        .then(response => response.json())
        .then(() => {
          // Clear the form
          form.reset();
  
          // Fetch and render the updated list of registered dogs
          fetch('http://localhost:3000/dogs')
            .then(response => response.json())
            .then(dogs => {
              // Clear the table
              tableBody.innerHTML = '';
  
              // Render each dog as a table row
              dogs.forEach(dog => {
                renderDogRow(dog);
              });
            });
        });
    });
  });
  