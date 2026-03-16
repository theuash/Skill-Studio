const mongoose = require('mongoose');
const Sector = require('../models/Sector');
const Company = require('../models/Company');
const { asyncHandler } = require('../middleware/errorHandler');

const escapeRegExp = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * GET /api/sectors
 * Return all sectors with company count
 */
const getAllSectors = asyncHandler(async (req, res) => {
  const sectors = await Sector.find().sort({ name: 1 }).lean();

  // Get company counts per sector in one query
  const companyCounts = await Company.aggregate([
    { $group: { _id: '$sector', count: { $sum: 1 } } },
  ]);
  const countMap = {};
  companyCounts.forEach((c) => { countMap[c._id] = c.count; });

  const sectorsWithCounts = sectors.map((s) => ({
    ...s,
    companyCount: countMap[s.id] || 0,
  }));

  return res.status(200).json({
    success: true,
    message: 'Sectors fetched successfully',
    data: { sectors: sectorsWithCounts },
  });
});

/**
 * GET /api/sectors/:sectorId/companies
 * Return all companies in a sector
 */
const getCompaniesBySector = asyncHandler(async (req, res) => {
  const { sectorId } = req.params;

  const sector = await Sector.findOne({ id: sectorId.toLowerCase() }).lean();
  if (!sector) {
    return res.status(404).json({
      success: false,
      message: `Sector '${sectorId}' not found.`,
    });
  }

  const companies = await Company.find({ sector: sectorId.toLowerCase() })
    .select('companyId name domain logo sector tagline jobRoles requiredSkills techStack size interviewDifficulty')
    .sort({ name: 1 })
    .lean();

  return res.status(200).json({
    success: true,
    message: `Companies in ${sector.name} fetched successfully`,
    data: {
      sector,
      companies,
      total: companies.length,
    },
  });
});

/**
 * GET /api/sectors/companies/:companyId
 * Return full company details
 */
const getCompanyById = asyncHandler(async (req, res) => {
  const { companyId } = req.params;
  const normalized = String(companyId).toLowerCase();

  const query = [
    { companyId: normalized },
    { companyId: { $regex: `^${escapeRegExp(normalized)}` } },
  ];

  if (mongoose.Types.ObjectId.isValid(companyId)) {
    query.push({ _id: companyId });
  }

  const company = await Company.findOne({ $or: query }).lean();

  if (!company) {
    return res.status(404).json({
      success: false,
      message: `Company '${companyId}' not found.`,
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Company details fetched successfully',
    data: { company },
  });
});

/**
 * GET /api/sectors/search?q=query
 * Search companies across all sectors
 */
const searchCompanies = asyncHandler(async (req, res) => {
  const { q, sector, limit = 20 } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Search query must be at least 2 characters.',
    });
  }

  const query = {
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { tagline: { $regex: q, $options: 'i' } },
      { 'requiredSkills.skill': { $regex: q, $options: 'i' } },
    ],
  };

  if (sector) {
    query.sector = sector.toLowerCase();
  }

  const companies = await Company.find(query)
    .select('companyId name domain logo sector tagline jobRoles requiredSkills')
    .limit(Math.min(Number(limit), 50))
    .lean();

  return res.status(200).json({
    success: true,
    message: 'Search results fetched',
    data: { companies, total: companies.length, query: q },
  });
});

module.exports = {
  getAllSectors,
  getCompaniesBySector,
  getCompanyById,
  searchCompanies,
};
