using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Server.Hubs;

namespace Server.Services.PermissionNotifier;

public class PermissionNotifier : IPermissionNotifier
{
    private readonly IHubContext<SignalRHub> _hubContext;

    public PermissionNotifier(IHubContext<SignalRHub> hubContext)
    {
        _hubContext = hubContext;
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
}