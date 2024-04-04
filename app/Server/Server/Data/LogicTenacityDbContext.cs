using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Mozilla;
using Server.Models;
using File = Server.Models.File;
using TaskStatus = Server.Models.TaskStatus;

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
        public DbSet<TaskStatus> TaskStatuses { get; set; }
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
        public DbSet<TaskComment> TaskComments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Member>()
                .HasIndex(m => m.Email)
                .IsUnique();

            modelBuilder.Entity<Member>()
                .HasOne(m => m.Avatar)
                .WithMany()
                .HasForeignKey(m => m.AvatarId);
                
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
               .HasOne(pt => pt.TaskStatus)
               .WithMany(pts => pts.ProjectTasks)
               .HasForeignKey(pt => pt.TaskStatusId);

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

            modelBuilder.Entity<ProjectTaskStatus>()
                .HasKey(ppts => new { ppts.ProjectId, ppts.TaskStatusId });

            modelBuilder.Entity<Project>()
                .HasMany(p => p.ProjectTaskStatuses)
                .WithOne(pts => pts.Project)
                .HasForeignKey(pts => pts.ProjectId);
            
            modelBuilder.Entity<TaskStatus>()
                .HasMany(ts => ts.ProjectTaskStatuses)
                .WithOne(pts => pts.TaskStatus)
                .HasForeignKey(pts => pts.TaskStatusId);
            
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

            modelBuilder.Entity<Permission>().HasData(
                new Permission { PermissionId = 1, PermissionName = "Add members" },
                new Permission { PermissionId = 2, PermissionName = "Deactivate members" },
                new Permission { PermissionId = 3, PermissionName = "Create project" },
                new Permission { PermissionId = 4, PermissionName = "Create task" },
                new Permission { PermissionId = 5, PermissionName = "Delete project" },
                new Permission { PermissionId = 6, PermissionName = "Delete task" },
                new Permission { PermissionId = 7, PermissionName = "Add member to task" },
                new Permission { PermissionId = 8, PermissionName = "Add member to project" },
                new Permission { PermissionId = 9, PermissionName = "Remove member from task" },
                new Permission { PermissionId = 10, PermissionName = "Remove member from project" },
                new Permission { PermissionId = 11, PermissionName = "Change task status" },
                new Permission { PermissionId = 12, PermissionName = "Change project status" }
            );
            
            modelBuilder.Entity<Role>().HasData(
                new Role { RoleId = 1, RoleName = "Administrator" },
                new Role { RoleId = 2, RoleName = "Project Manager"},
                new Role { RoleId = 3, RoleName = "Worker" }
            );

            modelBuilder.Entity<RolePermission>().HasData(
                new RolePermission { RoleId = 1, PermissionId = 1 },
                new RolePermission { RoleId = 1, PermissionId = 2 },
                new RolePermission { RoleId = 2, PermissionId = 3 },
                new RolePermission { RoleId = 2, PermissionId = 4 },
                new RolePermission { RoleId = 2, PermissionId = 5 },
                new RolePermission { RoleId = 2, PermissionId = 6 },
                new RolePermission { RoleId = 2, PermissionId = 7 },
                new RolePermission { RoleId = 2, PermissionId = 8 },
                new RolePermission { RoleId = 2, PermissionId = 9 },
                new RolePermission { RoleId = 2, PermissionId = 10 },
                new RolePermission { RoleId = 3, PermissionId = 11 }
            );

            modelBuilder.Entity<ProjectStatus>().HasData(
                new ProjectStatus { Id = 1, Status = "In Preparation" },
                new ProjectStatus { Id = 2, Status = "Closed" },
                new ProjectStatus { Id = 3, Status = "In Progress" }
            );
            
            modelBuilder.Entity<TaskStatus>().HasData(
                new TaskStatus { Id = 1, Name = "New", IsDefault = true },
                new TaskStatus { Id = 2, Name = "In Progress", IsDefault = true },
                new TaskStatus { Id = 3, Name = "Completed", IsDefault = true }
            );

            modelBuilder.Entity<TaskPriority>().HasData(
                new TaskPriority { TaskPriorityId = 1, Name = "Low" },
                new TaskPriority { TaskPriorityId = 2, Name = "Medium" },
                new TaskPriority { TaskPriorityId = 3, Name = "High" }
            );
            
            modelBuilder.Entity<TaskCategory>().HasData(
                new TaskCategory { TaskCategoryID = 1, CategoryName = "None" }
            );
            
            modelBuilder.Entity<TaskActivityType>().HasData(
                new TaskActivityType { TaskActivityTypeId = 1, TaskActivityName = "Review" },
                new TaskActivityType { TaskActivityTypeId = 2, TaskActivityName = "Update" },
                new TaskActivityType { TaskActivityTypeId = 3, TaskActivityName = "Bug fix" }
            );
        }
    }
}
