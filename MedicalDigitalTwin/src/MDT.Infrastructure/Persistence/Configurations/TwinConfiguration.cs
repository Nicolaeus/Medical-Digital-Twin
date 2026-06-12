using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using MDT.Domain.Entities;

namespace MDT.Infrastructure.Persistence.Configurations;

public class TwinConfiguration :
    IEntityTypeConfiguration<Twin>
{
    public void Configure(
        EntityTypeBuilder<Twin> builder)
    {
        builder.ToTable("Twins");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Version)
            .HasMaxLength(50);

        builder.HasOne(x => x.Patient)
            .WithMany(x => x.Twins)
            .HasForeignKey(x => x.PatientId);
    }
}