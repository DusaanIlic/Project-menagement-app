namespace Server.Services.Permission;

public interface IPermissionService
{
    public Task<bool> HasGlobalPermissionAsync(int memberId, string permissionName);
    public Task<bool> HasProjectPermissionAsync(int memberId, int projectId, string permissionName);
}