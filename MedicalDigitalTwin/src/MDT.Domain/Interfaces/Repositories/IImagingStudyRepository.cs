using MDT.Domain.Entities;

namespace MDT.Domain.Interfaces.Repositories;

public interface IImagingStudyRepository
{
    Task<ImagingStudy?> GetByIdAsync(Guid id);

    Task<ImagingStudy?> GetByStudyUidAsync(
        string studyUid);

    Task<List<ImagingStudy>> GetPatientStudiesAsync(
        Guid patientId);

    Task AddAsync(ImagingStudy study);

    Task UpdateAsync(ImagingStudy study);
}