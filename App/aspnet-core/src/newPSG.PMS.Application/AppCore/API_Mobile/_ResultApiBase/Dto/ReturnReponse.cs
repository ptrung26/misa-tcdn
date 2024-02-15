using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace newPSG.PMS.AppCore.API_Mobile._ResultApiBase.Dto
{
    public class ReturnReponse<T>
    {
        public bool Success { get; set; }
        public T Data { get; set; }
        public ErrorResponse Error { get; set; }
        public ReturnReponse()
        {
            Success = true;
            Error = null;
        }
    }
    public class ErrorResponse
    {
        public int Code { get; set; }
        public string Message { get; set; }
        public string Details { get; set; }
        public object ValidationErrors { get; set; }

        public ErrorResponse()
        {

        }
        public ErrorResponse(int code, string message, string details="")
        {
            this.Code = code;
            this.Message = message;
            this.Details = details;
        }
    }
}
