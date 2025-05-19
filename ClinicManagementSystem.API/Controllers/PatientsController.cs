using Microsoft.AspNetCore.Mvc;
using ClinicManagementSystem.API.Data;
using ClinicManagementSystem.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Collections.Generic;

namespace ClinicManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PatientsController : ControllerBase
    {
        private readonly ClinicDbContext _context;
        private readonly ILogger<PatientsController> _logger;

        public PatientsController(ClinicDbContext context, ILogger<PatientsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePatient([FromBody] Patient patient)
        {
            // Debug authentication info
            var isAuthenticated = User?.Identity?.IsAuthenticated ?? false;
            _logger.LogInformation("User is authenticated: {IsAuthenticated}", isAuthenticated);
            _logger.LogInformation("User name: {Name}", User?.Identity?.Name);
            _logger.LogInformation("Auth type: {AuthType}", User?.Identity?.AuthenticationType);

            if (patient == null || string.IsNullOrEmpty(patient.FirstName) || string.IsNullOrEmpty(patient.LastName))
            {
                return BadRequest("First name and last name are required.");
            }

            _logger.LogInformation("Adding patient: {@Patient}", patient);
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Patient added with ID: {Id}", patient.Id);
            return Ok("Patient added successfully.");
        }

        [HttpGet]
        public async Task<IActionResult> GetPatients()
        {
            var patients = await _context.Patients.ToListAsync();
            _logger.LogInformation("Retrieved {Count} patients", patients.Count);
            return Ok(patients);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
            {
                _logger.LogWarning("Patient with ID {Id} not found", id);
                return NotFound($"Patient with ID {id} not found");
            }
            
            _logger.LogInformation("Retrieved patient with ID: {Id}", id);
            return Ok(patient);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatient(int id, [FromBody] Patient patient)
        {
            // Debug authentication info
            var isAuthenticated = User?.Identity?.IsAuthenticated ?? false;
            _logger.LogInformation("UpdatePatient: User is authenticated: {IsAuthenticated}", isAuthenticated);
            _logger.LogInformation("UpdatePatient: User name: {Name}", User?.Identity?.Name);
            _logger.LogInformation("UpdatePatient: Received patient data: {@Patient}", patient);

            if (id != patient.Id)
            {
                _logger.LogWarning("UpdatePatient: ID mismatch. Path ID: {PathId}, Body ID: {BodyId}", id, patient.Id);
                return BadRequest("ID in URL does not match ID in the request body");
            }

            var existingPatient = await _context.Patients.FindAsync(id);
            if (existingPatient == null)
            {
                _logger.LogWarning("UpdatePatient: Patient with ID {Id} not found", id);
                return NotFound($"Patient with ID {id} not found");
            }

            existingPatient.FirstName = patient.FirstName;
            existingPatient.LastName = patient.LastName;
            existingPatient.Email = patient.Email;
            existingPatient.Phone = patient.Phone;
            existingPatient.DateOfBirth = patient.DateOfBirth;

            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation("Updated patient with ID: {Id}", id);
                return Ok("Patient updated successfully");
            }
            catch (DbUpdateConcurrencyException ex)
            {
                _logger.LogError(ex, "Concurrency error updating patient with ID: {Id}", id);
                return StatusCode(500, "An error occurred while updating the patient");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
            {
                _logger.LogWarning("DeletePatient: Patient with ID {Id} not found", id);
                return NotFound($"Patient with ID {id} not found");
            }

            try
            {
                _context.Patients.Remove(patient);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Deleted patient with ID: {Id}", id);
                return Ok("Patient deleted successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting patient with ID: {Id}", id);
                return StatusCode(500, "An error occurred while deleting the patient");
            }
        }

        [HttpGet("test")]
        [AllowAnonymous]
        public IActionResult Test()
        {
            var isAuthenticated = User?.Identity?.IsAuthenticated ?? false;
            var userName = User?.Identity?.Name ?? "not set";
            
            // Simplest approach - convert to array of strings
            var claims = User?.Claims?.Select(c => $"{c.Type}: {c.Value}").ToArray() ?? Array.Empty<string>();
            
            return Ok(new { 
                Message = "Test endpoint working", 
                IsAuthenticated = isAuthenticated,
                UserName = userName,
                Claims = claims
            });
        }
    }
}