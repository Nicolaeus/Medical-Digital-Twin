namespace MDT.Domain.ValueObjects;

using MDT.Domain.Enums;

public class FeatureDefinition
{
    public FeatureCode Code { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Unit { get; set; } = string.Empty;

    public FeatureCategory Category { get; set; }

    public string Description { get; set; } = string.Empty;

    public bool IsTimeSeries { get; set; }

    public bool IsPredictive { get; set; }

    public bool IsImagingDerived { get; set; }
}