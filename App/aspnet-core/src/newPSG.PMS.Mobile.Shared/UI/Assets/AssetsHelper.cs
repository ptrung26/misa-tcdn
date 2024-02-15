﻿namespace newPSG.PMS.UI.Assets
{
    public static class AssetsHelper
    {
        public const string AssetsNamespace = "newPSG.PMS.UI.Assets";

        public static string ProfileImagePlaceholderNamespace => GetImageNamespace("Person.png");

        public static string GetImageNamespace(string fileName)
        {
            return string.Format("{0}.Images.{1}", AssetsNamespace, fileName);
        }
    }
}