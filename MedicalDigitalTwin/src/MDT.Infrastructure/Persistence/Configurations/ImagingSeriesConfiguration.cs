using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using MDT.Domain.Entities;

namespace MDT.Infrastructure.Persistence.Configurations;

public class ImagingSeriesConfiguration :
    IEntityTypeConfiguration<ImagingSeries>
{
    public void Configure(
        EntityTypeBuilder<ImagingSeries> builder)
    {
        builder.ToTable("ImagingSeries");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.SeriesInstanceUid)
            .HasMaxLength(256);

        builder.Property(x => x.SeriesPath)
            .HasMaxLength(1000);
    }
}