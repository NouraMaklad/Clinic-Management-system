namespace ClinicManagementSystem.API.Models
{
    public class Doctor
    {
        public int Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Specialty { get; set; }
    }
}