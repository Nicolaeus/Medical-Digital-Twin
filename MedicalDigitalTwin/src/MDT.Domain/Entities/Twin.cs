namespace MDT.Domain.Entities;

public class Twin
{
    public Guid Id { get; set; }

    public Guid PatientId { get; set; }

    public string Version { get; set; }
        = "0.1.0";

    public double ConfidenceScore { get; set; }

    public DateTime CreatedAt { get; set; }
        = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; }
        = DateTime.UtcNow;

    public Patient? Patient { get; set; }
}