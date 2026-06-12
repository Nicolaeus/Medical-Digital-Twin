using Microsoft.EntityFrameworkCore;

using MDT.Domain.Entities;

namespace MDT.Infrastructure.Persistence;

public class MdtDbContext : DbContext
{
    public MdtDbContext(
        DbContextOptions<MdtDbContext> options)
        : base(options)
    {
    }

    public DbSet<Patient> Patients => Set<Patient>();

    public DbSet<ImagingStudy> ImagingStudies => Set<ImagingStudy>();

    public DbSet<ImagingSeries> ImagingSeries => Set<ImagingSeries>();

    public DbSet<Feature> Features => Set<Feature>();

    public DbSet<FeatureHistory> FeatureHistories => Set<FeatureHistory>();

    public DbSet<OrganMeasurement> OrganMeasurements => Set<OrganMeasurement>();
	
	public DbSet<Twin> Twins => Set<Twin>();

    protected override void OnModelCreating(
        ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(MdtDbContext).Assembly);
    }
}