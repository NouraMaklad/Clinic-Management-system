using System; // Added

namespace ClinicManagementSystem.API.Models
{
    public class Admin
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;

        public Admin()
        {
            // Parameterless constructor for model binding
        }
        
        public Admin(string username)
        {
            Username = username ?? throw new ArgumentNullException(nameof(username));
        }
    }
}