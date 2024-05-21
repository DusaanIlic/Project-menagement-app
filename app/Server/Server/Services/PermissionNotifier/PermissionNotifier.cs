using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Hubs;

namespace Server.Services.PermissionNotifier;

public class PermissionNotifier : IPermissionNotifier
{
    private readonly IHubContext<SignalRHub> _hubContext;
    private readonly LogicTenacityDbContext _dbContext;

    public PermissionNotifier(IHubContext<SignalRHub> hubContext, LogicTenacityDbContext dbContext)
    {
        _hubContext = hubContext;
        _dbContext = dbContext;
    }


    public async Task AssignedToProject(int memberId, int projectId)
    {
        if (SignalRHub.Connections.ContainsKey(memberId))
        {
            var connectionIds = SignalRHub.Connections[memberId];
            foreach (var connectionId in connectionIds)
            {
                await _hubContext.Clients.Client(connectionId).SendAsync("AssignedToProject", projectId);
            }
        }
    }

    public async Task RemovedFromProject(int memberId, int projectId)
    {
        if (SignalRHub.Connections.ContainsKey(memberId))
        {
            var connectionIds = SignalRHub.Connections[memberId];
            foreach (var connectionId in connectionIds)
            {
                await _hubContext.Clients.Client(connectionId).SendAsync("RemovedFromProject", projectId);
            }
        }
    }

    public async Task UpdatedGlobalPermissions(int memberId)
    {
        if (SignalRHub.Connections.ContainsKey(memberId))
        {
            var member = await _dbContext.Members.FirstOrDefaultAsync(m => m.Id == memberId);

            if (member == null)
            {
                return;
            }
            
            var permissions = await _dbContext.RolePermissions
                .Where(rp => rp.RoleId == member.RoleId)
                .ToListAsync();

            var permissionList = permissions.Select(p => p.PermissionId);
            
            var connectionIds = SignalRHub.Connections[memberId];
            
            foreach (var connectionId in connectionIds)
            {
                await _hubContext.Clients.Client(connectionId).SendAsync("UpdatedGlobalPermissions", permissionList);
            }
        }
    }
}