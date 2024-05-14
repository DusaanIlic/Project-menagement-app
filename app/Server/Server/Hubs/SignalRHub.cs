using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;

namespace Server.Hubs
{
  [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
  public class SignalRHub : Hub
  {
    private static Dictionary<string, string> memberIdToConnectionIdMap = new Dictionary<string, string>();
    
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
