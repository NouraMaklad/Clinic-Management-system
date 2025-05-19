const apiUrl = 'http://localhost:5237/api';

document.addEventListener('DOMContentLoaded', () => {
    const protectedPages = ['patients.html', 'doctors.html', 'appointments.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPage)) {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
        }
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');

            const requestBody = { username, passwordHash: password };
            console.log('Sending login request:', requestBody);

            try {
                const response = await fetch(`${apiUrl}/Auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                });

                const text = await response.text();
                console.log('Login response:', { status: response.status, text });

                let data;
                try {
                    data = JSON.parse(text);
                } catch (jsonError) {
                    console.error('Failed to parse response as JSON:', text);
                    throw new Error('Server returned an invalid response format');
                }

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    window.location.href = 'index.html';
                } else {
                    errorMessage.textContent = data.message || 'Login failed.';
                }
            } catch (error) {
                console.error('Login error:', error);
                errorMessage.textContent = `An error occurred. Details: ${error.message}`;
            }
        });
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');

            const requestBody = { username, passwordHash: password };

            console.log('Sending signup request:', requestBody);

            try {
                const response = await fetch(`${apiUrl}/Auth/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                });

                const data = await response.text();
                console.log('Signup response:', { status: response.status, data });

                if (response.ok) {
                    alert('Sign up successful! Please login.');
                    window.location.href = 'login.html';
                } else {
                    errorMessage.textContent = data || 'Sign up failed.';
                }
            } catch (error) {
                console.error('Signup error:', error);
                errorMessage.textContent = `An error occurred. Details: ${error.message}`;
            }
        });
    }

    // Add Patient
    const addPatientForm = document.getElementById('addPatientForm');
    if (addPatientForm) {
        addPatientForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const dateOfBirth = document.getElementById('dateOfBirth').value;
            const errorMessage = document.getElementById('error-message');

            const requestBody = { firstName, lastName, email, phone, dateOfBirth };
            console.log('Sending add patient request:', { body: requestBody, token: localStorage.getItem('token'), fullBody: JSON.stringify(requestBody) });

            try {
                const response = await fetch(`${apiUrl}/Patients`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(requestBody)
                });

                const data = await response.text();
                console.log('Add patient response:', { status: response.status, data });

                if (response.ok) {
                    alert('Patient added successfully!');
                    addPatientForm.reset();
                    fetchPatients();
                } else {
                    errorMessage.textContent = data || 'Failed to add patient.';
                }
            } catch (error) {
                console.error('Add patient error:', error);
                errorMessage.textContent = `An error occurred. Details: ${error.message}`;
            }
        });
    }

    // Add Doctor
    const addDoctorForm = document.getElementById('addDoctorForm');
    if (addDoctorForm) {
        addDoctorForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const specialty = document.getElementById('specialty').value;
            const errorMessage = document.getElementById('error-message');

            const requestBody = { firstName, lastName, specialty };
            console.log('Sending add doctor request:', { body: requestBody, token: localStorage.getItem('token'), fullBody: JSON.stringify(requestBody) });

            try {
                const response = await fetch(`${apiUrl}/Doctors`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(requestBody)
                });

                const data = await response.text();
                console.log('Add doctor response:', { status: response.status, data });

                if (response.ok) {
                    alert('Doctor added successfully!');
                    addDoctorForm.reset();
                    fetchDoctors();
                } else {
                    errorMessage.textContent = data || 'Failed to add doctor.';
                }
            } catch (error) {
                console.error('Add doctor error:', error);
                errorMessage.textContent = `An error occurred. Details: ${error.message}`;
            }
        });
    }

    // Add Appointment
    const addAppointmentForm = document.getElementById('addAppointmentForm');
    if (addAppointmentForm) {
        addAppointmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const patientId = document.getElementById('patientId').value;
            const doctorId = document.getElementById('doctorId').value;
            const appointmentDate = document.getElementById('appointmentDate').value + ':00Z';
            const errorMessage = document.getElementById('error-message');

            const requestBody = { patientId: parseInt(patientId), doctorId: parseInt(doctorId), appointmentDate };
            console.log('Sending add appointment request:', { body: requestBody, token: localStorage.getItem('token'), fullBody: JSON.stringify(requestBody) });

            try {
                const response = await fetch(`${apiUrl}/Appointments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(requestBody)
                });

                const data = await response.text();
                console.log('Add appointment response:', { status: response.status, data });

                if (response.ok) {
                    alert('Appointment added successfully!');
                    addAppointmentForm.reset();
                    fetchAppointments();
                } else {
                    errorMessage.textContent = data || 'Failed to add appointment.';
                }
            } catch (error) {
                console.error('Add appointment error:', error);
                errorMessage.textContent = `An error occurred. Details: ${error.message}`;
            }
        });
    }
});

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

async function fetchPatients() {
    const token = localStorage.getItem('token');
    console.log('Fetching patients with token:', token);
    try {
        const response = await fetch(`${apiUrl}/Patients`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Patients response:', { status: response.status });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch patients. Status: ${response.status}`);
        }
        
        const patients = await response.json();
        console.log('Patients data:', patients);
        
        // Use the displayPatients function to render the table
        displayPatients(patients);
        
        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const row = this.closest('tr');
                const id = row.cells[0].textContent;
                const firstName = row.cells[1].textContent;
                const lastName = row.cells[2].textContent;
                const email = row.cells[3].textContent;
                const phone = row.cells[4].textContent;
                const dateOfBirth = row.cells[5].textContent;

                // Create modal overlay
                const modalOverlay = document.createElement('div');
                modalOverlay.className = 'modal-overlay';
                
                // Create edit card
                const editCard = document.createElement('div');
                editCard.className = 'edit-card';
                editCard.innerHTML = `
                    <h2>Edit Patient</h2>
                    <form id="editPatientForm">
                        <label for="editFirstName">First Name:</label>
                        <input type="text" id="editFirstName" value="${firstName}" required>
                        
                        <label for="editLastName">Last Name:</label>
                        <input type="text" id="editLastName" value="${lastName}" required>
                        
                        <label for="editEmail">Email:</label>
                        <input type="email" id="editEmail" value="${email}" required>
                        
                        <label for="editPhone">Phone:</label>
                        <input type="tel" id="editPhone" value="${phone}" required>
                        
                        <label for="editDateOfBirth">Date of Birth:</label>
                        <input type="date" id="editDateOfBirth" value="${formatDateForInput(dateOfBirth)}" required>
                        
                        <div class="button-group">
                            <button type="submit" id="updateBtn">Update</button>
                            <button type="button" id="cancelBtn">Cancel</button>
                        </div>
                    </form>
                `;
                
                // Add modal and card to document
                modalOverlay.appendChild(editCard);
                document.body.appendChild(modalOverlay);
                
                // Handle form submission
                const editForm = document.getElementById('editPatientForm');
                const cancelBtn = document.getElementById('cancelBtn');
                
                editForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    
                    const updatedFirstName = document.getElementById('editFirstName').value;
                    const updatedLastName = document.getElementById('editLastName').value;
                    const updatedEmail = document.getElementById('editEmail').value;
                    const updatedPhone = document.getElementById('editPhone').value;
                    const updatedDateOfBirth = document.getElementById('editDateOfBirth').value;
                    
                    // Format date as ISO string for API
                    const formattedDate = updatedDateOfBirth ? new Date(updatedDateOfBirth).toISOString() : null;
                    
                    const requestBody = {
                        id: parseInt(id),
                        firstName: updatedFirstName,
                        lastName: updatedLastName,
                        email: updatedEmail,
                        phone: updatedPhone,
                        dateOfBirth: formattedDate
                    };
                    
                    try {
                        const token = localStorage.getItem('token');
                        const response = await fetch(`${apiUrl}/Patients/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify(requestBody)
                        });
                        
                        const data = await response.text();
                        
                        if (response.ok) {
                            alert('Patient updated successfully!');
                            modalOverlay.remove();
                            fetchPatients();
                        } else {
                            alert(`Failed to update patient. Error: ${data || 'Unknown error'}`);
                        }
                    } catch (error) {
                        console.error('Update patient error:', error);
                        alert(`An error occurred. Details: ${error.message}`);
                    }
                });
                
                // Handle cancel button
                cancelBtn.addEventListener('click', () => {
                    modalOverlay.remove();
                });
            });
        });

        // Set up delete button event listeners
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async function(e) {
                e.stopPropagation();
                const patientId = this.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this patient?')) {
                    const row = this.closest('tr');
                    console.log(`Delete confirmed for Patient ID: ${patientId}`);

                    try {
                        const token = localStorage.getItem('token');
                        const response = await fetch(`${apiUrl}/Patients/${patientId}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        const data = await response.text();
                        console.log('Delete patient response:', { status: response.status, data: data || 'No response data' });

                        if (response.ok) {
                            alert('Patient deleted successfully!');
                            row.remove();
                        } else {
                            alert(`Failed to delete patient. Error: ${data || 'Unknown error'}`);
                        }
                    } catch (error) {
                        console.error('Delete patient error:', error);
                        alert(`An error occurred. Details: ${error.message}`);
                    }
                }
            });
        });
    } catch (error) {
        console.error('Fetch patients error:', error);
        alert(`An error occurred. Details: ${error.message}`);
    }
}

async function fetchDoctors() {
    const token = localStorage.getItem('token');
    console.log('Fetching doctors with token:', token);
    const response = await fetch(`${apiUrl}/Doctors`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    console.log('Doctors response:', { status: response.status });
    const doctors = await response.json();
    console.log('Doctors data:', doctors);
    const tableBody = document.getElementById('doctorTableBody');
    tableBody.innerHTML = '';
    doctors.forEach(doctor => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="ID">${doctor.id}</td>
            <td data-label="First Name">${doctor.firstName}</td>
            <td data-label="Last Name">${doctor.lastName}</td>
            <td data-label="Specialty">${doctor.specialty}</td>
            <td data-label="Actions">
                <button class="edit-btn"><i class="fas fa-edit"></i> Edit</button>
                <button class="delete-btn"><i class="fas fa-trash"></i> Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', () => {
            const row = button.closest('tr');
            const id = row.cells[0].textContent;
            const firstName = row.cells[1].textContent;
            const lastName = row.cells[2].textContent;
            const specialty = row.cells[3].textContent;

            // Create modal overlay
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'modal-overlay';
            
            // Create edit card
            const editCard = document.createElement('div');
            editCard.className = 'edit-card';
            editCard.innerHTML = `
                <h2>Edit Doctor</h2>
                <form id="editDoctorForm">
                    <label for="editFirstName">First Name:</label>
                    <input type="text" id="editFirstName" value="${firstName}" required>
                    
                    <label for="editLastName">Last Name:</label>
                    <input type="text" id="editLastName" value="${lastName}" required>
                    
                    <label for="editSpecialty">Specialty:</label>
                    <input type="text" id="editSpecialty" value="${specialty}" required>
                    
                    <div class="button-group">
                        <button type="submit" id="updateBtn">Update</button>
                        <button type="button" id="cancelBtn">Cancel</button>
                    </div>
                </form>
            `;
            
            // Add modal and card to document
            modalOverlay.appendChild(editCard);
            document.body.appendChild(modalOverlay);
            
            // Handle form submission
            const editForm = document.getElementById('editDoctorForm');
            const cancelBtn = document.getElementById('cancelBtn');
            
            editForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const updatedFirstName = document.getElementById('editFirstName').value;
                const updatedLastName = document.getElementById('editLastName').value;
                const updatedSpecialty = document.getElementById('editSpecialty').value;
                
                const requestBody = {
                    id: parseInt(id),
                    firstName: updatedFirstName,
                    lastName: updatedLastName,
                    specialty: updatedSpecialty
                };
                
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`${apiUrl}/Doctors/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(requestBody)
                    });
                    
                    const data = await response.text();
                    
                    if (response.ok) {
                        alert('Doctor updated successfully!');
                        modalOverlay.remove();
                        fetchDoctors(); // Refresh the table
                    } else {
                        alert(`Failed to update doctor. Error: ${data || 'Unknown error'}`);
                    }
                } catch (error) {
                    console.error('Update doctor error:', error);
                    alert(`An error occurred. Details: ${error.message}`);
                }
            });
            
            // Handle cancel button
            cancelBtn.addEventListener('click', () => {
                modalOverlay.remove();
            });
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete this doctor?')) {
                const row = button.closest('tr');
                const id = row.cells[0].textContent;
                console.log(`Delete confirmed for Doctor ID: ${id}`);

                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`${apiUrl}/Doctors/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    const data = await response.text();
                    console.log('Delete doctor response:', { status: response.status, data: data || 'No response data' });

                    if (response.ok) {
                        alert('Doctor deleted successfully!');
                        row.remove();
                        fetchDoctors(); // Refresh the table
                    } else {
                        alert(`Failed to delete doctor. Error: ${data || 'Unknown error'}`);
                    }
                } catch (error) {
                    console.error('Delete doctor error:', error);
                    alert(`An error occurred. Details: ${error.message}`);
                }
            }
        });
    });
}

function formatDateTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
}

async function fetchAppointments() {
    const token = localStorage.getItem('token');
    const tableBody = document.getElementById('appointmentTableBody');
    
    try {
        console.log('Fetching appointments with token:', token);
        const response = await fetch(`${apiUrl}/Appointments`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Appointments response:', { status: response.status });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch appointments. Status: ${response.status}`);
        }
        
        const appointments = await response.json();
        console.log('Appointments data:', appointments);
        
        if (!Array.isArray(appointments)) {
            throw new Error('Invalid appointments data received');
        }
        
        tableBody.innerHTML = '';
        appointments.forEach(appointment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${appointment.id}</td>
                <td>${appointment.patientId}</td>
                <td>${appointment.doctorId}</td>
                <td>${formatDateTime(appointment.appointmentDate)}</td>
                <td>
                    <button class="edit-btn" onclick="editAppointment(${appointment.id})"><i class="fas fa-edit"></i> Edit</button>
                    <button class="delete-btn" onclick="deleteAppointment(${appointment.id})"><i class="fas fa-trash"></i> Delete</button>
                    <button class="btn export-btn" onclick="exportAppointmentDetails(${appointment.id})"><i class="fas fa-file-alt"></i> Export as TXT</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">Error loading appointments: ${error.message}</td></tr>`;
    }
}

function displayPatients(patients) {
    const tableBody = document.getElementById('patientTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    patients.forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.id}</td>
            <td>${patient.firstName}</td>
            <td>${patient.lastName}</td>
            <td>${patient.email || ''}</td>
            <td>${patient.phone || ''}</td>
            <td>${patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : ''}</td>
            <td>
                <button class="edit-btn" onclick="editPatient(${patient.id})"><i class="fas fa-edit"></i> Edit</button>
                <button class="delete-btn" data-id="${patient.id}"><i class="fas fa-trash"></i> Delete</button>
                <button class="btn export-btn" onclick="exportPatientDetails(${patient.id})"><i class="fas fa-file-alt"></i> Export as TXT</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function displayAppointments(appointments) {
    const tableBody = document.getElementById('appointmentTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    appointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${appointment.id}</td>
            <td>${appointment.patientId}</td>
            <td>${appointment.doctorId}</td>
            <td>${formatDateTime(appointment.appointmentDate)}</td>
            <td>
                <button class="edit-btn" onclick="editAppointment(${appointment.id})"><i class="fas fa-edit"></i> Edit</button>
                <button class="delete-btn" onclick="deleteAppointment(${appointment.id})"><i class="fas fa-trash"></i> Delete</button>
                <button class="btn export-btn" onclick="exportAppointmentDetails(${appointment.id})"><i class="fas fa-file-alt"></i> Export as TXT</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Format date for input field
function formatDateForInput(dateString) {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        
        // Format as YYYY-MM-DD for the input field
        return date.toISOString().split('T')[0];
    } catch (e) {
        console.error("Error formatting date:", e);
        return '';
    }
}

async function editAppointment(id) {
    const token = localStorage.getItem('token');
    try {
        // Fetch current appointment data
        const response = await fetch(`${apiUrl}/Appointments/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch appointment details');
        }
        
        const appointment = await response.json();
        
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        
        // Create edit card
        const editCard = document.createElement('div');
        editCard.className = 'edit-card';
        editCard.innerHTML = `
            <h2>Edit Appointment</h2>
            <form id="editAppointmentForm">
                <div class="form-group">
                    <label for="editPatientId">Patient ID:</label>
                    <input type="number" id="editPatientId" value="${appointment.patientId}" required>
                </div>
                
                <div class="form-group">
                    <label for="editDoctorId">Doctor ID:</label>
                    <input type="number" id="editDoctorId" value="${appointment.doctorId}" required>
                </div>
                
                <div class="form-group">
                    <label for="editAppointmentDate">Date:</label>
                    <input type="datetime-local" id="editAppointmentDate" value="${appointment.appointmentDate.slice(0, 16)}" required>
                </div>
                
                <div class="button-group">
                    <button type="submit" id="updateBtn">Update</button>
                    <button type="button" id="cancelBtn">Cancel</button>
                </div>
            </form>
        `;
        
        // Add modal and card to document
        modalOverlay.appendChild(editCard);
        document.body.appendChild(modalOverlay);
        
        // Handle form submission
        const editForm = document.getElementById('editAppointmentForm');
        const cancelBtn = document.getElementById('cancelBtn');
        
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const updatedPatientId = parseInt(document.getElementById('editPatientId').value);
            const updatedDoctorId = parseInt(document.getElementById('editDoctorId').value);
            const updatedDateValue = document.getElementById('editAppointmentDate').value;
            
            const requestBody = {
                id: id,
                patientId: updatedPatientId,
                doctorId: updatedDoctorId,
                appointmentDate: updatedDateValue + ':00Z'
            };
            
            try {
                const response = await fetch(`${apiUrl}/Appointments/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(requestBody)
                });
                
                if (response.ok) {
                    alert('Appointment updated successfully!');
                    modalOverlay.remove();
                    fetchAppointments(); // Refresh the table
                } else {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Failed to update appointment');
                }
            } catch (error) {
                console.error('Update appointment error:', error);
                alert(`Failed to update appointment: ${error.message}`);
            }
        });
        
        // Handle cancel button
        cancelBtn.addEventListener('click', () => {
            modalOverlay.remove();
        });
        
    } catch (error) {
        console.error('Error in editAppointment:', error);
        alert(`Error: ${error.message}`);
    }
}

async function deleteAppointment(id) {
    if (!confirm('Are you sure you want to delete this appointment?')) {
        return;
    }
    
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${apiUrl}/Appointments/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            alert('Appointment deleted successfully!');
            fetchAppointments(); // Refresh the table
        } else {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to delete appointment');
        }
    } catch (error) {
        console.error('Delete appointment error:', error);
        alert(`Failed to delete appointment: ${error.message}`);
    }
}
async function exportAppointmentDetails(id) {
    const token = localStorage.getItem('token');
    try {
        // Fetch appointment details
        const response = await fetch(`${apiUrl}/Appointments/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch appointment details');
        }
        
        const appointment = await response.json();
        
        // Generate text content
        const content = `
APPOINTMENT DETAILS
==================

Appointment ID: ${appointment.id}
Patient ID: ${appointment.patientId}
Doctor ID: ${appointment.doctorId}
Date: ${formatDateTime(appointment.appointmentDate)}

Generated on: ${new Date().toLocaleString()}
        `.trim();
        
        // Create and trigger download
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `Appointment_${appointment.id}_${new Date().toISOString().slice(0,10)}.txt`;
        
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
    } catch (error) {
        console.error('Export appointment error:', error);
        alert(`Failed to export appointment details: ${error.message}`);
    }
}

async function exportPatientDetails(id) {
    const token = localStorage.getItem('token');
    try {
        // Fetch patient details
        const response = await fetch(`${apiUrl}/Patients/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch patient details');
        }
        
        const patient = await response.json();
        
        // Generate text content
        const content = `
PATIENT DETAILS
==============

Patient ID: ${patient.id}
Name: ${patient.firstName} ${patient.lastName}
Email: ${patient.email || 'N/A'}
Phone: ${patient.phone || 'N/A'}
Date of Birth: ${patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}

Generated on: ${new Date().toLocaleString()}
        `.trim();
        
        // Create and trigger download
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `Patient_${patient.id}_${patient.firstName}_${patient.lastName}_${new Date().toISOString().slice(0,10)}.txt`;
        
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
    } catch (error) {
        console.error('Export patient error:', error);
        alert(`Failed to export patient details: ${error.message}`);
    }
}

async function exportAllPatients() {
    const token = localStorage.getItem('token');
    try {
        // Show loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'pdf-loader';
        loadingDiv.innerHTML = '<div class="loader-spinner"></div><p>Generating export file...</p>';
        document.body.appendChild(loadingDiv);
        
        // Fetch all patients
        const response = await fetch(`${apiUrl}/Patients`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch patients data');
        }
        
        const patients = await response.json();
        
        // Generate content for all patients
        let content = `
ALL PATIENTS REPORT
=================

Generated on: ${new Date().toLocaleString()}
Total Patients: ${patients.length}

`;
        
        // Add each patient's details
        patients.forEach((patient, index) => {
            content += `
---------- PATIENT #${index + 1} ----------

Patient ID: ${patient.id}
Name: ${patient.firstName} ${patient.lastName}
Email: ${patient.email || 'N/A'}
Phone: ${patient.phone || 'N/A'}
Date of Birth: ${patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}

`;
        });
        
        // Remove loading indicator
        document.body.removeChild(loadingDiv);
        
        // Create and trigger download
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `All_Patients_${new Date().toISOString().slice(0,10)}.txt`;
        
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
    } catch (error) {
        console.error('Export all patients error:', error);
        alert(`Failed to export all patients: ${error.message}`);
        
        // Remove loading indicator if it exists
        const loadingDiv = document.querySelector('.pdf-loader');
        if (loadingDiv) {
            document.body.removeChild(loadingDiv);
        }
    }
}

async function exportAllAppointments() {
    const token = localStorage.getItem('token');
    try {
        // Show loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'pdf-loader';
        loadingDiv.innerHTML = '<div class="loader-spinner"></div><p>Generating export file...</p>';
        document.body.appendChild(loadingDiv);
        
        // Fetch all appointments
        const response = await fetch(`${apiUrl}/Appointments`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch appointments data');
        }
        
        const appointments = await response.json();
        
        // Generate content for all appointments
        let content = `
ALL APPOINTMENTS REPORT
=====================

Generated on: ${new Date().toLocaleString()}
Total Appointments: ${appointments.length}

`;
        
        // Add each appointment's details
        appointments.forEach((appointment, index) => {
            content += `
---------- APPOINTMENT #${index + 1} ----------

Appointment ID: ${appointment.id}
Patient ID: ${appointment.patientId}
Doctor ID: ${appointment.doctorId}
Date: ${formatDateTime(appointment.appointmentDate)}

`;
        });
        
        // Remove loading indicator
        document.body.removeChild(loadingDiv);
        
        // Create and trigger download
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `All_Appointments_${new Date().toISOString().slice(0,10)}.txt`;
        
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
    } catch (error) {
        console.error('Export all appointments error:', error);
        alert(`Failed to export all appointments: ${error.message}`);
        
        // Remove loading indicator if it exists
        const loadingDiv = document.querySelector('.pdf-loader');
        if (loadingDiv) {
            document.body.removeChild(loadingDiv);
        }
    }
}
