using System.Diagnostics;

using MDT.Domain.Entities;
using MDT.Modules.Imaging.Interfaces;

namespace MDT.Modules.Imaging.Services;

public class SegmentationService
    : ISegmentationService
{
    public async Task<string> SegmentStudyAsync(
        ImagingStudy study)
    {
        var studyFolder =
            Path.Combine(
                "data",
                "imaging",
                study.StudyInstanceUid);

        var outputFolder =
            Path.Combine(
                "data",
                "imaging",
                study.StudyInstanceUid,
                "segmentation");

        Directory.CreateDirectory(
            outputFolder);

        var process =
            new Process();

        process.StartInfo.FileName =
            "python";

        process.StartInfo.Arguments =
            $"python/imaging/segmentation/run_segmentation.py " +
            $"\"{studyFolder}\" " +
            $"\"{outputFolder}\"";

        process.StartInfo.UseShellExecute =
            false;

        process.StartInfo.RedirectStandardOutput =
            true;

        process.Start();

        await process.WaitForExitAsync();

        return outputFolder;
    }
}