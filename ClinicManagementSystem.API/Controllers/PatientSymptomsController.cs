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
    public class PatientSymptomsController : ControllerBase
    {
        private readonly ClinicDbContext _context;
        private readonly ILogger<PatientSymptomsController> _logger;

        public PatientSymptomsController(ClinicDbContext context, ILogger<PatientSymptomsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePatientSymptom([FromBody] PatientSymptom symptomRecord)
        {
            // Debug request data
            _logger.LogInformation("Received symptom record: {@SymptomRecord}", symptomRecord);
            
            // Validate input
            if (symptomRecord == null)
            {
                _logger.LogWarning("Invalid symptom record: null");
                return BadRequest("Invalid symptom record data: null object received");
            }

            if (symptomRecord.PatientId <= 0)
            {
                _logger.LogWarning("Invalid PatientId: {PatientId}", symptomRecord.PatientId);
                return BadRequest($"Invalid PatientId: {symptomRecord.PatientId}");
            }

            // Verify the patient exists
            var patientExists = await _context.Patients.AnyAsync(p => p.Id == symptomRecord.PatientId);
            if (!patientExists)
            {
                _logger.LogWarning("CreatePatientSymptom: Invalid Patient ID: {PatientId}", symptomRecord.PatientId);
                return BadRequest($"Invalid Patient ID: {symptomRecord.PatientId}. Patient not found.");
            }

            try
            {
                // Explicitly set Patient to null to avoid validation errors
                symptomRecord.Patient = null;
                
                _logger.LogInformation("Adding symptom record: {@SymptomRecord}", symptomRecord);
                _context.PatientSymptoms.Add(symptomRecord);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Symptom record added with ID: {Id}", symptomRecord.Id);
                return Ok(new { message = "Symptom record added successfully", id = symptomRecord.Id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating symptom record");
                return StatusCode(500, $"An error occurred while saving the symptom record: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPatientSymptoms()
        {
            try
            {
                var symptoms = await _context.PatientSymptoms
                    .Include(s => s.Patient)
                    .ToListAsync();
                
                _logger.LogInformation("Retrieved {Count} symptom records", symptoms.Count);
                return Ok(symptoms);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all symptom records");
                return StatusCode(500, "An error occurred while retrieving symptom records");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPatientSymptomById(int id)
        {
            try
            {
                var symptomRecord = await _context.PatientSymptoms
                    .Include(s => s.Patient)
                    .FirstOrDefaultAsync(s => s.Id == id);

                if (symptomRecord == null)
                {
                    _logger.LogWarning("Symptom record with ID {Id} not found", id);
                    return NotFound($"Symptom record with ID {id} not found");
                }

                _logger.LogInformation("Retrieved symptom record with ID: {Id}", id);
                return Ok(symptomRecord);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving symptom record with ID: {Id}", id);
                return StatusCode(500, "An error occurred while retrieving the symptom record");
            }
        }

        [HttpGet("patient/{patientId}")]
        public async Task<IActionResult> GetPatientSymptomsByPatientId(int patientId)
        {
            try
            {
                var patientExists = await _context.Patients.AnyAsync(p => p.Id == patientId);
                if (!patientExists)
                {
                    _logger.LogWarning("Patient with ID {Id} not found for symptom history", patientId);
                    return NotFound($"Patient with ID {patientId} not found");
                }

                var symptoms = await _context.PatientSymptoms
                    .Where(s => s.PatientId == patientId)
                    .OrderByDescending(s => s.RecordDate)
                    .ToListAsync();

                _logger.LogInformation("Retrieved {Count} symptom records for patient ID: {PatientId}", 
                    symptoms.Count, patientId);
                
                return Ok(symptoms);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving symptom records for patient ID: {PatientId}", patientId);
                return StatusCode(500, "An error occurred while retrieving patient symptom records");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatientSymptom(int id, [FromBody] PatientSymptom symptomRecord)
        {
            if (id != symptomRecord.Id)
            {
                _logger.LogWarning("ID mismatch. Path ID: {PathId}, Body ID: {BodyId}", id, symptomRecord.Id);
                return BadRequest("ID in URL does not match ID in the request body");
            }

            var existingRecord = await _context.PatientSymptoms.FindAsync(id);
            if (existingRecord == null)
            {
                _logger.LogWarning("UpdatePatientSymptom: Record with ID {Id} not found", id);
                return NotFound($"Symptom record with ID {id} not found");
            }

            // Verify the patient exists if the patient ID changed
            if (existingRecord.PatientId != symptomRecord.PatientId)
            {
                var patientExists = await _context.Patients.AnyAsync(p => p.Id == symptomRecord.PatientId);
                if (!patientExists)
                {
                    _logger.LogWarning("UpdatePatientSymptom: Invalid Patient ID: {PatientId}", symptomRecord.PatientId);
                    return BadRequest($"Invalid Patient ID: {symptomRecord.PatientId}");
                }
            }

            // Update fields
            existingRecord.PatientId = symptomRecord.PatientId;
            existingRecord.Symptoms = symptomRecord.Symptoms;
            existingRecord.Recommendations = symptomRecord.Recommendations;
            existingRecord.RecordDate = symptomRecord.RecordDate;

            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation("Updated symptom record with ID: {Id}", id);
                return Ok("Symptom record updated successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating symptom record with ID: {Id}", id);
                return StatusCode(500, "An error occurred while updating the symptom record");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatientSymptom(int id)
        {
            var symptomRecord = await _context.PatientSymptoms.FindAsync(id);
            if (symptomRecord == null)
            {
                _logger.LogWarning("DeletePatientSymptom: Record with ID {Id} not found", id);
                return NotFound($"Symptom record with ID {id} not found");
            }

            try
            {
                _context.PatientSymptoms.Remove(symptomRecord);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Deleted symptom record with ID: {Id}", id);
                return Ok("Symptom record deleted successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting symptom record with ID: {Id}", id);
                return StatusCode(500, "An error occurred while deleting the symptom record");
            }
        }
    }
} 