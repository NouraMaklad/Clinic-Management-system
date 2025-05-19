using Microsoft.AspNetCore.Mvc;
using ClinicManagementSystem.API.Data;
using ClinicManagementSystem.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System;

namespace ClinicManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AppointmentsController : ControllerBase
    {
        private readonly ClinicDbContext _context;
        private readonly ILogger<AppointmentsController> _logger;

        public AppointmentsController(ClinicDbContext context, ILogger<AppointmentsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> CreateAppointment([FromBody] Appointment appointment)
        {
            if (appointment == null)
            {
                _logger.LogWarning("CreateAppointment: Received null appointment object");
                return BadRequest("Appointment object is null.");
            }

            var newAppointment = new Appointment
            {
                PatientId = appointment.PatientId,
                DoctorId = appointment.DoctorId,
                AppointmentDate = appointment.AppointmentDate
            };

            if (newAppointment.PatientId <= 0 || newAppointment.DoctorId <= 0 || newAppointment.AppointmentDate == default)
            {
                _logger.LogWarning("CreateAppointment: Validation failed for appointment: {@Appointment}", newAppointment);
                return BadRequest("Patient ID, Doctor ID, and appointment date are required.");
            }

            var patientExists = await _context.Patients.AnyAsync(p => p.Id == newAppointment.PatientId);
            if (!patientExists)
            {
                _logger.LogWarning("CreateAppointment: Invalid Patient ID: {PatientId}", newAppointment.PatientId);
                return BadRequest($"Invalid Patient ID: {newAppointment.PatientId}. Please use an existing Patient ID.");
            }

            var doctorExists = await _context.Doctors.AnyAsync(d => d.Id == newAppointment.DoctorId);
            if (!doctorExists)
            {
                _logger.LogWarning("CreateAppointment: Invalid Doctor ID: {DoctorId}", newAppointment.DoctorId);
                return BadRequest($"Invalid Doctor ID: {newAppointment.DoctorId}. Please use an existing Doctor ID.");
            }

            _logger.LogInformation("Adding appointment: {@Appointment}", newAppointment);
            _context.Appointments.Add(newAppointment);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Appointment added with ID: {Id}", newAppointment.Id);
            return Ok(new { message = "Appointment added successfully.", id = newAppointment.Id });
        }

        [HttpGet]
        public async Task<IActionResult> GetAppointments()
        {
            var appointments = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .ToListAsync();
            _logger.LogInformation("Retrieved {Count} appointments", appointments.Count);
            return Ok(appointments);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAppointment(int id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .FirstOrDefaultAsync(a => a.Id == id);
                
            if (appointment == null)
            {
                _logger.LogWarning("Appointment with ID {Id} not found", id);
                return NotFound($"Appointment with ID {id} not found");
            }
            
            _logger.LogInformation("Retrieved appointment with ID: {Id}", id);
            return Ok(appointment);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, [FromBody] Appointment appointment)
        {
            if (id != appointment.Id)
            {
                _logger.LogWarning("UpdateAppointment: ID mismatch. Path ID: {PathId}, Body ID: {BodyId}", id, appointment.Id);
                return BadRequest("ID in URL does not match ID in the request body");
            }

            var patientExists = await _context.Patients.AnyAsync(p => p.Id == appointment.PatientId);
            if (!patientExists)
            {
                _logger.LogWarning("UpdateAppointment: Invalid Patient ID: {PatientId}", appointment.PatientId);
                return BadRequest($"Invalid Patient ID: {appointment.PatientId}. Please use an existing Patient ID.");
            }

            var doctorExists = await _context.Doctors.AnyAsync(d => d.Id == appointment.DoctorId);
            if (!doctorExists)
            {
                _logger.LogWarning("UpdateAppointment: Invalid Doctor ID: {DoctorId}", appointment.DoctorId);
                return BadRequest($"Invalid Doctor ID: {appointment.DoctorId}. Please use an existing Doctor ID.");
            }

            var existingAppointment = await _context.Appointments.FindAsync(id);
            if (existingAppointment == null)
            {
                _logger.LogWarning("UpdateAppointment: Appointment with ID {Id} not found", id);
                return NotFound($"Appointment with ID {id} not found");
            }

            existingAppointment.PatientId = appointment.PatientId;
            existingAppointment.DoctorId = appointment.DoctorId;
            existingAppointment.AppointmentDate = appointment.AppointmentDate;

            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation("Updated appointment with ID: {Id}", id);
                return Ok("Appointment updated successfully");
            }
            catch (DbUpdateConcurrencyException ex)
            {
                _logger.LogError(ex, "Concurrency error updating appointment with ID: {Id}", id);
                return StatusCode(500, "An error occurred while updating the appointment");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                _logger.LogWarning("DeleteAppointment: Appointment with ID {Id} not found", id);
                return NotFound($"Appointment with ID {id} not found");
            }

            try
            {
                _context.Appointments.Remove(appointment);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Deleted appointment with ID: {Id}", id);
                return Ok("Appointment deleted successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting appointment with ID: {Id}", id);
                return StatusCode(500, "An error occurred while deleting the appointment");
            }
        }
    }
}