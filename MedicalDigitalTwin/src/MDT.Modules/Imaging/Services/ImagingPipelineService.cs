using MDT.Domain.Interfaces.Repositories;
using MDT.Modules.Imaging.Interfaces;

namespace MDT.Modules.Imaging.Services;

public class ImagingPipelineService
{
    private readonly IDicomImportService _dicomImportService;

    private readonly IImagingStorageService _storageService;

    private readonly ISegmentationService _segmentationService;

    private readonly IFeatureExtractionService _featureExtractionService;

    private readonly IFeatureRepository _featureRepository;

    public ImagingPipelineService(
        IDicomImportService dicomImportService,
        IImagingStorageService storageService,
        ISegmentationService segmentationService,
        IFeatureExtractionService featureExtractionService,
        IFeatureRepository featureRepository)
    {
        _dicomImportService = dicomImportService;
        _storageService = storageService;
        _segmentationService = segmentationService;
        _featureExtractionService = featureExtractionService;
        _featureRepository = featureRepository;
    }

    public async Task ExecuteAsync(
        string dicomFolder)
    {
        var study =
            await _dicomImportService
                .ImportStudyAsync(
                    dicomFolder);

        await _storageService
            .StoreStudyAsync(
                study,
                dicomFolder);

        var segmentationFolder =
            await _segmentationService
                .SegmentStudyAsync(
                    study);

        var features =
            await _featureExtractionService
                .ExtractFeaturesAsync(
                    study,
                    segmentationFolder);

        foreach (var feature in features)
        {
            await _featureRepository
                .AddAsync(feature);
        }
    }
}