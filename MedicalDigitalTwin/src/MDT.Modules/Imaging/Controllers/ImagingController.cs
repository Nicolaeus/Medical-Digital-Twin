using Microsoft.AspNetCore.Mvc;

using MDT.Modules.Imaging.DTOs;
using MDT.Modules.Imaging.Interfaces;

namespace MDT.Modules.Imaging.Controllers;

[ApiController]
[Route("api/imaging")]
public class ImagingController : ControllerBase
{
    private readonly IDicomImportService _dicomImportService;

    public ImagingController(
        IDicomImportService dicomImportService)
    {
        _dicomImportService =
            dicomImportService;
    }

    [HttpPost("import")]
    public async Task<IActionResult> Import(
        ImportDicomRequest request)
    {
        var study =
            await _dicomImportService
                .ImportStudyAsync(
                    request.FolderPath);

        return Ok(
            new ImagingStudyDto
            {
                Id = study.Id,

                StudyUid =
                    study.StudyInstanceUid,

                Description =
                    study.StudyDescription,

                Modality =
                    study.Modality,

                StudyDate =
                    study.StudyDate,

                SeriesCount =
                    study.Series.Count
            });
    }
}