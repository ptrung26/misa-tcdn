using System;
using System.Text;
using System.Text.RegularExpressions;

namespace newPSG.PMS.Utilities
{
    public class StringHelperUtility
    {
        public static string ConvertToUnsign(string s)
        {
            if (string.IsNullOrEmpty(s)) return s;
            Regex regex = new Regex("\\p{IsCombiningDiacriticalMarks}+");
            string temp = s.Normalize(NormalizationForm.FormD);
            return regex.Replace(temp, String.Empty).Replace('\u0111', 'd').Replace('\u0110', 'D');
        }

        public static string ReplaceYCharToIChar(string s)
        {
            if (string.IsNullOrEmpty(s)) return s;
            s = s.ToLower()
                .Replace("y", "i")
                .Replace("ỳ", "i")
                .Replace("ỷ", "i")
                .Replace("ý", "i")
                .Replace("ỵ", "i");
            return s;
        }
    }
}