namespace MDT.Domain.Entities;

public class FeatureHistory
{
    public Guid Id { get; set; }

    public Guid FeatureId { get; set; }

    public Guid? ImagingStudyId { get; set; }

    public double? NumericValue { get; set; }

    public string? TextValue { get; set; }

    public DateTime RecordedAt { get; set; }

    public string Source { get; set; }
        = string.Empty;

    public string ConfidenceLevel { get; set; }
        = "Medium";

    public string ProcessingPipeline { get; set; }
        = string.Empty;

    public string AlgorithmVersion { get; set; }
        = string.Empty;

    public Feature? Feature { get; set; }

    public ImagingStudy? ImagingStudy { get; set; }
}