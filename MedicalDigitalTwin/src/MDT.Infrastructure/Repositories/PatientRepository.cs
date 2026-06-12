using Microsoft.EntityFrameworkCore;

using MDT.Domain.Entities;
using MDT.Domain.Interfaces.Repositories;
using MDT.Infrastructure.Persistence;

namespace MDT.Infrastructure.Repositories;

public class PatientRepository
    : IPatientRepository
{
    private readonly MdtDbContext _context;

    public PatientRepository(
        MdtDbContext context)
    {
        _context = context;
    }

    public async Task<Patient?> GetByIdAsync(
        Guid id)
    {
        return await _context.Patients
            .FirstOrDefaultAsync(
                x => x.Id == id);
    }

    public async Task<Patient?> GetByExternalIdAsync(
        string externalId)
    {
        return await _context.Patients
            .FirstOrDefaultAsync(
                x => x.ExternalId == externalId);
    }

    public async Task AddAsync(
        Patient patient)
    {
        await _context.Patients.AddAsync(
            patient);

        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(
        Patient patient)
    {
        _context.Patients.Update(patient);

        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(
        Guid id)
    {
        var patient =
            await GetByIdAsync(id);

        if (patient is null)
            return;

        _context.Patients.Remove(patient);

        await _context.SaveChangesAsync();
    }
}