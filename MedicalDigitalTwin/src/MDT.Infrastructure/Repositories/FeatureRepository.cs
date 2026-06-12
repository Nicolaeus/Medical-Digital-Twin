using Microsoft.EntityFrameworkCore;

using MDT.Domain.Entities;
using MDT.Domain.Interfaces.Repositories;
using MDT.Infrastructure.Persistence;

namespace MDT.Infrastructure.Repositories;

public class FeatureRepository
    : IFeatureRepository
{
    private readonly MdtDbContext _context;

    public FeatureRepository(
        MdtDbContext context)
    {
        _context = context;
    }

    public async Task<Feature?> GetByIdAsync(
        Guid id)
    {
        return await _context.Features
            .Include(x => x.History)
            .FirstOrDefaultAsync(
                x => x.Id == id);
    }

    public async Task<List<Feature>>
        GetPatientFeaturesAsync(
            Guid patientId)
    {
        return await _context.Features
            .Where(x => x.PatientId == patientId)
            .ToListAsync();
    }

    public async Task AddAsync(
        Feature feature)
    {
        await _context.Features
            .AddAsync(feature);

        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(
        Feature feature)
    {
        _context.Features.Update(feature);

        await _context.SaveChangesAsync();
    }
}