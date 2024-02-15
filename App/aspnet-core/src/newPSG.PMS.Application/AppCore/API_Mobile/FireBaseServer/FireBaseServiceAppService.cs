using Abp.Application.Services;
using Abp.Domain.Repositories;
using FCM.Net;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using newPSG.PMS.AppCore.FireBaseServer;
using newPSG.PMS.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace newPSG.PMS.AppCore.API_Mobile.FireBaseServer
{
    public interface IFireBaseServiceAppService : IApplicationService
    {
        Task<ResponseContent> SendMessageTest(long userId);
    }
    public class FireBaseServiceAppService: PMSAppServiceBase, IFireBaseServiceAppService
    {

        private readonly IConfigurationRoot _appConfiguration;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IRepository<UserFireBaseToken, long> _userFireBaseTokenRepository;
        public FireBaseServiceAppService(IWebHostEnvironment env,
            IRepository<UserFireBaseToken, long> userFireBaseTokenRepository)
        {
            _hostingEnvironment = env;
            _appConfiguration = env.GetAppConfiguration();
            _userFireBaseTokenRepository = userFireBaseTokenRepository;
        }

        public async  Task<ResponseContent> SendMessageTest(long userId)
        {
            var listToken = await GetFireBaseTokenByUserId(userId);
            var fireBaseConfig = _appConfiguration.GetSection("App")?.GetSection("FIRE_BASE");
            var serverKey = fireBaseConfig["ServerKey"];

            using (var sender = new Sender(serverKey))
            {
                var message = new Message
                {
                    RegistrationIds = listToken,
                    Notification = new Notification
                    {
                        Title = "Test from FCM.Net",
                        Body = $"Hello World@!{DateTime.Now.ToString()}"
                    },
                    Data = new {
                        property1="test",
                        property2 = DateTime.Now
                    }
                };
                var result = await sender.SendAsync(message);
                Console.WriteLine($"Success: {result.MessageResponse.Success}");
                return result;
            }

            //foreach (var token in listToken)
            //{
            //    var data = new
            //    {

            //        to = token,
            //        notification = new { title = "title API SENT", body = "Body API SENT" },
            //        data = new Dictionary<string, string>
            //        {
            //            { "score", "5x1-TESTVALUE" },
            //            { "time", "15:10-TESTVALUE" }
            //        }
            //        //data = new
            //        //{
            //        //    message = "Message Test from server c#",
            //        //    name = "Mr viet",
            //        //    sendId = "xxxx-xxxx-xxxx"
            //        //}
            //    };
            //    res.Add(SendNotification(data));
            //}
        }
        private async Task<List<string>> GetFireBaseTokenByUserId(long userId)
        {
            return await _userFireBaseTokenRepository.GetAll().Where(x => x.UserId == userId).Select(x=>x.FireBaseToken).ToListAsync();
        }
        //public string SendNotification(object data)
        //{
        //    var json = Newtonsoft.Json.JsonConvert.SerializeObject(data);
        //    Byte[] byteArray = Encoding.UTF8.GetBytes(json);
        //    return SendNotification(byteArray);
        //}
        //private string SendNotification(Byte[] byteArray)
        //{
        //    try
        //    {
        //        var fireBaseConfig = _appConfiguration.GetSection("App")?.GetSection("FIRE_BASE");
        //        var serverKey = fireBaseConfig["ServerKey"];
        //        var senderID = fireBaseConfig["SenderID"];
        //        string webRequestLink = "https://fcm.googleapis.com/fcm/send";


        //        WebRequest tRequest = WebRequest.Create(webRequestLink);
        //        tRequest.Method = "post";
        //        tRequest.ContentType = "application/json";
        //        tRequest.Headers.Add($"Authorization: key={serverKey}");
        //        tRequest.Headers.Add($"Sender: id={senderID}");

        //       tRequest.ContentLength = byteArray.Length;
        //        Stream dataStream = tRequest.GetRequestStream();
        //        dataStream.Write(byteArray, 0, byteArray.Length);
        //        dataStream.Close();

        //        WebResponse tResponse = tRequest.GetResponse();
        //        dataStream = tResponse.GetResponseStream();
        //        StreamReader tReader = new StreamReader(dataStream);

        //        string sResponseFromServer = tReader.ReadToEnd();
        //        FCMResponse response = Newtonsoft.Json.JsonConvert.DeserializeObject<FCMResponse>(sResponseFromServer);
        //        if (response.success == 1)
        //        {
        //            //new NotificationBLL().InsertNotificationLog(dayNumber, notification, true);
        //        }
        //        else if (response.failure == 1)
        //        {
        //            //new NotificationBLL().InsertNotificationLog(dayNumber, notification, false);
        //            //sbLogger.AppendLine(string.Format("Error sent from FCM server, after sending request : {0} , for following device info: {1}", responseFromFirebaseServer, jsonNotificationFormat));

        //        }

        //        tReader.Close();
        //        dataStream.Close();
        //        tResponse.Close();
        //        return sResponseFromServer;
        //    }
        //    catch (Exception ex)
        //    {

        //        throw;
        //    }
        //}

    }
}
