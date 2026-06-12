using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using MDT.Domain.Entities;

namespace MDT.Infrastructure.Persistence.Configurations;

public class OrganMeasurementConfiguration :
    IEntityTypeConfiguration<OrganMeasurement>
{
    public void Configure(
        EntityTypeBuilder<OrganMeasurement> builder)
    {
        builder.ToTable("OrganMeasurements");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.OrganCode)
            .HasMaxLength(100);

        builder.Property(x => x.OrganName)
            .HasMaxLength(100);
    }
}