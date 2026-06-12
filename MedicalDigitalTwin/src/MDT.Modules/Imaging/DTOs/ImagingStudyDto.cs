namespace MDT.Modules.Imaging.DTOs;

public class ImagingStudyDto
{
    public Guid Id { get; set; }

    public string StudyUid { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Modality { get; set; } = string.Empty;

    public DateTime StudyDate { get; set; }

    public int SeriesCount { get; set; }
}