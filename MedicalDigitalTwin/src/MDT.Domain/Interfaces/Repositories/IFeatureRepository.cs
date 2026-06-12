using MDT.Domain.Entities;

namespace MDT.Domain.Interfaces.Repositories;

public interface IFeatureRepository
{
    Task<Feature?> GetByIdAsync(Guid id);

    Task<List<Feature>> GetPatientFeaturesAsync(
        Guid patientId);

    Task AddAsync(Feature feature);

    Task UpdateAsync(Feature feature);
}