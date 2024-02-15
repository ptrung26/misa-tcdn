using Abp.AspNetZeroCore.Net;
using System;
using System.IO;
using Telerik.Windows.Documents.Common.FormatProviders;
using Telerik.Windows.Documents.Flow.FormatProviders.Docx;
using Telerik.Windows.Documents.Flow.FormatProviders.Html;
using Telerik.Windows.Documents.Flow.FormatProviders.Rtf;
using Telerik.Windows.Documents.Flow.Model;
using Telerik.Windows.Documents.Spreadsheet.FormatProviders;
using Telerik.Windows.Documents.Spreadsheet.FormatProviders.OpenXml.Xlsx;
using Telerik.Windows.Documents.Spreadsheet.FormatProviders.TextBased.Csv;
using Telerik.Windows.Documents.Spreadsheet.FormatProviders.TextBased.Txt;
using Telerik.Windows.Documents.Spreadsheet.Model;

namespace newPSG.PMS.Export.Services
{
    public class FileHelperSingleton
    {
        private volatile static FileHelperSingleton instance; //volatile để tránh đụng độ thred
        private static object key = new object();
        public static FileHelperSingleton Instance
        {
            get
            {
                if (instance == null)
                    lock (key)
                    {
                        instance = new FileHelperSingleton();

                    }
                return instance;
            }
        }
        private FileHelperSingleton() { }

        private const string XlsxFormat = "xlsx";
        private const string CsvFormat = "csv";
        private const string TxtFormat = "txt";
        private const string PdfFormat = "pdf";

        public byte[] SaveDocument(Workbook workbook, string selectedFormat)
        {


            IWorkbookFormatProvider formatProvider = GetFormatProvider(selectedFormat);

            if (formatProvider == null)
            {
                Console.WriteLine("Uknown or not supported format.");
                return null;
            }

            byte[] renderedBytes = null;
            using (MemoryStream ms = new MemoryStream())
            {
                formatProvider.Export(workbook, ms);
                renderedBytes = ms.ToArray();
            }
            return renderedBytes;
        }

        public byte[] SaveDocument(RadFlowDocument document, string selectedFormat)
        {
            string selectedFormatLower = selectedFormat.ToLower();

            IFormatProvider<RadFlowDocument> formatProvider = null;
            switch (selectedFormatLower)
            {
                case "docx":
                    formatProvider = new DocxFormatProvider();
                    break;
                case "rtf":
                    formatProvider = new RtfFormatProvider();
                    break;
                case "txt":
                    //formatProvider = new TxtFormatProvider();
                    break;
                case "html":
                    formatProvider = new HtmlFormatProvider();
                    break;
                case "pdf":
                    formatProvider = new Telerik.Windows.Documents.Flow.FormatProviders.Pdf.PdfFormatProvider();
                    break;
            }

            if (formatProvider == null)
            {
                Console.WriteLine("Uknown or not supported format.");
                return null;
            }

            string path = "Sample document." + selectedFormat;

            byte[] renderedBytes = null;
            using (MemoryStream ms = new MemoryStream())
            {
                formatProvider.Export(document, ms);
                renderedBytes = ms.ToArray();
            }
            return renderedBytes;

        }

        private IWorkbookFormatProvider GetFormatProvider(string extension)
        {
            switch (extension)
            {
                case XlsxFormat:
                    return new XlsxFormatProvider();
                case CsvFormat:
                    IWorkbookFormatProvider formatProvider = new CsvFormatProvider();
                    (formatProvider as CsvFormatProvider).Settings.HasHeaderRow = true;
                    return formatProvider;
                case TxtFormat:
                    return new TxtFormatProvider();
                case PdfFormat:
                    return new Telerik.Windows.Documents.Spreadsheet.FormatProviders.Pdf.PdfFormatProvider();

                default:
                    return null;
            }
        }

        public string GetExtentionFile(string ext)
        {
            switch (ext)
            {
                case "pdf":
                    return MimeTypeNames.ApplicationPdf;
                case "doc":
                    return MimeTypeNames.ApplicationMsword;
                case "docx":
                    return MimeTypeNames.ApplicationVndOpenxmlformatsOfficedocumentWordprocessingmlDocument;
                case "xls":
                    return MimeTypeNames.ApplicationVndMsExcel;
                case "xlsx":
                    return MimeTypeNames.ApplicationVndOpenxmlformatsOfficedocumentSpreadsheetmlSheet;
                default:
                    return "";
            }
        }
    }
}