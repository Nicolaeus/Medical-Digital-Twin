using MDT.Domain.Entities;

namespace MDT.Modules.Imaging.Interfaces;

public interface IDicomImportService
{
    Task<ImagingStudy> ImportStudyAsync(string dicomFolder);
}