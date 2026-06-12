using MDT.Domain.Enums;

namespace MDT.Domain.ValueObjects;

public static class FeatureCatalog
{
    public static readonly Dictionary<FeatureCode, FeatureDefinition>
        Definitions =
            new()
            {
                {
                    FeatureCode.LiverVolume,
                    new FeatureDefinition
                    {
                        Code = FeatureCode.LiverVolume,
                        Name = "Liver Volume",
                        Unit = "mL",
                        Category = FeatureCategory.Anatomy,
                        Description = "Total liver volume",
                        IsTimeSeries = true,
                        IsImagingDerived = true
                    }
                },

                {
                    FeatureCode.HeartVolume,
                    new FeatureDefinition
                    {
                        Code = FeatureCode.HeartVolume,
                        Name = "Heart Volume",
                        Unit = "mL",
                        Category = FeatureCategory.Anatomy,
                        Description = "Total heart volume",
                        IsTimeSeries = true,
                        IsImagingDerived = true
                    }
                }
            };
}