using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Mozilla;
using Server.Models;
using File = Server.Models.File;

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
        public DbSet<TaskCategory> TaskCategories { get; set; }
        public DbSet<File> Files { get; set; }
        public DbSet<Role> Roles {  get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }
        public DbSet<TaskActivity> TaskActivities { get; set; }
        public DbSet<TaskActivityType> TaskActivityTypes { get; set; }

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

            modelBuilder.Entity<ProjectTask>()
                .HasOne(pt => pt.TaskCategory)
                .WithMany(tc => tc.ProjectTasks)
                .HasForeignKey(pt => pt.TaskCategoryId);

            modelBuilder.Entity<File>()
                .HasOne(uf => uf.Uploader)
                .WithMany(m => m.UploadedFiles)
                .HasForeignKey(uf => uf.UploaderId);

            modelBuilder.Entity<Member>()
               .HasOne(m => m.Role)
               .WithMany(r => r.Members)
               .HasForeignKey(m => m.RoleId);

            modelBuilder.Entity<RolePermission>()
            .HasKey(rp => new { rp.RoleId, rp.PermissionId });

            modelBuilder.Entity<Role>()
                .HasMany(r => r.RolePermissions)
                .WithOne(rp => rp.Role)
                .HasForeignKey(rp => rp.RoleId);

            modelBuilder.Entity<Permission>()
                .HasMany(p => p.RolePermissions)
                .WithOne(rp => rp.Permission)
                .HasForeignKey(rp => rp.PermissionId);

            modelBuilder.Entity<TaskActivity>()
                .HasOne(a => a.ProjectTask)
                .WithMany(pt => pt.TaskActivities)
                .HasForeignKey(a => a.ProjectTaskId);

            modelBuilder.Entity<TaskActivity>()
                .HasOne(ta => ta.Member)
                .WithMany(m => m.TaskActivities)
                .HasForeignKey(ta => ta.MemberId);

            modelBuilder.Entity<TaskActivity>()
                .HasOne(a => a.TaskActivityType)
                .WithMany(t => t.TaskActivities)
                .HasForeignKey(a => a.TaskActivityTypeId);
        }
    }
}
