using MDT.Modules.Imaging.Interfaces;
using MDT.Modules.Imaging.Services;
using Microsoft.EntityFrameworkCore;
using MDT.Infrastructure.Persistence;
using MDT.Domain.Interfaces.Repositories;
using MDT.Infrastructure.Repositories;


builder.Services.AddDbContext<MdtDbContext>(
    options =>
        options.UseSqlite(
            builder.Configuration.GetConnectionString(
                "DefaultConnection")));
				
builder.Services.AddScoped<
    IDicomImportService,
    DicomImportService>();
	
builder.Services.AddScoped<
    IPatientRepository,
    PatientRepository>();

builder.Services.AddScoped<
    IImagingStudyRepository,
    ImagingStudyRepository>();

builder.Services.AddScoped<
    IFeatureRepository,
    FeatureRepository>();
	
	builder.Services.AddScoped<
    IImagingStorageService,
    ImagingStorageService>();

builder.Services.AddScoped<
    ISegmentationService,
    SegmentationService>();

builder.Services.AddScoped<
    IFeatureExtractionService,
    FeatureExtractionService>();