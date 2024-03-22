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
        public DbSet<TaskPriority> TaskPriority { get; set; }

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
               .HasOne(pt => pt.ProjectTaskStatus)
               .WithMany(pts => pts.ProjectTasks)
               .HasForeignKey(pt => pt.ProjectTaskStatusId);

            modelBuilder.Entity<Project>()
            .HasOne(p => p.TeamLeader)
            .WithMany(ms => ms.ProjectsLead)
            .HasForeignKey(p => p.TeamLeaderId);

            modelBuilder.Entity<ProjectTask>()
               .HasOne(pt => pt.TaskPriority)
               .WithMany(ts => ts.ProjectTasks)
               .HasForeignKey(pt => pt.TaskPriorityId);
        }

    }
}
