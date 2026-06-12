using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using MDT.Domain.Entities;

namespace MDT.Infrastructure.Persistence.Configurations;

public class FeatureConfiguration :
    IEntityTypeConfiguration<Feature>
{
    public void Configure(
        EntityTypeBuilder<Feature> builder)
    {
        builder.ToTable("Features");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.FeatureCode)
            .HasMaxLength(100);

        builder.Property(x => x.FeatureName)
            .HasMaxLength(200);

        builder.Property(x => x.Unit)
            .HasMaxLength(50);
    }
}