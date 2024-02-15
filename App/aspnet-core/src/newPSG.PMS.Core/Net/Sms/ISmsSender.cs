using System.Threading.Tasks;

namespace newPSG.PMS.Net.Sms
{
    public interface ISmsSender
    {
        Task SendAsync(string number, string message);
    }
}