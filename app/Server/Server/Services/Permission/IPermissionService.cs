namespace Server.Services.Permission;

public interface IPermissionService
{
    public Task<bool> HasGlobalPermissionAsync(string permissionName);
    public Task<bool> HasProjectPermissionAsync(int projectId, string permissionName);
}