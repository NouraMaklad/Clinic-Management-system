using System;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicManagementSystem.API.Models
{
    public class PatientSymptom
    {
        public int Id { get; set; }
        
        [Required]
        public int PatientId { get; set; }
        
        public string Symptoms { get; set; }
        public string Recommendations { get; set; }
        public DateTime RecordDate { get; set; }
        
        // Navigation property - marked as optional for model binding
        [JsonIgnore]
        [NotMapped]
        public Patient? Patient { get; set; }
    }
} 