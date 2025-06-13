const calorieData = {
    pushup: 0.5,    // Calories per rep
    chinup: 0.9,
    pullup: 1.0,
    crunches: 0.3,
    squats: 0.4
};

function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown');
    dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
}

function addWorkout() {
    const workoutSelect = document.getElementById('workout-select');
    const workoutType = workoutSelect.value;
    const workoutName = workoutSelect.options[workoutSelect.selectedIndex].text;

    // Check if workout already exists
    if (document.getElementById(workoutType)) return;

    const workoutList = document.getElementById('workout-list');
    const workoutDiv = document.createElement('div');
    workoutDiv.classList.add('workout-item');
    workoutDiv.id = workoutType;

    workoutDiv.innerHTML = `
        <span>${workoutName}</span>
        <div class="counter">
            <button onclick="updateCount('${workoutType}', -1)">-</button>
            <span id="${workoutType}-count" contenteditable="true">0</span>
            <button onclick="updateCount('${workoutType}', 1)">+</button>
            <span id="${workoutType}-calories">0 kcal</span>
        </div>
    `;

    workoutList.appendChild(workoutDiv);
    toggleDropdown();
}

function updateCount(workout, change) {
    const countSpan = document.getElementById(`${workout}-count`);
    let count = parseInt(countSpan.innerText) + change;
    count = count < 0 ? 0 : count;
    countSpan.innerText = count;

    const calorieSpan = document.getElementById(`${workout}-calories`);
    calorieSpan.innerText = (count * calorieData[workout]).toFixed(1) + " kcal";

    calculateTotalCalories();
}

function calculateTotalCalories() {
    let total = 0;
    for (let workout in calorieData) {
        const countSpan = document.getElementById(`${workout}-count`);
        if (countSpan) {
            total += parseInt(countSpan.innerText) * calorieData[workout];
        }
    }
    document.getElementById('total-calories').innerText = total.toFixed(1);
    updateProgressBar(total);
}

function updateProgressBar(totalCalories) {
    const maxCalories = 500; // Adjust max value
    const percentage = Math.min((totalCalories / maxCalories) * 100, 100); // Limit to 100%

    const circle = document.querySelector('.progress-ring-circle');
    const text = document.getElementById('calories-burned');

    if (circle) {
        const circumference = 314; // 2 * π * r (for r = 50)
        const offset = circumference - (percentage / 100) * circumference;

        circle.style.strokeDashoffset = offset; // Adjust progress
        text.innerText = totalCalories.toFixed(1); // Update text in center
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const days = document.querySelectorAll('.day');
    const currentDay = new Date().getDay(); // 0 (Sun) to 6 (Sat)
  
    days.forEach((day, index) => {
      if (index === currentDay - 1) { // Adjust for Monday (1) to Sunday (7)
        day.style.backgroundColor = '#FD3A54';
        day.querySelector('.day-name').style.color = '#fff';
        day.querySelector('.calories').style.color = '#fff';
      }
    });
  });