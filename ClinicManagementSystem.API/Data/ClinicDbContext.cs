using ClinicManagementSystem.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ClinicManagementSystem.API.Data
{
    public class ClinicDbContext : DbContext
    {
        public ClinicDbContext(DbContextOptions<ClinicDbContext> options)
            : base(options)
        {
        }

        public DbSet<Admin> Admins { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<PatientSymptom> PatientSymptoms { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Patient)
                .WithMany()
                .HasForeignKey(a => a.PatientId);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Doctor)
                .WithMany()
                .HasForeignKey(a => a.DoctorId);
                
            modelBuilder.Entity<PatientSymptom>()
                .HasOne(ps => ps.Patient)
                .WithMany()
                .HasForeignKey(ps => ps.PatientId)
                .OnDelete(DeleteBehavior.Cascade);
                
            // Make sure navigation property is optional
            modelBuilder.Entity<PatientSymptom>()
                .Navigation(ps => ps.Patient)
                .IsRequired(false);
        }
    }
}