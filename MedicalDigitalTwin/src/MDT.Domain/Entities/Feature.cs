namespace MDT.Domain.Entities;

public class Feature
{
    public Guid Id { get; set; }

    public Guid PatientId { get; set; }

    public string FeatureCode { get; set; } = string.Empty;

    public string FeatureName { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public double? CurrentValue { get; set; }

    public string Unit { get; set; } = string.Empty;

    public double ConfidenceScore { get; set; }

    public string Trend { get; set; } = "Unknown";

    public DateTime LastUpdated { get; set; }

    public Patient? Patient { get; set; }

    public ICollection<FeatureHistory> History { get; set; }
        = new List<FeatureHistory>();
}