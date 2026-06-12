using MDT.Domain.Entities;
using MDT.Modules.Imaging.Interfaces;

namespace MDT.Modules.Imaging.Services;

public class ImagingStorageService
    : IImagingStorageService
{
    public async Task<string> StoreStudyAsync(
        ImagingStudy study,
        string sourceFolder)
    {
        var root =
            Path.Combine(
                "data",
                "imaging",
                study.StudyInstanceUid);

        if (!Directory.Exists(root))
        {
            Directory.CreateDirectory(root);
        }

        foreach (var file in Directory.GetFiles(
                     sourceFolder,
                     "*.*",
                     SearchOption.AllDirectories))
        {
            var target =
                Path.Combine(
                    root,
                    Path.GetFileName(file));

            File.Copy(
                file,
                target,
                true);
        }

        await Task.CompletedTask;

        return root;
    }
}