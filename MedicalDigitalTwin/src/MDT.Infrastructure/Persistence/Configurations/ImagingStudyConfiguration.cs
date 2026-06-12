using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using MDT.Domain.Entities;

namespace MDT.Infrastructure.Persistence.Configurations;

public class ImagingStudyConfiguration :
    IEntityTypeConfiguration<ImagingStudy>
{
    public void Configure(
        EntityTypeBuilder<ImagingStudy> builder)
    {
        builder.ToTable("ImagingStudies");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.StudyInstanceUid)
            .HasMaxLength(256);

        builder.Property(x => x.Modality)
            .HasMaxLength(20);

        builder.HasMany(x => x.Series)
            .WithOne(x => x.ImagingStudy)
            .HasForeignKey(x => x.ImagingStudyId);
    }
}