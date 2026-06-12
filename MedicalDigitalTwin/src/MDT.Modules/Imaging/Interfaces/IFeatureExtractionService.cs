using MDT.Domain.Entities;

namespace MDT.Modules.Imaging.Interfaces;

public interface IFeatureExtractionService
{
    Task<List<Feature>> ExtractFeaturesAsync(
        ImagingStudy study,
        string segmentationFolder);
}