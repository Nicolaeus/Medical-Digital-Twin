using MDT.Domain.Entities;

namespace MDT.Modules.Imaging.Interfaces;

public interface IImagingStorageService
{
    Task<string> StoreStudyAsync(
        ImagingStudy study,
        string sourceFolder);
}