// Configuration
const COURSES_PER_SEMESTER = 10;
const SEMESTERS = ['First Semester', 'Second Semester'];

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    initializeSemesters();
    setupEventListeners();
});

function initializeSemesters() {
    const container = document.getElementById('semestersContainer');
    
    SEMESTERS.forEach((semesterName) => {
        const template = document.getElementById('semesterTemplate');
        const clone = template.content.cloneNode(true);
        
        clone.querySelector('.semester-title').textContent = semesterName;
        createCourseRows(clone.querySelector('tbody'));
        container.appendChild(clone);
    });
}

function createCourseRows(tbody) {
    for (let i = 1; i <= COURSES_PER_SEMESTER; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i}</td>
            <td><input type="text" class="course-code"></td>
            <td>
                <select class="course-units">
                    ${Array.from({length: 7}, (_, i) => 
                        `<option value="${i}" ${i === 0 ? 'disabled selected' : ''}>${i || 'Select'}</option>`
                    ).join('')}
                </select>
            </td>
            <td>
                <select class="course-status">
                    <option value="C">Compulsory</option>
                    <option value="E">Elective</option>
                    <option value="R">Required</option>
                </select>
            </td>
            <td><input type="number" min="0" max="5" step="0.1" class="grade-point"></td>
            <td class="credit-point">0.00</td>
        `;
        tbody.appendChild(row);
    }
}

function setupEventListeners() {
    document.getElementById('calculateBtn').addEventListener('click', calculateAll);
    document.querySelectorAll('.semester').forEach(semester => {
        semester.addEventListener('input', handleInput);
    });
}

function handleInput(e) {
    if (e.target.classList.contains('grade-point') || 
        e.target.classList.contains('course-units')) {
        updateSemesterTotals(e.target.closest('.semester'));
    }
}

function updateSemesterTotals(semester) {
    let totalUnits = 0;
    let totalCreditPoints = 0;

    semester.querySelectorAll('tbody tr').forEach(row => {
        const units = parseFloat(row.querySelector('.course-units').value) || 0;
        const grade = parseFloat(row.querySelector('.grade-point').value) || 0;
        const creditPoint = units * grade;
        
        row.querySelector('.credit-point').textContent = creditPoint.toFixed(2);
        totalUnits += units;
        totalCreditPoints += creditPoint;
    });

    semester.querySelector('.total-units').textContent = totalUnits;
    semester.querySelector('.total-credit-points').textContent = totalCreditPoints.toFixed(2);
    
    const gpa = totalUnits ? (totalCreditPoints / totalUnits) : 0;
    semester.querySelector('.gpa-value').textContent = gpa.toFixed(2);
}

function calculateAll() {
    const semesters = document.querySelectorAll('.semester');
    let totalCreditPoints = 0;
    let totalUnits = 0;
    
    semesters.forEach(semester => {
        updateSemesterTotals(semester);
        totalCreditPoints += parseFloat(semester.querySelector('.total-credit-points').textContent);
        totalUnits += parseFloat(semester.querySelector('.total-units').textContent);
    });

    const cgpa = totalUnits ? (totalCreditPoints / totalUnits) : 0;
    document.getElementById('cgpaValue').textContent = cgpa.toFixed(2);
}

// Initial calculation
calculateAll();