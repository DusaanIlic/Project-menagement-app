using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Data
{
    public class LogicTenacityDbContext : DbContext
    {
        public LogicTenacityDbContext(DbContextOptions options) : base(options)
        {
        }

        public  DbSet<Project> Projects { get; set; }
        public DbSet<Member> Members { get; set; }
        public DbSet<ProjectStatus> ProjectStatuses { get; set; }
        public DbSet<ProjectTask> ProjectTasks{ get; set; }
        public DbSet<ProjectTaskStatus> ProjectTaskStatuses { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Member>()
                .HasIndex(m => m.Email)
                .IsUnique();

            modelBuilder.Entity<Project>()
                .HasOne(p => p.ProjectStatus)
                .WithMany(ps => ps.Projects)
                .HasForeignKey(p => p.ProjectStatusId)
                .IsRequired();

            modelBuilder.Entity<ProjectTask>()
                .HasOne(t => t.Project)
                .WithMany(p => p.ProjectTasks)
                .HasForeignKey(t => t.ProjectId)
                .IsRequired();

           modelBuilder.Entity<ProjectTask>()
               .HasOne(p => p.ProjectTaskStatus)
               .WithMany(pt => pt.ProjectTasks)
               .HasForeignKey(p => p.ProjectTaskStatusId)
               .IsRequired();
        }

    }
}
