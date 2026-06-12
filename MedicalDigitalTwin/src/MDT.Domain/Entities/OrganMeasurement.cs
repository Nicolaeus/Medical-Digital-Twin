namespace MDT.Domain.Entities;

public class OrganMeasurement
{
    public Guid Id { get; set; }

    public Guid ImagingStudyId { get; set; }

    public string OrganCode { get; set; } = string.Empty;

    public string OrganName { get; set; } = string.Empty;

    public double VolumeMl { get; set; }

    public double? MeanDensityHu { get; set; }

    public double ConfidenceScore { get; set; }

    public string SegmentationSource { get; set; } = "TotalSegmentator";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ImagingStudy? ImagingStudy { get; set; }
}