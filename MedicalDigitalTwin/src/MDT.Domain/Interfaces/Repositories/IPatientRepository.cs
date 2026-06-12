using MDT.Domain.Entities;

namespace MDT.Domain.Interfaces.Repositories;

public interface IPatientRepository
{
    Task<Patient?> GetByIdAsync(Guid id);

    Task<Patient?> GetByExternalIdAsync(
        string externalId);

    Task AddAsync(Patient patient);

    Task UpdateAsync(Patient patient);

    Task DeleteAsync(Guid id);
}