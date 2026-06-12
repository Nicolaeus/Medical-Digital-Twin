using Microsoft.EntityFrameworkCore;

using MDT.Domain.Entities;
using MDT.Domain.Interfaces.Repositories;
using MDT.Infrastructure.Persistence;

namespace MDT.Infrastructure.Repositories;

public class ImagingStudyRepository
    : IImagingStudyRepository
{
    private readonly MdtDbContext _context;

    public ImagingStudyRepository(
        MdtDbContext context)
    {
        _context = context;
    }

    public async Task<ImagingStudy?> GetByIdAsync(
        Guid id)
    {
        return await _context.ImagingStudies
            .Include(x => x.Series)
            .Include(x => x.OrganMeasurements)
            .FirstOrDefaultAsync(
                x => x.Id == id);
    }

    public async Task<ImagingStudy?> GetByStudyUidAsync(
        string studyUid)
    {
        return await _context.ImagingStudies
            .FirstOrDefaultAsync(
                x => x.StudyInstanceUid == studyUid);
    }

    public async Task<List<ImagingStudy>>
        GetPatientStudiesAsync(
            Guid patientId)
    {
        return await _context.ImagingStudies
            .Where(x => x.PatientId == patientId)
            .OrderByDescending(
                x => x.StudyDate)
            .ToListAsync();
    }

    public async Task AddAsync(
        ImagingStudy study)
    {
        await _context.ImagingStudies
            .AddAsync(study);

        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(
        ImagingStudy study)
    {
        _context.ImagingStudies
            .Update(study);

        await _context.SaveChangesAsync();
    }
}