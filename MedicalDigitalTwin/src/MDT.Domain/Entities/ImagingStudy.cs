namespace MDT.Domain.Entities;

public class ImagingStudy
{
    public Guid Id { get; set; }

    public Guid PatientId { get; set; }

    public string StudyInstanceUid { get; set; } = string.Empty;

    public string StudyDescription { get; set; } = string.Empty;

    public string Modality { get; set; } = string.Empty;

    public DateTime StudyDate { get; set; }

    public string BodyPartExamined { get; set; } = string.Empty;

    public string Manufacturer { get; set; } = string.Empty;

    public DateTime ImportedAt { get; set; } = DateTime.UtcNow;

    public Patient? Patient { get; set; }

    public ICollection<ImagingSeries> Series { get; set; }
        = new List<ImagingSeries>();

    public ICollection<OrganMeasurement> OrganMeasurements { get; set; }
        = new List<OrganMeasurement>();
}