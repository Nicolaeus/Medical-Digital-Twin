using FellowOakDicom;

using MDT.Domain.Entities;
using MDT.Domain.Enums;
using MDT.Modules.Imaging.Interfaces;

namespace MDT.Modules.Imaging.Services;

public class DicomImportService : IDicomImportService
{
    public async Task<ImagingStudy> ImportStudyAsync(
        string dicomFolder)
    {
        if (!Directory.Exists(dicomFolder))
        {
            throw new DirectoryNotFoundException(
                $"Folder not found: {dicomFolder}");
        }

        var dicomFiles = Directory
            .GetFiles(dicomFolder, "*.*", SearchOption.AllDirectories)
            .Where(f =>
                f.EndsWith(".dcm", StringComparison.OrdinalIgnoreCase)
                || !Path.HasExtension(f))
            .ToList();

        if (!dicomFiles.Any())
        {
            throw new Exception("No DICOM files found.");
        }

        var firstFile = await DicomFile.OpenAsync(
            dicomFiles.First());

        var dataset = firstFile.Dataset;

        var study = new ImagingStudy
        {
            Id = Guid.NewGuid(),

            StudyInstanceUid =
                dataset.GetSingleValueOrDefault(
                    DicomTag.StudyInstanceUID,
                    string.Empty),

            StudyDescription =
                dataset.GetSingleValueOrDefault(
                    DicomTag.StudyDescription,
                    string.Empty),

            Modality =
                dataset.GetSingleValueOrDefault(
                    DicomTag.Modality,
                    string.Empty),

            BodyPartExamined =
                dataset.GetSingleValueOrDefault(
                    DicomTag.BodyPartExamined,
                    string.Empty),

            Manufacturer =
                dataset.GetSingleValueOrDefault(
                    DicomTag.Manufacturer,
                    string.Empty),

            StudyDate =
                ParseStudyDate(
                    dataset.GetSingleValueOrDefault(
                        DicomTag.StudyDate,
                        string.Empty))
        };

        var seriesGroups = new Dictionary<
            string,
            List<string>>();

        foreach (var filePath in dicomFiles)
        {
            var dicom =
                await DicomFile.OpenAsync(filePath);

            var seriesUid =
                dicom.Dataset.GetSingleValueOrDefault(
                    DicomTag.SeriesInstanceUID,
                    string.Empty);

            if (!seriesGroups.ContainsKey(seriesUid))
            {
                seriesGroups[seriesUid] =
                    new List<string>();
            }

            seriesGroups[seriesUid].Add(filePath);
        }

        foreach (var group in seriesGroups)
        {
            var dicom =
                await DicomFile.OpenAsync(
                    group.Value.First());

            var ds = dicom.Dataset;

            var series =
                new ImagingSeries
                {
                    Id = Guid.NewGuid(),

                    ImagingStudyId = study.Id,

                    SeriesInstanceUid =
                        ds.GetSingleValueOrDefault(
                            DicomTag.SeriesInstanceUID,
                            string.Empty),

                    SeriesDescription =
                        ds.GetSingleValueOrDefault(
                            DicomTag.SeriesDescription,
                            string.Empty),

                    Modality =
                        ds.GetSingleValueOrDefault(
                            DicomTag.Modality,
                            string.Empty),

                    NumberOfImages =
                        group.Value.Count,

                    SliceThickness =
                        ds.GetSingleValueOrDefault<double>(
                            DicomTag.SliceThickness,
                            0),

                    SeriesPath =
                        Path.GetDirectoryName(
                            group.Value.First()) ?? string.Empty
                };

            study.Series.Add(series);
        }

        return study;
    }

    private static DateTime ParseStudyDate(
        string value)
    {
        if (DateTime.TryParseExact(
                value,
                "yyyyMMdd",
                null,
                System.Globalization.DateTimeStyles.None,
                out var date))
        {
            return date;
        }

        return DateTime.UtcNow;
    }
}