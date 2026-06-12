using MDT.Domain.Entities;
using MDT.Domain.Enums;
using MDT.Modules.Imaging.Interfaces;

namespace MDT.Modules.Imaging.Services;

public class FeatureExtractionService
    : IFeatureExtractionService
{
    public async Task<List<Feature>>
        ExtractFeaturesAsync(
            ImagingStudy study,
            string segmentationFolder)
    {
        var features =
            new List<Feature>();

        var mapping =
            new Dictionary<string, FeatureCode>
            {
                { "liver", FeatureCode.LiverVolume },
                { "heart", FeatureCode.HeartVolume },
                { "spleen", FeatureCode.SpleenVolume },
                { "muscle", FeatureCode.MuscleVolume },
                { "aorta", FeatureCode.AortaVolume }
            };

        foreach (var file in Directory.GetFiles(
                     segmentationFolder,
                     "*.json"))
        {
            var name =
                Path.GetFileNameWithoutExtension(file)
                    .ToLower();

            if (!mapping.ContainsKey(name))
                continue;

            var value =
                double.Parse(
                    await File.ReadAllTextAsync(file));

            features.Add(
                new Feature
                {
                    Id = Guid.NewGuid(),

                    PatientId =
                        study.PatientId,

                    FeatureCode =
                        mapping[name].ToString(),

                    FeatureName =
                        mapping[name].ToString(),

                    Category = "Anatomy",

                    CurrentValue = value,

                    Unit = "mL",

                    LastUpdated =
                        DateTime.UtcNow,

                    ConfidenceScore = 0.95
                });
        }

        return features;
    }
}