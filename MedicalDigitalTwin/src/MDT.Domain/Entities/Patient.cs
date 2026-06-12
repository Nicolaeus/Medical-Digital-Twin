namespace MDT.Domain.Entities;

public class Patient
{
    public Guid Id { get; set; }

    public string ExternalId { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public DateTime? BirthDate { get; set; }

    public string Sex { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ImagingStudy> ImagingStudies { get; set; }
        = new List<ImagingStudy>();

    public ICollection<Feature> Features { get; set; }
        = new List<Feature>();
		
	public ICollection<Twin> Twins { get; set; }
    = new List<Twin>();
}