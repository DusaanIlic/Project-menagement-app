using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Server.Hubs
{
  public class ActiveStatusHub : Hub
  {
    public override async Task OnConnectedAsync()
    {
      await Clients.All.SendAsync("MemberConnected", Context.ConnectionId);
      await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
      await Clients.All.SendAsync("MemberDisconnected", Context.ConnectionId);
      await base.OnDisconnectedAsync(exception);
    }
  }
}
