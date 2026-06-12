namespace MDT.Domain.Entities;

public class ImagingSeries
{
    public Guid Id { get; set; }

    public Guid ImagingStudyId { get; set; }

    public string SeriesInstanceUid { get; set; } = string.Empty;

    public string SeriesDescription { get; set; } = string.Empty;

    public string Modality { get; set; } = string.Empty;

    public int NumberOfImages { get; set; }

    public double SliceThickness { get; set; }

    public string SeriesPath { get; set; } = string.Empty;

    public ImagingStudy? ImagingStudy { get; set; }
}