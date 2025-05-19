using Microsoft.AspNetCore.Mvc;
using ClinicManagementSystem.API.Data;
using ClinicManagementSystem.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System; // Make sure this is here for Exception

namespace ClinicManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DoctorsController : ControllerBase
    {
        private readonly ClinicDbContext _context;
        private readonly ILogger<DoctorsController> _logger;

        public DoctorsController(ClinicDbContext context, ILogger<DoctorsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> CreateDoctor([FromBody] Doctor doctor)
        {
            if (doctor == null)
            {
                _logger.LogWarning("CreateDoctor: Received null doctor object");
                return BadRequest("Doctor object is null.");
            }

            if (string.IsNullOrEmpty(doctor.FirstName) || string.IsNullOrEmpty(doctor.LastName) || string.IsNullOrEmpty(doctor.Specialty))
            {
                _logger.LogWarning("CreateDoctor: Validation failed for doctor: {@Doctor}", doctor);
                return BadRequest("First name, last name, and specialty are required.");
            }

            try
            {
                _logger.LogInformation("Adding doctor: {@Doctor}", doctor);
                _context.Doctors.Add(doctor);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Doctor added with ID: {Id}", doctor.Id);
                return Ok(new { message = "Doctor added successfully.", id = doctor.Id });
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "DbUpdateException occurred while adding doctor: {@Doctor}", doctor);
                return StatusCode(500, "An error occurred while saving the doctor to the database.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while adding doctor: {@Doctor}", doctor);
                return StatusCode(500, "An unexpected error occurred.");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetDoctors()
        {
            var doctors = await _context.Doctors.ToListAsync();
            _logger.LogInformation("Retrieved {Count} doctors", doctors.Count);
            return Ok(doctors);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDoctor(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
            {
                _logger.LogWarning("Doctor with ID {Id} not found", id);
                return NotFound($"Doctor with ID {id} not found");
            }
            
            _logger.LogInformation("Retrieved doctor with ID: {Id}", id);
            return Ok(doctor);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDoctor(int id, [FromBody] Doctor doctor)
        {
            if (id != doctor.Id)
            {
                _logger.LogWarning("UpdateDoctor: ID mismatch. Path ID: {PathId}, Body ID: {BodyId}", id, doctor.Id);
                return BadRequest("ID in URL does not match ID in the request body");
            }

            var existingDoctor = await _context.Doctors.FindAsync(id);
            if (existingDoctor == null)
            {
                _logger.LogWarning("UpdateDoctor: Doctor with ID {Id} not found", id);
                return NotFound($"Doctor with ID {id} not found");
            }

            existingDoctor.FirstName = doctor.FirstName;
            existingDoctor.LastName = doctor.LastName;
            existingDoctor.Specialty = doctor.Specialty;

            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation("Updated doctor with ID: {Id}", id);
                return Ok("Doctor updated successfully");
            }
            catch (DbUpdateConcurrencyException ex)
            {
                _logger.LogError(ex, "Concurrency error updating doctor with ID: {Id}", id);
                return StatusCode(500, "An error occurred while updating the doctor");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
            {
                _logger.LogWarning("DeleteDoctor: Doctor with ID {Id} not found", id);
                return NotFound($"Doctor with ID {id} not found");
            }

            try
            {
                _context.Doctors.Remove(doctor);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Deleted doctor with ID: {Id}", id);
                return Ok("Doctor deleted successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting doctor with ID: {Id}", id);
                return StatusCode(500, "An error occurred while deleting the doctor");
            }
        }
    }
}