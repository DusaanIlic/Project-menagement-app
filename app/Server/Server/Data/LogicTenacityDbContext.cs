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
        public DbSet<MemberTask> MemberTasks { get; set; }
        public DbSet<TaskDependency> TaskDependencies { get; set; }

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

            modelBuilder.Entity<MemberTask>()
                .HasKey(mt => new { mt.MemberId, mt.TaskId });

            modelBuilder.Entity<MemberTask>()
                .HasOne(mt => mt.Member)
                .WithMany(m => m.Tasks)
                .HasForeignKey(mt => mt.MemberId);

            modelBuilder.Entity<MemberTask>()
                .HasOne(mt => mt.Task)
                .WithMany(t => t.Members)
                .HasForeignKey(mt => mt.TaskId);

            modelBuilder.Entity<TaskDependency>()
        .HasKey(td => new { td.TaskId, td.DependentTaskId });

            modelBuilder.Entity<TaskDependency>()
                .HasOne(td => td.Task)
                .WithMany(t => t.Dependencies)
                .HasForeignKey(td => td.TaskId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TaskDependency>()
                .HasOne(td => td.DependentTask)
                .WithMany(t => t.DependentTasks)
                .HasForeignKey(td => td.DependentTaskId)
                .OnDelete(DeleteBehavior.Restrict);
        }

    }
}
