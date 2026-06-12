using MDT.Domain.Entities;

namespace MDT.Modules.Imaging.Interfaces;

public interface ISegmentationService
{
    Task<string> SegmentStudyAsync(
        ImagingStudy study);
}