using System;
using System.Text.Json.Serialization;

namespace ClinicManagementSystem.API.Models
{
    public class Patient
    {
        public int Id { get; set; }
        public string? FirstName { get; set; } // Made nullable
        public string? LastName { get; set; } // Made nullable
        public string? Email { get; set; } // Made nullable
        public string? Phone { get; set; } // Made nullable
        
        // Ensure proper DateTime handling
        public DateTime DateOfBirth { get; set; }
    }
}