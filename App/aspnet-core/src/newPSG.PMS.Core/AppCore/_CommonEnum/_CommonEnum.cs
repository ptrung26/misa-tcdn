using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
namespace newPSG
{
    public static partial class CommonEnum
    {

        //public class EnumObj
        //{
        //    public int Id { get; set; }
        //    public string Name { get; set; }
        //}
        public class ItemObj<T>
        {
            public T Id { get; set; }
            public string Name { get; set; }
        }

       

        //public static List<EnumObj> EnumToList(Type TypeObject)
        //{
        //    List<EnumObj> objTemList = new List<EnumObj>();
        //    try
        //    {
        //        foreach (object iEnumItem in Enum.GetValues(TypeObject))
        //        {
        //            EnumObj objTem = new EnumObj();
        //            objTem.Id = ((int)iEnumItem);
        //            objTem.Name = GetEnumDisplayString(iEnumItem.GetType(), iEnumItem.ToString());
        //            objTemList.Add(objTem);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //    }
        //    return objTemList;
        //}
        //public static string GetEnumDisplayString(Type enumType, string enumValue)
        //{
        //    try
        //    {
        //        MemberInfo memInfo = enumType.GetMember(enumValue)[0];

        //        var attrs = memInfo.GetCustomAttributes(typeof(DisplayAttribute), false);
        //        var outString = ((DisplayAttribute)attrs[0]).Name;

        //        if (((DisplayAttribute)attrs[0]).ResourceType != null)
        //        {
        //            outString = ((DisplayAttribute)attrs[0]).GetName();
        //        }
        //        return outString;

        //        //if (memInfo != null && memInfo.Length > 0)
        //        //{
        //        //    object[] attrs = memInfo[0].GetCustomAttributes(typeof(EnumDisplayString), false);

        //        //    if (attrs != null && attrs.Length > 0)
        //        //        return ((EnumDisplayString)attrs[0]).DisplayString;
        //        //}
        //    }
        //    catch { }
        //    return enumValue.ToString();
        //}

        public static string GetEnumDescription(Enum en)
        {
            Type type = en.GetType();

            try
            {
                MemberInfo[] memInfo = type.GetMember(en.ToString());

                if (memInfo != null && memInfo.Length > 0)
                {
                    object[] attrs = memInfo[0].GetCustomAttributes(typeof(EnumDisplayString), false);

                    if (attrs != null && attrs.Length > 0)
                        return ((EnumDisplayString)attrs[0]).DisplayString;
                }
            }
            catch (Exception)
            {
                return string.Empty;
            }

            return en.ToString();
        }
        public class EnumDisplayString : Attribute
        {
            public string DisplayString;

            public EnumDisplayString(string text)
            {
                this.DisplayString = text;
            }
        }



    }
}
